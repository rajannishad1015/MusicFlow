import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Users, Music, Clock, DollarSign, LifeBuoy } from 'lucide-react'
import { getAnalyticsData } from './analytics-actions'
import AnalyticsCharts from '@/components/admin/analytics/charts'

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
    { count: pendingPayouts },
    { count: openTickets },
    analyticsData
  ] = await Promise.all([
    supabase.from('tracks').select('*', { count: 'exact', head: true }),
    supabase.from('tracks').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('payout_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    getAnalyticsData()
  ])

  const stats = [
    { label: 'Total Uploads', value: totalTracks || 0, icon: Music, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Pending Review', value: pendingTracks || 0, icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { label: 'Pending Support', value: openTickets || 0, icon: LifeBuoy, color: 'text-rose-600', bgColor: 'bg-rose-50' },
    { label: 'Active Artists', value: totalArtists || 0, icon: Users, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Pending Payouts', value: pendingPayouts || 0, icon: DollarSign, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Command Center</h1>
          <p className="text-zinc-500 font-medium tracking-wide text-sm uppercase">Platform Overview & Metrics</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-full px-4 py-1.5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">System Operational</span>
             </div>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="group relative p-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-all hover:border-white/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10">
             {/* Gradient Glow */}
             <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none`} />
             
             <div className="flex flex-col justify-between h-full">
                 <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl bg-white/5 border border-white/5 text-white group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`h-5 w-5 opacity-80`} />
                    </div>
                 </div>
                 <div>
                    <p className="text-3xl font-black text-white tracking-tight leading-none mb-1">{stat.value.toLocaleString()}</p>
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</h3>
                 </div>
             </div>
          </div>
        ))}
      </div>
      
      {/* Analytics Section */}
      <AnalyticsCharts data={analyticsData} />

      <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Actions */}
          <div className="p-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/5">
             <div className="flex items-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Operational Actions</h3>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <a href="/dashboard/content?status=pending" className="group rounded-xl bg-zinc-900/50 border border-white/5 p-4 hover:bg-white/5 transition-all text-center flex flex-col items-center justify-center gap-3 hover:border-indigo-500/30">
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-indigo-500/20 group-hover:text-indigo-400">
                        <Music className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                   </div>
                   <div className="space-y-0.5">
                        <span className="block text-xs font-bold text-white">Review Content</span>
                        <span className="block text-[10px] text-zinc-500">{pendingTracks || 0} Pending</span>
                   </div>
                </a>
                <a href="/dashboard/support?status=open" className="group rounded-xl bg-zinc-900/50 border border-white/5 p-4 hover:bg-white/5 transition-all text-center flex flex-col items-center justify-center gap-3 hover:border-rose-500/30">
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-rose-500/20 group-hover:text-rose-400">
                        <LifeBuoy className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                   </div>
                   <div className="space-y-0.5">
                        <span className="block text-xs font-bold text-white">Support Tickets</span>
                        <span className="block text-[10px] text-zinc-500">{openTickets || 0} Open</span>
                   </div>
                </a>
                <a href="/dashboard/payouts" className="group rounded-xl bg-zinc-900/50 border border-white/5 p-4 hover:bg-white/5 transition-all text-center flex flex-col items-center justify-center gap-3 hover:border-emerald-500/30">
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-emerald-500/20 group-hover:text-emerald-400">
                        <DollarSign className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                   </div>
                   <div className="space-y-0.5">
                        <span className="block text-xs font-bold text-white">Payout Requests</span>
                        <span className="block text-[10px] text-zinc-500">{pendingPayouts || 0} Pending</span>
                   </div>
                </a>
                <a href="/dashboard/users" className="group rounded-xl bg-zinc-900/50 border border-white/5 p-4 hover:bg-white/5 transition-all text-center flex flex-col items-center justify-center gap-3 hover:border-indigo-500/30">
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-indigo-500/20 group-hover:text-indigo-400">
                        <Users className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                   </div>
                   <div className="space-y-0.5">
                        <span className="block text-xs font-bold text-white">Manage Users</span>
                        <span className="block text-[10px] text-zinc-500">Database Access</span>
                   </div>
                </a>
             </div>
          </div>

          <div className="p-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/5">
             <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">System Health</h3>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                   <span className="text-xs font-bold text-zinc-400">Database Connection</span>
                   <span className="flex items-center text-emerald-400 font-bold text-xs uppercase tracking-wider bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      Operational
                   </span>
                </div>
                <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                   <span className="text-xs font-bold text-zinc-400">Storage Buckets</span>
                   <span className="flex items-center text-emerald-400 font-bold text-xs uppercase tracking-wider bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      Healthy
                   </span>
                </div>
                <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                   <span className="text-xs font-bold text-zinc-400">Admin Privileges</span>
                   <span className="flex items-center text-indigo-400 font-bold text-xs uppercase tracking-wider bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                      Verified
                   </span>
                </div>
             </div>
          </div>
      </div>
    </div>
  )
}
