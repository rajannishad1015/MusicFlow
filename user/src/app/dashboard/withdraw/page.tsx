import { createClient } from '@/utils/supabase/server'
import RevenueCard from '@/components/revenue-card'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default async function WithdrawPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', user?.id)
    .single()

  const { data: requests } = await supabase
    .from('payout_requests')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold">Withdrawals</h1>
            <p className="text-gray-500">Manage your earnings and payout requests.</p>
        </div>

        <div className="max-w-md">
             <RevenueCard balance={profile?.balance || 0} />
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Withdrawal History</CardTitle>
            </CardHeader>
            <CardContent>
                {requests && requests.length > 0 ? (
                    <div className="rounded-md border">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr className="text-left border-b">
                                    <th className="p-3 font-medium">Date</th>
                                    <th className="p-3 font-medium">Amount</th>
                                    <th className="p-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req: any) => (
                                    <tr key={req.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        <td className="p-3">{new Date(req.created_at).toLocaleDateString()}</td>
                                        <td className="p-3 font-mono">${req.amount.toFixed(2)}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                                                ${req.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                                  req.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                                  'bg-yellow-100 text-yellow-700'}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No withdrawal history found.
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  )
}
