import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  MessageSquare,
  Phone,
  Mail,
  Users,
  Share2,
  Clock,
  UserCheck,
  Activity,
  ThumbsUp,
  MessageCircle,
  BarChart2,
  Bot,
  RefreshCw,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  HelpCircle,
  PieChart as PieChartIcon,
  TrendingUp,
  CpuIcon,
  ZapIcon
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import CircularProgressRing from './CircularProgressRing';

// Ícones para cada canal
const channelIcons = {
  whatsapp: <MessageSquare className="w-5 h-5 text-green-500" />,
  email: <Mail className="w-5 h-5 text-blue-500" />,
  telefonia: <Phone className="w-5 h-5 text-purple-500" />,
  teams: <Users className="w-5 h-5 text-indigo-500" />,
  redes_sociais: <Share2 className="w-5 h-5 text-pink-500" />
};

// Dados de métricas por canal
const channelMetrics = {
  whatsapp: {
    total_interacoes: 7523,
    tempo_medio_resposta: 1.8,
    taxa_satisfacao: 92,
    taxa_resolucao: 88,
    performance_timeline: [
      { data: '01/06', interacoes: 210, tempo_resposta: 1.9, taxa_satisfacao: 90 },
      { data: '08/06', interacoes: 245, tempo_resposta: 1.8, taxa_satisfacao: 91 },
      { data: '15/06', interacoes: 280, tempo_resposta: 1.7, taxa_satisfacao: 92 },
      { data: '22/06', interacoes: 315, tempo_resposta: 1.6, taxa_satisfacao: 93 },
      { data: '29/06', interacoes: 350, tempo_resposta: 1.8, taxa_satisfacao: 92 }
    ],
    distribuicao_assuntos: [
      { nome: 'Suporte', valor: 40 },
      { nome: 'Vendas', valor: 25 },
      { nome: 'Informações', valor: 20 },
      { nome: 'Reclamações', valor: 15 }
    ],
    metricas_especificas: {
      taxa_leitura: 98,
      tempo_primeira_resposta: 0.9,
      taxa_uso_midia: 62,
      taxa_transferencia: 12
    }
  },
  email: {
    total_interacoes: 3184,
    tempo_medio_resposta: 4.3,
    taxa_satisfacao: 87,
    taxa_resolucao: 84,
    performance_timeline: [
      { data: '01/06', interacoes: 95, tempo_resposta: 4.5, taxa_satisfacao: 86 },
      { data: '08/06', interacoes: 110, tempo_resposta: 4.4, taxa_satisfacao: 86 },
      { data: '15/06', interacoes: 125, tempo_resposta: 4.3, taxa_satisfacao: 87 },
      { data: '22/06', interacoes: 140, tempo_resposta: 4.2, taxa_satisfacao: 87 },
      { data: '29/06', interacoes: 155, tempo_resposta: 4.3, taxa_satisfacao: 88 }
    ],
    distribuicao_assuntos: [
      { nome: 'Suporte', valor: 30 },
      { nome: 'Vendas', valor: 20 },
      { nome: 'Informações', valor: 35 },
      { nome: 'Reclamações', valor: 15 }
    ],
    metricas_especificas: {
      taxa_abertura: 76,
      tempo_resposta_completa: 6.2,
      taxa_anexos: 45,
      taxa_encaminhamento: 18
    }
  },
  telefonia: {
    total_interacoes: 2650,
    tempo_medio_resposta: 0.8,
    taxa_satisfacao: 89,
    taxa_resolucao: 82,
    performance_timeline: [
      { data: '01/06', interacoes: 78, tempo_resposta: 0.9, taxa_satisfacao: 88 },
      { data: '08/06', interacoes: 85, tempo_resposta: 0.8, taxa_satisfacao: 89 },
      { data: '15/06', interacoes: 92, tempo_resposta: 0.8, taxa_satisfacao: 89 },
      { data: '22/06', interacoes: 99, tempo_resposta: 0.7, taxa_satisfacao: 90 },
      { data: '29/06', interacoes: 106, tempo_resposta: 0.8, taxa_satisfacao: 89 }
    ],
    distribuicao_assuntos: [
      { nome: 'Suporte', valor: 45 },
      { nome: 'Vendas', valor: 20 },
      { nome: 'Informações', valor: 15 },
      { nome: 'Reclamações', valor: 20 }
    ],
    metricas_especificas: {
      duracao_media_chamada: 3.2,
      taxa_abandono: 8,
      tempo_espera: 0.6,
      taxa_transferencia: 14
    }
  },
  teams: {
    total_interacoes: 1850,
    tempo_medio_resposta: 2.1,
    taxa_satisfacao: 91,
    taxa_resolucao: 87,
    performance_timeline: [
      { data: '01/06', interacoes: 52, tempo_resposta: 2.2, taxa_satisfacao: 90 },
      { data: '08/06', interacoes: 59, tempo_resposta: 2.1, taxa_satisfacao: 91 },
      { data: '15/06', interacoes: 66, tempo_resposta: 2.0, taxa_satisfacao: 91 },
      { data: '22/06', interacoes: 73, tempo_resposta: 2.1, taxa_satisfacao: 92 },
      { data: '29/06', interacoes: 80, tempo_resposta: 2.1, taxa_satisfacao: 91 }
    ],
    distribuicao_assuntos: [
      { nome: 'Suporte', valor: 25 },
      { nome: 'Vendas', valor: 15 },
      { nome: 'Informações', valor: 40 },
      { nome: 'Reclamações', valor: 20 }
    ],
    metricas_especificas: {
      uso_midia_rica: 58,
      integracao_sistemas: 76,
      tempo_resolucao: 4.3,
      taxa_compartilhamento: 42
    }
  },
  redes_sociais: {
    total_interacoes: 1250,
    tempo_medio_resposta: 3.2,
    taxa_satisfacao: 85,
    taxa_resolucao: 79,
    performance_timeline: [
      { data: '01/06', interacoes: 35, tempo_resposta: 3.3, taxa_satisfacao: 84 },
      { data: '08/06', interacoes: 42, tempo_resposta: 3.2, taxa_satisfacao: 85 },
      { data: '15/06', interacoes: 49, tempo_resposta: 3.1, taxa_satisfacao: 85 },
      { data: '22/06', interacoes: 56, tempo_resposta: 3.2, taxa_satisfacao: 86 },
      { data: '29/06', interacoes: 63, tempo_resposta: 3.2, taxa_satisfacao: 85 }
    ],
    distribuicao_assuntos: [
      { nome: 'Suporte', valor: 20 },
      { nome: 'Vendas', valor: 15 },
      { nome: 'Informações', valor: 25 },
      { nome: 'Reclamações', valor: 40 }
    ],
    metricas_especificas: {
      engajamento: 64,
      alcance: 12500,
      sentimento_positivo: 72,
      taxa_resposta_publica: 68
    }
  }
};

