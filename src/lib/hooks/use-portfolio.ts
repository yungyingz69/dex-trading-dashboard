'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api/client'

interface Asset {
  symbol: string
  name: string
  balance: number
  price: number
  value: number
  change24h: number
  logo?: string
}

interface Wallet {
  id: string
  name: string
  address: string
  chain: string
  totalValue: number
  isActive: boolean
  createdAt: string
}

interface PortfolioOverview {
  totalValue: number
  change24h: number
  change24hPercent: number
  walletsCount: number
  assetsCount: number
}

interface HistoryPoint {
  timestamp: string
  value: number
}

export function usePortfolio() {
  const [overview, setOverview] = useState<PortfolioOverview | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [history, setHistory] = useState<HistoryPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPortfolio = useCallback(async () => {
    try {
      setIsLoading(true)
      const [overviewData, walletsData, historyData] = await Promise.all([
        api.getPortfolioOverview(),
        api.getWallets(),
        api.getPortfolioHistory('30d'),
      ])

      setOverview(overviewData.overview)
      setAssets(overviewData.assets)
      setWallets(walletsData.wallets)
      setHistory(historyData.history)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch portfolio'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPortfolio()
  }, [fetchPortfolio])

  const addWallet = async (data: { name: string; address: string; chain: string }) => {
    const { wallet } = await api.addWallet(data)
    setWallets((prev) => [wallet, ...prev])
    return wallet
  }

  const removeWallet = async (id: string) => {
    await api.deleteWallet(id)
    setWallets((prev) => prev.filter((w) => w.id !== id))
  }

  return {
    overview,
    assets,
    wallets,
    history,
    isLoading,
    error,
    refresh: fetchPortfolio,
    addWallet,
    removeWallet,
  }
}
