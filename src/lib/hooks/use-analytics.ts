'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api/client'

interface TradingStats {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalProfit: number
  totalLoss: number
  netProfit: number
  avgWin: number
  avgLoss: number
  largestWin: number
  largestLoss: number
  profitFactor: number
}

interface DailyPerformance {
  date: string
  profit: number
  trades: number
  volume: number
}

interface BotPerformance {
  botId: string
  botName: string
  profit: number
  profitPercent: number
  trades: number
  winRate: number
}

interface PairPerformance {
  pair: string
  profit: number
  trades: number
  volume: number
  winRate: number
}

export function useAnalytics(period: '7d' | '30d' | '90d' | 'all' = '30d') {
  const [stats, setStats] = useState<TradingStats | null>(null)
  const [dailyPerformance, setDailyPerformance] = useState<DailyPerformance[]>([])
  const [botPerformance, setBotPerformance] = useState<BotPerformance[]>([])
  const [pairPerformance, setPairPerformance] = useState<PairPerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true)

      // Try to fetch from API
      const response = await api.getAnalytics(period)

      if (response.stats) setStats(response.stats)
      if (response.dailyPerformance) setDailyPerformance(response.dailyPerformance)
      if (response.botPerformance) setBotPerformance(response.botPerformance)
      if (response.pairPerformance) setPairPerformance(response.pairPerformance)

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics'))
    } finally {
      setIsLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    stats,
    dailyPerformance,
    botPerformance,
    pairPerformance,
    isLoading,
    error,
    refresh: fetchAnalytics,
  }
}
