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
    const { email_address, access_token } = await req.json()

    if (!email_address || !access_token) {
      return new Response('Missing email_address or access_token', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    console.log('🔧 Configurando watch para:', email_address)

    // Configurar watch no Gmail
    const watchResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/watch',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topicName: 'projects/YOUR_PROJECT_ID/topics/gmail-webhook-topic',
          labelIds: ['INBOX'], // Monitorar apenas INBOX
          labelFilterAction: 'include'
        })
      }
    )

    if (!watchResponse.ok) {
      const error = await watchResponse.text()
      throw new Error(`Gmail API error: ${error}`)
    }

    const watchData = await watchResponse.json()
    
    console.log('✅ Watch configurado:', watchData)

    // Atualizar conta no banco com os dados do watch
    const { error: updateError } = await supabase
      .from('email_accounts')
      .update({
        gmail_watch_expiry: new Date(parseInt(watchData.expiration)).toISOString(),
        gmail_history_id: watchData.historyId,
        last_sync: new Date().toISOString()
      })
      .eq('email_address', email_address)

    if (updateError) {
      throw updateError
    }

    return new Response(JSON.stringify({
      success: true,
      watchData,
      message: 'Gmail watch configurado com sucesso'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Erro ao configurar watch:', error)
    return new Response(JSON.stringify({
      error: 'Erro ao configurar watch',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}) 