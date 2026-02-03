'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(formData: FormData) {
  const supabase = await createClient()

  // Verify current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: currentUserProfile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  
  if (currentUserProfile?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const targetUserId = formData.get('userId') as string
  const newRole = formData.get('newRole') as 'admin' | 'artist' | 'label'

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', targetUserId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/users')
}
