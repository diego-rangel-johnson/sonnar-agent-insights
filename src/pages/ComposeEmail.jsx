import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Separator } from '../components/ui/separator'
import { Label } from '../components/ui/label'
import { supabase } from '../lib/supabase'
import { 
  Send, 
  Bot, 
  Edit3, 
  Check, 
  X, 
  Sparkles, 
  User, 
  Target, 
  Mail, 
  FileText,
  Clock,
  Zap,
  RefreshCw,
  Save,
  Eye,
  Settings
} from 'lucide-react'

const AGENT_FORCES = [
  {
    id: 'comprador',
    name: 'COMPRADOR',
    description: 'Especialista em comportamento de compra e experiência do usuário',
    icon: '•',
    color: 'bg-blue-500',
    specialty: 'Simula comportamento de comprador real, avalia produtos e serviços'
  },
  {
    id: 'atendente',
    name: 'ATENDENTE',
    description: 'Especialista em qualidade de atendimento ao cliente',
    icon: '•',
    color: 'bg-green-500',
    specialty: 'Analisa qualidade do atendimento e sugere melhorias'
  },
  {
    id: 'investigador',
    name: 'INVESTIGADOR',
    description: 'Cliente oculto para avaliação de atendimento',
    icon: '•',
    color: 'bg-purple-500',
    specialty: 'Simula cliente oculto para testar qualidade do atendimento'
  },
  {
    id: 'negociador',
    name: 'NEGOCIADOR',
    description: 'Especialista em vendas e fechamento de negócios',
    icon: '•',
    color: 'bg-yellow-500',
    specialty: 'Especializado em técnicas de vendas e negociação'
  },
  {
    id: 'qualificador',
    name: 'QUALIFICADOR',
    description: 'Especialista em qualificação de leads e prospects',
    icon: '•',
    color: 'bg-red-500',
    specialty: 'Qualifica leads e identifica oportunidades de negócio'
  },
  {
    id: 'mapeador',
    name: 'MAPEADOR',
    description: 'Especialista em jornada do cliente',
    icon: '•',
    color: 'bg-indigo-500',
    specialty: 'Mapeia e otimiza jornadas do cliente'
  },
  {
    id: 'cronometrista',
    name: 'CRONOMETRISTA',
    description: 'Especialista em análise temporal e eficiência',
    icon: '•',
    color: 'bg-orange-500',
    specialty: 'Analisa tempos e eficiência operacional'
  },
  {
    id: 'analista',
    name: 'ANALISTA',
    description: 'Especialista em análise de processos internos',
    icon: '•',
    color: 'bg-cyan-500',
    specialty: 'Analisa processos e sugere otimizações'
  },
  {
    id: 'psicologo',
    name: 'PSICÓLOGO',
    description: 'Especialista em análise de sentimentos e comportamento',
    icon: '•',
    color: 'bg-pink-500',
    specialty: 'Analisa aspectos psicológicos e emocionais'
  },
  {
    id: 'solucionador',
    name: 'SOLUCIONADOR',
    description: 'Especialista em resolução de problemas técnicos',
    icon: '•',
    color: 'bg-gray-600',
    specialty: 'Resolve problemas técnicos e operacionais'
  }
]

const EMAIL_OBJECTIVES = [
  { value: 'prospeccao', label: '• Prospecção de Clientes', description: 'Primeiro contato para gerar interesse' },
  { value: 'followup_vendas', label: '• Follow-up de Vendas', description: 'Acompanhamento de proposta comercial' },
  { value: 'reativacao', label: '• Reativação de Cliente', description: 'Reconquista de clientes inativos' },
  { value: 'apresentacao', label: '• Apresentação de Solução', description: 'Demonstração de produto/serviço' },
  { value: 'negociacao', label: '• Negociação', description: 'Discussão de termos e condições' },
  { value: 'parceria', label: '• Proposta de Parceria', description: 'Estabelecimento de parcerias' },
  { value: 'suporte', label: '• Suporte Técnico', description: 'Resolução de problemas' },
  { value: 'agradecimento', label: '• Agradecimento', description: 'Reconhecimento e gratidão' },
  { value: 'convite', label: '• Convite para Evento', description: 'Convites para eventos/reuniões' },
  { value: 'feedback', label: '• Solicitação de Feedback', description: 'Coleta de opiniões e sugestões' }
]

const EMAIL_TONES = [
  { value: 'formal', label: '• Formal', description: 'Tom corporativo e profissional' },
  { value: 'amigavel', label: '• Amigável', description: 'Tom caloroso e próximo' },
  { value: 'direto', label: '• Direto', description: 'Objetivo e conciso' },
  { value: 'consultivo', label: '• Consultivo', description: 'Educativo e orientativo' },
  { value: 'urgente', label: '• Urgente', description: 'Transmite urgência' },
  { value: 'casual', label: '• Casual', description: 'Descontraído e informal' }
]

