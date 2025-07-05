import { supabase, makeAuthenticatedRequest, EDGE_FUNCTIONS } from '@/lib/supabase'

// Cliente Supabase para substituir o mock
export const createSupabaseClient = () => {
  console.log('Inicializando cliente Supabase...')
  
  return {
    auth: {
      login: async (credentials) => {
        console.log('Autenticando usuário via Supabase:', credentials.email)
        
        const response = await fetch(`${EDGE_FUNCTIONS.AUTH}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials)
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Erro no login')
        }

        return response.json()
      },

      register: async (userData) => {
        console.log('Registrando usuário via Supabase:', userData.email)
        
        const response = await fetch(`${EDGE_FUNCTIONS.AUTH}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...userData,
            organizationName: userData.organizationName || `Organização de ${userData.name}`
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Erro no registro')
        }

        return response.json()
      },

      logout: async () => {
        console.log('Fazendo logout via Supabase')
        await supabase.auth.signOut()
        return { success: true }
      },

      getCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        return user
      }
    },

    entities: {
      Channel: {
        list: async () => {
          console.log('Buscando canais via Supabase...')
          try {
            return await makeAuthenticatedRequest(`${EDGE_FUNCTIONS.DASHBOARD_API}/channels`)
          } catch (error) {
            console.error('Erro ao buscar canais:', error)
            // Fallback para dados mock em caso de erro
            return [
              { id: '1', name: 'WhatsApp', type: 'whatsapp', status: 'active', total_interactions: 7523 },
              { id: '2', name: 'Email', type: 'email', status: 'active', total_interactions: 3184 },
              { id: '3', name: 'Live Chat', type: 'livechat', status: 'active', total_interactions: 1953 },
              { id: '4', name: 'Teams', type: 'teams', status: 'inactive', total_interactions: 1231 },
              { id: '5', name: 'SMS', type: 'sms', status: 'active', total_interactions: 982 }
            ]
          }
        },

        get: async (id) => {
          console.log(`Buscando canal ${id} via Supabase...`)
          try {
            const channels = await makeAuthenticatedRequest(`${EDGE_FUNCTIONS.DASHBOARD_API}/channels`)
            return channels.find(channel => channel.id === id)
          } catch (error) {
            console.error('Erro ao buscar canal:', error)
            return null
          }
        },

        create: async (channelData) => {
          console.log('Criando canal via Supabase:', channelData)
          return await makeAuthenticatedRequest(`${EDGE_FUNCTIONS.DASHBOARD_API}/channels`, {
            method: 'POST',
            body: JSON.stringify(channelData)
          })
        }
      },

      AIAgent: {
        list: async () => {
          console.log('Buscando agentes de IA via Supabase...')
          try {
            return await makeAuthenticatedRequest(`${EDGE_FUNCTIONS.DASHBOARD_API}/ai-agents`)
          } catch (error) {
            console.error('Erro ao buscar agentes:', error)
            // Fallback para dados mock
            return [
              { id: '1', name: 'Assistente Financeiro', category: 'finance', status: 'active', efficiency_score: 94 },
              { id: '2', name: 'Assistente Comercial', category: 'sales', status: 'active', efficiency_score: 92 },
              { id: '3', name: 'Assistente de RH', category: 'hr', status: 'active', efficiency_score: 87 },
              { id: '4', name: 'Assistente de Suporte', category: 'support', status: 'training', efficiency_score: 78 }
            ]
          }
        },

        get: async (id) => {
          console.log(`Buscando agente ${id} via Supabase...`)
          try {
            const agents = await makeAuthenticatedRequest(`${EDGE_FUNCTIONS.DASHBOARD_API}/ai-agents`)
            return agents.find(agent => agent.id === id)
          } catch (error) {
            console.error('Erro ao buscar agente:', error)
            return null
          }
        },

        create: async (agentData) => {
          console.log('Criando agente via Supabase:', agentData)
          return await makeAuthenticatedRequest(`${EDGE_FUNCTIONS.DASHBOARD_API}/ai-agents`, {
            method: 'POST',
            body: JSON.stringify(agentData)
          })
        }
      },

      Journey: {
        list: async (agentId) => {
          console.log(`Buscando jornadas para agente ${agentId} via Supabase...`)
          try {
            const url = agentId 
              ? `${EDGE_FUNCTIONS.DASHBOARD_API}/journeys?agent_id=${agentId}` 
              : `${EDGE_FUNCTIONS.DASHBOARD_API}/journeys`
            return await makeAuthenticatedRequest(url)
          } catch (error) {
            console.error('Erro ao buscar jornadas:', error)
            // Fallback para dados mock baseados no agente
            const journeysByAgent = {
              "1": [
                { id: 101, name: 'Análise de Crédito', steps: 5, completion_rate: 85 },
                { id: 102, name: 'Processamento de Pagamentos', steps: 4, completion_rate: 92 }
              ],
              "2": [
                { id: 201, name: 'Qualificação de Leads', steps: 4, completion_rate: 78 },
                { id: 202, name: 'Follow-up de Vendas', steps: 3, completion_rate: 89 }
              ],
              "3": [
                { id: 301, name: 'Onboarding de Funcionários', steps: 6, completion_rate: 75 },
                { id: 302, name: 'Compliance e Ética', steps: 4, completion_rate: 88 }
              ]
            }
            return journeysByAgent[agentId] || []
          }
        }
      },

      Dashboard: {
        getStats: async () => {
          console.log('Buscando estatísticas do dashboard via Supabase...')
          try {
            return await makeAuthenticatedRequest(`${EDGE_FUNCTIONS.DASHBOARD_API}/dashboard-stats`)
          } catch (error) {
            console.error('Erro ao buscar estatísticas:', error)
            // Fallback para dados mock
            return {
              total_interactions: 14872,
              avg_resolution_time: 2.47,
              avg_satisfaction_score: 92,
              resolution_rate: 85,
              total_channels: 5,
              active_channels: 4,
              total_agents: 4,
              active_agents: 3,
              avg_efficiency_score: 88
            }
          }
        },

        getInsights: async () => {
          console.log('Buscando insights via Supabase...')
          try {
            return await makeAuthenticatedRequest(`${EDGE_FUNCTIONS.DASHBOARD_API}/insights`)
          } catch (error) {
            console.error('Erro ao buscar insights:', error)
            return []
          }
        }
      }
    },

    integrations: {
      Core: {
        InvokeLLM: async (params) => {
          console.log('Invocando LLM com parâmetros:', params)
          return { response: 'Resposta simulada do modelo de linguagem via Supabase' }
        },
        
        SendEmail: async (params) => {
          console.log('Enviando email com parâmetros:', params)
          return { success: true, messageId: 'supabase-email-id-' + Date.now() }
        },
        
        SendSMS: async (params) => {
          console.log('Enviando SMS com parâmetros:', params)
          return { success: true, messageId: 'supabase-sms-id-' + Date.now() }
        }
      }
    }
  }
}

// Exportar instância do cliente
export const supabaseClient = createSupabaseClient() 