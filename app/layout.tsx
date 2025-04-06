import { Header } from '@/components/layout/header'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { UserProvider } from '@/lib/contexts/user-context'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Coveri - AI-Powered Cover Letters',
  description: 'Create perfect cover letters with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider>
            <UserProvider>
              <Header />
              {children}
              <Toaster richColors position="top-right" />
            </UserProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
