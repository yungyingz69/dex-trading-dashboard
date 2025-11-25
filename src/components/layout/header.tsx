'use client'

import { Bell, Search, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from 'next-themes'

export function Header() {
  const { setTheme, theme } = useTheme()

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4">
      <SidebarTrigger />

      <div className="hidden flex-1 items-center gap-4 sm:flex">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bots, assets..."
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Live Status Indicator */}
        <div className="hidden items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            Live
          </span>
        </div>
        {/* Mobile Live Indicator */}
        <div className="flex items-center sm:hidden">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 text-[10px]">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2">
              <h4 className="mb-2 text-sm font-semibold">Notifications</h4>
              <div className="space-y-2">
                <DropdownMenuItem className="flex flex-col items-start gap-1">
                  <span className="text-sm font-medium">Bot #1 Started</span>
                  <span className="text-xs text-muted-foreground">
                    Grid Bot started successfully
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1">
                  <span className="text-sm font-medium">Price Alert</span>
                  <span className="text-xs text-muted-foreground">
                    ETH reached $3,500
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1">
                  <span className="text-sm font-medium">Trade Executed</span>
                  <span className="text-xs text-muted-foreground">
                    Sold 0.5 ETH at $3,520
                  </span>
                </DropdownMenuItem>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
