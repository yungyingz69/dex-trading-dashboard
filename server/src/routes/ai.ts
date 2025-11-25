import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { chatWithGemini } from '../lib/gemini.js'

const chatSchema = z.object({
  message: z.string().min(1),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().default([]),
})

export async function aiRoutes(fastify: FastifyInstance) {
  // Chat with AI
  fastify.post('/chat', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: any, reply) => {
    try {
      const body = chatSchema.parse(request.body)

      // Check if API key is configured
      if (!process.env.GEMINI_API_KEY) {
        return reply.status(500).send({
          error: 'AI service not configured. Please add GEMINI_API_KEY to environment.',
        })
      }

      const response = await chatWithGemini(body.message, body.history)

      return {
        message: response,
        timestamp: new Date().toISOString(),
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.issues })
      }

      console.error('AI Chat Error:', error)
      return reply.status(500).send({
        error: error.message || 'Failed to get AI response',
      })
    }
  })

  // Get AI suggestions based on portfolio
  fastify.post('/analyze-portfolio', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: any, reply) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return reply.status(500).send({
          error: 'AI service not configured',
        })
      }

      const portfolioData = request.body.portfolio || {}

      const prompt = `วิเคราะห์พอร์ตการลงทุนนี้และให้คำแนะนำ:
${JSON.stringify(portfolioData, null, 2)}

กรุณาวิเคราะห์:
1. การกระจายความเสี่ยง
2. สัดส่วนสินทรัพย์
3. คำแนะนำในการปรับปรุง
4. ระดับความเสี่ยงโดยรวม`

      const response = await chatWithGemini(prompt)

      return {
        analysis: response,
        timestamp: new Date().toISOString(),
      }
    } catch (error: any) {
      console.error('Portfolio Analysis Error:', error)
      return reply.status(500).send({
        error: error.message || 'Failed to analyze portfolio',
      })
    }
  })

  // Get bot optimization suggestions
  fastify.post('/optimize-bot', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: any, reply) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return reply.status(500).send({
          error: 'AI service not configured',
        })
      }

      const botData = request.body.bot || {}

      const prompt = `วิเคราะห์การตั้งค่า Trading Bot นี้และแนะนำการปรับปรุง:
${JSON.stringify(botData, null, 2)}

กรุณาแนะนำ:
1. การปรับ parameters ให้เหมาะสม
2. ความเสี่ยงของการตั้งค่าปัจจุบัน
3. วิธีเพิ่มประสิทธิภาพ
4. สิ่งที่ควรระวัง`

      const response = await chatWithGemini(prompt)

      return {
        suggestions: response,
        timestamp: new Date().toISOString(),
      }
    } catch (error: any) {
      console.error('Bot Optimization Error:', error)
      return reply.status(500).send({
        error: error.message || 'Failed to optimize bot',
      })
    }
  })
}
