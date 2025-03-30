'use client'

import { SignOutButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/')
  }, [router])

  return <SignOutButton />
}
