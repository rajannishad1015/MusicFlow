'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createWithdrawalRequest } from '../actions'
import { toast } from "sonner"
import { DollarSign, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface WithdrawRequestFormProps {
    currentBalance: number
    bankDetails: {
        bankName: string | null
        accountNumber: string | null
        ifscCode: string | null
    }
}

export default function WithdrawRequestForm({ currentBalance, bankDetails }: WithdrawRequestFormProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const value = parseFloat(amount)
    if (isNaN(value) || value <= 0) {
        toast.error("Please enter a valid amount")
        return
    }

    if (value < 10) {
        toast.error("Minimum withdrawal amount is $10.00")
        return
    }

    if (value > currentBalance) {
        toast.error("Insufficient balance")
        return
    }

    setLoading(true)
    try {
        await createWithdrawalRequest(value)
        toast.success("Withdrawal request submitted successfully")
        setOpen(false)
        setAmount('')
    } catch (error: any) {
        toast.error(error.message || "Failed to submit request")
    } finally {
        setLoading(false)
    }
  }

  // Check if bank details are complete
  const isBankDetailsComplete = bankDetails.bankName && bankDetails.accountNumber && bankDetails.ifscCode

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
            <DollarSign size={16} /> Request Payout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Request Payout</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Enter the amount you wish to withdraw. Funds will be sent to your connected bank account.
          </DialogDescription>
        </DialogHeader>

        {!isBankDetailsComplete ? (
             <div className="py-6 text-center space-y-4">
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 text-sm">
                    Please complete your bank details in Settings before requesting a payout.
                </div>
                <Link href="/dashboard/settings" onClick={() => setOpen(false)}>
                    <Button variant="outline" type="button" className="border-white/10 hover:bg-white/5 w-full">
                        Go to Settings
                    </Button>
                </Link>
            </div>
        ) : (
            <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg space-y-2 border border-white/5">
                        <Label className="text-xs uppercase text-zinc-500 font-bold tracking-wider">Bank Details</Label>
                        <div className="text-sm">
                            <div className="flex justify-between"><span className="text-zinc-400">Bank:</span> <span>{bankDetails.bankName}</span></div>
                            <div className="flex justify-between"><span className="text-zinc-400">Account:</span> <span className="font-mono">**** {bankDetails.accountNumber?.slice(-4)}</span></div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount text-zinc-300">Amount (USD)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="10"
                                max={currentBalance}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-6 bg-white/5 border-white/10 text-white font-mono text-lg"
                                placeholder="0.00"
                            />
                        </div>
                        <p className="text-xs text-zinc-500 text-right">Available: ${currentBalance.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit Request
                </Button>
            </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
