# 🎯 Sonnar Agent Insights

[![CI/CD Pipeline](https://github.com/diego-rangel-johnson/sonnar-agent-insights/actions/workflows/ci.yml/badge.svg)](https://github.com/diego-rangel-johnson/sonnar-agent-insights/actions/workflows/ci.yml)
[![CodeQL](https://github.com/diego-rangel-johnson/sonnar-agent-insights/actions/workflows/codeql.yml/badge.svg)](https://github.com/diego-rangel-johnson/sonnar-agent-insights/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

> Uma plataforma inteligente para análise e insights de agentes com integração ao Supabase e tecnologias modernas.

## 🚀 Funcionalidades

- 📊 **Dashboard Interativo** - Visualização em tempo real de métricas e insights
- 🔐 **Autenticação Segura** - Sistema de autenticação robusto com Supabase Auth
- 📱 **Design Responsivo** - Interface adaptável para desktop e mobile
- 🔄 **Real-time Updates** - Atualizações em tempo real via Supabase Realtime
- 🛡️ **Segurança Avançada** - Implementação de RLS (Row Level Security)
- 📈 **Analytics Avançado** - Análise detalhada de dados e comportamentos
- 🎨 **Interface Moderna** - UI/UX otimizada com Tailwind CSS

## 🛠️ Tecnologias

### Frontend
- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de CSS utilitário
- **Lucide React** - Biblioteca de ícones

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados principal
- **Edge Functions** - Serverless functions
- **Row Level Security** - Segurança a nível de linha

### DevOps & CI/CD
- **GitHub Actions** - Pipeline de CI/CD
- **Vercel** - Deploy e hospedagem
- **CodeQL** - Análise de segurança
- **Dependabot** - Atualizações automáticas

## 🏃‍♂️ Quick Start

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/diego-rangel-johnson/sonnar-agent-insights.git
cd sonnar-agent-insights
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Preencha as variáveis no arquivo `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_TIMEOUT=30000
```

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse a aplicação**
```
http://localhost:5173
```

## 📁 Estrutura do Projeto

```
sonnar-agent-insights/
├── .github/                 # GitHub workflows e templates
│   ├── workflows/          # GitHub Actions
│   ├── ISSUE_TEMPLATE/     # Templates de issues
│   └── PULL_REQUEST_TEMPLATE.md
├── public/                 # Arquivos estáticos
├── src/                    # Código fonte
│   ├── components/         # Componentes React
│   ├── lib/               # Configurações e utilitários
│   │   └── supabase.js    # Configuração do Supabase
│   ├── pages/             # Páginas da aplicação
│   ├── styles/            # Estilos CSS
│   └── utils/             # Funções utilitárias
├── package.json           # Dependências e scripts
├── vite.config.js         # Configuração do Vite
└── tailwind.config.js     # Configuração do Tailwind
```

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build de produção

# Qualidade de Código
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas do ESLint automaticamente
npm run test         # Executa testes
npm run test:ci      # Executa testes para CI

# Supabase
npm run supabase:start    # Inicia Supabase localmente
npm run supabase:stop     # Para Supabase local
npm run supabase:reset    # Reset do banco local
```

## 🔧 Configuração do Supabase

### 1. Criando o Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a URL e a chave anônima

### 2. Configuração de Segurança
O projeto utiliza Row Level Security (RLS) para garantir segurança dos dados:

```sql
-- Habilitar RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Política de exemplo
CREATE POLICY "Users can view own organization" ON organizations
FOR SELECT USING (auth.uid() = owner_id);
```

### 3. Edge Functions
As Edge Functions estão configuradas para:
- Autenticação avançada
- APIs do dashboard
- Processamento de dados

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Manual
```bash
npm run build
# Upload da pasta dist/ para seu servidor
```

## 🤝 Contribuindo

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Diretrizes de Contribuição
- Siga o padrão de código estabelecido
- Escreva testes para novas funcionalidades
- Mantenha a documentação atualizada
- Use commits semânticos

## 🐛 Reportando Bugs

Use os [templates de issue](https://github.com/diego-rangel-johnson/sonnar-agent-insights/issues/new/choose) para reportar bugs ou solicitar funcionalidades.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Diego Rangel Johnson** - *Desenvolvedor Principal* - [@diego-rangel-johnson](https://github.com/diego-rangel-johnson)

## 🆘 Suporte

- 📧 **Email**: diego.rangel.johnson@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/diego-rangel-johnson/sonnar-agent-insights/issues)
- 💬 **Discussões**: [GitHub Discussions](https://github.com/diego-rangel-johnson/sonnar-agent-insights/discussions)

## 🎯 Roadmap

- [ ] Dashboard avançado com mais métricas
- [ ] Integração com APIs externas
- [ ] Sistema de notificações push
- [ ] Aplicativo mobile
- [ ] Integração com IA/ML

---

<div align="center">
  <strong>Desenvolvido com ❤️ para análise inteligente de agentes</strong>
</div>