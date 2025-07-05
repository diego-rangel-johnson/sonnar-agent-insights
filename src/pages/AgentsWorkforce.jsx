import React, { useState } from 'react';
import { MessageSquare, Clock, AlertTriangle, Check, Info, TrendingUp, Smartphone } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

export default function AgentsWorkforce() {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [testStarted, setTestStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [date, setDate] = useState(null);
  const [timeHour, setTimeHour] = useState("");
  const [timeMinute, setTimeMinute] = useState("");

  // Aplicando máscara ao número de telefone
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      const formatted = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      setPhoneNumber(formatted.trim());
    }
  };

  // Iniciar teste
  const startTest = () => {
    setTestStarted(true);
    setProgress(0);
    setCurrentStep(0);
    setTestComplete(false);

    // Simulação do progresso do teste
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        
        // Atualiza etapa atual com base no progresso
        if (newProgress === 15) setCurrentStep(1);
        if (newProgress === 30) setCurrentStep(2);
        if (newProgress === 50) setCurrentStep(3);
        if (newProgress === 70) setCurrentStep(4);
        if (newProgress === 90) setCurrentStep(5);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTestComplete(true);
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  // Lista de equipes de agentes
  const agentTeams = [
    "Shopper",
    "ChatBuster",
    "Mystery",
    "Negotiator",
    "Qualifier",
    "Mapper",
    "Timer",
    "Insider",
    "Feeler",
    "Troubleshooter"
  ];

  // Renderização das etapas do teste
  const renderTestNodes = () => {
    const steps = [
      { name: "Início", icon: <div className="w-4 h-4 bg-sky-500 rounded-full animate-pulse" /> },
      { name: "Conexão WhatsApp", icon: <MessageSquare className="w-4 h-4" /> },
      { name: "Início da Operação", icon: <Check className="w-4 h-4" /> },
      { name: "Interação #1", icon: <MessageSquare className="w-4 h-4" /> },
      { name: "Interação #2", icon: <MessageSquare className="w-4 h-4" /> },
      { name: "Conclusão", icon: <Check className="w-4 h-4" /> }
    ];

    return (
      <div className="relative mt-12 mb-20">
        {/* Linha do tempo */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-sky-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Nós da timeline */}
        <div className="flex justify-between relative">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300",
                currentStep >= index 
                  ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white"
                  : "bg-gray-200 text-gray-400"
              )}>
                {step.icon}
              </div>
              <span className={cn(
                "mt-2 text-sm font-medium",
                currentStep >= index ? "text-sky-600" : "text-gray-400"
              )}>
                {step.name}
              </span>
              
              {/* Animação de pulso para o nó atual */}
              {currentStep === index && (
                <div className="absolute top-6 -ml-6 w-12 h-12 rounded-full bg-sky-500 opacity-20 animate-ping" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderização do conteúdo da página
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agents Workforce</h1>
      </div>

      {!testStarted || testComplete ? (
        <Card>
          <CardHeader>
            <CardTitle>Configuração do Teste</CardTitle>
            <CardDescription>
              Configure os parâmetros para iniciar o teste com os agentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Agent Teams</label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma equipe de agentes" />
                </SelectTrigger>
                <SelectContent>
                  {agentTeams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Digite o número de WhatsApp que deseja testar:</label>
              <Input
                type="text"
                placeholder="(XX) XXXXX-XXXX"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="w-full"
              />
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Clock className="mr-2 h-4 w-4" />
                    Programar Teste
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Programar Teste</DialogTitle>
                    <DialogDescription>
                      Selecione a data e hora para iniciar o teste
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            {date ? (
                              format(date, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Horário</label>
                      <div className="flex gap-2">
                        <Select value={timeHour} onValueChange={setTimeHour}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Hora" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                                {i.toString().padStart(2, '0')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="flex items-center">:</span>
                        <Select value={timeMinute} onValueChange={setTimeMinute}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Min" />
                          </SelectTrigger>
                          <SelectContent>
                            {["00", "15", "30", "45"].map((min) => (
                              <SelectItem key={min} value={min}>
                                {min}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      disabled={!selectedTeam || !phoneNumber || !date || !timeHour || !timeMinute}
                    >
                      Confirmar agendamento
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button 
                onClick={startTest}
                disabled={!selectedTeam || !phoneNumber}
                className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600"
              >
                Iniciar Teste Agora
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-10">
          <Card>
            <CardHeader>
              <CardTitle>Teste em Andamento</CardTitle>
              <CardDescription>
                Testando equipe <strong>{selectedTeam}</strong> no WhatsApp <strong>{phoneNumber}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Exibição do progresso */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progresso do teste</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Animação de linha do tempo */}
              {renderTestNodes()}
            </CardContent>
          </Card>

          {testComplete && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Resultados do Teste</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total de Interações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <MessageSquare className="w-5 h-5 text-sky-500 mr-2" />
                      <span className="text-2xl font-bold">12</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Tempo Médio de Resposta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-orange-500 mr-2" />
                      <span className="text-2xl font-bold">1.8s</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Qualidade das Respostas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="w-12 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full mr-2">
                        <div className="w-2 h-2 bg-white rounded-full border-2 border-sky-500 relative" style={{ marginLeft: '80%', marginTop: '-2px' }}></div>
                      </div>
                      <span className="text-lg font-bold text-green-500">Bom</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Tempo Total do Teste</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-purple-500 mr-2" />
                      <span className="text-2xl font-bold">2:45</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pontos Críticos Identificados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Tempo de resposta acima do ideal na primeira interação (2.3s)</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Falha na identificação do contexto em 1 mensagem</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Resposta incompleta em relação ao produto questionado</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sugestões de Melhorias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <TrendingUp className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Otimizar tempo de resposta inicial reduzindo em 0.5s</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Melhorar modelo de reconhecimento de contexto do produto</span>
                      </li>
                      <li className="flex items-start">
                        <Smartphone className="w-5 h-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Implementar resposta com envio de links complementares</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => {
                    setTestStarted(false);
                    setProgress(0);
                    setCurrentStep(0);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600"
                >
                  Iniciar Novo Teste
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 