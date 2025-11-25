'use client'

import { DollarSign, TrendingUp, Bot, Bell, Loader2, RefreshCw } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { PortfolioChart } from '@/components/dashboard/portfolio-chart'
import { BotStatusCard } from '@/components/dashboard/bot-status-card'
import { RecentTrades } from '@/components/dashboard/recent-trades'
import { AssetAllocation } from '@/components/dashboard/asset-allocation'
import { Button } from '@/components/ui/button'
import { useDashboard } from '@/lib/hooks/use-dashboard'
import type { Bot as BotType } from '@/types'

// Fallback mock data เมื่อยังไม่มีข้อมูลจริง
const fallbackBots: BotType[] = [
  {
    id: 'bot-1',
    name: 'ETH Grid Bot',
    type: 'grid',
    status: 'running',
    pair: 'ETH/USDT',
    exchange: 'Uniswap',
    profit: 1250.5,
    profitPercent: 12.5,
    trades: 156,
    uptime: 720,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'bot-2',
    name: 'SOL DCA Bot',
    type: 'dca',
    status: 'running',
    pair: 'SOL/USDT',
    exchange: 'Jupiter',
    profit: 850.25,
    profitPercent: 8.5,
    trades: 48,
    uptime: 480,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date(),
  },
  {
    id: 'bot-3',
    name: 'BTC Arbitrage',
    type: 'arbitrage',
    status: 'stopped',
    pair: 'BTC/USDT',
    exchange: 'Multi-DEX',
    profit: -120.0,
    profitPercent: -2.4,
    trades: 23,
    uptime: 0,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date(),
  },
]

export default function DashboardPage() {
  const { stats, botsOverview, isLoading, error, refresh } = useDashboard()

  // แปลง botsOverview เป็น BotType format
  const bots: BotType[] = botsOverview.length > 0
    ? botsOverview.map((bot) => ({
        id: bot.id,
        name: bot.name,
        type: bot.type as 'grid' | 'dca' | 'arbitrage' | 'custom',
        status: bot.status as 'running' | 'stopped' | 'error',
        pair: bot.pair,
        exchange: 'DEX',
        profit: bot.profit,
        profitPercent: bot.profitPercent,
        trades: bot.trades,
        uptime: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    : fallbackBots

  // ใช้ข้อมูลจาก API หรือ default values
  const portfolioValue = stats?.portfolio?.totalValue ?? 95420
  const portfolioChange = stats?.portfolio?.change24hPercent ?? 12.5
  const totalProfit = stats?.bots?.totalProfit ?? 8320
  const activeBots = stats?.bots?.active ?? 2
  const totalBots = stats?.bots?.total ?? 3
  const activeAlerts = stats?.alerts?.active ?? 5
  const triggeredAlerts = stats?.alerts?.triggered ?? 3

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            ภาพรวมพอร์ตการลงทุนและสถานะบอททั้งหมด
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">รีเฟรช</span>
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-sm text-yellow-500">
          ไม่สามารถโหลดข้อมูลได้ กำลังแสดงข้อมูลตัวอย่าง
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatsCard
          title="มูลค่าพอร์ตรวม"
          value={`$${portfolioValue.toLocaleString()}`}
          change={`${portfolioChange >= 0 ? '+' : ''}${portfolioChange.toFixed(1)}% จากเดือนที่แล้ว`}
          changeType={portfolioChange >= 0 ? 'positive' : 'negative'}
          icon={DollarSign}
        />
        <StatsCard
          title="กำไร/ขาดทุน"
          value={`${totalProfit >= 0 ? '+' : ''}$${Math.abs(totalProfit).toLocaleString()}`}
          change={`${totalProfit >= 0 ? '+' : ''}${((totalProfit / portfolioValue) * 100).toFixed(1)}% รวม`}
          changeType={totalProfit >= 0 ? 'positive' : 'negative'}
          icon={TrendingUp}
        />
        <StatsCard
          title="บอททำงาน"
          value={`${activeBots}/${totalBots}`}
          description={`${activeBots} บอทกำลังทำงาน`}
          icon={Bot}
        />
        <StatsCard
          title="การแจ้งเตือน"
          value={activeAlerts.toString()}
          description={`${triggeredAlerts} ยังไม่ได้อ่าน`}
          icon={Bell}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        <PortfolioChart />
        <AssetAllocation />
      </div>

      {/* Bots and Trades Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Bot Status Cards */}
        <div className="space-y-4 lg:col-span-4">
          <h2 className="text-xl font-semibold">สถานะบอท</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bots.map((bot) => (
                <BotStatusCard key={bot.id} bot={bot} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Trades */}
        <RecentTrades />
      </div>
    </div>
  )
}
