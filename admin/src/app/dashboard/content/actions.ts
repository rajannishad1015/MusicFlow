'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTrackStatus(trackId: string, status: 'approved' | 'rejected', reason?: string) {
  const supabase = await createClient()

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  // Check role (optional, RLS handles it but good for early exit)
  // ...

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

  revalidatePath('/dashboard/content')
}
