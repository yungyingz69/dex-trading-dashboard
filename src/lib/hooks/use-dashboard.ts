'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api/client'

interface DashboardStats {
  portfolio: {
    totalValue: number
    change24h: number
    change24hPercent: number
  }
  bots: {
    total: number
    active: number
    totalProfit: number
    totalTrades: number
  }
  alerts: {
    active: number
    triggered: number
  }
}

interface Trade {
  id: string
  botName: string
  type: string
  pair: string
  price: number
  amount: number
  total: number
  profit: number | null
  timestamp: string
}

interface BotOverview {
  id: string
  name: string
  type: string
  status: string
  pair: string
  profit: number
  profitPercent: number
  trades: number
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentTrades, setRecentTrades] = useState<Trade[]>([])
  const [botsOverview, setBotsOverview] = useState<BotOverview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await api.getDashboardStats()
      setStats(data.stats)
      setRecentTrades(data.recentTrades)
      setBotsOverview(data.botsOverview)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return {
    stats,
    recentTrades,
    botsOverview,
    isLoading,
    error,
    refresh: fetchDashboard,
  }
}

export function useDashboardPerformance(period = '30d') {
  const [portfolioHistory, setPortfolioHistory] = useState<any[]>([])
  const [tradingActivity, setTradingActivity] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPerformance = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await api.getDashboardPerformance(period)
      setPortfolioHistory(data.portfolioHistory)
      setTradingActivity(data.tradingActivity)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch performance'))
    } finally {
      setIsLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchPerformance()
  }, [fetchPerformance])

  return {
    portfolioHistory,
    tradingActivity,
    isLoading,
    error,
    refresh: fetchPerformance,
  }
}
