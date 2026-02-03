'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const fullName = formData.get('fullName') as string
  const artistName = formData.get('artistName') as string
  const bio = formData.get('bio') as string
  const bankName = formData.get('bankName') as string
  const accountNumber = formData.get('accountNumber') as string
  const ifscCode = formData.get('ifscCode') as string
  const panNumber = formData.get('panNumber') as string

  const { error } = await supabase
    .from('profiles')
    .update({
        full_name: fullName,
        artist_name: artistName,
        bio: bio,
        bank_name: bankName,
        account_number: accountNumber,
        ifsc_code: ifscCode,
        pan_number: panNumber,
        updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/settings')
}
