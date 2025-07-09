import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Textarea } from '../components/ui/textarea'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { supabase } from '../lib/supabase'
import { CheckCircle, XCircle, Edit, Clock, Mail, User, Calendar, AlertTriangle } from 'lucide-react'

export default function EmailSupervision() {
  const [pendingResponses, setPendingResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedResponse, setSelectedResponse] = useState(null)
  const [modifiedText, setModifiedText] = useState('')
  const [processing, setProcessing] = useState(false)
  const [stats, setStats] = useState({
    pending: 0,
    approved_today: 0,
    auto_sent_today: 0,
    avg_response_time: 0
  })

  useEffect(() => {
    loadPendingResponses()
    loadStats()
    // Recarregar a cada 30 segundos
    const interval = setInterval(loadPendingResponses, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadPendingResponses = async () => {
    try {
      const { data } = await supabase.functions.invoke('email-responder/pending')
      if (data?.success) {
        setPendingResponses(data.responses)
        setStats(prev => ({ ...prev, pending: data.count }))
      }
    } catch (error) {
      console.error('Erro ao carregar respostas pendentes:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Buscar estatísticas do dia
      const { data: dailyStats } = await supabase
        .from('email_activity_logs')
        .select('action')
        .gte('created_at', today)
      
      const approved = dailyStats?.filter(log => log.action === 'approved_sent').length || 0
      const autoSent = dailyStats?.filter(log => log.action === 'auto_sent').length || 0
      
      setStats(prev => ({
        ...prev,
        approved_today: approved,
        auto_sent_today: autoSent
      }))
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const handleApprove = async (responseId) => {
    setProcessing(true)
    try {
      const { data } = await supabase.functions.invoke('email-responder/approve', {
        body: {
          suggestionId: responseId,
          approvedBy: 'supervisor@empresa.com' // Aqui você pegaria do usuário logado
        }
      })
      
      if (data?.success) {
        await loadPendingResponses()
        await loadStats()
        alert('✅ Email aprovado e enviado com sucesso!')
      } else {
        alert('❌ Erro ao enviar email: ' + data?.message)
      }
    } catch (error) {
      alert('❌ Erro ao aprovar resposta: ' + error.message)
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (responseId, reason) => {
    setProcessing(true)
    try {
      const { data } = await supabase.functions.invoke('email-responder/reject', {
        body: {
          suggestionId: responseId,
          rejectedBy: 'supervisor@empresa.com',
          reason: reason || 'Não especificado'
        }
      })
      
      if (data?.success) {
        await loadPendingResponses()
        alert('❌ Resposta rejeitada')
      }
    } catch (error) {
      alert('❌ Erro ao rejeitar resposta: ' + error.message)
    } finally {
      setProcessing(false)
    }
  }

  const handleModify = async (responseId) => {
    if (!modifiedText.trim()) {
      alert('Digite o texto modificado')
      return
    }

    setProcessing(true)
    try {
      const { data } = await supabase.functions.invoke('email-responder/modify', {
        body: {
          suggestionId: responseId,
          modifiedResponse: modifiedText,
          modifiedBy: 'supervisor@empresa.com'
        }
      })
      
      if (data?.success) {
        await loadPendingResponses()
        await loadStats()
        setSelectedResponse(null)
        setModifiedText('')
        alert('✅ Email modificado e enviado!')
      } else {
        alert('❌ Erro ao enviar email modificado: ' + data?.message)
      }
    } catch (error) {
      alert('❌ Erro ao modificar resposta: ' + error.message)
    } finally {
      setProcessing(false)
    }
  }

  const getPriorityColor = (priority) => {
    if (priority >= 8) return 'destructive'
    if (priority >= 6) return 'secondary'
    return 'default'
  }

  const getIntentColor = (intent) => {
    const colors = {
      complaint: 'destructive',
      urgent: 'destructive', 
      support: 'secondary',
      sales: 'default',
      billing: 'outline',
      inquiry: 'outline'
    }
    return colors[intent] || 'outline'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando respostas pendentes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Supervisão de Emails</h1>
          <p className="text-gray-600">Gerencie respostas sugeridas pelas forças tarefa</p>
        </div>
        <Button onClick={loadPendingResponses} disabled={processing}>
          🔄 Atualizar
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.approved_today}</p>
                <p className="text-sm text-gray-600">Aprovados hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.auto_sent_today}</p>
                <p className="text-sm text-gray-600">Auto-enviados hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{pendingResponses.filter(r => r.email_analysis?.[0]?.priority >= 8).length}</p>
                <p className="text-sm text-gray-600">Alta prioridade</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de respostas pendentes */}
      <div className="space-y-4">
        {pendingResponses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma resposta pendente!</h3>
              <p className="text-gray-600">Todas as sugestões foram processadas.</p>
            </CardContent>
          </Card>
        ) : (
          pendingResponses.map((response) => (
            <Card key={response.id} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{response.emails.subject}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {response.emails.from_email}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(response.created_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {response.email_analysis?.[0] && (
                      <>
                        <Badge variant={getIntentColor(response.email_analysis[0].intent)}>
                          {response.email_analysis[0].intent}
                        </Badge>
                        <Badge variant={getPriorityColor(response.email_analysis[0].priority)}>
                          P{response.email_analysis[0].priority}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="original" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="original">Email Original</TabsTrigger>
                    <TabsTrigger value="suggestion">Sugestão IA</TabsTrigger>
                    <TabsTrigger value="agents">Análises</TabsTrigger>
                  </TabsList>

                  <TabsContent value="original" className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Conteúdo do email:</h4>
                      <p className="whitespace-pre-wrap">{response.emails.body_text}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="suggestion" className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Resposta sugerida:</h4>
                        <Badge>{(response.confidence_score * 100).toFixed(0)}% confiança</Badge>
                      </div>
                      <p className="whitespace-pre-wrap">{response.suggested_response}</p>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleApprove(response.id)}
                        disabled={processing}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar e Enviar
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedResponse(response.id)
                          setModifiedText(response.suggested_response)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modificar
                      </Button>
                      
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Tem certeza que deseja rejeitar esta resposta?')) {
                            handleReject(response.id)
                          }
                        }}
                        disabled={processing}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeitar
                      </Button>
                    </div>

                    {selectedResponse === response.id && (
                      <div className="space-y-4 border-t pt-4">
                        <h4 className="font-semibold">Modificar resposta:</h4>
                        <Textarea
                          value={modifiedText}
                          onChange={(e) => setModifiedText(e.target.value)}
                          rows={6}
                          placeholder="Digite sua versão modificada..."
                        />
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleModify(response.id)}
                            disabled={processing}
                          >
                            Enviar Modificado
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setSelectedResponse(null)
                              setModifiedText('')
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="agents" className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Agentes utilizados:</h4>
                      <div className="flex flex-wrap gap-2">
                        {response.agents_used?.map((agent, index) => (
                          <Badge key={index} variant="outline">
                            {agent}
                          </Badge>
                        ))}
                      </div>
                      {response.email_analysis?.[0] && (
                        <Alert>
                          <AlertDescription>
                            <strong>Análise:</strong> Intenção "{response.email_analysis[0].intent}" 
                            {response.email_analysis[0].sentiment && 
                              ` • Sentimento: ${response.email_analysis[0].sentiment.emotion}`
                            }
                            {response.email_analysis[0].sentiment?.urgency && 
                              ` • Urgência: ${response.email_analysis[0].sentiment.urgency}`
                            }
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 