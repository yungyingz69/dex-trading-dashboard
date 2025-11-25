'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api/client'

interface Bot {
  id: string
  name: string
  type: string
  status: string
  pair: string
  exchange: string
  profit: number
  profitPercent: number
  tradesCount: number
  uptime: number
  createdAt: string
  updatedAt: string
}

export function useBots() {
  const [bots, setBots] = useState<Bot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBots = useCallback(async () => {
    try {
      setIsLoading(true)
      const { bots } = await api.getBots()
      setBots(bots)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch bots'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBots()
  }, [fetchBots])

  const createBot = async (data: {
    name: string
    type: string
    pair: string
    exchange: string
    config?: any
  }) => {
    const { bot } = await api.createBot(data)
    setBots((prev) => [bot, ...prev])
    return bot
  }

  const updateBot = async (id: string, data: { name?: string; config?: any }) => {
    const { bot } = await api.updateBot(id, data)
    setBots((prev) => prev.map((b) => (b.id === id ? bot : b)))
    return bot
  }

  const deleteBot = async (id: string) => {
    await api.deleteBot(id)
    setBots((prev) => prev.filter((b) => b.id !== id))
  }

  const startBot = async (id: string) => {
    const { bot } = await api.startBot(id)
    setBots((prev) => prev.map((b) => (b.id === id ? bot : b)))
    return bot
  }

  const stopBot = async (id: string) => {
    const { bot } = await api.stopBot(id)
    setBots((prev) => prev.map((b) => (b.id === id ? bot : b)))
    return bot
  }

  return {
    bots,
    isLoading,
    error,
    refresh: fetchBots,
    createBot,
    updateBot,
    deleteBot,
    startBot,
    stopBot,
  }
}

export function useBot(id: string) {
  const [bot, setBot] = useState<Bot | null>(null)
  const [trades, setTrades] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBot = useCallback(async () => {
    try {
      setIsLoading(true)
      const { bot } = await api.getBot(id)
      setBot(bot)
      setTrades(bot.trades || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch bot'))
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchBot()
  }, [fetchBot])

  return {
    bot,
    trades,
    isLoading,
    error,
    refresh: fetchBot,
  }
}
