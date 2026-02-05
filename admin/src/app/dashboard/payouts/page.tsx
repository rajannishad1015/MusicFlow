import { createClient } from '@/utils/supabase/server'
import PayoutList from './payout-list'
import Link from 'next/link'
import { DollarSign, Clock, CheckCircle2, XCircle, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default async function PayoutsPage({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = await createClient()
  const status = (await searchParams).status || 'pending'
  
  // Fetch Requests
  let dbQuery = supabase
    .from('payout_requests')
    .select(`
        *,
        profiles (
            full_name,
            artist_name,
            email,
            bank_name,
            account_number,
            ifsc_code
        )
    `)
    .order('created_at', { ascending: false })

  if (status !== 'all') {
    dbQuery = dbQuery.eq('status', status)
  }

  const { data: requests } = await dbQuery

  const stats = [
      { label: 'Pending', status: 'pending', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
      { label: 'Approved', status: 'approved', icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50' },
      { label: 'Rejected', status: 'rejected', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payout Requests</h1>
          <p className="text-gray-500 mt-1">Review and process artist withdrawal requests.</p>
        </div>
        <Link href="/dashboard/payouts/upload">
            <Button variant="outline" className="gap-2">
                <Upload size={16} /> Import Report
            </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
          {stats.map((s) => (
             <Link key={s.status} href={`/dashboard/payouts?status=${s.status}`}>
                <div className={`p-4 rounded-xl border transition-all cursor-pointer ${status === s.status ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/10' : 'border-gray-100 bg-white hover:border-gray-300 shadow-sm'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${s.bgColor}`}>
                            <s.icon className={`h-5 w-5 ${s.color}`} />
                        </div>
                        <span className={`font-semibold ${status === s.status ? 'text-indigo-700' : 'text-gray-700'}`}>{s.label} Requests</span>
                    </div>
                </div>
             </Link>
          ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-900 overflow-hidden">
        <PayoutList requests={requests || []} />
      </div>
    </div>
  )
}
