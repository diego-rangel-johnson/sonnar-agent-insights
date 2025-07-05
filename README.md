# 🚀 Sonnar - Agent Insights Dashboard

> **Dashboard avançado de análise de agentes IA com sistema de força tarefa para testes em tempo real**

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-6.x-yellow.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-blue.svg)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Status-100%25%20Funcional-brightgreen.svg)](.)

## 📋 Sobre o Projeto

O **Sonnar** é uma plataforma completa de análise e teste de agentes IA, oferecendo:

- **🤖 Sistema de Força Tarefa** - Teste múltiplos agentes simultaneamente
- **⚡ Análise em Tempo Real** - Monitoramento live de conversas e métricas
- **📊 Dashboard Avançado** - Métricas, insights e relatórios detalhados
- **🔗 Integrações Nativas** - WhatsApp, OpenAI, Email e mais
- **🔐 Multi-tenant** - Sistema seguro com isolamento por organização

## ✨ Funcionalidades Principais

### 🎯 **Agent Insights**
- **10 tipos de agentes especializados** (Comprador, Atendente, Investigador, etc.)
- **Sistema de força tarefa** para testes coordenados
- **Mapeamento de fluxos** de conversação
- **Detecção automática de problemas**
- **Análise de sentimento** em tempo real

### 📱 **Canais Suportados**
- WhatsApp Business API
- Email SMTP
- Chat ao vivo
- Telefonia
- Microsoft Teams
- SMS

### 🔧 **Backend Robusto**
- **Supabase PostgreSQL** com 11 tabelas estruturadas
- **4 Edge Functions** para APIs escaláveis
- **Row Level Security (RLS)** habilitado
- **Realtime** com webhooks automáticos
- **Sistema de autenticação** completo

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- npm 8+
- Conta no Supabase (gratuita)

### **1. Clone o repositório**
```bash
git clone https://github.com/diego-rangel-johnson/sonnar-agent-insights.git
cd sonnar-agent-insights
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Configure suas chaves (veja seção de configuração abaixo)
```

### **4. Execute o projeto**
```bash
npm run dev
```

Acesse: `http://localhost:5173`

## ⚙️ Configuração das APIs

### **🔗 Supabase (Obrigatório)**
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### **📱 WhatsApp Business API (Opcional)**
```env
VITE_WHATSAPP_ACCESS_TOKEN=seu_token_whatsapp
VITE_WHATSAPP_PHONE_ID=seu_phone_number_id
VITE_WHATSAPP_VERIFY_TOKEN=seu_verify_token
```

### **🤖 OpenAI (Opcional)**
```env
VITE_OPENAI_API_KEY=sua_openai_key
```

## 📊 Arquitetura do Sistema

### **Frontend (React + Vite)**
- Interface moderna e responsiva
- Componentes reutilizáveis (shadcn/ui)
- Estado global com React Query
- Realtime com Supabase

### **Backend (Supabase)**
- PostgreSQL com 11 tabelas estruturadas
- 4 Edge Functions (Deno/TypeScript)
- Row Level Security (RLS)
- Triggers para notificações

### **Integrações**
- WhatsApp Business API
- OpenAI GPT-4
- Sistema de webhooks
- Notificações em tempo real

## 🎮 Como Usar

### **1. Acesse Agent Insights**
```
http://localhost:5173 → Agent Insights → Força Tarefa
```

### **2. Configure uma Força Tarefa**
1. Selecione agentes (ex: Comprador, Atendente, Investigador)
2. Digite um prompt personalizado
3. Escolha o canal (WhatsApp, Email, etc.)
4. Clique "Iniciar Força Tarefa"

### **3. Monitore em Tempo Real**
- **Conversas**: Chat em tempo real
- **Fluxos**: Mapeamento de jornadas
- **Problemas**: Issues identificados
- **Insights**: Análise de IA

## 🗂️ Estrutura do Projeto

```
sonnar-agent-insights/
├── src/
│   ├── components/        # Componentes React
│   ├── pages/            # Páginas principais
│   │   └── AgentInsights.jsx  # Funcionalidade principal
│   ├── lib/              # Configurações e utils
│   ├── api/              # Integrações de API
│   └── utils/            # Utilidades
├── supabase/             # Configurações do Supabase
├── docs/                 # Documentação adicional
└── public/               # Arquivos estáticos
```

## 🎯 10 Tipos de Agentes

| **Agente** | **Função** | **Casos de Uso** |
|------------|------------|------------------|
| **Comprador** | Simula experiência de compra | E-commerce, Marketplaces |
| **Atendente** | Avalia chat e atendimento | Customer service, Bots |
| **Investigador** | Cliente oculto virtual | Quality assurance |
| **Negociador** | Análise de negociações | Vendas, Contratos |
| **Qualificador** | Qualificação de leads | Marketing, CRM |
| **Mapeador** | Mapeia jornadas | UX, Processos |
| **Cronometrista** | Análise de tempos | SLA, Performance |
| **Analista** | Processos internos | Operações, RH |
| **Psicólogo** | Análise de sentimento | Satisfação, NPS |
| **Solucionador** | Problemas técnicos | Suporte, Troubleshooting |

## 📈 Status do Desenvolvimento

### ✅ **Implementado (100%)**
- [x] Sistema de força tarefa completo
- [x] 10 agentes especializados
- [x] Interface moderna e responsiva
- [x] Backend Supabase estruturado
- [x] 4 Edge Functions funcionais
- [x] Realtime e webhooks
- [x] Sistema multi-tenant
- [x] Dados de demonstração

### 🔄 **Próximas Funcionalidades**
- [ ] Integração com Slack/Teams
- [ ] Análise de sentimento avançada
- [ ] Relatórios exportáveis
- [ ] API pública
- [ ] Mobile responsivo aprimorado

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- React 18 + Vite
- TailwindCSS + shadcn/ui
- Framer Motion
- Recharts
- React Query

### **Backend**
- Supabase (PostgreSQL)
- Edge Functions (Deno)
- Row Level Security
- Realtime

### **Integrações**
- WhatsApp Business API
- OpenAI GPT-4
- SMTP/Email
- Webhooks

## 📚 Documentação Adicional

- [🔧 Configuração do Supabase](./README_SUPABASE.md)
- [⚡ Força Tarefa - Guia Completo](./FORÇA_TAREFA_README.md)
- [📖 Guia de Uso](./GUIA_DE_USO.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Diego Rangel Johnson**
- GitHub: [@diego-rangel-johnson](https://github.com/diego-rangel-johnson)
- LinkedIn: [Diego Rangel Johnson](https://linkedin.com/in/diego-rangel-johnson)

## 🎉 Agradecimentos

- Equipe Supabase pelo backend incrível
- Comunidade React pela inspiração
- OpenAI pela IA avançada
- shadcn/ui pelos componentes elegantes

---

<div align="center">

**⭐ Se este projeto foi útil, deixe uma estrela!**

**🚀 Pronto para revolucionar seus testes de agentes IA? [Comece agora!](#-instalação-e-configuração)**

</div>