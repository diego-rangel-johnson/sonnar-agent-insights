import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { supabase } from '@/lib/supabase'

// Contexto de autenticação
const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Inicializar autenticação
  useEffect(() => {
    // Obter sessão inicial
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Erro ao obter sessão:', error)
        setError(error.message)
      }
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)

        // Limpar token antigo do localStorage se existir
        if (event === 'SIGNED_IN') {
          localStorage.removeItem('authToken')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Login com email e senha
  const signIn = useCallback(async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Erro no login:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Registro de novo usuário
  const signUp = useCallback(async (email, password, metadata = {}) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            created_at: new Date().toISOString(),
          }
        }
      })

      if (error) throw error

      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Erro no registro:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout
  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Limpar dados locais
      localStorage.removeItem('authToken')
      
    } catch (error) {
      console.error('Erro no logout:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Reset de senha
  const resetPassword = useCallback(async (email) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      return true
    } catch (error) {
      console.error('Erro no reset de senha:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Atualizar senha
  const updatePassword = useCallback(async (newPassword) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      return true
    } catch (error) {
      console.error('Erro ao atualizar senha:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Verificar se usuário está autenticado
  const isAuthenticated = Boolean(user && session)

  // Obter token de acesso
  const getAccessToken = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session?.access_token
    } catch (error) {
      console.error('Erro ao obter token:', error)
      return null
    }
  }, [])

  const value = {
    user,
    session,
    loading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    getAccessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook específico para proteção de rotas
export const useRequireAuth = () => {
  const { user, loading } = useAuth()
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      setShouldRedirect(true)
    }
  }, [user, loading])

  return { shouldRedirect, loading }
} 