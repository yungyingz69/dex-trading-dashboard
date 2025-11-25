'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-xl">เกิดข้อผิดพลาด</CardTitle>
          <CardDescription>
            ขออภัย เกิดข้อผิดพลาดบางอย่าง กรุณาลองอีกครั้ง
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <div className="rounded-lg bg-muted p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Error Details (Development Only)
              </p>
              <code className="block overflow-auto text-xs text-red-500">
                {error.message}
              </code>
              {error.digest && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              ลองอีกครั้ง
            </Button>
            <Button
              onClick={() => window.location.href = '/dashboard'}
              variant="outline"
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              กลับหน้าแรก
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
