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
import { Eye, Loader2, Music, History, ShieldAlert, FileText, Ban, CheckCircle2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { adjustUserBalance } from "./funds-actions"
import { getUserTracks, getTransactionHistory, updateUserStatus, updateAdminNotes, impersonateUser } from "./actions"
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

  const handleImpersonate = async () => {
    if (!confirm("This will generate a magic link to log in as this user. Proceed?")) return
    
    try {
        const link = await impersonateUser(user.id)
        if (link) {
            window.open(link, '_blank')
            toast.success("Opening user session in new tab...")
        } else {
            toast.error("Failed to generate link")
        }
    } catch (err: any) {
        toast.error(err.message)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors rounded-lg">
             <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-zinc-950/90 backdrop-blur-xl border-white/10 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl font-black uppercase tracking-tight">User Details</DialogTitle>
            <Badge variant="outline" className={`capitalize border ${currentStatus === 'banned' ? 'text-red-400 border-red-500/20 bg-red-500/10' : currentStatus === 'suspended' ? 'text-amber-400 border-amber-500/20 bg-amber-500/10' : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'}`}>
                {currentStatus || 'active'}
            </Badge>
          </div>
          <DialogDescription className="text-zinc-500 font-medium">
            Managing <span className="text-zinc-300">{user.artist_name || user.full_name || user.email}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
             <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-zinc-900/50 p-1 rounded-xl border border-white/5">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 font-bold uppercase text-[10px] tracking-wider">Overview</TabsTrigger>
                    <TabsTrigger value="tracks" onClick={fetchTracks} className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 font-bold uppercase text-[10px] tracking-wider">Tracks</TabsTrigger>
                    <TabsTrigger value="funds" onClick={fetchHistory} className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 font-bold uppercase text-[10px] tracking-wider">Wallet</TabsTrigger>
                    <TabsTrigger value="admin" className="data-[state=active]:bg-red-500/10 data-[state=active]:text-red-400 text-zinc-500 font-bold uppercase text-[10px] tracking-wider">Admin Zone</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="pt-6 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         {/* General Info */}
                         <div className="space-y-6">
                             <div className="flex items-center gap-2 font-black text-xl border-b border-white/5 pb-3 text-white tracking-tight uppercase">
                                <FileText className="h-5 w-5 text-indigo-400" /> Profile Info
                             </div>
                             <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-1.5">
                                    <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Full Name</span>
                                    <span className="font-bold text-base">{user.full_name || 'N/A'}</span>
                                </div>
                                <div className="grid gap-1.5">
                                    <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Artist Name</span>
                                    <span className="font-bold text-base text-indigo-400">{user.artist_name || 'N/A'}</span>
                                </div>
                             </div>
                             <div className="grid gap-1.5">
                                 <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Email Address</span>
                                 <span className="font-bold text-base text-zinc-300 font-mono">{user.email}</span>
                             </div>
                             <div className="grid gap-1.5">
                                 <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Phone Number</span>
                                 <span className="font-medium text-base text-zinc-300">{user.phone || 'N/A'}</span>
                             </div>
                              <div className="grid gap-1.5">
                                 <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Biography</span>
                                 <p className="text-sm bg-zinc-900/50 text-zinc-400 p-4 rounded-xl border border-white/5 max-h-40 overflow-y-auto italic leading-relaxed">
                                    "{user.bio || 'No biography provided yet.'}"
                                 </p>
                             </div>
                             <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest pt-2">
                                Member since {new Date(user.created_at).toLocaleDateString()}
                             </div>
                         </div>

                         {/* Financial Info */}
                         <div className="space-y-6">
                             <div className="flex items-center gap-2 font-black text-xl border-b border-white/5 pb-3 text-white tracking-tight uppercase">
                                <ShieldAlert className="h-5 w-5 text-emerald-400" /> Payment Details
                             </div>
                             <div className="relative group overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 rounded-3xl border border-white/10 shadow-2xl min-h-[400px] flex flex-col justify-between">
                                {/* Decor effects */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                                
                                <div className="relative">
                                    <div className="grid gap-2 border-b border-white/5 pb-6 mb-6">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs text-zinc-500 font-black tracking-widest uppercase">Current Balance</span>
                                            <Badge variant="outline" className="text-emerald-400 border-emerald-500/20 bg-emerald-500/5 text-[10px] uppercase font-bold tracking-wider">
                                                Verified Wallet
                                            </Badge>
                                        </div>
                                        <span className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent tracking-tighter">
                                            ${(user.balance || 0).toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="grid gap-1.5">
                                            <span className="text-[9px] text-zinc-500 font-black tracking-widest uppercase opacity-70">Bank Name</span>
                                            <span className="text-sm font-bold text-zinc-200 truncate">{user.bank_name || 'Not set'}</span>
                                        </div>
                                        <div className="grid gap-1.5">
                                            <span className="text-[9px] text-zinc-500 font-black tracking-widest uppercase opacity-70">IFSC Code</span>
                                            <span className="text-sm font-mono font-bold text-zinc-200 uppercase tracking-wide">{user.ifsc_code || 'Not set'}</span>
                                        </div>
                                        <div className="grid gap-1.5">
                                            <span className="text-[9px] text-zinc-500 font-black tracking-widest uppercase opacity-70">Account Number</span>
                                            <span className="text-sm font-mono font-bold text-zinc-200 tracking-widest">{user.account_number || 'Not set'}</span>
                                        </div>
                                        <div className="grid gap-1.5">
                                            <span className="text-[9px] text-zinc-500 font-black tracking-widest uppercase opacity-70">PAN / TAX ID</span>
                                            <span className="text-sm font-mono font-bold text-zinc-200 uppercase tracking-wide">{user.pan_number || 'Not set'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="relative pt-6 mt-auto">
                                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-full opacity-50"></div>
                                    </div>
                                    <p className="text-[10px] text-zinc-600 font-medium text-right mt-2 uppercase tracking-wide">
                                        Powered by MusicFlow Secure Payments
                                    </p>
                                </div>
                             </div>
                         </div>
                    </div>

                </TabsContent>

                <TabsContent value="tracks" className="pt-4 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black text-lg flex items-center gap-2 uppercase tracking-tight"><Music className="h-4 w-4 text-indigo-400" /> Uploaded Tracks ({tracks.length})</h3>
                            <Button variant="outline" size="sm" onClick={fetchTracks} disabled={isLoadingTracks} className="bg-zinc-900 border-white/10 text-zinc-400 hover:text-white h-7 text-xs font-bold uppercase tracking-wider">
                                {isLoadingTracks ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Refresh'}
                            </Button>
                        </div>
                        <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.02]">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 bg-white/[0.02] hover:bg-white/[0.02]">
                                        <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Title</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Album</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Genre</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Status</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tracks.map((track) => (
                                        <TableRow key={track.id} className="border-white/5 hover:bg-white/[0.02]">
                                            <TableCell className="font-bold text-white text-xs">{track.title}</TableCell>
                                            <TableCell className="text-xs text-zinc-500">{track.albums?.title || 'Single'}</TableCell>
                                            <TableCell className="text-[10px] text-zinc-600 uppercase tracking-wider">{track.genre}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`text-[9px] uppercase font-black tracking-wider h-4 px-1 ${track.status === 'approved' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : track.status === 'rejected' ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-zinc-400 border-zinc-500/20'}`}>
                                                    {track.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-[10px] text-zinc-500 font-mono tracking-tighter">{new Date(track.created_at).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {tracks.length === 0 && !isLoadingTracks && (
                                        <TableRow><TableCell colSpan={5} className="text-center py-10 text-zinc-600 font-medium">No tracks uploaded yet.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="funds" className="pt-4 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1 border-r border-white/5 pr-6">
                            <FundsManager userId={user.id} currentBalance={user.balance || 0} onSuccess={fetchHistory} />
                        </div>
                        <div className="col-span-2 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-black text-lg flex items-center gap-2 uppercase tracking-tight"><History className="h-4 w-4 text-emerald-400" /> Transaction History</h3>
                                <Button variant="ghost" size="sm" onClick={fetchHistory} disabled={isLoadingHistory} className="text-zinc-500 hover:text-white">
                                    {isLoadingHistory ? <Loader2 className="h-3 w-3 animate-spin" /> : <History className="h-3 w-3" />}
                                </Button>
                            </div>
                            <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.02] min-h-[300px] max-h-[400px] overflow-y-auto">
                                <Table>
                                    <TableBody>
                                        {history.map((log) => (
                                            <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02]">
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-zinc-300">{log.description}</span>
                                                        <span className="text-[10px] text-zinc-600 font-mono">{new Date(log.created_at).toLocaleString()}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className={`font-mono font-bold ${log.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        {log.amount >= 0 ? '+' : ''}{Math.abs(log.amount).toFixed(2)}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {history.length === 0 && !isLoadingHistory && (
                                            <TableRow>
                                                <TableCell className="text-center h-[300px] flex flex-col items-center justify-center text-zinc-600 font-medium">
                                                    <History className="h-8 w-8 mb-2 opacity-20" />
                                                    No transactions found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="admin" className="pt-4 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="font-black text-lg flex items-center gap-2 text-red-400 uppercase tracking-tight">
                                    <ShieldAlert className="h-4 w-4" /> Account Status
                                </h3>
                                <p className="text-xs text-zinc-500 font-medium">Manage user access & permissions.</p>
                            </div>
                            
                            <div className="bg-red-500/5 p-5 rounded-2xl border border-red-500/10 space-y-4">
                                <div className="flex items-center justify-between border-b border-red-500/10 pb-4">
                                    <span className="text-sm font-bold text-red-200">Current Status</span>
                                    <Badge className={`uppercase text-[10px] tracking-widest border px-3 py-1 ${currentStatus === 'banned' ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'}`}>
                                        {currentStatus || 'Active'}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {currentStatus !== 'active' && (
                                        <Button variant="outline" className="w-full text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white h-9 text-xs font-bold uppercase tracking-wider justify-start pl-4" onClick={() => handleStatusChange('active')}>
                                            <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Activate Account
                                        </Button>
                                    )}
                                    {currentStatus !== 'suspended' && (
                                        <Button variant="outline" className="w-full text-amber-400 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500 hover:text-white h-9 text-xs font-bold uppercase tracking-wider justify-start pl-4" onClick={() => handleStatusChange('suspended')}>
                                            <ShieldAlert className="h-3.5 w-3.5 mr-2" /> Suspend Access
                                        </Button>
                                    )}
                                    {currentStatus !== 'banned' && (
                                        <Button className="w-full bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-600 hover:text-white h-9 text-xs font-bold uppercase tracking-wider justify-start pl-4" onClick={() => handleStatusChange('banned')}>
                                            <Ban className="h-3.5 w-3.5 mr-2" /> Ban User Permanently
                                        </Button>
                                    )}
                                    <div className="pt-2 border-t border-red-500/10 mt-2">
                                        <Button variant="ghost" className="w-full text-indigo-300 hover:text-white hover:bg-white/10 h-9 text-xs font-bold uppercase tracking-wider justify-start pl-4" onClick={handleImpersonate}>
                                            <ShieldAlert className="h-3.5 w-3.5 mr-2" /> Impersonate User
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-black text-lg flex items-center gap-2 uppercase tracking-tight text-white">
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
    const [type, setType] = useState<'credit'|'debit'>('credit')
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleAddFunds(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('userId', userId)
            formData.append('amount', amount)
            formData.append('type', type)
            formData.append('description', description)
            
            const result = await adjustUserBalance(formData)
            
            if (!result.success) {
                toast.error(result.error || "Failed to update balance")
                return
            }

            toast.success("Balance updated successfully")
            setAmount('')
            setDescription('')
            onSuccess()
        } catch (err: any) {
            toast.error(err.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
             <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center shadow-lg">
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Wallet Balance</p>
                <p className={`text-4xl font-black tracking-tight ${currentBalance < 0 ? 'text-red-400' : 'bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'}`}>
                    ${currentBalance.toFixed(2)}
                </p>
            </div>

            <form onSubmit={handleAddFunds} className="space-y-4 pt-2">
                <div className="space-y-1">
                    <h3 className="font-bold text-sm text-white">Manual Adjustment</h3>
                    <p className="text-[10px] text-zinc-500 font-medium">Credit or debit the user's wallet.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-xl border border-white/5">
                    <button 
                        type="button"
                        onClick={() => setType('credit')}
                        className={`text-[10px] font-black uppercase tracking-wider py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${type === 'credit' ? 'bg-emerald-500/10 text-emerald-400 shadow-lg border border-emerald-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                         + Credit
                    </button>
                    <button 
                        type="button"
                        onClick={() => setType('debit')}
                        className={`text-[10px] font-black uppercase tracking-wider py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${type === 'debit' ? 'bg-red-500/10 text-red-400 shadow-lg border border-red-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                         - Debit
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="grid gap-1.5">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Amount ($)</label>
                        <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            required 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)}
                            className="bg-zinc-900/50 border-white/5 text-white placeholder:text-zinc-700 font-mono font-bold text-lg h-12 rounded-xl"
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Description</label>
                        <Input 
                            type="text" 
                            placeholder={type === 'credit' ? "e.g. Bonus" : "e.g. Correction"}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="bg-zinc-900/50 border-white/5 text-white placeholder:text-zinc-700 h-10 rounded-xl"
                        />
                    </div>
                </div>
                
                <Button type="submit" disabled={isLoading} className={`w-full font-bold uppercase tracking-wide text-xs h-11 rounded-xl shadow-lg transition-all ${type === 'credit' ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-red-500 hover:bg-red-400 text-white'}`}>
                    {isLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                    {type === 'credit' ? 'Data Saved' : 'Deduct Funds'}
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
                className="min-h-[200px] bg-zinc-900/50 border-white/5 text-zinc-300 placeholder:text-zinc-700 resize-none rounded-xl"
            />
            <Button size="sm" onClick={handleSaveNotes} disabled={isSaving} className="w-full bg-white text-black hover:bg-zinc-200 font-bold uppercase text-xs tracking-wider h-9">
                {isSaving ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                Save Internal Notes
            </Button>
        </div>
    )
}
