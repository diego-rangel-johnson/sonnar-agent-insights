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

interface GmailWebhookPayload {
  message: {
    data: string
    messageId: string
    publishTime: string
  }
  subscription: string
}

interface PubSubMessage {
  emailAddress: string
  historyId: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('📧 Gmail webhook recebido')
    
    // Verificar se é um webhook do Gmail
    const payload: GmailWebhookPayload = await req.json()
    
    if (!payload.message?.data) {
      return new Response('Invalid payload', { status: 400, headers: corsHeaders })
    }

    // Decodificar a mensagem base64
    const decodedData = atob(payload.message.data)
    const pubsubMessage: PubSubMessage = JSON.parse(decodedData)
    
    console.log('📨 Nova notificação:', pubsubMessage)

    // Buscar account info
    const { data: account } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('email_address', pubsubMessage.emailAddress)
      .eq('active', true)
      .single()

    if (!account) {
      console.error('❌ Conta não encontrada:', pubsubMessage.emailAddress)
      return new Response('Account not found', { status: 404, headers: corsHeaders })
    }

    // Processar novos emails
    await processNewEmails(account, pubsubMessage.historyId)

    return new Response(JSON.stringify({
      success: true,
      message: 'Webhook processado com sucesso'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Erro no webhook Gmail:', error)
    return new Response(JSON.stringify({
      error: 'Erro interno',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function processNewEmails(account: any, historyId: string) {
  console.log('🔄 Processando emails para:', account.email_address)

  try {
    // Obter access token válido
    const accessToken = await getValidAccessToken(account)
    
    // Buscar historico do Gmail
    const historyResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=${historyId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!historyResponse.ok) {
      throw new Error(`Gmail API error: ${historyResponse.statusText}`)
    }

    const historyData = await historyResponse.json()
    
    if (!historyData.history) {
      console.log('📭 Nenhum email novo encontrado')
      return
    }

    // Processar cada mensagem nova
    for (const historyRecord of historyData.history) {
      if (historyRecord.messagesAdded) {
        for (const messageAdded of historyRecord.messagesAdded) {
          await processMessage(account, messageAdded.message, accessToken)
        }
      }
    }

  } catch (error) {
    console.error('❌ Erro ao processar emails:', error)
    throw error
  }
}

async function processMessage(account: any, message: any, accessToken: string) {
  try {
    console.log('📩 Processando mensagem:', message.id)

    // Verificar se já foi processada
    const { data: existing } = await supabase
      .from('emails')
      .select('id')
      .eq('gmail_message_id', message.id)
      .single()

    if (existing) {
      console.log('📮 Email já processado:', message.id)
      return
    }

    // Buscar detalhes completos da mensagem
    const messageResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const messageData = await messageResponse.json()
    
    // Extrair dados do email
    const emailData = extractEmailData(messageData, account.id)
    
    // Salvar no banco
    const { data: savedEmail, error } = await supabase
      .from('emails')
      .insert(emailData)
      .select()
      .single()

    if (error) {
      throw error
    }

    console.log('✅ Email salvo:', savedEmail.id)

    // Disparar processamento assíncrono
    await triggerEmailProcessing(savedEmail.id)

  } catch (error) {
    console.error('❌ Erro ao processar mensagem:', error)
  }
}

function extractEmailData(messageData: any, accountId: string) {
  const headers = messageData.payload.headers
  const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value

  // Extrair corpo do email
  let bodyText = ''
  let bodyHtml = ''
  
  if (messageData.payload.body?.data) {
    bodyText = atob(messageData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'))
  } else if (messageData.payload.parts) {
    for (const part of messageData.payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        bodyText = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'))
      } else if (part.mimeType === 'text/html' && part.body?.data) {
        bodyHtml = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'))
      }
    }
  }

  return {
    gmail_message_id: messageData.id,
    thread_id: messageData.threadId,
    account_id: accountId,
    from_email: getHeader('From')?.match(/<(.+)>/)?.[1] || getHeader('From'),
    from_name: getHeader('From')?.replace(/<.+>/, '').trim(),
    to_email: getHeader('To')?.match(/<(.+)>/)?.[1] || getHeader('To'),
    subject: getHeader('Subject') || '',
    body_text: bodyText,
    body_html: bodyHtml,
    labels: messageData.labelIds || [],
    received_at: new Date(parseInt(messageData.internalDate)).toISOString(),
    status: 'pending'
  }
}

async function getValidAccessToken(account: any): Promise<string> {
  // Implementar refresh do token se necessário
  // Por simplicidade, assumindo que o token está válido
  return account.access_token
}

async function triggerEmailProcessing(emailId: string) {
  console.log('🚀 Disparando processamento para:', emailId)
  
  // Chamar edge function de processamento
  const { error } = await supabase.functions.invoke('email-processor', {
    body: { emailId }
  })

  if (error) {
    console.error('❌ Erro ao disparar processamento:', error)
  }
} 