import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import cookie from '@fastify/cookie'

import { authRoutes } from './routes/auth.js'
import { botRoutes } from './routes/bots.js'
import { portfolioRoutes } from './routes/portfolio.js'
import { alertRoutes } from './routes/alerts.js'
import { dashboardRoutes } from './routes/dashboard.js'
import { aiRoutes } from './routes/ai.js'

const fastify = Fastify({
  logger: true,
})

// Register plugins
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
})

await fastify.register(cookie)

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
  cookie: {
    cookieName: 'token',
    signed: false,
  },
})

// Decorate fastify with authenticate
fastify.decorate('authenticate', async function (request: any, reply: any) {
  try {
    // Try to get token from cookie first
    const cookieToken = request.cookies?.token
    // Or from Authorization header
    const authHeader = request.headers.authorization
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    const token = cookieToken || headerToken

    if (!token) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    // Verify the token manually
    const decoded = fastify.jwt.verify(token)
    request.user = decoded
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' })
  }
})

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Register routes
await fastify.register(authRoutes, { prefix: '/api/v1/auth' })
await fastify.register(botRoutes, { prefix: '/api/v1/bots' })
await fastify.register(portfolioRoutes, { prefix: '/api/v1/portfolio' })
await fastify.register(alertRoutes, { prefix: '/api/v1/alerts' })
await fastify.register(dashboardRoutes, { prefix: '/api/v1/dashboard' })
await fastify.register(aiRoutes, { prefix: '/api/v1/ai' })

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '4000')
    await fastify.listen({ port, host: '0.0.0.0' })
    console.log(`🚀 Server running on http://localhost:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
