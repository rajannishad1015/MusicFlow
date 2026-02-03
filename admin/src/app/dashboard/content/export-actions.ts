'use server'

import { createClient } from '@/utils/supabase/server'

export async function getExportData(status: string = 'approved') {
  const supabase = await createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Access Denied')

  // Fetch tracks based on status (or all if not specified? For now let's enforce status to match view)
  const { data: tracks, error } = await supabase
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

  if (error) throw new Error(error.message)
  return tracks
}
