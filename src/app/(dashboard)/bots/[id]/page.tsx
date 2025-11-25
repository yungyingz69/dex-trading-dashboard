'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Area, AreaChart, XAxis, YAxis } from 'recharts'
import {
  ArrowLeft,
  Play,
  Square,
  Settings,
  TrendingUp,
  TrendingDown,
  Clock,
  Activity,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getBotById, getTradesByBotId } from '@/lib/mock-data'
import type { BotStatus } from '@/types'

const statusConfig: Record<
  BotStatus,
  { label: string; className: string }
> = {
  running: { label: 'Running', className: 'bg-green-500/10 text-green-500' },
  stopped: { label: 'Stopped', className: 'bg-gray-500/10 text-gray-500' },
  error: { label: 'Error', className: 'bg-red-500/10 text-red-500' },
  syncing: { label: 'Syncing', className: 'bg-yellow-500/10 text-yellow-500' },
}

// Mock performance data
const performanceData = [
  { date: 'Day 1', value: 0 },
  { date: 'Day 5', value: 120 },
  { date: 'Day 10', value: 280 },
  { date: 'Day 15', value: 450 },
  { date: 'Day 20', value: 620 },
  { date: 'Day 25', value: 890 },
  { date: 'Day 30', value: 1250 },
]

const chartConfig = {
  value: {
    label: 'Profit',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export default function BotDetailPage() {
  const params = useParams()
  const botId = params.id as string
  const bot = getBotById(botId)
  const trades = getTradesByBotId(botId)

  if (!bot) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold">ไม่พบบอท</h2>
        <p className="text-muted-foreground">บอทที่คุณกำลังหาไม่มีอยู่ในระบบ</p>
        <Button asChild className="mt-4">
          <Link href="/bots">กลับไปหน้าจัดการบอท</Link>
        </Button>
      </div>
    )
  }

  const status = statusConfig[bot.status]
  const isRunning = bot.status === 'running'
  const isSyncing = bot.status === 'syncing'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/bots">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{bot.name}</h1>
              <Badge className={cn('gap-1', status.className)}>
                {isSyncing && <RefreshCw className="h-3 w-3 animate-spin" />}
                {status.label}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {bot.pair} • {bot.exchange} • {bot.type.toUpperCase()} Bot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isRunning ? (
            <Button variant="outline">
              <Square className="mr-2 h-4 w-4" />
              หยุดบอท
            </Button>
          ) : (
            <Button disabled={isSyncing}>
              <Play className="mr-2 h-4 w-4" />
              เริ่มบอท
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/bots/${bot.id}/edit`}>
              <Settings className="mr-2 h-4 w-4" />
              ตั้งค่า
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กำไร/ขาดทุน</CardTitle>
            {bot.profit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'text-2xl font-bold',
                bot.profit >= 0 ? 'text-green-500' : 'text-red-500'
              )}
            >
              {bot.profit >= 0 ? '+' : ''}${bot.profit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {bot.profitPercent > 0 ? '+' : ''}{bot.profitPercent}% ตั้งแต่เริ่ม
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">จำนวนเทรด</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bot.trades}</div>
            <p className="text-xs text-muted-foreground">ครั้งทั้งหมด</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เวลาทำงาน</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(bot.uptime / 24)}d {bot.uptime % 24}h
            </div>
            <p className="text-xs text-muted-foreground">Uptime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              {Math.floor(bot.trades * 0.68)} ครั้งที่กำไร
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">ผลการดำเนินงาน</TabsTrigger>
          <TabsTrigger value="trades">ประวัติเทรด</TabsTrigger>
          <TabsTrigger value="config">การตั้งค่า</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>กราฟกำไร/ขาดทุน</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-value)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-value)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => `$${Number(value).toLocaleString()}`}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-value)"
                    fill="url(#fillProfit)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades">
          <Card>
            <CardHeader>
              <CardTitle>ประวัติการเทรด</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>คู่เทรด</TableHead>
                    <TableHead className="text-right">ราคา</TableHead>
                    <TableHead className="text-right">จำนวน</TableHead>
                    <TableHead className="text-right">มูลค่า</TableHead>
                    <TableHead className="text-right">กำไร</TableHead>
                    <TableHead className="text-right">เวลา</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.length > 0 ? (
                    trades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>
                          <Badge
                            variant={trade.type === 'buy' ? 'default' : 'secondary'}
                          >
                            {trade.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{trade.pair}</TableCell>
                        <TableCell className="text-right">
                          ${trade.price.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {trade.amount}
                        </TableCell>
                        <TableCell className="text-right">
                          ${trade.total.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {trade.profit ? (
                            <span className="text-green-500">
                              +${trade.profit.toFixed(2)}
                            </span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {trade.timestamp.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">ยังไม่มีประวัติการเทรด</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>การตั้งค่าบอท</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">ประเภทบอท</p>
                  <p className="text-muted-foreground capitalize">{bot.type} Bot</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">คู่เทรด</p>
                  <p className="text-muted-foreground">{bot.pair}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Exchange</p>
                  <p className="text-muted-foreground">{bot.exchange}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">สร้างเมื่อ</p>
                  <p className="text-muted-foreground">
                    {bot.createdAt.toLocaleDateString('th-TH')}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" asChild>
                  <Link href={`/bots/${bot.id}/edit`}>
                    <Settings className="mr-2 h-4 w-4" />
                    แก้ไขการตั้งค่า
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
