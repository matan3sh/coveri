'use client'

import { DatabaseUser, UserService } from '@/lib/services/user-service'
import { useUser } from '@clerk/nextjs'
import { createContext, useContext, useEffect, useState } from 'react'

interface UserContextType {
  user: DatabaseUser | null
  isLoading: boolean
  error: Error | null
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  error: null,
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded: isClerkLoaded } = useUser()
  const [user, setUser] = useState<DatabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function syncUser() {
      if (!isClerkLoaded) {
        setIsLoading(false)
        return
      }

      try {
        const dbUser = await UserService.syncUser()
        setUser(dbUser)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to sync user'))
      } finally {
        setIsLoading(false)
      }
    }

    syncUser()
  }, [isClerkLoaded])

  return (
    <UserContext.Provider value={{ user, isLoading, error }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}
