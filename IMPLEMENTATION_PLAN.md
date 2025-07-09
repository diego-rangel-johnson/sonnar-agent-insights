# 🚀 Plano de Implementação - Agent Insights

## 📅 **SPRINT 1: IA GENERATIVA AVANÇADA** (Próximas 2 semanas)

### **🎯 Objetivo**: Transformar simulações em IA real com GPT-4o/Claude

### **Tarefas Prioritárias:**

#### **1. Edge Function: AI Orchestrator** 
```bash
# Criar nova edge function
supabase functions new ai-orchestrator
```

**Arquivo: `supabase/functions/ai-orchestrator/index.ts`**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')

// Prompts especializados por tipo de agente
const agentPrompts = {
  comprador: `Você é um agente especializado em simular comportamentos de compra. 
Analise cada interação como um cliente real interessado em adquirir produtos/serviços.
Faça perguntas sobre preços, condições, compare opções e demonstre interesse genuíno.
Seja natural e use linguagem coloquial brasileira.`,

  atendente: `Você é um especialista em avaliar qualidade de atendimento.
Analise cada resposta quanto à clareza, tempo de resposta, resolução de problemas.
Identifique pontos de melhoria e sugira otimizações.
Seja construtivo e focado em métricas objetivas.`,

  investigador: `Você é um cliente oculto virtual avaliando o serviço.
Teste diferentes cenários, faça perguntas difíceis, simule objeções.
Avalie conhecimento do produto, cordialidade e eficiência.
Documente tudo para análise posterior.`,

  negociador: `Você é especialista em negociação e vendas.
Analise táticas de vendas, identifique oportunidades de melhoria.
Simule objeções, negocie preços e condições.
Foque em conversão e satisfação do cliente.`
}

serve(async (req) => {
  try {
    const { message, agentType, context } = await req.json()
    
    // Escolher modelo baseado no agente
    const modelConfig = {
      comprador: { model: 'gpt-4o', provider: 'openai' },
      atendente: { model: 'claude-3-5-sonnet', provider: 'anthropic' },
      investigador: { model: 'gpt-4o', provider: 'openai' },
      negociador: { model: 'claude-3-5-sonnet', provider: 'anthropic' }
    }

    const config = modelConfig[agentType] || modelConfig.atendente
    const systemPrompt = agentPrompts[agentType] || agentPrompts.atendente

    let response
    
    if (config.provider === 'openai') {
      response = await callOpenAI(message, systemPrompt, context)
    } else {
      response = await callAnthropic(message, systemPrompt, context)
    }

    return new Response(JSON.stringify({
      response: response.content,
      agentType,
      timestamp: new Date().toISOString(),
      sentiment: analyzeSentiment(response.content),
      confidence: response.confidence || 0.95
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

async function callOpenAI(message: string, systemPrompt: string, context: any) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Contexto: ${JSON.stringify(context)}\n\nMensagem: ${message}` }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  })

  const data = await response.json()
  return {
    content: data.choices[0].message.content,
    confidence: 0.95
  }
}

async function callAnthropic(message: string, systemPrompt: string, context: any) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Contexto: ${JSON.stringify(context)}\n\nMensagem: ${message}`
      }]
    })
  })

  const data = await response.json()
  return {
    content: data.content[0].text,
    confidence: 0.93
  }
}

function analyzeSentiment(text: string) {
  // Análise básica de sentimento (melhorar depois)
  const positive = ['bom', 'ótimo', 'excelente', 'satisfeito', 'feliz', 'obrigado']
  const negative = ['ruim', 'péssimo', 'insatisfeito', 'problema', 'erro', 'chateado']
  
  const lowerText = text.toLowerCase()
  const positiveCount = positive.filter(word => lowerText.includes(word)).length
  const negativeCount = negative.filter(word => lowerText.includes(word)).length
  
  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}
