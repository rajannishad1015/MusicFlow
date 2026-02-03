'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Eye, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { addRevenue } from "./funds-actions"
import { toast } from "sonner"

export default function UserDetailsDialog({ user }: { user: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
             <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information for {user.artist_name || user.email}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
             <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="funds">Manage Funds</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                    <div className="grid grid-cols-2 gap-6 pt-4">
                         {/* General Info */}
                         <div className="space-y-4">
                             <h3 className="font-semibold text-lg border-b pb-1">Profile</h3>
                             <div className="grid gap-1">
                                 <span className="text-sm text-gray-500">Full Name</span>
                                 <span className="font-medium">{user.full_name || 'N/A'}</span>
                             </div>
                             <div className="grid gap-1">
                                 <span className="text-sm text-gray-500">Email</span>
                                 <span className="font-medium">{user.email}</span>
                             </div>
                             <div className="grid gap-1">
                                 <span className="text-sm text-gray-500">Phone</span>
                                 <span className="font-medium">{user.phone || 'N/A'}</span>
                             </div>
                              <div className="grid gap-1">
                                 <span className="text-sm text-gray-500">Bio</span>
                                 <p className="text-sm bg-gray-50 p-2 rounded max-h-24 overflow-y-auto">{user.bio || 'No bio provided.'}</p>
                             </div>
                             <div className="grid gap-1">
                                 <span className="text-sm text-gray-500">Joined</span>
                                 <span className="font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
                             </div>
                         </div>

                         {/* Financial Info */}
                         <div className="space-y-4">
                             <h3 className="font-semibold text-lg border-b pb-1">Financial Details</h3>
                             <div className="grid gap-1">
                                 <span className="text-sm text-gray-500">Bank Name</span>
                                 <span className="font-medium">{user.bank_name || 'Not set'}</span>
                             </div>
                              <div className="grid gap-1">
                                 <span className="text-sm text-gray-500">Account Number</span>
                                 <span className="font-medium font-mono">{user.account_number || 'Not set'}</span>
                             </div>
                              <div className="grid gap-1">
                                 <span className="text-sm text-gray-500">IFSC Code</span>
                                 <span className="font-medium font-mono">{user.ifsc_code || 'Not set'}</span>
                             </div>
                              <div className="grid gap-1">
                                 <span className="text-sm text-gray-500">PAN Number</span>
                                 <span className="font-medium font-mono">{user.pan_number || 'Not set'}</span>
                             </div>
                             <div className="grid gap-1">
                                 <span className="text-sm text-gray-500">Current Balance</span>
                                 <span className="text-2xl font-bold text-green-600">${user.balance || '0.00'}</span>
                             </div>
                         </div>
                    </div>
                </TabsContent>

                <TabsContent value="funds">
                    <FundsManager userId={user.id} currentBalance={user.balance || 0} />
                </TabsContent>
             </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FundsManager({ userId, currentBalance }: { userId: string, currentBalance: number }) {
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleAddFunds(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('userId', userId)
            formData.append('amount', amount)
            formData.append('description', description)
            
            await addRevenue(formData)
            toast.success("Funds added successfully")
            setAmount('')
            setDescription('')
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 pt-4">
             <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm text-gray-500">Current Wallet Balance</p>
                <p className="text-3xl font-bold text-indigo-600">${currentBalance.toFixed(2)}</p>
            </div>

            <form onSubmit={handleAddFunds} className="space-y-4">
                <div className="space-y-2">
                    <h3 className="font-medium text-sm">Add Revenue / Monthly Payout</h3>
                    <p className="text-xs text-gray-500">Credit the user's wallet with earnings.</p>
                </div>
                
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Amount ($)</label>
                    <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        required 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Description (Month/Year)</label>
                    <Input 
                        type="text" 
                        placeholder="e.g. October 2023 Royalties" 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Add Funds
                </Button>
            </form>
        </div>
    )
}
