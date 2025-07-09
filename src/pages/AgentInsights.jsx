import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell
} from 'recharts';
import {
  Bot,
  GitBranch,
  ArrowDown,
  MessageSquare,
  UserCheck,
  Search,
  Activity,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Clock,
  Filter,
  PieChart,
  BarChart2,
  Users,
  Headphones,
  FileText,
  Phone,
  Mail,
  Check,
  Info,
  Smartphone,
  ZapIcon,
  ThumbsUp,
  ArrowRight,
  Send,
  AlertCircle,
  Zap,
  Target,
  Settings,
  PlayCircle,
  StopCircle,
  Eye,
  MessageCircle,
  TrendingDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Pause,
  Play,
  Users2,
  Network,
  Bug,
  Shield,
  Timer,
  Workflow
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
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
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// Simulação de API para obter dados dos agentes
const AIAgent = {
  list: () => Promise.resolve([
    { 
      id: 1, 
      name: 'Assistente Financeiro', 
      category: 'financial', 
      efficiency: 94,
      icon: <PieChart className="w-5 h-5 text-indigo-600" />
    },
    { 
      id: 2, 
      name: 'Assistente Comercial', 
      category: 'sales', 
      efficiency: 92,
      icon: <BarChart2 className="w-5 h-5 text-indigo-600" />
    },
    { 
      id: 3, 
      name: 'Assistente de RH', 
      category: 'hr', 
      efficiency: 87,
      icon: <Users className="w-5 h-5 text-indigo-600" />
    },
    { 
      id: 4, 
      name: 'Assistente de Suporte', 
      category: 'support', 
      efficiency: 89,
      icon: <Headphones className="w-5 h-5 text-indigo-600" />
    },
    { 
      id: 5, 
      name: 'Assistente de Atendimento', 
      category: 'customer', 
      efficiency: 91,
      icon: <MessageSquare className="w-5 h-5 text-indigo-600" />
    }
  ])
};

// Lista dos times de agentes com nomes em português
const agentTeams = [
  { id: "comprador", name: "Comprador", journeys: [
    { id: "basic", name: "Compra básica" },
    { id: "product_doubt", name: "Compra com dúvida sobre produto" },
    { id: "special_request", name: "Compra com solicitação especial" }
  ]},
  { id: "atendente", name: "Atendente", journeys: [
    { id: "basic_chat", name: "Chat simples" },
    { id: "complex_chat", name: "Chat com questões complexas" },
    { id: "multi_intent", name: "Chat com múltiplas intenções" }
  ]},
  { id: "investigador", name: "Investigador", journeys: [
    { id: "investigation", name: "Investigação de caso" },
    { id: "assessment", name: "Avaliação de cenário" },
    { id: "mystery_shopping", name: "Cliente oculto" }
  ]},
  { id: "negociador", name: "Negociador", journeys: [
    { id: "price_negotiation", name: "Negociação de preço" },
    { id: "contract_terms", name: "Termos contratuais" },
    { id: "discount_request", name: "Solicitação de desconto" }
  ]},
  { id: "qualificador", name: "Qualificador", journeys: [
    { id: "lead_qualification", name: "Qualificação de leads" },
    { id: "scoring", name: "Pontuação de interesse" },
    { id: "profiling", name: "Perfilamento de cliente" }
  ]},
  { id: "mapeador", name: "Mapeador", journeys: [
    { id: "process_mapping", name: "Mapeamento de processo" },
    { id: "journey_mapping", name: "Mapeamento de jornada" },
    { id: "experience_map", name: "Mapa de experiência" }
  ]},
  { id: "cronometrista", name: "Cronometrista", journeys: [
    { id: "time_tracking", name: "Acompanhamento de tempo" },
    { id: "deadline_management", name: "Gestão de prazos" },
    { id: "schedule_optimization", name: "Otimização de agenda" }
  ]},
  { id: "analista", name: "Analista", journeys: [
    { id: "internal_processes", name: "Processos internos" },
    { id: "employee_experience", name: "Experiência do colaborador" },
    { id: "operational_insights", name: "Insights operacionais" }
  ]},
  { id: "psicologo", name: "Psicólogo", journeys: [
    { id: "sentiment_analysis", name: "Análise de sentimento" },
    { id: "emotional_assessment", name: "Avaliação emocional" },
    { id: "satisfaction_survey", name: "Pesquisa de satisfação" }
  ]},
  { id: "solucionador", name: "Solucionador", journeys: [
    { id: "tech_problem", name: "Problema técnico" },
    { id: "troubleshooting", name: "Diagnóstico de problemas" },
    { id: "issue_resolution", name: "Resolução de incidentes" }
  ]}
];

// Componente para modal de detalhes do agente
const AgentDetailsModal = ({ agentId, agentName, onClose }) => {
  const agentDetails = {
    "comprador": {
      descricao: "O agente Comprador simula e avalia experiências de compra, analisando comportamentos de usuários, interações e pontos de fricção durante o processo de compra.",
      sugestoes: [
        "Utilize em e-commerces para identificar gargalos no fluxo de checkout",
        "Implemente em marketplaces para avaliar a experiência de comparação de produtos",
        "Aplique em lojas físicas integradas com e-commerce para análise omnichannel"
      ],
      metricas: [
        "Taxa de abandono de carrinho",
        "Tempo médio para finalização de compra",
        "Satisfação com processo de pagamento",
        "Índice de facilidade de navegação"
      ]
    },
    "atendente": {
      descricao: "O agente Atendente avalia interações de chat, analisando eficiência, precisão e satisfação do cliente em conversas com atendentes ou chatbots.",
      sugestoes: [
        "Utilize para avaliar e aprimorar bots de atendimento",
        "Implemente para treinar novos atendentes com simulações reais",
        "Aplique para identificar falhas de comunicação em canais de chat"
      ],
      metricas: [
        "Tempo médio de resolução de problemas",
        "Taxa de entendimento correto da intenção",
        "Satisfação com respostas fornecidas",
        "Número de interações por resolução"
      ]
    },
    "investigador": {
      descricao: "O agente Investigador simula um cliente oculto virtual, avaliando a qualidade do atendimento, conhecimento do produto e eficiência do serviço.",
      sugestoes: [
        "Utilize para avaliar a qualidade do atendimento em diferentes canais",
        "Implemente para verificar a consistência das informações fornecidas",
        "Aplique para identificar oportunidades de treinamento da equipe"
      ],
      metricas: [
        "Precisão das informações fornecidas",
        "Tempo de resposta em diferentes situações",
        "Cordialidade e empatia no atendimento",
        "Taxa de resolução completa de problemas"
      ]
    },
    "negociador": {
      descricao: "O agente Negociador analisa processos de negociação, avaliando táticas, concessões e resultados finais em diferentes cenários.",
      sugestoes: [
        "Utilize em equipes de vendas para aprimorar técnicas de negociação",
        "Implemente em processos de contratação e aquisição",
        "Aplique para analisar eficiência em resolução de conflitos"
      ],
      metricas: [
        "Taxa de conversão após negociação",
        "Valor médio de descontos concedidos",
        "Tempo médio para fechamento",
        "Satisfação do cliente com o processo"
      ]
    },
    "qualificador": {
      descricao: "O agente Qualificador avalia e qualifica leads, determinando potencial de conversão, interesse real e adequação ao produto ou serviço.",
      sugestoes: [
        "Utilize para otimizar processos de qualificação de leads",
        "Implemente em campanhas de marketing para avaliar eficácia",
        "Aplique para segmentar e priorizar prospects de alto valor"
      ],
      metricas: [
        "Precisão na identificação de leads qualificados",
        "Tempo de qualificação por lead",
        "Taxa de conversão de leads qualificados",
        "Retorno sobre investimento em campanhas"
      ]
    },
    "mapeador": {
      descricao: "O agente Mapeador cria e analisa mapas de jornada do cliente, identificando pontos de contato, emoções e oportunidades de melhoria.",
      sugestoes: [
        "Utilize para visualizar e otimizar jornadas complexas",
        "Implemente para identificar pontos de fricção em processos",
        "Aplique para planejar melhorias em experiências omnichannel"
      ],
      metricas: [
        "Número de pontos de contato por jornada",
        "Tempo total de jornada",
        "Taxa de conclusão de jornada",
        "Nível de satisfação em cada etapa"
      ]
    },
    "cronometrista": {
      descricao: "O agente Cronometrista analisa tempos de resposta, processamento e resolução, identificando gargalos operacionais e oportunidades de otimização.",
      sugestoes: [
        "Utilize para identificar etapas que consomem mais tempo",
        "Implemente para estabelecer SLAs realistas",
        "Aplique para monitorar e melhorar a eficiência operacional"
      ],
      metricas: [
        "Tempo médio de resposta inicial",
        "Tempo total de resolução",
        "Variação de tempo entre canais",
        "Tempo entre etapas do processo"
      ]
    },
    "analista": {
      descricao: "O agente Analista avalia processos internos e experiência de colaboradores, identificando oportunidades de melhoria em fluxos de trabalho.",
      sugestoes: [
        "Utilize para aprimorar processos internos e reduzir fricção",
        "Implemente para avaliar a eficiência de ferramentas de trabalho",
        "Aplique para melhorar a comunicação entre departamentos"
      ],
      metricas: [
        "Satisfação dos colaboradores com ferramentas",
        "Tempo gasto em tarefas administrativas",
        "Eficiência da comunicação interna",
        "Taxa de conclusão de projetos no prazo"
      ]
    },
    "psicologo": {
      descricao: "O agente Psicólogo analisa sentimentos e emoções durante interações, identificando padrões emocionais e oportunidades de melhoria na empatia.",
      sugestoes: [
        "Utilize para treinar atendentes em inteligência emocional",
        "Implemente para identificar momentos de frustração do cliente",
        "Aplique para melhorar respostas em situações emocionalmente intensas"
      ],
      metricas: [
        "Precisão na detecção de sentimentos",
        "Variação emocional durante interações",
        "Taxa de reversão de sentimentos negativos",
        "Nível de empatia percebida"
      ]
    },
    "solucionador": {
      descricao: "O agente Solucionador identifica e resolve problemas técnicos, analisando eficiência, precisão e velocidade na resolução de incidentes.",
      sugestoes: [
        "Utilize para otimizar fluxos de suporte técnico",
        "Implemente para criar bases de conhecimento eficientes",
        "Aplique para treinar equipes na resolução de problemas comuns"
      ],
      metricas: [
        "Taxa de resolução no primeiro contato",
        "Tempo médio para diagnóstico",
        "Precisão do diagnóstico inicial",
        "Satisfação com a solução fornecida"
      ]
    }
  };

  const detalhes = agentDetails[agentId] || {
    descricao: "Informações detalhadas sobre este agente não estão disponíveis no momento.",
    sugestoes: ["Não disponível"],
    metricas: ["Não disponível"]
  };

  if (!agentId || !agentName) return null;

  return (
    <Dialog open={!!agentId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-indigo-600" />
            Agente {agentName}
          </DialogTitle>
          <DialogDescription>
            Detalhes, sugestões de implementação e métricas específicas
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-sm font-medium mb-2">O que este agente faz?</h3>
            <p className="text-sm text-gray-600">{detalhes.descricao}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Sugestões de implementação</h3>
            <ul className="space-y-1">
              {detalhes.sugestoes.map((sugestao, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span>{sugestao}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Principais métricas específicas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {detalhes.metricas.map((metrica, idx) => (
                <div key={idx} className="bg-indigo-50 p-2 rounded-md">
                  <p className="text-sm text-indigo-700">{metrica}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
          <Button onClick={onClose}>
            Testar este agente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function AgentInsights() {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [agentDetailsModal, setAgentDetailsModal] = useState({ open: false, agentId: '', agentName: '' });

  // ESTADOS PARA FORÇA TAREFA
  const [selectedTaskForce, setSelectedTaskForce] = useState([]);
  const [testPrompt, setTestPrompt] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [testMode, setTestMode] = useState('setup'); // setup, running, completed
  const [testStarted, setTestStarted] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [testDuration, setTestDuration] = useState(0);
  const [taskForceStatus, setTaskForceStatus] = useState('idle'); // idle, active, paused, completed
  const [activeConversations, setActiveConversations] = useState([]);
  const [mappedFlows, setMappedFlows] = useState([]);
  const [criticalIssues, setCriticalIssues] = useState([]);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [conversationFilters, setConversationFilters] = useState({
    agent: 'all',
    status: 'all',
    severity: 'all'
  });
  const [testResults, setTestResults] = useState(null);

  // Carregar dados iniciais
  useEffect(() => {
    async function loadData() {
      try {
        const agentsData = await AIAgent.list();
        setAgents(agentsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Falha ao carregar dados:', error);
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Configurar Realtime para atualizações em tempo real
  useEffect(() => {
    if (!realTimeUpdates || testMode !== 'running') return;

    const channel = supabase
      .channel('agent-insights-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'interactions'
      }, (payload) => {
        console.log('Nova interação detectada:', payload.new);
        // Atualizar conversas ativas
        setActiveConversations(prev => {
          const updated = [...prev];
          const conversationIndex = updated.findIndex(conv => 
            conv.agentId === payload.new.ai_agent_id
          );
          
          if (conversationIndex >= 0) {
            updated[conversationIndex].metrics.messageCount += 1;
            updated[conversationIndex].status = payload.new.status || 'active';
          }
          
          return updated;
        });
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        console.log('Nova mensagem detectada:', payload.new);
        // Atualizar mensagens nas conversas
        setActiveConversations(prev => {
          const updated = [...prev];
          updated.forEach(conv => {
            if (conv.messages.some(msg => msg.interaction_id === payload.new.interaction_id)) {
              conv.messages.push({
                id: payload.new.id,
                timestamp: new Date(payload.new.created_at),
                sender: payload.new.sender_type,
                content: payload.new.content,
                status: 'received',
                type: payload.new.message_type
              });
            }
          });
          return updated;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [realTimeUpdates, testMode]);

  // Alternar seleção de agente na força tarefa
  const toggleAgentInTaskForce = (agentId) => {
    setSelectedTaskForce(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  // Encontrar jornadas disponíveis para o time selecionado
  const getTeamJourneys = (teamId) => {
    const team = agentTeams.find(team => team.id === teamId);
    return team ? team.journeys : [];
  };

  // Iniciar teste com força tarefa
  const startTaskForceTest = async () => {
    if (selectedTaskForce.length === 0 || !selectedChannel || !testPrompt.trim()) {
      alert('Por favor, selecione pelo menos um agente, um canal e defina um prompt para o teste.');
      return;
    }

    setTestMode('running');
    setTestStarted(true);
    setTaskForceStatus('active');
    setProgress(0);
    setCurrentStep(0);
    setTestComplete(false);
    setTestDuration(0);

    try {
      // Inicializar conversas reais com cada agente
      const conversations = [];
      
      for (const agentId of selectedTaskForce) {
        const agentName = agentTeams.find(team => team.id === agentId)?.name || 'Agente';
        
        // Chamar API real de IA para cada agente usando a nova Edge Function
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
              timestamp: new Date().toISOString()
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
                confidence: aiResponse.confidence,
                model: aiResponse.model
              }
            ],
            metrics: {
              responseTime: 0,
              messageCount: 1,
              engagement: 0
            }
          };
          
          conversations.push(conversation);
          
          // Se for WhatsApp, enviar mensagem real
          if (selectedChannel === 'whatsapp' && phoneNumber) {
            await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/whatsapp-integration`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
              },
              body: JSON.stringify({
                message: aiResponse.response,
                phoneNumber: phoneNumber,
                agentType: agentId
              })
            });
          }
        } else {
          // Fallback para simulação em caso de erro
          const errorData = await response.json();
          console.warn('Erro na API de IA, usando fallback:', errorData);
          
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
                content: errorData.fallback || `Sou o agente ${agentName} e recebi sua mensagem: "${testPrompt}". Esta é uma resposta de fallback.`,
                status: 'sent',
                type: 'text',
                sentiment: 'neutral',
                confidence: 0.5,
                model: 'fallback'
              }
            ],
            metrics: {
              responseTime: 0,
              messageCount: 1,
              engagement: 0
            }
          };
          
          conversations.push(conversation);
        }
      }
      
      setActiveConversations(conversations);
      
      // Simulação do progresso do teste com atualizações reais
      const interval = setInterval(async () => {
        setProgress(prev => {
          const newProgress = prev + 1;
          
          if (newProgress === 15) setCurrentStep(1);
          if (newProgress === 30) setCurrentStep(2);
          if (newProgress === 50) setCurrentStep(3);
          if (newProgress === 70) setCurrentStep(4);
          if (newProgress === 90) setCurrentStep(5);
          
          if (newProgress >= 100) {
            clearInterval(interval);
            setTestComplete(true);
            setTestMode('completed');
            setTaskForceStatus('completed');
            generateTaskForceResults();
            return 100;
          }
          return newProgress;
        });
      }, 100);

      // Timer de duração
      const durationTimer = setInterval(() => {
        setTestDuration(prev => {
          if (testComplete) {
            clearInterval(durationTimer);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao iniciar força tarefa:', error);
      alert('Erro ao iniciar força tarefa. Verifique as configurações.');
      setTestMode('setup');
      setTestStarted(false);
      setTaskForceStatus('idle');
    }
  };

  // Pausar/Retomar teste
  const toggleTaskForceTest = () => {
    if (taskForceStatus === 'active') {
      setTaskForceStatus('paused');
    } else if (taskForceStatus === 'paused') {
      setTaskForceStatus('active');
    }
  };

  // Parar teste
  const stopTaskForceTest = () => {
    setTestMode('completed');
    setTaskForceStatus('completed');
    setTestComplete(true);
    generateTaskForceResults();
  };

  // Gerar resultados da força tarefa
  const generateTaskForceResults = () => {
    // Simular fluxos mapeados
    const flows = selectedTaskForce.map(agentId => ({
      agentId,
      agentName: agentTeams.find(team => team.id === agentId)?.name || 'Agente',
      steps: [
        { id: 'greeting', name: 'Saudação', completed: true, duration: 5, success: true },
        { id: 'identification', name: 'Identificação', completed: true, duration: 8, success: true },
        { id: 'qualification', name: 'Qualificação', completed: true, duration: 15, success: Math.random() > 0.3 },
        { id: 'resolution', name: 'Resolução', completed: Math.random() > 0.2, duration: 20, success: Math.random() > 0.4 },
        { id: 'conclusion', name: 'Conclusão', completed: Math.random() > 0.4, duration: 10, success: Math.random() > 0.3 }
      ],
      efficiency: Math.floor(Math.random() * 20) + 75,
      completionRate: Math.floor(Math.random() * 15) + 80
    }));
    setMappedFlows(flows);

    // Simular problemas críticos
    const issues = [
      {
        id: 'issue_001',
        severity: 'high',
        category: 'communication',
        agentId: selectedTaskForce[0],
        agentName: agentTeams.find(team => team.id === selectedTaskForce[0])?.name || 'Agente',
        title: 'Falha na compreensão da intenção',
        description: 'O agente não conseguiu identificar corretamente a intenção do usuário após 3 tentativas',
        occurrence: new Date(),
        impact: 'Possível perda de conversão',
        suggestion: 'Revisar treinamento de NLP para este tipo de consulta',
        status: 'open'
      },
      {
        id: 'issue_002',
        severity: 'medium',
        category: 'technical',
        agentId: selectedTaskForce[1] || selectedTaskForce[0],
        agentName: agentTeams.find(team => team.id === selectedTaskForce[1] || selectedTaskForce[0])?.name || 'Agente',
        title: 'Tempo de resposta elevado',
        description: 'Tempo de resposta superior a 10 segundos em múltiplas interações',
        occurrence: new Date(),
        impact: 'Experiência do usuário prejudicada',
        suggestion: 'Otimizar processamento de queries complexas',
        status: 'open'
      }
    ];
    setCriticalIssues(issues);

    // Gerar resultados finais
    const results = {
      resumo: {
        duracao: Math.floor(testDuration / 60) + "m " + (testDuration % 60) + "s",
        agentes_ativos: selectedTaskForce.length,
        interacoes_totais: activeConversations.reduce((acc, conv) => acc + conv.messages.length, 0),
        taxa_sucesso: Math.floor(Math.random() * 15) + 80 + "%",
        problemas_criticos: issues.filter(i => i.severity === 'high').length,
        fluxos_mapeados: flows.length
      },
      metricas: {
        tempo_resposta_medio: (Math.random() * 3 + 1).toFixed(1) + "s",
        taxa_resolucao_global: Math.floor(Math.random() * 15) + 75 + "%",
        taxa_abandono_global: Math.floor(Math.random() * 10) + 5 + "%",
        satisfacao_media: (Math.random() * 1.5 + 3.5).toFixed(1) + "/5"
      }
    };

    setTestResults(results);
    setActiveTab('task-force-conversation');
  };

  // Filtrar conversas
  const getFilteredConversations = () => {
    return activeConversations.filter(conv => {
      if (conversationFilters.agent !== 'all' && conv.agentId !== conversationFilters.agent) {
        return false;
      }
      if (conversationFilters.status !== 'all' && conv.status !== conversationFilters.status) {
        return false;
      }
      return true;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Análise de Agentes</h1>
          <p className="text-gray-500">Análise detalhada de desempenho, fluxos e métricas por agente</p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={cn(
          "w-full mb-6",
          testMode === 'running' || testMode === 'completed' 
            ? "grid grid-cols-6" 
            : "grid grid-cols-2"
        )}>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            <span>Força Tarefa</span>
          </TabsTrigger>
          <TabsTrigger value="agent_cards" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Agentes</span>
          </TabsTrigger>
          
          {/* NOVAS ABAS DA FORÇA TAREFA - Aparecem apenas quando teste está ativo/completo */}
          {(testMode === 'running' || testMode === 'completed') && (
            <>
              <TabsTrigger value="task-force-conversation" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Conversas</span>
                {activeConversations.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                    {activeConversations.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="task-force-flows" className="flex items-center gap-2">
                <Workflow className="w-4 h-4" />
                <span>Fluxos</span>
                {mappedFlows.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                    {mappedFlows.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="task-force-issues" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Problemas</span>
                {criticalIssues.length > 0 && (
                  <Badge 
                    variant={criticalIssues.some(i => i.severity === 'high') ? "destructive" : "secondary"} 
                    className="ml-1 h-4 w-4 p-0 text-xs"
                  >
                    {criticalIssues.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span>Insights</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Conteúdo da aba Força Tarefa */}
        <TabsContent value="overview" className="space-y-6">
          {!testStarted || testComplete ? (
            <>
              {/* Card de configuração de teste com força tarefa */}
              {!testResults && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users2 className="w-5 h-5 text-indigo-600" />
                      Configuração da Força Tarefa
                    </CardTitle>
                    <CardDescription>
                      Selecione múltiplos agentes para formar uma força tarefa e configure os parâmetros do teste
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Seletor de Força Tarefa (Múltiplos Agentes) */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Selecione os agentes da força tarefa</label>
                        <Badge variant="outline" className="text-xs">
                          {selectedTaskForce.length} agente{selectedTaskForce.length !== 1 ? 's' : ''} selecionado{selectedTaskForce.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {agentTeams.map((team) => (
                          <div
                            key={team.id}
                            onClick={() => toggleAgentInTaskForce(team.id)}
                            className={cn(
                              "relative p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                              selectedTaskForce.includes(team.id)
                                ? "border-indigo-500 bg-indigo-50 shadow-sm"
                                : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                            )}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-indigo-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{team.name}</div>
                                <div className="text-xs text-gray-500">{team.journeys.length} jornadas</div>
                              </div>
                            </div>
                            
                            {selectedTaskForce.includes(team.id) && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {selectedTaskForce.length > 0 && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Força tarefa configurada</span>
                          </div>
                          <p className="text-sm text-green-700">
                            {selectedTaskForce.length} agente{selectedTaskForce.length !== 1 ? 's' : ''} pronto{selectedTaskForce.length !== 1 ? 's' : ''} para o teste
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Campo de Prompt Personalizado */}
                    {selectedTaskForce.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Objetivo da força tarefa (prompt personalizado)</label>
                        <Textarea
                          placeholder="Descreva o objetivo do teste e qual comportamento os agentes devem simular. Ex: 'Simular um cliente interessado em comprar um produto específico, fazer perguntas sobre preços e condições de pagamento.'"
                          value={testPrompt}
                          onChange={(e) => setTestPrompt(e.target.value)}
                          className="min-h-[100px] resize-none"
                        />
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Este prompt será usado por todos os agentes da força tarefa</span>
                          <span>{testPrompt.length}/500</span>
                        </div>
                      </div>
                    )}

                    {/* Seletor de Canal */}
                    {selectedTaskForce.length > 0 && testPrompt.trim() && (
                      <div className="space-y-4">
                        <label className="text-sm font-medium">Selecione o canal que deseja testar:</label>
                        <div className="flex flex-wrap gap-3 justify-start">
                          <button
                            type="button"
                            onClick={() => setSelectedChannel("whatsapp")}
                            className={cn(
                              "inline-flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200",
                              selectedChannel === "whatsapp" 
                                ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300' 
                                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                            )}
                          >
                            <MessageSquare className="w-5 h-5" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedChannel("email")}
                            className={cn(
                              "inline-flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200",
                              selectedChannel === "email" 
                                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                            )}
                          >
                            <Mail className="w-5 h-5" />
                            <span>E-mail</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedChannel("telefonia")}
                            className={cn(
                              "inline-flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200",
                              selectedChannel === "telefonia" 
                                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' 
                                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200'
                            )}
                          >
                            <Phone className="w-5 h-5" />
                            <span>Telefonia</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Campo de número */}
                    {(selectedChannel === "whatsapp" || selectedChannel === "telefonia") && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Digite o número de contato:</label>
                        <Input
                          type="text"
                          placeholder="(XX) XXXXX-XXXX"
                          value={phoneNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 11) {
                              const formatted = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                              setPhoneNumber(formatted.trim());
                            }
                          }}
                          className="w-full md:w-72"
                        />
                      </div>
                    )}

                    {/* Botões de Execução */}
                    {selectedChannel && (
                      <div className="flex flex-wrap gap-4 mt-8 pt-4 border-t">
                        <Button 
                          onClick={startTaskForceTest}
                          disabled={selectedTaskForce.length === 0 || !selectedChannel || !testPrompt.trim()}
                          className="flex items-center gap-2"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Iniciar Força Tarefa
                        </Button>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Target className="w-4 h-4" />
                          <span>
                            {selectedTaskForce.length} agente{selectedTaskForce.length !== 1 ? 's' : ''} • 
                            {selectedChannel} • 
                            {testPrompt.length > 0 ? 'Prompt definido' : 'Prompt pendente'}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Card de resultados após teste */}
              {testResults && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users2 className="w-5 h-5 text-indigo-600" />
                        Resumo da Força Tarefa
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-indigo-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm font-medium">Duração</span>
                          </div>
                          <p className="text-indigo-700 font-bold">{testResults.resumo.duracao}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Users2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Agentes</span>
                          </div>
                          <p className="text-green-700 font-bold">{testResults.resumo.agentes_ativos}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <span className="text-sm font-medium">Status: Teste Concluído</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveTab('task-force-conversation')}
                        >
                          Ver Conversas
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Problemas Identificados
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">
                            {criticalIssues.filter(i => i.severity === 'high').length}
                          </div>
                          <div className="text-xs text-red-600">Críticos</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">
                            {criticalIssues.filter(i => i.severity === 'medium').length}
                          </div>
                          <div className="text-xs text-yellow-600">Médios</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {criticalIssues.filter(i => i.severity === 'low').length}
                          </div>
                          <div className="text-xs text-blue-600">Baixos</div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setActiveTab('task-force-issues')}
                      >
                        Ver Todos os Problemas
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          ) : (
            // Interface durante execução do teste
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Força Tarefa em Execução</span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={toggleTaskForceTest}
                    >
                      {taskForceStatus === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={stopTaskForceTest}
                    >
                      <StopCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progresso do Teste</span>
                    <span className="text-sm text-gray-500">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-indigo-50 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">{selectedTaskForce.length}</div>
                      <div className="text-xs text-indigo-600">Agentes Ativos</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{activeConversations.length}</div>
                      <div className="text-xs text-green-600">Conversas</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.floor(testDuration / 60)}:{(testDuration % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-purple-600">Tempo</div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600">{criticalIssues.length}</div>
                      <div className="text-xs text-amber-600">Problemas</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Aba de Cards dos Agentes */}
        <TabsContent value="agent_cards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentTeams.map((team) => (
              <Card 
                key={team.id} 
                className="overflow-hidden border border-indigo-100 hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  setAgentDetailsModal({
                    open: true,
                    agentId: team.id,
                    agentName: team.name
                  });
                }}
              >
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium flex items-center gap-2">
                    <Bot className="h-5 w-5 text-indigo-600" />
                    {team.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    {team.id === "comprador" && "Analisa experiências de compra e comportamento do usuário."}
                    {team.id === "atendente" && "Avalia interações de chat para identificar padrões e pontos de melhoria."}
                    {team.id === "investigador" && "Realiza testes secretos para avaliar a qualidade do atendimento."}
                    {team.id === "negociador" && "Analisa negociações e identifica oportunidades de conversão."}
                    {team.id === "qualificador" && "Qualifica leads e avalia potencial de conversão."}
                    {team.id === "mapeador" && "Mapeia jornadas e identifica pontos de otimização."}
                    {team.id === "cronometrista" && "Mede tempos de resposta e identifica gargalos operacionais."}
                    {team.id === "analista" && "Avalia processos internos e experiência de colaboradores."}
                    {team.id === "psicologo" && "Analisa sentimentos e emoções durante interações."}
                    {team.id === "solucionador" && "Identifica e resolve problemas técnicos."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {team.journeys.slice(0, 2).map((journey) => (
                      <Badge key={journey.id} variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                        {journey.name}
                      </Badge>
                    ))}
                    {team.journeys.length > 2 && (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        +{team.journeys.length - 2} mais
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Aba Conversas */}
        {(testMode === 'running' || testMode === 'completed') && (
          <TabsContent value="task-force-conversation" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Conversas da Força Tarefa</h2>
                <p className="text-gray-500">Acompanhe as conversas em tempo real entre os agentes e o número alvo</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                >
                  {realTimeUpdates ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  {realTimeUpdates ? 'Tempo Real' : 'Pausado'}
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-indigo-600" />
                  Conversas Ativas
                  <Badge variant="secondary" className="ml-2">
                    {getFilteredConversations().length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getFilteredConversations().map(conversation => (
                    <div key={conversation.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-indigo-100 text-indigo-600">
                              {conversation.agentName.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{conversation.agentName}</div>
                            <div className="text-xs text-gray-500">{conversation.channel}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'}>
                            {conversation.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {conversation.messages.length} msg
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {conversation.messages.slice(-3).map(message => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex gap-2 text-sm",
                              message.sender === 'agent' ? 'flex-row-reverse' : ''
                            )}
                          >
                            <div className={cn(
                              "max-w-[80%] p-2 rounded-lg",
                              message.sender === 'agent' 
                                ? 'bg-indigo-100 text-indigo-800' 
                                : 'bg-gray-100 text-gray-800'
                            )}>
                              {message.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Aba Fluxos */}
        {(testMode === 'running' || testMode === 'completed') && (
          <TabsContent value="task-force-flows" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Fluxos Mapeados</h2>
                <p className="text-gray-500">Visualize os fluxos de conversação identificados pelos agentes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mappedFlows.map(flow => (
                <Card key={flow.agentId}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-indigo-100 text-indigo-600">
                          {flow.agentName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{flow.agentName}</div>
                        <div className="text-sm text-gray-500 font-normal">
                          Eficiência: {flow.efficiency}% | Conclusão: {flow.completionRate}%
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {flow.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                            step.completed
                              ? step.success
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-500"
                          )}>
                            {step.completed ? (
                              step.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={cn(
                                "text-sm font-medium",
                                step.completed
                                  ? step.success
                                    ? "text-green-700"
                                    : "text-red-700"
                                  : "text-gray-500"
                              )}>
                                {step.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {step.duration}s
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                              <div 
                                className={cn(
                                  "h-1 rounded-full transition-all",
                                  step.completed
                                    ? step.success
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                    : "bg-gray-400"
                                )}
                                style={{ width: step.completed ? '100%' : '0%' }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Progresso geral:</span>
                        <span className="font-medium">
                          {flow.steps.filter(s => s.completed).length}/{flow.steps.length} etapas
                        </span>
                      </div>
                      <Progress 
                        value={(flow.steps.filter(s => s.completed).length / flow.steps.length) * 100} 
                        className="mt-2 h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}

        {/* Aba Problemas */}
        {(testMode === 'running' || testMode === 'completed') && (
          <TabsContent value="task-force-issues" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Problemas Críticos</h2>
                <p className="text-gray-500">Identifique e resolva problemas encontrados durante os testes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Resumo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium">Críticos</span>
                      </div>
                      <p className="text-2xl font-bold text-red-700">
                        {criticalIssues.filter(i => i.severity === 'high').length}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium">Médios</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-700">
                        {criticalIssues.filter(i => i.severity === 'medium').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Lista de Problemas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {criticalIssues.map(issue => (
                        <div key={issue.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                issue.severity === 'high' ? 'bg-red-100' :
                                issue.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                              )}>
                                {issue.severity === 'high' ? <AlertCircle className="w-4 h-4 text-red-600" /> :
                                 issue.severity === 'medium' ? <AlertTriangle className="w-4 h-4 text-yellow-600" /> :
                                 <Info className="w-4 h-4 text-blue-600" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{issue.title}</h4>
                                  <Badge variant={
                                    issue.severity === 'high' ? 'destructive' :
                                    issue.severity === 'medium' ? 'secondary' : 'outline'
                                  }>
                                    {issue.severity === 'high' ? 'Crítico' :
                                     issue.severity === 'medium' ? 'Médio' : 'Baixo'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>Agente: {issue.agentName}</span>
                                  <span>Categoria: {issue.category}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pl-11 space-y-2">
                            <div className="p-2 bg-gray-50 rounded-lg">
                              <div className="text-xs font-medium text-gray-700 mb-1">Impacto:</div>
                              <div className="text-sm text-gray-600">{issue.impact}</div>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                              <div className="text-xs font-medium text-green-700 mb-1">Sugestão:</div>
                              <div className="text-sm text-green-600">{issue.suggestion}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}

        {/* Aba Insights */}
        {(testMode === 'running' || testMode === 'completed') && (
          <TabsContent value="insights" className="space-y-6">
            <div className="text-center py-12">
              <div className="p-4 bg-indigo-50 rounded-full mb-4 w-fit mx-auto">
                <Lightbulb className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Insights de IA</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Os insights detalhados estarão disponíveis após a conclusão completa do teste da força tarefa.
              </p>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Aguardando dados...
              </Button>
            </div>
          </TabsContent>
        )}

      </Tabs>

      {/* Modal de detalhes do agente */}
      {agentDetailsModal.open && (
        <AgentDetailsModal 
          agentId={agentDetailsModal.agentId}
          agentName={agentDetailsModal.agentName}
          onClose={() => setAgentDetailsModal({ open: false, agentId: '', agentName: '' })}
        />
      )}
    </div>
  );
} 