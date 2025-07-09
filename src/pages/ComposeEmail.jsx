import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription } from '../components/ui/alert'
import { supabase } from '../lib/supabase'
import { Send, Bot, Target, Lightbulb, Clock } from 'lucide-react'

const AGENT_FORCES = [
  {
    id: 'comprador',
    name: 'COMPRADOR',
    description: 'Análise de comportamento de compra e experiência do usuário',
    icon: '🛒',
    color: 'bg-blue-500',
    specialty: 'Simula compras e analisa friction points'
  },
  {
    id: 'atendente',
    name: 'ATENDENTE',
    description: 'Análise de qualidade de atendimento e suporte',
    icon: '🎧',
    color: 'bg-green-500',
    specialty: 'Avalia qualidade de respostas e atendimento'
  },
  {
    id: 'investigador',
    name: 'INVESTIGADOR',
    description: 'Mystery shopping e análise investigativa',
    icon: '🔍',
    color: 'bg-purple-500',
    specialty: 'Faz investigações profundas e mystery shopping'
  },
  {
    id: 'negociador',
    name: 'NEGOCIADOR',
    description: 'Especialista em vendas e negociação',
    icon: '💼',
    color: 'bg-orange-500',
    specialty: 'Técnicas de venda e fechamento de negócios'
  },
  {
    id: 'qualificador',
    name: 'QUALIFICADOR',
    description: 'Qualificação de leads usando metodologia BANT+',
    icon: '⭐',
    color: 'bg-yellow-500',
    specialty: 'Qualifica leads e oportunidades de negócio'
  },
  {
    id: 'mapeador',
    name: 'MAPEADOR',
    description: 'Análise de jornada do cliente e touchpoints',
    icon: '🗺️',
    color: 'bg-indigo-500',
    specialty: 'Mapeia jornadas e identifica oportunidades'
  },
  {
    id: 'cronometrista',
    name: 'CRONOMETRISTA',
    description: 'Análise temporal e métricas de performance',
    icon: '⏱️',
    color: 'bg-red-500',
    specialty: 'Mede tempos de resposta e performance'
  },
  {
    id: 'analista',
    name: 'ANALISTA',
    description: 'Business Intelligence e análise de dados',
    icon: '📊',
    color: 'bg-teal-500',
    specialty: 'Análise preditiva e insights de negócio'
  },
  {
    id: 'psicologo',
    name: 'PSICÓLOGO',
    description: 'Análise emocional e comportamental',
    icon: '🧠',
    color: 'bg-pink-500',
    specialty: 'Identifica padrões emocionais e comportamentais'
  },
  {
    id: 'solucionador',
    name: 'SOLUCIONADOR',
    description: 'Resolução de problemas e troubleshooting',
    icon: '🔧',
    color: 'bg-gray-500',
    specialty: 'Resolve problemas complexos metodicamente'
  }
]

