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
    const { to, subject, message, agent_used, sender_name } = await req.json()

    if (!to || !subject || !message) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Campos obrigatórios: to, subject, message'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('📤 Enviando email outbound para:', to)

    // 1. Buscar conta de email ativa para envio
    const { data: emailAccount, error: accountError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('active', true)
      .single()

    if (accountError || !emailAccount) {
      throw new Error('Nenhuma conta de email ativa encontrada')
    }

    // 2. Obter access token válido
    const accessToken = await getValidAccessToken(emailAccount)

    // 3. Construir email em formato MIME
    const mimeMessage = buildMimeMessage({
      from: emailAccount.display_name || emailAccount.email_address,
      fromEmail: emailAccount.email_address,
      to,
      subject,
      body: message
    })

    // 4. Enviar via Gmail API
    const sendResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          raw: btoa(mimeMessage).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
        })
      }
    )

    if (!sendResponse.ok) {
      const error = await sendResponse.text()
      throw new Error(`Gmail API error: ${error}`)
    }

    const sentMessage = await sendResponse.json()

    // 5. Registrar envio no banco
    const { data: savedEmail } = await supabase
      .from('outbound_emails')
      .insert({
        account_id: emailAccount.id,
        to_email: to,
        subject,
        body_text: message,
        gmail_message_id: sentMessage.id,
        agent_used,
        sender_name: sender_name || 'Sistema Sonnar',
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .select()
      .single()

    // 6. Log de atividade
    await supabase
      .from('email_activity_logs')
      .insert({
        email_id: savedEmail.id,
        action: 'outbound_sent',
        details: {
          to,
          subject,
          agent_used,
          gmail_message_id: sentMessage.id
        }
      })

    console.log('✅ Email outbound enviado:', sentMessage.id)

    return new Response(JSON.stringify({
      success: true,
      message: 'Email enviado com sucesso',
      messageId: sentMessage.id,
      emailId: savedEmail.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Erro ao enviar email',
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function getValidAccessToken(account: any): Promise<string> {
  // Se o token ainda é válido (com margem de 5 minutos)
  const now = new Date()
  const expiry = new Date(account.token_expiry)
  const margin = 5 * 60 * 1000 // 5 minutos em ms

  if (expiry.getTime() - now.getTime() > margin) {
    return account.access_token
  }

  console.log('🔄 Renovando access token...')

  // Renovar token usando refresh_token
  const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: Deno.env.get('GMAIL_CLIENT_ID')!,
      client_secret: Deno.env.get('GMAIL_CLIENT_SECRET')!,
      refresh_token: account.refresh_token,
      grant_type: 'refresh_token'
    })
  })

  if (!refreshResponse.ok) {
    const error = await refreshResponse.text()
    throw new Error(`Token refresh failed: ${error}`)
  }

  const tokens = await refreshResponse.json()

  // Atualizar token no banco
  const newExpiry = new Date(Date.now() + (tokens.expires_in * 1000))
  
  await supabase
    .from('email_accounts')
    .update({
      access_token: tokens.access_token,
      token_expiry: newExpiry.toISOString()
    })
    .eq('id', account.id)

  console.log('✅ Token renovado com sucesso')
  return tokens.access_token
}

function buildMimeMessage(email: any): string {
  const boundary = `boundary_${Date.now()}`
  
  const mime = [
    `From: ${email.from} <${email.fromEmail}>`,
    `To: ${email.to}`,
    `Subject: ${email.subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${Date.now()}.sonnar@gmail.com>`,
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
    `<div style="font-family: Arial, sans-serif; line-height: 1.6;">`,
    email.body.replace(/\n/g, '<br>'),
    `</div>`,
    ``,
    `<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">`,
    `<p>Enviado pelo Sistema Sonnar - Forças Tarefa de IA</p>`,
    `</div>`,
    ``,
    `--${boundary}--`
  ].join('\r\n')

  return mime
} 