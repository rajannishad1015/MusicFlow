'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function adminReplyTx(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
      throw new Error('Unauthorized')
  }
  
  // Check Admin
  const { data: admin } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (admin?.role !== 'admin') throw new Error('Unauthorized')

  const ticketId = formData.get('ticketId') as string
  const message = formData.get('message') as string
  const isInternal = formData.get('isInternal') === 'on'
  const attachment = formData.get('attachment') as File | null

  if (!ticketId || !message) throw new Error('Missing fields')

  // Upload Attachment (if present)
  let attachmentUrl = null
  if (attachment && attachment.size > 0) {
    attachmentUrl = await uploadAttachment(attachment, supabase)
  }

  const { error } = await supabase.from('ticket_messages').insert({
    ticket_id: ticketId,
    sender_id: user.id,
    message: message,
    is_admin: true, // Admin is sending
    is_internal: isInternal, // Support internal notes
    attachment_url: attachmentUrl
  })

  if (error) {
    throw new Error(error.message)
  }

  // Notify Artist (if not internal note)
  if (!isInternal) {
      const { data: ticket } = await supabase
          .from('tickets')
          .select('artist_id, subject')
          .eq('id', ticketId)
          .single()

      if (ticket) {
          await supabase.from('notifications').insert({
              user_id: ticket.artist_id,
              type: 'support_reply',
              title: 'Support Reply',
              message: `You have a new message regarding: ${ticket.subject}`,
              link: `/dashboard/support/${ticketId}`,
              is_read: false
          })
      }
  }

  revalidatePath(`/dashboard/support/${ticketId}`)
  revalidatePath('/dashboard/support')
}

async function uploadAttachment(file: File, supabase: any) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('support-attachments')
        .upload(filePath, file)

    if (uploadError) {
        console.error('Upload Error:', uploadError)
        return null
    }

    const { data: { publicUrl } } = supabase.storage
        .from('support-attachments')
        .getPublicUrl(filePath)
    
    return publicUrl
}

export async function updateTicketStatus(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Check Admin
    const { data: admin } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (admin?.role !== 'admin') throw new Error('Unauthorized')

    const ticketId = formData.get('ticketId') as string
    const status = formData.get('status') as string

    await supabase.from('tickets').update({ status }).eq('id', ticketId)
    
    revalidatePath(`/dashboard/support/${ticketId}`)
    revalidatePath('/dashboard/support')
}
