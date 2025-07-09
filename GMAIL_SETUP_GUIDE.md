# 📧 **GUIA DE CONFIGURAÇÃO: GMAIL API + FORÇAS TAREFA**

## 🎯 **VISÃO GERAL**

Sistema completo de processamento automático de emails empresariais usando Gmail API integrado com as 10 forças tarefa de IA especializadas.

**Funcionalidades implementadas:**
- ✅ Recebimento automático de emails via webhook
- ✅ Análise de conteúdo com IA (intenção, sentimento, urgência)
- ✅ Processamento por agentes especializados
- ✅ Sugestões de resposta inteligentes
- ✅ Sistema de supervisão humana
- ✅ Envio automático ou aprovado
- ✅ Interface web completa

---

## 🚀 **CONFIGURAÇÃO GOOGLE CLOUD PLATFORM**

### **1. Criar Projeto no Google Cloud Console**

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Clique em "Novo Projeto"
3. Nome: `Sonnar Email Integration`
4. Selecione sua organização
5. Clique "Criar"

### **2. Ativar APIs Necessárias**

```bash
# No Cloud Shell ou localmente com gcloud CLI
gcloud services enable gmail.googleapis.com
gcloud services enable pubsub.googleapis.com
```

Ou via Console:
- APIs & Services > Library
- Busque e ative:
  - **Gmail API**
  - **Cloud Pub/Sub API**

### **3. Configurar OAuth 2.0**

1. **Tela de Consentimento OAuth:**
   - APIs & Services > OAuth consent screen
   - Tipo: Interno (para G Workspace) ou Externo
   - Nome da aplicação: `Sonnar Agent System`
   - Email de suporte: seu email
   - Domínios autorizados: `seu-dominio.com`

2. **Criar Credenciais OAuth:**
   - APIs & Services > Credentials
   - "+ Criar Credenciais" > ID do cliente OAuth 2.0
   - Tipo: Aplicação Web
   - Nome: `Sonnar Gmail Integration`
   - URIs de redirecionamento autorizados:
     ```
     https://nsbjkxbfkhauitmjnkxh.supabase.co/functions/v1/gmail-webhook
     http://localhost:3000/auth/callback (para testes)
     ```

3. **Baixar Credenciais:**
   - Clique no ícone de download
   - Salve como `client_credentials.json`

### **4. Configurar Pub/Sub para Webhooks**

```bash
# Criar tópico
gcloud pubsub topics create gmail-webhooks

# Criar subscription
gcloud pubsub subscriptions create gmail-webhook-subscription \
  --topic=gmail-webhooks \
  --push-endpoint=https://nsbjkxbfkhauitmjnkxh.supabase.co/functions/v1/gmail-webhook
```

---

## 🔧 **CONFIGURAÇÃO NO SUPABASE**

### **1. Adicionar Variáveis de Ambiente**

```bash
# No terminal do projeto
npx supabase secrets set GMAIL_CLIENT_ID="seu-client-id.googleusercontent.com"
npx supabase secrets set GMAIL_CLIENT_SECRET="seu-client-secret"
npx supabase secrets set GMAIL_PROJECT_ID="seu-project-id"
```

### **2. Configurar Conta de Email**

Execute este SQL no Supabase SQL Editor:

```sql
-- Inserir conta de email empresarial
INSERT INTO email_accounts (
  email_address,
  display_name,
  gmail_user_id,
  access_token,
  refresh_token,
  active
) VALUES (
  'seu-email@empresa.com',
  'Atendimento Empresa',
  'me', -- Gmail user ID
  'seu-access-token', -- Obtido via OAuth
  'seu-refresh-token', -- Obtido via OAuth
  true
);
```

### **3. Configurar Regras de Automação**

```sql
-- Regras para resposta automática
INSERT INTO automation_rules (name, conditions, action, active) VALUES 
('Auto-reply Consultas Simples', 
 '{"intent": ["inquiry"], "confidence_min": 0.8, "sentiment": {"emotion": "neutral"}}',
 'auto_reply', true),

('Escalate Complaints', 
 '{"intent": ["complaint"], "sentiment": {"urgency": "high"}}',
 'escalate', true),

('Suggest Sales Responses', 
 '{"intent": ["sales"], "confidence_min": 0.7}',
 'suggest_reply', true);
```

---

## 🎨 **CONFIGURAÇÃO DO GMAIL (Administrador)**

### **1. Habilitar API para Domínio**

No Google Admin Console:
1. Segurança > Controles de API
2. Gerenciar acesso de cliente OAuth para toda a organização
3. Adicionar novo:
   - **ID do Cliente**: `seu-client-id`
   - **Escopos OAuth**:
     ```
     https://www.googleapis.com/auth/gmail.readonly
     https://www.googleapis.com/auth/gmail.send
     https://www.googleapis.com/auth/gmail.modify
     ```

