import { createClient } from '@/utils/supabase/server'
import ContentList from './content-list'
import ExportButton from './export-button'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link'

export default async function ContentPage({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = await createClient()
  const status = (await searchParams).status || 'pending'

  const { data: tracks } = await supabase
    .from('tracks')
    .select(`
        *,
        albums (
            title,
            upc,
            release_date,
            type,
            cover_art_url,
            label_name,
            primary_artist,
            featuring_artist,
            genre,
            sub_genre,
            original_release_date,
            p_line,
            c_line,
            courtesy_line,
            description,
            target_platforms,
            primary_artist_spotify_id,
            primary_artist_apple_id,
            featuring_artist_spotify_id,
            featuring_artist_apple_id
        ),
        profiles (
            artist_name,
            email,
            full_name
        )
    `)
    .eq('status', status)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Content Review</h1>
          <p className="text-zinc-500 font-medium tracking-wide text-sm uppercase">Manage & Moderate Track Submissions</p>
        </div>
        <ExportButton status={status} />
      </div>

      <div className="flex space-x-1 p-1 bg-zinc-900/50 backdrop-blur-md rounded-xl border border-white/5 w-fit">
         {['pending', 'approved', 'rejected', 'draft'].map((tab) => (
             <Link key={tab} href={`/dashboard/content?status=${tab}`}>
                 <div className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${status === tab ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
                     {tab}
                 </div>
             </Link>
         ))}
      </div>

      <ContentList initialTracks={tracks || []} status={status} />
    </div>
  )
}
