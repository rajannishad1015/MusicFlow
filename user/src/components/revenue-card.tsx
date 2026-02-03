'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { DollarSign, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createWithdrawalRequest } from "@/app/dashboard/actions"

export default function RevenueCard({ balance, currency = '$' }: { balance: number, currency?: string }) {
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)

    const handleWithdraw = async () => {
        setLoading(true)
        try {
            const withdrawAmount = parseFloat(amount)
            if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
                toast.error("Please enter a valid amount")
                return
            }
            if (withdrawAmount > balance) {
                toast.error("Insufficient balance")
                return
            }

            await createWithdrawalRequest(withdrawAmount)
            toast.success("Withdrawal request submitted!")
            setIsWithdrawOpen(false)
            setAmount('')
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="bg-white/[0.03] backdrop-blur-2xl border-white/20 shadow-2xl relative overflow-hidden group transition-all hover:border-white/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em]">Royalties Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-indigo-400 group-hover:text-white transition-colors" />
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-4xl font-black tracking-tighter text-white">{currency}{balance.toFixed(2)}</div>
                        <div className="flex items-center gap-2 mt-3">
                             <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-black tracking-wider">EARNINGS</span>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Withdrawable Income</p>
                        </div>
                    </div>
                    
                    <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                        <DialogTrigger asChild>
                            <Button variant="secondary" size="sm" className="bg-white text-black hover:bg-indigo-500 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] h-8 px-4 rounded-full shadow-lg transition-all">
                                Withdraw
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-white">Request Withdrawal</DialogTitle>
                                <DialogDescription className="text-zinc-400">
                                    Enter the amount you wish to withdraw. Minimum $10.00.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="amount" className="text-right text-sm text-zinc-400">
                                        Amount
                                    </label>
                                    <div className="col-span-3 relative">
                                        <span className="absolute left-3 top-2.5 text-zinc-500">$</span>
                                        <Input
                                            id="amount"
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="pl-7 bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
                                            placeholder="0.00"
                                            max={balance}
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-zinc-500 text-right">Available: ${balance.toFixed(2)}</p>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsWithdrawOpen(false)} className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white">Cancel</Button>
                                <Button onClick={handleWithdraw} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Submit Request
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    )
}
