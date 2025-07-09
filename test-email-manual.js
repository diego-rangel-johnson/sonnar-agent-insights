import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nsbjkxbfkhauitmjnkxh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYmpreGJma2hhdWl0bWpua3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0OTIyNDEsImV4cCI6MjA2NzA2ODI0MX0.ERU7cn4E2Ll6IClG2QjznrUsDQUxndZAbq_pohSdbzk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function sendTestEmail() {
  console.log('🚀 Enviando email de teste...')
  
  try {
    const response = await fetch('https://nsbjkxbfkhauitmjnkxh.supabase.co/functions/v1/email-sender', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        to: 'di_rangel@hotmail.com',
        subject: 'Teste do Sistema Sonnar',
        message: `Olá!

Este é um email de teste do sistema Sonnar Agent Insights.

Se você está recebendo este email, significa que:
✅ O sistema de envio está funcionando
✅ A integração com Gmail API está ativa
✅ O Edge Function email-sender foi deployado com sucesso

Teste realizado em: ${new Date().toLocaleString('pt-BR')}

Atenciosamente,
Sistema Sonnar 🤖`,
        agent_used: 'teste-manual',
        sender_name: 'Sistema Sonnar',
        sender_email: 'diego.johnson@jobbs.com.br',
        context: 'teste-funcionalidade'
      })
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Email enviado com sucesso!')
      console.log('📧 ID da mensagem:', result.messageId)
      console.log('📝 Detalhes:', result)
    } else {
      console.log('❌ Erro no envio:', result.error)
      console.log('📝 Detalhes:', result)
    }

    // Verificar se foi salvo na tabela outbound_emails
    console.log('\n🔍 Verificando emails enviados...')
    const { data: emails, error } = await supabase
      .from('outbound_emails')
      .select('*')
      .eq('to_email', 'di_rangel@hotmail.com')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.log('❌ Erro ao consultar emails:', error)
    } else {
      console.log(`📊 Encontrados ${emails.length} emails para di_rangel@hotmail.com:`)
      emails.forEach((email, index) => {
        console.log(`${index + 1}. ${email.subject} - Status: ${email.status} - ${email.created_at}`)
      })
    }

  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

sendTestEmail() 