'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Bell,
  TrendingUp,
  TrendingDown,
  Bot,
  AlertTriangle,
  MoreVertical,
  Trash2,
  Edit,
  MessageSquare,
  Mail,
  Loader2,
} from 'lucide-react'
import type { Alert, AlertType } from '@/types'

const alertTypeConfig: Record<
  AlertType,
  { label: string; icon: typeof Bell; color: string }
> = {
  price: { label: 'ราคา', icon: TrendingUp, color: 'text-blue-500' },
  bot_status: { label: 'สถานะบอท', icon: Bot, color: 'text-purple-500' },
  pnl: { label: 'กำไร/ขาดทุน', icon: TrendingDown, color: 'text-green-500' },
  system: { label: 'ระบบ', icon: AlertTriangle, color: 'text-yellow-500' },
}

const channelIcons: Record<string, typeof Bell> = {
  push: Bell,
  telegram: MessageSquare,
  discord: MessageSquare,
  email: Mail,
}

interface AlertCardProps {
  alert: Alert
  onToggle?: (id: string, enabled: boolean) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  isLoading?: boolean
}

export function AlertCard({ alert, onToggle, onEdit, onDelete, isLoading }: AlertCardProps) {
  const typeConfig = alertTypeConfig[alert.type]
  const Icon = typeConfig.icon

  const getConditionText = () => {
    switch (alert.condition) {
      case 'above':
        return 'สูงกว่า'
      case 'below':
        return 'ต่ำกว่า'
      case 'equals':
        return 'เท่ากับ'
      case 'change':
        return 'เปลี่ยนแปลง'
      default:
        return ''
    }
  }

  return (
    <Card className={!alert.enabled ? 'opacity-60' : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className={`rounded-lg bg-muted p-2 ${typeConfig.color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-medium">{alert.name}</CardTitle>
            <Badge variant="outline" className="mt-1 text-xs">
              {typeConfig.label}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Switch
              checked={alert.enabled}
              onCheckedChange={(checked) => onToggle?.(alert.id, checked)}
            />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(alert.id)}>
                <Edit className="mr-2 h-4 w-4" />
                แก้ไข
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete?.(alert.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                ลบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Condition */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm">
              {alert.type === 'price' && (
                <>
                  <span className="font-medium">{alert.asset}</span>{' '}
                  {getConditionText()}{' '}
                  <span className="font-bold text-primary">
                    ${alert.threshold.toLocaleString()}
                  </span>
                </>
              )}
              {alert.type === 'pnl' && (
                <>
                  กำไร/ขาดทุน {getConditionText()}{' '}
                  <span className="font-bold text-primary">
                    ${alert.threshold.toLocaleString()}
                  </span>
                </>
              )}
              {alert.type === 'bot_status' && (
                <>แจ้งเตือนเมื่อบอทมีการเปลี่ยนแปลงสถานะ</>
              )}
            </p>
          </div>

          {/* Channels */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">แจ้งเตือนผ่าน:</span>
            <div className="flex gap-1">
              {alert.channels.map((channel) => {
                const ChannelIcon = channelIcons[channel] || Bell
                return (
                  <Badge
                    key={channel}
                    variant="secondary"
                    className="gap-1 text-xs"
                  >
                    <ChannelIcon className="h-3 w-3" />
                    {channel}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* Triggered info */}
          {alert.triggeredAt && (
            <p className="text-xs text-muted-foreground">
              แจ้งเตือนล่าสุด: {alert.triggeredAt.toLocaleString('th-TH')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
