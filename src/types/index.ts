// Bot Types
export type BotStatus = 'running' | 'stopped' | 'error' | 'syncing'

export interface Bot {
  id: string
  name: string
  type: 'grid' | 'dca' | 'arbitrage' | 'custom'
  status: BotStatus
  pair: string
  exchange: string
  profit: number
  profitPercent: number
  trades: number
  uptime: number
  createdAt: Date
  updatedAt: Date
}

export interface BotStats {
  totalProfit: number
  totalTrades: number
  winRate: number
  avgProfit: number
}

// Portfolio Types
export interface Asset {
  symbol: string
  name: string
  balance: number
  price: number
  value: number
  change24h: number
  chain: string
  logo?: string
}

export interface Portfolio {
  totalValue: number
  totalProfit: number
  profitPercent: number
  assets: Asset[]
  change24h: number
}

// Alert Types
export type AlertType = 'price' | 'bot_status' | 'pnl' | 'system'
export type AlertCondition = 'above' | 'below' | 'equals' | 'change'

export interface Alert {
  id: string
  type: AlertType
  name: string
  condition: AlertCondition
  threshold: number
  asset?: string
  botId?: string
  enabled: boolean
  channels: ('push' | 'telegram' | 'discord' | 'email')[]
  createdAt: Date
  triggeredAt?: Date
}

// Trade Types
export interface Trade {
  id: string
  botId: string
  type: 'buy' | 'sell'
  pair: string
  price: number
  amount: number
  total: number
  profit?: number
  timestamp: Date
}

// Chart Types
export interface ChartDataPoint {
  date: string
  value: number
}

// Dashboard Types
export interface DashboardStats {
  totalValue: number
  totalProfit: number
  profitPercent: number
  activeBots: number
  totalBots: number
  activeAlerts: number
  recentTrades: Trade[]
}
