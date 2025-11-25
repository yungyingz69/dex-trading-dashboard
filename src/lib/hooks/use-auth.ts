'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api/client'

interface User {
  id: string
  email: string
  name: string | null
  currency: string
  language: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const fetchUser = useCallback(async () => {
    try {
      const { user } = await api.getMe()
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (email: string, password: string) => {
    const { user } = await api.login(email, password)
    setState({
      user,
      isLoading: false,
      isAuthenticated: true,
    })
    return user
  }

  const register = async (email: string, password: string, name?: string) => {
    const { user } = await api.register(email, password, name)
    setState({
      user,
      isLoading: false,
      isAuthenticated: true,
    })
    return user
  }

  const logout = async () => {
    await api.logout()
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  return {
    ...state,
    login,
    register,
    logout,
    refresh: fetchUser,
  }
}
