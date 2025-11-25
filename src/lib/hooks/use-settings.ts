'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api/client'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  email: string
  name: string | null
  currency: string
  language: string
  createdAt: string
}

export function useSettings() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await api.getMe()
      setProfile(response.user)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateProfile = async (data: { name?: string; currency?: string; language?: string }) => {
    try {
      setIsSaving(true)
      const response = await api.updateProfile(data)
      setProfile(response.user)
      setError(null)
      return { success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update profile')
      setError(error)
      return { success: false, error }
    } finally {
      setIsSaving(false)
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsSaving(true)
      await api.changePassword(currentPassword, newPassword)
      setError(null)
      return { success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to change password')
      setError(error)
      return { success: false, error }
    } finally {
      setIsSaving(false)
    }
  }

  const deleteAccount = async () => {
    try {
      setIsSaving(true)
      await api.deleteAccount()
      router.push('/login')
      return { success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete account')
      setError(error)
      return { success: false, error }
    } finally {
      setIsSaving(false)
    }
  }

  return {
    profile,
    isLoading,
    isSaving,
    error,
    updateProfile,
    changePassword,
    deleteAccount,
    refresh: fetchProfile,
  }
}
