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
import { DollarSign, Loader2, CreditCard, Wallet, Landmark } from 'lucide-react'
import Link from 'next/link'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface WithdrawRequestFormProps {
    currentBalance: number
    bankDetails: {
        bankName: string | null
        accountNumber: string | null
        ifscCode: string | null
        paypalEmail: string | null
        upiId: string | null
    }
    trigger?: React.ReactNode
}

export default function WithdrawRequestForm({ currentBalance, bankDetails, trigger }: WithdrawRequestFormProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [paymentMode, setPaymentMode] = useState<string>('bank_transfer')
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

    if (paymentMode === 'bank_transfer' && (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.ifscCode)) {
        toast.error("Incomplete bank details. Please update settings.")
        return
    }
    if (paymentMode === 'paypal' && !bankDetails.paypalEmail) {
        toast.error("PayPal email missing. Please update settings.")
        return
    }
    if (paymentMode === 'upi' && !bankDetails.upiId) {
        toast.error("UPI ID missing. Please update settings.")
        return
    }

    setLoading(true)
    try {
        let details: any = {}
        if (paymentMode === 'bank_transfer') {
            details = {
                bank_name: bankDetails.bankName,
                account_number: bankDetails.accountNumber,
                ifsc_code: bankDetails.ifscCode
            }
        } else if (paymentMode === 'paypal') {
            details = { email: bankDetails.paypalEmail }
        } else if (paymentMode === 'upi') {
            details = { upi_id: bankDetails.upiId }
        }

        await createWithdrawalRequest(value, paymentMode, details)
        toast.success("Withdrawal request submitted successfully")
        setOpen(false)
        setAmount('')
    } catch (error: any) {
        toast.error(error.message || "Failed to submit request")
    } finally {
        setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : (
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                <DollarSign size={16} /> Request Payout
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Request Payout</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Select your preferred payment method.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
                <div className="space-y-4">
                    <Label className="text-xs uppercase text-zinc-500 font-bold tracking-wider">Payment Mode</Label>
                    <RadioGroup defaultValue="bank_transfer" onValueChange={setPaymentMode} className="grid grid-cols-3 gap-2">
                        <div>
                            <RadioGroupItem value="bank_transfer" id="bank" className="peer sr-only" />
                            <Label htmlFor="bank" className="flex flex-col items-center justify-between rounded-md border-2 border-zinc-900 bg-zinc-900 p-4 hover:bg-zinc-800 peer-data-[state=checked]:border-indigo-500 [&:has([data-state=checked])]:border-indigo-500 cursor-pointer transition-all">
                                <Landmark className="mb-2 h-6 w-6 text-zinc-400 peer-data-[state=checked]:text-indigo-400" />
                                <span className="text-xs font-bold">Bank</span>
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                            <Label htmlFor="paypal" className="flex flex-col items-center justify-between rounded-md border-2 border-zinc-900 bg-zinc-900 p-4 hover:bg-zinc-800 peer-data-[state=checked]:border-indigo-500 [&:has([data-state=checked])]:border-indigo-500 cursor-pointer transition-all">
                                <Wallet className="mb-2 h-6 w-6 text-zinc-400 peer-data-[state=checked]:text-indigo-400" />
                                <span className="text-xs font-bold">PayPal</span>
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                            <Label htmlFor="upi" className="flex flex-col items-center justify-between rounded-md border-2 border-zinc-900 bg-zinc-900 p-4 hover:bg-zinc-800 peer-data-[state=checked]:border-indigo-500 [&:has([data-state=checked])]:border-indigo-500 cursor-pointer transition-all">
                                <CreditCard className="mb-2 h-6 w-6 text-zinc-400 peer-data-[state=checked]:text-indigo-400" />
                                <span className="text-xs font-bold">UPI</span>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="space-y-2">
                     <Label className="text-xs uppercase text-zinc-500 font-bold tracking-wider">Details</Label>
                     <div className="p-4 bg-white/5 rounded-lg border border-white/5 text-sm">
                        {paymentMode === 'bank_transfer' && (
                             bankDetails.bankName ? (
                                <div className="space-y-1">
                                    <div className="flex justify-between"><span className="text-zinc-400">Bank:</span> <span>{bankDetails.bankName}</span></div>
                                    <div className="flex justify-between"><span className="text-zinc-400">Account:</span> <span className="font-mono">**** {bankDetails.accountNumber?.slice(-4)}</span></div>
                                </div>
                             ) : <span className="text-amber-500">No bank details found. Please update settings.</span>
                        )}
                        {paymentMode === 'paypal' && (
                            bankDetails.paypalEmail ? (
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-400">Email:</span>
                                    <span>{bankDetails.paypalEmail}</span>
                                </div>
                            ) : <span className="text-amber-500">No PayPal email found. Please update settings.</span>
                        )}
                        {paymentMode === 'upi' && (
                            bankDetails.upiId ? (
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-400">UPI ID:</span>
                                    <span>{bankDetails.upiId}</span>
                                </div>
                            ) : <span className="text-amber-500">No UPI ID found. Please update settings.</span>
                        )}
                     </div>
                     {!((paymentMode === 'bank_transfer' && bankDetails.bankName) || 
                        (paymentMode === 'paypal' && bankDetails.paypalEmail) || 
                        (paymentMode === 'upi' && bankDetails.upiId)) && (
                        <Link href="/dashboard/settings" onClick={() => setOpen(false)} className="text-xs text-indigo-400 hover:text-indigo-300 block text-right mt-1">
                            Go to Settings &rarr;
                        </Link>
                     )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="amount" className="text-zinc-300">Amount (USD)</Label>
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
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit Request
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
