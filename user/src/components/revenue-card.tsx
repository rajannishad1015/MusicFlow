'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, TrendingUp, History, ArrowRight } from "lucide-react"
import WithdrawRequestForm from '@/app/dashboard/finance/withdraw-request-form'

interface RevenueCardProps {
    balance: number
    currency?: string
    bankDetails: {
        bankName: string | null
        accountNumber: string | null
        ifscCode: string | null
        paypalEmail: string | null
        upiId: string | null
    }
}

export default function RevenueCard({ balance, currency = '$', bankDetails }: RevenueCardProps) {
    return (
        <Card className="h-full bg-zinc-950 border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Visual Background Elements */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-indigo-600/20 transition-colors duration-700 pointer-events-none" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <DollarSign className="h-3 w-3 text-indigo-400" />
                    </div>
                    <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em]">Total Balance</CardTitle>
                </div>
                <Link href="/dashboard/finance">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-white rounded-full hover:bg-white/5">
                        <History size={14} />
                    </Button>
                </Link>
            </CardHeader>

            <CardContent className="relative z-10">
                <div className="flex flex-col gap-6">
                    <div>
                        <div className="text-3xl font-black tracking-tighter text-white tabular-nums flex items-baseline gap-1">
                            <span className="text-lg text-zinc-500 font-bold">{currency}</span>
                            {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                             <div className="flex items-center px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md">
                                <TrendingUp size={10} className="mr-1" /> Available
                             </div>
                             <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Ready to Payout</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex gap-3">
                        <WithdrawRequestForm 
                            currentBalance={balance}
                            bankDetails={bankDetails}
                            trigger={
                                <Button className="flex-1 bg-white hover:bg-indigo-50 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] text-black font-black uppercase tracking-[0.1em] text-[10px] h-8 transition-all">
                                    Requests Payout <ArrowRight size={12} className="ml-2" />
                                </Button>
                            }
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
