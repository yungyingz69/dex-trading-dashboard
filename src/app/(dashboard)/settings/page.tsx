'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Trash2,
  Save,
  Loader2,
  RefreshCw,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react'
import { useSettings } from '@/lib/hooks/use-settings'
import { useToast } from '@/hooks/use-toast'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { profile, isLoading, isSaving, updateProfile, changePassword, deleteAccount, refresh } = useSettings()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  // Form states
  const [name, setName] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [language, setLanguage] = useState('th')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [initialized, setInitialized] = useState(false)

  // Initialize form when profile loads
  if (profile && !initialized) {
    setName(profile.name || '')
    setCurrency(profile.currency || 'USD')
    setLanguage(profile.language || 'th')
    setInitialized(true)
  }

  const handleSaveProfile = async () => {
    const result = await updateProfile({ name, currency, language })
    if (result.success) {
      toast({
        title: 'บันทึกสำเร็จ',
        description: 'ข้อมูลโปรไฟล์ถูกอัพเดทแล้ว',
      })
    } else {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: result.error?.message || 'ไม่สามารถบันทึกข้อมูลได้',
        variant: 'destructive',
      })
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'รหัสผ่านไม่ตรงกัน',
        description: 'กรุณาตรวจสอบรหัสผ่านใหม่อีกครั้ง',
        variant: 'destructive',
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: 'รหัสผ่านสั้นเกินไป',
        description: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
        variant: 'destructive',
      })
      return
    }

    const result = await changePassword(currentPassword, newPassword)
    if (result.success) {
      toast({
        title: 'เปลี่ยนรหัสผ่านสำเร็จ',
        description: 'รหัสผ่านของคุณถูกเปลี่ยนแล้ว',
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: result.error?.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteAccount = async () => {
    const result = await deleteAccount()
    if (!result.success) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: result.error?.message || 'ไม่สามารถลบบัญชีได้',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ตั้งค่า</h1>
          <p className="text-muted-foreground">จัดการการตั้งค่าบัญชีและแอปพลิเคชัน</p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          รีเฟรช
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">โปรไฟล์</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">การแจ้งเตือน</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">รูปลักษณ์</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">ความปลอดภัย</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลโปรไฟล์</CardTitle>
              <CardDescription>
                จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชี
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อ</Label>
                  <Input
                    id="name"
                    placeholder="ชื่อของคุณ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">อีเมลไม่สามารถเปลี่ยนได้</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>สกุลเงินหลัก</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="THB">THB (฿)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>ภาษา</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="th">ไทย</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                บันทึกการเปลี่ยนแปลง
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>การตั้งค่าการแจ้งเตือน</CardTitle>
              <CardDescription>
                เลือกวิธีการรับการแจ้งเตือนจากระบบ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      รับการแจ้งเตือนผ่านเบราว์เซอร์
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      รับการแจ้งเตือนทางอีเมล
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <h3 className="text-lg font-medium">การเชื่อมต่อภายนอก</h3>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2">
                      <Globe className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="space-y-0.5">
                      <Label>Telegram</Label>
                      <p className="text-sm text-muted-foreground">
                        เชื่อมต่อกับ Telegram Bot
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    เชื่อมต่อ
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-500/10 p-2">
                      <Globe className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="space-y-0.5">
                      <Label>Discord</Label>
                      <p className="text-sm text-muted-foreground">
                        เชื่อมต่อกับ Discord Webhook
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    เชื่อมต่อ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                จัดการ API keys สำหรับเชื่อมต่อกับ DEX และ Exchange
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label>Uniswap API</Label>
                        <Badge variant="secondary">เชื่อมต่อแล้ว</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        สร้างเมื่อ: 15 ม.ค. 2024
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      ลบ
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label>Jupiter API</Label>
                        <Badge variant="secondary">เชื่อมต่อแล้ว</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        สร้างเมื่อ: 10 ม.ค. 2024
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      ลบ
                    </Button>
                  </div>
                </div>
              </div>

              <Button>
                <Key className="mr-2 h-4 w-4" />
                เพิ่ม API Key ใหม่
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>รูปลักษณ์</CardTitle>
              <CardDescription>ปรับแต่งหน้าตาของแอปพลิเคชัน</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>ธีม</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                      theme === 'light'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Sun className="h-6 w-6" />
                    <span className="text-sm font-medium">สว่าง</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Moon className="h-6 w-6" />
                    <span className="text-sm font-medium">มืด</span>
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                      theme === 'system'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Monitor className="h-6 w-6" />
                    <span className="text-sm font-medium">ตามระบบ</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    แสดงข้อมูลแบบกระชับ
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>แสดงภาพเคลื่อนไหว</Label>
                  <p className="text-sm text-muted-foreground">
                    เปิดใช้งาน animations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>ความปลอดภัย</CardTitle>
              <CardDescription>
                จัดการการตั้งค่าความปลอดภัยของบัญชี
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      เพิ่มความปลอดภัยด้วย 2FA
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    เปิดใช้งาน
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">เปลี่ยนรหัสผ่าน</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">รหัสผ่านปัจจุบัน</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleChangePassword}
                      disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                    >
                      {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      เปลี่ยนรหัสผ่าน
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                  <div className="space-y-0.5">
                    <Label className="text-destructive">ลบบัญชี</Label>
                    <p className="text-sm text-muted-foreground">
                      ลบบัญชีและข้อมูลทั้งหมดอย่างถาวร
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        ลบบัญชี
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>คุณแน่ใจหรือไม่?</AlertDialogTitle>
                        <AlertDialogDescription>
                          การดำเนินการนี้ไม่สามารถยกเลิกได้ บัญชีและข้อมูลทั้งหมดของคุณจะถูกลบอย่างถาวร รวมถึงบอท, การตั้งค่าการแจ้งเตือน และประวัติการเทรดทั้งหมด
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          ลบบัญชี
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
