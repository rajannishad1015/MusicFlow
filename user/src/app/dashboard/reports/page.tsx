import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, TrendingUp, History } from 'lucide-react'
import ExportButton from './export-button'
import ActivityList from './activity-list'
import RevenueAnalytics from '../finance/revenue-analytics'
import { format } from 'date-fns'

export default async function ReportsPage({ searchParams }: { searchParams: { artistId?: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const awaitedParams = await searchParams
  const artistId = awaitedParams.artistId as string

  if (!user) {
    return <div>Log in required</div>
  }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, balance')
        .eq('id', user.id)
        .single()

    const isLabel = profile?.role === 'label'
    
    let query = supabase
        .from('revenue_logs')
        .select('*, tracks(title)')
        .order('created_at', { ascending: false })

    if (artistId) {
        query = query.eq('user_id', artistId)
    } else if (isLabel) {
        // Fetch all artists under this label
        const { data: artistList } = await supabase
            .from('profiles')
            .select('id')
            .eq('label_id', user.id)
        
        const artistIds = artistList?.map(a => a.id) || []
        query = query.in('user_id', artistIds)
    } else {
        query = query.eq('user_id', user.id)
    }

    const { data: revenueLogs } = await query

  // Process data for charts
  const platformMap = new Map<string, number>()
  const trackMap = new Map<string, number>()
  const monthlyMap = new Map<string, number>()
  const countryMap = new Map<string, number>()

  revenueLogs?.forEach(log => {
      const amount = Number(log.amount)
      
      // Platform logic
      platformMap.set(log.platform, (platformMap.get(log.platform) || 0) + amount)

      // Track logic
      const trackTitle = (log.tracks as any)?.title || 'Unknown Track'
      trackMap.set(trackTitle, (trackMap.get(trackTitle) || 0) + amount)

      // Monthly logic
      const monthStr = format(new Date(log.period), 'MMM yyyy')
      monthlyMap.set(monthStr, (monthlyMap.get(monthStr) || 0) + amount)

      // Country logic
      const country = log.country_code || 'US'
      countryMap.set(country, (countryMap.get(country) || 0) + amount)
  })

  const platformData = Array.from(platformMap.entries()).map(([name, value]) => ({ name, value }))
  
  const trackData = Array.from(trackMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const monthlyData = Array.from(monthlyMap.entries())
    .map(([month, revenue]) => ({ month, revenue }))

  const countryData = Array.from(countryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  // Calculate Total Earnings
  let totalEarnings = 0
  if (!artistId && isLabel) {
      // Aggregated balance for labels is tricky if we want live balance. 
      // For now, let's sum the revenue_logs.
      totalEarnings = revenueLogs?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0
  } else {
      // Fetch specific profile balance
      const balanceId = artistId || user.id
      const { data: bProfile } = await supabase.from('profiles').select('balance').eq('id', balanceId).single()
      totalEarnings = Number(bProfile?.balance || 0)
  }
  
  // Calculate This Month Earnings
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  const thisMonthEarnings = revenueLogs?.reduce((acc, curr) => {
    const d = new Date(curr.period)
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        return acc + Number(curr.amount)
    }
    return acc
  }, 0) || 0

  const recentLogs = (revenueLogs || []).slice(0, 10)

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-white lg:text-5xl">Analytics</h1>
            <p className="text-zinc-500 font-medium">Deep insights into your global streams and revenue.</p>
        </div>
        <div className="flex items-center gap-3">
            <ExportButton data={revenueLogs || []} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden bg-zinc-950/40 backdrop-blur-xl border-white/5 shadow-2xl group">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500/50 to-emerald-400/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black text-emerald-500/80 uppercase tracking-[0.2em]">Total Balance</CardTitle>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white tracking-tight tabular-nums">
              ${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-2">
                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-wider">Available for payout</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-zinc-950/40 backdrop-blur-xl border-white/5 shadow-2xl group">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500/50 to-indigo-400/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black text-indigo-500/80 uppercase tracking-[0.2em]">Monthly Revenue</CardTitle>
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white tracking-tight tabular-nums">
              ${thisMonthEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-2">
                <div className="h-1 w-1 rounded-full bg-indigo-500" />
                <p className="text-[10px] text-indigo-500/60 font-black uppercase tracking-wider">Current billing cycle</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
         <div className="lg:col-span-2 space-y-8">
            <RevenueAnalytics data={{ platformData, trackData, monthlyData, countryData }} />
         </div>
         
         <div className="lg:col-span-1">
             <Card className="bg-zinc-950/40 backdrop-blur-3xl border-white/5 shadow-2xl h-full flex flex-col overflow-hidden">
                <CardHeader className="bg-white/[0.02] border-b border-white/5 py-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                              <History className="h-4 w-4 text-indigo-400" />
                              <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-100">Live Activity</CardTitle>
                          </div>
                          <CardDescription className="text-zinc-500 text-xs">Real-time ledger updates.</CardDescription>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 pt-4">
                    <ActivityList logs={recentLogs} />
                </CardContent>
             </Card>
         </div>
      </div>
    </div>
  )
}
