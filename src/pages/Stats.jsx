import React, { useState, useEffect } from 'react';
import { AIAgent } from '@/api/entities';
import { Channel } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area
} from 'recharts';
import {
  Bot,
  Brain,
  BarChart2,
  Headphones,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Percent,
  UserCheck,
  Filter,
  RefreshCw,
  Download,
  Share,
  Mail,
  MessageCircle,
  Lightbulb,
  Users,
  Search,
  ChevronRight,
  CalendarDays,
  Info as InfoIcon,
  ArrowLeft,
  PlusCircle,
  CircleHelp,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function AgentAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [agents, setAgents] = useState([]);
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [currentTab, setCurrentTab] = useState('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const agentsData = await AIAgent.list();
        const channelsData = await Channel.list();
        setAgents(agentsData);
        setChannels(channelsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load data:', error);
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Dados mockados para a dashboard de agentes
  const agentData = {
    'insight': {
      name: 'Insight',
      description: 'Analisa dados, detecta pontos de fricção e oportunidades de melhoria.',
      icon: <BarChart2 className="h-6 w-6" />,
      color: '#6366f1',
      integrations: ['livechat', 'whatsapp', 'email'],
      objectives: [
        'Analisar tendências nos KPIs dos canais',
        'Detectar gargalos no atendimento',
        'Gerar alertas automáticos para métricas críticas'
      ],
      benefits: [
        { 
          name: 'Redução de Tempo de Análise', 
          value: 68, 
          trend: 'up',
          trendValue: '+12%',
          description: 'Redução no tempo gasto para identificar problemas'
        },
        { 
          name: 'Aumento de Eficiência', 
          value: 43, 
          trend: 'up',
          trendValue: '+8%',
          description: 'Ganho de eficiência operacional'
        },
        { 
          name: 'Problemas Detectados', 
          value: 124, 
          trend: 'neutral',
          trendValue: '0%',
          description: 'Número de problemas detectados preventivamente'
        }
      ],
      performance: {
        accuracy: 92,
        latency: 0.8,
        uptime: 99.7,
        usage: [
          { name: 'Seg', value: 342 },
          { name: 'Ter', value: 421 },
          { name: 'Qua', value: 384 },
          { name: 'Qui', value: 452 },
          { name: 'Sex', value: 398 },
          { name: 'Sáb', value: 265 },
          { name: 'Dom', value: 187 }
        ],
        impactByChannel: [
          { name: 'WhatsApp', value: 68 },
          { name: 'Live Chat', value: 84 },
          { name: 'Email', value: 52 },
          { name: 'Teams', value: 41 },
          { name: 'Social', value: 55 }
        ],
        metrics: [
          { name: 'Precisão', value: 92 },
          { name: 'Velocidade', value: 87 },
          { name: 'Utilidade', value: 78 },
          { name: 'Adaptabilidade', value: 65 },
          { name: 'Autonomia', value: 72 }
        ]
      },
      insights: [
        {
          title: 'Gargalo no Processo de Verificação',
          description: 'Identificado aumento de 27% no tempo de verificação via email',
          severity: 'high',
          date: '1 dia atrás',
          action: 'Revisar processo de autenticação'
        },
        {
          title: 'Tendência de Crescimento no WhatsApp',
          description: 'Aumento constante de 12% ao mês em interações via WhatsApp',
          severity: 'info',
          date: '3 dias atrás',
          action: 'Realocar recursos para este canal'
        },
        {
          title: 'Queda na Satisfação no Chat',
          description: 'Redução de 5 pontos na satisfação do live chat nas últimas semanas',
          severity: 'medium',
          date: '5 dias atrás',
          action: 'Investigar fontes de insatisfação'
        }
      ]
    },
    'navigator': {
      name: 'Navigator',
      description: 'Mapeamento de fluxos de navegação (URA, chatbots, sites).',
      icon: <TrendingUp className="h-6 w-6" />,
      color: '#22c55e',
      integrations: ['livechat', 'whatsapp'],
      objectives: [
        'Analisar caminhos de navegação do usuário',
        'Identificar menus confusos ou ineficientes',
        'Sugerir simplificações nos fluxos de atendimento'
      ],
      benefits: [
        { 
          name: 'Redução de Abandono', 
          value: 37, 
          trend: 'up',
          trendValue: '+5%',
          description: 'Redução na taxa de abandono dos fluxos'
        },
        { 
          name: 'Melhoria na UX', 
          value: 28, 
          trend: 'up',
          trendValue: '+8%',
          description: 'Melhoria percebida na experiência do usuário'
        },
        { 
          name: 'Conversão', 
          value: 42, 
          trend: 'up',
          trendValue: '+3%',
          description: 'Aumento na conversão em jornadas críticas'
        }
      ],
      performance: {
        accuracy: 89,
        latency: 1.2,
        uptime: 99.5,
        usage: [
          { name: 'Seg', value: 298 },
          { name: 'Ter', value: 384 },
          { name: 'Qua', value: 352 },
          { name: 'Qui', value: 418 },
          { name: 'Sex', value: 367 },
          { name: 'Sáb', value: 231 },
          { name: 'Dom', value: 174 }
        ],
        impactByChannel: [
          { name: 'WhatsApp', value: 75 },
          { name: 'Live Chat', value: 82 },
          { name: 'Email', value: 28 },
          { name: 'Teams', value: 15 },
          { name: 'Social', value: 47 }
        ],
        metrics: [
          { name: 'Precisão', value: 85 },
          { name: 'Velocidade', value: 92 },
          { name: 'Utilidade', value: 88 },
          { name: 'Adaptabilidade', value: 75 },
          { name: 'Autonomia', value: 68 }
        ]
      },
      insights: [
        {
          title: 'Menu Confuso no WhatsApp',
          description: 'Identificados 3 pontos de confusão no menu principal do WhatsApp',
          severity: 'medium',
          date: '2 dias atrás',
          action: 'Reorganizar opções do menu'
        },
        {
          title: 'Jornada Longa no Chatbot',
          description: 'Jornada de "consulta de pedidos" exige 8 interações (muito acima da média)',
          severity: 'high',
          date: '4 dias atrás',
          action: 'Simplificar fluxo de consulta'
        },
        {
          title: 'Opção Subutilizada',
          description: 'Opção "Falar com especialista" tem uso menor que 2%',
          severity: 'low',
          date: '6 dias atrás',
          action: 'Avaliar reposicionamento da opção'
        }
      ]
    },
    'engage': {
      name: 'Engage',
      description: 'Auxilia em comunicação empática e humanizada.',
      icon: <Headphones className="h-6 w-6" />,
      color: '#ec4899',
      integrations: ['email', 'livechat', 'social'],
      objectives: [
        'Melhorar a empatia nas comunicações automáticas',
        'Personalizar atendimento para diferentes perfis',
        'Analisar sentimento em tempo real'
      ],
      benefits: [
        { 
          name: 'Satisfação do Cliente', 
          value: 32, 
          trend: 'up',
          trendValue: '+7%',
          description: 'Aumento na satisfação do cliente final'
        },
        { 
          name: 'Personalização', 
          value: 54, 
          trend: 'up',
          trendValue: '+12%',
          description: 'Melhoria na percepção de personalização'
        },
        { 
          name: 'Resolução Emocional', 
          value: 28, 
          trend: 'up',
          trendValue: '+5%',
          description: 'Resolução de casos com alta carga emocional'
        }
      ],
      performance: {
        accuracy: 87,
        latency: 0.9,
        uptime: 99.6,
        usage: [
          { name: 'Seg', value: 312 },
          { name: 'Ter', value: 405 },
          { name: 'Qua', value: 368 },
          { name: 'Qui', value: 427 },
          { name: 'Sex', value: 382 },
          { name: 'Sáb', value: 254 },
          { name: 'Dom', value: 195 }
        ],
        impactByChannel: [
          { name: 'WhatsApp', value: 55 },
          { name: 'Live Chat', value: 85 },
          { name: 'Email', value: 72 },
          { name: 'Teams', value: 38 },
          { name: 'Social', value: 76 }
        ],
        metrics: [
          { name: 'Precisão', value: 82 },
          { name: 'Velocidade', value: 75 },
          { name: 'Utilidade', value: 90 },
          { name: 'Adaptabilidade', value: 88 },
          { name: 'Autonomia', value: 65 }
        ]
      },
      insights: [
        {
          title: 'Alta Empatia em Reclamações',
          description: 'Aumento de 22% na satisfação de clientes reclamantes',
          severity: 'info',
          date: '1 dia atrás',
          action: 'Expandir modelo para outros canais'
        },
        {
          title: 'Detecção de Frustração',
          description: 'Sistema detectou corretamente 95% dos casos de frustração',
          severity: 'info',
          date: '3 dias atrás',
          action: 'Aprimorar protocolos de atendimento'
        },
        {
          title: 'Linguagem Corporativa',
          description: 'Emails ainda contêm linguagem excessivamente formal',
          severity: 'medium',
          date: '5 dias atrás',
          action: 'Ajustar templates de comunicação'
        }
      ]
    },
    'brain': {
      name: 'Brain',
      description: 'Central de conhecimento, usando IA generativa para buscar respostas em bases internas.',
      icon: <Brain className="h-6 w-6" />,
      color: '#8b5cf6',
      integrations: ['livechat', 'whatsapp', 'teams', 'email'],
      objectives: [
        'Centralizar conhecimento da empresa',
        'Fornecer respostas precisas em tempo real',
        'Aprender continuamente com feedback'
      ],
      benefits: [
        { 
          name: 'Tempo de Resposta', 
          value: 75, 
          trend: 'up',
          trendValue: '+15%',
          description: 'Redução no tempo de pesquisa por informações'
        },
        { 
          name: 'Precisão', 
          value: 68, 
          trend: 'up',
          trendValue: '+8%',
          description: 'Aumento na precisão das respostas'
        },
        { 
          name: 'Resolução no Primeiro Contato', 
          value: 42, 
          trend: 'up',
          trendValue: '+9%',
          description: 'Melhoria na resolução sem escalação'
        }
      ],
      performance: {
        accuracy: 94,
        latency: 0.7,
        uptime: 99.8,
        usage: [
          { name: 'Seg', value: 385 },
          { name: 'Ter', value: 457 },
          { name: 'Qua', value: 421 },
          { name: 'Qui', value: 483 },
          { name: 'Sex', value: 426 },
          { name: 'Sáb', value: 292 },
          { name: 'Dom', value: 218 }
        ],
        impactByChannel: [
          { name: 'WhatsApp', value: 78 },
          { name: 'Live Chat', value: 82 },
          { name: 'Email', value: 68 },
          { name: 'Teams', value: 91 },
          { name: 'Social', value: 45 }
        ],
        metrics: [
          { name: 'Precisão', value: 94 },
          { name: 'Velocidade', value: 89 },
          { name: 'Utilidade', value: 92 },
          { name: 'Adaptabilidade', value: 76 },
          { name: 'Autonomia', value: 85 }
        ]
      },
      insights: [
        {
          title: 'Falta de Documentação',
          description: 'Identificadas 12 áreas com documentação insuficiente',
          severity: 'high',
          date: '2 dias atrás',
          action: 'Complementar base de conhecimento'
        },
        {
          title: 'Alta Taxa de Uso',
          description: 'Agentes usam o sistema em 87% dos atendimentos',
          severity: 'info',
          date: '4 dias atrás',
          action: 'Expandir capacidade de processamento'
        },
        {
          title: 'Informações Desatualizadas',
          description: 'Produtos da linha 2023 com informações incompletas',
          severity: 'medium',
          date: '6 dias atrás',
          action: 'Atualizar catálogo de produtos'
        }
      ]
    },
    'auditor': {
      name: 'Auditor',
      description: 'Monitora conformidade e boas práticas em todos os canais.',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: '#f59e0b',
      integrations: ['livechat', 'email', 'phone'],
      objectives: [
        'Verificar aderência a SLAs',
        'Analisar conformidade com scripts',
        'Detectar linguagem inadequada'
      ],
      benefits: [
        { 
          name: 'Compliance Regulatório', 
          value: 62, 
          trend: 'up',
          trendValue: '+10%',
          description: 'Melhoria em conformidade regulatória'
        },
        { 
          name: 'Redução de Riscos', 
          value: 48, 
          trend: 'up',
          trendValue: '+7%',
          description: 'Redução em riscos operacionais'
        },
        { 
          name: 'Qualidade de Atendimento', 
          value: 35, 
          trend: 'up',
          trendValue: '+6%',
          description: 'Aumento na qualidade geral de atendimento'
        }
      ],
      performance: {
        accuracy: 91,
        latency: 1.1,
        uptime: 99.5,
        usage: [
          { name: 'Seg', value: 278 },
          { name: 'Ter', value: 342 },
          { name: 'Qua', value: 312 },
          { name: 'Qui', value: 385 },
          { name: 'Sex', value: 347 },
          { name: 'Sáb', value: 203 },
          { name: 'Dom', value: 156 }
        ],
        impactByChannel: [
          { name: 'WhatsApp', value: 53 },
          { name: 'Live Chat', value: 76 },
          { name: 'Email', value: 86 },
          { name: 'Teams', value: 32 },
          { name: 'Social', value: 41 }
        ],
        metrics: [
          { name: 'Precisão', value: 87 },
          { name: 'Velocidade', value: 72 },
          { name: 'Utilidade', value: 82 },
          { name: 'Adaptabilidade', value: 65 },
          { name: 'Autonomia', value: 78 }
        ]
      },
      insights: [
        {
          title: 'Desvio de Script',
          description: 'Setor A apresenta desvio de 23% do script padrão',
          severity: 'medium',
          date: '1 dia atrás',
          action: 'Retreinar equipe do setor'
        },
        {
          title: 'Quebra de SLA',
          description: 'SLA de primeiro contato ultrapassado em 15% dos casos',
          severity: 'high',
          date: '3 dias atrás',
          action: 'Revisar dimensionamento da equipe'
        },
        {
          title: 'Linguagem Inadequada',
          description: 'Identificados 7 casos de linguagem inapropriada',
          severity: 'high',
          date: '5 dias atrás',
          action: 'Providenciar feedback individual'
        }
      ]
    }
  };

  // Mapear canais para ícones com cores da paleta
  const channelIcons = {
    'livechat': <MessageCircle className="h-4 w-4 text-indigo-500" />,
    'whatsapp': <MessageSquare className="h-4 w-4 text-indigo-500" />,
    'teams': <Users className="h-4 w-4 text-indigo-500" />,
    'email': <Mail className="h-4 w-4 text-purple-500" />,
    'phone': <Headphones className="h-4 w-4 text-purple-500" />,
    'social': <Share className="h-4 w-4 text-purple-500" />
  };

  // Buscar agent selecionado dos dados mockados
  const agent = selectedAgent && agentData[selectedAgent] ? agentData[selectedAgent] : null;

  // Mapear severidade para cores e ícones
  const severityMap = {
    'low': { color: 'bg-indigo-100 text-indigo-700', icon: <InfoIcon className="h-4 w-4" /> },
    'medium': { color: 'bg-purple-100 text-purple-700', icon: <AlertTriangle className="h-4 w-4" /> },
    'high': { color: 'bg-indigo-100 text-indigo-700', icon: <XCircle className="h-4 w-4" /> },
    'info': { color: 'bg-purple-100 text-purple-700', icon: <InfoIcon className="h-4 w-4" /> }
  };

  // Mapear tendências para ícones
  const trendMap = {
    'up': <ArrowUp className="h-4 w-4 text-indigo-600" />,
    'down': <ArrowDown className="h-4 w-4 text-purple-600" />,
    'neutral': <ArrowUp className="h-4 w-4 text-indigo-300 rotate-90" />
  };

  // Se não houver agente selecionado, mostrar visão geral
  if (!selectedAgent || !agent) {
    return (
      <div className="space-y-8">
        {/* Header mais clean */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Agent Analytics</h1>
            <p className="mt-1 text-gray-500">Análise de desempenho dos agentes de IA</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px] text-sm border-indigo-100">
                <CalendarDays className="mr-2 h-4 w-4 text-indigo-400" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 dias</SelectItem>
                <SelectItem value="15d">15 dias</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
                <SelectItem value="90d">90 dias</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="h-9 w-9 border-indigo-100">
              <Download className="h-4 w-4 text-indigo-400" />
            </Button>
          </div>
        </div>

        {/* Stats Cards Modernos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: 'Agentes',
              value: Object.keys(agentData).length,
              icon: <Bot className="h-5 w-5" />,
              trend: '+2 este mês'
            },
            {
              title: 'Precisão Média',
              value: '92%',
              icon: <CheckCircle className="h-5 w-5" />,
              trend: '+3.2% vs último mês'
            },
            {
              title: 'Canais Integrados',
              value: '6',
              icon: <MessageSquare className="h-5 w-5" />,
              trend: '+1 novo canal'
            },
            {
              title: 'Insights Ativos',
              value: '15',
              icon: <Lightbulb className="h-5 w-5" />,
              trend: '4 novos hoje'
            }
          ].map((stat, idx) => (
            <Card key={idx} className="border border-indigo-100 bg-white shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-indigo-50">
                    {React.cloneElement(stat.icon, { className: "h-5 w-5 text-indigo-600" })}
                  </div>
                  <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100">
                    {stat.trend}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-sm font-medium text-gray-500 mt-1">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Grade de Agentes */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(agentData).map(([id, agent]) => {
            // Usar apenas cores da paleta para os ícones dos agentes
            const agentColors = {
              'insight': '#6366f1', // indigo-500
              'navigator': '#4f46e5', // indigo-600
              'engage': '#8b5cf6', // purple-500
              'brain': '#a78bfa', // purple-400
              'auditor': '#7c3aed', // purple-600
            };
            
            const agentColor = agentColors[id] || '#6366f1'; // fallback para indigo-500
            
            return (
              <Card 
                key={id} 
                className="border border-indigo-100 bg-white hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedAgent(id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl" style={{ background: `${agentColor}15` }}>
                      <div style={{ color: agentColor }}>{agent.icon}</div>
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {agent.name}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-1">
                        {agent.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-indigo-50 rounded-lg p-3">
                      <div className="text-lg font-semibold text-indigo-600">
                        {agent.performance.accuracy}%
                      </div>
                      <div className="text-sm text-gray-500">Precisão</div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-3">
                      <div className="text-lg font-semibold text-indigo-600">
                        {agent.performance.latency}s
                      </div>
                      <div className="text-sm text-gray-500">Latência</div>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="h-[60px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={agent.performance.usage.slice(-7)} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366F1" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#6366F1"
                          strokeWidth={2}
                          fill={`url(#gradient-${id})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Integration Tags */}
                  <div className="flex flex-wrap gap-1 mt-4">
                    {agent.integrations.map((integration, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                      >
                        {integration}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button 
                    variant="ghost" 
                    className="w-full text-indigo-600"
                  >
                    Ver análise detalhada
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Vista detalhada do agente
  return (
    <div className="space-y-6">
      {/* Cabeçalho do Detalhe */}
      <div className="bg-white rounded-xl border border-indigo-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0" 
            onClick={() => setSelectedAgent(null)}
          >
            <ArrowLeft className="h-4 w-4 text-indigo-600" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl" style={{ background: `${agent.color}15` }}>
              <div style={{ color: agent.color }}>{agent.icon}</div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{agent.name}</h1>
              <p className="text-sm text-gray-500">{agent.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] text-sm border-indigo-100">
              <CalendarDays className="mr-2 h-4 w-4 text-indigo-400" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="15d">15 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-indigo-100 text-indigo-600">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            title: 'Precisão',
            value: `${agent.performance.accuracy}%`,
            trend: '+2.3%',
            icon: <CheckCircle className="h-4 w-4" />
          },
          {
            title: 'Latência',
            value: `${agent.performance.latency}s`,
            trend: '-0.1s',
            icon: <Clock className="h-4 w-4" />
          },
          {
            title: 'Disponibilidade',
            value: `${agent.performance.uptime}%`,
            trend: '+0.2%',
            icon: <Activity className="h-4 w-4" />
          },
          {
            title: 'Insights',
            value: agent.insights.length,
            trend: 'Novos',
            icon: <Lightbulb className="h-4 w-4" />
          }
        ].map((metric, idx) => (
          <Card key={idx} className="border border-indigo-100 bg-white">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-indigo-50">
                  {React.cloneElement(metric.icon, { className: "text-indigo-600" })}
                </div>
                <Badge className="bg-indigo-50 text-indigo-600">
                  {metric.trend}
                </Badge>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                <p className="text-sm text-gray-500 mt-1">{metric.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs de Navegação */}
      <div className="bg-white rounded-xl border border-indigo-100 overflow-hidden">
        <Tabs defaultValue={currentTab} onValueChange={setCurrentTab} className="w-full">
          <div className="px-6 pt-6 border-b border-indigo-100">
            <TabsList className="bg-indigo-50/50 p-1">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger 
                value="performance"
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
              >
                <Activity className="h-4 w-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger 
                value="insights"
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              {agent.benefits.map((benefit, idx) => (
                <Card key={idx} className="border border-indigo-100 bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900">{benefit.name}</h3>
                      <div className="flex items-center gap-1 px-2 py-1 bg-indigo-50 rounded-full">
                        {trendMap[benefit.trend]}
                        <span className="text-xs font-medium text-indigo-600">{benefit.trendValue}</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="text-2xl font-bold text-indigo-600">{benefit.value}%</span>
                    </div>
                    <p className="text-sm text-gray-500">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
              {/* Gráfico de Uso */}
              <Card className="border border-indigo-100">
                <CardHeader className="pb-0">
                  <CardTitle className="text-sm font-medium">Uso por Dia da Semana</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={agent.performance.usage}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        barSize={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" vertical={false} />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#6366F1"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Impacto por Canal */}
              <Card className="border border-indigo-100">
                <CardHeader className="pb-0">
                  <CardTitle className="text-sm font-medium">Impacto por Canal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={agent.performance.impactByChannel}
                        layout="vertical"
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        barSize={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" horizontal={false} />
                        <XAxis
                          type="number"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#8B5CF6"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {agent.performance.metrics.map((metric, idx) => (
                <Card key={idx} className="border border-indigo-100 bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900">{metric.name}</h3>
                      <Badge className="bg-indigo-50 text-indigo-600">
                        {metric.value > 85 ? 'Excelente' : 
                         metric.value > 75 ? 'Bom' : 'Regular'}
                      </Badge>
                    </div>
                    
                    <div className="text-2xl font-bold mb-3 text-indigo-600">{metric.value}%</div>
                    
                    <div className="relative h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full rounded-full bg-indigo-600"
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Gráfico de Performance */}
            <Card className="mt-6 border border-indigo-100">
              <CardHeader className="pb-0">
                <CardTitle className="text-sm font-medium">Análise de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={agent.performance.metrics}>
                      <PolarGrid stroke="#E0E7FF" />
                      <PolarAngleAxis
                        dataKey="name"
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                      />
                      <PolarRadiusAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
                      <Radar
                        name="Valor"
                        dataKey="value"
                        stroke="#8B5CF6"
                        fill="#A78BFA"
                        fillOpacity={0.4}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="p-6">
            <div className="space-y-4">
              {agent.insights.map((insight, idx) => (
                <Card key={idx} className="border border-indigo-100 bg-white hover:shadow-sm transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-indigo-50">
                        {insight.severity === 'high' ? 
                          <AlertTriangle className="h-5 w-5 text-indigo-600" /> : 
                          insight.severity === 'medium' ? 
                            <InfoIcon className="h-5 w-5 text-indigo-600" /> : 
                            <InfoIcon className="h-5 w-5 text-indigo-600" />
                        }
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{insight.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{insight.description}</p>
                          </div>
                          <Badge className="bg-indigo-50 text-indigo-600">
                            {insight.severity === 'high' ? 'Alto' : 
                             insight.severity === 'medium' ? 'Médio' : 
                             insight.severity === 'low' ? 'Baixo' : 'Info'}
                          </Badge>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {insight.date}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                          >
                            {insight.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
