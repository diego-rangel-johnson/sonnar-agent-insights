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

// Análise de intenção baseada em palavras-chave
const intentPatterns = {
  support: [
    'problema', 'erro', 'bug', 'não funciona', 'ajuda', 'suporte', 'dificuldade',
    'falha', 'quebrado', 'parou', 'travou', 'lento', 'demora'
  ],
  sales: [
    'preço', 'valor', 'custo', 'orçamento', 'proposta', 'comprar', 'adquirir',
    'contrato', 'plano', 'licença', 'demo', 'demonstração', 'interessado'
  ],
  complaint: [
    'reclamação', 'insatisfeito', 'decepcionado', 'péssimo', 'horrível',
    'cancelar', 'reembolso', 'devolver', 'raiva', 'furioso', 'absurdo'
  ],
  billing: [
    'fatura', 'cobrança', 'pagamento', 'cartão', 'débito', 'mensalidade',
    'renovação', 'assinatura', 'boleto', 'pix', 'transferência'
  ],
  urgent: [
    'urgente', 'emergência', 'crítico', 'imediato', 'rápido', 'pressa',
    'hoje', 'agora', 'parou tudo', 'produção', 'clientes afetados'
  ]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { emailId } = await req.json()
    
    if (!emailId) {
      return new Response('Email ID required', { status: 400, headers: corsHeaders })
    }

    console.log('🔍 Processando email:', emailId)

    // Buscar dados do email
    const { data: email, error: emailError } = await supabase
      .from('emails')
      .select(`
        *,
        email_accounts(email_address, display_name)
      `)
      .eq('id', emailId)
      .single()

    if (emailError || !email) {
      throw new Error('Email não encontrado: ' + emailError?.message)
    }

    // Marcar como processando
    await supabase
      .from('emails')
      .update({ status: 'processing' })
      .eq('id', emailId)

    // 1. Análise de intenção e sentimento
    const analysis = await analyzeEmailContent(email)
    
    // 2. Salvar análise
    const { data: savedAnalysis } = await supabase
      .from('email_analysis')
      .insert({
        email_id: emailId,
        intent: analysis.intent,
        sentiment: analysis.sentiment,
        entities: analysis.entities,
        category: analysis.category,
        priority: analysis.priority,
        auto_reply_eligible: analysis.autoReplyEligible,
        confidence_score: analysis.confidenceScore,
        analysis_data: analysis
      })
      .select()
      .single()

    // 3. Gerenciar conversa
    await manageConversation(email, analysis)

    // 4. Disparar análise das forças tarefa
    const agentAnalyses = await processWithAgents(email, analysis)

    // 5. Gerar sugestão de resposta
    const suggestion = await generateResponseSuggestion(email, analysis, agentAnalyses)

    // 6. Marcar como processado
    await supabase
      .from('emails')
      .update({ 
        status: 'completed',
        processed_at: new Date().toISOString()
      })
      .eq('id', emailId)

    // 7. Log da atividade
    await logActivity(emailId, 'processed', {
      analysis_id: savedAnalysis?.id,
      agents_used: agentAnalyses.map(a => a.agent_name),
      suggestion_id: suggestion?.id
    })

    return new Response(JSON.stringify({
      success: true,
      emailId,
      analysis: savedAnalysis,
      suggestion: suggestion,
      message: 'Email processado com sucesso'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Erro no processamento:', error)
    
    return new Response(JSON.stringify({
      error: 'Erro no processamento',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function analyzeEmailContent(email: any) {
  const content = `${email.subject} ${email.body_text}`.toLowerCase()
  
  // Detectar intenção
  let intent = 'inquiry'
  let intentScore = 0
  
  for (const [intentType, keywords] of Object.entries(intentPatterns)) {
    const matches = keywords.filter(keyword => content.includes(keyword)).length
    if (matches > intentScore) {
      intent = intentType
      intentScore = matches
    }
  }

  // Análise de sentimento básica
  const sentiment = analyzeSentiment(content)
  
  // Detectar entidades
  const entities = extractEntities(email.body_text)
  
  // Categorizar
  const category = categorizeEmail(intent, content)
  
  // Calcular prioridade (1-10)
  let priority = 5
  if (intent === 'urgent' || sentiment.urgency === 'high') priority = 9
  else if (intent === 'complaint') priority = 7
  else if (intent === 'support') priority = 6
  else if (intent === 'sales') priority = 4

  // Verificar elegibilidade para resposta automática
  const autoReplyEligible = checkAutoReplyEligibility(intent, sentiment, intentScore)
  
  // Confiança geral
  const confidenceScore = Math.min(0.95, (intentScore * 0.2) + 0.3)

  return {
    intent,
    sentiment,
    entities,
    category,
    priority,
    autoReplyEligible,
    confidenceScore,
    intentScore,
    content: content.substring(0, 500) // Primeira parte para debug
  }
}

function analyzeSentiment(text: string) {
  const positiveWords = ['obrigado', 'parabéns', 'excelente', 'ótimo', 'bom', 'gostei']
  const negativeWords = ['ruim', 'péssimo', 'horrível', 'problema', 'erro', 'raiva', 'ódio']
  const urgentWords = ['urgente', 'imediato', 'emergência', 'crítico', 'parou']

  const positive = positiveWords.filter(word => text.includes(word)).length
  const negative = negativeWords.filter(word => text.includes(word)).length
  const urgent = urgentWords.filter(word => text.includes(word)).length

  let emotion = 'neutral'
  if (positive > negative) emotion = 'happy'
  else if (negative > positive) emotion = 'frustrated'
  
  let urgency = 'low'
  if (urgent > 0) urgency = 'high'
  else if (negative > 1) urgency = 'medium'

  return { emotion, urgency, confidence: 0.7 }
}

function extractEntities(text: string) {
  const phoneRegex = /(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}/g
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const cnpjRegex = /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/g

  return {
    phones: text.match(phoneRegex) || [],
    emails: text.match(emailRegex) || [],
    cnpjs: text.match(cnpjRegex) || []
  }
}

function categorizeEmail(intent: string, content: string) {
  if (intent === 'support') return 'technical'
  if (intent === 'sales') return 'commercial'
  if (intent === 'billing') return 'billing'
  if (intent === 'complaint') return 'customer_service'
  return 'general'
}

function checkAutoReplyEligibility(intent: string, sentiment: any, intentScore: number) {
  // Critérios para resposta automática
  if (sentiment.urgency === 'high') return false // Casos urgentes precisam humano
  if (intent === 'complaint') return false // Reclamações precisam cuidado
  if (intentScore < 2) return false // Baixa confiança na intenção
  
  // Casos elegíveis para auto-resposta
  if (intent === 'inquiry' && sentiment.emotion !== 'frustrated') return true
  if (intent === 'sales' && sentiment.emotion === 'neutral') return true
  
  return false
}

async function manageConversation(email: any, analysis: any) {
  // Verificar se conversa já existe
  const { data: conversation } = await supabase
    .from('email_conversations')
    .select('*')
    .eq('gmail_thread_id', email.thread_id)
    .single()

  if (!conversation) {
    // Criar nova conversa
    await supabase
      .from('email_conversations')
      .insert({
        gmail_thread_id: email.thread_id,
        account_id: email.account_id,
        customer_email: email.from_email,
        customer_name: email.from_name,
        subject: email.subject,
        status: 'active',
        priority: analysis.priority,
        first_email_id: email.id,
        last_email_id: email.id
      })
  } else {
    // Atualizar conversa existente
    await supabase
      .from('email_conversations')
      .update({
        last_email_id: email.id,
        updated_at: new Date().toISOString(),
        priority: Math.max(conversation.priority, analysis.priority)
      })
      .eq('id', conversation.id)
  }
}

async function processWithAgents(email: any, analysis: any) {
  console.log('🤖 Processando com agentes para:', analysis.intent)

  // Selecionar agentes com base na intenção
  const agentSelection = selectAgentsForIntent(analysis.intent, analysis.category)
  
  const agentAnalyses = []

  for (const agentName of agentSelection) {
    try {
      const startTime = Date.now()
      
      // Chamar AI orchestrator para este agente específico
      const response = await supabase.functions.invoke('ai-orchestrator', {
        body: {
          agent: agentName,
          context: `Email de: ${email.from_email}
Assunto: ${email.subject}
Conteúdo: ${email.body_text}
Intenção detectada: ${analysis.intent}
Sentimento: ${analysis.sentiment.emotion}
Urgência: ${analysis.sentiment.urgency}`
        }
      })

      const processingTime = Date.now() - startTime

      if (response.data?.response) {
        const agentAnalysis = {
          email_id: email.id,
          agent_name: agentName,
          analysis_text: response.data.response,
          recommendations: response.data.recommendations || {},
          confidence_score: response.data.confidence || 0.8,
          processing_time_ms: processingTime
        }

        // Salvar análise do agente
        const { data: saved } = await supabase
          .from('agent_analyses')
          .insert(agentAnalysis)
          .select()
          .single()

        agentAnalyses.push(saved)
        console.log(`✅ Agente ${agentName} processou em ${processingTime}ms`)
      }

    } catch (error) {
      console.error(`❌ Erro no agente ${agentName}:`, error)
    }
  }

  return agentAnalyses
}

function selectAgentsForIntent(intent: string, category: string) {
  const intentAgentMap = {
    support: ['investigador', 'solucionador', 'atendente'],
    sales: ['comprador', 'negociador', 'qualificador'],
    complaint: ['atendente', 'psicologo', 'investigador', 'solucionador'],
    billing: ['atendente', 'analista'],
    inquiry: ['atendente', 'analista'],
    urgent: ['solucionador', 'investigador', 'cronometrista']
  }

  return intentAgentMap[intent] || ['atendente', 'analista']
}

async function generateResponseSuggestion(email: any, analysis: any, agentAnalyses: any[]) {
  console.log('💡 Gerando sugestão de resposta')

  // Compilar insights dos agentes
  const agentInsights = agentAnalyses.map(a => `${a.agent_name}: ${a.analysis_text}`).join('\n\n')
  
  // Determinar tipo de resposta
  const responseType = analysis.autoReplyEligible ? 'auto' : 'suggested'
  
  // Criar contexto para geração da resposta
  const responseContext = `
Email original de ${email.from_email}:
Assunto: ${email.subject}
Conteúdo: ${email.body_text}

Análise da situação:
- Intenção: ${analysis.intent}
- Sentimento: ${analysis.sentiment.emotion}
- Urgência: ${analysis.sentiment.urgency}
- Prioridade: ${analysis.priority}

Insights dos agentes especialistas:
${agentInsights}

Por favor, gere uma resposta profissional e empática em português brasileiro.`

  try {
    // Chamar AI orchestrator para gerar resposta
    const response = await supabase.functions.invoke('ai-orchestrator', {
      body: {
        agent: 'atendente', // Usar atendente para gerar resposta final
        context: responseContext,
        task: 'generate_response'
      }
    })

    if (response.data?.response) {
      // Buscar conversa
      const { data: conversation } = await supabase
        .from('email_conversations')
        .select('id')
        .eq('gmail_thread_id', email.thread_id)
        .single()

      // Salvar sugestão
      const suggestion = await supabase
        .from('response_suggestions')
        .insert({
          conversation_id: conversation?.id,
          email_id: email.id,
          suggested_response: response.data.response,
          response_type: responseType,
          agents_used: agentAnalyses.map(a => a.agent_name),
          confidence_score: analysis.confidenceScore,
          approval_status: analysis.autoReplyEligible ? 'auto_approved' : 'pending'
        })
        .select()
        .single()

      console.log('💬 Sugestão gerada:', suggestion.data?.id)
      return suggestion.data

    } else {
      throw new Error('Falha ao gerar resposta')
    }

  } catch (error) {
    console.error('❌ Erro ao gerar sugestão:', error)
    return null
  }
}

async function logActivity(emailId: string, action: string, details: any) {
  await supabase
    .from('email_activity_logs')
    .insert({
      email_id: emailId,
      action,
      details,
      performed_by: 'system'
    })
} 