```

#### **2. Atualizar Agent Insights para usar IA real**

**Arquivo: `src/pages/AgentInsights.jsx`** - Modificar função `startTaskForceTest`:

```typescript
const startTaskForceTest = async () => {
  // ... código existente ...

  try {
    const conversations = [];
    
    for (const agentId of selectedTaskForce) {
      const agentName = agentTeams.find(team => team.id === agentId)?.name || 'Agente';
      
      // NOVA IMPLEMENTAÇÃO - Usar AI Orchestrator real
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-orchestrator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          message: testPrompt,
          agentType: agentId,
          context: {
            channel: selectedChannel,
            phoneNumber: phoneNumber,
            testMode: true,
            timestamp: new Date().toISOString(),
            userProfile: {
              // Adicionar dados do perfil do usuário/cliente
              plan: 'professional',
              industry: 'technology'
            }
          }
        })
      });

      if (response.ok) {
        const aiResponse = await response.json();
        
        const conversation = {
          id: `conv_${agentId}_${Date.now()}`,
          agentId,
          agentName,
          targetNumber: phoneNumber,
          channel: selectedChannel,
          status: 'active',
          startTime: new Date(),
          messages: [
            {
              id: 1,
              timestamp: new Date(),
              sender: 'agent',
              content: aiResponse.response,
              status: 'sent',
              type: 'text',
              sentiment: aiResponse.sentiment,
              confidence: aiResponse.confidence
            }
          ],
          metrics: {
            responseTime: 0,
            messageCount: 1,
            engagement: 0,
            sentiment: aiResponse.sentiment
          }
        };
        
        conversations.push(conversation);
        
        // Enviar para WhatsApp se configurado
        if (selectedChannel === 'whatsapp' && phoneNumber) {
          await sendWhatsAppMessage(aiResponse.response, phoneNumber, agentId);
        }
      }
    }
    
    setActiveConversations(conversations);
    // ... resto do código ...
  } catch (error) {
    console.error('Erro no teste da força tarefa:', error);
  }
};
```

#### **3. Melhorar WhatsApp Integration**

**Arquivo: `supabase/functions/whatsapp-integration/index.ts`**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
const WHATSAPP_PHONE_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')

serve(async (req) => {
  if (req.method === 'POST') {
    const { message, phoneNumber, agentType, mediaUrl, messageType = 'text' } = await req.json()
    
    // Formatar número brasileiro
    const formattedNumber = formatBrazilianNumber(phoneNumber)
    
    let messagePayload
    
    if (messageType === 'text') {
      messagePayload = {
        messaging_product: "whatsapp",
        to: formattedNumber,
        type: "text",
        text: { body: message }
      }
    } else if (messageType === 'image' && mediaUrl) {
      messagePayload = {
        messaging_product: "whatsapp",
        to: formattedNumber,
        type: "image",
        image: {
          link: mediaUrl,
          caption: message
        }
      }
    }

    const response = await fetch(`https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messagePayload)
    })

    const result = await response.json()
    
    if (response.ok) {
      // Salvar mensagem no banco
      await saveMessageToDatabase({
        whatsapp_message_id: result.messages[0].id,
        phone_number: formattedNumber,
        message: message,
        agent_type: agentType,
        message_type: messageType,
        status: 'sent'
      })
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Webhook para receber mensagens
  if (req.method === 'GET') {
    const url = new URL(req.url)
    const mode = url.searchParams.get('hub.mode')
    const token = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')

    if (mode === 'subscribe' && token === 'meu_token_de_verificacao') {
      return new Response(challenge)
    }

    return new Response('Forbidden', { status: 403 })
  }
})

function formatBrazilianNumber(number: string): string {
  // Remove formatação e adiciona código do país
  const cleaned = number.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `55${cleaned}`
  }
  return cleaned
}

async function saveMessageToDatabase(messageData: any) {
  // Implementar salvamento no Supabase
  // Conectar com tabela de mensagens existente
}
```

#### **4. Configurar Variáveis de Ambiente**

```bash
# No Supabase Dashboard > Settings > Edge Functions
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
WHATSAPP_ACCESS_TOKEN=EAAG...
WHATSAPP_PHONE_NUMBER_ID=123...
```

#### **5. Deploy e Teste**

```bash
# Deploy das edge functions
supabase functions deploy ai-orchestrator
supabase functions deploy whatsapp-integration

# Testar localmente primeiro
supabase functions serve ai-orchestrator --env-file .env.local
```

---

## 📅 **SPRINT 2: ANALYTICS PREDITIVOS** (Semanas 3-4)

### **1. Tabela de Machine Learning Insights**

```sql
-- Nova tabela para insights preditivos
CREATE TABLE ml_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  insight_type VARCHAR(50) NOT NULL, -- 'churn_risk', 'satisfaction_forecast', 'optimal_timing'
  entity_type VARCHAR(50) NOT NULL, -- 'customer', 'agent', 'conversation'
  entity_id UUID NOT NULL,
  prediction_data JSONB NOT NULL,
  confidence_score FLOAT NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ml_insights_org_type ON ml_insights(organization_id, insight_type);
CREATE INDEX idx_ml_insights_valid ON ml_insights(valid_until) WHERE valid_until > NOW();
```

### **2. Edge Function: ML Analytics**

```typescript
// supabase/functions/ml-analytics/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { type, timeframe = '7d' } = await req.json()
  
  switch (type) {
    case 'satisfaction_forecast':
      return await forecastSatisfaction(timeframe)
    case 'churn_risk':
      return await calculateChurnRisk(timeframe)  
    case 'optimal_timing':
      return await findOptimalTiming(timeframe)
    default:
      return new Response('Invalid analytics type', { status: 400 })
  }
})

