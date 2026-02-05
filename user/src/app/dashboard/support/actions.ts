'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTicket(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const subject = formData.get('subject') as string
  const category = formData.get('category') as string
  const priority = formData.get('priority') as string
  const message = formData.get('message') as string
  const attachment = formData.get('attachment') as File | null

  if (!subject || !category || !priority || !message) {
    throw new Error('All fields are required')
  }

  // 1. Create Ticket
  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .insert({
      user_id: user.id,
      subject,
      category,
      priority,
      status: 'open'
    })
    .select()
    .single()

  if (ticketError) {
    console.error('Ticket creation error:', ticketError)
    throw new Error('Failed to create ticket')
  }

  // 2. Upload Attachment (if present)
  let attachmentUrl = null
  if (attachment && attachment.size > 0) {
    attachmentUrl = await uploadAttachment(attachment, supabase)
  }

  // 3. Create Initial Message
  const { error: messageError } = await supabase
    .from('ticket_messages')
    .insert({
      ticket_id: ticket.id,
      sender_id: user.id,
      message,
      is_internal: false,
      attachment_url: attachmentUrl
    })

  if (messageError) {
    console.error('Message creation error:', messageError)
    throw new Error('Failed to create ticket message')
  }

  revalidatePath('/dashboard/support')
  return { success: true, ticketId: ticket.id }
}

export async function replyTx(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const ticketId = formData.get('ticketId') as string
  const message = formData.get('message') as string
  const attachment = formData.get('attachment') as File | null

  if (!ticketId || !message) throw new Error('Missing fields')

  // Verify ownership
  const { data: ticket } = await supabase
    .from('tickets')
    .select('user_id')
    .eq('id', ticketId)
    .single()
  
  if (ticket?.user_id !== user.id) throw new Error('Unauthorized')

  // Upload Attachment (if present)
  let attachmentUrl = null
  if (attachment && attachment.size > 0) {
    attachmentUrl = await uploadAttachment(attachment, supabase)
  }

  await supabase.from('ticket_messages').insert({
    ticket_id: ticketId,
    sender_id: user.id,
    message,
    is_internal: false,
    attachment_url: attachmentUrl
  })

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
