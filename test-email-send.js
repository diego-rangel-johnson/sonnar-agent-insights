// Teste do sistema de envio de emails
const SUPABASE_URL = 'https://nsbjkxbfkhauitmjnkxh.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYmpreGJma2hhdWl0bWpua3hoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ5MjI0MSwiZXhwIjoyMDY3MDY4MjQxfQ.LNrW88vv6jgiwids3xX9xdL-gxmAPjNiteAugsx9vKk'

async function testEmailSending() {
  console.log('🧪 Testando envio de email...')
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/email-sender`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        to: 'diego.johnson@jobbs.com.br',
        subject: 'Teste do Sistema Sonnar - Email Sender',
        message: `Olá!

Este é um email de teste do sistema Sonnar Agent Insights.

✅ Sistema de envio funcionando
✅ Integração Gmail API ativa
✅ Forças Tarefa de IA operacionais

Data/Hora: ${new Date().toLocaleString('pt-BR')}

Atenciosamente,
Sistema Sonnar`,
        agent_used: 'email-sender-test',
        sender_name: 'Sistema Sonnar - Teste'
      })
    })

    const result = await response.json()
    
    if (response.ok && result.success) {
      console.log('✅ Email enviado com sucesso!')
      console.log('📧 Message ID:', result.messageId)
      console.log('🆔 Email ID:', result.emailId)
    } else {
      console.error('❌ Erro ao enviar email:', result)
    }
    
    return result
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error)
    return { error: error.message }
  }
}

// Executar teste se chamado diretamente
if (typeof window === 'undefined') {
  testEmailSending()
    .then(result => {
      console.log('\n📊 Resultado final:', result)
      process.exit(result.success ? 0 : 1)
    })
    .catch(error => {
      console.error('💥 Falha crítica:', error)
      process.exit(1)
    })
} 