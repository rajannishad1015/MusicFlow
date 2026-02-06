import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { UploadCloud } from 'lucide-react'
import TrackList from './track-list'
import RevenueCard from '@/components/revenue-card'
import DashboardHome from '@/components/dashboard-home'

export default async function DashboardPage({ searchParams }: { searchParams: { artistId?: string } }) {
  const awaitedParams = await searchParams
  const artistId = awaitedParams.artistId as string
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <div>Log in required</div>
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, balance, artist_name, bank_name, account_number, ifsc_code, paypal_email, upi_id')
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
  let trackQuery = supabase.from('tracks').select('*, albums(cover_art_url, title)')
  let ticketQuery = supabase.from('tickets').select('*', { count: 'exact', head: true }).in('status', ['open', 'in_progress'])

  if (artistId) {
      trackQuery = trackQuery.eq('artist_id', artistId)
      ticketQuery = ticketQuery.eq('user_id', artistId)
  } else if (isLabel) {
      trackQuery = trackQuery.in('artist_id', artistIds)
      ticketQuery = ticketQuery.in('user_id', artistIds)
  } else {
      trackQuery = trackQuery.eq('artist_id', user.id)
      ticketQuery = ticketQuery.eq('user_id', user.id)
  }

  const { data: tracks } = await trackQuery.order('created_at', { ascending: false })
  const { count: ticketCount } = await ticketQuery

  // 3. Aggregate Stats
  const allTracks = tracks || []
  const totalReleases = allTracks.length
  const approvedCount = allTracks.filter(t => t.status === 'approved').length
  
  // Status Counts
  const statusCounts = [
      { status: 'approved', count: approvedCount },
      { status: 'rejected', count: allTracks.filter(t => t.status === 'rejected').length },
      { status: 'pending', count: allTracks.filter(t => t.status === 'pending').length },
      { status: 'draft', count: allTracks.filter(t => t.status === 'draft').length },
  ]

  // Genre Counts (Top 5)
  const genreMap = new Map<string, number>()
  allTracks.forEach(t => {
      if (t.genre) {
          genreMap.set(t.genre, (genreMap.get(t.genre) || 0) + 1)
      }
  })
  
  const genres = Array.from(genreMap.entries())
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Fallback if no genres
  if (genres.length === 0) {
      genres.push({ genre: 'No Data', count: 0 })
  }

  // Calculate Aggregate Revenue
  let totalRevenue = 0
  if (!artistId && isLabel) {
      // For Labelaggregated view, sum up balances of all artists OR just show Label's own if that's where funds go.
      // Usually funds go to the Label's bank details. 
      // But let's check revenue_logs for total earnings if they want "Analytics style" dashboard.
      // For simplicity, let's use the Label's own balance since that's what WithdrawRequest uses.
      totalRevenue = Number(profile?.balance || 0)
  } else if (artistId) {
      const { data: artistProfile } = await supabase.from('profiles').select('balance').eq('id', artistId).single()
      totalRevenue = Number(artistProfile?.balance || 0)
  } else {
      totalRevenue = Number(profile?.balance || 0)
  }

  const stats = {
      total: totalReleases,
      approved: approvedCount,
      revenue: totalRevenue,
      tickets: ticketCount || 0,
      statusCounts,
      genres
  }

    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    })

    return (
        <div className="space-y-10">
            {/* Cinematic Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-white">
                        Good day, {profile?.artist_name || user?.user_metadata?.full_name?.split(' ')[0] || 'Artist'}
                    </h2>
                    <p className="text-sm text-zinc-500 font-bold mt-2 uppercase tracking-[0.3em] ml-1">{currentDate}</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/upload">
                        <Button className="h-12 px-8 bg-white hover:bg-indigo-500 text-black hover:text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Launch Release
                        </Button>
                    </Link>
                </div>
            </div>

            <DashboardHome 
                user={user} 
                tracks={allTracks} 
                stats={stats} 
                bankDetails={{
                    bankName: profile?.bank_name,
                    accountNumber: profile?.account_number,
                    ifscCode: profile?.ifsc_code,
                    paypalEmail: profile?.paypal_email,
                    upiId: profile?.upi_id
                }}
            />
        </div>
    )
}
