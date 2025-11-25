'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Asset } from '@/types'

interface AssetTableProps {
  assets: Asset[]
}

export function AssetTable({ assets }: AssetTableProps) {
  const totalValue = assets.reduce((sum, a) => sum + a.value, 0)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>สินทรัพย์</TableHead>
            <TableHead>Chain</TableHead>
            <TableHead className="text-right">ยอดคงเหลือ</TableHead>
            <TableHead className="text-right">ราคา</TableHead>
            <TableHead className="text-right">มูลค่า</TableHead>
            <TableHead className="text-right">สัดส่วน</TableHead>
            <TableHead className="text-right">24h</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => {
            const percentage = (asset.value / totalValue) * 100
            const isPositive = asset.change24h > 0
            const isNegative = asset.change24h < 0

            return (
              <TableRow key={asset.symbol}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-xs">
                      {asset.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{asset.symbol}</p>
                      <p className="text-xs text-muted-foreground">
                        {asset.name}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{asset.chain}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {asset.balance.toLocaleString()} {asset.symbol}
                </TableCell>
                <TableCell className="text-right">
                  ${asset.price.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${asset.value.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div
                    className={cn(
                      'flex items-center justify-end gap-1',
                      isPositive && 'text-green-500',
                      isNegative && 'text-red-500',
                      !isPositive && !isNegative && 'text-muted-foreground'
                    )}
                  >
                    {isPositive && <TrendingUp className="h-3 w-3" />}
                    {isNegative && <TrendingDown className="h-3 w-3" />}
                    {!isPositive && !isNegative && <Minus className="h-3 w-3" />}
                    <span className="text-sm font-medium">
                      {isPositive ? '+' : ''}
                      {asset.change24h}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
