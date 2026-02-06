'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building2, CreditCard, ShieldCheck, Wifi } from 'lucide-react'

interface BankCardProps {
    bankName?: string | null
    accountNumber?: string | null
    ifscCode?: string | null
}

export default function BankCard({ bankName, accountNumber, ifscCode }: BankCardProps) {
    if (!bankName) {
        return (
            <Card className="bg-white/[0.03] border-white/10 h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 border-dashed hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl shadow-black/50">
                    <Building2 className="text-zinc-500 group-hover:text-indigo-400 transition-colors" size={32} />
                </div>
                <h3 className="text-white font-bold mb-1">No Bank Connected</h3>
                <p className="text-zinc-500 text-xs mb-4 max-w-[200px]">Connect your bank account to receive automated royalty payouts.</p>
                <Link href="/dashboard/settings">
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full h-10 px-6 shadow-lg shadow-indigo-500/20">
                        Connect Account
                    </Button>
                </Link>
            </Card>
        )
    }

    return (
        <div className="relative group h-full min-h-[220px]">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative h-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-white/10 rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                }}></div>

                {/* Card Header */}
                <div className="relative z-10 flex justify-between items-start">
                    <div className="flex bg-white/5 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/10 items-center gap-2">
                        <Building2 size={14} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Primary Account</span>
                    </div>
                     <Wifi size={24} className="text-zinc-600 rotate-90" />
                </div>

                {/* Card Center - Bank Name */}
                <div className="relative z-10 mt-6">
                    <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 uppercase tracking-tight">{bankName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-zinc-500 bg-zinc-900/50 px-2 py-0.5 rounded border border-white/5 tracking-widest">{ifscCode}</span>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <ShieldCheck size={10} /> VERIFIED
                        </div>
                    </div>
                </div>

                {/* Card Footer - Number & Edit */}
                <div className="relative z-10 flex justify-between items-end mt-8">
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">Account Number</p>
                        <p className="font-mono text-xl text-zinc-300 tracking-widest flex gap-2">
                            <span>••••</span>
                            <span>••••</span>
                            <span className="text-white">{accountNumber?.slice(-4) || '0000'}</span>
                        </p>
                     </div>

                     <Link href="/dashboard/settings">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 shadow-lg">
                            <CreditCard size={14} />
                        </Button>
                    </Link>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none"></div>
                <div className="absolute bottom-[-50%] left-[-10%] w-[200px] h-[200px] rounded-full bg-emerald-500/10 blur-[60px] pointer-events-none"></div>
            </div>
        </div>
    )
}