export default function ComposeEmail() {
  const [formData, setFormData] = useState({
    // Dados do destinatário
    recipientName: '',
    recipientEmail: '',
    recipientCompany: '',
    recipientPosition: '',
    
    // Dados do remetente
    senderName: '',
    senderEmail: '',
    senderPosition: '',
    senderCompany: '',
    
    // Configurações do email
    subject: '',
    objective: '',
    tone: 'formal',
    context: '',
    callToAction: '',
    
    // IA e força tarefa
    selectedAgent: '',
    useAI: true,
    
    // Estado do rascunho
    generatedDraft: '',
    isEditing: false,
    finalEmail: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('compose') // compose, preview, edit, send
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpar erro específico quando campo é preenchido
    if (errors[field] && value) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.recipientEmail) newErrors.recipientEmail = 'Email do destinatário é obrigatório'
    if (!formData.senderName) newErrors.senderName = 'Nome do remetente é obrigatório'
    if (!formData.senderEmail) newErrors.senderEmail = 'Email do remetente é obrigatório'
    if (!formData.objective) newErrors.objective = 'Objetivo do email é obrigatório'
    if (!formData.selectedAgent) newErrors.selectedAgent = 'Seleção da força tarefa é obrigatória'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateDraft = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const selectedAgentInfo = AGENT_FORCES.find(agent => agent.id === formData.selectedAgent)
      const objective = EMAIL_OBJECTIVES.find(obj => obj.value === formData.objective)
      const tone = EMAIL_TONES.find(t => t.value === formData.tone)
      
      const emailContext = `
DADOS DO DESTINATÁRIO:
- Nome: ${formData.recipientName || 'Não informado'}
- Email: ${formData.recipientEmail}
- Empresa: ${formData.recipientCompany || 'Não informada'}
- Cargo: ${formData.recipientPosition || 'Não informado'}

DADOS DO REMETENTE:
- Nome: ${formData.senderName}
- Email: ${formData.senderEmail}
- Cargo: ${formData.senderPosition || 'Não informado'}
- Empresa: ${formData.senderCompany || 'Não informada'}

CONFIGURAÇÕES DO EMAIL:
- Objetivo: ${objective?.label} - ${objective?.description}
- Tom: ${tone?.label} - ${tone?.description}
- Call to Action: ${formData.callToAction || 'Não especificado'}

CONTEXTO ADICIONAL:
${formData.context || 'Nenhum contexto adicional fornecido'}

INSTRUÇÕES PARA A IA:
Crie um email COMPLETO em português brasileiro que:
1. Tenha um ASSUNTO impactante e relevante
2. Use o tom especificado (${tone?.label})
3. Seja personalizado para o destinatário
4. Alcance o objetivo definido (${objective?.label})
5. Inclua uma call-to-action clara
6. Seja profissional mas humano
7. Tenha entre 150-300 palavras
8. Use a especialidade do agente: ${selectedAgentInfo?.specialty}

FORMATO DE RESPOSTA:
Assunto: [assunto sugerido]

[corpo do email]
      `

      const { data } = await supabase.functions.invoke('ai-orchestrator', {
        body: {
          agentType: formData.selectedAgent,
          message: emailContext,
          context: {
            task: 'compose_email',
            objective: formData.objective,
            tone: formData.tone
          }
        }
      })

      if (data?.response) {
        // Extrair assunto se foi sugerido
        const responseText = data.response
        const subjectMatch = responseText.match(/Assunto:\s*(.+)/i)
        if (subjectMatch && !formData.subject) {
          handleInputChange('subject', subjectMatch[1].trim())
        }
        
        // Remover linha do assunto do corpo
        const emailBody = responseText.replace(/Assunto:\s*.+\n?\n?/i, '').trim()
        
        handleInputChange('generatedDraft', emailBody)
        handleInputChange('finalEmail', emailBody)
        setStep('preview')
      } else {
        throw new Error('Não foi possível gerar o rascunho')
      }
    } catch (error) {
      console.error('Erro ao gerar rascunho:', error)
      alert('Erro ao gerar rascunho: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const startEditing = () => {
    setFormData(prev => ({
      ...prev,
      isEditing: true
    }))
    setStep('edit')
  }

  const saveEdit = () => {
    setFormData(prev => ({
      ...prev,
      isEditing: false
    }))
    setStep('preview')
  }

  const sendEmail = async () => {
    setLoading(true)
    try {
      const emailData = {
        to: formData.recipientEmail,
        subject: formData.subject,
        message: formData.finalEmail,
        agent_used: formData.selectedAgent,
        sender_name: formData.senderName,
        sender_email: formData.senderEmail,
        context: {
          objective: formData.objective,
          tone: formData.tone,
          recipient: {
            name: formData.recipientName,
            company: formData.recipientCompany,
            position: formData.recipientPosition
          }
        }
      }

      const { data, error } = await supabase.functions.invoke('email-sender', {
        body: emailData
      })

      if (error) throw error

      alert('✅ Email enviado com sucesso!')
      
      // Reset form
      setFormData({
        recipientName: '',
        recipientEmail: '',
        recipientCompany: '',
        recipientPosition: '',
        senderName: '',
        senderEmail: '',
        senderPosition: '',
        senderCompany: '',
        subject: '',
        objective: '',
        tone: 'formal',
        context: '',
        callToAction: '',
        selectedAgent: '',
        useAI: true,
        generatedDraft: '',
        isEditing: false,
        finalEmail: ''
      })
      setStep('compose')
      
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      alert('❌ Erro ao enviar email: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const selectedAgentInfo = AGENT_FORCES.find(agent => agent.id === formData.selectedAgent)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compor Email</h1>
          <p className="text-gray-600 mt-1">Crie emails personalizados com inteligência artificial</p>
        </div>
        
        {/* Indicador de progresso */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${step === 'compose' ? 'bg-blue-500' : 'bg-green-500'}`} />
          <div className={`w-3 h-3 rounded-full ${['preview', 'edit'].includes(step) ? 'bg-blue-500' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${step === 'send' ? 'bg-blue-500' : 'bg-gray-300'}`} />
        </div>
      </div>

      {step === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Dados do Destinatário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Destinatário
              </CardTitle>
              <CardDescription>Informações sobre quem receberá o email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="recipientEmail">Email do Destinatário *</Label>
                <Input
                  id="recipientEmail"
                  placeholder="contato@empresa.com"
                  value={formData.recipientEmail}
                  onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                  className={errors.recipientEmail ? 'border-red-500' : 'focus:border-purple-800 focus:ring-purple-800'}
                />
                {errors.recipientEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.recipientEmail}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="recipientName">Nome do Destinatário</Label>
                <Input
                  id="recipientName"
                  placeholder="João Silva"
                  value={formData.recipientName}
                  onChange={(e) => handleInputChange('recipientName', e.target.value)}
                  className="focus:border-purple-800 focus:ring-purple-800"
                />
              </div>
              
              <div>
                <Label htmlFor="recipientCompany">Empresa</Label>
                <Input
                  id="recipientCompany"
                  placeholder="Empresa ABC Ltda"
                  value={formData.recipientCompany}
                  onChange={(e) => handleInputChange('recipientCompany', e.target.value)}
                  className="focus:border-purple-800 focus:ring-purple-800"
                />
              </div>
              
              <div>
                <Label htmlFor="recipientPosition">Cargo/Posição</Label>
                <Input
                  id="recipientPosition"
                  placeholder="Diretor Comercial"
                  value={formData.recipientPosition}
                  onChange={(e) => handleInputChange('recipientPosition', e.target.value)}
                  className="focus:border-purple-800 focus:ring-purple-800"
                />
              </div>
            </CardContent>
          </Card>

          {/* Coluna 2: Dados do Remetente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Remetente
              </CardTitle>
              <CardDescription>Seus dados como remetente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="senderName">Seu Nome *</Label>
                <Input
                  id="senderName"
                  placeholder="Maria Santos"
                  value={formData.senderName}
                  onChange={(e) => handleInputChange('senderName', e.target.value)}
                  className={errors.senderName ? 'border-red-500' : 'focus:border-purple-800 focus:ring-purple-800'}
                />
                {errors.senderName && (
                  <p className="text-red-500 text-sm mt-1">{errors.senderName}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="senderEmail">Seu Email *</Label>
                <Input
                  id="senderEmail"
                  placeholder="maria@minhaempresa.com"
                  value={formData.senderEmail}
                  onChange={(e) => handleInputChange('senderEmail', e.target.value)}
                  className={errors.senderEmail ? 'border-red-500' : 'focus:border-purple-800 focus:ring-purple-800'}
                />
                {errors.senderEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.senderEmail}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="senderPosition">Seu Cargo</Label>
                <Input
                  id="senderPosition"
                  placeholder="Consultora de Vendas"
                  value={formData.senderPosition}
                  onChange={(e) => handleInputChange('senderPosition', e.target.value)}
                  className="focus:border-purple-800 focus:ring-purple-800"
                />
              </div>
              
              <div>
                <Label htmlFor="senderCompany">Sua Empresa</Label>
                <Input
                  id="senderCompany"
                  placeholder="Minha Empresa Ltda"
                  value={formData.senderCompany}
                  onChange={(e) => handleInputChange('senderCompany', e.target.value)}
                  className="focus:border-purple-800 focus:ring-purple-800"
                />
              </div>
            </CardContent>
          </Card>

          {/* Coluna 3: Configurações do Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações
              </CardTitle>
              <CardDescription>Objetivo e tom do email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="objective">Objetivo do Email *</Label>
                <Select value={formData.objective} onValueChange={(value) => handleInputChange('objective', value)}>
                  <SelectTrigger className={errors.objective ? 'border-red-500' : 'focus:border-purple-800 focus:ring-purple-800'}>
                    <SelectValue placeholder="Selecione o objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMAIL_OBJECTIVES.map((obj) => (
                      <SelectItem key={obj.value} value={obj.value}>
                        <div className="text-left">
                          <div className="font-medium text-left">{obj.label}</div>
                          <div className="text-sm text-gray-500 text-left">{obj.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.objective && (
                  <p className="text-red-500 text-sm mt-1">{errors.objective}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="tone">Tom do Email</Label>
                <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                  <SelectTrigger className="focus:border-purple-800 focus:ring-purple-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMAIL_TONES.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        <div className="text-left">
                          <div className="font-medium text-left">{tone.label}</div>
                          <div className="text-sm text-gray-500 text-left">{tone.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="subject">Assunto (opcional)</Label>
                <Input
                  id="subject"
                  placeholder="A IA pode sugerir um assunto"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="focus:border-purple-800 focus:ring-purple-800"
                />
              </div>
              
              <div>
                <Label htmlFor="callToAction">Call to Action</Label>
                <Input
                  id="callToAction"
                  placeholder="ex: Agendar reunião, Solicitar proposta"
                  value={formData.callToAction}
                  onChange={(e) => handleInputChange('callToAction', e.target.value)}
                  className="focus:border-purple-800 focus:ring-purple-800"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contexto Adicional e Força Tarefa */}
      {step === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Contexto Adicional
              </CardTitle>
              <CardDescription>Informações extras para personalizar o email</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ex: Conheci a empresa no evento X, vi que vocês lançaram um novo produto, tenho uma solução que pode ajudar com..."
                value={formData.context}
                onChange={(e) => handleInputChange('context', e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Força Tarefa IA *
              </CardTitle>
              <CardDescription>Escolha o especialista para criar seu email</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={formData.selectedAgent} onValueChange={(value) => handleInputChange('selectedAgent', value)}>
                <SelectTrigger className={errors.selectedAgent ? 'border-red-500' : 'focus:border-purple-800 focus:ring-purple-800'}>
                  <SelectValue placeholder="Selecione uma força tarefa" />
                </SelectTrigger>
                <SelectContent>
                  {AGENT_FORCES.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center gap-3 text-left">
                        <span>{agent.icon}</span>
                        <div className="text-left">
                          <div className="font-medium text-left">{agent.name}</div>
                          <div className="text-sm text-gray-500 text-left">{agent.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.selectedAgent && (
                <p className="text-red-500 text-sm mt-1">{errors.selectedAgent}</p>
              )}
              
              {selectedAgentInfo && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{selectedAgentInfo.icon}</span>
                    <Badge className={selectedAgentInfo.color}>
                      {selectedAgentInfo.name}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{selectedAgentInfo.specialty}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Botões de Ação para Compose */}
      {step === 'compose' && (
        <div className="flex justify-center">
          <Button 
            onClick={generateDraft}
            disabled={loading}
            size="lg"
            className="px-8 bg-purple-800 hover:bg-purple-700 text-white"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Gerando Rascunho...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Rascunho com IA
              </>
            )}
          </Button>
        </div>
      )}

      {/* Preview do Rascunho */}
      {step === 'preview' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview do Email
            </CardTitle>
            <CardDescription>Revise o rascunho gerado pela IA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Assunto:</Label>
              <div className="p-3 bg-gray-50 rounded border font-medium">
                {formData.subject}
              </div>
            </div>
            
            <div>
              <Label>Conteúdo:</Label>
              <div className="p-4 bg-gray-50 rounded border whitespace-pre-wrap">
                {formData.finalEmail}
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep('compose')}>
                <X className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              
              <div className="space-x-2">
                <Button variant="outline" onClick={startEditing}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar Rascunho
                </Button>
                
                <Button onClick={sendEmail} disabled={loading} className="bg-purple-800 hover:bg-purple-700 text-white">
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editor de Rascunho */}
      {step === 'edit' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Editar Rascunho
            </CardTitle>
            <CardDescription>Faça os ajustes necessários no email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="editSubject">Assunto:</Label>
              <Input
                id="editSubject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="editContent">Conteúdo:</Label>
              <Textarea
                id="editContent"
                value={formData.finalEmail}
                onChange={(e) => handleInputChange('finalEmail', e.target.value)}
                rows={12}
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep('preview')}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              
              <Button onClick={saveEdit} className="bg-purple-800 hover:bg-purple-700 text-white">
                <Check className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 