async function forecastSatisfaction(timeframe: string) {
  // Análise de tendência simples (melhorar com ML depois)
  const satisfactionData = await fetchSatisfactionHistory(timeframe)
  
  // Calcular tendência linear
  const trend = calculateLinearTrend(satisfactionData)
  const forecast = extrapolateTrend(trend, 7) // próximos 7 dias
  
  return new Response(JSON.stringify({
    current_satisfaction: satisfactionData[satisfactionData.length - 1]?.value || 0,
    predicted_satisfaction: forecast,
    confidence: 0.75,
    trend: trend > 0 ? 'increasing' : 'decreasing',
    recommendation: trend < 0 ? 'Monitor closely - satisfaction declining' : 'Maintain current strategy'
  }))
}

async function calculateChurnRisk(timeframe: string) {
  // Algoritmo básico de churn risk
  const customers = await fetchCustomerMetrics(timeframe)
  
  const riskFactors = customers.map(customer => {
    let riskScore = 0
    
    // Fatores de risco
    if (customer.lastInteraction > 30) riskScore += 0.3 // 30+ dias sem contato
    if (customer.avgSatisfaction < 3) riskScore += 0.4 // baixa satisfação
    if (customer.supportTickets > 5) riskScore += 0.2 // muitos tickets
    if (customer.responseTime > 24) riskScore += 0.1 // demora para responder
    
    return {
      customer_id: customer.id,
      churn_probability: Math.min(riskScore, 1),
      risk_level: riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'medium' : 'low',
      primary_factors: identifyRiskFactors(customer)
    }
  })
  
  return new Response(JSON.stringify({
    high_risk_customers: riskFactors.filter(c => c.risk_level === 'high').length,
    total_analyzed: customers.length,
    avg_churn_probability: riskFactors.reduce((sum, c) => sum + c.churn_probability, 0) / riskFactors.length,
    detailed_risks: riskFactors.filter(c => c.risk_level !== 'low')
  }))
}
```

### **3. Dashboard de Insights Preditivos**

```react
// src/components/dashboard/PredictiveDashboard.jsx
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

