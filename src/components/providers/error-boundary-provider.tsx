'use client'

import { ReactNode } from 'react'
import { ErrorBoundary } from '@/components/error-boundary'

interface ErrorBoundaryProviderProps {
  children: ReactNode
}

export function ErrorBoundaryProvider({ children }: ErrorBoundaryProviderProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
