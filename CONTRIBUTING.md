# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o **Sonnar Agent Insights**! Este documento fornece diretrizes para contribuições.

## 📋 Código de Conduta

Este projeto adere ao Código de Conduta do Contributor Covenant. Ao participar, você deve seguir este código.

## 🚀 Como Contribuir

### 🐛 Reportando Bugs

1. **Verifique se o bug já foi reportado** nos [Issues](https://github.com/diego-rangel-johnson/sonnar-agent-insights/issues)
2. **Use o template de bug report** ao criar uma nova issue
3. **Forneça informações detalhadas**:
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots/GIFs se aplicável
   - Informações do ambiente

### ✨ Sugerindo Funcionalidades

1. **Verifique se a funcionalidade já foi sugerida**
2. **Use o template de feature request**
3. **Descreva claramente**:
   - O problema que resolve
   - A solução proposta
   - Alternativas consideradas

### 🛠️ Contribuindo com Código

#### Preparação do Ambiente

1. **Fork o repositório**
```bash
git clone https://github.com/seu-usuario/sonnar-agent-insights.git
cd sonnar-agent-insights
```

2. **Instale dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente**
```bash
cp .env.example .env.local
# Configure suas variáveis
```

4. **Execute os testes**
```bash
npm test
```

#### Fluxo de Desenvolvimento

1. **Crie uma branch**
```bash
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

2. **Implemente suas mudanças**
   - Siga os padrões de código estabelecidos
   - Escreva testes para novas funcionalidades
   - Mantenha commits pequenos e focados

3. **Execute os testes**
```bash
npm run test
npm run lint
npm run build
```

4. **Commit suas mudanças**
```bash
git commit -m "feat: adiciona nova funcionalidade X"
```

5. **Push para sua branch**
```bash
git push origin feature/nome-da-feature
```

6. **Abra um Pull Request**

## 📝 Padrões de Código

### Commits Semânticos

Use o formato de [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Apenas documentação
- `style`: Mudanças que não afetam lógica (espaços, formatação)
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção

**Exemplos:**
```
feat(auth): adiciona autenticação com Google
fix(dashboard): corrige carregamento de métricas
docs(readme): atualiza instruções de instalação
```

### Estilo de Código

- **ESLint**: Use `npm run lint` para verificar
- **Prettier**: Formatação automática
- **Convenções**:
  - Use nomes descritivos para variáveis e funções
  - Prefira `const` sobre `let` e `var`
  - Use arrow functions quando apropriado
  - Componentes React em PascalCase
  - Arquivos em kebab-case

### Estrutura de Arquivos

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de UI base
│   └── feature/        # Componentes específicos
├── pages/              # Páginas da aplicação
├── lib/                # Configurações e utilitários
├── hooks/              # Custom hooks
├── utils/              # Funções utilitárias
└── styles/             # Estilos globais
```

## 🧪 Testes

### Executando Testes

```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

### Escrevendo Testes

- **Unitários**: Para funções e componentes isolados
- **Integração**: Para fluxos completos
- **E2E**: Para jornadas críticas do usuário

```javascript
// Exemplo de teste de componente
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

test('renderiza botão com texto', () => {
  render(<Button>Clique aqui</Button>)
  expect(screen.getByText('Clique aqui')).toBeInTheDocument()
})
```

## 📚 Documentação

### Documentando Código

- **JSDoc** para funções complexas
- **README** para módulos importantes
- **Comentários** apenas quando necessário

```javascript
/**
 * Calcula métricas de performance do agente
 * @param {Object} data - Dados do agente
 * @param {string} data.agentId - ID do agente
 * @param {Array} data.conversations - Lista de conversas
 * @returns {Object} Métricas calculadas
 */
function calculateAgentMetrics(data) {
  // implementação
}
```

### Documentação de API

Para Edge Functions, use OpenAPI/Swagger:

```javascript
/**
 * @swagger
 * /api/agents:
 *   get:
 *     summary: Lista todos os agentes
 *     responses:
 *       200:
 *         description: Lista de agentes
 */
```

## 🔍 Processo de Review

### Para Reviewers

- **Foque na lógica** não apenas no estilo
- **Teste localmente** se necessário
- **Seja construtivo** nos comentários
- **Aprove quando adequado**

### Para Contribuidores

- **Responda aos comentários** de forma construtiva
- **Faça mudanças solicitadas** ou explique por que não
- **Teste novamente** após mudanças
- **Marque reviews como resolvidos**

## 🏷️ Versionamento

- Seguimos [Semantic Versioning](https://semver.org/)
- **MAJOR**: Mudanças que quebram compatibilidade
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs

## 🎯 Roadmap

Consulte nosso [roadmap público](https://github.com/diego-rangel-johnson/sonnar-agent-insights/projects) para ver:
- Funcionalidades planejadas
- Bugs conhecidos
- Prioridades do projeto

## ❓ Dúvidas?

- 💬 [GitHub Discussions](https://github.com/diego-rangel-johnson/sonnar-agent-insights/discussions)
- 📧 Email: diego.rangel.johnson@gmail.com
- 🐛 [Issues](https://github.com/diego-rangel-johnson/sonnar-agent-insights/issues)

---

**Obrigado por contribuir! 🚀** 