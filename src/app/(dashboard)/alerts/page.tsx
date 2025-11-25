'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { AlertCard } from '@/components/alerts/alert-card'
import { CreateAlertDialog } from '@/components/alerts/create-alert-dialog'
import { useAlerts } from '@/lib/hooks/use-alerts'
import { mockAlerts } from '@/lib/mock-data'
import { Bell, BellOff, CheckCircle, AlertTriangle, Loader2, RefreshCw } from 'lucide-react'
import type { Alert as AlertType, AlertType as AlertTypeEnum, AlertCondition } from '@/types'

export default function AlertsPage() {
  const {
    alerts: apiAlerts,
    isLoading,
    error,
    refresh,
    createAlert,
    toggleAlert,
    deleteAlert,
  } = useAlerts()
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null)

  // แปลง API alerts เป็น Alert format หรือใช้ mock data
  const alerts: AlertType[] = apiAlerts.length > 0
    ? apiAlerts.map((alert) => ({
        id: alert.id,
        name: alert.name,
        type: alert.type.toLowerCase() as AlertType['type'],
        condition: alert.condition.toLowerCase() as AlertType['condition'],
        threshold: alert.threshold,
        asset: alert.asset,
        enabled: alert.enabled,
        channels: alert.channels as AlertType['channels'],
        triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : undefined,
        triggeredCount: alert.triggeredCount,
        createdAt: new Date(alert.createdAt),
      }))
    : mockAlerts

  const activeAlerts = alerts.filter((a) => a.enabled)
  const disabledAlerts = alerts.filter((a) => !a.enabled)
  const triggeredAlerts = alerts.filter((a) => a.triggeredAt)
  const priceAlerts = alerts.filter((a) => a.type === 'price')
  const pnlAlerts = alerts.filter((a) => a.type === 'pnl')
  const botAlerts = alerts.filter((a) => a.type === 'bot_status')

  const handleToggleAlert = async (id: string, enabled: boolean) => {
    try {
      setIsActionLoading(id)
      await toggleAlert(id)
    } catch (err) {
      console.error('Failed to toggle alert:', err)
      alert('ไม่สามารถเปลี่ยนสถานะการแจ้งเตือนได้')
    } finally {
      setIsActionLoading(null)
    }
  }

  const handleDeleteAlert = async (id: string) => {
    if (confirm('คุณต้องการลบการแจ้งเตือนนี้หรือไม่?')) {
      try {
        setIsActionLoading(id)
        await deleteAlert(id)
      } catch (err) {
        console.error('Failed to delete alert:', err)
        alert('ไม่สามารถลบการแจ้งเตือนได้')
      } finally {
        setIsActionLoading(null)
      }
    }
  }

  const handleCreateAlert = async (data: {
    name: string
    type: AlertTypeEnum
    condition: AlertCondition
    threshold: number
    asset?: string
    channels: string[]
  }) => {
    try {
      await createAlert({
        name: data.name,
        type: data.type.toUpperCase(),
        condition: data.condition.toUpperCase(),
        threshold: data.threshold,
        asset: data.asset,
        channels: data.channels,
      })
    } catch (err) {
      console.error('Failed to create alert:', err)
      alert('ไม่สามารถสร้างการแจ้งเตือนได้')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">การแจ้งเตือน</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            จัดการการแจ้งเตือนราคา, บอท และ P&L
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
          <CreateAlertDialog onCreateAlert={handleCreateAlert} />
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
            <CardTitle className="text-sm font-medium">
              การแจ้งเตือนทั้งหมด
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeAlerts.length} กำลังทำงาน
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กำลังทำงาน</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {activeAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground">การแจ้งเตือน</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ปิดใช้งาน</CardTitle>
            <BellOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disabledAlerts.length}</div>
            <p className="text-xs text-muted-foreground">การแจ้งเตือน</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">แจ้งเตือนแล้ว</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {triggeredAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground">ครั้ง</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">ทั้งหมด ({alerts.length})</TabsTrigger>
            <TabsTrigger value="price" className="text-xs sm:text-sm">ราคา ({priceAlerts.length})</TabsTrigger>
            <TabsTrigger value="pnl" className="text-xs sm:text-sm">P&L ({pnlAlerts.length})</TabsTrigger>
            <TabsTrigger value="bot" className="text-xs sm:text-sm">บอท ({botAlerts.length})</TabsTrigger>
            <TabsTrigger value="active" className="text-xs sm:text-sm">
              ทำงาน ({activeAlerts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onToggle={handleToggleAlert}
                  onDelete={handleDeleteAlert}
                  isLoading={isActionLoading === alert.id}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="price">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {priceAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onToggle={handleToggleAlert}
                  onDelete={handleDeleteAlert}
                  isLoading={isActionLoading === alert.id}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pnl">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pnlAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onToggle={handleToggleAlert}
                  onDelete={handleDeleteAlert}
                  isLoading={isActionLoading === alert.id}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bot">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {botAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onToggle={handleToggleAlert}
                  onDelete={handleDeleteAlert}
                  isLoading={isActionLoading === alert.id}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onToggle={handleToggleAlert}
                  onDelete={handleDeleteAlert}
                  isLoading={isActionLoading === alert.id}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
