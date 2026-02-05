import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Toaster } from "@/components/ui/sonner"
import Sidebar from '@/components/sidebar'
import NotificationCenter from '@/components/notification-center'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        redirect('/login')
    }

    async function signOut() {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

    // Fetch Pending Tickets Count for User
    const { count: pendingTickets } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('artist_id', user.id)
        .neq('status', 'resolved')
        .neq('status', 'closed')

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar user={user} signOut={signOut} pendingTickets={pendingTickets || 0} />

      {/* Main Content - Cinematic Midnight */}
      <div className="flex-1 bg-zinc-950 relative flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-10 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-4">
               {/* Search or Breadcrumbs could go here */}
            </div>
            <div className="flex items-center gap-4">
                <NotificationCenter />
            </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-10 relative">
             <div className="space-y-12">
               {children}
             </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
