'use client'

import { useState, useCallback } from 'react'

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

interface ToastOptions {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { id, ...options }

    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)

    // For now, also show alert for visibility (since we don't have a toast UI)
    if (options.variant === 'destructive') {
      console.error(options.title, options.description)
    } else {
      console.log(options.title, options.description)
    }

    return { id, dismiss: () => setToasts((prev) => prev.filter((t) => t.id !== id)) }
  }, [])

  const dismiss = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId))
  }, [])

  return {
    toast,
    toasts,
    dismiss,
  }
}
