import { DashboardSidebar } from '@/components/dashboard/layout/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex bg-background">
      <DashboardSidebar />
      <main className="flex-1 relative">{children}</main>
    </div>
  )
}
