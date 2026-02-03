import { createClient } from '@/utils/supabase/server'
import PayoutList from './payout-list'

export default async function PayoutsPage() {
  const supabase = await createClient()
  
  // Fetch Pending Requests
  const { data: requests } = await supabase
    .from('payout_requests')
    .select(`
        *,
        profiles (
            full_name,
            email,
            bank_name,
            account_number,
            ifsc_code
        )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payout Requests</h1>
      </div>

      <div className="grid gap-4">
           {/* Summary Stats or Filters could go here */}
      </div>

      <div className="bg-white rounded-md border dark:bg-gray-900 shadow-sm">
        <PayoutList requests={requests || []} />
      </div>
    </div>
  )
}