export default function PredictiveDashboard() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPredictiveInsights()
  }, [])

  const loadPredictiveInsights = async () => {
    try {
      const [satisfaction, churn, timing] = await Promise.all([
        fetch('/functions/v1/ml-analytics', {
          method: 'POST',
          body: JSON.stringify({ type: 'satisfaction_forecast' })
        }).then(r => r.json()),
        
        fetch('/functions/v1/ml-analytics', {
          method: 'POST', 
          body: JSON.stringify({ type: 'churn_risk' })
        }).then(r => r.json()),
        
        fetch('/functions/v1/ml-analytics', {
          method: 'POST',
          body: JSON.stringify({ type: 'optimal_timing' })
        }).then(r => r.json())
      ])

      setInsights({ satisfaction, churn, timing })
    } catch (error) {
      console.error('Erro ao carregar insights:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Carregando insights preditivos...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Previsão de Satisfação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {insights.satisfaction.trend === 'increasing' ? 
              <TrendingUp className="text-green-500" /> : 
              <TrendingDown className="text-red-500" />
            }
            Previsão de Satisfação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {insights.satisfaction.predicted_satisfaction.toFixed(1)}/5.0
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {insights.satisfaction.recommendation}
          </p>
          <div className="mt-4 text-xs text-gray-500">
            Confiança: {(insights.satisfaction.confidence * 100).toFixed(0)}%
          </div>
        </CardContent>
      </Card>

      {/* Risco de Churn */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className={`${insights.churn.high_risk_customers > 0 ? 'text-red-500' : 'text-green-500'}`} />
            Risco de Churn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {insights.churn.high_risk_customers}
          </div>
          <p className="text-sm text-gray-600">
            clientes em alto risco
          </p>
          <div className="mt-4">
            <div className="text-sm">
              Probabilidade média: {(insights.churn.avg_churn_probability * 100).toFixed(1)}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timing Otimal */}
      <Card>
        <CardHeader>
          <CardTitle>Melhor Horário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {insights.timing?.optimal_hour || '14h-16h'}
          </div>
          <p className="text-sm text-gray-600">
            para máxima resposta
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 📅 **SPRINT 3: MULTI-CANAL EXPANSION** (Semanas 5-6)

### **1. Microsoft Teams Integration**

```typescript
// Instalar Bot Framework
npm install @microsoft/botbuilder @microsoft/botbuilder-adapter-webex

// supabase/functions/teams-bot/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  if (req.method === 'POST') {
    const activity = await req.json()
    
    if (activity.type === 'message') {
      // Processar mensagem do Teams
      const response = await processTeamsMessage(activity)
      
      // Enviar resposta
      await sendTeamsResponse(activity, response)
    }
  }

  return new Response('OK')
})

async function processTeamsMessage(activity: any) {
  // Usar AI Orchestrator para processar
  const response = await fetch('/functions/v1/ai-orchestrator', {
    method: 'POST',
    body: JSON.stringify({
      message: activity.text,
      agentType: 'atendente',
      context: {
        channel: 'teams',
        userId: activity.from.id,
        teamId: activity.channelData?.team?.id
      }
    })
  })
  
  return await response.json()
}
```

### **2. Email Intelligence**

```typescript
// Gmail API integration
// supabase/functions/email-processor/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { emailId, action = 'analyze' } = await req.json()
  
  switch (action) {
    case 'analyze':
      return await analyzeEmail(emailId)
    case 'respond':
      return await generateEmailResponse(emailId)
    case 'prioritize':
      return await prioritizeEmail(emailId)
  }
})

async function analyzeEmail(emailId: string) {
  // Buscar email via Gmail API
  const email = await fetchEmailFromGmail(emailId)
  
  // Extrair dados importantes
  const analysis = {
    sender: email.from,
    subject: email.subject,
    content: email.body,
    attachments: email.attachments || [],
    sentiment: await analyzeSentiment(email.body),
    priority: calculatePriority(email),
    category: categorizeEmail(email),
    suggestedResponse: await generateResponse(email)
  }
  
  return new Response(JSON.stringify(analysis))
}

function calculatePriority(email: any): 'high' | 'medium' | 'low' {
  let score = 0
  
  // Fatores de prioridade
  if (email.subject.toLowerCase().includes('urgente')) score += 3
  if (email.subject.toLowerCase().includes('problema')) score += 2
  if (email.from.includes('vip')) score += 2
  if (email.body.length > 1000) score += 1
  
  return score >= 4 ? 'high' : score >= 2 ? 'medium' : 'low'
}
```

---

## 🎯 **CHECKLIST DE IMPLEMENTAÇÃO**

### **Semana 1:**
- [ ] Configurar APIs da OpenAI e Anthropic
- [ ] Criar edge function ai-orchestrator  
- [ ] Testar integração com Agent Insights
- [ ] Implementar prompts especializados

### **Semana 2:**
- [ ] Melhorar WhatsApp integration com media
- [ ] Adicionar context injection no AI
- [ ] Implementar sentiment analysis básico
- [ ] Testar force task army com IA real

### **Semana 3:**
- [ ] Criar tabela ml_insights
- [ ] Implementar edge function ml-analytics
- [ ] Desenvolver algoritmos preditivos básicos
- [ ] Dashboard de insights preditivos

### **Semana 4:**
- [ ] Teams bot MVP
- [ ] Email processor básico
- [ ] Integração com Gmail API
- [ ] Testes multi-canal

### **Semana 5-6:**
- [ ] Mobile app MVP (React Native)
- [ ] Notificações push
- [ ] Performance optimization
- [ ] Documentação e testes

---

## 💡 **FERRAMENTAS E RECURSOS NECESSÁRIOS**

### **APIs e Serviços:**
1. **OpenAI API** - $20/mês para testes (GPT-4o)
2. **Anthropic API** - $20/mês para testes (Claude 3.5)
3. **WhatsApp Business API** - Grátis para testes
4. **Microsoft Graph API** - Grátis para desenvolvimento
5. **Gmail API** - Grátis para uso básico

### **Infraestrutura:**
1. **Supabase Pro** - $25/mês (já tem)
2. **Vercel Pro** - $20/mês para deploy
3. **Cloudflare** - Grátis para CDN
4. **Redis Cloud** - $7/mês para cache

### **Total de investimento inicial: ~$92/mês**

---

## 🚀 **RESULTADOS ESPERADOS**

### **Após Sprint 1 (2 semanas):**
- ✅ IA real substituindo simulações
- ✅ Conversas inteligentes e contextuais
- ✅ WhatsApp funcionando com mídia
- ✅ Sentiment analysis básico

### **Após Sprint 2 (4 semanas):**
- ✅ Insights preditivos funcionais
- ✅ Detecção de churn básica
- ✅ Dashboard analytics avançado
- ✅ Recomendações automáticas

### **Após Sprint 3 (6 semanas):**
- ✅ 3+ canais integrados (WhatsApp, Teams, Email)
- ✅ Mobile app MVP
- ✅ Sistema unificado de conversas
- ✅ **Agent Insights = Melhor ferramenta do mercado**

**🎯 Meta: Primeiro cliente pagante em 6 semanas!** 