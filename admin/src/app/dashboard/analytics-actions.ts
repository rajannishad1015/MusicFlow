'use server'

import { createClient } from '@/utils/supabase/server'
import { subDays, format } from 'date-fns'

export async function getAnalyticsData() {
  const supabase = await createClient()
  const thirtyDaysAgo = subDays(new Date(), 30).toISOString()

  // 1. Fetch Tracks for Upload Trends & Genre Distribution
  const { data: tracks, error: tracksError } = await supabase
    .from('tracks')
    .select('created_at, genre')
    .gte('created_at', thirtyDaysAgo)
    .order('created_at', { ascending: true })

  if (tracksError) throw new Error(tracksError.message)

  // 2. Fetch Profiles for User Growth
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('created_at, role')
    .gte('created_at', thirtyDaysAgo)
    .eq('role', 'artist') // Only count artists usually
    .order('created_at', { ascending: true })

  if (profilesError) throw new Error(profilesError.message)

  // --- process Upload Trends (Daily) ---
  const uploadTrendsMap = new Map<string, number>()
  // Initialize last 30 days with 0
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'MMM dd')
    uploadTrendsMap.set(date, 0)
  }
  
  tracks?.forEach(track => {
    const date = format(new Date(track.created_at), 'MMM dd')
    if (uploadTrendsMap.has(date)) {
      uploadTrendsMap.set(date, (uploadTrendsMap.get(date) || 0) + 1)
    }
  })

  const uploadTrends = Array.from(uploadTrendsMap.entries()).map(([date, count]) => ({
    date,
    uploads: count
  }))

  // --- Process User Growth (Daily) ---
  const userGrowthMap = new Map<string, number>()
  for (let i = 29; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'MMM dd')
      userGrowthMap.set(date, 0)
  }

  profiles?.forEach(profile => {
      const date = format(new Date(profile.created_at), 'MMM dd')
      if (userGrowthMap.has(date)) {
          userGrowthMap.set(date, (userGrowthMap.get(date) || 0) + 1)
      }
  })

  const userGrowth = Array.from(userGrowthMap.entries()).map(([date, count]) => ({
      date,
      users: count
  }))

  // --- Process Genre Distribution ---
  const genreMap = new Map<string, number>()
  tracks?.forEach(track => {
      const genre = track.genre || 'Unknown'
      genreMap.set(genre, (genreMap.get(genre) || 0) + 1)
  })

  // Sort by count and take top 5, group rest as "Other"
  const sortedGenres = Array.from(genreMap.entries())
      .sort((a, b) => b[1] - a[1])
  
  let genreDistribution = sortedGenres.slice(0, 5).map(([name, value]) => ({ name, value }))
  
  const otherCount = sortedGenres.slice(5).reduce((acc, curr) => acc + curr[1], 0)
  if (otherCount > 0) {
      genreDistribution.push({ name: 'Other', value: otherCount })
  }

  return {
    uploadTrends,
    userGrowth,
    genreDistribution
  }
}
