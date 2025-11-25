'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
  Pie,
  PieChart,
} from 'recharts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Loader2,
  DollarSign,
  BarChart3,
  Award,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data for fallback
const mockStats = {
  totalTrades: 524,
  winningTrades: 312,
  losingTrades: 212,
  winRate: 59.54,
  totalProfit: 8750.25,
  totalLoss: 3420.50,
  netProfit: 5329.75,
  avgWin: 28.05,
  avgLoss: 16.14,
  largestWin: 425.50,
  largestLoss: 185.25,
  profitFactor: 2.56,
}

const mockDailyPerformance = [
  { date: '11/01', profit: 245.50, trades: 18, volume: 12500 },
  { date: '11/02', profit: -85.25, trades: 22, volume: 15200 },
  { date: '11/03', profit: 312.00, trades: 15, volume: 9800 },
  { date: '11/04', profit: 178.75, trades: 20, volume: 13400 },
  { date: '11/05', profit: -42.50, trades: 12, volume: 7600 },
  { date: '11/06', profit: 425.25, trades: 25, volume: 18500 },
  { date: '11/07', profit: 156.00, trades: 16, volume: 10200 },
  { date: '11/08', profit: -125.75, trades: 19, volume: 14100 },
  { date: '11/09', profit: 289.50, trades: 21, volume: 16300 },
  { date: '11/10', profit: 198.25, trades: 17, volume: 11800 },
  { date: '11/11', profit: -68.00, trades: 14, volume: 8900 },
  { date: '11/12', profit: 356.75, trades: 23, volume: 17200 },
  { date: '11/13', profit: 142.50, trades: 18, volume: 12400 },
  { date: '11/14', profit: 267.00, trades: 20, volume: 14800 },
]

const mockBotPerformance = [
  { botId: 'bot-1', botName: 'ETH Grid Bot', profit: 1250.50, profitPercent: 12.5, trades: 156, winRate: 62.4 },
  { botId: 'bot-2', botName: 'SOL DCA Bot', profit: 850.25, profitPercent: 8.5, trades: 48, winRate: 58.3 },
  { botId: 'bot-3', botName: 'BTC Arbitrage', profit: -120.00, profitPercent: -2.4, trades: 23, winRate: 39.1 },
  { botId: 'bot-4', botName: 'MATIC Grid', profit: 320.75, profitPercent: 6.4, trades: 89, winRate: 55.1 },
]

const mockPairPerformance = [
  { pair: 'ETH/USDT', profit: 2450.25, trades: 186, volume: 125000, winRate: 61.2 },
  { pair: 'SOL/USDT', profit: 1285.50, trades: 124, volume: 85000, winRate: 58.9 },
  { pair: 'BTC/USDT', profit: 890.75, trades: 98, volume: 165000, winRate: 55.1 },
  { pair: 'MATIC/USDT', profit: 420.25, trades: 72, volume: 32000, winRate: 52.8 },
  { pair: 'AVAX/USDT', profit: 283.00, trades: 44, volume: 28000, winRate: 50.0 },
]

const mockRecentTrades = [
  { id: '1', pair: 'ETH/USDT', type: 'sell', amount: 0.5, price: 3520.50, profit: 35.12, timestamp: '2024-01-15 14:30' },
  { id: '2', pair: 'SOL/USDT', type: 'sell', amount: 10, price: 102.30, profit: 35.50, timestamp: '2024-01-15 14:20' },
  { id: '3', pair: 'BTC/USDT', type: 'buy', amount: 0.05, price: 42150.00, profit: null, timestamp: '2024-01-15 15:00' },
  { id: '4', pair: 'ETH/USDT', type: 'buy', amount: 0.5, price: 3450.25, profit: null, timestamp: '2024-01-15 10:30' },
  { id: '5', pair: 'SOL/USDT', type: 'buy', amount: 10, price: 98.75, profit: null, timestamp: '2024-01-15 12:15' },
]

