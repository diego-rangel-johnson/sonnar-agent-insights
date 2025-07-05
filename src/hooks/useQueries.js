import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS, QUERY_CONFIG, invalidateQueries } from '@/lib/queryClient'
import { Channel, AIAgent, Journey, Dashboard, User } from '@/api/entities'

// ============ DASHBOARD HOOKS ============

export const useDashboardStats = (timeRange = '30d') => {
  return useQuery({
    queryKey: [...QUERY_KEYS.dashboard.stats(), timeRange],
    queryFn: () => Dashboard.getStats(timeRange),
    ...QUERY_CONFIG.dynamic,
    enabled: true,
  })
}

export const useDashboardInsights = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.insights(),
    queryFn: () => Dashboard.getInsights(),
    ...QUERY_CONFIG.dynamic,
  })
}

// ============ CHANNELS HOOKS ============

export const useChannels = () => {
  return useQuery({
    queryKey: QUERY_KEYS.channels.list(),
    queryFn: () => Channel.list(),
    ...QUERY_CONFIG.static,
  })
}

export const useChannel = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.channels.detail(id),
    queryFn: () => Channel.get(id),
    ...QUERY_CONFIG.static,
    enabled: !!id,
  })
}

export const useChannelMetrics = (id, timeRange = '30d') => {
  return useQuery({
    queryKey: QUERY_KEYS.channels.metrics(id, timeRange),
    queryFn: () => Channel.getMetrics?.(id, timeRange) || Promise.resolve(null),
    ...QUERY_CONFIG.dynamic,
    enabled: !!id,
  })
}

export const useCreateChannel = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (channelData) => Channel.create(channelData),
    onSuccess: () => {
      invalidateQueries.channels()
      invalidateQueries.dashboard()
    },
    onError: (error) => {
      console.error('Erro ao criar canal:', error)
    },
  })
}

export const useUpdateChannel = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...data }) => Channel.update?.(id, data) || Promise.resolve(data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(QUERY_KEYS.channels.detail(variables.id), data)
      invalidateQueries.channels()
      invalidateQueries.dashboard()
    },
  })
}

export const useDeleteChannel = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => Channel.delete?.(id) || Promise.resolve(),
    onSuccess: () => {
      invalidateQueries.channels()
      invalidateQueries.dashboard()
    },
  })
}

// ============ AI AGENTS HOOKS ============

export const useAgents = () => {
  return useQuery({
    queryKey: QUERY_KEYS.agents.list(),
    queryFn: () => AIAgent.list(),
    ...QUERY_CONFIG.static,
  })
}

export const useAgent = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.agents.detail(id),
    queryFn: () => AIAgent.get(id),
    ...QUERY_CONFIG.static,
    enabled: !!id,
  })
}

export const useAgentPerformance = (id, timeRange = '30d') => {
  return useQuery({
    queryKey: QUERY_KEYS.agents.performance(id, timeRange),
    queryFn: () => AIAgent.getPerformance?.(id, timeRange) || Promise.resolve(null),
    ...QUERY_CONFIG.dynamic,
    enabled: !!id,
  })
}

export const useCreateAgent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (agentData) => AIAgent.create(agentData),
    onSuccess: () => {
      invalidateQueries.agents()
      invalidateQueries.dashboard()
    },
  })
}

export const useUpdateAgent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...data }) => AIAgent.update?.(id, data) || Promise.resolve(data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(QUERY_KEYS.agents.detail(variables.id), data)
      invalidateQueries.agents()
      invalidateQueries.dashboard()
    },
  })
}

export const useDeleteAgent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => AIAgent.delete?.(id) || Promise.resolve(),
    onSuccess: () => {
      invalidateQueries.agents()
      invalidateQueries.dashboard()
    },
  })
}

// ============ JOURNEYS HOOKS ============

export const useJourneys = (agentId) => {
  return useQuery({
    queryKey: QUERY_KEYS.journeys.list(agentId),
    queryFn: () => Journey.list(agentId),
    ...QUERY_CONFIG.static,
    enabled: !!agentId,
  })
}

export const useJourney = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.journeys.detail(id),
    queryFn: () => Journey.get?.(id) || Promise.resolve(null),
    ...QUERY_CONFIG.static,
    enabled: !!id,
  })
}

export const useJourneyAnalytics = (id, timeRange = '30d') => {
  return useQuery({
    queryKey: QUERY_KEYS.journeys.analytics(id, timeRange),
    queryFn: () => Journey.getAnalytics?.(id, timeRange) || Promise.resolve(null),
    ...QUERY_CONFIG.dynamic,
    enabled: !!id,
  })
}

// ============ USER HOOKS ============

export const useUserProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.user.profile(),
    queryFn: () => User.getCurrentUser(),
    ...QUERY_CONFIG.persistent,
  })
}

export const useOrganization = () => {
  return useQuery({
    queryKey: QUERY_KEYS.user.organization(),
    queryFn: () => User.getOrganization?.() || Promise.resolve(null),
    ...QUERY_CONFIG.persistent,
  })
}

// ============ REAL-TIME HOOKS ============

export const useRealTimeMetrics = () => {
  return useQuery({
    queryKey: ['realtime', 'metrics'],
    queryFn: () => Dashboard.getRealTimeMetrics?.() || Dashboard.getStats(),
    ...QUERY_CONFIG.realtime,
  })
}

// ============ PREFETCH HOOKS ============

export const usePrefetchData = () => {
  const queryClient = useQueryClient()
  
  const prefetchDashboard = () => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.dashboard.stats(),
      queryFn: () => Dashboard.getStats(),
      ...QUERY_CONFIG.dynamic,
    })
  }
  
  const prefetchChannels = () => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.channels.list(),
      queryFn: () => Channel.list(),
      ...QUERY_CONFIG.static,
    })
  }
  
  const prefetchAgents = () => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.agents.list(),
      queryFn: () => AIAgent.list(),
      ...QUERY_CONFIG.static,
    })
  }
  
  return {
    prefetchDashboard,
    prefetchChannels,
    prefetchAgents,
  }
}

// ============ UTILITY HOOKS ============

export const useInvalidateQueries = () => {
  return {
    invalidateAll: invalidateQueries.all,
    invalidateDashboard: invalidateQueries.dashboard,
    invalidateChannels: invalidateQueries.channels,
    invalidateAgents: invalidateQueries.agents,
    invalidateJourneys: invalidateQueries.journeys,
  }
}

// Hook para otimização de performance
export const useOptimizedQuery = (queryKey, queryFn, options = {}) => {
  return useQuery({
    queryKey,
    queryFn,
    ...QUERY_CONFIG.static,
    ...options,
    // Otimizações adicionais
    structuralSharing: true, // Evita re-renders desnecessários
    notifyOnChangeProps: ['data', 'error'], // Só notifica mudanças relevantes
  })
}

// Hook para mutations com feedback de loading
export const useOptimizedMutation = (mutationFn, options = {}) => {
  return useMutation({
    mutationFn,
    ...options,
    onMutate: async (variables) => {
      // Pode ser usado para optimistic updates
      if (options.onMutate) {
        return await options.onMutate(variables)
      }
    },
  })
} 