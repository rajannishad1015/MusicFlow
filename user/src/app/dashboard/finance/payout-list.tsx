'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Clock, AlertCircle, CheckCircle2, History } from 'lucide-react'

export default function PayoutList({ payouts }: { payouts: any[] }) {
  if (!payouts || payouts.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500 bg-white/[0.02] rounded-xl border border-white/5 border-dashed">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
                <History size={20} className="text-zinc-600" />
            </div>
            <p className="text-sm font-medium">No withdrawal requests found</p>
        </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden border border-white/5 bg-white/[0.02]">
        <Table>
            <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent bg-zinc-950/50">
                    <TableHead className="text-zinc-500 text-xs font-bold uppercase tracking-wider py-4">Date</TableHead>
                    <TableHead className="text-zinc-500 text-xs font-bold uppercase tracking-wider py-4">Amount</TableHead>
                    <TableHead className="text-zinc-500 text-xs font-bold uppercase tracking-wider py-4">Status</TableHead>
                    <TableHead className="text-zinc-500 text-xs font-bold uppercase tracking-wider py-4 text-right">Details</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {payouts.map((req) => (
                    <TableRow key={req.id} className="border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell className="font-mono text-zinc-400 text-xs">
                            {new Date(req.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </TableCell>
                        <TableCell className="font-mono text-zinc-200 font-bold is-tabular">
                            ${req.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                             <div className="flex items-center gap-2">
                                {req.status === 'approved' && (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] uppercase font-bold tracking-wider">
                                        <CheckCircle2 size={12} /> Approved
                                    </span>
                                )}
                                {req.status === 'pending' && (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-bold tracking-wider">
                                        <Clock size={12} className="animate-pulse" /> Processing
                                    </span>
                                )}
                                {req.status === 'rejected' && (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-bold tracking-wider">
                                        <AlertCircle size={12} /> Rejected
                                    </span>
                                )}
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            {req.status === 'rejected' && req.admin_notes ? (
                                <span className="text-xs text-red-400 italic">"{req.admin_notes}"</span>
                            ) : (
                                <span className="text-xs text-zinc-600">-</span>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
             </TableBody>
        </Table>
    </div>
  )
}
