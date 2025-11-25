import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'

const createAlertSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['PRICE', 'BOT_STATUS', 'PNL', 'SYSTEM']),
  condition: z.enum(['ABOVE', 'BELOW', 'EQUALS', 'CHANGE']),
  threshold: z.number(),
  asset: z.string().optional(),
  botId: z.string().optional(),
  channels: z.array(z.string()).default([]),
})

const updateAlertSchema = z.object({
  name: z.string().optional(),
  condition: z.enum(['ABOVE', 'BELOW', 'EQUALS', 'CHANGE']).optional(),
  threshold: z.number().optional(),
  enabled: z.boolean().optional(),
  channels: z.array(z.string()).optional(),
})

export async function alertRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', (fastify as any).authenticate)

  // List all alerts
  fastify.get('/', async (request: any) => {
    const alerts = await prisma.alert.findMany({
      where: { userId: request.user.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        bot: {
          select: { id: true, name: true },
        },
      },
    })

    return { alerts }
  })

  // Get single alert
  fastify.get('/:id', async (request: any, reply) => {
    const { id } = request.params as { id: string }

    const alert = await prisma.alert.findFirst({
      where: { id, userId: request.user.userId },
      include: {
        bot: {
          select: { id: true, name: true },
        },
      },
    })

    if (!alert) {
      return reply.status(404).send({ error: 'Alert not found' })
    }

    return { alert }
  })

  // Create alert
  fastify.post('/', async (request: any, reply) => {
    try {
      const body = createAlertSchema.parse(request.body)

      // If botId provided, verify ownership
      if (body.botId) {
        const bot = await prisma.bot.findFirst({
          where: { id: body.botId, userId: request.user.userId },
        })
        if (!bot) {
          return reply.status(404).send({ error: 'Bot not found' })
        }
      }

      const alert = await prisma.alert.create({
        data: {
          ...body,
          userId: request.user.userId,
        },
      })

      return reply.status(201).send({ alert })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.issues })
      }
      throw error
    }
  })

  // Update alert
  fastify.patch('/:id', async (request: any, reply) => {
    try {
      const { id } = request.params as { id: string }
      const body = updateAlertSchema.parse(request.body)

      // Check ownership
      const existingAlert = await prisma.alert.findFirst({
        where: { id, userId: request.user.userId },
      })

      if (!existingAlert) {
        return reply.status(404).send({ error: 'Alert not found' })
      }

      const alert = await prisma.alert.update({
        where: { id },
        data: body,
      })

      return { alert }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.issues })
      }
      throw error
    }
  })

  // Delete alert
  fastify.delete('/:id', async (request: any, reply) => {
    const { id } = request.params as { id: string }

    const existingAlert = await prisma.alert.findFirst({
      where: { id, userId: request.user.userId },
    })

    if (!existingAlert) {
      return reply.status(404).send({ error: 'Alert not found' })
    }

    await prisma.alert.delete({ where: { id } })

    return { message: 'Alert deleted successfully' }
  })

  // Toggle alert enabled/disabled
  fastify.post('/:id/toggle', async (request: any, reply) => {
    const { id } = request.params as { id: string }

    const alert = await prisma.alert.findFirst({
      where: { id, userId: request.user.userId },
    })

    if (!alert) {
      return reply.status(404).send({ error: 'Alert not found' })
    }

    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: { enabled: !alert.enabled },
    })

    return { alert: updatedAlert }
  })

  // Get alert history (triggered alerts)
  fastify.get('/history', async (request: any) => {
    const alerts = await prisma.alert.findMany({
      where: {
        userId: request.user.userId,
        triggeredAt: { not: null },
      },
      orderBy: { triggeredAt: 'desc' },
      take: 50,
    })

    return { history: alerts }
  })
}
