'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Area, AreaChart, XAxis, YAxis, Cell, Pie, PieChart } from 'recharts'
import { AssetTable } from '@/components/portfolio/asset-table'
import { usePortfolio } from '@/lib/hooks/use-portfolio'
import { mockAssets } from '@/lib/mock-data'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Fallback portfolio history data
const fallbackHistory = [
  { date: 'Jan', value: 75000 },
  { date: 'Feb', value: 82000 },
  { date: 'Mar', value: 78000 },
  { date: 'Apr', value: 85000 },
  { date: 'May', value: 91000 },
  { date: 'Jun', value: 88000 },
  { date: 'Jul', value: 95420 },
]

// Fallback wallet data
const fallbackWallets = [
  {
    id: 'wallet-1',
    name: 'Main Wallet',
    address: '0x1234...5678',
    chain: 'Ethereum',
    totalValue: 65000,
  },
  {
    id: 'wallet-2',
    name: 'Solana Wallet',
    address: 'Abc1...xyz9',
    chain: 'Solana',
    totalValue: 22420,
  },
  {
    id: 'wallet-3',
    name: 'Polygon Wallet',
    address: '0xabcd...efgh',
    chain: 'Polygon',
    totalValue: 8000,
  },
]

const chartConfig = {
  value: {
    label: 'Portfolio Value',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

// Asset colors for pie chart
const assetColors = ['#627EEA', '#F7931A', '#00FFA3', '#26A17B', '#8884d8']

export default function PortfolioPage() {
  const {
    overview,
    assets: apiAssets,
    wallets: apiWallets,
    history: apiHistory,
    isLoading,
    error,
    refresh,
  } = usePortfolio()

  // Use API data or fallback to mock data
  const assets = apiAssets.length > 0 ? apiAssets : mockAssets
  const wallets = apiWallets.length > 0 ? apiWallets : fallbackWallets
  const portfolioHistory = apiHistory.length > 0
    ? apiHistory.map((h) => ({
        date: new Date(h.timestamp).toLocaleDateString('th-TH', { month: 'short' }),
        value: h.value,
      }))
    : fallbackHistory

  const totalValue = overview?.totalValue ?? assets.reduce((sum, a) => sum + a.value, 0)
  const totalChange = overview?.change24h ?? assets.reduce(
    (sum, a) => sum + a.value * (a.change24h / 100),
    0
  )
  const totalChangePercent = overview?.change24hPercent ?? (totalChange / (totalValue - totalChange)) * 100

  const pieData = assets.map((asset, index) => ({
    name: asset.symbol,
    value: asset.value,
    color: assetColors[index % assetColors.length],
  }))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">พอร์ตการลงทุน</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            ติดตามสินทรัพย์และ DeFi positions ของคุณ
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" onClick={refresh} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            รีเฟรช
          </Button>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            เชื่อมต่อ Wallet
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-sm text-yellow-500">
          ไม่สามารถโหลดข้อมูลได้ กำลังแสดงข้อมูลตัวอย่าง
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">มูลค่าพอร์ตรวม</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              จาก {wallets.length} กระเป๋าเงิน
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กำไร/ขาดทุน 24h</CardTitle>
            {totalChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'text-2xl font-bold',
                totalChange >= 0 ? 'text-green-500' : 'text-red-500'
              )}
            >
              {totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)}
            </div>
            <p
              className={cn(
                'text-xs',
                totalChangePercent >= 0 ? 'text-green-500' : 'text-red-500'
              )}
            >
              {totalChangePercent >= 0 ? '+' : ''}
              {totalChangePercent.toFixed(2)}% วันนี้
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สินทรัพย์</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.assetsCount ?? assets.length}</div>
            <p className="text-xs text-muted-foreground">ประเภท</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(wallets.map((w) => w.chain)).size}
            </div>
            <p className="text-xs text-muted-foreground">เครือข่าย</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Portfolio History Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>ประวัติมูลค่าพอร์ต</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={portfolioHistory}>
                <defs>
                  <linearGradient id="fillPortfolio" x1="0" y1="0" x2="0" y2="1">
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
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
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
                  fill="url(#fillPortfolio)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>การกระจายสินทรัพย์</CardTitle>
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
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="mt-4 space-y-2">
              {pieData.slice(0, 4).map((asset) => (
                <div
                  key={asset.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: asset.color }}
                    />
                    <span className="text-sm">{asset.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    ${asset.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assets">สินทรัพย์ทั้งหมด</TabsTrigger>
          <TabsTrigger value="wallets">กระเป๋าเงิน</TabsTrigger>
          <TabsTrigger value="defi">DeFi Positions</TabsTrigger>
        </TabsList>

        <TabsContent value="assets">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <AssetTable assets={assets} />
          )}
        </TabsContent>

        <TabsContent value="wallets">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wallets.map((wallet) => (
              <Card key={wallet.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">
                    {wallet.name}
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-1 text-xs">
                        {wallet.address}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {wallet.chain}
                      </span>
                      <span className="text-lg font-bold">
                        ${wallet.totalValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add Wallet Card */}
            <Card className="flex cursor-pointer items-center justify-center border-dashed hover:bg-muted/50">
              <CardContent className="flex flex-col items-center py-8">
                <Plus className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  เชื่อมต่อกระเป๋าใหม่
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="defi">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 rounded-full bg-muted p-4">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">DeFi Positions</h3>
              <p className="text-center text-muted-foreground">
                เร็วๆ นี้! ติดตาม LP, Staking และ Farming positions
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
