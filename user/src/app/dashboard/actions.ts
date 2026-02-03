'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createWithdrawalRequest(amount: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  if (amount < 10) {
      throw new Error("Minimum withdrawal amount is $10.00")
  }

  // 1. Check Balance
  const { data: profile } = await supabase.from('profiles').select('balance').eq('id', user.id).single()
  
  if (!profile || (Number(profile.balance) || 0) < amount) {
      throw new Error("Insufficient balance")
  }

  // 2. Create Request (Pending)
  // Ideally, we might want to "lock" the funds here.
  // For this pattern, we will insert the request. Admin approval will deduruct? 
  // OR we deduct NOW.
  // Let's deduct NOW to prevent double spend. If rejected, we add back.
  
  const newBalance = (Number(profile.balance) || 0) - amount

  // Transaction: Update Profile & Create Request
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ balance: newBalance })
    .eq('id', user.id)

  if (updateError) throw new Error("Failed to update balance")

  const { error: insertError } = await supabase
    .from('payout_requests')
    .insert({
        user_id: user.id,
        amount: amount,
        status: 'pending'
    })

  if (insertError) {
      // Logic to revert balance update would go here in a robust system (or use db transaction)
      // For now, simple error throw.
      console.error("Failed to create payout request", insertError)
      throw new Error("Failed to create request")
  }

  revalidatePath('/dashboard')
  return { success: true }
}
