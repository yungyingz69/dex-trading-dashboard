import {
  LayoutDashboard,
  Bot,
  Wallet,
  Bell,
  Settings,
  TrendingUp,
  MessageSquare,
} from 'lucide-react'

export const navigation = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Bots',
    href: '/bots',
    icon: Bot,
  },
  {
    title: 'Portfolio',
    href: '/portfolio',
    icon: Wallet,
  },
  {
    title: 'Alerts',
    href: '/alerts',
    icon: Bell,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: TrendingUp,
  },
  {
    title: 'AI Assistant',
    href: '/ai',
    icon: MessageSquare,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]
