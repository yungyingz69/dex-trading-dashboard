'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage, Message } from '@/components/ai/chat-message'
import { ChatInput } from '@/components/ai/chat-input'
import { SuggestionChips } from '@/components/ai/suggestion-chips'
import { api } from '@/lib/api/client'
import { getMockResponse } from '@/lib/ai/mock-responses'
import { Bot, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'วิเคราะห์พอร์ต',
    description: 'ประเมินสินทรัพย์และแนะนำการปรับปรุง',
  },
  {
    icon: Shield,
    title: 'ประเมินความเสี่ยง',
    description: 'วิเคราะห์ความเสี่ยงและแนวทางป้องกัน',
  },
  {
    icon: Bot,
    title: 'ปรับปรุงบอท',
    description: 'แนะนำการตั้งค่าบอทให้เหมาะสม',
  },
  {
    icon: Zap,
    title: 'กลยุทธ์การเทรด',
    description: 'แนะนำกลยุทธ์ตามสภาวะตลาด',
  },
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [useMockData, setUseMockData] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Prepare chat history for API
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      // Try to call Gemini API
      const response = await api.chatWithAI(content, history)

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setUseMockData(false)
    } catch (error: any) {
      console.error('AI Error:', error)

      // Fallback to mock response if API fails
      const mockResponse = getMockResponse(content)
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: error.message?.includes('not configured')
          ? `⚠️ **Gemini AI ยังไม่ได้ตั้งค่า**\n\nกรุณาเพิ่ม GEMINI_API_KEY ใน server/.env\n\nสามารถขอ API Key ฟรีได้ที่: https://aistudio.google.com/apikey\n\n---\n\n**ตัวอย่างคำตอบ (Mock):**\n\n${mockResponse}`
          : mockResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setUseMockData(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionSelect = (prompt: string) => {
    handleSendMessage(prompt)
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col sm:h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-3 sm:mb-4">
        <h1 className="text-2xl font-bold sm:text-3xl">AI Assistant</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          ผู้ช่วยอัจฉริยะสำหรับวิเคราะห์และจัดการพอร์ตการลงทุน
        </p>
      </div>

      <div className="grid flex-1 gap-4 lg:grid-cols-4">
        {/* Chat Area */}
        <Card className="flex flex-col lg:col-span-3">
          <CardHeader className="border-b py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">DEX AI Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Powered by Gemini AI {useMockData && '(Mock Mode)'}
                </p>
              </div>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <ScrollArea className="flex-1">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Bot className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-medium">
                  สวัสดีครับ! ผมคือ AI Assistant
                </h3>
                <p className="mb-6 max-w-md text-muted-foreground">
                  ผมพร้อมช่วยคุณวิเคราะห์พอร์ต ประเมินความเสี่ยง
                  และแนะนำกลยุทธ์การเทรด เลือกหัวข้อด้านล่างหรือพิมพ์คำถามได้เลยครับ
                </p>
                <SuggestionChips onSelect={handleSuggestionSelect} />
              </div>
            ) : (
              <div className="flex flex-col">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex gap-3 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-1 rounded-lg bg-muted px-4 py-2">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></span>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            )}
          </ScrollArea>

          {/* Suggestion Chips (when there are messages) */}
          {messages.length > 0 && !isLoading && (
            <div className="border-t">
              <SuggestionChips onSelect={handleSuggestionSelect} />
            </div>
          )}

          {/* Input Area */}
          <ChatInput
            onSend={handleSendMessage}
            isLoading={isLoading}
            placeholder="ถาม AI เกี่ยวกับพอร์ตของคุณ..."
          />
        </Card>

        {/* Sidebar - Features */}
        <div className="hidden space-y-4 lg:block">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">ความสามารถ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="rounded-lg bg-muted p-2">
                    <feature.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">คำแนะนำ</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• ถามเป็นภาษาไทยหรืออังกฤษได้</li>
                <li>• ระบุรายละเอียดให้ชัดเจน</li>
                <li>• ถามทีละหัวข้อจะได้คำตอบดีกว่า</li>
                <li>• AI อ้างอิงจากข้อมูลพอร์ตจริงของคุณ</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
