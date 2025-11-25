'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Cell, Pie, PieChart, Legend } from 'recharts'

const assetData = [
  { name: 'ETH', value: 45000, color: '#627EEA' },
  { name: 'BTC', value: 25000, color: '#F7931A' },
  { name: 'SOL', value: 15000, color: '#00FFA3' },
  { name: 'USDT', value: 8000, color: '#26A17B' },
  { name: 'Others', value: 2420, color: '#8884d8' },
]

const chartConfig = {
  value: {
    label: 'Value',
  },
  ETH: {
    label: 'Ethereum',
    color: '#627EEA',
  },
  BTC: {
    label: 'Bitcoin',
    color: '#F7931A',
  },
  SOL: {
    label: 'Solana',
    color: '#00FFA3',
  },
  USDT: {
    label: 'Tether',
    color: '#26A17B',
  },
  Others: {
    label: 'Others',
    color: '#8884d8',
  },
} satisfies ChartConfig

export function AssetAllocation() {
  const total = assetData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-6 sm:pt-0">
        <ChartContainer config={chartConfig} className="mx-auto h-[180px] sm:h-[250px]">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                />
              }
            />
            <Pie
              data={assetData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {assetData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ChartContainer>

        <div className="mt-4 space-y-2">
          {assetData.map((asset) => (
            <div key={asset.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: asset.color }}
                />
                <span className="text-sm">{asset.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">
                  ${asset.value.toLocaleString()}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({((asset.value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
