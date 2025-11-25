'use client'

import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  Shield,
  Lightbulb,
  BarChart3,
  Bot,
  AlertTriangle,
} from 'lucide-react'

const suggestions = [
  {
    icon: TrendingUp,
    label: 'วิเคราะห์พอร์ต',
    prompt: 'ช่วยวิเคราะห์พอร์ตการลงทุนของฉันหน่อย มีความเสี่ยงอะไรบ้าง?',
  },
  {
    icon: Shield,
    label: 'ประเมินความเสี่ยง',
    prompt: 'ประเมินความเสี่ยงของพอร์ตปัจจุบัน และแนะนำวิธีลดความเสี่ยง',
  },
  {
    icon: Lightbulb,
    label: 'แนะนำกลยุทธ์',
    prompt: 'แนะนำกลยุทธ์การเทรดที่เหมาะกับสภาวะตลาดปัจจุบัน',
  },
  {
    icon: BarChart3,
    label: 'สรุปผลการเทรด',
    prompt: 'สรุปผลการเทรดของบอททั้งหมดในช่วง 7 วันที่ผ่านมา',
  },
  {
    icon: Bot,
    label: 'ปรับปรุงบอท',
    prompt: 'บอทไหนที่ควรปรับปรุงการตั้งค่า? มีคำแนะนำอะไรบ้าง?',
  },
  {
    icon: AlertTriangle,
    label: 'ตรวจสอบปัญหา',
    prompt: 'ตรวจสอบว่ามีบอทไหนที่มีปัญหาหรือต้องการความสนใจบ้าง',
  },
]

interface SuggestionChipsProps {
  onSelect: (prompt: string) => void
}

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.label}
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => onSelect(suggestion.prompt)}
        >
          <suggestion.icon className="h-4 w-4" />
          {suggestion.label}
        </Button>
      ))}
    </div>
  )
}
