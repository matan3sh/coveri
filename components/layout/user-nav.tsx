'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useClerk, UserButton, useUser } from '@clerk/nextjs'
import { CreditCard, LayoutDashboard } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function UserNav() {
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useClerk()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'h-8 w-8',
                userButtonPopoverCard: 'hidden',
              },
            }}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push('/dashboard')}
          className="cursor-pointer hover:bg-secondary focus:bg-secondary"
        >
          <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-secondary focus:bg-secondary">
          <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Subscription</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut(() => router.push('/'))}
          className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 focus:bg-red-100 dark:focus:bg-red-900/50"
        >
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
