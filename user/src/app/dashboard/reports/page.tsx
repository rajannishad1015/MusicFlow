import { createClient } from '@/utils/supabase/server'
import AnalyticsClient from './analytics-client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, TrendingUp, History } from 'lucide-react'
import ExportButton from './export-button'
import ActivityList from './activity-list'

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Log in required</div>
  }

  // Fetch Revenue Logs
  const { data: revenueData } = await supabase
    .from('revenue_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true }) // ASC for chart processing

  // Calculate Total Earnings
  const totalEarnings = revenueData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0
  
  // Calculate This Month Earnings
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  const thisMonthEarnings = revenueData?.reduce((acc, curr) => {
    const d = new Date(curr.created_at)
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        return acc + Number(curr.amount)
    }
    return acc
  }, 0) || 0

  // Reverse logs for Activity Feed (Newest First)
  // revenueData is currently ASC for charts.
  // We can just slice the end or reverse a copy for the list.
  const recentLogs = [...(revenueData || [])].reverse().slice(0, 10)

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Analytics & Reports</h1>
            <p className="text-zinc-500">Detailed insights into your performance and earnings.</p>
        </div>
        <ExportButton data={revenueData || []} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-emerald-900/50 to-zinc-950 border-emerald-500/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Total Earnings</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white tracking-tight">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-emerald-400/60 font-medium mt-1">+20.1% lifetime growth</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-900/50 to-zinc-950 border-indigo-500/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Monthly Revenue</CardTitle>
            <div className="p-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white tracking-tight">${thisMonthEarnings.toFixed(2)}</div>
            <p className="text-xs text-indigo-400/60 font-medium mt-1">Current billing cycle</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
         <div className="lg:col-span-2">
            <AnalyticsClient revenueData={revenueData || []} />
         </div>
         
         <div className="lg:col-span-1">
             <Card className="bg-zinc-950 border-zinc-800 shadow-xl h-full flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-zinc-400" />
                        <CardTitle className="text-zinc-100">Recent Activity</CardTitle>
                    </div>
                    <CardDescription className="text-zinc-400">Latest financial transactions.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <ActivityList logs={recentLogs} />
                </CardContent>
             </Card>
         </div>
      </div>
    </div>
  )
}
