
import React, { useState, useEffect } from 'react';
import { Channel } from '@/api/entities';
import { AIAgent } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Clock,
  UserCheck,
  Activity,
  ArrowUp,
  ArrowDown,
  Percent,
  Bot,
  ChevronUp,
  ChevronDown,
  BarChart2,
  Phone,
  Mail,
  MessageCircle,
  User2,
  Users,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Download,
  GitBranch,
  AlertCircle,
  Check,
  ArrowUpCircle,
  Filter,
  Settings,
  ShieldCheck,
  CheckCircle,
  Lightbulb,
  Search
} from 'lucide-react';
import CircularProgressRing from '../components/dashboard/CircularProgressRing';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [channels, setChannels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const channelsData = await Channel.list();
        const agentsData = await AIAgent.list();
        setChannels(channelsData);
        setAgents(agentsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load data:', error);
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Dados principais do dashboard
  const dashboardStats = {
    total_interactions: 14872,
    avg_response_time: 2.47,
    satisfaction_score: 92,
    resolution_rate: 85
  };

  // Dados de desempenho dos agentes
  const agentsPerformance = {
    automation_rate: 91,
    transfers_rate: 17,
    most_efficient: [
      { name: 'Assistente Financeiro', efficiency: 94 },
      { name: 'Assistente Comercial', efficiency: 92 },
      { name: 'Assistente de RH', efficiency: 87 }
    ]
  };

  // Dados de performance dos canais
  const channelsPerformance = [
    { name: 'WhatsApp', value: 7523, percent: 42.5, change: '+12.3%' },
    { name: 'Email', value: 3184, percent: 23.8, change: '+3.6%' },
    { name: 'Live Chat', value: 1953, percent: 15.7, change: '+8.2%' }
  ];

  // Dados da integração IA + Humanos
  const integrationData = [
    { name: 'Atendimento Autônomo', value: 65 },
    { name: 'Pré-Atendimento', value: 15 },
    { name: 'Assistência Humana', value: 12 },
    { name: 'Escalação Manual', value: 8 }
  ];

  // Dados de performance por canal
  const channelMetrics = [
    { name: 'WhatsApp', interactions: 7250 },
    { name: 'Email', interactions: 3520 },
    { name: 'Live Chat', interactions: 2300 },
    { name: 'Teams', interactions: 1800 },
    { name: 'Redes Sociais', interactions: 1200 }
  ];

  // Dados de fluxo de jornada e gargalos
  const journeyFlowData = [
    { step: 'Identificação', atendidos: '93%', abandonos: '7%' },
    { step: 'Consulta de Pedidos', atendidos: '88%', abandonos: '12%' },
    { step: 'Resolução de Problemas', atendidos: '84%', abandonos: '16%' }
  ];

  // Cores para gráficos
  const COLORS = ['#8B5CF6', '#EC4899', '#6366F1', '#22C55E', '#F59E0B'];
  const PURPLE_GRADIENT = {
    start: '#8B5CF6',
    end: '#C084FC'
  };

  // Dados para gráfico de área de fluxo de jornada
  const journeyAreaData = [
    { name: 'Identificação', autom: 10, humano: 5 },
    { name: 'Consulta', autom: 15, humano: 8 },
    { name: 'Resolução', autom: 23, humano: 12 },
    { name: 'Feedback', autom: 28, humano: 15 }
  ];

  return (
    <div className="space-y-6">
      {/* Header e seleção de período */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Integrado</h1>
          <p className="text-gray-500">Visão consolidada de todos os canais de comunicação, agentes e métricas-chave</p>
        </div>
        <div className="flex items-center gap-3">
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
          
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Exportar Relatório</span>
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-indigo-100 bg-white shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-400"></div>
          <CardHeader className="pb-2 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total de Atendimentos
              </CardTitle>
              <MessageSquare className="w-5 h-5 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-indigo-900 mb-2">{dashboardStats.total_interactions.toLocaleString()}</div>
            <div className="flex items-center px-2 py-1 bg-indigo-50 rounded-full w-fit">
              <ArrowUp className="w-3 h-3 mr-1 text-indigo-600" />
              <span className="text-xs text-indigo-600 font-medium">5.2% vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-100 bg-white shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-400"></div>
          <CardHeader className="pb-2 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Tempo Médio de Resposta
              </CardTitle>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-blue-900 mb-2">{dashboardStats.avg_response_time} min</div>
            <div className="flex items-center px-2 py-1 bg-blue-50 rounded-full w-fit">
              <ArrowDown className="w-3 h-3 mr-1 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">0.2min vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-purple-100 bg-white shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-400"></div>
          <CardHeader className="pb-2 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Satisfação do Cliente
              </CardTitle>
              <UserCheck className="w-5 h-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-purple-900 mb-2">{dashboardStats.satisfaction_score}%</div>
            <div className="flex items-center px-2 py-1 bg-purple-50 rounded-full w-fit">
              <ArrowUp className="w-3 h-3 mr-1 text-purple-600" />
              <span className="text-xs text-purple-600 font-medium">3% vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-violet-100 bg-white shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-violet-500 to-violet-400"></div>
          <CardHeader className="pb-2 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Resolução no Primeiro Contato
              </CardTitle>
              <Percent className="w-5 h-5 text-violet-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-violet-900 mb-2">{dashboardStats.resolution_rate}%</div>
            <div className="flex items-center px-2 py-1 bg-violet-50 rounded-full w-fit">
              <ArrowUp className="w-3 h-3 mr-1 text-violet-600" />
              <span className="text-xs text-violet-600 font-medium">1.5% vs período anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção 1: Desempenho dos Agentes */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">

        <Card className="border border-indigo-100">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Bot className="mr-2 h-5 w-5 text-indigo-600" />
                Desempenho dos Agentes IA
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Gráfico Circular */}
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium text-gray-600 mb-4">Taxa de Automação</span>
                <div className="relative w-[280px]">
                  <div className="relative">
                    <CircularProgressRing 
                      size={280}
                      strokeWidth={20}
                      percentage={65}
                      color="#818CF8"
                      showLabel={false}
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CircularProgressRing 
                        size={220}
                        strokeWidth={18}
                        percentage={15}
                        color="#A78BFA"
                        showLabel={false}
                        startAngle={65 * 3.6}
                      />
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CircularProgressRing 
                        size={160}
                        strokeWidth={16}
                        percentage={12}
                        color="#C4B5FD"
                        showLabel={false}
                        startAngle={(65 + 15) * 3.6}
                      />
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CircularProgressRing 
                        size={100}
                        strokeWidth={14}
                        percentage={8}
                        color="#DDD6FE"
                        showLabel={false}
                        startAngle={(65 + 15 + 12) * 3.6}
                      />
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-indigo-900">91%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicadores */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Eficiência por Tipo
                </h3>
                
                {[
                  { 
                    name: 'Resolução Direta',
                    value: '65%',
                    color: 'bg-indigo-400',
                    description: 'Resoluções sem intervenção'
                  },
                  { 
                    name: 'Análise Preditiva',
                    value: '15%',
                    color: 'bg-indigo-500',
                    description: 'Antecipação de demandas'
                  },
                  { 
                    name: 'Suporte Assistido',
                    value: '12%',
                    color: 'bg-indigo-600',
                    description: 'IA + suporte humano'
                  },
                  { 
                    name: 'Aprendizado',
                    value: '8%',
                    color: 'bg-indigo-700',
                    description: 'Melhoria contínua'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-indigo-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                      <span className="text-lg font-bold text-indigo-600">{item.value}</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-7">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Integração IA + Humanos */}
        <Card className="border border-indigo-100">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Users className="mr-2 h-5 w-5 text-indigo-600" />
                Integração IA + Humanos
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[
                { name: 'Atendimento Autônomo', value: 65, color: '#818CF8' },
                { name: 'Pré-Atendimento', value: 15, color: '#A78BFA' },
                { name: 'Assistência Humana', value: 12, color: '#C4B5FD' },
                { name: 'Escalação Manual', value: 8, color: '#DDD6FE' }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600">{item.name}</span>
                    <span className="text-sm font-bold text-indigo-600">{item.value}%</span>
                  </div>
                  <div className="relative h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${item.value}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-indigo-600">92%</div>
                  <div className="text-sm text-gray-600">Taxa de Sucesso</div>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-indigo-600">-45%</div>
                  <div className="text-sm text-gray-600">Tempo de Resposta</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance dos Canais */}
      <Card className="border border-indigo-100">
        <CardHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Activity className="mr-2 h-5 w-5 text-indigo-600" />
              Performance dos Canais
            </CardTitle>
            <Select defaultValue="7d">
              <SelectTrigger className="w-[120px] h-8 text-sm bg-indigo-50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Últimas 24h</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Gráfico Principal */}
            <div className="md:col-span-3">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={channelMetrics}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    barSize={40}
                  >
                    <defs>
                      <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818CF8" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#C7D2FE" stopOpacity={0.5}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickFormatter={(value) => `${value/1000}k`}
                    />
                    <Tooltip
                      cursor={false}
                      contentStyle={{
                        backgroundColor: "#FFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      }}
                      formatter={(value) => [`${value.toLocaleString()} interações`]}
                    />
                    <Bar 
                      dataKey="interactions" 
                      fill="url(#colorInteractions)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Métricas Detalhadas */}
            <div className="md:col-span-2 space-y-4">
              {channelsPerformance.map((channel, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-50">
                        {idx === 0 && <MessageSquare className="w-5 h-5 text-indigo-600" />}
                        {idx === 1 && <Mail className="w-5 h-5 text-indigo-600" />}
                        {idx === 2 && <MessageCircle className="w-5 h-5 text-indigo-600" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">{channel.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">{channel.percent}% do total</span>
                          <Badge className={`text-xs ${
                            channel.change.startsWith('+') 
                              ? 'bg-indigo-50 text-indigo-700' 
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {channel.change}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-indigo-600">
                        {(channel.value/1000).toFixed(1)}k
                      </div>
                      <div className="text-xs text-gray-500">interações</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                        style={{ width: `${channel.percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Análise de Fluxo de Jornadas e Gargalos */}
      <Card className="border border-indigo-100">
        <CardHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              <GitBranch className="mr-2 h-5 w-5 text-indigo-600" />
              Análise de Fluxo de Jornadas
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select defaultValue="chat">
                <SelectTrigger className="w-[140px] h-8 text-sm bg-indigo-50 border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chat">Chatbot</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            {/* Timeline Avançada */}
            <div className="h-[180px] bg-white rounded-xl border border-indigo-100 relative overflow-visible p-6">
              {/* Linha de Base */}
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-indigo-100"></div>
              
              {/* Pontos de Progresso */}
              {[
                { 
                  stage: "Entrada",
                  users: 5240,
                  percent: 100,
                  status: "active",
                  icon: <MessageSquare className="w-4 h-4 text-white" />,
                  description: "Início do fluxo de atendimento"
                },
                { 
                  stage: "Identificação",
                  users: 4192,
                  percent: 80,
                  status: "active",
                  icon: <UserCheck className="w-4 h-4 text-white" />,
                  description: "Verificação e autenticação do usuário"
                },
                { 
                  stage: "Consulta",
                  users: 3144,
                  percent: 60,
                  status: "active",
                  icon: <Search className="w-4 h-4 text-white" />,
                  description: "Busca e categorização da demanda"
                },
                { 
                  stage: "Análise",
                  users: 2620,
                  percent: 50,
                  status: "attention",
                  icon: <Activity className="w-4 h-4 text-white" />,
                  description: "Processamento e análise do caso"
                },
                { 
                  stage: "Resolução",
                  users: 2096,
                  percent: 40,
                  status: "active",
                  icon: <CheckCircle className="w-4 h-4 text-white" />,
                  description: "Finalização e resolução do atendimento"
                }
              ].map((point, index, array) => (
                <div 
                  key={index}
                  className="absolute top-1/2 transform -translate-y-1/2 group z-10"
                  style={{ left: `${5 + (index * 22.5)}%` }}
                >
                  {/* Conexão */}
                  {index < array.length - 1 && (
                    <div 
                      className={`absolute left-8 top-1/2 h-0.5 bg-gradient-to-r 
                        ${point.status === 'attention' ? 'from-purple-500 to-indigo-400' : 'from-indigo-500 to-indigo-400'}`}
                      style={{ width: 'calc(22.5vw - 4rem)' }}
                    ></div>
                  )}
                  
                  {/* Ponto Interativo */}
                  <button 
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center
                      ${point.status === 'attention' ? 'bg-purple-600' : 'bg-indigo-600'}
                      shadow-lg border-2 border-white
                      transition-all duration-200
                      hover:scale-110 hover:shadow-xl
                      relative z-20
                    `}
                  >
                    {point.icon}
                  </button>

                  {/* Popup - Visível apenas no hover */}
                  <div className={`
                    invisible group-hover:visible opacity-0 group-hover:opacity-100
                    absolute -top-32 left-1/2 transform -translate-x-1/2
                    transition-all duration-300 ease-in-out
                    z-30 pointer-events-none
                  `}>
                    <div className={`
                      w-64 p-4 rounded-lg shadow-xl
                      ${point.status === 'attention' ? 'bg-purple-50 border border-purple-200' : 'bg-indigo-50 border border-indigo-200'}
                      relative 
                    `}>
                      {/* Seta para baixo */}
                      <div className={`
                        absolute -bottom-2 left-1/2 transform -translate-x-1/2
                        w-4 h-4 rotate-45
                        ${point.status === 'attention' ? 'bg-purple-50' : 'bg-indigo-50'}
                        border-r border-b
                        ${point.status === 'attention' ? 'border-purple-200' : 'border-indigo-200'}
                      `}></div>
                      
                      <div className="text-center mb-1">
                        <span className={`text-sm font-semibold ${point.status === 'attention' ? 'text-purple-700' : 'text-indigo-700'}`}>
                          {point.stage}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <div className={`text-xl font-bold ${point.status === 'attention' ? 'text-purple-900' : 'text-indigo-900'}`}>
                            {point.users.toLocaleString()}
                          </div>
                          <div className={`text-xs ${point.status === 'attention' ? 'text-purple-600' : 'text-indigo-600'}`}>
                            {point.percent}% do fluxo
                          </div>
                        </div>
                        
                        <div className={`
                          p-2 rounded-full 
                          ${point.status === 'attention' ? 'bg-purple-100' : 'bg-indigo-100'}
                        `}>
                          {point.icon.type === MessageSquare 
                            ? <MessageSquare className={`w-5 h-5 ${point.status === 'attention' ? 'text-purple-600' : 'text-indigo-600'}`} /> 
                            : point.icon.type === UserCheck 
                              ? <UserCheck className={`w-5 h-5 ${point.status === 'attention' ? 'text-purple-600' : 'text-indigo-600'}`} />
                              : point.icon.type === Search 
                                ? <Search className={`w-5 h-5 ${point.status === 'attention' ? 'text-purple-600' : 'text-indigo-600'}`} />
                                : point.icon.type === Activity 
                                  ? <Activity className={`w-5 h-5 ${point.status === 'attention' ? 'text-purple-600' : 'text-indigo-600'}`} />
                                  : <CheckCircle className={`w-5 h-5 ${point.status === 'attention' ? 'text-purple-600' : 'text-indigo-600'}`} />
                          }
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600">
                        {point.description}
                      </div>
                      
                      {/* Indicador de Drop */}
                      {index > 0 && (
                        <div className="mt-3 pt-2 border-t border-gray-200 flex items-center gap-1">
                          <ArrowDown className={`w-3 h-3 ${point.status === 'attention' ? 'text-purple-600' : 'text-indigo-600'}`} />
                          <div className={`text-xs font-medium ${point.status === 'attention' ? 'text-purple-600' : 'text-indigo-600'}`}>
                            Redução de {20 - index * 5}% em relação à etapa anterior
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Rótulo Minimalista Sempre Visível */}
                  <div className="absolute w-16 text-center top-10 left-1/2 transform -translate-x-1/2">
                    <span className={`text-xs font-medium ${point.status === 'attention' ? 'text-purple-600' : 'text-indigo-600'}`}>
                      {point.stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cards de Análise */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Gargalos */}
              <div className="bg-white rounded-xl border border-indigo-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">Principais Gargalos</h3>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      stage: "Análise de Documentação",
                      drop: "20%",
                      impact: "Crítico",
                      color: "bg-purple-100 text-purple-700"
                    },
                    {
                      stage: "Tempo de Processamento",
                      drop: "15%",
                      impact: "Moderado",
                      color: "bg-indigo-100 text-indigo-700"
                    },
                    {
                      stage: "Validação de Dados",
                      drop: "10%",
                      impact: "Baixo",
                      color: "bg-indigo-100 text-indigo-700"
                    }
                  ].map((gargalo, idx) => (
                    <div key={idx} className="p-3 bg-gradient-to-r from-indigo-50 to-white rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-1 h-8 rounded-full ${idx === 0 ? 'bg-purple-500' : 'bg-indigo-500'}`} />
                          <div>
                            <p className="font-medium text-gray-900">{gargalo.stage}</p>
                            <p className="text-sm text-gray-500">Drop de {gargalo.drop}</p>
                          </div>
                        </div>
                        <Badge className={gargalo.color}>{gargalo.impact}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ações */}
              <div className="bg-white rounded-xl border border-indigo-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">Ações Sugeridas</h3>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      action: "Automatizar validação documental",
                      impact: "Redução de 40% no tempo",
                      priority: "Alta",
                      color: "bg-indigo-100 text-indigo-700"
                    },
                    {
                      action: "Implementar análise preditiva",
                      impact: "Aumento de 25% na eficiência",
                      priority: "Média",
                      color: "bg-indigo-100 text-indigo-700"
                    },
                    {
                      action: "Otimizar fluxo de dados",
                      impact: "Redução de 15% em erros",
                      priority: "Média",
                      color: "bg-indigo-100 text-indigo-700"
                    }
                  ].map((acao, idx) => (
                    <div key={idx} className="p-3 bg-gradient-to-r from-indigo-50 to-white rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{acao.action}</span>
                        <Badge className={acao.color}>{acao.priority}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">{acao.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
