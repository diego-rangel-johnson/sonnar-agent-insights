# Configuração MCP - Sonnar Last Version

## 🎯 Configuração Específica do Projeto

Este projeto possui uma configuração MCP **local e isolada** para conectar ao Supabase correto.

### 📍 Localização
- **Arquivo**: `.cursor/mcp.json`
- **Servidor**: `sonnar-supabase-nsbjkxbfkhauitmjnkxh`

### 🔧 Configuração Ativa
```json
{
  "project-ref": "nsbjkxbfkhauitmjnkxh",
  "access-token": "sbp_3a8b4d59b4f7472a7041d87aa9f5e1babaa717e5"
}
```

### ✅ Vantagens desta Configuração

1. **Isolamento**: Não interfere com outros projetos
2. **Específica**: Conecta apenas ao projeto Sonnar correto
3. **Local**: Configuração versionada com o código
4. **Única**: Nome de servidor único evita conflitos

### 🔄 Ativação

Para ativar após mudanças:
1. Feche e reabra o Cursor
2. Ou: Cmd+Shift+P → "Developer: Reload Window"

### 🚨 Importante

- Este arquivo `.cursor/mcp.json` é **específico deste projeto**
- Não afeta configurações MCP globais do Cursor
- Cada projeto pode ter sua própria configuração MCP

### 🔍 Verificação

Para verificar se está conectado ao projeto correto:
```
Project URL: https://nsbjkxbfkhauitmjnkxh.supabase.co
Project Ref: nsbjkxbfkhauitmjnkxh
``` 