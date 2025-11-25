'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Play,
  Square,
  MoreHorizontal,
  Settings,
  Trash2,
  Eye,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Bot, BotStatus } from '@/types'
import Link from 'next/link'

const statusConfig: Record<
  BotStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }
> = {
  running: { label: 'Running', variant: 'default', className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20' },
  stopped: { label: 'Stopped', variant: 'secondary', className: '' },
  error: { label: 'Error', variant: 'destructive', className: '' },
  syncing: { label: 'Syncing', variant: 'outline', className: 'border-yellow-500 text-yellow-500' },
}

interface BotTableProps {
  bots: Bot[]
  onStart?: (id: string) => void
  onStop?: (id: string) => void
  onDelete?: (id: string) => void
  loadingBotId?: string | null
}

export function BotTable({ bots, onStart, onStop, onDelete, loadingBotId }: BotTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ชื่อบอท</TableHead>
            <TableHead>ประเภท</TableHead>
            <TableHead>คู่เทรด</TableHead>
            <TableHead>Exchange</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead className="text-right">กำไร/ขาดทุน</TableHead>
            <TableHead className="text-right">เทรด</TableHead>
            <TableHead className="text-right">การดำเนินการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bots.map((bot) => {
            const status = statusConfig[bot.status]
            const isRunning = bot.status === 'running'
            const isSyncing = bot.status === 'syncing'
            const isLoading = loadingBotId === bot.id

            return (
              <TableRow key={bot.id}>
                <TableCell>
                  <Link
                    href={`/bots/${bot.id}`}
                    className="font-medium hover:underline"
                  >
                    {bot.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {bot.type}
                  </Badge>
                </TableCell>
                <TableCell>{bot.pair}</TableCell>
                <TableCell>{bot.exchange}</TableCell>
                <TableCell>
                  <Badge className={cn('gap-1', status.className)}>
                    {isSyncing && (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    )}
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      'font-medium',
                      bot.profit >= 0 ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    {bot.profit >= 0 ? '+' : ''}${bot.profit.toLocaleString()}
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({bot.profitPercent > 0 ? '+' : ''}{bot.profitPercent}%)
                  </span>
                </TableCell>
                <TableCell className="text-right">{bot.trades}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {isLoading ? (
                      <Button variant="outline" size="sm" disabled>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        กำลังดำเนินการ
                      </Button>
                    ) : isRunning ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStop?.(bot.id)}
                      >
                        <Square className="mr-1 h-3 w-3" />
                        Stop
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onStart?.(bot.id)}
                        disabled={isSyncing}
                      >
                        <Play className="mr-1 h-3 w-3" />
                        Start
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/bots/${bot.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            ดูรายละเอียด
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/bots/${bot.id}/edit`}>
                            <Settings className="mr-2 h-4 w-4" />
                            แก้ไขการตั้งค่า
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete?.(bot.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          ลบบอท
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
