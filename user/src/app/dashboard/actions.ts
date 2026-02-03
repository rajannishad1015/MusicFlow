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

  // 3. Create Transaction Record
  const { error: txError } = await supabase
    .from('transactions')
    .insert({
        user_id: user.id,
        amount: -amount, // Debit
        type: 'withdrawal',
        description: 'Withdrawal Request (Pending)',
        status: 'pending'
    })

  if (txError) console.error("Failed to log transaction:", txError)

  const { error: insertError } = await supabase
    .from('payout_requests')
    .insert({
        user_id: user.id,
        amount: amount,
        status: 'pending'
    })

  if (insertError) {
      console.error("Failed to create payout request", insertError)
      throw new Error("Failed to create request")
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function requestTakedown(trackId: string, reason: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Unauthorized')

    if (!reason || reason.trim().length < 5) {
        throw new Error("Please provide a valid reason for the takedown request.")
    }

    // Verify ownership and status
    const { data: track } = await supabase
        .from('tracks')
        .select('id, status, artist_id')
        .eq('id', trackId)
        .single()

    if (!track) throw new Error('Track not found')
    if (track.artist_id !== user.id) throw new Error('Unauthorized')
    
    if (track.status !== 'approved') {
        throw new Error('Only approved tracks can be taken down')
    }

    const { error } = await supabase
        .from('tracks')
        .update({ 
            status: 'takedown_requested',
            takedown_reason: reason 
        })
        .eq('id', trackId)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard')
    return { success: true }
}

export async function deleteTrack(trackId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Unauthorized')

    // Verify ownership and status
    const { data: track } = await supabase
        .from('tracks')
        .select('id, status, artist_id')
        .eq('id', trackId)
        .single()

    if (!track) throw new Error('Track not found')
    if (track.artist_id !== user.id) throw new Error('Unauthorized')
    
    if (track.status !== 'draft' && track.status !== 'rejected') {
        throw new Error('Only draft or rejected tracks can be deleted')
    }

    console.log('Attempting to delete track:', trackId)
    const { error } = await supabase
        .from('tracks')
        .delete()
        .eq('id', trackId)

    if (error) {
        console.error('Delete error:', error)
        throw new Error(error.message)
    }
    console.log('Track deleted successfully')

    revalidatePath('/dashboard')
    return { success: true }
}
