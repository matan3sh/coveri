'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { UserNav } from '@/components/user-nav'
import { useUser } from '@clerk/nextjs'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const { isSignedIn, isLoaded } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link
            className="mr-6 flex items-center space-x-3 text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-foreground/80 group"
            href="/"
          >
            <div className="relative flex items-center">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 opacity-30 blur transition duration-200 group-hover:opacity-40 group-hover:blur-md" />
              <div className="relative flex items-center bg-background/95 rounded-lg p-1">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <span className="relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                Coveri
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
            </span>
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
