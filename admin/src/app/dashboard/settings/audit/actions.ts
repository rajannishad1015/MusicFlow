'use server'

import { createClient } from '@/utils/supabase/server'

export async function getAuditLogs() {
  const supabase = await createClient()

  const { data: logs, error } = await supabase
    .from('admin_activity_logs')
    .select(`
      *,
      admin:profiles!admin_id (
        full_name,
        email,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100) // Limit to last 100 actions for now

  if (error) {
    console.error('Error fetching logs:', error)
    return []
  }

  return logs
}
