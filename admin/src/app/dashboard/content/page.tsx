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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Content Review</h1>
        <ExportButton status={status} />
      </div>

      <div className="flex space-x-2 border-b">
         {['pending', 'approved', 'rejected', 'draft'].map((tab) => (
             <Link key={tab} href={`/dashboard/content?status=${tab}`}>
                 <div className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${status === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                     {tab.charAt(0).toUpperCase() + tab.slice(1)}
                 </div>
             </Link>
         ))}
      </div>

      <ContentList initialTracks={tracks || []} status={status} />
    </div>
  )
}
