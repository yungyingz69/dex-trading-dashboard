'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BotTable } from '@/components/bots/bot-table'
import { CreateBotDialog } from '@/components/bots/create-bot-dialog'
import { Button } from '@/components/ui/button'
import { useBots } from '@/lib/hooks/use-bots'
import { mockBots } from '@/lib/mock-data'
import { Bot, TrendingUp, TrendingDown, Activity, Loader2, RefreshCw } from 'lucide-react'
import type { Bot as BotType } from '@/types'

export default function BotsPage() {
  const {
    bots: apiBots,
    isLoading,
    error,
    refresh,
    createBot,
    startBot,
    stopBot,
    deleteBot
  } = useBots()
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null)

  // แปลง API bots เป็น BotType format หรือใช้ mock data
  const bots: BotType[] = apiBots.length > 0
    ? apiBots.map((bot) => ({
        id: bot.id,
        name: bot.name,
        type: bot.type.toLowerCase() as BotType['type'],
        status: bot.status.toLowerCase() as BotType['status'],
        pair: bot.pair,
        exchange: bot.exchange,
        profit: bot.profit,
        profitPercent: bot.profitPercent,
        trades: bot.tradesCount,
        uptime: bot.uptime,
        createdAt: new Date(bot.createdAt),
        updatedAt: new Date(bot.updatedAt),
      }))
    : mockBots

  const runningBots = bots.filter((b) => b.status === 'running')
  const stoppedBots = bots.filter((b) => b.status === 'stopped')
  const errorBots = bots.filter((b) => b.status === 'error')

  const totalProfit = bots.reduce((sum, b) => sum + b.profit, 0)
  const totalTrades = bots.reduce((sum, b) => sum + b.trades, 0)

  const handleStartBot = async (id: string) => {
    try {
      setIsActionLoading(id)
      await startBot(id)
    } catch (err) {
      console.error('Failed to start bot:', err)
      alert('ไม่สามารถเริ่มบอทได้')
    } finally {
      setIsActionLoading(null)
    }
  }

  const handleStopBot = async (id: string) => {
    try {
      setIsActionLoading(id)
      await stopBot(id)
    } catch (err) {
      console.error('Failed to stop bot:', err)
      alert('ไม่สามารถหยุดบอทได้')
    } finally {
      setIsActionLoading(null)
    }
  }

  const handleDeleteBot = async (id: string) => {
    if (confirm('คุณต้องการลบบอทนี้หรือไม่?')) {
      try {
        setIsActionLoading(id)
        await deleteBot(id)
      } catch (err) {
        console.error('Failed to delete bot:', err)
        alert('ไม่สามารถลบบอทได้')
      } finally {
        setIsActionLoading(null)
      }
    }
  }

  const handleCreateBot = async (data: {
    name: string
    type: string
    exchange: string
    pair: string
    investment: number
  }) => {
    try {
      await createBot({
        name: data.name,
        type: data.type.toUpperCase(),
        pair: data.pair,
        exchange: data.exchange,
        config: { investment: data.investment },
      })
    } catch (err) {
      console.error('Failed to create bot:', err)
      alert('ไม่สามารถสร้างบอทได้')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">จัดการบอท</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            ดูและจัดการบอทเทรดทั้งหมดของคุณ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">รีเฟรช</span>
          </Button>
          <CreateBotDialog onCreateBot={handleCreateBot} />
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
            <CardTitle className="text-sm font-medium">บอททั้งหมด</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bots.length}</div>
            <p className="text-xs text-muted-foreground">
              {runningBots.length} กำลังทำงาน
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กำไรรวม</CardTitle>
            {totalProfit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalProfit >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">จากบอททั้งหมด</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เทรดทั้งหมด</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrades}</div>
            <p className="text-xs text-muted-foreground">ครั้ง</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">มีปัญหา</CardTitle>
            <div
              className={`h-2 w-2 rounded-full ${
                errorBots.length > 0 ? 'bg-red-500' : 'bg-green-500'
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorBots.length}</div>
            <p className="text-xs text-muted-foreground">บอทที่ต้องตรวจสอบ</p>
          </CardContent>
        </Card>
      </div>

      {/* Bots Table with Tabs */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">ทั้งหมด ({bots.length})</TabsTrigger>
            <TabsTrigger value="running" className="text-xs sm:text-sm">
              ทำงาน ({runningBots.length})
            </TabsTrigger>
            <TabsTrigger value="stopped" className="text-xs sm:text-sm">หยุด ({stoppedBots.length})</TabsTrigger>
            <TabsTrigger value="error" className="text-xs sm:text-sm">ปัญหา ({errorBots.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <BotTable
              bots={bots}
              onStart={handleStartBot}
              onStop={handleStopBot}
              onDelete={handleDeleteBot}
              loadingBotId={isActionLoading}
            />
          </TabsContent>

          <TabsContent value="running">
            <BotTable
              bots={runningBots}
              onStart={handleStartBot}
              onStop={handleStopBot}
              onDelete={handleDeleteBot}
              loadingBotId={isActionLoading}
            />
          </TabsContent>

          <TabsContent value="stopped">
            <BotTable
              bots={stoppedBots}
              onStart={handleStartBot}
              onStop={handleStopBot}
              onDelete={handleDeleteBot}
              loadingBotId={isActionLoading}
            />
          </TabsContent>

          <TabsContent value="error">
            <BotTable
              bots={errorBots}
              onStart={handleStartBot}
              onStop={handleStopBot}
              onDelete={handleDeleteBot}
              loadingBotId={isActionLoading}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
