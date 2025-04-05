'use client'

import { cn } from '@/lib/utils'
import { CreditCard, FileText, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sidebarItems = [
  {
    title: 'List',
    href: '/dashboard',
    icon: FileText,
  },
  {
    title: 'Create',
    href: '/dashboard/create',
    icon: PlusCircle,
  },
  {
    title: 'Plan',
    href: '/dashboard/plan',
    icon: CreditCard,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="h-full w-64 border-r bg-background">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-6 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
