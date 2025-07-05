import React, { useState, useEffect } from 'react';
import { AIAgent } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot,
  Brain,
  BarChart2,
  Headphones,
  ShoppingCart,
  TrendingUp,
  Users,
  DollarSign,
  Truck,
  Scale,
  Zap,
  PlusCircle,
  Info,
  AlertTriangle,
  Settings,
  ChevronRight,
  Star,
  Search,
  X,
  Check,
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  Globe,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Target,
  PieChart,
  FileText,
  Share2,
  Calculator,
  UserPlus,
  BookOpen,
  Heart,
  Shield,
  Lock,
  Map,
  Package,
  Home,
  FolderKanban,
  CalendarClock,
  LayoutGrid,
  List
} from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Paleta de cores consistente
const COLORS = {
  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    500: '#6366F1',
    600: '#4F46E5'
  },
  purple: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    500: '#8B5CF6',
    600: '#7C3AED'
  }
};

export default function AIAgents() {
  const [agents, setAgents] = useState([]);
  const [activeTab, setActiveTab] = useState('default');
  const [isLoading, setIsLoading] = useState(true);
  const [activeMarketCategory, setActiveMarketCategory] = useState('all');
  
  // Estados para modais
  const [detailsModal, setDetailsModal] = useState({ open: false, agent: null });
  const [configModal, setConfigModal] = useState({ open: false, agent: null });
  const [usageModal, setUsageModal] = useState({ open: false, agent: null });
  const [testModal, setTestModal] = useState({ open: false, agent: null });

  useEffect(() => {
    async function loadAgents() {
      try {
        const data = await AIAgent.list();
        setAgents(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load agents:', error);
        setIsLoading(false);
      }
    }
    loadAgents();
  }, []);

  // Dados de configuração e áreas de atuação para cada agente
  const agentDetails = {
    'insight': {
      description: 'O Insight analisa continuamente os dados de interação com clientes para identificar padrões, tendências e oportunidades de melhoria nos processos de atendimento.',
      capabilities: [
        'Análise em tempo real de dados de atendimento',
        'Detecção proativa de gargalos e pontos de fricção',
        'Sugestões baseadas em análise comparativa histórica',
        'Alertas automáticos para desvios de métricas-chave'
      ],
      channels: ['whatsapp', 'livechat', 'email', 'voice'],
      config: {
        alertThreshold: 15,
        analysisFrequency: 'hourly',
        notifyByEmail: true,
        detectionSensitivity: 'medium'
      }
    },
    'navigator': {
      description: 'O Navigator mapeia e otimiza fluxos de navegação em interfaces conversacionais, URAs e sites, melhorando a experiência do usuário e reduzindo abandono.',
      capabilities: [
        'Mapeamento de jornadas do usuário',
        'Identificação de pontos de abandono',
        'Recomendações para simplificação de fluxos',
        'Testes A/B automatizados para opções de menu'
      ],
      channels: ['whatsapp', 'livechat', 'voice'],
      config: {
        analyzeInactive: true,
        optimizationLevel: 'high',
        suggestAlternatives: true,
        predictiveModeling: true
      }
    },
    'auditor': {
      description: 'O Auditor monitora a conformidade com scripts, políticas e boas práticas em todos os canais de atendimento, garantindo qualidade e reduzindo riscos.',
      capabilities: [
        'Verificação de aderência a scripts padronizados',
        'Detecção de linguagem inadequada ou riscos legais',
        'Monitoramento de cumprimento de SLAs',
        'Avaliação de conformidade com políticas internas'
      ],
      channels: ['whatsapp', 'livechat', 'email', 'voice', 'social'],
      config: {
        strictMode: false,
        reportingFrequency: 'daily',
        complianceThreshold: 90,
        saveEvidence: true
      }
    },
    'engage': {
      description: 'O Engage aprimora a comunicação com o cliente, tornando-a mais empática e humanizada, mesmo em interações automatizadas.',
      capabilities: [
        'Análise de sentimento em tempo real',
        'Personalização do tom de comunicação',
        'Detecção de frustração e escalonamento proativo',
        'Sugestões de resposta contextualmente adequadas'
      ],
      channels: ['whatsapp', 'livechat', 'email', 'social'],
      config: {
        empathyLevel: 'high',
        personalizeByCustomer: true,
        detectEmotionalState: true,
        autoEscalate: false
      }
    },
    'brain': {
      description: 'O Brain atua como central de conhecimento organizacional, permitindo que humanos e bots acessem informações precisas em tempo real.',
      capabilities: [
        'Busca inteligente na base de conhecimento',
        'Geração de respostas contextualizadas',
        'Manutenção automática da base de conhecimento',
        'Identificação de lacunas de informação'
      ],
      channels: ['whatsapp', 'livechat', 'email', 'voice', 'teams', 'internal'],
      config: {
        knowledgeSource: 'all',
        continuousLearning: true,
        confidenceThreshold: 85,
        citeSources: true
      }
    },
    'sales': {
      description: 'O Sales Booster potencializa vendas através de recomendações de cross-selling, upselling e detecção de oportunidades de negócio durante o atendimento.',
      capabilities: [
        'Detecção de intenção de compra',
        'Recomendações personalizadas de produtos',
        'Otimização de timing para ofertas',
        'Previsão de propensão à conversão'
      ],
      channels: ['whatsapp', 'livechat', 'email', 'voice'],
      config: {
        recommendationStyle: 'subtle',
        maxOffersPerInteraction: 2,
        prioritizeLoyalCustomers: true,
        trackConversions: true
      }
    },
    'marketing': {
      description: 'O Campaign Optimizer analisa dados de campanhas em multicanais, otimizando segmentação, timing e conteúdo para máxima eficiência.',
      capabilities: [
        'Análise de desempenho de campanhas',
        'Segmentação dinâmica de audiência',
        'Otimização de horários e frequência',
        'Testes multivariados automatizados'
      ],
      channels: ['email', 'whatsapp', 'social', 'sms'],
      config: {
        testingStrategy: 'aggressive',
        segmentGranularity: 'high',
        aiContentOptimization: true,
        realTimeOptimization: false
      }
    },
    'finance': {
      description: 'O Risk Analyst avalia riscos financeiros, creditícios e de fraude em operações, protegendo a empresa e otimizando processos de aprovação.',
      capabilities: [
        'Detecção precoce de fraudes',
        'Avaliação de risco de crédito',
        'Monitoramento de comportamentos anômalos',
        'Previsões de inadimplência'
      ],
      channels: ['internal', 'api'],
      config: {
        riskTolerance: 'low',
        fraudDetectionLevel: 'high',
        falsePositivePrevention: true,
        realTimeScoring: true
      }
    },
    'hr': {
      description: 'O Talent Screener agiliza e aprimora processos de recrutamento e seleção, identificando candidatos ideais com maior precisão.',
      capabilities: [
        'Triagem inicial de currículos',
        'Análise de compatibilidade de perfil',
        'Agendamento inteligente de entrevistas',
        'Avaliação preliminar de soft skills'
      ],
      channels: ['email', 'internal', 'api'],
      config: {
        diversityFocus: true,
        skillsWeighting: 'balanced',
        experienceEmphasis: 'medium',
        culturalFitAnalysis: true
      }
    },
    'sales_booster': {
      description: 'Otimização de funil de vendas e cross-selling.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'lead_qualifier': {
      description: 'Qualificação automática de leads com análise preditiva.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'deal_advisor': {
      description: 'Recomendações inteligentes para fechamento de negócios.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'pricing_optimizer': {
      description: 'Otimização dinâmica de preços baseada em mercado.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'sales_coach': {
      description: 'Treinamento e desenvolvimento de equipes comerciais.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'campaign_optimizer': {
      description: 'Otimização de campanhas multicanal.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'content_creator': {
      description: 'Geração e otimização de conteúdo com IA.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'social_manager': {
      description: 'Gestão automatizada de redes sociais.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'seo_optimizer': {
      description: 'Otimização contínua para mecanismos de busca.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'customer_segmenter': {
      description: 'Segmentação avançada de público-alvo.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'risk_analyst': {
      description: 'Análise de risco e prevenção de fraudes.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'cash_flow_predictor': {
      description: 'Previsão e otimização de fluxo de caixa.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'expense_optimizer': {
      description: 'Otimização automática de despesas.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'invoice_processor': {
      description: 'Processamento automático de faturas e notas.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'tax_assistant': {
      description: 'Assistente para gestão tributária.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'talent_screener': {
      description: 'Triagem e seleção de candidatos.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'onboarding_assistant': {
      description: 'Automatização do processo de onboarding.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'performance_analyzer': {
      description: 'Análise de desempenho e desenvolvimento.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'training_manager': {
      description: 'Gestão personalizada de treinamentos.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'culture_analyzer': {
      description: 'Análise e fortalecimento da cultura organizacional.',
      capabilities: [],
      channels: [],
      config: {}
    },
        'contract_analyzer': {
      description: 'Análise e revisão automática de contratos.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'compliance_monitor': {
      description: 'Monitoramento contínuo de compliance.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'legal_researcher': {
      description: 'Pesquisa jurídica automatizada.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'gdpr_assistant': {
      description: 'Assistente para conformidade com LGPD/GDPR.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'dispute_analyzer': {
      description: 'Análise preditiva de disputas legais.',
      capabilities: [],
      channels: [],
      config: {}
    },
        'route_optimizer': {
      description: 'Otimização inteligente de rotas.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'inventory_manager': {
      description: 'Gestão preditiva de estoque.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'delivery_predictor': {
      description: 'Previsão precisa de prazos de entrega.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'warehouse_optimizer': {
      description: 'Otimização de layout e processos de armazém.',
      capabilities: [],
      channels: [],
      config: {}
    },
    'demand_forecaster': {
      description: 'Previsão de demanda com IA.',
      capabilities: [],
      channels: [],
      config: {}
    },
  };

  // Agentes padrão com design atualizado
  const defaultAgents = [
    {
      id: 'insight',
      name: 'Insight',
      icon: <BarChart2 className="h-5 w-5" />,
      color: COLORS.indigo[500],
      description: 'Analisa dados, detecta pontos de fricção e oportunidades de melhoria.',
      metrics: ['93% Precisão', '45min Resposta', '87% Satisfação'],
      status: 'active'
    },
    {
      id: 'navigator',
      name: 'Navigator',
      icon: <TrendingUp className="h-5 w-5" />,
      color: COLORS.purple[500],
      description: 'Mapeamento e otimização de fluxos de navegação.',
      metrics: ['88% Otimização', '32% Redução', '91% Eficácia'],
      status: 'active'
    },
    {
      id: 'auditor',
      name: 'Auditor',
      icon: <AlertTriangle className="h-5 w-5" />,
      color: COLORS.indigo[600],
      description: 'Monitora conformidade e boas práticas em todos os canais.',
      metrics: ['95% Compliance', '28min Análise', '92% Acurácia'],
      status: 'active'
    },
    {
      id: 'engage',
      name: 'Engage',
      icon: <Headphones className="h-5 w-5" />,
      color: COLORS.purple[600],
      description: 'Auxilia em comunicação empática e humanizada.',
      metrics: ['89% Satisfação', '3.2min Resposta', '94% Empatia'],
      status: 'active'
    },
    {
      id: 'brain',
      name: 'Brain',
      icon: <Brain className="h-5 w-5" />,
      color: COLORS.indigo[500],
      description: 'Central de conhecimento com IA generativa.',
      metrics: ['96% Precisão', '1.8s Resposta', '91% Resolução'],
      status: 'active'
    }
  ];

  // Marketplace agentes organizados por área
  const marketplaceAgents = {
    sales: [
      {
        id: 'sales_booster',
        name: 'Sales Booster',
        icon: <ShoppingCart className="h-5 w-5" />,
        color: COLORS.indigo[500],
        description: 'Otimização de funil de vendas e cross-selling.',
        metrics: ['32% Conversão', '+28% Ticket', '15min Ciclo'],
        category: 'Comercial',
        status: 'active'
      },
      {
        id: 'lead_qualifier',
        name: 'Lead Qualifier',
        icon: <Target className="h-5 w-5" />,
        color: COLORS.purple[500],
        description: 'Qualificação automática de leads com análise preditiva.',
        metrics: ['89% Precisão', '-35% Tempo', '+42% SQL'],
        category: 'Comercial',
        status: 'active'
      },
      {
        id: 'deal_advisor',
        name: 'Deal Advisor',
        icon: <PieChart className="h-5 w-5" />,
        color: COLORS.indigo[600],
        description: 'Recomendações inteligentes para fechamento de negócios.',
        metrics: ['+25% Win Rate', '-15% Ciclo', '93% Acurácia'],
        category: 'Comercial',
        status: 'active'
      },
      {
        id: 'pricing_optimizer',
        name: 'Pricing Optimizer',
        icon: <DollarSign className="h-5 w-5" />,
        color: COLORS.purple[600],
        description: 'Otimização dinâmica de preços baseada em mercado.',
        metrics: ['+18% Margem', '95% Precisão', '-8% Desconto'],
        category: 'Comercial',
        status: 'coming_soon'
      },
      {
        id: 'sales_coach',
        name: 'Sales Coach',
        icon: <Users className="h-5 w-5" />,
        color: COLORS.indigo[500],
        description: 'Treinamento e desenvolvimento de equipes comerciais.',
        metrics: ['+40% Performance', '92% Satisfação', '+28% Habilidades'],
        category: 'Comercial',
        status: 'active'
      }
    ],
    marketing: [
      {
        id: 'campaign_optimizer',
        name: 'Campaign Optimizer',
        icon: <Zap className="h-5 w-5" />,
        color: COLORS.purple[500],
        description: 'Otimização de campanhas multicanal.',
        metrics: ['45% CTR', '38% Abertura', '-22% CAC'],
        category: 'Marketing',
        status: 'active'
      },
      {
        id: 'content_creator',
        name: 'Content Creator',
        icon: <FileText className="h-5 w-5" />,
        color: COLORS.indigo[500],
        description: 'Geração e otimização de conteúdo com IA.',
        metrics: ['+52% Engajamento', '98% Original', '4.8/5 Qualidade'],
        category: 'Marketing',
        status: 'active'
      },
      {
        id: 'social_manager',
        name: 'Social Manager',
        icon: <Share2 className="h-5 w-5" />,
        color: COLORS.purple[600],
        description: 'Gestão automatizada de redes sociais.',
        metrics: ['+65% Alcance', '28% Interação', '-40% Tempo'],
        category: 'Marketing',
        status: 'active'
      },
      {
        id: 'seo_optimizer',
        name: 'SEO Optimizer',
        icon: <Search className="h-5 w-5" />,
        color: COLORS.indigo[600],
        description: 'Otimização contínua para mecanismos de busca.',
        metrics: ['+82% Ranking', '45% Tráfego', '3.2x ROI'],
        category: 'Marketing',
        status: 'coming_soon'
      },
      {
        id: 'customer_segmenter',
        name: 'Customer Segmenter',
        icon: <Users className="h-5 w-5" />,
        color: COLORS.purple[500],
        description: 'Segmentação avançada de público-alvo.',
        metrics: ['96% Precisão', '+38% Conversão', '12 Segmentos'],
        category: 'Marketing',
        status: 'active'
      }
    ],
    finance: [
      {
        id: 'risk_analyst',
        name: 'Risk Analyst',
        icon: <AlertTriangle className="h-5 w-5" />,
        color: COLORS.indigo[600],
        description: 'Análise de risco e prevenção de fraudes.',
        metrics: ['-35% Fraude', '92% Precisão', '4h Análise'],
        category: 'Financeiro',
        status: 'active'
      },
      {
        id: 'cash_flow_predictor',
        name: 'Cash Flow Predictor',
        icon: <TrendingUp className="h-5 w-5" />,
        color: COLORS.purple[500],
        description: 'Previsão e otimização de fluxo de caixa.',
        metrics: ['95% Acurácia', '+28% Eficiência', '-15% Custos'],
        category: 'Financeiro',
        status: 'active'
      },
      {
        id: 'expense_optimizer',
        name: 'Expense Optimizer',
        icon: <DollarSign className="h-5 w-5" />,
        color: COLORS.indigo[500],
        description: 'Otimização automática de despesas.',
        metrics: ['-22% Custos', '89% Economia', '3.8x ROI'],
        category: 'Financeiro',
        status: 'coming_soon'
      },
      {
        id: 'invoice_processor',
        name: 'Invoice Processor',
        icon: <FileText className="h-5 w-5" />,
        color: COLORS.purple[600],
        description: 'Processamento automático de faturas e notas.',
        metrics: ['-75% Tempo', '99% Precisão', '24/7 Operação'],
        category: 'Financeiro',
        status: 'active'
      },
      {
        id: 'tax_assistant',
        name: 'Tax Assistant',
        icon: <Calculator className="h-5 w-5" />,
        color: COLORS.indigo[500],
        description: 'Assistente para gestão tributária.',
        metrics: ['100% Compliance', '-45% Tempo', '92% Economia'],
        category: 'Financeiro',
        status: 'active'
      }
    ],
    hr: [
      {
        id: 'talent_screener',
        name: 'Talent Screener',
        icon: <Users className="h-5 w-5" />,
        color: COLORS.purple[600],
        description: 'Triagem e seleção de candidatos.',
        metrics: ['-40% Tempo', '89% Match', '+25% Retenção'],
        category: 'RH',
        status: 'active'
      },
      {
        id: 'onboarding_assistant',
        name: 'Onboarding Assistant',
        icon: <UserPlus className="h-5 w-5" />,
        color: COLORS.indigo[500],
        description: 'Automatização do processo de onboarding.',
        metrics: ['-65% Tempo', '94% Satisfação', '100% Compliance'],
        category: 'RH',
        status: 'active'
      },
      {
        id: 'performance_analyzer',
        name: 'Performance Analyzer',
        icon: <BarChart2 className="h-5 w-5" />,
        color: COLORS.purple[500],
        description: 'Análise de desempenho e desenvolvimento.',
        metrics: ['+32% Produtividade', '96% Precisão', '-25% Turnover'],
        category: 'RH',
        status: 'coming_soon'
      },
      {
        id: 'training_manager',
        name: 'Training Manager',
        icon: <BookOpen className="h-5 w-5" />,
        color: COLORS.indigo[600],
        description: 'Gestão personalizada de treinamentos.',
        metrics: ['+45% Engajamento', '92% Conclusão', '4.8/5 Avaliação'],
        category: 'RH',
        status: 'active'
      },
      {
        id: 'culture_analyzer',
        name: 'Culture Analyzer',
        icon: <Heart className="h-5 w-5" />,
        color: COLORS.purple[500],
        description: 'Análise e fortalecimento da cultura organizacional.',
        metrics: ['+38% Engajamento', '-28% Conflitos', '95% Precisão'],
        category: 'RH',
        status: 'active'
      }
    ],
    legal: [
      {
        id: 'contract_analyzer',
        name: 'Contract Analyzer',
        icon: <FileText className="h-5 w-5" />,
        color: COLORS.indigo[500],
        description: 'Análise e revisão automática de contratos.',
        metrics: ['-70% Tempo', '99% Precisão', '100% Compliance'],
        category: 'Jurídico',
        status: 'active'
      },
      {
        id: 'compliance_monitor',
        name: 'Compliance Monitor',
        icon: <Shield className="h-5 w-5" />,
        color: COLORS.purple[600],
        description: 'Monitoramento contínuo de compliance.',
        metrics: ['100% Cobertura', '-45% Riscos', '24/7 Monitoramento'],
        category: 'Jurídico',
        status: 'active'
      },
      {
        id: 'legal_researcher',
        name: 'Legal Researcher',
        icon: <Search className="h-5 w-5" />,
        color: COLORS.indigo[600],
        description: 'Pesquisa jurídica automatizada.',
        metrics: ['-80% Tempo', '92% Relevância', '+65% Eficiência'],
        category: 'Jurídico',
        status: 'coming_soon'
      },
      {
        id: 'gdpr_assistant',
        name: 'GDPR Assistant',
        icon: <Lock className="h-5 w-5" />,
        color: COLORS.purple[500],
        description: 'Assistente para conformidade com LGPD/GDPR.',
        metrics: ['100% Compliance', '-55% Riscos', '98% Acurácia'],
        category: 'Jurídico',
        status: 'active'
      },
      {
        id: 'dispute_analyzer',
        name: 'Dispute Analyzer',
        icon: <Scale className="h-5 w-5" />,
        color: COLORS.indigo[500],
        description: 'Análise preditiva de disputas legais.',
        metrics: ['+45% Resolução', '-35% Custos', '89% Precisão'],
        category: 'Jurídico',
        status: 'active'
      }
    ],
    logistics: [
      {
        id: 'route_optimizer',
        name: 'Route Optimizer',
        icon: <Map className="h-5 w-5" />,
        color: COLORS.purple[500],
        description: 'Otimização inteligente de rotas.',
        metrics: ['-25% Custos', '+40% Eficiência', '-18% Tempo'],
        category: 'Logística',
        status: 'active'
      },
      {
        id: 'inventory_manager',
        name: 'Inventory Manager',
        icon: <Package className="h-5 w-5" />,
        color: COLORS.indigo[600],
        description: 'Gestão preditiva de estoque.',
        metrics: ['-32% Estoque', '+28% Giro', '98% Precisão'],
        category: 'Logística',
        status: 'active'
      },
      {
        id: 'delivery_predictor',
        name: 'Delivery Predictor',
        icon: <Truck className="h-5 w-5" />,
        color: COLORS.purple[600],
        description: 'Previsão precisa de prazos de entrega.',
        metrics: ['95% Precisão', '+42% Satisfação', '-15% Atrasos'],
        category: 'Logística',
        status: 'coming_soon'
      },
      {
        id: 'warehouse_optimizer',
        name: 'Warehouse Optimizer',
        icon: <Home className="h-5 w-5" />,
        color: COLORS.indigo[500],
        description: 'Otimização de layout e processos de armazém.',
        metrics: ['+35% Eficiência', '-28% Custos', '+45% Produtividade'],
        category: 'Logística',
        status: 'active'
      },
      {
        id: 'demand_forecaster',
        name: 'Demand Forecaster',
        icon: <BarChart2 className="h-5 w-5" />,
        color: COLORS.purple[500],
        description: 'Previsão de demanda com IA.',
        metrics: ['92% Acurácia', '-25% Ruptura', '+38% Planejamento'],
        category: 'Logística',
        status: 'active'
      }
    ]
  };

  // Mapeamento de ícones para canais
  const channelIcons = {
    'whatsapp': <MessageSquare className="h-4 w-4" />,
    'livechat': <MessageSquare className="h-4 w-4" />,
    'email': <Mail className="h-4 w-4" />,
    'voice': <Phone className="h-4 w-4" />,
    'social': <Globe className="h-4 w-4" />,
    'teams': <Users className="h-4 w-4" />,
    'internal': <Bot className="h-4 w-4" />,
    'api': <Sliders className="h-4 w-4" />,
    'sms': <MessageSquare className="h-4 w-4" />
  };

  const renderAgentCard = (agent) => {
    const isActive = agent.status === 'active';
    const isComingSoon = agent.status === 'coming_soon';
    const details = agentDetails[agent.id];

    return (
      <Card className="bg-white hover:shadow-md transition-all duration-300 border border-gray-100">
        <CardHeader className="space-y-0 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg" 
                style={{ backgroundColor: `${agent.color}15` }}
              >
                {React.cloneElement(agent.icon, { style: { color: agent.color } })}
              </div>
              <div>
                <CardTitle className="text-base font-semibold">{agent.name}</CardTitle>
                {agent.category && (
                  <CardDescription className="text-xs mt-0.5">{agent.category}</CardDescription>
                )}
              </div>
            </div>
            {isComingSoon ? (
              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                Em breve
              </Badge>
            ) : (
              <Badge 
                variant="outline" 
                className={`text-xs ${isActive ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}
              >
                {isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pb-3">
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{agent.description}</p>
          
          <div className="grid grid-cols-3 gap-2">
            {agent.metrics.map((metric, idx) => (
              <div 
                key={idx} 
                className="text-center p-2 rounded-lg bg-gray-50"
              >
                <p className="text-xs font-medium text-gray-900">{metric}</p>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-4 flex flex-col gap-2">
          <div className="w-full flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-700 p-0 h-auto"
              onClick={() => setDetailsModal({ open: true, agent })}
            >
              <Info className="w-4 h-4 mr-1" />
              Detalhes
            </Button>
            
            {isComingSoon ? (
              <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-600">
                Lançamento em breve
              </Badge>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-indigo-100 text-indigo-600 hover:bg-indigo-50 h-8"
                  onClick={() => setConfigModal({ open: true, agent })}
                >
                  <Settings className="w-3.5 h-3.5 mr-1" />
                  Configurar
                </Button>
                
                <Button 
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 h-8"
                  onClick={() => setTestModal({ open: true, agent })}
                >
                  Testar
                </Button>
              </div>
            )}
          </div>
          
          <div className="w-full pt-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 justify-start"
              onClick={() => setUsageModal({ open: true, agent })}
            >
              <ChevronRight className="w-3.5 h-3.5 mr-1" />
              Ver onde atua
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agentes de IA</h1>
          <p className="text-gray-500 mt-1">Automatize e otimize seu atendimento com agentes inteligentes</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-indigo-100">
            <Search className="w-4 h-4 mr-2 text-indigo-500" />
            Buscar Agentes
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Agente
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-1">
          <TabsList className="w-full grid grid-cols-2 p-1 gap-1 bg-gray-50/80">
            <TabsTrigger value="default" onClick={() => setActiveTab('default')} className="data-[state=active]:bg-white">
              <Bot className="h-4 w-4 mr-2" />
              <span>Agentes Default</span>
            </TabsTrigger>
            <TabsTrigger value="marketplace" onClick={() => setActiveTab('marketplace')} className="data-[state=active]:bg-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span>Marketplace</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="default">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {defaultAgents.map((agent) => (
              <div key={agent.id}>
                {renderAgentCard(agent)}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="marketplace">
          <div className="space-y-6">
            {/* Menu de Navegação por Categorias */}
            <div className="bg-white rounded-xl border border-gray-100 p-2">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={activeMarketCategory === 'all' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveMarketCategory('all')}
                  className={activeMarketCategory === 'all' 
                    ? "bg-indigo-600 hover:bg-indigo-700" 
                    : "text-gray-600 hover:text-indigo-700"}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Todos
                </Button>
                
                {Object.entries(marketplaceAgents).map(([category, _]) => (
                  <Button
                    key={category}
                    variant={activeMarketCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveMarketCategory(category)}
                    className={activeMarketCategory === category 
                      ? "bg-indigo-600 hover:bg-indigo-700" 
                      : "text-gray-600 hover:text-indigo-700"}
                  >
                    {getCategoryIcon(category)}
                    <span className="ml-2">{getCategoryName(category)}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Agentes Disponíveis</p>
                    <p className="text-2xl font-bold text-indigo-700 mt-1">27</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Bot className="h-5 w-5 text-indigo-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Categorias</p>
                    <p className="text-2xl font-bold text-indigo-700 mt-1">6</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <FolderKanban className="h-5 w-5 text-indigo-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Em Alta</p>
                    <p className="text-2xl font-bold text-indigo-700 mt-1">5</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <TrendingUp className="h-5 w-5 text-indigo-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Em Breve</p>
                    <p className="text-2xl font-bold text-indigo-700 mt-1">6</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <CalendarClock className="h-5 w-5 text-indigo-500" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Campo de Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Buscar agentes por nome, função ou categoria..." 
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Conteúdo das Categorias */}
            {activeMarketCategory === 'all' ? (
              // Mostrar todas as categorias quando 'all' está selecionado
              Object.entries(marketplaceAgents).map(([category, agents]) => (
                <div key={category} className="space-y-4 mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      {getCategoryIcon(category)}
                      {getCategoryName(category)}
                    </h2>
                    <Button 
                      variant="outline" 
                      className="text-sm"
                      onClick={() => setActiveMarketCategory(category)}
                    >
                      Ver todos
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {agents.slice(0, 3).map((agent) => (
                      <div key={agent.id}>
                        {renderAgentCard(agent)}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Mostrar apenas a categoria selecionada
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    {getCategoryIcon(activeMarketCategory)}
                    {getCategoryName(activeMarketCategory)}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="popular">
                      <SelectTrigger className="w-[160px] h-9 text-sm">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popular">Mais Populares</SelectItem>
                        <SelectItem value="newest">Mais Recentes</SelectItem>
                        <SelectItem value="performance">Melhor Performance</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {marketplaceAgents[activeMarketCategory].map((agent) => (
                    <div key={agent.id}>
                      {renderAgentCard(agent)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes */}
      <Dialog open={detailsModal.open} onOpenChange={(open) => setDetailsModal({ ...detailsModal, open })}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {detailsModal.agent && React.cloneElement(detailsModal.agent.icon, { 
                className: "h-6 w-6", 
                style: { color: detailsModal.agent?.color } 
              })}
              {detailsModal.agent?.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 pt-2">
              {detailsModal.agent && agentDetails[detailsModal.agent.id]?.description}
            </DialogDescription>
          </DialogHeader>
          
          {detailsModal.agent && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-indigo-500" />
                  Capabilities
                </h3>
                <div className="space-y-2">
                  {agentDetails[detailsModal.agent.id]?.capabilities.map((capability, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="rounded-full p-1 bg-indigo-50 mt-0.5">
                        <Check className="h-3 w-3 text-indigo-500" />
                      </div>
                      <p className="text-sm text-gray-700">{capability}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-3">Performance</h3>
                <div className="grid grid-cols-3 gap-3">
                  {detailsModal.agent.metrics.map((metric, idx) => (
                    <div key={idx} className="bg-indigo-50 rounded-lg p-3 text-center">
                      <p className="text-sm font-semibold text-indigo-700">{metric}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-indigo-500" />
                  Informações Adicionais
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm">
                    <p className="text-gray-500 mb-1">Status:</p>
                    <Badge 
                      variant="outline" 
                      className={detailsModal.agent.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}
                    >
                      {detailsModal.agent.status === 'active' ? 'Ativo' : 'Em breve'}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500 mb-1">Categoria:</p>
                    <p className="font-medium">{detailsModal.agent.category || 'Agente Padrão'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDetailsModal({ open: false, agent: null })}
            >
              Fechar
            </Button>
            {detailsModal.agent?.status === 'active' && (
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => {
                  setDetailsModal({ open: false, agent: null });
                  setTestModal({ open: true, agent: detailsModal.agent });
                }}
              >
                Testar Agente
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Onde Atua */}
      <Dialog open={usageModal.open} onOpenChange={(open) => setUsageModal({ ...usageModal, open })}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Onde o {usageModal.agent?.name} atua
            </DialogTitle>
            <DialogDescription>
              Canais e integrações compatíveis com este agente
            </DialogDescription>
          </DialogHeader>
          
          {usageModal.agent && (
            <div className="space-y-6">
              <h3 className="text-sm font-medium">Canais Compatíveis</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {agentDetails[usageModal.agent.id]?.channels.map((channel, idx) => (
                  <div key={idx} className="bg-indigo-50 rounded-lg p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white">
                      {React.cloneElement(channelIcons[channel], { 
                        className: "h-5 w-5 text-indigo-500" 
                      })}
                    </div>
                    <span className="text-sm font-medium capitalize">{channel}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-3">Casos de Uso</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                  <p className="mb-2">Este agente é especialmente útil para:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Operações de {usageModal.agent.category || 'atendimento'} de médio e grande porte</li>
                    <li>Ambientes com múltiplos canais de comunicação</li>
                    <li>Equipes que precisam otimizar processos internos</li>
                    <li>Organizações que valorizam análise de dados para tomada de decisões</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUsageModal({ open: false, agent: null })}
            >
              Fechar
            </Button>
            {usageModal.agent?.status === 'active' && (
              <Button 
                variant="default"
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => {
                  setUsageModal({ open: false, agent: null });
                  setConfigModal({ open: true, agent: usageModal.agent });
                }}
              >
                Configurar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Configuração */}
      <Dialog open={configModal.open} onOpenChange={(open) => setConfigModal({ ...configModal, open })}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-500" />
              Configurar {configModal.agent?.name}
            </DialogTitle>
            <DialogDescription>
              Personalize as configurações do agente de acordo com suas necessidades
            </DialogDescription>
          </DialogHeader>
          
          {configModal.agent && agentDetails[configModal.agent.id]?.config && (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {Object.entries(agentDetails[configModal.agent.id].config).map(([key, value], idx) => {
                // Transformar camelCase em words with spaces
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                
                if (typeof value === 'boolean') {
                  return (
                    <div key={idx} className="flex items-center justify-between">
                      <Label htmlFor={`config-${key}`} className="flex-1">
                        <span className="font-medium">{label}</span>
                        <p className="text-sm text-gray-500 mt-1">
                          {getConfigDescription(key, configModal.agent.id)}
                        </p>
                      </Label>
                      <Switch 
                        id={`config-${key}`} 
                        checked={value} 
                        onCheckedChange={() => {}} 
                      />
                    </div>
                  );
                }
                
                if (typeof value === 'number') {
                  return (
                    <div key={idx} className="space-y-2">
                      <Label htmlFor={`config-${key}`} className="font-medium">
                        {label} 
                        <span className="ml-1 text-sm text-gray-500">({value})</span>
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        {getConfigDescription(key, configModal.agent.id)}
                      </p>
                      <div className="relative mt-1">
                        <input 
                          id={`config-${key}`}
                          type="range" 
                          min="0" 
                          max="100" 
                          value={value} 
                          onChange={() => {}}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                    </div>
                  );
                }
                
                if (typeof value === 'string') {
                  return (
                    <div key={idx} className="space-y-2">
                      <Label htmlFor={`config-${key}`} className="font-medium">{label}</Label>
                      <p className="text-sm text-gray-500 mt-1">
                        {getConfigDescription(key, configModal.agent.id)}
                      </p>
                      <select 
                        id={`config-${key}`}
                        value={value}
                        onChange={() => {}}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm ring-0 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      >
                        {getConfigOptions(key).map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  );
                }
                
                return null;
              })}
              
              <div className="space-y-2">
                <Label htmlFor="custom-prompt" className="font-medium">
                  Prompt Personalizado
                </Label>
                <p className="text-sm text-gray-500">
                  Defina instruções adicionais para o comportamento deste agente
                </p>
                <Textarea 
                  id="custom-prompt"
                  placeholder="Ex: Priorize interações com clientes do segmento premium."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfigModal({ open: false, agent: null })}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setConfigModal({ open: false, agent: null })}
            >
              Salvar Configurações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Teste */}
      <Dialog open={testModal.open} onOpenChange={(open) => setTestModal({ ...testModal, open })}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-500" />
              Testar {testModal.agent?.name}
            </DialogTitle>
            <DialogDescription>
              Experimente o agente em um ambiente de sandbox
            </DialogDescription>
          </DialogHeader>
          
          {testModal.agent && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  Neste ambiente você pode testar as funcionalidades do {testModal.agent.name} sem afetar seu ambiente de produção.
                  Selecione um canal e um cenário para iniciar o teste.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="test-channel" className="font-medium">Canal para Teste</Label>
                  <select 
                    id="test-channel"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm ring-0 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  >
                    {agentDetails[testModal.agent.id]?.channels.map(channel => (
                      <option key={channel} value={channel}>{channel.charAt(0).toUpperCase() + channel.slice(1)}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="test-scenario" className="font-medium">Cenário de Teste</Label>
                  <select 
                    id="test-scenario"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm ring-0 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  >
                    <option value="simple">Caso Simples</option>
                    <option value="complex">Caso Complexo</option>
                    <option value="edge">Caso Limite</option>
                    <option value="error">Simulação de Erro</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test-input" className="font-medium">Entrada de Teste</Label>
                <Textarea 
                  id="test-input"
                  placeholder="Digite um exemplo de entrada para o agente..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTestModal({ open: false, agent: null })}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setTestModal({ open: false, agent: null })}
            >
              Iniciar Teste
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Adicione estas funções auxiliares no final do arquivo
function getCategoryIcon(category) {
  const icons = {
    sales: <ShoppingCart className="h-5 w-5 text-indigo-500" />,
    marketing: <Zap className="h-5 w-5 text-purple-500" />,
    finance: <DollarSign className="h-5 w-5 text-indigo-600" />,
    hr: <Users className="h-5 w-5 text-purple-600" />,
    legal: <Scale className="h-5 w-5 text-indigo-500" />,
    logistics: <Truck className="h-5 w-5 text-purple-500" />
  };
  return icons[category] || <Bot className="h-5 w-5 text-gray-500" />;
}

function getCategoryName(category) {
  const names = {
    sales: 'Comercial',
    marketing: 'Marketing',
    finance: 'Financeiro',
    hr: 'Recursos Humanos',
    legal: 'Jurídico',
    logistics: 'Logística'
  };
  return names[category] || category;
}

// Função auxiliar para obter descrições de configurações
function getConfigDescription(key, agentId) {
  const descriptions = {
    alertThreshold: 'Percentual de desvio para acionar alertas automáticos',
    analysisFrequency: 'Frequência de análise e atualização de dados',
    notifyByEmail: 'Enviar notificações por email quando houver alertas',
    detectionSensitivity: 'Sensibilidade para detecção de anomalias',
    analyzeInactive: 'Analisar também fluxos inativos ou pouco utilizados',
    optimizationLevel: 'Nível de otimização e sugestões automáticas',
    suggestAlternatives: 'Sugerir fluxos alternativos para melhorar navegação',
    predictiveModeling: 'Usar modelagem preditiva para antecipar comportamentos',
    strictMode: 'Aplicar verificação estrita para conformidade',
    reportingFrequency: 'Frequência de geração de relatórios',
    complianceThreshold: 'Limite mínimo aceitável de conformidade',
    saveEvidence: 'Salvar evidências para auditoria futura',
    empathyLevel: 'Nível de empatia nas comunicações automatizadas',
    personalizeByCustomer: 'Personalizar comunicações por perfil de cliente',
    detectEmotionalState: 'Detectar estado emocional do cliente',
    autoEscalate: 'Escalar automaticamente em casos de alta sensibilidade',
    knowledgeSource: 'Fontes de conhecimento a serem utilizadas',
    continuousLearning: 'Aprendizado contínuo com base em feedbacks',
    confidenceThreshold: 'Limiar de confiança para fornecer respostas',
    citeSources: 'Citar fontes de informação nas respostas',
    recommendationStyle: 'Estilo das recomendações e ofertas',
    maxOffersPerInteraction: 'Número máximo de ofertas por interação',
    prioritizeLoyalCustomers: 'Priorizar clientes com maior fidelidade',
    trackConversions: 'Rastrear conversões após recomendações',
    testingStrategy: 'Estratégia para testes e otimizações',
    segmentGranularity: 'Granularidade da segmentação de audiência',
    aiContentOptimization: 'Otimização de conteúdo com IA',
    realTimeOptimization: 'Otimização em tempo real durante campanhas',
    riskTolerance: 'Tolerância a riscos nas avaliações',
    fraudDetectionLevel: 'Nível de detecção de fraudes',
    falsePositivePrevention: 'Prevenção de falsos positivos',
    realTimeScoring: 'Pontuação de risco em tempo real',
    diversityFocus: 'Foco em diversidade nos processos de seleção',
    skillsWeighting: 'Ponderação entre diferentes habilidades',
    experienceEmphasis: 'Ênfase em experiência prévia',
    culturalFitAnalysis: 'Análise de adequação cultural'
  };
  
  return descriptions[key] || 'Configure esta opção de acordo com suas necessidades';
}

// Função auxiliar para obter opções de configuração
function getConfigOptions(key) {
  const options = {
    analysisFrequency: ['hourly', 'daily', 'weekly'],
    detectionSensitivity: ['low', 'medium', 'high'],
    optimizationLevel: ['low', 'medium', 'high'],
    reportingFrequency: ['daily', 'weekly', 'monthly'],
    empathyLevel: ['low', 'medium', 'high'],
    knowledgeSource: ['all', 'internal', 'approved'],
    recommendationStyle: ['subtle', 'moderate', 'aggressive'],
    testingStrategy: ['conservative', 'balanced', 'aggressive'],
    segmentGranularity: ['low', 'medium', 'high'],
    riskTolerance: ['low', 'medium', 'high'],
    fraudDetectionLevel: ['low', 'medium', 'high'],
    skillsWeighting: ['technical', 'balanced', 'soft']
  };
  
  return options[key] || ['low', 'medium', 'high'];
}
