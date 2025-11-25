import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  description?: string
}

export function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  description,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2 sm:p-6 sm:pb-2">
        <CardTitle className="text-xs font-medium sm:text-sm">{title}</CardTitle>
        <Icon className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
        <div className="text-lg font-bold sm:text-2xl">{value}</div>
        {change && (
          <p
            className={cn(
              'text-xs',
              changeType === 'positive' && 'text-green-500',
              changeType === 'negative' && 'text-red-500',
              changeType === 'neutral' && 'text-muted-foreground'
            )}
          >
            {change}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
