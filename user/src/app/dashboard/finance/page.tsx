import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Building2, Pencil, Wallet, ArrowUpRight, ShieldCheck } from 'lucide-react'
import RevenueCard from '@/components/revenue-card'
import BankCard from '@/components/bank-card'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import WithdrawRequestForm from './withdraw-request-form'
import TransactionList from './transaction-list'
import PayoutList from './payout-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RevenueAnalytics from './revenue-analytics'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function FinancePage({ searchParams }: { searchParams: { artistId?: string } }) {
  const awaitedParams = await searchParams
  const artistId = awaitedParams.artistId as string
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Log in required</div>
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, balance, bank_name, account_number, ifsc_code, paypal_email, upi_id')
    .eq('id', user.id)
    .single()

  const isLabel = profile?.role === 'label'

  // Fetch managed artists if Label
  let artistIds: string[] = []
  if (isLabel) {
    const { data: artistList } = await supabase
        .from('profiles')
        .select('id')
        .eq('label_id', user.id)
    artistIds = artistList?.map(a => a.id) || []
  }

  // Setup queries
  let revenueQuery = supabase.from('revenue_logs').select('*, tracks(title)')
  let transQuery = supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(20)
  let payoutQuery = supabase.from('payout_requests').select('*').order('created_at', { ascending: false })

  if (artistId) {
      revenueQuery = revenueQuery.eq('user_id', artistId)
      transQuery = transQuery.eq('user_id', artistId)
      payoutQuery = payoutQuery.eq('user_id', artistId)
  } else if (isLabel) {
      revenueQuery = revenueQuery.in('user_id', artistIds)
      transQuery = transQuery.in('user_id', artistIds)
      payoutQuery = payoutQuery.in('user_id', artistIds)
  } else {
      revenueQuery = revenueQuery.eq('user_id', user.id)
      transQuery = transQuery.eq('user_id', user.id)
      payoutQuery = payoutQuery.eq('user_id', user.id)
  }

  const { data: revenueLogs } = await revenueQuery.order('period', { ascending: true })
  const { data: transactions } = await transQuery
  const { data: payoutRequests } = await payoutQuery

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

  // Format data for charts
  const platformData = Array.from(platformMap.entries()).map(([name, value]) => ({ name, value }))
  const trackData = Array.from(trackMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5) // Top 5
  
  const monthlyData = Array.from(monthlyMap.entries())
    .map(([month, revenue]) => ({ month, revenue }))
    // Note: Assuming date sorting is handled by input order (which is ordered by period) 
    // If not, would need proper date object parsing.
  
  const countryData = Array.from(countryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5) // Top 5 countries

  const calculatedBalance = artistId || !isLabel ? Number(profile?.balance || 0) : revenueLogs?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                    <Wallet className="text-indigo-500" size={32} />
                    Finance Center
                </h1>
                <p className="text-zinc-500 mt-2 font-medium">Manage earnings, payouts, and financial health.</p>
            </div>
            <div className="flex items-center gap-3">
                 <Link href="/dashboard/settings">
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition-all h-10 px-6 font-bold uppercase tracking-wider text-xs">
                        <Pencil size={14} className="mr-2"/> Bank Settings
                    </Button>
                </Link>
            </div>
        </div>

        {/* Top Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <div className="col-span-1 lg:col-span-1 h-full">
                 <RevenueCard 
                    balance={calculatedBalance} 
                    bankDetails={{
                        bankName: profile?.bank_name,
                        accountNumber: profile?.account_number,
                        ifscCode: profile?.ifsc_code,
                        paypalEmail: profile?.paypal_email,
                        upiId: profile?.upi_id
                    }}
                 />
             </div>
             
             <div className="col-span-1 lg:col-span-1 h-full">
                <BankCard 
                    bankName={profile?.bank_name}
                    accountNumber={profile?.account_number}
                    ifscCode={profile?.ifsc_code}
                />
             </div>
             
             {/* Quick Actions / Summary Card */}
             <div className="col-span-1 lg:col-span-1 hidden lg:block">
                 <Card className="h-full bg-zinc-950/50 border-white/5 border-dashed flex flex-col justify-center items-center text-center p-6 space-y-4">
                     <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
                         <ShieldCheck size={24} />
                     </div>
                     <div>
                         <h3 className="text-white font-bold">Secure Payouts</h3>
                         <p className="text-xs text-zinc-500 mt-1 max-w-[200px] mx-auto">All transactions are encrypted and processed via secure gateways.</p>
                     </div>
                     <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> System Operational
                     </div>
                 </Card>
             </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="transactions" className="w-full">
            <div className="flex items-center justify-between mb-6">
                 <TabsList className="bg-zinc-950/50 border border-white/5 p-1 h-12 rounded-lg">
                    <TabsTrigger value="transactions" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 font-bold text-xs uppercase tracking-wider px-6 h-10 rounded-md transition-all">Transactions</TabsTrigger>
                    <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-zinc-500 font-bold text-xs uppercase tracking-wider px-6 h-10 rounded-md transition-all">Analytics</TabsTrigger>
                    <TabsTrigger value="payouts" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 font-bold text-xs uppercase tracking-wider px-6 h-10 rounded-md transition-all">Payouts</TabsTrigger>
                </TabsList>
            </div>
            
            <TabsContent value="analytics" className="mt-0 focus-visible:ring-0 outline-none">
                <RevenueAnalytics data={{ platformData, trackData, monthlyData, countryData }} />
            </TabsContent>
            
            <TabsContent value="transactions" className="mt-0 focus-visible:ring-0 outline-none">
                <Card className="bg-zinc-950 border-white/10 shadow-2xl overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-white/[0.01]">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-white">Recent Activity</CardTitle>
                                <CardDescription className="text-zinc-500 mt-1 text-xs">History of royalties and adjustments.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="hidden text-xs uppercase font-bold tracking-wider text-zinc-500 hover:text-white">Export CSV</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <TransactionList transactions={transactions || []} />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="payouts" className="mt-0 focus-visible:ring-0 outline-none">
                 <Card className="bg-zinc-950 border-white/10 shadow-2xl overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-white/[0.01]">
                         <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-white">Withdrawal History</CardTitle>
                                <CardDescription className="text-zinc-500 mt-1 text-xs">Track your payout requests and status.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <PayoutList payouts={payoutRequests || []} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        {/* Floating Withdraw Button (Mobile) - Optional or just rely on the top button */}
        <div className="fixed bottom-6 right-6 md:hidden">
            <WithdrawRequestForm 
                currentBalance={calculatedBalance}
                bankDetails={{
                    bankName: profile?.bank_name,
                    accountNumber: profile?.account_number,
                    ifscCode: profile?.ifsc_code,
                    paypalEmail: profile?.paypal_email,
                    upiId: profile?.upi_id
                }}
            />
        </div>
    </div>
  )
}
