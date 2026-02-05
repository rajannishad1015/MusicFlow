'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

interface ProcessResult {
    successCount: number
    failureCount: number
    errors: string[]
}

export async function processRoyaltyFile(formData: FormData): Promise<ProcessResult> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Auth Check
    const { data: admin } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    if (admin?.role !== 'admin') throw new Error('Unauthorized')

    const file = formData.get('file') as File
    if (!file) throw new Error("No file uploaded")

    const text = await file.text()
    const lines = text.split(/\r?\n/)
    
    // Basic CSV Parsing (Assumes Header: email,amount,description)
    // Skipping header if exists
    const startIndex = lines[0].toLowerCase().includes('email') ? 1 : 0
    
    const results: ProcessResult = {
        successCount: 0,
        failureCount: 0,
        errors: []
    }

    // Process in batches or sequential. Sequential for safety on balance updates.
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        // Handle quoted CSV values if necessary, but simple split for now
        const parts = line.split(',')
        if (parts.length < 2) {
             results.failureCount++
             results.errors.push(`Line ${i+1}: Invalid format`)
             continue
        }

        const email = parts[0].trim()
        const amountStr = parts[1].trim()
        const description = parts[2]?.trim() || "Royalty Payout"

        const amount = parseFloat(amountStr)

        if (!email || isNaN(amount) || amount <= 0) {
            results.failureCount++
            results.errors.push(`Line ${i+1}: Invalid data for ${email || 'unknown user'}`)
            continue
        }

        // 1. Find User
        const { data: profile } = await supabase
            .from('profiles')
            .select('id, balance')
            .eq('email', email)
            .single()

        if (!profile) {
            results.failureCount++
            results.errors.push(`Line ${i+1}: User not found (${email})`)
            continue
        }

        // 2. Update Balance
        const newBalance = (Number(profile.balance) || 0) + amount
        
        const { error: balanceError } = await supabase
            .from('profiles')
            .update({ balance: newBalance })
            .eq('id', profile.id)

        if (balanceError) {
             results.failureCount++
             results.errors.push(`Line ${i+1}: Failed to update balance for ${email}`)
             continue
        }

        // 3. Log Transaction
        await supabase.from('transactions').insert({
            user_id: profile.id,
            amount: amount,
            type: 'royalty',
            description: description,
            status: 'completed'
        })

        results.successCount++
    }

    revalidatePath('/dashboard/users')
    return results
}