### **2. Configurar Webhook Watch**

Execute via API REST ou script:

```javascript
// Configurar watch no Gmail para receber notificações
const response = await fetch(
  'https://gmail.googleapis.com/gmail/v1/users/me/watch',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      topicName: 'projects/seu-project-id/topics/gmail-webhooks',
      labelIds: ['INBOX'],
      labelFilterAction: 'include'
    })
  }
);
```

---

## 🧪 **TESTANDO A INTEGRAÇÃO**

### **1. Teste Básico de Recebimento**

1. Envie um email para `seu-email@empresa.com`
2. Verifique logs no Supabase Functions
3. Confirme se aparece na tabela `emails`

### **2. Teste de Processamento**

```sql
-- Verificar emails processados
SELECT 
  e.subject,
  e.from_email,
  e.status,
  ea.intent,
  ea.sentiment,
  ea.priority
FROM emails e
LEFT JOIN email_analysis ea ON e.id = ea.email_id
ORDER BY e.received_at DESC
LIMIT 10;
```

### **3. Teste de Supervisão**

1. Acesse http://localhost:5173/emailsupervision
2. Verifique se aparecem sugestões pendentes
3. Teste aprovação/rejeição/modificação

---

## 🎯 **FLUXO OPERACIONAL**

### **Recebimento de Email:**
```
Email → Gmail API → Webhook → Supabase Function
↓
Armazenamento → Análise de Conteúdo → Seleção de Agentes
↓
Processamento IA → Geração de Sugestão → Supervisão Humana
↓
Aprovação → Envio → Log de Atividade
```

### **Critérios de Automação:**
- **Auto-resposta**: Consultas simples + confiança > 80%
- **Supervisão**: Casos complexos, reclamações, alta urgência
- **Escalação**: Emergências, falhas críticas

---

## 📊 **MONITORAMENTO E MÉTRICAS**

### **Dashboards Disponíveis:**
- Emails processados por dia
- Taxa de resposta automática vs supervisionada
- Tempo médio de processamento
- Análise de sentimento dos clientes
- Performance por agente especializado

### **Alertas Configurados:**
- Emails de alta prioridade não processados
- Falhas na integração Gmail
- Respostas pendentes > 2 horas
- Volume anormal de reclamações

---

## 🚨 **TROUBLESHOOTING**

### **Problemas Comuns:**

**1. Webhook não recebe emails:**
- Verificar se o tópico Pub/Sub está ativo
- Confirmar URL do endpoint
- Validar permissões do service account

**2. Falha na análise de IA:**
- Verificar créditos OpenAI/Claude
- Confirmar variáveis de ambiente
- Checar logs das Edge Functions

**3. Erro ao enviar respostas:**
- Validar tokens OAuth
- Confirmar permissões Gmail API
- Verificar formato MIME da mensagem

### **Logs Importantes:**

```bash
# Ver logs das funções
npx supabase functions logs gmail-webhook
npx supabase functions logs email-processor
npx supabase functions logs email-responder
```

---

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

### **Pré-requisitos:**
- [ ] Google Cloud Project criado
- [ ] Gmail API habilitada
- [ ] OAuth 2.0 configurado
- [ ] Pub/Sub configurado
- [ ] Supabase secrets definidos

### **Configuração:**
- [ ] Conta de email inserida no banco
- [ ] Webhook watch configurado
- [ ] Regras de automação criadas
- [ ] Interface de supervisão testada

### **Testes:**
- [ ] Recebimento de emails funcionando
- [ ] Análise de IA processando
- [ ] Sugestões sendo geradas
- [ ] Sistema de aprovação operando
- [ ] Envio de respostas funcionando

### **Go Live:**
- [ ] Monitoramento ativo
- [ ] Equipe treinada na supervisão
- [ ] Alertas configurados
- [ ] Backup/recovery testado

---

## 🎉 **SISTEMA PRONTO!**

Com essa configuração, você terá um sistema completo de atendimento por email com IA, que:

✅ **Recebe emails automaticamente**  
✅ **Analisa conteúdo com 10 agentes especializados**  
✅ **Gera respostas inteligentes**  
✅ **Permite supervisão humana**  
✅ **Envia respostas aprovadas**  
✅ **Monitora toda a operação**

**URLs importantes:**
- Interface principal: http://localhost:5173
- Supervisão de emails: http://localhost:5173/emailsupervision
- Webhook endpoint: https://nsbjkxbfkhauitmjnkxh.supabase.co/functions/v1/gmail-webhook

Para suporte: consulte os logs das Edge Functions e a documentação da Gmail API. 