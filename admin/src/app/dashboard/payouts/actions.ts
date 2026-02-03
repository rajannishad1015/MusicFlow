'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approvePayout(requestId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Check Admin
    const { data: admin } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    if (admin?.role !== 'admin') throw new Error('Unauthorized')

    // Update Request Status
    const { error } = await supabase
        .from('payout_requests')
        .update({ status: 'approved' })
        .eq('id', requestId)
        
    if (error) throw new Error(error.message)

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

    // 3. Update Request Status
    const { error } = await supabase
        .from('payout_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/payouts')
}
