import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Phone,
  Mail,
  Users,
  Search,
  MessageCircle,
  Clock,
  User,
  Send,
  Paperclip,
  SmilePlus,
  Bot,
  Info,
  MoreVertical,
  Star,
  Clock4,
  Filter,
  Settings,
  ArrowRightLeft,
  CircleSlash,
  BarChart2,
  UserCheck,
  Timer,
  ArrowUpRight,
  Inbox,
  MessagesSquare,
  ListFilter,
  RefreshCw,
  Headphones,
  Calendar,
} from 'lucide-react';

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

export default function Support() {
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [filter, setFilter] = useState('all');

  // Mock data
  const conversations = [
    {
      id: 1,
      customer: {
        name: 'João Silva',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=João',
        email: 'joao.silva@email.com'
      },
      lastMessage: 'Preciso de ajuda com meu pedido #12345',
      time: '2min',
      unread: true,
      status: 'waiting',
      channel: 'whatsapp',
      priority: 'high'
    },
    {
      id: 2,
      customer: {
        name: 'Maria Santos',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        email: 'maria.santos@email.com'
      },
      lastMessage: 'Como faço para alterar meu endereço?',
      time: '5min',
      unread: true,
      status: 'waiting',
      channel: 'messenger',
      priority: 'medium'
    },
    {
      id: 3,
      customer: {
        name: 'Carlos Mendes',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
        email: 'carlos.mendes@email.com'
      },
      lastMessage: 'Não consigo acessar minha conta',
      time: '10min',
      unread: false,
      status: 'waiting',
      channel: 'email',
      priority: 'medium'
    },
    {
      id: 4,
      customer: {
        name: 'Ana Oliveira',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
        email: 'ana.oliveira@email.com'
      },
      lastMessage: 'Meu pagamento não foi processado',
      time: '15min',
      unread: false,
      status: 'waiting',
      channel: 'whatsapp',
      priority: 'high'
    },
    {
      id: 5,
      customer: {
        name: 'Paulo Souza',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Paulo',
        email: 'paulo.souza@email.com'
      },
      lastMessage: 'Preciso de informações sobre garantia',
      time: '20min',
      unread: false,
      status: 'active',
      channel: 'messenger',
      priority: 'low'
    }
  ];

  const metrics = [
    { label: 'Em Espera', value: '12', icon: Clock4, trend: '+2', color: 'text-indigo-600' },
    { label: 'Em Atendimento', value: '8', icon: UserCheck, trend: '-1', color: 'text-purple-600' },
    { label: 'TMA', value: '5:32', icon: Timer, trend: '-0:45', color: 'text-indigo-600' },
    { label: 'Resolvidos', value: '45', icon: ArrowUpRight, trend: '+12', color: 'text-purple-600' },
  ];

  // Mensagens da conversa selecionada
  const messages = [
    {
      id: 1,
      type: 'customer',
      content: 'Olá, estou com um problema no meu pedido #12345. Já faz 5 dias que deveria ter sido entregue.',
      time: '10:30'
    },
    {
      id: 2,
      type: 'agent',
      content: 'Olá João, boa tarde! Entendo sua preocupação. Vou verificar imediatamente o status do seu pedido.',
      time: '10:32'
    },
    {
      id: 3,
      type: 'agent',
      content: 'Estou consultando o sistema, um momento por favor.',
      time: '10:33'
    },
    {
      id: 4,
      type: 'customer',
      content: 'Ok, aguardo. Preciso muito do produto para amanhã.',
      time: '10:34'
    },
    {
      id: 5,
      type: 'agent',
      content: 'Encontrei seu pedido no sistema. Realmente houve um atraso na transportadora. Já estou em contato com eles para priorizar sua entrega. Consegue me informar se você estará em casa amanhã pela manhã?',
      time: '10:37'
    }
  ];

  // Função para renderizar a fila de atendimento
  const renderQueue = () => (
    <div className="space-y-6">
      {/* Indicadores/Métricas */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="border border-indigo-100 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: COLORS.indigo[50] }}>
                  <metric.icon className={metric.color} size={18} />
                </div>
                <Badge 
                  variant="outline" 
                  className={metric.trend.startsWith('+') 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'bg-purple-50 text-purple-600'}
                >
                  {metric.trend}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="text-sm text-gray-500">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
          >
            Todos
          </Button>
          <Button 
            variant={filter === 'waiting' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('waiting')}
            className={filter === 'waiting' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
          >
            Em Espera
          </Button>
          <Button 
            variant={filter === 'active' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('active')}
            className={filter === 'active' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
          >
            Em Atendimento
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar..." 
              className="w-60 pl-9 border-indigo-100"
            />
          </div>
          <Button variant="outline" size="icon" className="border-indigo-100">
            <ListFilter className="h-4 w-4 text-indigo-600" />
          </Button>
          <Button variant="outline" size="icon" className="border-indigo-100">
            <RefreshCw className="h-4 w-4 text-indigo-600" />
          </Button>
        </div>
      </div>

      {/* Lista de Atendimentos */}
      <Card className="border-indigo-100">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-indigo-900 text-lg">Fila de Atendimento</CardTitle>
            <Badge className="bg-indigo-600">{conversations.length} atendimentos</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-indigo-100">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-4 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedConversation(conversation);
                  setActiveTab('chat');
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-indigo-100">
                      <img src={conversation.customer.avatar} alt={conversation.customer.name} />
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{conversation.customer.name}</h3>
                        {conversation.unread && (
                          <Badge className="bg-indigo-600 h-5 px-1">Novo</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{conversation.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      {conversation.channel === 'whatsapp' && (
                        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          WhatsApp
                        </Badge>
                      )}
                      {conversation.channel === 'messenger' && (
                        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Messenger
                        </Badge>
                      )}
                      {conversation.channel === 'email' && (
                        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{conversation.time}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 line-clamp-1">{conversation.lastMessage}</p>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <Badge 
                    variant="outline" 
                    className={
                      conversation.priority === 'high' 
                      ? 'border-red-200 bg-red-50 text-red-700'
                      : conversation.priority === 'medium'
                      ? 'border-amber-200 bg-amber-50 text-amber-700'
                      : 'border-green-200 bg-green-50 text-green-700'
                    }
                  >
                    {conversation.priority === 'high' ? 'Alta Prioridade' : 
                     conversation.priority === 'medium' ? 'Média Prioridade' : 'Baixa Prioridade'}
                  </Badge>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedConversation(conversation);
                      setActiveTab('chat');
                    }}
                    className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-0 h-8 px-2"
                  >
                    Atender
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Função para renderizar a interface de chat
  const renderChat = () => {
    // Se não tiver conversa selecionada
    if (!selectedConversation) {
      return (
        <div className="h-full flex items-center justify-center bg-indigo-50/50">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="bg-white border border-indigo-100 rounded-lg p-6 shadow-sm">
              <div className="p-3 bg-indigo-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma conversa selecionada</h3>
              <p className="text-gray-600 mb-6">Selecione uma conversa da fila de atendimento para iniciar</p>
              <Button 
                onClick={() => setActiveTab('queue')}
                className="bg-indigo-600 hover:bg-indigo-700 w-full"
              >
                Ver Fila de Atendimento
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-indigo-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-indigo-100">
                <img src={selectedConversation.customer.avatar} alt={selectedConversation.customer.name} />
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{selectedConversation.customer.name}</h3>
                  {selectedConversation.channel === 'whatsapp' && (
                    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      WhatsApp
                    </Badge>
                  )}
                  {selectedConversation.channel === 'messenger' && (
                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Messenger
                    </Badge>
                  )}
                  {selectedConversation.channel === 'email' && (
                    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">{selectedConversation.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-indigo-100">
                <Info className="h-4 w-4 mr-2 text-indigo-600" />
                Cliente
              </Button>
              <Button variant="outline" size="sm" className="border-indigo-100">
                <ArrowRightLeft className="h-4 w-4 mr-2 text-indigo-600" />
                Transferir
              </Button>
              <Button variant="outline" size="sm" className="border-indigo-100">
                <CircleSlash className="h-4 w-4 mr-2 text-indigo-600" />
                Finalizar
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="border-indigo-100">
                    <MoreVertical className="h-4 w-4 text-indigo-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Star className="h-4 w-4 mr-2 text-indigo-600" />
                    Marcar como VIP
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                    Agendar retorno
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 bg-gradient-to-br from-indigo-50/30 to-purple-50/30">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.type === 'customer' ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'customer' 
                      ? 'bg-white border border-indigo-100' 
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div 
                    className={`text-xs mt-1 text-right ${
                      message.type === 'customer' ? 'text-gray-500' : 'text-indigo-200'
                    }`}
                  >
                    {message.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="p-4 bg-white border-t border-indigo-100">
          <div className="flex gap-2">
            <Textarea 
              placeholder="Digite sua mensagem..." 
              className="min-h-[100px] border-indigo-100 resize-none"
            />
            
            <div className="flex flex-col gap-2">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Send className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-indigo-100">
                <Bot className="h-4 w-4 text-indigo-600" />
              </Button>
              <Button variant="outline" className="border-indigo-100">
                <Paperclip className="h-4 w-4 text-indigo-600" />
              </Button>
              <Button variant="outline" className="border-indigo-100">
                <SmilePlus className="h-4 w-4 text-indigo-600" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm text-indigo-600 hover:bg-indigo-50"
            >
              Respostas Rápidas
            </Button>
            <Separator orientation="vertical" className="h-4 bg-indigo-200" />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm text-indigo-600 hover:bg-indigo-50"
            >
              Modelos de Mensagem
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="h-16 border-b bg-white px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-900">Central de Atendimento</h1>
          <Badge variant="outline" className="bg-green-50 text-green-700">Online</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-indigo-100">
            <Settings className="h-4 w-4 mr-2 text-indigo-600" />
            Configurações
          </Button>
          <Button variant="outline" size="sm" className="border-indigo-100">
            <BarChart2 className="h-4 w-4 mr-2 text-indigo-600" />
            Relatórios
          </Button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="h-[calc(100%-4rem)]">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <div className="border-b bg-white px-6">
            <TabsList className="h-12 bg-transparent gap-6">
              <TabsTrigger 
                value="queue" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none rounded-none h-12 px-4"
              >
                <Inbox className="h-4 w-4 mr-2" />
                Fila de Atendimento
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none rounded-none h-12 px-4"
              >
                <MessagesSquare className="h-4 w-4 mr-2" />
                Interface de Atendimento
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-auto p-6 bg-gradient-to-r from-gray-50 to-gray-100">
            <TabsContent value="queue" className="mt-0 h-full">
              {renderQueue()}
            </TabsContent>
            
            <TabsContent value="chat" className="mt-0 h-full">
              {renderChat()}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}