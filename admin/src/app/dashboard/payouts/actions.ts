'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approvePayout(requestId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Check Admin
    const { data: admin } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    if (admin?.role !== 'admin') throw new Error('Unauthorized')

    // Get Request
    const { data: request } = await supabase.from('payout_requests').select('*').eq('id', requestId).single()
    if (!request) throw new Error("Request not found")

    // Update Request Status
    const { error } = await supabase
        .from('payout_requests')
        .update({ status: 'approved' })
        .eq('id', requestId)
        
    if (error) throw new Error(error.message)

    // Update Transaction Status (Best effort: Find latest pending withdrawal for this user)
    // In a production system, we'd link via transaction_id
    const { data: tx } = await supabase
        .from('transactions')
        .select('id')
        .eq('user_id', request.user_id)
        .eq('type', 'withdrawal')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
    
    if (tx) {
        await supabase.from('transactions').update({ status: 'completed', description: 'Withdrawal Completed' }).eq('id', tx.id)
    }

    // Notify User
    await supabase.from('notifications').insert({
        user_id: request.user_id,
        type: 'payment',
        title: 'Payout Approved',
        message: `Your withdrawal request for $${request.amount.toFixed(2)} has been approved and processed.`,
        link: '/dashboard/finance',
        is_read: false
    })

    revalidatePath('/dashboard/payouts')
}

export async function rejectPayout(requestId: string) {
    const supabase = await createClient()
     const { data: { user } } = await supabase.auth.getUser()
    
    // Check Admin
    const { data: admin } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    if (admin?.role !== 'admin') throw new Error('Unauthorized')

    // 1. Get Request to know amount and user
    const { data: request } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('id', requestId)
        .single()
        
    if (!request) throw new Error("Request not found")
    
    if (request.status !== 'pending') throw new Error("Request already processed")

    // 2. Refund User Balance
    const { data: profile } = await supabase.from('profiles').select('balance').eq('id', request.user_id).single()
    const currentBalance = Number(profile?.balance || 0)
    const newBalance = currentBalance + Number(request.amount)

    const { error: refundError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', request.user_id)
        
    if (refundError) throw new Error("Failed to refund balance")

    // 3. Log Refund Transaction
    await supabase.from('transactions').insert({
        user_id: request.user_id,
        amount: request.amount, // Credit back
        type: 'adjustment',
        description: `Refund for Rejected Payout #${requestId.slice(0, 8)}`,
        status: 'completed'
    })

    // 4. Update Request Status
    const { error } = await supabase
        .from('payout_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId)

    if (error) throw new Error(error.message)

    // Also mark the original transaction as failed if found
    const { data: tx } = await supabase
        .from('transactions')
        .select('id')
        .eq('user_id', request.user_id)
        .eq('type', 'withdrawal')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
    
    if (tx) {
        await supabase.from('transactions').update({ status: 'failed' }).eq('id', tx.id)
    }

    // Notify User
    await supabase.from('notifications').insert({
        user_id: request.user_id,
        type: 'payment',
        title: 'Payout Rejected',
        message: `Your withdrawal request for $${request.amount.toFixed(2)} was rejected. The funds have been refunded to your wallet.`,
        link: '/dashboard/finance',
        is_read: false
    })

    revalidatePath('/dashboard/payouts')
}
