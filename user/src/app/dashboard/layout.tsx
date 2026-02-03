import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Toaster } from "@/components/ui/sonner"
import Sidebar from '@/components/sidebar'

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

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar user={user} signOut={signOut} />

      {/* Main Content - Cinematic Midnight */}
      <div className="flex-1 bg-zinc-950 p-10 text-white overflow-y-auto overflow-x-hidden relative">
        <div className="space-y-12">
          {children}
        </div>
      </div>
      <Toaster />
    </div>
  )
}
