import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Users, Music, Settings, LogOut, DollarSign, LifeBuoy, Megaphone } from 'lucide-react'
import { Toaster } from "@/components/ui/sonner"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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

    // Check Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
    
    if (profile?.role !== 'admin') {
        redirect('/login?error=Access Denied')
    }

    // Fetch Pending Tickets Count
    const { count: pendingTickets } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open')

    // Sign out action
    async function signOut() {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

  return (
    <div className="flex h-screen overflow-hidden bg-black selection:bg-indigo-500/30">
        {/* Background Gradients */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent opacity-40 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-3xl" />
        </div>

      {/* Sidebar */}
      <div className="w-64 bg-zinc-950/50 backdrop-blur-xl border-r border-white/10 text-white p-4 flex flex-col flex-shrink-0 z-20 relative">
        <div className="mb-8 px-2 flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="font-black text-xs">A</span>
             </div>
             <div>
                <h1 className="text-sm font-bold tracking-tight">MusicFlow</h1>
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Admin Portal</p>
             </div>
        </div>
        
        <div className="mb-4 px-2">
            <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest mb-2">Main Menu</p>
            <nav className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
                <LayoutDashboard size={16} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                Dashboard
            </Link>
            <Link href="/dashboard/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
                <Users size={16} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                Artists & Users
            </Link>
            <Link href="/dashboard/content" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
                <Music size={16} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                Content Review
            </Link>
            <Link href="/dashboard/payouts" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
                <DollarSign size={16} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                Payouts
            </Link>
            </nav>
        </div>

        <div className="mb-4 px-2">
            <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest mb-2">Management</p>
            <nav className="space-y-1">
                <Link href="/dashboard/support" className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
                    <div className="flex items-center gap-3">
                        <LifeBuoy size={16} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                        Support
                    </div>
                    {(pendingTickets || 0) > 0 && (
                        <span className="bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                            {pendingTickets}
                        </span>
                    )}
                </Link>
                <Link href="/dashboard/announcements" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
                    <Megaphone size={16} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                    Broadcasts
                </Link>
                 <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
                    <Settings size={16} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                    System Settings
                </Link>
            </nav>
        </div>


        <div className="mt-auto px-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                    {user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">Administrator</p>
                    <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                </div>
            </div>
            <form action={signOut}>
                <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-red-500/10 hover:text-red-400 text-zinc-400 h-10 rounded-lg" type="submit">
                    <LogOut size={16} />
                    Secure Logout
                </Button>
            </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-transparent p-0 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <div className="max-w-7xl mx-auto p-8">
            {children}
        </div>
        <Toaster theme="dark" position="bottom-right" />
      </div>
    </div>
  )
}
