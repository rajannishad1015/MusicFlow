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
import { useEffect, useState } from "react"
import { Eye, Loader2, Music, History, ShieldAlert, FileText, Ban, CheckCircle2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addRevenue } from "./funds-actions"
import { getUserTracks, getTransactionHistory, updateUserStatus, updateAdminNotes } from "./actions"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UserDetailsDialog({ user }: { user: any }) {
  const [tracks, setTracks] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [isLoadingTracks, setIsLoadingTracks] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  
  // Local state for optimistic updates
  const [currentStatus, setCurrentStatus] = useState(user.status || 'active')

  const fetchTracks = async () => {
    setIsLoadingTracks(true)
    try {
      const data = await getUserTracks(user.id)
      setTracks(data || [])
    } catch (err) {
      toast.error("Failed to load tracks")
    } finally {
      setIsLoadingTracks(false)
    }
  }

  const fetchHistory = async () => {
    setIsLoadingHistory(true)
    try {
      const data = await getTransactionHistory(user.id)
      setHistory(data || [])
    } catch (err) {
      toast.error("Failed to load transaction history")
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to change this user status to ${newStatus}?`)) return
    
    // Optimistic update
    const previousStatus = currentStatus
    setCurrentStatus(newStatus)
    
    try {
        await updateUserStatus(user.id, newStatus)
        toast.success(`User status updated to ${newStatus}`)
    } catch (err: any) {
        // Revert on failure
        setCurrentStatus(previousStatus)
        toast.error(err.message)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
             <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle>User Details</DialogTitle>
            <Badge variant={user.status === 'banned' ? 'destructive' : user.status === 'suspended' ? 'outline' : 'secondary'} className="capitalize">
                {user.status || 'active'}
            </Badge>
          </div>
          <DialogDescription>
            Managing {user.artist_name || user.full_name || user.email}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
             <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg dark:bg-gray-900">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="tracks" onClick={fetchTracks}>Tracks</TabsTrigger>
                    <TabsTrigger value="funds" onClick={fetchHistory}>Wallet</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="pt-4">
                    <div className="grid grid-cols-2 gap-8">
                         {/* General Info */}
                         <div className="space-y-4">
                             <div className="flex items-center gap-2 font-semibold text-lg border-b pb-1 text-gray-900 dark:text-gray-100">
                                <FileText className="h-4 w-4" /> Profile Info
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1">
                                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Full Name</span>
                                    <span className="font-medium">{user.full_name || 'N/A'}</span>
                                </div>
                                <div className="grid gap-1">
                                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Artist Name</span>
                                    <span className="font-medium text-indigo-600">{user.artist_name || 'N/A'}</span>
                                </div>
                             </div>
                             <div className="grid gap-1">
                                 <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Address</span>
                                 <span className="font-medium">{user.email}</span>
                             </div>
                             <div className="grid gap-1">
                                 <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Phone Number</span>
                                 <span className="font-medium">{user.phone || 'N/A'}</span>
                             </div>
                              <div className="grid gap-1">
                                 <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Biography</span>
                                 <p className="text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800 max-h-32 overflow-y-auto italic">
                                    "{user.bio || 'No biography provided yet.'}"
                                 </p>
                             </div>
                             <div className="text-xs text-gray-400 italic">
                                Member since {new Date(user.created_at).toLocaleDateString()}
                             </div>
                         </div>

                         {/* Financial Info */}
                         <div className="space-y-4">
                             <div className="flex items-center gap-2 font-semibold text-lg border-b pb-1 text-gray-900 dark:text-gray-100">
                                <ShieldAlert className="h-4 w-4" /> Payment Details
                             </div>
                             <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 grid gap-4">
                                <div className="grid gap-1 border-b border-indigo-100 dark:border-indigo-900/50 pb-2">
                                    <span className="text-xs text-gray-500 font-bold">CURRENT BALANCE</span>
                                    <span className="text-3xl font-black text-green-600">${(user.balance || 0).toFixed(2)}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-1">
                                        <span className="text-[10px] text-gray-400 font-bold">BANK NAME</span>
                                        <span className="text-sm font-medium">{user.bank_name || 'Not set'}</span>
                                    </div>
                                    <div className="grid gap-1">
                                        <span className="text-[10px] text-gray-400 font-bold">IFSC CODE</span>
                                        <span className="text-sm font-mono font-medium uppercase">{user.ifsc_code || 'Not set'}</span>
                                    </div>
                                </div>
                                <div className="grid gap-1">
                                    <span className="text-[10px] text-gray-400 font-bold">ACCOUNT NUMBER</span>
                                    <span className="text-sm font-mono font-medium tracking-widest">{user.account_number || 'Not set'}</span>
                                </div>
                                <div className="grid gap-1">
                                    <span className="text-[10px] text-gray-400 font-bold">PAN / TAX ID</span>
                                    <span className="text-sm font-mono font-medium uppercase">{user.pan_number || 'Not set'}</span>
                                </div>
                             </div>
                         </div>
                    </div>
                </TabsContent>

                <TabsContent value="tracks" className="pt-4">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold flex items-center gap-2"><Music className="h-4 w-4" /> Uploaded Tracks ({tracks.length})</h3>
                            <Button variant="outline" size="sm" onClick={fetchTracks} disabled={isLoadingTracks}>
                                {isLoadingTracks ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Refresh'}
                            </Button>
                        </div>
                        <div className="border rounded-xl overflow-hidden bg-white dark:bg-gray-900">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                                        <TableHead>Title</TableHead>
                                        <TableHead>Album</TableHead>
                                        <TableHead>Genre</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tracks.map((track) => (
                                        <TableRow key={track.id}>
                                            <TableCell className="font-medium">{track.title}</TableCell>
                                            <TableCell className="text-sm text-gray-500">{track.albums?.title || 'Single'}</TableCell>
                                            <TableCell className="text-xs">{track.genre}</TableCell>
                                            <TableCell>
                                                <Badge variant={track.status === 'approved' ? 'default' : track.status === 'rejected' ? 'destructive' : 'outline'} className="text-[10px] uppercase">
                                                    {track.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-400">{new Date(track.created_at).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {tracks.length === 0 && !isLoadingTracks && (
                                        <TableRow><TableCell colSpan={5} className="text-center py-10 text-gray-400">No tracks uploaded yet.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="funds" className="pt-4">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-1 border-r pr-6">
                            <FundsManager userId={user.id} currentBalance={user.balance || 0} onSuccess={fetchHistory} />
                        </div>
                        <div className="col-span-2 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold flex items-center gap-2"><History className="h-4 w-4" /> Transaction History</h3>
                                <Button variant="ghost" size="sm" onClick={fetchHistory} disabled={isLoadingHistory}>
                                    {isLoadingHistory ? <Loader2 className="h-3 w-3 animate-spin" /> : <History className="h-3 w-3" />}
                                </Button>
                            </div>
                            <div className="border rounded-xl overflow-hidden bg-white dark:bg-gray-900 max-h-[400px] overflow-y-auto">
                                <Table>
                                    <TableBody>
                                        {history.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{log.description}</span>
                                                        <span className="text-[10px] text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className="font-bold text-green-600">+${log.amount.toFixed(2)}</span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {history.length === 0 && !isLoadingHistory && (
                                            <TableRow><TableCell className="text-center py-10 text-gray-400">No transactions found.</TableCell></TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="admin" className="pt-4">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <ShieldAlert className="h-4 w-4 text-red-500" /> Account Status
                                </h3>
                                <p className="text-sm text-gray-500">Manage user access to the platform.</p>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="font-medium">Current Status</p>
                                    <Badge variant={currentStatus === 'banned' ? 'destructive' : currentStatus === 'suspended' ? 'outline' : 'secondary'} className="uppercase text-[10px]">
                                        {currentStatus || 'Active'}
                                    </Badge>
                                </div>
                                <div className="flex gap-2">
                                    {currentStatus !== 'active' && (
                                        <Button size="sm" variant="outline" className="text-green-600 bg-white" onClick={() => handleStatusChange('active')}>
                                            <CheckCircle2 className="h-4 w-4 mr-1" /> Activate
                                        </Button>
                                    )}
                                    {currentStatus !== 'suspended' && (
                                        <Button size="sm" variant="outline" className="text-yellow-600 bg-white" onClick={() => handleStatusChange('suspended')}>
                                            Suspend
                                        </Button>
                                    )}
                                    {currentStatus !== 'banned' && (
                                        <Button size="sm" variant="destructive" onClick={() => handleStatusChange('banned')}>
                                            <Ban className="h-4 w-4 mr-1" /> Ban Account
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Admin Internal Notes
                            </h3>
                            <AdminNotesManager userId={user.id} initialNotes={user.admin_notes || ''} />
                        </div>
                    </div>
                </TabsContent>
             </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FundsManager({ userId, currentBalance, onSuccess }: { userId: string, currentBalance: number, onSuccess: () => void }) {
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
            onSuccess()
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
             <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 uppercase font-bold">Wallet Balance</p>
                <p className="text-3xl font-black text-indigo-600">${currentBalance.toFixed(2)}</p>
            </div>

            <form onSubmit={handleAddFunds} className="space-y-4 pt-2">
                <div className="space-y-1">
                    <h3 className="font-bold text-sm">Add Revenue / Payout</h3>
                    <p className="text-[10px] text-gray-400">Credit the user's wallet with earnings.</p>
                </div>
                
                <div className="grid gap-1.5">
                    <label className="text-xs font-bold text-gray-700">Amount ($)</label>
                    <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        required 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)}
                        className="bg-white"
                    />
                </div>
                <div className="grid gap-1.5">
                    <label className="text-xs font-bold text-gray-700">Description</label>
                    <Input 
                        type="text" 
                        placeholder="e.g. November 2023 Royalties" 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="bg-white"
                    />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Add Funds
                </Button>
            </form>
        </div>
    )
}

function AdminNotesManager({ userId, initialNotes }: { userId: string, initialNotes: string }) {
    const [notes, setNotes] = useState(initialNotes)
    const [isSaving, setIsSaving] = useState(false)

    async function handleSaveNotes() {
        setIsSaving(true)
        try {
            await updateAdminNotes(userId, notes)
            toast.success("Admin notes saved")
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-3">
            <Textarea 
                placeholder="Internal notes about this user (only visible to admins)..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="min-h-[200px] bg-white dark:bg-gray-950"
            />
            <Button size="sm" onClick={handleSaveNotes} disabled={isSaving} className="w-full">
                {isSaving ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                Save Internal Notes
            </Button>
        </div>
    )
}
