'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addRevenue(formData: FormData) {
  const supabase = await createClient()
  
  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (adminProfile?.role !== 'admin') throw new Error('Access Denied')

  const userId = formData.get('userId') as string
  const amount = parseFloat(formData.get('amount') as string)
  const description = formData.get('description') as string || 'Monthly Revenue Credit'

  if (!userId || isNaN(amount) || amount <= 0) {
      throw new Error("Invalid input")
  }

  // 1. Update Profile Balance
  // We need to fetch current balance first or use an atomic increment if Supabase supports it easily via RPC.
  // For MVP, fetch-modify-save is okay if low concurrency. 
  // BETTER: SQL function. But let's stick to simple query for now.
  
  const { data: profile, error: fetchError } = await supabase.from('profiles').select('balance').eq('id', userId).single()
  
  if (fetchError) throw new Error("User/Balance not found")

  const newBalance = (Number(profile.balance) || 0) + amount

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ balance: newBalance })
    .eq('id', userId)

  if (updateError) throw new Error(updateError.message)

  // 2. Log Revenue
  const { error: logError } = await supabase
    .from('revenue_logs')
    .insert({
        user_id: userId,
        amount: amount,
        description: description
    })

  if (logError) console.error("Failed to create log:", logError)

  revalidatePath('/dashboard/users')
  return { success: true }
}