const chartConfig = {
  profit: {
    label: 'กำไร',
    color: 'hsl(var(--chart-1))',
  },
  loss: {
    label: 'ขาดทุน',
    color: 'hsl(var(--chart-2))',
  },
  trades: {
    label: 'จำนวนเทรด',
    color: 'hsl(var(--chart-3))',
  },
  volume: {
    label: 'Volume',
    color: 'hsl(var(--chart-4))',
  },
  cumulative: {
    label: 'กำไรสะสม',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

const botColors = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6']

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const {
    stats: apiStats,
    dailyPerformance: apiDaily,
    botPerformance: apiBot,
    pairPerformance: apiPair,
    isLoading,
    error,
    refresh,
  } = useAnalytics(period)

  // Use API data or fallback to mock
  const stats = apiStats || mockStats
  const dailyPerformance = apiDaily.length > 0 ? apiDaily : mockDailyPerformance
  const botPerformance = apiBot.length > 0 ? apiBot : mockBotPerformance
  const pairPerformance = apiPair.length > 0 ? apiPair : mockPairPerformance

  // Calculate cumulative profit for chart
  const cumulativeData = dailyPerformance.reduce((acc: any[], item, index) => {
    const prevCumulative = index > 0 ? acc[index - 1].cumulative : 0
    return [
      ...acc,
      {
        ...item,
        cumulative: prevCumulative + item.profit,
      },
    ]
  }, [])

  const botPieData = botPerformance
    .filter((b) => b.profit > 0)
    .map((b, index) => ({
      name: b.botName,
      value: b.profit,
      color: botColors[index % botColors.length],
    }))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">วิเคราะห์การเทรด</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            สถิติและประสิทธิภาพการเทรดโดยละเอียด
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <SelectTrigger className="w-[100px] sm:w-[120px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 วัน</SelectItem>
              <SelectItem value="30d">30 วัน</SelectItem>
              <SelectItem value="90d">90 วัน</SelectItem>
              <SelectItem value="all">ทั้งหมด</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refresh} disabled={isLoading} size="sm">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">รีเฟรช</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-sm text-yellow-500">
          ไม่สามารถโหลดข้อมูลได้ กำลังแสดงข้อมูลตัวอย่าง
        </div>
      )}

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กำไรสุทธิ</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'text-2xl font-bold',
                stats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'
              )}
            >
              {stats.netProfit >= 0 ? '+' : ''}${stats.netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              จากเทรดทั้งหมด {stats.totalTrades} ครั้ง
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'text-2xl font-bold',
                stats.winRate >= 50 ? 'text-green-500' : 'text-yellow-500'
              )}
            >
              {stats.winRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.winningTrades} ชนะ / {stats.losingTrades} แพ้
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'text-2xl font-bold',
                stats.profitFactor >= 1.5
                  ? 'text-green-500'
                  : stats.profitFactor >= 1
                    ? 'text-yellow-500'
                    : 'text-red-500'
              )}
            >
              {stats.profitFactor.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              กำไรรวม / ขาดทุนรวม
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เฉลี่ยต่อเทรด</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${((stats.netProfit) / stats.totalTrades).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              ชนะ ${stats.avgWin.toFixed(2)} / แพ้ ${stats.avgLoss.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card className="bg-green-500/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กำไรรวม</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              +${stats.totalProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              เทรดชนะสูงสุด: ${stats.largestWin.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-500/10 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ขาดทุนรวม</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              -${stats.totalLoss.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              เทรดแพ้สูงสุด: ${stats.largestLoss.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เทรดชนะ</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {stats.winningTrades}
            </div>
            <p className="text-xs text-muted-foreground">
              เฉลี่ย ${stats.avgWin.toFixed(2)} / เทรด
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เทรดแพ้</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.losingTrades}
            </div>
            <p className="text-xs text-muted-foreground">
              เฉลี่ย ${stats.avgLoss.toFixed(2)} / เทรด
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Cumulative P&L Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>กำไร/ขาดทุนสะสม</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={cumulativeData}>
                <defs>
                  <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-cumulative)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-cumulative)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
                  dataKey="cumulative"
                  stroke="var(--color-cumulative)"
                  fill="url(#fillCumulative)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bot Performance Pie */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>กำไรแยกตามบอท</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="mx-auto h-[200px]">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `$${Number(value).toLocaleString()}`}
                    />
                  }
                />
                <Pie
                  data={botPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {botPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="mt-4 space-y-2">
              {botPerformance.slice(0, 4).map((bot, index) => (
                <div
                  key={bot.botId}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: botColors[index % botColors.length] }}
                    />
                    <span className="text-sm">{bot.botName}</span>
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      bot.profit >= 0 ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    {bot.profit >= 0 ? '+' : ''}${bot.profit.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily P&L Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>กำไร/ขาดทุนรายวัน</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={dailyPerformance}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
              <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                {dailyPerformance.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.profit >= 0 ? '#22c55e' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Tabs for detailed analysis */}
      <Tabs defaultValue="pairs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pairs">คู่เทรด</TabsTrigger>
          <TabsTrigger value="bots">บอท</TabsTrigger>
          <TabsTrigger value="trades">เทรดล่าสุด</TabsTrigger>
        </TabsList>

        <TabsContent value="pairs">
          <Card>
            <CardHeader>
              <CardTitle>ประสิทธิภาพแยกตามคู่เทรด</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>คู่เทรด</TableHead>
                    <TableHead className="text-right">จำนวนเทรด</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                    <TableHead className="text-right">Win Rate</TableHead>
                    <TableHead className="text-right">กำไร/ขาดทุน</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pairPerformance.map((pair) => (
                    <TableRow key={pair.pair}>
                      <TableCell className="font-medium">{pair.pair}</TableCell>
                      <TableCell className="text-right">{pair.trades}</TableCell>
                      <TableCell className="text-right">
                        ${pair.volume.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={pair.winRate >= 50 ? 'default' : 'secondary'}
                          className={cn(
                            pair.winRate >= 55
                              ? 'bg-green-500'
                              : pair.winRate >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          )}
                        >
                          {pair.winRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={cn(
                          'text-right font-medium',
                          pair.profit >= 0 ? 'text-green-500' : 'text-red-500'
                        )}
                      >
                        {pair.profit >= 0 ? '+' : ''}${pair.profit.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots">
          <Card>
            <CardHeader>
              <CardTitle>ประสิทธิภาพแยกตามบอท</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>บอท</TableHead>
                    <TableHead className="text-right">จำนวนเทรด</TableHead>
                    <TableHead className="text-right">Win Rate</TableHead>
                    <TableHead className="text-right">%กำไร</TableHead>
                    <TableHead className="text-right">กำไร/ขาดทุน</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {botPerformance.map((bot) => (
                    <TableRow key={bot.botId}>
                      <TableCell className="font-medium">{bot.botName}</TableCell>
                      <TableCell className="text-right">{bot.trades}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={bot.winRate >= 50 ? 'default' : 'secondary'}
                          className={cn(
                            bot.winRate >= 55
                              ? 'bg-green-500'
                              : bot.winRate >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          )}
                        >
                          {bot.winRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={cn(
                          'text-right',
                          bot.profitPercent >= 0 ? 'text-green-500' : 'text-red-500'
                        )}
                      >
                        {bot.profitPercent >= 0 ? '+' : ''}
                        {bot.profitPercent.toFixed(1)}%
                      </TableCell>
                      <TableCell
                        className={cn(
                          'text-right font-medium',
                          bot.profit >= 0 ? 'text-green-500' : 'text-red-500'
                        )}
                      >
                        {bot.profit >= 0 ? '+' : ''}${bot.profit.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades">
          <Card>
            <CardHeader>
              <CardTitle>เทรดล่าสุด</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>เวลา</TableHead>
                    <TableHead>คู่เทรด</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead className="text-right">จำนวน</TableHead>
                    <TableHead className="text-right">ราคา</TableHead>
                    <TableHead className="text-right">กำไร/ขาดทุน</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRecentTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="text-muted-foreground">
                        {trade.timestamp}
                      </TableCell>
                      <TableCell className="font-medium">{trade.pair}</TableCell>
                      <TableCell>
                        <Badge
                          variant={trade.type === 'buy' ? 'default' : 'secondary'}
                          className={cn(
                            trade.type === 'buy' ? 'bg-green-500' : 'bg-red-500'
                          )}
                        >
                          {trade.type === 'buy' ? 'ซื้อ' : 'ขาย'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{trade.amount}</TableCell>
                      <TableCell className="text-right">
                        ${trade.price.toLocaleString()}
                      </TableCell>
                      <TableCell
                        className={cn(
                          'text-right font-medium',
                          trade.profit === null
                            ? 'text-muted-foreground'
                            : trade.profit >= 0
                              ? 'text-green-500'
                              : 'text-red-500'
                        )}
                      >
                        {trade.profit !== null
                          ? `${trade.profit >= 0 ? '+' : ''}$${trade.profit.toFixed(2)}`
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
