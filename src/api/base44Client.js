// Removendo dependência do @base44/sdk
// import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Dados mockados para uso local
const mockChannels = [
  { id: 1, name: 'WhatsApp', status: 'active', messagesCount: 7523 },
  { id: 2, name: 'Email', status: 'active', messagesCount: 3184 },
  { id: 3, name: 'Live Chat', status: 'active', messagesCount: 1953 },
  { id: 4, name: 'Teams', status: 'inactive', messagesCount: 1231 },
  { id: 5, name: 'SMS', status: 'active', messagesCount: 982 }
];

const mockAgents = [
  { id: 1, name: 'Assistente Financeiro', status: 'active', efficiency: 94 },
  { id: 2, name: 'Assistente Comercial', status: 'active', efficiency: 92 },
  { id: 3, name: 'Assistente de RH', status: 'active', efficiency: 87 },
  { id: 4, name: 'Assistente de Suporte', status: 'training', efficiency: 78 }
];

// Criando um cliente simulado localmente
const createMockClient = (config) => {
  console.log('Inicializando cliente local com configuração:', config);
  
  // Mock de entidades e funcionalidades
  return {
    appId: config.appId,
    entities: {
      Channel: {
        list: async () => {
          console.log('Buscando canais...');
          return mockChannels;
        },
        get: async (id) => {
          console.log(`Buscando canal com ID ${id}...`);
          return mockChannels.find(channel => channel.id === id);
        }
      },
      AIAgent: {
        list: async () => {
          console.log('Buscando agentes de IA...');
          return mockAgents;
        },
        get: async (id) => {
          console.log(`Buscando agente com ID ${id}...`);
          return mockAgents.find(agent => agent.id === id);
        }
      }
    },
    integrations: {
      Core: {
        InvokeLLM: async (params) => {
          console.log('Invocando LLM com parâmetros:', params);
          return { response: 'Resposta simulada do modelo de linguagem' };
        },
        SendEmail: async (params) => {
          console.log('Enviando email com parâmetros:', params);
          return { success: true, messageId: 'mock-email-id-' + Date.now() };
        },
        SendSMS: async (params) => {
          console.log('Enviando SMS com parâmetros:', params);
          return { success: true, messageId: 'mock-sms-id-' + Date.now() };
        },
        UploadFile: async (params) => {
          console.log('Fazendo upload de arquivo:', params);
          return { success: true, fileId: 'mock-file-id-' + Date.now() };
        },
        GenerateImage: async (params) => {
          console.log('Gerando imagem com parâmetros:', params);
          return { success: true, imageUrl: 'https://via.placeholder.com/512' };
        },
        ExtractDataFromUploadedFile: async (params) => {
          console.log('Extraindo dados de arquivo:', params);
          return { success: true, data: { text: 'Dados extraídos de exemplo' } };
        }
      }
    },
    auth: {
      login: async (credentials) => {
        console.log('Autenticando usuário:', credentials);
        return { token: 'mock-token-' + Date.now(), user: { id: 1, name: 'Usuário Teste', email: credentials.email } };
      },
      logout: async () => {
        console.log('Deslogando usuário');
        return { success: true };
      },
      getCurrentUser: async () => {
        console.log('Obtendo usuário atual');
        return { id: 1, name: 'Usuário Teste', email: 'usuario@teste.com' };
      }
    }
  };
};

// Criando cliente mock
export const base44 = createMockClient({
  appId: "local-app-id", 
  requiresAuth: false
});
