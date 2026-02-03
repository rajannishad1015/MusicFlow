import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Users, Music, Settings, LogOut, DollarSign, LifeBuoy } from 'lucide-react'
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

    // Sign out action
    async function signOut() {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col flex-shrink-0">
        <div className="mb-8">
          <h1 className="text-xl font-bold">MusicFlow Admin</h1>
        </div>
        
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
          <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/dashboard/users" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <Users size={20} />
            Users
          </Link>
           <Link href="/dashboard/content" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <Music size={20} />
            Content Review
          </Link>
           <Link href="/dashboard/settings" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <Settings size={20} />
            Settings
          </Link>
          <Link href="/dashboard/payouts" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <DollarSign size={20} />
            Payouts
          </Link>
          <Link href="/dashboard/support" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <LifeBuoy size={20} />
            Help & Support
          </Link>
        </nav>

        <form action={signOut} className="mt-auto pt-4 border-t border-gray-800">
            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-red-500 hover:text-white" type="submit">
                <LogOut size={20} />
                Sign Out
            </Button>
        </form>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-8 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-y-auto">
        {children}
        <Toaster />
      </div>
    </div>
  )
}
