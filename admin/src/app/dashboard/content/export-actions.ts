'use server'

import { createClient } from '@/utils/supabase/server'

export async function getExportData(
    status: string = 'approved',
    filters?: { startDate?: string, endDate?: string, genre?: string }
) {
  const supabase = await createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Access Denied')

  // Build Query
  let query = supabase
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

  if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate)
  }
  
  if (filters?.endDate) {
      // Add one day to include the end date fully (since date inputs are YYYY-MM-DD 00:00:00)
      const nextDay = new Date(filters.endDate)
      nextDay.setDate(nextDay.getDate() + 1)
      query = query.lt('created_at', nextDay.toISOString())
  }

  if (filters?.genre && filters.genre.trim() !== '') {
      query = query.ilike('genre', `%${filters.genre.trim()}%`)
  }

  const { data: tracks, error } = await query

  if (error) throw new Error(error.message)
  return tracks
}
