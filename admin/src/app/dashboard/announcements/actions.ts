'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendBroadcast(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const message = formData.get('message') as string
  const type = formData.get('type') as 'announcement' | 'message' | 'system'

  if (!title || !message) {
    throw new Error('Title and message are required')
  }

  // Fetch ALL users (or handle in batches if userbase is huge, but for now direct insert is fine)
  // Actually, for a "Broadcast", we might want a 'global_notifications' table that all users subscribe to, 
  // OR we insert individual rows.
  // Given the requirement "jaha admin usker ko kuch bhii msg karega" (admin sends msg to user), 
  // and the notifications table structure (user_id dependent), we have to insert rows for each user.
  // CAUTION: This will be slow for thousands of users.
  // OPTIMIZATION: Created a 'global' user_id or handle clientside?
  // User asked for "Broadcast" / "Announcement".
  // Let's grab all user IDs and insert. 
  
  // 1. Get all user IDs
  const { data: users, error: userError } = await supabase
    .from('profiles') // Assuming profiles table matches auth.users 1:1
    .select('id')
  
  if (userError || !users) {
      throw new Error('Failed to fetch users')
  }

  // 2. Prepare inserts
  const notifications = users.map(user => ({
      user_id: user.id,
      type: type || 'announcement',
      title,
      message,
      is_read: false
  }))

  // 3. Batch Insert
  const { error } = await supabase
    .from('notifications')
    .insert(notifications)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/announcements')
  return { success: true }
}
