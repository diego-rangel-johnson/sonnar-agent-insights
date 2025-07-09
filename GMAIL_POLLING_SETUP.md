# 🔄 Sistema de Polling Gmail - Alternativa ao Webhook

## 🎯 **Por que usar Polling?**

O **sistema de polling** é a solução para organizações com **políticas de IAM restritivas** que impedem o uso de webhooks do Gmail. 

### **Vantagens:**
- ✅ **Não precisa de permissões IAM especiais**
- ✅ **Não precisa de Pub/Sub**
- ✅ **Funciona com qualquer organização**
- ✅ **Mais simples de configurar**

### **Desvantagens:**
- ⚠️ **Não é instantâneo** (verifica a cada 1-5 minutos)
- ⚠️ **Usa mais recursos** (verificação constante)

## 🏗️ **Arquitetura do Sistema**

```mermaid
graph TD
    A[Cron Job / Timer] --> B[Edge Function email-polling]
    B --> C[Gmail API - Buscar emails]
    C --> D[Verificar se email é novo]
    D --> E[Salvar na tabela emails]
    E --> F[Disparar processamento AI]
    F --> G[10 agentes analisam]
    G --> H[Interface supervisão]
```

## 📋 **Configuração Passo a Passo**

### **1. Configurar OAuth 2.0 (Mesmo processo)**
- ✅ Já feito nas etapas anteriores
- ✅ Não precisa de webhook URLs
- ✅ Apenas precisa das credenciais básicas

### **2. Adicionar Conta de Email**
Execute esta query no **Supabase SQL Editor**:

```sql
INSERT INTO email_accounts (
  email_address,
  access_token,
  refresh_token,
  token_expiry,
  active,
  provider
) VALUES (
  'seu-email@gmail.com',
  'SEU_ACCESS_TOKEN',
  'SEU_REFRESH_TOKEN',
  '2024-12-31T23:59:59Z',
  true,
  'gmail'
);
```

### **3. Configurar Polling Manual**
Para testar, chame a Edge Function:

```bash
curl -X POST https://nsbjkxbfkhauitmjnkxh.supabase.co/functions/v1/email-polling \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_SERVICE_ROLE_KEY"
```

### **4. Configurar Polling Automático**

#### **Opção A: Cron Job no Servidor**
```bash
# Adicionar ao crontab para rodar a cada 2 minutos
*/2 * * * * curl -X POST https://nsbjkxbfkhauitmjnkxh.supabase.co/functions/v1/email-polling
```

#### **Opção B: GitHub Actions (Recomendado)**
Crie `.github/workflows/email-polling.yml`:

```yaml
name: Email Polling
on:
  schedule:
    - cron: '*/2 * * * *'  # A cada 2 minutos
  workflow_dispatch:

jobs:
  polling:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Email Polling
        run: |
          curl -X POST https://nsbjkxbfkhauitmjnkxh.supabase.co/functions/v1/email-polling \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}"
```

#### **Opção C: Vercel Cron (Após deploy)**
Em `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/email-polling",
    "schedule": "*/2 * * * *"
  }]
}
```

### **5. Criar API Route no Vercel**
`pages/api/email-polling.js`:

```javascript
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const response = await fetch('https://nsbjkxbfkhauitmjnkxh.supabase.co/functions/v1/email-polling', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    });
    
    const data = await response.json();
    res.status(200).json(data);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
```

## 🔧 **Configurações Avançadas**

### **Frequência de Polling**
- **Desenvolvimento:** 5 minutos
- **Produção:** 1-2 minutos
- **Alta demanda:** 30 segundos

### **Filtros de Email**
Modifique a query na Edge Function:

```javascript
// Só emails não lidos
const query = 'in:inbox is:unread'

// Emails de domínios específicos
const query = 'in:inbox from:@empresa.com'

// Emails com palavras-chave
const query = 'in:inbox (suporte OR vendas OR orçamento)'
```

### **Limite de Processamento**
```javascript
const maxResults = 50 // Processar até 50 emails por vez
```

## 📊 **Monitoramento**

### **Verificar Logs**
```bash
# Logs da Edge Function
Dashboard → Functions → email-polling → Logs
```

### **Verificar Emails Processados**
```sql
SELECT 
  email_address,
  COUNT(*) as emails_processados,
  MAX(received_at) as ultimo_email
FROM emails e
JOIN email_accounts ea ON e.account_id = ea.id
WHERE e.created_at >= NOW() - INTERVAL '1 hour'
GROUP BY email_address;
```

### **Verificar Última Sincronização**
```sql
SELECT 
  email_address,
  last_sync,
  EXTRACT(EPOCH FROM (NOW() - last_sync)) / 60 as minutos_desde_sync
FROM email_accounts
WHERE active = true;
```

## 🚨 **Troubleshooting**

### **Emails não aparecem**
- Verifique se o access_token está válido
- Confirme se a conta está ativa na tabela
- Teste a Gmail API manualmente

### **Polling não roda**
- Verifique se o cron job está configurado
- Teste chamando a Edge Function manualmente
- Verifique os logs no Supabase

### **Muitos emails duplicados**
- Verifique se há múltiplos cron jobs rodando
- Confirme se a verificação de duplicatas está funcionando

## ✅ **Teste Completo**

### **1. Testar Polling Manual:**
```bash
curl -X POST https://nsbjkxbfkhauitmjnkxh.supabase.co/functions/v1/email-polling
```

### **2. Enviar Email de Teste:**
- Envie um email para a conta configurada
- Aguarde 2 minutos
- Verifique se aparece na tabela `emails`

### **3. Verificar Processamento:**
```sql
SELECT * FROM emails ORDER BY created_at DESC LIMIT 5;
SELECT * FROM agent_analyses ORDER BY created_at DESC LIMIT 5;
```

## 🎯 **Próximos Passos**

1. **Configure o OAuth 2.0** (sem webhook)
2. **Adicione sua conta** na tabela email_accounts
3. **Teste o polling manual**
4. **Configure o cron automático**
5. **Monitore e ajuste a frequência**

## 🔄 **Comparação: Webhook vs Polling**

| Recurso | Webhook | Polling |
|---------|---------|---------|
| Latência | ~1 segundo | 1-5 minutos |
| Permissões IAM | Requer especiais | Não requer |
| Recursos | Baixo | Médio |
| Configuração | Complexa | Simples |
| Organizações | Problemático | Funciona sempre |

**Para sua situação:** Polling é a melhor opção! 🚀 