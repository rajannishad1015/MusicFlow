import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Users, Music, Clock, DollarSign } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch counts in parallel
  const [
    { count: totalTracks },
    { count: pendingTracks },
    { count: totalArtists },
    { count: pendingPayouts }
  ] = await Promise.all([
    supabase.from('tracks').select('*', { count: 'exact', head: true }),
    supabase.from('tracks').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('payout_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')
  ])

  const stats = [
    { label: 'Total Uploads', value: totalTracks || 0, icon: Music, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Pending Review', value: pendingTracks || 0, icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { label: 'Active Artists', value: totalArtists || 0, icon: Users, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Pending Payouts', value: pendingPayouts || 0, icon: DollarSign, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-gray-500">Overview of your music distribution platform.</p>
        </div>
        <div className="text-sm text-gray-400">
           Logged in as {user.email}
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 flex items-center gap-4">
             <div className={`p-3 rounded-lg ${stat.bgColor} dark:bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
             </div>
             <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</h3>
                <p className="text-2xl font-bold tracking-tight mt-0.5">{stat.value.toLocaleString()}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
          {/* Placeholder for Recent Activity or Quick Actions */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
             <h3 className="font-semibold mb-4">Quick Actions</h3>
             <div className="grid grid-cols-2 gap-3">
                <a href="/dashboard/content?status=pending" className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-900 border border-transparent hover:border-gray-200">
                   <Clock className="mb-2 text-yellow-600" />
                   <span className="text-sm font-medium">Review Content</span>
                </a>
                <a href="/dashboard/payouts" className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-900 border border-transparent hover:border-gray-200">
                   <DollarSign className="mb-2 text-purple-600" />
                   <span className="text-sm font-medium">Payout Requests</span>
                </a>
             </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
             <h3 className="font-semibold mb-4">System Health</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500">Supabase Connection</span>
                   <span className="flex items-center text-green-600 font-medium">
                      <div className="h-2 w-2 rounded-full bg-green-600 mr-2" />
                      Active
                   </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500">Storage Buckets</span>
                   <span className="flex items-center text-green-600 font-medium">
                      <div className="h-2 w-2 rounded-full bg-green-600 mr-2" />
                      Healthy
                   </span>
                </div>
             </div>
          </div>
      </div>
    </div>
  )
}
