'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Area, AreaChart, XAxis, YAxis } from 'recharts'

const chartData = [
  { date: 'Jan', value: 45000 },
  { date: 'Feb', value: 52000 },
  { date: 'Mar', value: 48000 },
  { date: 'Apr', value: 61000 },
  { date: 'May', value: 55000 },
  { date: 'Jun', value: 67000 },
  { date: 'Jul', value: 72000 },
  { date: 'Aug', value: 69000 },
  { date: 'Sep', value: 78000 },
  { date: 'Oct', value: 82000 },
  { date: 'Nov', value: 89000 },
  { date: 'Dec', value: 95420 },
]

const chartConfig = {
  value: {
    label: 'Portfolio Value',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function PortfolioChart() {
  return (
    <Card className="lg:col-span-4">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-6 sm:pt-0">
        <ChartContainer config={chartConfig} className="h-[200px] w-full sm:h-[300px]">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `$${Number(value).toLocaleString()}`
                  }
                />
              }
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              fill="url(#fillValue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
