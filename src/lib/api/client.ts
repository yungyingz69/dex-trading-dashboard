const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options

    let url = `${this.baseUrl}${endpoint}`

    if (params) {
      const searchParams = new URLSearchParams(params)
      url += `?${searchParams.toString()}`
    }

    const response = await fetch(url, {
      ...fetchOptions,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(email: string, password: string, name?: string) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  }

  async logout() {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    })
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me')
  }

  async updateProfile(data: { name?: string; currency?: string; language?: string }) {
    return this.request<{ user: any }>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  async deleteAccount() {
    return this.request<{ message: string }>('/auth/account', {
      method: 'DELETE',
    })
  }

  // Dashboard
  async getDashboardStats() {
    return this.request<{
      stats: any
      recentTrades: any[]
      botsOverview: any[]
    }>('/dashboard/stats')
  }

  async getDashboardPerformance(period = '30d') {
    return this.request<{
      portfolioHistory: any[]
      tradingActivity: any[]
    }>('/dashboard/performance', { params: { period } })
  }

  // Bots
  async getBots() {
    return this.request<{ bots: any[] }>('/bots')
  }

  async getBot(id: string) {
    return this.request<{ bot: any }>(`/bots/${id}`)
  }

  async createBot(data: {
    name: string
    type: string
    pair: string
    exchange: string
    config?: any
  }) {
    return this.request<{ bot: any }>('/bots', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateBot(id: string, data: { name?: string; config?: any }) {
    return this.request<{ bot: any }>(`/bots/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteBot(id: string) {
    return this.request<{ message: string }>(`/bots/${id}`, {
      method: 'DELETE',
    })
  }

  async startBot(id: string) {
    return this.request<{ bot: any; message: string }>(`/bots/${id}/start`, {
      method: 'POST',
    })
  }

  async stopBot(id: string) {
    return this.request<{ bot: any; message: string }>(`/bots/${id}/stop`, {
      method: 'POST',
    })
  }

  async getBotStats(id: string) {
    return this.request<{ stats: any }>(`/bots/${id}/stats`)
  }

  // Portfolio
  async getPortfolioOverview() {
    return this.request<{ overview: any; assets: any[] }>('/portfolio/overview')
  }

  async getWallets() {
    return this.request<{ wallets: any[] }>('/portfolio/wallets')
  }

  async addWallet(data: { name: string; address: string; chain: string }) {
    return this.request<{ wallet: any }>('/portfolio/wallets', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteWallet(id: string) {
    return this.request<{ message: string }>(`/portfolio/wallets/${id}`, {
      method: 'DELETE',
    })
  }

  async getPortfolioHistory(period = '7d') {
    return this.request<{ history: any[] }>('/portfolio/history', {
      params: { period },
    })
  }

  async getAssets() {
    return this.request<{ assets: any[] }>('/portfolio/assets')
  }

  // Alerts
  async getAlerts() {
    return this.request<{ alerts: any[] }>('/alerts')
  }

  async getAlert(id: string) {
    return this.request<{ alert: any }>(`/alerts/${id}`)
  }

  async createAlert(data: {
    name: string
    type: string
    condition: string
    threshold: number
    asset?: string
    botId?: string
    channels?: string[]
  }) {
    return this.request<{ alert: any }>('/alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateAlert(
    id: string,
    data: {
      name?: string
      condition?: string
      threshold?: number
      enabled?: boolean
      channels?: string[]
    }
  ) {
    return this.request<{ alert: any }>(`/alerts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteAlert(id: string) {
    return this.request<{ message: string }>(`/alerts/${id}`, {
      method: 'DELETE',
    })
  }

  async toggleAlert(id: string) {
    return this.request<{ alert: any }>(`/alerts/${id}/toggle`, {
      method: 'POST',
    })
  }

  async getAlertHistory() {
    return this.request<{ history: any[] }>('/alerts/history')
  }

  // AI
  async chatWithAI(message: string, history: { role: string; content: string }[] = []) {
    return this.request<{ message: string; timestamp: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    })
  }

  async analyzePortfolio(portfolio: any) {
    return this.request<{ analysis: string; timestamp: string }>('/ai/analyze-portfolio', {
      method: 'POST',
      body: JSON.stringify({ portfolio }),
    })
  }

  async optimizeBot(bot: any) {
    return this.request<{ suggestions: string; timestamp: string }>('/ai/optimize-bot', {
      method: 'POST',
      body: JSON.stringify({ bot }),
    })
  }

  // Analytics
  async getAnalytics(period = '30d') {
    return this.request<{
      stats: any
      dailyPerformance: any[]
      botPerformance: any[]
      pairPerformance: any[]
    }>('/analytics', {
      params: { period },
    })
  }

  async getAnalyticsStats(period = '30d') {
    return this.request<{ stats: any }>('/analytics/stats', {
      params: { period },
    })
  }

  async getAnalyticsTrades(period = '30d', page = 1, limit = 50) {
    return this.request<{ trades: any[]; total: number; page: number }>('/analytics/trades', {
      params: { period, page: String(page), limit: String(limit) },
    })
  }
}

export const api = new ApiClient(API_BASE_URL)
