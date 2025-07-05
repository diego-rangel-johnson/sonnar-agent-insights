
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  MessageSquare,
  MessageCircle,
  Mail,
  Users,
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
  CalendarDays,
  Clock,
  Bot,
  CheckCircle,
  Activity,
  PieChart as PieChartIcon,
  Star,
  UserCheck,
  Target,
  FileText,
  Zap,
  Heart,
  BarChart2,
  AlertOctagon,
  AlertTriangle,
  Smile,
  Timer,
  Inbox,
  Headphones,
  MessagesSquare
} from 'lucide-react';

export default function Channels() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedChannel, setSelectedChannel] = useState('overview');
  const [subTab, setSubTab] = useState('performance');

  // Paleta de cores ajustada para consistência com o Dashboard
  const COLORS = {
    primary: '#6366F1',    // Indigo-500
    secondary: '#818CF8',  // Indigo-400
    tertiary: '#A78BFA',   // Purple-400
    quaternary: '#8B5CF6', // Purple-500
    success: '#10B981',    // Emerald-500
    warning: '#F59E0B',    // Amber-500
    error: '#EF4444',      // Red-500
    gray: '#9CA3AF',       // Gray-400
    indigo: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1',
      600: '#4F46E5',
      700: '#4338CA'
    },
    purple: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6',
      600: '#7C3AED',
      700: '#6D28D9'
    }
  };

  // Configuração de gradientes para gráficos
  const gradients = {
    primary: ['#818CF8', '#6366F1'],
    secondary: ['#A78BFA', '#8B5CF6'],
    tertiary: ['#C4B5FD', '#A78BFA'],
  };

  // Dados de performance dos canais
  const channelData = {
    today: {
      total: 2847,
      change: '+12.5%',
      distribution: [
        { name: 'WhatsApp', value: 1245, percentage: 43.7 },
        { name: 'Live Chat', value: 843, percentage: 29.6 },
        { name: 'Email', value: 486, percentage: 17.1 },
        { name: 'Teams', value: 273, percentage: 9.6 }
      ]
    },
    weekly: [
      { day: 'Seg', whatsapp: 1245, livechat: 843, email: 486, teams: 273 },
      { day: 'Ter', whatsapp: 1312, livechat: 921, email: 512, teams: 298 },
      { day: 'Qua', whatsapp: 1178, livechat: 876, email: 443, teams: 245 },
      { day: 'Qui', whatsapp: 1423, livechat: 967, email: 534, teams: 312 },
      { day: 'Sex', whatsapp: 1534, livechat: 1023, email: 567, teams: 334 },
      { day: 'Sáb', whatsapp: 987, livechat: 654, email: 378, teams: 198 },
      { day: 'Dom', whatsapp: 876, livechat: 543, email: 312, teams: 167 }
    ],
    metrics: {
      resolution_time: {
        whatsapp: 8.5,
        livechat: 5.2,
        email: 24.3,
        teams: 12.7
      },
      satisfaction: {
        whatsapp: 4.7,
        livechat: 4.5,
        email: 4.2,
        teams: 4.4
      },
      automation_rate: {
        whatsapp: 68,
        livechat: 72,
        email: 45,
        teams: 58
      }
    }
  };

  // Função para renderizar o cartão de estatísticas
  const constrenderStatCard = (title, value, trend, icon, color = 'indigo') => (
    <div className="bg-white rounded-xl border border-indigo-100 p-4 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-indigo-50">
          {React.cloneElement(icon, { className: `h-5 w-5 text-indigo-500` })}
        </div>
        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
          {trend}
        </Badge>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );

  // Configuração de estilo para gráficos
  const chartConfig = {
    cartesianGrid: {
      strokeDasharray: '3 3',
      stroke: '#E5E7EB'
    },
    xAxis: {
      fontSize: 12,
      tickMargin: 10,
      axisLine: false,
      tickLine: false
    },
    yAxis: {
      fontSize: 12,
      tickMargin: 10,
      axisLine: false,
      tickLine: false
    },
    tooltip: {
      contentStyle: {
        backgroundColor: '#FFF',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com KPIs */}
      <div className="bg-white rounded-xl p-6 border border-indigo-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Canais de Comunicação
            </h1>
            <p className="mt-1 text-gray-500">Visão unificada do atendimento multicanal</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px] border-indigo-100">
                <CalendarDays className="mr-2 h-4 w-4 text-indigo-400" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Últimas 24h</SelectItem>
                <SelectItem value="7d">7 dias</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
                <SelectItem value="90d">90 dias</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-indigo-100">
              <Filter className="h-4 w-4 mr-2 text-indigo-400" />
              Filtros
            </Button>
            <Button variant="outline" className="border-indigo-100">
              <Download className="h-4 w-4 mr-2 text-indigo-400" />
              Exportar
            </Button>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {constrenderStatCard(
            'Total de Atendimentos',
            '2,847',
            '+12.5%',
            <MessageSquare />,
            'indigo'
          )}
          {constrenderStatCard(
            'Tempo Médio',
            '2.8min',
            '-15s',
            <Clock />,
            'purple'
          )}
          {constrenderStatCard(
            'Taxa de Resolução',
            '94.3%',
            '+2.1%',
            <CheckCircle />,
            'indigo'
          )}
          {constrenderStatCard(
            'Satisfação',
            '4.8',
            '+0.2',
            <Star />,
            'purple'
          )}
        </div>
      </div>

      {/* Navegação Principal */}
      <Tabs value={selectedChannel} onValueChange={setSelectedChannel} className="space-y-6">
        <div className="bg-white rounded-xl p-1 border border-indigo-100">
          <TabsList className="w-full bg-slate-50 grid grid-cols-2 md:grid-cols-5 gap-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white">
              <Activity className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="data-[state=active]:bg-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="livechat" className="data-[state=active]:bg-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              Live Chat
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-white">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-white">
              <Users className="h-4 w-4 mr-2" />
              Teams
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Conteúdo da Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          {/* Tabs para métricas específicas na Visão Geral */}
          <Tabs defaultValue="volume" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-indigo-50/50">
                <TabsTrigger value="volume">Volume</TabsTrigger>
                <TabsTrigger value="response">Tempo de Resposta</TabsTrigger>
                <TabsTrigger value="satisfaction">Satisfação</TabsTrigger>
                <TabsTrigger value="automation">Automação</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="volume" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-indigo-500" />
                    Volume de Atendimentos por Canal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8 py-4">
                    {Object.entries({
                      whatsapp: {name: "WhatsApp", value: 7523, color: COLORS.indigo[500], change: "+12.3%", icon: <MessageSquare className="w-4 h-4 text-indigo-500" />},
                      livechat: {name: "Live Chat", value: 4256, color: COLORS.indigo[400], change: "+8.7%", icon: <MessageCircle className="w-4 h-4 text-indigo-400" />},
                      email: {name: "Email", value: 2845, color: COLORS.purple[400], change: "+5.2%", icon: <Mail className="w-4 h-4 text-purple-400" />},
                      teams: {name: "Teams", value: 1563, color: COLORS.purple[500], change: "+15.8%", icon: <Users className="w-4 h-4 text-purple-500" />}
                    }).map(([key, channel]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md" style={{backgroundColor: `${key.includes('whatsapp') || key.includes('livechat') ? COLORS.indigo[50] : COLORS.purple[50]}`}}>
                              {channel.icon}
                            </div>
                            <p className="text-sm font-medium">{channel.name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{channel.value.toLocaleString()}</span>
                            <Badge 
                              variant="outline" 
                              className={channel.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}
                            >
                              {channel.change}
                            </Badge>
                          </div>
                        </div>
                        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full rounded-full"
                            style={{
                              backgroundColor: channel.color,
                              width: `${(channel.value / 7523) * 100}%`
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{Math.round((channel.value / 16187) * 100)}% do total</span>
                          <span>Meta: {(channel.value * 1.1).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="response" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-indigo-500" />
                    Tempo Médio de Resposta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8 py-4">
                    {Object.entries({
                      whatsapp: {name: "WhatsApp", value: 8.5, color: COLORS.indigo[500]},
                      livechat: {name: "Live Chat", value: 5.2, color: COLORS.indigo[400]},
                      email: {name: "Email", value: 24.3, color: COLORS.purple[400]},
                      teams: {name: "Teams", value: 12.7, color: COLORS.purple[500]}
                    }).map(([key, channel]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: channel.color}}></div>
                            <p className="text-sm font-medium">{channel.name}</p>
                          </div>
                          <span className="text-sm font-semibold">{channel.value} min</span>
                        </div>
                        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full rounded-full"
                            style={{
                              backgroundColor: channel.color,
                              width: `${(100 - (channel.value / 30) * 100)}%`
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 text-right">
                          Meta: {key === 'email' ? '10min' : '5min'}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="satisfaction" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Star className="mr-2 h-5 w-5 text-indigo-500" />
                    Índice de Satisfação por Canal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8 py-4">
                    {Object.entries({
                      whatsapp: {name: "WhatsApp", value: 4.7, color: COLORS.indigo[500]},
                      livechat: {name: "Live Chat", value: 4.5, color: COLORS.indigo[400]},
                      email: {name: "Email", value: 4.2, color: COLORS.purple[400]},
                      teams: {name: "Teams", value: 4.4, color: COLORS.purple[500]}
                    }).map(([key, channel]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: channel.color}}></div>
                            <p className="text-sm font-medium">{channel.name}</p>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < Math.floor(channel.value) ? 'text-amber-400' : 'text-gray-200'}`} />
                            ))}
                            <span className="ml-2 text-sm font-semibold">{channel.value}</span>
                          </div>
                        </div>
                        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full rounded-full"
                            style={{
                              backgroundColor: channel.color,
                              width: `${(channel.value / 5) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="automation" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Bot className="mr-2 h-5 w-5 text-indigo-500" />
                    Taxa de Automação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8 py-4">
                    {Object.entries({
                      whatsapp: {name: "WhatsApp", value: 68, color: COLORS.indigo[500]},
                      livechat: {name: "Live Chat", value: 72, color: COLORS.indigo[400]},
                      email: {name: "Email", value: 45, color: COLORS.purple[400]},
                      teams: {name: "Teams", value: 58, color: COLORS.purple[500]}
                    }).map(([key, channel]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: channel.color}}></div>
                            <p className="text-sm font-medium">{channel.name}</p>
                          </div>
                          <span className="text-sm font-semibold">{channel.value}%</span>
                        </div>
                        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full rounded-full"
                            style={{
                              backgroundColor: channel.color,
                              width: `${channel.value}%`
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Meta: 60%</span>
                          <span>{channel.value >= 60 ? 'Atingida ✓' : 'Não atingida'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Grid de Métricas e Distribuição */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição por Canal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <PieChartIcon className="mr-2 h-5 w-5 text-indigo-500" />
                  Distribuição por Canal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelData.today.distribution}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {channelData.today.distribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={Object.values(COLORS)[index]} 
                            stroke="white"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip {...chartConfig.tooltip} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Métricas Comparativas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Target className="mr-2 h-5 w-5 text-indigo-500" />
                  Métricas Comparativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { metric: 'Resolução', whatsapp: 85, livechat: 90, email: 75, teams: 82 },
                      { metric: 'Satisfação', whatsapp: 92, livechat: 88, email: 82, teams: 85 },
                      { metric: 'Automação', whatsapp: 75, livechat: 70, email: 45, teams: 60 },
                      { metric: 'Primeira Resposta', whatsapp: 88, livechat: 92, email: 70, teams: 80 },
                      { metric: 'Retenção', whatsapp: 90, livechat: 85, email: 80, teams: 85 }
                    ]}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#6B7280', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6B7280' }} />
                      <Radar
                        name="WhatsApp"
                        dataKey="whatsapp"
                        stroke={COLORS.primary}
                        fill={COLORS.primary}
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Live Chat"
                        dataKey="livechat"
                        stroke={COLORS.secondary}
                        fill={COLORS.secondary}
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Email"
                        dataKey="email"
                        stroke={COLORS.tertiary}
                        fill={COLORS.tertiary}
                        fillOpacity={0.3}
                      />
                      <Legend />
                      <Tooltip {...chartConfig.tooltip} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status dos Canais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: 'WhatsApp',
                icon: <MessageSquare className="h-5 w-5" />,
                status: 'Operacional',
                metrics: {
                  volume: '1,245',
                  trend: '+12.3%',
                  response: '45s',
                  satisfaction: '4.8'
                },
                color: 'indigo'
              },
              {
                name: 'Live Chat',
                icon: <MessageCircle className="h-5 w-5" />,
                status: 'Operacional',
                metrics: {
                  volume: '843',
                  trend: '+8.7%',
                  response: '30s',
                  satisfaction: '4.6'
                },
                color: 'purple'
              },
              {
                name: 'Email',
                icon: <Mail className="h-5 w-5" />,
                status: 'Operacional',
                metrics: {
                  volume: '486',
                  trend: '+5.2%',
                  response: '2.5h',
                  satisfaction: '4.4'
                },
                color: 'indigo'
              },
              {
                name: 'Teams',
                icon: <Users className="h-5 w-5" />,
                status: 'Operacional',
                metrics: {
                  volume: '273',
                  trend: '+15.8%',
                  response: '1.8m',
                  satisfaction: '4.7'
                },
                color: 'purple'
              }
            ].map((channel, idx) => (
              <Card key={idx} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-${channel.color}-500`} />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${channel.color}-50`}>
                        {React.cloneElement(channel.icon, { className: `text-${channel.color}-500` })}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{channel.name}</h3>
                        <Badge variant="secondary" className={`text-${channel.color}-700 bg-${channel.color}-50`}>
                          {channel.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Volume</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold">{channel.metrics.volume}</p>
                        <Badge variant="secondary" className="text-xs">
                          {channel.metrics.trend}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tempo Médio</p>
                      <p className="text-lg font-semibold">{channel.metrics.response}</p>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-500">Satisfação</p>
                        <p className="text-sm font-medium">{channel.metrics.satisfaction}/5.0</p>
                      </div>
                      <Progress 
                        value={parseFloat(channel.metrics.satisfaction) * 20} 
                        className={`h-2 bg-${channel.color}-100`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* WhatsApp Tab */}
        <TabsContent value="whatsapp" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-indigo-500" />
                  Métricas do WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: 'Total de Conversas', value: '7,523', trend: '+12.3%', icon: <MessagesSquare className="h-4 w-4 text-indigo-500" /> },
                    { title: 'Tempo de Resposta', value: '1.2 min', trend: '-10s', icon: <Clock className="h-4 w-4 text-green-500" /> },
                    { title: 'Taxa de Satisfação', value: '94%', trend: '+2%', icon: <Star className="h-4 w-4 text-amber-500" /> },
                    { title: 'Automação', value: '76%', trend: '+5%', icon: <Bot className="h-4 w-4 text-indigo-500" /> }
                  ].map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {metric.icon}
                        <p className="text-sm text-gray-600">{metric.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{metric.value}</p>
                        <Badge variant="outline" className={metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                          {metric.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Tendência de Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={channelData.weekly.map(day => ({ day: day.day, total: day.whatsapp, automated: Math.round(day.whatsapp * 0.76) }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                      />
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        name="Total" 
                        stroke={COLORS.primary} 
                        activeDot={{ r: 6 }}
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="automated" 
                        name="Automatizado" 
                        stroke={COLORS.secondary}
                        strokeDasharray="4 4"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Bot className="mr-2 h-5 w-5 text-indigo-500" />
                Automação de Atendimento WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Taxa Global de Automação</h4>
                    <p className="text-sm text-gray-500">% de conversas resolvidas sem intervenção humana</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">76%</div>
                    <Badge className="bg-green-50 text-green-700">+5% vs mês anterior</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Top Casos Automatizados</h4>
                  {[
                    { name: 'Consulta de Status', percent: 85, count: 1245 },
                    { name: 'FAQ / Dúvidas Comuns', percent: 78, count: 987 },
                    { name: 'Abertura de Chamado', percent: 63, count: 643 }
                  ].map((type, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{type.name}</span>
                        <span className="text-sm text-gray-500">{type.count} conversas</span>
                      </div>
                      <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full rounded-full bg-indigo-500"
                          style={{ width: `${type.percent}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        Taxa de automação: {type.percent}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Chat Tab */}
        <TabsContent value="livechat" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5 text-indigo-500" />
                  Métricas do Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: 'Total de Conversas', value: '4,256', trend: '+8.7%', icon: <MessageCircle className="h-4 w-4 text-indigo-500" /> },
                    { title: 'Tempo de Resposta', value: '45s', trend: '-8s', icon: <Clock className="h-4 w-4 text-green-500" /> },
                    { title: 'Taxa de Satisfação', value: '92%', trend: '+1.5%', icon: <Star className="h-4 w-4 text-amber-500" /> },
                    { title: 'Automação', value: '72%', trend: '+4%', icon: <Bot className="h-4 w-4 text-indigo-500" /> }
                  ].map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {metric.icon}
                        <p className="text-sm text-gray-600">{metric.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{metric.value}</p>
                        <Badge variant="outline" className={metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                          {metric.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Tendência de Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={channelData.weekly.map(day => ({ day: day.day, total: day.livechat, automated: Math.round(day.livechat * 0.72) }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                      />
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        name="Total" 
                        stroke={COLORS.secondary} 
                        activeDot={{ r: 6 }}
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="automated" 
                        name="Automatizado" 
                        stroke="#A5B4FC"
                        strokeDasharray="4 4"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Bot className="mr-2 h-5 w-5 text-indigo-500" />
                Automação de Atendimento Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Taxa Global de Automação</h4>
                    <p className="text-sm text-gray-500">% de conversas resolvidas sem intervenção humana</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">72%</div>
                    <Badge className="bg-green-50 text-green-700">+4% vs mês anterior</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Top Casos Automatizados</h4>
                  {[
                    { name: 'Dúvidas sobre Produtos', percent: 82, count: 863 },
                    { name: 'Suporte Técnico', percent: 75, count: 712 },
                    { name: 'Acompanhamento de Pedidos', percent: 68, count: 587 }
                  ].map((type, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{type.name}</span>
                        <span className="text-sm text-gray-500">{type.count} conversas</span>
                      </div>
                      <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full rounded-full bg-indigo-500"
                          style={{ width: `${type.percent}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        Taxa de automação: {type.percent}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-purple-500" />
                  Métricas de Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: 'Total de Emails', value: '2,845', trend: '+5.2%', icon: <Mail className="h-4 w-4 text-purple-500" /> },
                    { title: 'Tempo de Resposta', value: '4.5h', trend: '-0.5h', icon: <Clock className="h-4 w-4 text-green-500" /> },
                    { title: 'Taxa de Satisfação', value: '88%', trend: '+1.2%', icon: <Star className="h-4 w-4 text-amber-500" /> },
                    { title: 'Automação', value: '52%', trend: '+3%', icon: <Bot className="h-4 w-4 text-purple-500" /> }
                  ].map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {metric.icon}
                        <p className="text-sm text-gray-600">{metric.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{metric.value}</p>
                        <Badge variant="outline" className={metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                          {metric.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Tendência de Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={channelData.weekly.map(day => ({ day: day.day, total: day.email, automated: Math.round(day.email * 0.52) }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                      />
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        name="Total" 
                        stroke={COLORS.tertiary} 
                        activeDot={{ r: 6 }}
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="automated" 
                        name="Automatizado" 
                        stroke="#C4B5FD"
                        strokeDasharray="4 4"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Bot className="mr-2 h-5 w-5 text-purple-500" />
                Categorias de Emails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Distribuição por Tipo</h4>
                    {[
                      { name: 'Suporte ao Cliente', percent: 45, count: 1280 },
                      { name: 'Vendas e Propostas', percent: 28, count: 797 },
                      { name: 'Reclamações', percent: 18, count: 512 },
                      { name: 'Informações Gerais', percent: 9, count: 256 }
                    ].map((type, idx) => (
                      <div key={idx} className="space-y-1 mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{type.name}</span>
                          <span className="text-sm text-gray-500">{type.count} emails</span>
                        </div>
                        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full rounded-full bg-purple-500"
                            style={{ width: `${type.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Tempo Médio de Resposta por Categoria</h4>
                    {[
                      { name: 'Alta Prioridade', time: '1.2h', target: '1h', percent: 92 },
                      { name: 'Média Prioridade', time: '3.5h', target: '4h', percent: 88 },
                      { name: 'Baixa Prioridade', time: '6.8h', target: '8h', percent: 84 }
                    ].map((category, idx) => (
                      <div key={idx} className="space-y-1 mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{category.name}</span>
                          <div className="text-right">
                            <span className="text-sm font-semibold">{category.time}</span>
                            <span className="text-xs text-gray-500 ml-1">(meta: {category.target})</span>
                          </div>
                        </div>
                        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full rounded-full bg-purple-500"
                            style={{ width: `${category.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Users className="mr-2 h-5 w-5 text-purple-600" />
                  Métricas do Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: 'Total de Conversas', value: '1,563', trend: '+15.8%', icon: <Users className="h-4 w-4 text-purple-600" /> },
                    { title: 'Tempo de Resposta', value: '2.8m', trend: '-0.4m', icon: <Clock className="h-4 w-4 text-green-500" /> },
                    { title: 'Taxa de Satisfação', value: '90%', trend: '+2.5%', icon: <Star className="h-4 w-4 text-amber-500" /> },
                    { title: 'Automação', value: '62%', trend: '+4.5%', icon: <Bot className="h-4 w-4 text-purple-600" /> }
                  ].map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {metric.icon}
                        <p className="text-sm text-gray-600">{metric.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{metric.value}</p>
                        <Badge variant="outline" className={metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                          {metric.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Tendência de Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={channelData.weekly.map(day => ({ day: day.day, total: day.teams, automated: Math.round(day.teams * 0.62) }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                      />
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        name="Total" 
                        stroke={COLORS.quaternary} 
                        activeDot={{ r: 6 }}
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="automated" 
                        name="Automatizado" 
                        stroke="#DDD6FE"
                        strokeDasharray="4 4"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-600" />
                Departamentos por Utilização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Distribuição por Departamento</h4>
                  <Badge className="bg-purple-50 text-purple-700">Total: 1,563 conversas</Badge>
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'Suporte Técnico', percent: 35, count: 547 },
                    { name: 'Vendas', percent: 24, count: 375 },
                    { name: 'RH', percent: 18, count: 281 },
                    { name: 'Marketing', percent: 12, count: 188 },
                    { name: 'Financeiro', percent: 11, count: 172 }
                  ].map((dept, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{dept.name}</span>
                        <span className="text-sm text-gray-500">{dept.count} conversas</span>
                      </div>
                      <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full rounded-full bg-purple-600"
                          style={{ width: `${dept.percent}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        {dept.percent}% do total
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
