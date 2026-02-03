'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Check, X, Eye } from "lucide-react"
import { approvePayout, rejectPayout } from "./actions"
import { toast } from "sonner"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function PayoutList({ requests }: { requests: any[] }) {
    const [loading, setLoading] = useState<string | null>(null)

    async function handleApprove(id: string) {
        if (!confirm("Are you sure you want to approve this payout? Verify bank details first.")) return
        setLoading(id)
        try {
            await approvePayout(id)
            toast.success("Payout Approved")
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setLoading(null)
        }
    }

    async function handleReject(id: string) {
        if (!confirm("Are you sure? This will refund the amount to user wallet.")) return
        setLoading(id)
        try {
            await rejectPayout(id)
            toast.success("Payout Rejected & Refunded")
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setLoading(null)
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Bank Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {requests.map((req) => (
                    <TableRow key={req.id}>
                        <TableCell>{new Date(req.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-medium">{req.profiles?.full_name || 'Unknown'}</span>
                                <span className="text-xs text-gray-500">{req.profiles?.email}</span>
                            </div>
                        </TableCell>
                        <TableCell className="font-mono font-bold">${req.amount.toFixed(2)}</TableCell>
                        <TableCell>
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm"><Eye size={16} className="mr-2"/> View</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>Bank Details</DialogTitle></DialogHeader>
                                    <div className="grid gap-2 text-sm pt-4">
                                        <div className="grid grid-cols-2"><span className="text-gray-500">Bank Name:</span> <span>{req.profiles?.bank_name}</span></div>
                                        <div className="grid grid-cols-2"><span className="text-gray-500">Account No:</span> <span className="font-mono">{req.profiles?.account_number}</span></div>
                                        <div className="grid grid-cols-2"><span className="text-gray-500">IFSC:</span> <span className="font-mono">{req.profiles?.ifsc_code}</span></div>
                                    </div>
                                </DialogContent>
                             </Dialog>
                        </TableCell>
                        <TableCell>
                             <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                                ${req.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                  req.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                  'bg-yellow-100 text-yellow-700'}`}>
                                {req.status}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">
                            {req.status === 'pending' && (
                                <div className="flex justify-end gap-2">
                                     <Button 
                                        size="sm" 
                                        variant="default" 
                                        className="bg-green-600 hover:bg-green-700 h-8"
                                        onClick={() => handleApprove(req.id)}
                                        disabled={loading === req.id}
                                    >
                                        <Check size={14} />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="destructive"
                                        className="h-8"
                                        onClick={() => handleReject(req.id)}
                                        disabled={loading === req.id}
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
                 {requests.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No payout requests found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
