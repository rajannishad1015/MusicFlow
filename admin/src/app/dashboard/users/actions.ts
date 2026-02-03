'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  if (profile?.role !== 'admin') throw new Error('Unauthorized')
  return supabase
}

export async function updateUserRole(formData: FormData) {
  const supabase = await checkAdmin()
  const targetUserId = formData.get('userId') as string
  const newRole = formData.get('newRole') as string

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', targetUserId)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/users')
}

export async function updateUserStatus(userId: string, status: string) {
  const supabase = await checkAdmin()
  const { error } = await supabase
    .from('profiles')
    .update({ status: status })
    .eq('id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/users')
}

export async function updateAdminNotes(userId: string, notes: string) {
  const supabase = await checkAdmin()
  const { error } = await supabase
    .from('profiles')
    .update({ admin_notes: notes })
    .eq('id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/users')
}

export async function getUserTracks(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tracks')
    .select(`
        *,
        albums (title, upc, release_date)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getTransactionHistory(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('revenue_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw new Error(error.message)
  return data
}
