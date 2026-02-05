'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { logAdminAction } from '@/utils/logger'

export async function updateTrackStatus(trackId: string, status: 'approved' | 'rejected', reason?: string) {
  const supabase = await createClient()

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  // Check role (optional, RLS handles it but good for early exit)
  // ...

  // Fetch track details for notification
  const { data: track, error: fetchError } = await supabase
    .from('tracks')
    .select('artist_id, title')
    .eq('id', trackId)
    .single()

  if (fetchError || !track) {
    throw new Error('Track not found')
  }

  const { error } = await supabase
    .from('tracks')
    .update({ 
      status, 
      rejection_reason: status === 'rejected' ? reason : null,
      updated_at: new Date().toISOString()
    })
    .eq('id', trackId)

  if (error) {
    throw new Error(error.message)
  }

  // Send Notification
  if (status === 'rejected') {
    await supabase.from('notifications').insert({
      user_id: track.artist_id,
      type: 'upload_status',
      title: `Action Required: ${track.title}`,
      message: reason || 'Your release has been rejected. Please check the details and resubmit.',
      link: '/dashboard/catalog',
      is_read: false
    })
  } else if (status === 'approved') {
    await supabase.from('notifications').insert({
      user_id: track.artist_id,
      type: 'upload_status',
      title: `Release Approved: ${track.title}`,
      message: 'Congratulations! Your release has been approved and sent to stores.',
      link: '/dashboard/catalog',
      is_read: false
    })
  }

  // Log Action
  await logAdminAction(
    status === 'approved' ? 'APPROVED_TRACK' : 'REJECTED_TRACK',
    'TRACK',
    trackId,
    { reason, title: track.title }
  )

  revalidatePath('/dashboard/content')
}
