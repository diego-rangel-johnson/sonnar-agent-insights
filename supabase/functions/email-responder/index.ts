import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    switch (action) {
      case 'send-auto':
        return await handleAutoSend(req)
      case 'approve':
        return await handleApproval(req)
      case 'reject':
        return await handleRejection(req)
      case 'modify':
        return await handleModification(req)
      case 'pending':
        return await getPendingResponses(req)
      default:
        return new Response('Invalid action', { status: 400, headers: corsHeaders })
    }

  } catch (error) {
    console.error('❌ Erro no email responder:', error)
    return new Response(JSON.stringify({
      error: 'Erro interno',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleAutoSend(req: Request) {
  console.log('🤖 Processando envio automático')

  // Buscar respostas aprovadas automaticamente que ainda não foram enviadas
  const { data: autoApprovedResponses } = await supabase
    .from('response_suggestions')
    .select(`
      *,
      email_conversations(*),
      emails(*, email_accounts(*))
    `)
    .eq('approval_status', 'auto_approved')
    .is('sent_at', null)

  if (!autoApprovedResponses?.length) {
    return new Response(JSON.stringify({
      message: 'Nenhuma resposta automática pendente',
      count: 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const results = []

  for (const response of autoApprovedResponses) {
    try {
      const sent = await sendEmailResponse(response)
      results.push({ id: response.id, sent: sent.success })
      
      if (sent.success) {
        await logActivity(response.emails.id, 'auto_sent', {
          suggestion_id: response.id,
          gmail_message_id: sent.messageId
        })
      }
    } catch (error) {
      console.error('❌ Erro ao enviar auto-resposta:', error)
      results.push({ id: response.id, sent: false, error: error.message })
    }
  }

  return new Response(JSON.stringify({
    message: 'Processamento de auto-envios concluído',
    results
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleApproval(req: Request) {
  const { suggestionId, approvedBy } = await req.json()

  console.log('✅ Aprovando resposta:', suggestionId)

  // Buscar a sugestão
  const { data: suggestion } = await supabase
    .from('response_suggestions')
    .select(`
      *,
      email_conversations(*),
      emails(*, email_accounts(*))
    `)
    .eq('id', suggestionId)
    .single()

  if (!suggestion) {
    return new Response('Sugestão não encontrada', { status: 404, headers: corsHeaders })
  }

  // Marcar como aprovada
  await supabase
    .from('response_suggestions')
    .update({
      approval_status: 'approved',
      approved_by: approvedBy,
      approved_at: new Date().toISOString()
    })
    .eq('id', suggestionId)

  // Enviar email
  const sent = await sendEmailResponse(suggestion)

  if (sent.success) {
    await logActivity(suggestion.emails.id, 'approved_sent', {
      suggestion_id: suggestionId,
      approved_by: approvedBy,
      gmail_message_id: sent.messageId
    })
  }

  return new Response(JSON.stringify({
    success: sent.success,
    message: sent.success ? 'Email enviado com sucesso' : 'Falha no envio',
    messageId: sent.messageId
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleRejection(req: Request) {
  const { suggestionId, rejectedBy, reason } = await req.json()

  console.log('❌ Rejeitando resposta:', suggestionId)

  await supabase
    .from('response_suggestions')
    .update({
      approval_status: 'rejected',
      approved_by: rejectedBy,
      approved_at: new Date().toISOString()
    })
    .eq('id', suggestionId)

  await logActivity(null, 'suggestion_rejected', {
    suggestion_id: suggestionId,
    rejected_by: rejectedBy,
    reason
  })

  return new Response(JSON.stringify({
    success: true,
    message: 'Resposta rejeitada'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleModification(req: Request) {
  const { suggestionId, modifiedResponse, modifiedBy } = await req.json()

  console.log('✏️ Modificando resposta:', suggestionId)

  // Buscar a sugestão
  const { data: suggestion } = await supabase
    .from('response_suggestions')
    .select(`
      *,
      email_conversations(*),
      emails(*, email_accounts(*))
    `)
    .eq('id', suggestionId)
    .single()

  if (!suggestion) {
    return new Response('Sugestão não encontrada', { status: 404, headers: corsHeaders })
  }

  // Atualizar com resposta modificada
  await supabase
    .from('response_suggestions')
    .update({
      approval_status: 'modified',
      approved_by: modifiedBy,
      approved_at: new Date().toISOString(),
      final_response: modifiedResponse
    })
    .eq('id', suggestionId)

  // Enviar a versão modificada
  const modifiedSuggestion = { ...suggestion, suggested_response: modifiedResponse }
  const sent = await sendEmailResponse(modifiedSuggestion)

  if (sent.success) {
    await logActivity(suggestion.emails.id, 'modified_sent', {
      suggestion_id: suggestionId,
      modified_by: modifiedBy,
      gmail_message_id: sent.messageId
    })
  }

  return new Response(JSON.stringify({
    success: sent.success,
    message: sent.success ? 'Email modificado enviado' : 'Falha no envio',
    messageId: sent.messageId
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getPendingResponses(req: Request) {
  console.log('📋 Buscando respostas pendentes')

  const { data: pendingResponses } = await supabase
    .from('response_suggestions')
    .select(`
      *,
      email_conversations(*),
      emails(
        *,
        email_accounts(email_address, display_name)
      ),
      email_analysis(intent, sentiment, priority)
    `)
    .eq('approval_status', 'pending')
    .order('created_at', { ascending: false })
    .limit(50)

  return new Response(JSON.stringify({
    success: true,
    responses: pendingResponses || [],
    count: pendingResponses?.length || 0
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function sendEmailResponse(suggestion: any) {
  console.log('📤 Enviando email para:', suggestion.emails.from_email)

  try {
    // Obter token de acesso válido
    const account = suggestion.emails.email_accounts
    const accessToken = await getValidAccessToken(account)

    // Preparar email de resposta
    const emailResponse = {
      threadId: suggestion.emails.thread_id,
      to: suggestion.emails.from_email,
      subject: suggestion.emails.subject.startsWith('Re:') 
        ? suggestion.emails.subject 
        : `Re: ${suggestion.emails.subject}`,
      body: suggestion.final_response || suggestion.suggested_response,
      inReplyTo: suggestion.emails.gmail_message_id
    }

    // Construir mensagem em formato MIME
    const mimeMessage = buildMimeMessage(emailResponse, account)

    // Enviar via Gmail API
    const sendResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          threadId: emailResponse.threadId,
          raw: btoa(mimeMessage).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
        })
      }
    )

    if (!sendResponse.ok) {
      const error = await sendResponse.text()
      throw new Error(`Gmail API error: ${error}`)
    }

    const sentMessage = await sendResponse.json()

    // Atualizar sugestão com data de envio
    await supabase
      .from('response_suggestions')
      .update({ sent_at: new Date().toISOString() })
      .eq('id', suggestion.id)

    console.log('✅ Email enviado:', sentMessage.id)
    
    return {
      success: true,
      messageId: sentMessage.id
    }

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

function buildMimeMessage(email: any, account: any) {
  const boundary = `boundary_${Date.now()}`
  
  let mime = [
    `From: ${account.display_name} <${account.email_address}>`,
    `To: ${email.to}`,
    `Subject: ${email.subject}`,
    `In-Reply-To: ${email.inReplyTo}`,
    `References: ${email.inReplyTo}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    email.body,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    `<div style="font-family: Arial, sans-serif;">`,
    email.body.replace(/\n/g, '<br>'),
    `</div>`,
    ``,
    `--${boundary}--`
  ].join('\r\n')

  return mime
}

async function getValidAccessToken(account: any): Promise<string> {
  // Implementar refresh do token se necessário
  // Por simplicidade, assumindo que o token está válido
  return account.access_token
}

async function logActivity(emailId: string | null, action: string, details: any) {
  await supabase
    .from('email_activity_logs')
    .insert({
      email_id: emailId,
      action,
      details,
      performed_by: 'system'
    })
} 