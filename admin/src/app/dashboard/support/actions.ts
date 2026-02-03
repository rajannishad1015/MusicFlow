'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function adminReplyTx(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Check Admin
  const { data: admin } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  if (admin?.role !== 'admin') throw new Error('Unauthorized')

  const ticketId = formData.get('ticketId') as string
  const message = formData.get('message') as string
  const isInternal = formData.get('isInternal') === 'on'

  if (!ticketId || !message) throw new Error('Missing fields')

  await supabase.from('ticket_messages').insert({
    ticket_id: ticketId,
    sender_id: user.id,
    message,
    is_internal: isInternal
  })

  revalidatePath(`/dashboard/support/${ticketId}`)
  revalidatePath('/dashboard/support')
}

export async function updateTicketStatus(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Check Admin
    const { data: admin } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    if (admin?.role !== 'admin') throw new Error('Unauthorized')

    const ticketId = formData.get('ticketId') as string
    const status = formData.get('status') as string

    await supabase.from('tickets').update({ status }).eq('id', ticketId)
    
    revalidatePath(`/dashboard/support/${ticketId}`)
    revalidatePath('/dashboard/support')
}
