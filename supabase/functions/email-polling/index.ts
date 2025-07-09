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
    console.log('🔄 Iniciando polling de emails...')

    // Buscar contas ativas
    const { data: accounts, error: accountsError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('active', true)

    if (accountsError) {
      throw accountsError
    }

    if (!accounts || accounts.length === 0) {
      return new Response(JSON.stringify({
        message: 'Nenhuma conta ativa encontrada',
        processed: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    let totalProcessed = 0
    const results = []

    // Processar cada conta
    for (const account of accounts) {
      try {
        console.log(`📧 Processando conta: ${account.email_address}`)
        
        const processed = await processAccountEmails(account)
        totalProcessed += processed
        
        results.push({
          email: account.email_address,
          processed,
          status: 'success'
        })
      } catch (error) {
        console.error(`❌ Erro na conta ${account.email_address}:`, error)
        results.push({
          email: account.email_address,
          processed: 0,
          status: 'error',
          error: error.message
        })
      }
    }

    return new Response(JSON.stringify({
      message: `Polling concluído. ${totalProcessed} emails processados.`,
      totalProcessed,
      accounts: results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Erro no polling:', error)
    return new Response(JSON.stringify({
      error: 'Erro no polling de emails',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function processAccountEmails(account: any): Promise<number> {
  // Obter access token válido
  const accessToken = await getValidAccessToken(account)
  
  // Buscar emails mais recentes
  const query = 'in:inbox is:unread'
  const maxResults = 10 // Processar até 10 emails por vez
  
  const searchResponse = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!searchResponse.ok) {
    throw new Error(`Gmail API search error: ${searchResponse.statusText}`)
  }

  const searchData = await searchResponse.json()
  
  if (!searchData.messages || searchData.messages.length === 0) {
    console.log(`📭 Nenhum email novo para ${account.email_address}`)
    return 0
  }

  let processed = 0

  // Processar cada email
  for (const message of searchData.messages) {
    try {
      const wasProcessed = await processMessage(account, message, accessToken)
      if (wasProcessed) {
        processed++
      }
    } catch (error) {
      console.error(`❌ Erro ao processar mensagem ${message.id}:`, error)
    }
  }

  // Atualizar última verificação
  await supabase
    .from('email_accounts')
    .update({
      last_sync: new Date().toISOString()
    })
    .eq('id', account.id)

  return processed
}

async function processMessage(account: any, message: any, accessToken: string): Promise<boolean> {
  try {
    // Verificar se já foi processada
    const { data: existing } = await supabase
      .from('emails')
      .select('id')
      .eq('gmail_message_id', message.id)
      .single()

    if (existing) {
      console.log(`📮 Email ${message.id} já processado`)
      return false
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

    if (!messageResponse.ok) {
      throw new Error(`Gmail API message error: ${messageResponse.statusText}`)
    }

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

    console.log(`✅ Email ${message.id} salvo como ${savedEmail.id}`)

    // Disparar processamento assíncrono
    await triggerEmailProcessing(savedEmail.id)

    return true

  } catch (error) {
    console.error(`❌ Erro ao processar mensagem ${message.id}:`, error)
    return false
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
    account_id: accountId,
    gmail_message_id: messageData.id,
    thread_id: messageData.threadId,
    from_email: getHeader('From'),
    from_name: getHeader('From')?.split('<')[0]?.trim() || '',
    to_email: getHeader('To'),
    subject: getHeader('Subject') || '',
    body_text: bodyText,
    body_html: bodyHtml,
    received_at: new Date(parseInt(messageData.internalDate)).toISOString(),
    labels: messageData.labelIds || [],
    status: 'received'
  }
}

async function getValidAccessToken(account: any): Promise<string> {
  // Implementar renovação de token se necessário
  // Por simplicidade, assumindo que o token está válido
  return account.access_token
}

async function triggerEmailProcessing(emailId: string) {
  try {
    // Chamar a Edge Function de processamento
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/email-processor`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({ email_id: emailId })
      }
    )

    if (!response.ok) {
      console.error('❌ Erro ao disparar processamento:', await response.text())
    }
  } catch (error) {
    console.error('❌ Erro ao disparar processamento:', error)
  }
} 