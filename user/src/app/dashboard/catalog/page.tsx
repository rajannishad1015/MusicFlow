import { createClient } from '@/utils/supabase/server'
import CatalogClient from './catalog-client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default async function CatalogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: tracks } = await supabase
    .from('tracks')
    .select('*, albums(cover_art_url, title)')
    .eq('artist_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Discography Manager</h1>
                <p className="text-zinc-500 font-medium tracking-wide text-xs uppercase">Master Delivery Ledger & Metadata Control</p>
            </div>
            <div className="flex items-center gap-3">
                 <div className="hidden md:flex flex-col items-end mr-4">
                    <span className="text-[10px] uppercase font-black text-zinc-600 tracking-widest">Total Assets</span>
                    <span className="text-xl font-black text-white tabular-nums leading-none">{tracks?.length || 0}</span>
                 </div>
                 <Link href="/dashboard/upload">
                    <Button className="bg-white text-black hover:bg-indigo-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] font-black text-xs uppercase tracking-[0.2em] rounded-full px-6 h-10">
                        New Release
                    </Button>
                 </Link>
            </div>
        </div>

        <CatalogClient initialTracks={tracks || []} />
    </div>
  )
}
