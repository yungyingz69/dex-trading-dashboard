'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Plus } from 'lucide-react'
import type { AlertType, AlertCondition } from '@/types'

const alertTypes: { value: AlertType; label: string; description: string }[] = [
  { value: 'price', label: 'แจ้งเตือนราคา', description: 'เมื่อราคาถึงเป้าหมาย' },
  { value: 'pnl', label: 'แจ้งเตือน P&L', description: 'เมื่อกำไร/ขาดทุนถึงเป้า' },
  {
    value: 'bot_status',
    label: 'แจ้งเตือนบอท',
    description: 'เมื่อบอทเปลี่ยนสถานะ',
  },
]

const conditions: { value: AlertCondition; label: string }[] = [
  { value: 'above', label: 'สูงกว่า' },
  { value: 'below', label: 'ต่ำกว่า' },
]

const assets = ['BTC', 'ETH', 'SOL', 'MATIC', 'AVAX', 'ARB', 'OP']

interface CreateAlertDialogProps {
  onCreateAlert?: (data: {
    name: string
    type: AlertType
    condition: AlertCondition
    threshold: number
    asset?: string
    channels: string[]
  }) => void
}

export function CreateAlertDialog({ onCreateAlert }: CreateAlertDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '' as AlertType,
    condition: '' as AlertCondition,
    threshold: '',
    asset: '',
    pushEnabled: true,
    telegramEnabled: false,
    discordEnabled: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const channels: string[] = []
    if (formData.pushEnabled) channels.push('push')
    if (formData.telegramEnabled) channels.push('telegram')
    if (formData.discordEnabled) channels.push('discord')

    onCreateAlert?.({
      name: formData.name,
      type: formData.type,
      condition: formData.condition,
      threshold: parseFloat(formData.threshold),
      asset: formData.asset || undefined,
      channels,
    })
    setOpen(false)
    setFormData({
      name: '',
      type: '' as AlertType,
      condition: '' as AlertCondition,
      threshold: '',
      asset: '',
      pushEnabled: true,
      telegramEnabled: false,
      discordEnabled: false,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          สร้างการแจ้งเตือน
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>สร้างการแจ้งเตือนใหม่</DialogTitle>
            <DialogDescription>
              ตั้งค่าการแจ้งเตือนเพื่อไม่พลาดโอกาส
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Alert Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">ชื่อการแจ้งเตือน</Label>
              <Input
                id="name"
                placeholder="เช่น ETH ราคาเป้าหมาย"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Alert Type */}
            <div className="grid gap-2">
              <Label>ประเภท</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as AlertType })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภทการแจ้งเตือน" />
                </SelectTrigger>
                <SelectContent>
                  {alertTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex flex-col">
                        <span>{type.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {type.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Asset (for price alerts) */}
            {formData.type === 'price' && (
              <div className="grid gap-2">
                <Label>สินทรัพย์</Label>
                <Select
                  value={formData.asset}
                  onValueChange={(value) =>
                    setFormData({ ...formData, asset: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสินทรัพย์" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset} value={asset}>
                        {asset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Condition */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>เงื่อนไข</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) =>
                    setFormData({ ...formData, condition: value as AlertCondition })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกเงื่อนไข" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((cond) => (
                      <SelectItem key={cond.value} value={cond.value}>
                        {cond.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="threshold">
                  {formData.type === 'price' ? 'ราคา (USD)' : 'มูลค่า (USD)'}
                </Label>
                <Input
                  id="threshold"
                  type="number"
                  placeholder="0.00"
                  value={formData.threshold}
                  onChange={(e) =>
                    setFormData({ ...formData, threshold: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Notification Channels */}
            <div className="space-y-3">
              <Label>ช่องทางการแจ้งเตือน</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Push Notification</p>
                    <p className="text-xs text-muted-foreground">
                      แจ้งเตือนผ่านเบราว์เซอร์
                    </p>
                  </div>
                  <Switch
                    checked={formData.pushEnabled}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, pushEnabled: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Telegram</p>
                    <p className="text-xs text-muted-foreground">
                      แจ้งเตือนผ่าน Telegram Bot
                    </p>
                  </div>
                  <Switch
                    checked={formData.telegramEnabled}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, telegramEnabled: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Discord</p>
                    <p className="text-xs text-muted-foreground">
                      แจ้งเตือนผ่าน Discord Webhook
                    </p>
                  </div>
                  <Switch
                    checked={formData.discordEnabled}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, discordEnabled: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              ยกเลิก
            </Button>
            <Button type="submit">สร้างการแจ้งเตือน</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