// Cores para gráficos
const COLORS = ['#8B5CF6', '#EC4899', '#6366F1', '#22C55E', '#F59E0B'];

// Dados de analytics de agentes para cada canal
const agentAnalytics = {
  whatsapp: {
    agents_performance: [
      { nome: 'Assistente de Vendas', taxa_resolucao: 92, tempo_resposta: 1.2, interacoes: 2450 },
      { nome: 'Assistente de Suporte', taxa_resolucao: 88, tempo_resposta: 1.5, interacoes: 1980 },
      { nome: 'Assistente Financeiro', taxa_resolucao: 90, tempo_resposta: 1.3, interacoes: 1640 },
      { nome: 'Assistente de Produtos', taxa_resolucao: 86, tempo_resposta: 1.7, interacoes: 1453 }
    ],
    performance_trend: [
      { data: '01/06', taxa_sucesso: 87, taxa_transferencia: 8, taxa_abandono: 5 },
      { data: '08/06', taxa_sucesso: 89, taxa_transferencia: 7, taxa_abandono: 4 },
      { data: '15/06', taxa_sucesso: 91, taxa_transferencia: 6, taxa_abandono: 3 },
      { data: '22/06', taxa_sucesso: 90, taxa_transferencia: 7, taxa_abandono: 3 },
      { data: '29/06', taxa_sucesso: 92, taxa_transferencia: 5, taxa_abandono: 3 }
    ],
    insights: [
      { descricao: 'Aumento de 12% na taxa de resolução no primeiro contato', impacto: 'alto', tipo: 'positivo' },
      { descricao: 'Redução de 8% no tempo médio de resposta', impacto: 'médio', tipo: 'positivo' },
      { descricao: 'Detecção de 15% mais intenções de usuário', impacto: 'médio', tipo: 'positivo' }
    ]
  },
  email: {
    agents_performance: [
      { nome: 'Assistente de Comunicação', taxa_resolucao: 85, tempo_resposta: 4.1, interacoes: 1250 },
      { nome: 'Assistente Corporativo', taxa_resolucao: 87, tempo_resposta: 3.8, interacoes: 1050 },
      { nome: 'Assistente de Marketing', taxa_resolucao: 82, tempo_resposta: 4.5, interacoes: 884 },
    ],
    performance_trend: [
      { data: '01/06', taxa_sucesso: 83, taxa_transferencia: 10, taxa_abandono: 7 },
      { data: '08/06', taxa_sucesso: 84, taxa_transferencia: 9, taxa_abandono: 7 },
      { data: '15/06', taxa_sucesso: 85, taxa_transferencia: 9, taxa_abandono: 6 },
      { data: '22/06', taxa_sucesso: 87, taxa_transferencia: 8, taxa_abandono: 5 },
      { data: '29/06', taxa_sucesso: 88, taxa_transferencia: 7, taxa_abandono: 5 }
    ],
    insights: [
      { descricao: 'Melhoria de 5% na identificação de anexos', impacto: 'médio', tipo: 'positivo' },
      { descricao: 'Aumento de 7% na satisfação do cliente', impacto: 'alto', tipo: 'positivo' },
      { descricao: 'Necessidade de aprimoramento no processamento de HTML complexo', impacto: 'baixo', tipo: 'negativo' }
    ]
  },
  telefonia: {
    agents_performance: [
      { nome: 'Assistente de URA', taxa_resolucao: 80, tempo_resposta: 0.7, interacoes: 1520 },
      { nome: 'Assistente de Call Center', taxa_resolucao: 83, tempo_resposta: 0.8, interacoes: 1130 },
    ],
    performance_trend: [
      { data: '01/06', taxa_sucesso: 78, taxa_transferencia: 12, taxa_abandono: 10 },
      { data: '08/06', taxa_sucesso: 79, taxa_transferencia: 12, taxa_abandono: 9 },
      { data: '15/06', taxa_sucesso: 80, taxa_transferencia: 11, taxa_abandono: 9 },
      { data: '22/06', taxa_sucesso: 82, taxa_transferencia: 10, taxa_abandono: 8 },
      { data: '29/06', taxa_sucesso: 83, taxa_transferencia: 10, taxa_abandono: 7 }
    ],
    insights: [
      { descricao: 'Redução de 10% no tempo médio de atendimento', impacto: 'alto', tipo: 'positivo' },
      { descricao: 'Necessidade de melhorar reconhecimento de sotaques', impacto: 'médio', tipo: 'negativo' },
      { descricao: 'Aumento de 5% na transferência para humanos', impacto: 'baixo', tipo: 'negativo' }
    ]
  },
  teams: {
    agents_performance: [
      { nome: 'Assistente Corporativo', taxa_resolucao: 89, tempo_resposta: 2.0, interacoes: 980 },
      { nome: 'Assistente de Projetos', taxa_resolucao: 90, tempo_resposta: 1.9, interacoes: 870 },
    ],
    performance_trend: [
      { data: '01/06', taxa_sucesso: 88, taxa_transferencia: 8, taxa_abandono: 4 },
      { data: '08/06', taxa_sucesso: 89, taxa_transferencia: 7, taxa_abandono: 4 },
      { data: '15/06', taxa_sucesso: 90, taxa_transferencia: 7, taxa_abandono: 3 },
      { data: '22/06', taxa_sucesso: 90, taxa_transferencia: 7, taxa_abandono: 3 },
      { data: '29/06', taxa_sucesso: 91, taxa_transferencia: 6, taxa_abandono: 3 }
    ],
    insights: [
      { descricao: 'Melhoria na integração com aplicativos do MS Teams', impacto: 'alto', tipo: 'positivo' },
      { descricao: 'Aumento de 15% na colaboração documental', impacto: 'médio', tipo: 'positivo' },
      { descricao: 'Necessidade de aprimorar respostas em tempo real', impacto: 'médio', tipo: 'negativo' }
    ]
  },
  redes_sociais: {
    agents_performance: [
      { nome: 'Assistente de Redes Sociais', taxa_resolucao: 78, tempo_resposta: 3.1, interacoes: 850 },
      { nome: 'Assistente de Engajamento', taxa_resolucao: 80, tempo_resposta: 2.9, interacoes: 400 },
    ],
    performance_trend: [
      { data: '01/06', taxa_sucesso: 75, taxa_transferencia: 15, taxa_abandono: 10 },
      { data: '08/06', taxa_sucesso: 76, taxa_transferencia: 14, taxa_abandono: 10 },
      { data: '15/06', taxa_sucesso: 78, taxa_transferencia: 13, taxa_abandono: 9 },
      { data: '22/06', taxa_sucesso: 79, taxa_transferencia: 12, taxa_abandono: 9 },
      { data: '29/06', taxa_sucesso: 80, taxa_transferencia: 12, taxa_abandono: 8 }
    ],
    insights: [
      { descricao: 'Melhoria de 8% na detecção de sentimento', impacto: 'alto', tipo: 'positivo' },
      { descricao: 'Aumento de 12% no engajamento', impacto: 'médio', tipo: 'positivo' },
      { descricao: 'Necessidade de aprimorar análise de imagens', impacto: 'médio', tipo: 'negativo' }
    ]
  }
};

