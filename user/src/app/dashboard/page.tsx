import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { UploadCloud } from 'lucide-react'
import TrackList from './track-list'
import RevenueCard from '@/components/revenue-card'
import DashboardHome from '@/components/dashboard-home'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: tracks } = await supabase
    .from('tracks')
    .select('*, albums(cover_art_url, title)')
    .eq('artist_id', user?.id)
    .order('created_at', { ascending: false })

  // 1. Fetch Balance
  const { data: profile } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', user?.id)
    .single()

  // 2. Fetch Support Tickets Stats
  const { count: ticketCount } = await supabase
    .from('tickets')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)
    .in('status', ['open', 'in_progress'])

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

  const stats = {
      total: totalReleases,
      approved: approvedCount,
      revenue: Number(profile?.balance || 0),
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
                        Good day, {user?.user_metadata?.full_name?.split(' ')[0] || 'Artist'}
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

            <DashboardHome user={user} tracks={allTracks} stats={stats} />
        </div>
    )
}
