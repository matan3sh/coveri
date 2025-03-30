'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { UserNav } from '@/components/user-nav'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'

export function Header() {
  const { isSignedIn, isLoaded } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link
            className="mr-6 flex items-center space-x-2 text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-foreground/80"
            href="/"
          >
            Coveri
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {!isLoaded ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : isSignedIn ? (
              <UserNav />
            ) : (
              <Button
                variant="default"
                size="sm"
                className="h-8 px-4 text-sm font-medium"
                asChild
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
