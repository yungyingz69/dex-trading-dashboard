'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { Trade } from '@/types'

const recentTrades: Trade[] = [
  {
    id: '1',
    botId: 'bot-1',
    type: 'buy',
    pair: 'ETH/USDT',
    price: 3450.25,
    amount: 0.5,
    total: 1725.13,
    timestamp: new Date('2024-01-15T10:30:00'),
  },
  {
    id: '2',
    botId: 'bot-1',
    type: 'sell',
    pair: 'ETH/USDT',
    price: 3520.50,
    amount: 0.5,
    total: 1760.25,
    profit: 35.12,
    timestamp: new Date('2024-01-15T11:45:00'),
  },
  {
    id: '3',
    botId: 'bot-2',
    type: 'buy',
    pair: 'SOL/USDT',
    price: 98.75,
    amount: 10,
    total: 987.50,
    timestamp: new Date('2024-01-15T12:15:00'),
  },
  {
    id: '4',
    botId: 'bot-2',
    type: 'sell',
    pair: 'SOL/USDT',
    price: 102.30,
    amount: 10,
    total: 1023.00,
    profit: 35.50,
    timestamp: new Date('2024-01-15T14:20:00'),
  },
  {
    id: '5',
    botId: 'bot-3',
    type: 'buy',
    pair: 'BTC/USDT',
    price: 42150.00,
    amount: 0.05,
    total: 2107.50,
    timestamp: new Date('2024-01-15T15:00:00'),
  },
]

export function RecentTrades() {
  return (
    <Card className="lg:col-span-3">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Recent Trades</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
        <div className="space-y-3 sm:space-y-4">
          {recentTrades.map((trade) => (
            <div
              key={trade.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    trade.type === 'buy'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}
                >
                  {trade.type === 'buy' ? (
                    <ArrowDownRight className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{trade.pair}</span>
                    <Badge
                      variant={trade.type === 'buy' ? 'default' : 'secondary'}
                      className="text-[10px]"
                    >
                      {trade.type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {trade.amount} @ ${trade.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  ${trade.total.toLocaleString()}
                </p>
                {trade.profit && (
                  <p className="text-xs text-green-500">
                    +${trade.profit.toFixed(2)}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {trade.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
