import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Building2, Pencil } from 'lucide-react'
import RevenueCard from '@/components/revenue-card'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import WithdrawRequestForm from './withdraw-request-form'
import TransactionList from './transaction-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function FinancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('balance, bank_name, account_number, ifsc_code')
    .eq('id', user?.id)
    .single()

  // Fetch Transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(20)

  // Fetch Payout Requests (Legacy/Specific view)
  const { data: payoutRequests } = await supabase
    .from('payout_requests')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold">Finance & Wallet</h1>
                <p className="text-zinc-500">Manage your earnings, view transactions, and request payouts.</p>
            </div>
            <div className="flex items-center gap-2">
                <Link href="/dashboard/settings">
                    <Button variant="outline" className="border-white/10 hover:bg-white/5">
                        <Pencil size={16} className="mr-2"/> Manage Account
                    </Button>
                </Link>
                <WithdrawRequestForm 
                    currentBalance={profile?.balance || 0}
                    bankDetails={{
                        bankName: profile?.bank_name,
                        accountNumber: profile?.account_number,
                        ifscCode: profile?.ifsc_code
                    }}
                />
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <div className="col-span-1">
                <RevenueCard balance={profile?.balance || 0} />
             </div>
             
             <Card className="bg-zinc-900/50 border-white/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                        <Building2 size={16} /> Bank Account
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {profile?.bank_name ? (
                        <div className="space-y-1">
                            <div className="font-bold text-lg">{profile.bank_name}</div>
                            <div className="font-mono text-zinc-500 text-sm">**** {profile.account_number?.slice(-4)}</div>
                            <div className="text-xs text-zinc-600 uppercase tracking-wider mt-2">{profile.ifsc_code}</div>
                        </div>
                    ) : (
                        <div className="text-center py-2">
                            <p className="text-zinc-500 text-sm mb-3">No account connected</p>
                            <Link href="/dashboard/settings">
                                <Button size="sm" variant="secondary" className="w-full">Connect Account</Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
             </Card>
        </div>

        <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="bg-zinc-900 border border-white/10">
                <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
                <TabsTrigger value="payouts">Payout History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions" className="mt-4">
                <Card className="bg-zinc-900/50 border-white/10">
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>Recent activity in your wallet</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TransactionList transactions={transactions || []} />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="payouts" className="mt-4">
                 <Card className="bg-zinc-900/50 border-white/10">
                    <CardHeader>
                        <CardTitle>Withdrawal Requests</CardTitle>
                        <CardDescription>Status of your payout requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {payoutRequests && payoutRequests.length > 0 ? (
                            <div className="rounded-md border border-white/10">
                                <table className="w-full text-sm">
                                    <thead className="bg-white/5">
                                        <tr className="text-left border-b border-white/10">
                                            <th className="p-3 font-medium text-zinc-400">Date</th>
                                            <th className="p-3 font-medium text-zinc-400">Amount</th>
                                            <th className="p-3 font-medium text-zinc-400">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payoutRequests.map((req: any) => (
                                            <tr key={req.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                                                <td className="p-3 text-zinc-300">{new Date(req.created_at).toLocaleDateString()}</td>
                                                <td className="p-3 font-mono text-zinc-200">${req.amount.toFixed(2)}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                                                        ${req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                                                          req.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                                                          'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                                        {req.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-zinc-500">
                                No withdrawal history found.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  )
}
