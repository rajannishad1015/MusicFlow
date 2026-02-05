'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function adjustUserBalance(formData: FormData) {
  try {
    const supabase = await createClient()
  
    // Verify Admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized: No user found' }
    
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (adminProfile?.role !== 'admin') return { success: false, error: 'Access Denied: Admin privileges required' }

    const userId = formData.get('userId') as string
    const type = formData.get('type') as string // 'credit' or 'debit'
    let amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string || 'Manual Adjustment'

    if (!userId || isNaN(amount) || amount <= 0) {
        return { success: false, error: "Invalid input: Amount must be positive" }
    }

    // If debit, make amount negative
    const finalAmount = type === 'debit' ? -amount : amount

    // 1. Update Profile Balance
    const { data: profile, error: fetchError } = await supabase.from('profiles').select('balance').eq('id', userId).single()
    
    if (fetchError) return { success: false, error: `User not found: ${fetchError.message}` }

    const currentBalance = Number(profile.balance) || 0
    
    const newBalance = currentBalance + finalAmount

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', userId)

    if (updateError) return { success: false, error: `Balance update failed: ${updateError.message}` }

    // 2. Log Transaction
    const { error: txError } = await supabase
        .from('transactions')
        .insert({
            user_id: userId,
            amount: finalAmount,
            type: 'adjustment',
            description: description,
            status: 'completed'
        })

    if (txError) {
        console.error("Failed to create transaction log:", txError)
        // We don't fail the whole operation if just the log fails, but we should probably warn? 
        // Or just fail. Let's return error to be safe.
        return { success: false, error: `Transaction log failed: ${txError.message}` }
    }

    revalidatePath('/dashboard/users')
    return { success: true }
  } catch (e: any) {
    console.error("adjustUserBalance Error:", e)
    return { success: false, error: e.message || "An unexpected error occurred" }
  }
}
