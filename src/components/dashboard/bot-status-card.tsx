'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Square, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Bot, BotStatus } from '@/types'

const statusConfig: Record<
  BotStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  running: { label: 'Running', variant: 'default' },
  stopped: { label: 'Stopped', variant: 'secondary' },
  error: { label: 'Error', variant: 'destructive' },
  syncing: { label: 'Syncing', variant: 'outline' },
}

interface BotStatusCardProps {
  bot: Bot
  onStart?: () => void
  onStop?: () => void
}

export function BotStatusCard({ bot, onStart, onStop }: BotStatusCardProps) {
  const status = statusConfig[bot.status]
  const isRunning = bot.status === 'running'

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-medium">{bot.name}</CardTitle>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Config</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Pair</p>
            <p className="text-sm font-medium">{bot.pair}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="text-sm font-medium capitalize">{bot.type}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Profit</p>
            <p
              className={cn(
                'text-sm font-medium',
                bot.profit >= 0 ? 'text-green-500' : 'text-red-500'
              )}
            >
              ${bot.profit.toLocaleString()} ({bot.profitPercent > 0 ? '+' : ''}
              {bot.profitPercent}%)
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Trades</p>
            <p className="text-sm font-medium">{bot.trades}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {isRunning ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onStop}
            >
              <Square className="mr-2 h-3 w-3" />
              Stop
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={onStart}
            >
              <Play className="mr-2 h-3 w-3" />
              Start
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
