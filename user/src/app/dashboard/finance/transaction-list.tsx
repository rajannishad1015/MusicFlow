'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowDownLeft, ArrowUpRight, Clock, AlertCircle } from 'lucide-react'

export default function TransactionList({ transactions }: { transactions: any[] }) {
  if (!transactions || transactions.length === 0) {
    return <div className="text-center py-10 text-zinc-500">No transactions found.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead className="text-zinc-500">Date</TableHead>
          <TableHead className="text-zinc-500">Description</TableHead>
          <TableHead className="text-zinc-500">Type</TableHead>
          <TableHead className="text-zinc-500 text-right">Amount</TableHead>
          <TableHead className="text-zinc-500 text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id} className="border-white/5 hover:bg-white/5">
            <TableCell className="font-mono text-zinc-400">
              {new Date(tx.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-zinc-300 font-medium">
                {tx.description}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {tx.amount > 0 ? (
                    <ArrowDownLeft size={16} className="text-emerald-500" />
                ) : (
                    <ArrowUpRight size={16} className="text-amber-500" />
                )}
                <span className="capitalize text-zinc-400">{tx.type}</span>
              </div>
            </TableCell>
            <TableCell className={`text-right font-mono font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-zinc-200'}`}>
              {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
                {tx.status === 'completed' && <span className="text-emerald-500 text-xs uppercase font-bold tracking-wider">Completed</span>}
                {tx.status === 'pending' && <span className="text-amber-500 text-xs uppercase font-bold tracking-wider flex items-center justify-end gap-1"><Clock size={12}/> Pending</span>}
                {tx.status === 'failed' && <span className="text-red-500 text-xs uppercase font-bold tracking-wider flex items-center justify-end gap-1"><AlertCircle size={12}/> Failed</span>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
