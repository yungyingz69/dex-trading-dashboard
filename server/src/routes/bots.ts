import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'

const createBotSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['GRID', 'DCA', 'ARBITRAGE', 'CUSTOM']),
  pair: z.string(),
  exchange: z.string(),
  config: z.any().optional(),
})

const updateBotSchema = z.object({
  name: z.string().optional(),
  config: z.any().optional(),
})

export async function botRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', (fastify as any).authenticate)

  // List all bots
  fastify.get('/', async (request: any) => {
    const bots = await prisma.bot.findMany({
      where: { userId: request.user.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { trades: true },
        },
      },
    })

    return { bots }
  })

  // Get single bot
  fastify.get('/:id', async (request: any, reply) => {
    const { id } = request.params as { id: string }

    const bot = await prisma.bot.findFirst({
      where: {
        id,
        userId: request.user.userId,
      },
      include: {
        trades: {
          orderBy: { timestamp: 'desc' },
          take: 20,
        },
        alerts: true,
      },
    })

    if (!bot) {
      return reply.status(404).send({ error: 'Bot not found' })
    }

    return { bot }
  })

  // Create bot
  fastify.post('/', async (request: any, reply) => {
    try {
      const body = createBotSchema.parse(request.body)

      const bot = await prisma.bot.create({
        data: {
          ...body,
          userId: request.user.userId,
        },
      })

      return reply.status(201).send({ bot })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.issues })
      }
      throw error
    }
  })

  // Update bot
  fastify.patch('/:id', async (request: any, reply) => {
    try {
      const { id } = request.params as { id: string }
      const body = updateBotSchema.parse(request.body)

      // Check ownership
      const existingBot = await prisma.bot.findFirst({
        where: { id, userId: request.user.userId },
      })

      if (!existingBot) {
        return reply.status(404).send({ error: 'Bot not found' })
      }

      const bot = await prisma.bot.update({
        where: { id },
        data: body,
      })

      return { bot }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.issues })
      }
      throw error
    }
  })

  // Delete bot
  fastify.delete('/:id', async (request: any, reply) => {
    const { id } = request.params as { id: string }

    // Check ownership
    const existingBot = await prisma.bot.findFirst({
      where: { id, userId: request.user.userId },
    })

    if (!existingBot) {
      return reply.status(404).send({ error: 'Bot not found' })
    }

    await prisma.bot.delete({ where: { id } })

    return { message: 'Bot deleted successfully' }
  })

  // Start bot
  fastify.post('/:id/start', async (request: any, reply) => {
    const { id } = request.params as { id: string }

    // Check ownership
    const bot = await prisma.bot.findFirst({
      where: { id, userId: request.user.userId },
    })

    if (!bot) {
      return reply.status(404).send({ error: 'Bot not found' })
    }

    if (bot.status === 'RUNNING') {
      return reply.status(400).send({ error: 'Bot is already running' })
    }

    const updatedBot = await prisma.bot.update({
      where: { id },
      data: {
        status: 'RUNNING',
        lastStarted: new Date(),
      },
    })

    return { bot: updatedBot, message: 'Bot started successfully' }
  })

  // Stop bot
  fastify.post('/:id/stop', async (request: any, reply) => {
    const { id } = request.params as { id: string }

    // Check ownership
    const bot = await prisma.bot.findFirst({
      where: { id, userId: request.user.userId },
    })

    if (!bot) {
      return reply.status(404).send({ error: 'Bot not found' })
    }

    if (bot.status === 'STOPPED') {
      return reply.status(400).send({ error: 'Bot is already stopped' })
    }

    // Calculate uptime
    const uptimeHours = bot.lastStarted
      ? Math.floor((Date.now() - bot.lastStarted.getTime()) / (1000 * 60 * 60))
      : 0

    const updatedBot = await prisma.bot.update({
      where: { id },
      data: {
        status: 'STOPPED',
        lastStopped: new Date(),
        uptime: bot.uptime + uptimeHours,
      },
    })

    return { bot: updatedBot, message: 'Bot stopped successfully' }
  })

  // Get bot stats
  fastify.get('/:id/stats', async (request: any, reply) => {
    const { id } = request.params as { id: string }

    const bot = await prisma.bot.findFirst({
      where: { id, userId: request.user.userId },
    })

    if (!bot) {
      return reply.status(404).send({ error: 'Bot not found' })
    }

    const trades = await prisma.trade.findMany({
      where: { botId: id },
    })

    const winningTrades = trades.filter((t) => t.profit && t.profit > 0)
    const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0)

    return {
      stats: {
        totalTrades: trades.length,
        winningTrades: winningTrades.length,
        winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
        totalProfit,
        avgProfit: trades.length > 0 ? totalProfit / trades.length : 0,
      },
    }
  })
}
