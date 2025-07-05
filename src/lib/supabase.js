import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nsbjkxbfkhauitmjnkxh.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYmpreGJma2hhdWl0bWpua3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0OTIyNDEsImV4cCI6MjA2NzA2ODI0MX0.ERU7cn4E2Ll6IClG2QjznrUsDQUxndZAbq_pohSdbzk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
})

// Helper para fazer requisições autenticadas com retry e timeout
export const makeAuthenticatedRequest = async (url, options = {}, retries = 3) => {
  const timeout = import.meta.env.VITE_API_TIMEOUT || 30000
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Usuário não autenticado')
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        ...options.headers
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado, tentar refresh
          await supabase.auth.refreshSession()
          if (attempt < retries - 1) continue
        }
        
        const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      if (attempt === retries - 1) {
        console.error(`Erro após ${retries} tentativas:`, error)
        throw error
      }
      
      // Delay progressivo entre tentativas
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
}

// URLs das Edge Functions
export const EDGE_FUNCTIONS = {
  AUTH: `${supabaseUrl}/functions/v1/auth-handler`,
  DASHBOARD_API: `${supabaseUrl}/functions/v1/dashboard-api`
}

// Validação de conexão
export const validateConnection = async () => {
  try {
    const { data, error } = await supabase.from('organizations').select('count', { count: 'exact', head: true })
    if (error) throw error
    return true
  } catch (error) {
    console.error('Erro de conexão com Supabase:', error)
    return false
  }
} 