export default function ComposeEmail() {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
    selectedAgent: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateWithAgent = async () => {
    if (!formData.selectedAgent || !formData.subject) {
      alert('Selecione uma força tarefa e digite o assunto')
      return
    }

    setIsProcessing(true)
    try {
      const selectedAgentInfo = AGENT_FORCES.find(agent => agent.id === formData.selectedAgent)
      
      const { data } = await supabase.functions.invoke('ai-orchestrator', {
        body: {
          agentType: formData.selectedAgent,
          message: `Compor um email profissional e persuasivo com o assunto: "${formData.subject}" para o destinatário: ${formData.to}. 
          
CONTEXTO ADICIONAL: ${formData.message || 'Email de outreach profissional para prospecção'}

ESPECIALIDADE DO AGENTE: ${selectedAgentInfo?.specialty}

INSTRUÇÕES:
- Crie um email completo, profissional e bem estruturado
- Use uma linguagem adequada ao contexto brasileiro
- Inclua saudação, corpo e despedida
- O email deve ser persuasivo mas não invasivo
- Adapte o tom conforme sua especialidade de agente
- NÃO inclua campos como "De:" ou "Para:" - apenas o conteúdo do email`,
          context: {
            task: 'compose_email',
            to: formData.to,
            subject: formData.subject,
            agent_specialty: selectedAgentInfo?.specialty
          }
        }
      })

      if (data?.response) {
        setAiSuggestion({
          agent: selectedAgentInfo,
          content: data.response,
          confidence: data.confidence || 0.85
        })
        setShowPreview(true)
      } else {
        alert('Erro ao gerar sugestão com IA')
      }
    } catch (error) {
      alert('Erro ao processar com força tarefa: ' + error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const sendEmail = async (useAiContent = false) => {
    const emailContent = useAiContent ? aiSuggestion.content : formData.message

    if (!formData.to || !formData.subject || !emailContent.trim()) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    setIsProcessing(true)
    try {
      const { data } = await supabase.functions.invoke('email-sender', {
        body: {
          to: formData.to,
          subject: formData.subject,
          message: emailContent,
          agent_used: useAiContent ? formData.selectedAgent : null,
          sender_name: 'Sonnar Agent System'
        }
      })

      if (data?.success) {
        alert('✅ Email enviado com sucesso!')
        // Reset form
        setFormData({ to: '', subject: '', message: '', selectedAgent: '' })
        setAiSuggestion(null)
        setShowPreview(false)
      } else {
        alert('❌ Erro ao enviar email: ' + data?.message)
      }
    } catch (error) {
      alert('❌ Erro ao enviar email: ' + error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Compor Email</h1>
          <p className="text-gray-600">Crie emails com assistência das forças tarefa de IA</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Bot className="h-4 w-4 mr-2" />
          Sistema Ativo
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Composição */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Dados do Email
            </CardTitle>
            <CardDescription>
              Preencha as informações básicas do email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Para: *</label>
              <Input
                type="email"
                placeholder="destinatario@empresa.com"
                value={formData.to}
                onChange={(e) => handleInputChange('to', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Assunto: *</label>
              <Input
                placeholder="Assunto do email..."
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Mensagem inicial:</label>
              <Textarea
                placeholder="Contexto adicional ou rascunho inicial (opcional)..."
                rows={4}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Seleção de Força Tarefa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Força Tarefa de IA
            </CardTitle>
            <CardDescription>
              Selecione um agente especializado para ajudar na composição
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={formData.selectedAgent} onValueChange={(value) => handleInputChange('selectedAgent', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma força tarefa..." />
              </SelectTrigger>
              <SelectContent>
                {AGENT_FORCES.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center space-x-2">
                      <span>{agent.icon}</span>
                      <span className="font-medium">{agent.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {formData.selectedAgent && (
              <div className="p-3 bg-gray-50 rounded-lg">
                {(() => {
                  const agent = AGENT_FORCES.find(a => a.id === formData.selectedAgent)
                  return (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{agent.icon}</span>
                        <span className="font-bold text-lg">{agent.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {agent.specialty}
                      </Badge>
                    </div>
                  )
                })()}
              </div>
            )}

            <Button 
              onClick={generateWithAgent}
              disabled={isProcessing || !formData.selectedAgent || !formData.subject}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processando com IA...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Gerar com Força Tarefa
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Preview da Sugestão IA */}
      {showPreview && aiSuggestion && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Bot className="h-5 w-5 mr-2" />
              Sugestão da Força Tarefa: {aiSuggestion.agent.name}
            </CardTitle>
            <CardDescription>
              Confiança: {Math.round(aiSuggestion.confidence * 100)}% | 
              Especialidade: {aiSuggestion.agent.specialty}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded border">
              <pre className="whitespace-pre-wrap text-sm">{aiSuggestion.content}</pre>
            </div>
            <div className="flex space-x-3 mt-4">
              <Button onClick={() => sendEmail(true)} disabled={isProcessing}>
                <Send className="h-4 w-4 mr-2" />
                Enviar Versão IA
              </Button>
              <Button variant="outline" onClick={() => setFormData(prev => ({ ...prev, message: aiSuggestion.content }))}>
                Usar como Rascunho
              </Button>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Fechar Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botões de Ação */}
      <div className="flex justify-between">
        <div className="flex space-x-3">
          <Button 
            onClick={() => sendEmail(false)}
            disabled={isProcessing || !formData.to || !formData.subject || !formData.message.trim()}
            variant="outline"
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar Manual
          </Button>
        </div>
        
        <Alert className="max-w-md">
          <AlertDescription className="text-sm">
            💡 <strong>Dica:</strong> Use as forças tarefa para compor emails mais eficazes baseados em especialidades específicas.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
} 