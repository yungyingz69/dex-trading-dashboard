import { FileQuestion, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-4xl font-bold">404</CardTitle>
          <CardDescription className="text-lg">
            ไม่พบหน้าที่คุณต้องการ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            หน้านี้อาจถูกย้ายหรือลบไปแล้ว กรุณาตรวจสอบ URL หรือกลับไปหน้าหลัก
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                ไปหน้าหลัก
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                ย้อนกลับ
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
