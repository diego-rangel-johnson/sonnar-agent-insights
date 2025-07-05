import { supabase } from '@/lib/supabase'

// Sistema de notificações usando Supabase Realtime
export class NotificationSystem {
  constructor() {
    this.subscribers = new Map()
    this.channels = new Map()
  }

  // Inscrever-se em notificações de uma tabela específica
  subscribe(tableName, eventType, callback, filter = null) {
    const channelName = `${tableName}_${eventType}_${Date.now()}`
    
    let channelConfig = {
      event: eventType,
      schema: 'public',
      table: tableName
    }
    
    if (filter) {
      channelConfig.filter = filter
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', channelConfig, callback)
      .subscribe()

    this.channels.set(channelName, channel)
    
    return channelName // Retorna ID para poder cancelar depois
  }

  // Cancelar inscrição
  unsubscribe(channelId) {
    const channel = this.channels.get(channelId)
    if (channel) {
      supabase.removeChannel(channel)
      this.channels.delete(channelId)
    }
  }

  // Limpar todas as inscrições
  cleanup() {
    this.channels.forEach((channel, channelId) => {
      supabase.removeChannel(channel)
    })
    this.channels.clear()
  }

  // Notificar quando nova interação é criada
  onNewInteraction(callback) {
    return this.subscribe('interactions', 'INSERT', (payload) => {
      callback({
        type: 'new_interaction',
        data: payload.new,
        timestamp: new Date()
      })
    })
  }

  // Notificar quando nova mensagem é enviada
  onNewMessage(callback) {
    return this.subscribe('messages', 'INSERT', (payload) => {
      callback({
        type: 'new_message',
        data: payload.new,
        timestamp: new Date()
      })
    })
  }

  // Notificar quando insights são gerados
  onNewInsight(callback) {
    return this.subscribe('insights', 'INSERT', (payload) => {
      callback({
        type: 'new_insight',
        data: payload.new,
        timestamp: new Date()
      })
    })
  }

  // Notificar mudanças em métricas de performance
  onMetricsUpdate(callback) {
    return this.subscribe('performance_metrics', 'INSERT', (payload) => {
      callback({
        type: 'metrics_update',
        data: payload.new,
        timestamp: new Date()
      })
    })
  }
}

// Instância global
export const notifications = new NotificationSystem()

// Utilitários para notificações específicas do Agent Insights
export const AgentNotifications = {
  // Monitorar força tarefa ativa
  monitorTaskForce(taskForceAgents, onUpdate) {
    const subscriptions = []

    // Monitorar interações de cada agente
    taskForceAgents.forEach(agentId => {
      const subId = notifications.subscribe(
        'interactions',
        'INSERT',
        (payload) => {
          if (payload.new.ai_agent_id === agentId) {
            onUpdate({
              type: 'agent_interaction',
              agentId,
              interaction: payload.new
            })
          }
        }
      )
      subscriptions.push(subId)
    })

    // Retornar função para limpar todas as inscrições
    return () => {
      subscriptions.forEach(subId => notifications.unsubscribe(subId))
    }
  },

  // Monitorar problemas críticos
  monitorCriticalIssues(onIssue) {
    return notifications.subscribe(
      'insights',
      'INSERT',
      (payload) => {
        if (payload.new.priority === 'critical' || payload.new.priority === 'high') {
          onIssue({
            type: 'critical_issue',
            insight: payload.new
          })
        }
      }
    )
  },

  // Notificações push do navegador
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  },

  // Enviar notificação do navegador
  sendBrowserNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        ...options
      })
    }
  }
}

// Hook para usar notificações em componentes React
export const useNotifications = () => {
  const [notifications, setNotifications] = React.useState([])

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, {
      id: Date.now(),
      ...notification,
      timestamp: new Date()
    }])
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  }
} 