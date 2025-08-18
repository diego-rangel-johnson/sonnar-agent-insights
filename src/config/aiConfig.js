// Configuração das chaves da IA
export const AI_CONFIG = {
  // OpenAI Configuration
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-key-here',
  
  // Claude Configuration
  CLAUDE_API_KEY: import.meta.env.VITE_CLAUDE_API_KEY || 'your-claude-key-here',
  
  // Configurações padrão
  DEFAULT_MODEL: {
    openai: 'gpt-4o-mini',
    claude: 'claude-3-haiku-20240307'
  },
  
  MAX_TOKENS: 500,
  TEMPERATURE: 0.3,
  
  // Sistema de prompts
  SYSTEM_PROMPT: `Você é um assistente especializado em análise de emails. Analise o email fornecido e retorne um JSON com os seguintes campos:
  - "resumo": Um resumo claro e conciso do que é o email em português
  - "categoria": A categoria do email (comercial, profissional, pessoal, notificação, spam, etc.)
  - "prioridade": A prioridade (baixa, média, alta)
  - "acao_necessaria": Se alguma ação é necessária (true/false)
  - "sentimento": O sentimento do email (positivo, neutro, negativo)
  - "palavras_chave": Array com as principais palavras-chave (máximo 5)
  - "tipo_resposta": Se precisa resposta (urgente, normal, opcional, nenhuma)
  - "confidencialidade": Nível de confidencialidade (publica, interna, confidencial, restrita)`
};

// Função para verificar se as chaves estão configuradas
export const checkAIKeys = () => {
  const openaiConfigured = AI_CONFIG.OPENAI_API_KEY && !AI_CONFIG.OPENAI_API_KEY.includes('your-openai-key-here');
  const claudeConfigured = AI_CONFIG.CLAUDE_API_KEY && !AI_CONFIG.CLAUDE_API_KEY.includes('your-claude-key-here');
  
  return {
    openai: openaiConfigured,
    claude: claudeConfigured,
    hasAnyKey: openaiConfigured || claudeConfigured
  };
};

// Função para obter a chave da API baseada no provider
export const getApiKey = (provider) => {
  if (provider === 'openai') {
    return AI_CONFIG.OPENAI_API_KEY;
  } else if (provider === 'claude') {
    return AI_CONFIG.CLAUDE_API_KEY;
  }
  return null;
}; 