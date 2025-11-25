'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { api } from '@/lib/api/client'

interface User {
  id: string
  email: string
  name: string | null
  currency: string
  language: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.getMe()
      setUser(response.user)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshUser()
      } finally {
        setIsLoading(false)
      }
    }
    initAuth()
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password)
    setUser(response.user)
  }

  const register = async (email: string, password: string, name?: string) => {
    const response = await api.register(email, password, name)
    setUser(response.user)
  }

  const logout = async () => {
    await api.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
