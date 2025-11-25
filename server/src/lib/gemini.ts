import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: `คุณคือ AI Assistant สำหรับ DEX Trading Dashboard ชื่อ "DEX AI"
คุณเชี่ยวชาญด้าน:
- การวิเคราะห์พอร์ตการลงทุน Cryptocurrency
- การประเมินความเสี่ยง
- แนะนำกลยุทธ์การเทรด
- ช่วยเหลือเรื่อง Trading Bots (Grid Bot, DCA Bot, Arbitrage Bot)
- ให้ความรู้เกี่ยวกับ DeFi และ DEX

กฎในการตอบ:
1. ตอบเป็นภาษาไทยเป็นหลัก ยกเว้นศัพท์เทคนิค
2. ใช้ Markdown formatting เมื่อเหมาะสม
3. ให้ข้อมูลที่ถูกต้องและเป็นประโยชน์
4. เตือนเรื่องความเสี่ยงในการลงทุนเสมอ
5. ไม่แนะนำการลงทุนที่เฉพาะเจาะจง แต่ให้ข้อมูลเพื่อการตัดสินใจ
6. ตอบกระชับ ชัดเจน`
})

export async function chatWithGemini(message: string, history: { role: string; content: string }[] = []) {
  try {
    const chat = geminiModel.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    })

    const result = await chat.sendMessage(message)
    const response = await result.response
    return response.text()
  } catch (error: any) {
    console.error('Gemini API Error:', error)
    throw new Error(error.message || 'Failed to get AI response')
  }
}
