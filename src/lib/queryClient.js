import { QueryClient } from '@tanstack/react-query'

// Configuração otimizada do QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos por padrão
      staleTime: 5 * 60 * 1000,
      // Manter cache por 10 minutos
      cacheTime: 10 * 60 * 1000,
      // Retry automático em caso de erro
      retry: (failureCount, error) => {
        // Não tentar novamente em erros 401, 403, 404
        if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
          return false
        }
        // Máximo 3 tentativas
        return failureCount < 3
      },
      // Delay progressivo entre tentativas
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch apenas quando a janela ganha foco após 5 minutos
      refetchOnWindowFocus: 'always',
      // Refetch quando reconectar
      refetchOnReconnect: 'always',
      // Não refetch automaticamente quando o componente montar se os dados são fresh
      refetchOnMount: true,
    },
    mutations: {
      // Retry para mutations em casos específicos
      retry: (failureCount, error) => {
        // Não tentar novamente em erros de cliente (4xx)
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        // Máximo 2 tentativas para mutations
        return failureCount < 2
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
})

// Configurações específicas por tipo de query
export const QUERY_CONFIG = {
  // Dados que mudam frequentemente
  realtime: {
    staleTime: 30 * 1000, // 30 segundos
    cacheTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 30 * 1000, // Refetch a cada 30 segundos
  },
  
  // Dados que mudam ocasionalmente
  dynamic: {
    staleTime: 2 * 60 * 1000, // 2 minutos
    cacheTime: 5 * 60 * 1000, // 5 minutos
  },
  
  // Dados relativamente estáticos
  static: {
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
  },
  
  // Dados que raramente mudam
  persistent: {
    staleTime: 60 * 60 * 1000, // 1 hora
    cacheTime: 24 * 60 * 60 * 1000, // 24 horas
  },
}

// Keys para queries organizadas
export const QUERY_KEYS = {
  // Dashboard
  dashboard: {
    all: ['dashboard'],
    stats: () => [...QUERY_KEYS.dashboard.all, 'stats'],
    insights: () => [...QUERY_KEYS.dashboard.all, 'insights'],
  },
  
  // Channels
  channels: {
    all: ['channels'],
    list: () => [...QUERY_KEYS.channels.all, 'list'],
    detail: (id) => [...QUERY_KEYS.channels.all, 'detail', id],
    metrics: (id, timeRange) => [...QUERY_KEYS.channels.all, 'metrics', id, timeRange],
  },
  
  // AI Agents
  agents: {
    all: ['agents'],
    list: () => [...QUERY_KEYS.agents.all, 'list'],
    detail: (id) => [...QUERY_KEYS.agents.all, 'detail', id],
    performance: (id, timeRange) => [...QUERY_KEYS.agents.all, 'performance', id, timeRange],
  },
  
  // Journeys
  journeys: {
    all: ['journeys'],
    list: (agentId) => [...QUERY_KEYS.journeys.all, 'list', agentId],
    detail: (id) => [...QUERY_KEYS.journeys.all, 'detail', id],
    analytics: (id, timeRange) => [...QUERY_KEYS.journeys.all, 'analytics', id, timeRange],
  },
  
  // User
  user: {
    all: ['user'],
    profile: () => [...QUERY_KEYS.user.all, 'profile'],
    organization: () => [...QUERY_KEYS.user.all, 'organization'],
  },
}

// Utility functions para invalidação de cache
export const invalidateQueries = {
  dashboard: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all }),
  channels: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channels.all }),
  agents: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agents.all }),
  journeys: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.journeys.all }),
  all: () => queryClient.invalidateQueries(),
}

// Prefetch functions para otimização
export const prefetchQueries = {
  dashboard: async () => {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.dashboard.stats(),
      queryFn: () => import('@/api/entities').then(({ Dashboard }) => Dashboard.getStats()),
      ...QUERY_CONFIG.dynamic,
    })
  },
  
  channels: async () => {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.channels.list(),
      queryFn: () => import('@/api/entities').then(({ Channel }) => Channel.list()),
      ...QUERY_CONFIG.static,
    })
  },
} 