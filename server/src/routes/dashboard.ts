import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function dashboardRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', (fastify as any).authenticate)

  // Get dashboard stats
  fastify.get('/stats', async (request: any) => {
    const userId = request.user.userId

    // Get all data in parallel
    const [bots, wallets, alerts, recentTrades] = await Promise.all([
      prisma.bot.findMany({ where: { userId } }),
      prisma.wallet.findMany({
        where: { userId, isActive: true },
        include: { assets: true },
      }),
      prisma.alert.findMany({ where: { userId, enabled: true } }),
      prisma.trade.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: 10,
        include: {
          bot: { select: { name: true } },
        },
      }),
    ])

    // Calculate portfolio value
    let totalValue = 0
    let totalChange = 0
    for (const wallet of wallets) {
      for (const asset of wallet.assets) {
        totalValue += asset.value
        totalChange += asset.value * (asset.change24h / 100)
      }
    }

    // Calculate bot stats
    const activeBots = bots.filter((b) => b.status === 'RUNNING').length
    const totalProfit = bots.reduce((sum, b) => sum + b.profit, 0)
    const totalTrades = bots.reduce((sum, b) => sum + b.tradesCount, 0)

    return {
      stats: {
        portfolio: {
          totalValue,
          change24h: totalChange,
          change24hPercent: totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0,
        },
        bots: {
          total: bots.length,
          active: activeBots,
          totalProfit,
          totalTrades,
        },
        alerts: {
          active: alerts.length,
          triggered: alerts.filter((a) => a.triggeredAt).length,
        },
      },
      recentTrades: recentTrades.map((trade) => ({
        id: trade.id,
        botName: trade.bot?.name || 'Manual',
        type: trade.type,
        pair: trade.pair,
        price: trade.price,
        amount: trade.amount,
        total: trade.total,
        profit: trade.profit,
        timestamp: trade.timestamp,
      })),
      botsOverview: bots.map((bot) => ({
        id: bot.id,
        name: bot.name,
        type: bot.type,
        status: bot.status,
        pair: bot.pair,
        profit: bot.profit,
        profitPercent: bot.profitPercent,
        trades: bot.tradesCount,
      })),
    }
  })

  // Get performance data for charts
  fastify.get('/performance', async (request: any) => {
    const userId = request.user.userId
    const { period = '30d' } = request.query as { period?: string }

    let startDate = new Date()
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
    }

    const snapshots = await prisma.portfolioSnapshot.findMany({
      where: {
        userId,
        timestamp: { gte: startDate },
      },
      orderBy: { timestamp: 'asc' },
    })

    const trades = await prisma.trade.findMany({
      where: {
        userId,
        timestamp: { gte: startDate },
      },
      orderBy: { timestamp: 'asc' },
    })

    // Group trades by day
    const tradesByDay = trades.reduce((acc, trade) => {
      const day = trade.timestamp.toISOString().split('T')[0]
      if (!acc[day]) {
        acc[day] = { trades: 0, profit: 0, volume: 0 }
      }
      acc[day].trades += 1
      acc[day].profit += trade.profit || 0
      acc[day].volume += trade.total
      return acc
    }, {} as Record<string, { trades: number; profit: number; volume: number }>)

    return {
      portfolioHistory: snapshots.map((s) => ({
        date: s.timestamp.toISOString().split('T')[0],
        value: s.totalValue,
        profit: s.profit,
      })),
      tradingActivity: Object.entries(tradesByDay).map(([date, data]) => ({
        date,
        ...data,
      })),
    }
  })

  // Get bot performance comparison
  fastify.get('/bots-comparison', async (request: any) => {
    const userId = request.user.userId

    const bots = await prisma.bot.findMany({
      where: { userId },
      include: {
        _count: { select: { trades: true } },
        trades: {
          where: { profit: { not: null } },
          select: { profit: true },
        },
      },
    })

    const comparison = bots.map((bot) => {
      const winningTrades = bot.trades.filter((t) => t.profit && t.profit > 0)
      const winRate = bot.trades.length > 0 ? (winningTrades.length / bot.trades.length) * 100 : 0

      return {
        id: bot.id,
        name: bot.name,
        type: bot.type,
        status: bot.status,
        profit: bot.profit,
        profitPercent: bot.profitPercent,
        trades: bot.tradesCount,
        winRate,
      }
    })

    return { comparison: comparison.sort((a, b) => b.profit - a.profit) }
  })
}
