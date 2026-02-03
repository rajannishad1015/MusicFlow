'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function adjustUserBalance(formData: FormData) {
  const supabase = await createClient()
  
  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (adminProfile?.role !== 'admin') throw new Error('Access Denied')

  const userId = formData.get('userId') as string
  const type = formData.get('type') as string // 'credit' or 'debit'
  let amount = parseFloat(formData.get('amount') as string)
  const description = formData.get('description') as string || 'Manual Adjustment'

  if (!userId || isNaN(amount) || amount <= 0) {
      throw new Error("Invalid input")
  }

  // If debit, make amount negative
  const finalAmount = type === 'debit' ? -amount : amount

  // 1. Update Profile Balance
  const { data: profile, error: fetchError } = await supabase.from('profiles').select('balance').eq('id', userId).single()
  
  if (fetchError) throw new Error("User/Balance not found")

  const currentBalance = Number(profile.balance) || 0
  
  // Prevent negative balance if debiting
  if (type === 'debit' && currentBalance < amount) {
     // Optional: decide if we allow negative balance. For now, lets allow it or throw?
     // Let's allow it but warn? No, usually don't allow wallets to go negative unless necessary.
     // But for manual adjustment, admin might be correcting an error. Let's allow it.
  }

  const newBalance = currentBalance + finalAmount

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ balance: newBalance })
    .eq('id', userId)

  if (updateError) throw new Error(updateError.message)

  // 2. Log Transaction (New System)
  const { error: txError } = await supabase
    .from('transactions')
    .insert({
        user_id: userId,
        amount: finalAmount,
        type: 'adjustment',
        description: description,
        status: 'completed'
    })

  if (txError) console.error("Failed to creat transaction log:", txError)

  revalidatePath('/dashboard/users')
  return { success: true }
}