export default function AgentNavigator() {
  const [selectedChannel, setSelectedChannel] = useState('whatsapp');
  const [timeRange, setTimeRange] = useState('30d');
  const [navMode, setNavMode] = useState('channel');

  // Obter dados do canal selecionado
  const channelData = channelMetrics[selectedChannel];
  const analyticsData = agentAnalytics[selectedChannel];

  return (
    <div className="space-y-6">
      {/* Header e seleção de período */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Navegador de Agentes por Canal</h2>
          <p className="text-gray-500">Análise de desempenho e métricas por canal de comunicação</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={navMode} onValueChange={setNavMode} className="w-48">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="channel">Canal</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24h</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="15d">Últimos 15 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Navegação por canais */}
      <Tabs defaultValue="whatsapp" value={selectedChannel} onValueChange={setSelectedChannel} className="w-full">
        <TabsList className="w-full grid grid-cols-5 mb-6">
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="telefonia" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>Telefonia</span>
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Teams</span>
          </TabsTrigger>
          <TabsTrigger value="redes_sociais" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            <span>Redes Sociais</span>
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo para cada canal */}
        {Object.keys(channelMetrics).map((channel) => (
          <TabsContent key={channel} value={channel} className="space-y-6">
            <Tabs value={navMode} className="w-full">
              <TabsContent value="channel" className="space-y-6">
                {/* KPIs Principais */}
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="border border-indigo-100 bg-white shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-400"></div>
                    <CardHeader className="pb-2 pt-5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-500">
                          Total de Atendimentos
                        </CardTitle>
                        {channelIcons[channel]}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="text-3xl font-bold text-indigo-900 mb-2">{channelMetrics[channel].total_interacoes.toLocaleString()}</div>
                      <div className="flex items-center px-2 py-1 bg-indigo-50 rounded-full w-fit">
                        <ArrowUp className="w-3 h-3 mr-1 text-indigo-600" />
                        <span className="text-xs text-indigo-600 font-medium">5.2% vs período anterior</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-purple-100 bg-white shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-400"></div>
                    <CardHeader className="pb-2 pt-5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-500">
                          Tempo Médio de Resposta
                        </CardTitle>
                        <Clock className="w-5 h-5 text-purple-500" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="text-3xl font-bold text-purple-900 mb-2">{channelMetrics[channel].tempo_medio_resposta} min</div>
                      <div className="flex items-center px-2 py-1 bg-purple-50 rounded-full w-fit">
                        <ArrowDown className="w-3 h-3 mr-1 text-purple-600" />
                        <span className="text-xs text-purple-600 font-medium">8.3% vs período anterior</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-green-100 bg-white shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-green-500 to-green-400"></div>
                    <CardHeader className="pb-2 pt-5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-500">
                          Taxa de Satisfação
                        </CardTitle>
                        <ThumbsUp className="w-5 h-5 text-green-500" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="text-3xl font-bold text-green-900 mb-2">{channelMetrics[channel].taxa_satisfacao}%</div>
                      <div className="flex items-center px-2 py-1 bg-green-50 rounded-full w-fit">
                        <ArrowUp className="w-3 h-3 mr-1 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">2.1% vs período anterior</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-amber-100 bg-white shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-400"></div>
                    <CardHeader className="pb-2 pt-5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-500">
                          Taxa de Resolução
                        </CardTitle>
                        <CheckCircle className="w-5 h-5 text-amber-500" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="text-3xl font-bold text-amber-900 mb-2">{channelMetrics[channel].taxa_resolucao}%</div>
                      <div className="flex items-center px-2 py-1 bg-amber-50 rounded-full w-fit">
                        <ArrowUp className="w-3 h-3 mr-1 text-amber-600" />
                        <span className="text-xs text-amber-600 font-medium">3.5% vs período anterior</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Gráfico de Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance ao Longo do Tempo</CardTitle>
                    <CardDescription>Evolução do volume de interações e tempo de resposta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={channelMetrics[channel].performance_timeline}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="data" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="interacoes"
                            name="Interações"
                            stroke="#8B5CF6"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="tempo_resposta"
                            name="Tempo de Resposta (min)"
                            stroke="#EC4899"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Distribuição de Assuntos e Métricas Específicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuição de Assuntos</CardTitle>
                      <CardDescription>Principais temas abordados no canal</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={channelMetrics[channel].distribuicao_assuntos}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="valor"
                              nameKey="nome"
                              label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {channelMetrics[channel].distribuicao_assuntos.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Métricas Específicas do Canal</CardTitle>
                      <CardDescription>Indicadores especializados para {
                        channel === 'whatsapp' ? 'WhatsApp' :
                        channel === 'email' ? 'Email' :
                        channel === 'telefonia' ? 'Telefonia' :
                        channel === 'teams' ? 'Teams' : 'Redes Sociais'
                      }</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(channelMetrics[channel].metricas_especificas).map(([key, value], index) => (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </span>
                              <span className="text-sm font-semibold">
                                {typeof value === 'number' && key.includes('tempo') ? `${value} min` : 
                                 typeof value === 'number' && key.includes('taxa') ? `${value}%` : 
                                 value.toLocaleString()}
                              </span>
                            </div>
                            <Progress value={typeof value === 'number' && value <= 100 ? value : 
                                             typeof value === 'number' && value > 100 ? 100 : 0} 
                                     className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                {/* Agent Analytics Content */}
                <div className="grid gap-5 md:grid-cols-3">
                  <Card className="border border-indigo-100 bg-white shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden col-span-2">
                    <div className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-400"></div>
                    <CardHeader className="pb-2 pt-5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-500">
                          Performance dos Agentes
                        </CardTitle>
                        <Bot className="w-5 h-5 text-indigo-500" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={analyticsData.agents_performance}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="nome" type="category" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="taxa_resolucao" name="Taxa de Resolução (%)" fill="#8B5CF6" />
                            <Bar dataKey="tempo_resposta" name="Tempo de Resposta (min)" fill="#EC4899" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-purple-100 bg-white shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden row-span-2">
                    <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-400"></div>
                    <CardHeader className="pb-2 pt-5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-500">
                          Insights de IA
                        </CardTitle>
                        <Lightbulb className="w-5 h-5 text-purple-500" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-4">
                        {analyticsData.insights.map((insight, index) => (
                          <div key={index} className={`p-3 rounded-lg ${
                            insight.tipo === 'positivo' ? 'bg-green-50 border border-green-100' : 
                            'bg-amber-50 border border-amber-100'
                          }`}>
                            <div className="flex items-start gap-2">
                              {insight.tipo === 'positivo' ? (
                                <ArrowUp className="w-4 h-4 mt-0.5 text-green-600" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-600" />
                              )}
                              <div>
                                <p className="text-sm text-gray-800 font-medium">{insight.descricao}</p>
                                <div className="flex items-center mt-1">
                                  <Badge className={`
                                    ${insight.impacto === 'alto' ? 'bg-purple-100 text-purple-800' : 
                                      insight.impacto === 'médio' ? 'bg-blue-100 text-blue-800' : 
                                      'bg-gray-100 text-gray-800'} mr-2`}>
                                    Impacto {insight.impacto}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-indigo-100 bg-white shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden col-span-2">
                    <div className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-400"></div>
                    <CardHeader className="pb-2 pt-5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-500">
                          Tendência de Performance
                        </CardTitle>
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={analyticsData.performance_trend}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="data" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="taxa_sucesso" name="Taxa de Sucesso (%)" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
                            <Area type="monotone" dataKey="taxa_transferencia" name="Taxa de Transferência (%)" stackId="1" stroke="#EC4899" fill="#EC4899" />
                            <Area type="monotone" dataKey="taxa_abandono" name="Taxa de Abandono (%)" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Agent Type Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Comparação de Tipos de Agentes</CardTitle>
                    <CardDescription>Análise de desempenho por categoria de agente</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative w-36 h-36">
                          <CircularProgressRing 
                            progress={92} 
                            size={144} 
                            strokeWidth={12} 
                            circleColor="#ddd" 
                            progressColor="#8B5CF6" 
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <PieChartIcon size={24} className="text-indigo-600 mb-1" />
                            <span className="text-2xl font-bold text-indigo-900">92%</span>
                            <span className="text-xs text-gray-500">Eficiência</span>
                          </div>
                        </div>
                        <h3 className="mt-4 font-medium text-center">Agentes Analíticos</h3>
                        <p className="text-xs text-center text-gray-500 mt-1">Especializados em análise de dados</p>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative w-36 h-36">
                          <CircularProgressRing 
                            progress={88} 
                            size={144} 
                            strokeWidth={12} 
                            circleColor="#ddd" 
                            progressColor="#EC4899" 
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <CpuIcon size={24} className="text-pink-600 mb-1" />
                            <span className="text-2xl font-bold text-pink-900">88%</span>
                            <span className="text-xs text-gray-500">Eficiência</span>
                          </div>
                        </div>
                        <h3 className="mt-4 font-medium text-center">Agentes de Processamento</h3>
                        <p className="text-xs text-center text-gray-500 mt-1">Especializados em execução de tarefas</p>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative w-36 h-36">
                          <CircularProgressRing 
                            progress={95} 
                            size={144} 
                            strokeWidth={12} 
                            circleColor="#ddd" 
                            progressColor="#22C55E" 
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <ZapIcon size={24} className="text-green-600 mb-1" />
                            <span className="text-2xl font-bold text-green-900">95%</span>
                            <span className="text-xs text-gray-500">Eficiência</span>
                          </div>
                        </div>
                        <h3 className="mt-4 font-medium text-center">Agentes Reativos</h3>
                        <p className="text-xs text-center text-gray-500 mt-1">Especializados em respostas rápidas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 