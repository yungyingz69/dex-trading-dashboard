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
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const botTypes = [
  { value: 'grid', label: 'Grid Bot', description: 'ซื้อขายในช่วงราคาที่กำหนด' },
  { value: 'dca', label: 'DCA Bot', description: 'ซื้อเฉลี่ยต้นทุนตามเวลา' },
  { value: 'arbitrage', label: 'Arbitrage Bot', description: 'หากำไรจากส่วนต่างราคา' },
]

const exchanges = [
  { value: 'uniswap', label: 'Uniswap', chain: 'Ethereum' },
  { value: 'jupiter', label: 'Jupiter', chain: 'Solana' },
  { value: 'pancakeswap', label: 'PancakeSwap', chain: 'BSC' },
  { value: 'quickswap', label: 'QuickSwap', chain: 'Polygon' },
  { value: 'traderjoe', label: 'TraderJoe', chain: 'Avalanche' },
]

const pairs = [
  'ETH/USDT',
  'BTC/USDT',
  'SOL/USDT',
  'MATIC/USDT',
  'AVAX/USDT',
  'ARB/USDT',
  'OP/USDT',
]

interface CreateBotDialogProps {
  onCreateBot?: (data: {
    name: string
    type: string
    exchange: string
    pair: string
    investment: number
  }) => void
}

export function CreateBotDialog({ onCreateBot }: CreateBotDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    exchange: '',
    pair: '',
    investment: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateBot?.({
      ...formData,
      investment: parseFloat(formData.investment),
    })
    setOpen(false)
    setFormData({ name: '', type: '', exchange: '', pair: '', investment: '' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          สร้างบอทใหม่
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>สร้างบอทเทรดใหม่</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลเพื่อสร้างบอทเทรดอัตโนมัติ
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Bot Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">ชื่อบอท</Label>
              <Input
                id="name"
                placeholder="เช่น ETH Grid Bot"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Bot Type */}
            <div className="grid gap-2">
              <Label>ประเภทบอท</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภทบอท" />
                </SelectTrigger>
                <SelectContent>
                  {botTypes.map((type) => (
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

            {/* Exchange */}
            <div className="grid gap-2">
              <Label>Exchange</Label>
              <Select
                value={formData.exchange}
                onValueChange={(value) =>
                  setFormData({ ...formData, exchange: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือก DEX" />
                </SelectTrigger>
                <SelectContent>
                  {exchanges.map((ex) => (
                    <SelectItem key={ex.value} value={ex.value}>
                      <div className="flex items-center gap-2">
                        <span>{ex.label}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {ex.chain}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trading Pair */}
            <div className="grid gap-2">
              <Label>คู่เทรด</Label>
              <Select
                value={formData.pair}
                onValueChange={(value) =>
                  setFormData({ ...formData, pair: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกคู่เทรด" />
                </SelectTrigger>
                <SelectContent>
                  {pairs.map((pair) => (
                    <SelectItem key={pair} value={pair}>
                      {pair}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Investment Amount */}
            <div className="grid gap-2">
              <Label htmlFor="investment">เงินลงทุน (USDT)</Label>
              <Input
                id="investment"
                type="number"
                placeholder="1000"
                min="100"
                step="100"
                value={formData.investment}
                onChange={(e) =>
                  setFormData({ ...formData, investment: e.target.value })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                ขั้นต่ำ 100 USDT
              </p>
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
            <Button type="submit">สร้างบอท</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
