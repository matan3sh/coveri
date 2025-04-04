import { DashboardSidebar } from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-background">
      <DashboardSidebar />
      <main className="flex-1 relative">{children}</main>
    </div>
  )
}
