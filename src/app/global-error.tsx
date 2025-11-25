'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
          <div className="w-full max-w-lg rounded-lg border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h1 className="mb-2 text-xl font-bold text-white">เกิดข้อผิดพลาดร้ายแรง</h1>
              <p className="text-gray-400">
                ขออภัย แอปพลิเคชันเกิดข้อผิดพลาด กรุณาลองอีกครั้ง
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 rounded-lg bg-gray-800 p-3">
                <p className="mb-2 text-xs font-medium text-gray-400">
                  Error Details (Development Only)
                </p>
                <code className="block overflow-auto text-xs text-red-400">
                  {error.message}
                </code>
                {error.digest && (
                  <p className="mt-2 text-xs text-gray-500">
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={reset}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                <RefreshCw className="h-4 w-4" />
                ลองอีกครั้ง
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
              >
                กลับหน้าแรก
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
