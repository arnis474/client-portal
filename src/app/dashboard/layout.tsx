import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">Sidebar</aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
