import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'

const addWalletSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  chain: z.string().min(1),
})

export async function portfolioRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', (fastify as any).authenticate)

  // Get portfolio overview
  fastify.get('/overview', async (request: any) => {
    const wallets = await prisma.wallet.findMany({
      where: { userId: request.user.userId, isActive: true },
      include: { assets: true },
    })

    // Calculate totals
    let totalValue = 0
    let totalChange = 0
    const allAssets: any[] = []

    for (const wallet of wallets) {
      for (const asset of wallet.assets) {
        totalValue += asset.value
        totalChange += asset.value * (asset.change24h / 100)

        // Aggregate assets by symbol
        const existing = allAssets.find((a) => a.symbol === asset.symbol)
        if (existing) {
          existing.balance += asset.balance
          existing.value += asset.value
        } else {
          allAssets.push({
            symbol: asset.symbol,
            name: asset.name,
            balance: asset.balance,
            price: asset.price,
            value: asset.value,
            change24h: asset.change24h,
            logo: asset.logo,
          })
        }
      }
    }

    const change24hPercent = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0

    return {
      overview: {
        totalValue,
        change24h: totalChange,
        change24hPercent,
        walletsCount: wallets.length,
        assetsCount: allAssets.length,
      },
      assets: allAssets.sort((a, b) => b.value - a.value),
    }
  })

  // Get all wallets
  fastify.get('/wallets', async (request: any) => {
    const wallets = await prisma.wallet.findMany({
      where: { userId: request.user.userId },
      include: {
        assets: true,
        _count: { select: { assets: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate wallet values
    const walletsWithValue = wallets.map((wallet) => ({
      ...wallet,
      totalValue: wallet.assets.reduce((sum, a) => sum + a.value, 0),
    }))

    return { wallets: walletsWithValue }
  })

  // Add wallet
  fastify.post('/wallets', async (request: any, reply) => {
    try {
      const body = addWalletSchema.parse(request.body)

      // Check if wallet already exists
      const existing = await prisma.wallet.findFirst({
        where: {
          userId: request.user.userId,
          address: body.address,
          chain: body.chain,
        },
      })

      if (existing) {
        return reply.status(400).send({ error: 'Wallet already exists' })
      }

      const wallet = await prisma.wallet.create({
        data: {
          ...body,
          userId: request.user.userId,
        },
      })

      return reply.status(201).send({ wallet })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.issues })
      }
      throw error
    }
  })

  // Delete wallet
  fastify.delete('/wallets/:id', async (request: any, reply) => {
    const { id } = request.params as { id: string }

    const wallet = await prisma.wallet.findFirst({
      where: { id, userId: request.user.userId },
    })

    if (!wallet) {
      return reply.status(404).send({ error: 'Wallet not found' })
    }

    await prisma.wallet.delete({ where: { id } })

    return { message: 'Wallet deleted successfully' }
  })

  // Get portfolio history
  fastify.get('/history', async (request: any) => {
    const { period = '7d' } = request.query as { period?: string }

    let startDate = new Date()
    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24)
        break
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
    }

    const snapshots = await prisma.portfolioSnapshot.findMany({
      where: {
        userId: request.user.userId,
        timestamp: { gte: startDate },
      },
      orderBy: { timestamp: 'asc' },
    })

    return { history: snapshots }
  })

  // Get assets breakdown
  fastify.get('/assets', async (request: any) => {
    const wallets = await prisma.wallet.findMany({
      where: { userId: request.user.userId, isActive: true },
      include: { assets: true },
    })

    // Aggregate assets across all wallets
    const assetsMap = new Map<string, any>()

    for (const wallet of wallets) {
      for (const asset of wallet.assets) {
        const existing = assetsMap.get(asset.symbol)
        if (existing) {
          existing.balance += asset.balance
          existing.value += asset.value
          existing.wallets.push(wallet.name)
        } else {
          assetsMap.set(asset.symbol, {
            symbol: asset.symbol,
            name: asset.name,
            balance: asset.balance,
            price: asset.price,
            value: asset.value,
            change24h: asset.change24h,
            logo: asset.logo,
            wallets: [wallet.name],
          })
        }
      }
    }

    const assets = Array.from(assetsMap.values()).sort((a, b) => b.value - a.value)

    return { assets }
  })
}
