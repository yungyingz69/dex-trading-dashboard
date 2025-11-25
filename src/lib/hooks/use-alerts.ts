'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api/client'

interface Alert {
  id: string
  name: string
  type: string
  condition: string
  threshold: number
  asset?: string
  botId?: string
  enabled: boolean
  channels: string[]
  triggeredAt?: string
  triggeredCount: number
  createdAt: string
  updatedAt: string
  bot?: {
    id: string
    name: string
  }
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAlerts = useCallback(async () => {
    try {
      setIsLoading(true)
      const { alerts } = await api.getAlerts()
      setAlerts(alerts)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch alerts'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const createAlert = async (data: {
    name: string
    type: string
    condition: string
    threshold: number
    asset?: string
    botId?: string
    channels?: string[]
  }) => {
    const { alert } = await api.createAlert(data)
    setAlerts((prev) => [alert, ...prev])
    return alert
  }

  const updateAlert = async (
    id: string,
    data: {
      name?: string
      condition?: string
      threshold?: number
      enabled?: boolean
      channels?: string[]
    }
  ) => {
    const { alert } = await api.updateAlert(id, data)
    setAlerts((prev) => prev.map((a) => (a.id === id ? alert : a)))
    return alert
  }

  const deleteAlert = async (id: string) => {
    await api.deleteAlert(id)
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  const toggleAlert = async (id: string) => {
    const { alert } = await api.toggleAlert(id)
    setAlerts((prev) => prev.map((a) => (a.id === id ? alert : a)))
    return alert
  }

  return {
    alerts,
    isLoading,
    error,
    refresh: fetchAlerts,
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlert,
  }
}
