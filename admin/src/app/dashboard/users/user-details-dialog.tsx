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
import { Eye, Loader2, Music, History, ShieldAlert, FileText, Ban, CheckCircle2, Copy, Mail, Phone, Calendar, CreditCard, Landmark, Wallet, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
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

  const handleCopy = (text: string, label: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied`)
  }

  const exportTransactionsCSV = () => {
    if (history.length === 0) {
      toast.error("No transactions to export")
      return
    }

    // Create CSV content
    const headers = ['Date', 'Description', 'Type', 'Amount', 'Balance After']
    const rows = history.map(log => [
      new Date(log.created_at).toLocaleString(),
      log.description || 'N/A',
      log.amount >= 0 ? 'Credit' : 'Debit',
      `$${Math.abs(log.amount).toFixed(2)}`,
      log.balance_after ? `$${log.balance_after.toFixed(2)}` : 'N/A'
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${user.full_name || user.email}_transactions_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Transactions exported successfully")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors rounded-lg">
             <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-6xl w-full h-[600px] p-0 overflow-hidden bg-zinc-950/90 backdrop-blur-xl border-white/10 text-white rounded-2xl flex flex-col shadow-2xl">
        <DialogHeader className="px-6 py-3 border-b border-white/5 flex-shrink-0 bg-white/[0.02]">
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
        
        <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
            <div className="px-6 pt-4 flex-shrink-0">
                    <TabsList className="grid w-full grid-cols-4 bg-zinc-900/50 p-1 rounded-xl border border-white/5">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 font-bold uppercase text-[10px] tracking-wider">Overview</TabsTrigger>
                    <TabsTrigger value="tracks" onClick={fetchTracks} className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 font-bold uppercase text-[10px] tracking-wider">Tracks</TabsTrigger>
                    <TabsTrigger value="funds" onClick={fetchHistory} className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 font-bold uppercase text-[10px] tracking-wider">Wallet</TabsTrigger>
                    <TabsTrigger value="admin" className="data-[state=active]:bg-red-500/10 data-[state=active]:text-red-400 text-zinc-500 font-bold uppercase text-[10px] tracking-wider">Admin Zone</TabsTrigger>
                </TabsList>
            </div>
                
                <TabsContent value="overview" className="flex-1 mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 p-4 pb-4 min-h-0 overflow-hidden">
                    <div className="flex h-full rounded-2xl border border-white/10 overflow-hidden bg-zinc-900/50 shadow-2xl">
                        {/* LEFT PANEL: Profile Sidebar (Fixed Width) */}
                        <div className="w-72 flex-shrink-0 bg-zinc-950/80 p-4 flex flex-col border-r border-white/5 relative overflow-hidden">
                            {/* Avatar & Name */}
                            <div className="text-center mb-3">
                                <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-2 ring-black/20 mb-2">
                                    <span className="font-black text-2xl text-white">{(user.full_name || 'U')[0]}</span>
                                </div>
                                <h3 className="font-black text-lg text-white tracking-tight leading-none mb-1">{user.full_name || 'Unknown'}</h3>
                                <div className="flex items-center justify-center gap-1.5 text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                                    <Music className="h-2.5 w-2.5" /> {user.artist_name || 'No Artist Profile'}
                                </div>
                            </div>

                            {/* Metadata List - ID Card Style */}
                            <div className="space-y-2.5 flex-1 overflow-hidden">
                                <div className="p-2.5 bg-white/[0.03] rounded-lg border border-white/5 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                            <Mail className="h-3.5 w-3.5 text-indigo-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">Email</span>
                                            <div 
                                                className="text-[11px] font-bold text-zinc-200 truncate cursor-pointer hover:text-white transition-colors"
                                                onClick={() => handleCopy(user.email, "Email")}
                                            >
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="h-px bg-white/5" />

                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                            <Phone className="h-3.5 w-3.5 text-purple-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">Phone</span>
                                            <div className="text-[11px] font-bold text-zinc-200 truncate">
                                                {user.phone || 'Not Linked'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/5" />

                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                                            <Calendar className="h-3.5 w-3.5 text-pink-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">Member Since</span>
                                            <div className="text-[11px] font-bold text-zinc-200 truncate">
                                                {new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {user.bio && (
                                    <div className="p-2.5 bg-white/[0.03] rounded-lg border border-white/5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <FileText className="h-3 w-3 text-zinc-500" />
                                            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Bio</span>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 italic leading-snug line-clamp-2">
                                            "{user.bio}"
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-auto pt-2 border-t border-white/5 text-[8px] text-zinc-600 text-center font-medium uppercase tracking-widest flex justify-between items-center">
                                <span>User ID</span>
                                <span className="font-mono bg-black/40 px-1.5 py-0.5 rounded text-zinc-500">{user.id.slice(0, 8)}...</span>
                            </div>
                        </div>

                        {/* RIGHT PANEL: Financial Workspace (Flexible) */}
                        <div className="flex-1 bg-zinc-900/30 p-5 flex flex-col relative min-w-0 overflow-hidden">
                            {/* Background Gradients */}
                             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[90px] -mr-40 -mt-40 pointer-events-none"></div>
                             
                            {/* Balance Section (Top) */}
                            <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-white/5">
                                <div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Live Wallet Balance</span>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-white tracking-tight">
                                                ${(user.balance || 0).toFixed(2)}
                                            </span>
                                            <span className="text-[10px] font-medium text-zinc-500">USD</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Quick Stats (Mocked for Visual Completeness) */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-white/[0.03] rounded-lg p-1.5 border border-white/5 flex flex-col justify-center">
                                        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Total Tracks</span>
                                        <span className="text-base font-black text-white">--</span>
                                    </div>
                                    <div className="bg-white/[0.03] rounded-lg p-1.5 border border-white/5 flex flex-col justify-center">
                                        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Lifetime Payouts</span>
                                        <span className="text-base font-black text-white">$0.00</span>
                                    </div>
                                </div>
                            </div>

                             {/* Bank Details Grid (Bottom) */}
                             <div className="flex-1 overflow-hidden">
                                 <div className="flex items-center justify-between mb-2">
                                     <div className="flex items-center gap-2 text-zinc-500">
                                        <Landmark className="h-4 w-4" />
                                        <span className="text-xs font-black uppercase tracking-widest">Banking Profile</span>
                                    </div>
                                    <Badge variant="outline" className={`h-5 border text-[9px] uppercase font-bold tracking-wider ${user.bank_name ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-zinc-500 border-zinc-500/20 bg-zinc-500/5'}`}>
                                        {user.bank_name ? 'Linked' : 'Not Linked'}
                                    </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2.5">
                                    {[
                                        { label: 'Bank Name', value: user.bank_name, icon: Landmark },
                                        { label: 'Account No.', value: user.account_number, icon: CreditCard, mono: true },
                                        { label: 'IFSC Code', value: user.ifsc_code, icon: FileText, mono: true },
                                        { label: 'Tax ID / PAN', value: user.pan_number, icon: ShieldAlert, mono: true },
                                        { label: 'PayPal', value: user.paypal_email, icon: Wallet, mono: true },
                                        { label: 'UPI ID', value: user.upi_id, icon: Wallet, mono: true },
                                    ].map((item, idx) => (
                                        <div 
                                            key={idx}
                                            className={`group/item relative p-2 rounded-lg border transition-all ${item.value ? 'bg-white/[0.03] hover:bg-white/[0.05] border-white/5 hover:border-white/10' : 'bg-transparent border-white/5 opacity-60'}`}
                                        >
                                            <div className="flex items-start justify-between mb-1">
                                                <div className="flex items-center gap-1.5 text-zinc-500">
                                                    <item.icon className="h-3 w-3" />
                                                    <span className="text-[8px] font-bold uppercase tracking-widest">{item.label}</span>
                                                </div>
                                                {item.value && (
                                                    <button 
                                                        onClick={() => handleCopy(item.value, item.label)}
                                                        className="opacity-0 group-hover/item:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                                                    >
                                                        <Copy className="h-3 w-3 text-indigo-400" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className={`text-[11px] font-bold truncate ${item.value ? 'text-zinc-200' : 'text-zinc-600 italic'} ${item.mono && item.value ? 'font-mono' : ''}`}>
                                                {item.value || 'Not Set'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="tracks" className="flex-1 mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 p-4 pb-3 min-h-0 overflow-hidden">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-3 px-1">
                            <h3 className="font-black text-base flex items-center gap-2 uppercase tracking-tight">
                                <Music className="h-3.5 w-3.5 text-indigo-400" /> 
                                Uploaded Tracks 
                                <span className="text-xs text-zinc-600">({tracks.length})</span>
                            </h3>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={fetchTracks} 
                                disabled={isLoadingTracks} 
                                className="bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 h-7 text-[10px] font-bold uppercase tracking-wider px-3"
                            >
                                {isLoadingTracks ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Refresh'}
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 border border-white/5 rounded-xl bg-zinc-900/30">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 bg-white/[0.02] hover:bg-white/[0.02]">
                                        <TableHead className="text-[9px] uppercase font-black tracking-widest text-zinc-500 h-8 py-2">Title</TableHead>
                                        <TableHead className="text-[9px] uppercase font-black tracking-widest text-zinc-500 h-8 py-2">Album</TableHead>
                                        <TableHead className="text-[9px] uppercase font-black tracking-widest text-zinc-500 h-8 py-2">Genre</TableHead>
                                        <TableHead className="text-[9px] uppercase font-black tracking-widest text-zinc-500 h-8 py-2">Status</TableHead>
                                        <TableHead className="text-[9px] uppercase font-black tracking-widest text-zinc-500 h-8 py-2">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tracks.map((track) => (
                                        <TableRow key={track.id} className="border-white/5 hover:bg-white/[0.03] transition-colors">
                                            <TableCell className="font-bold text-white text-xs py-2.5">{track.title}</TableCell>
                                            <TableCell className="text-xs text-zinc-400 py-2.5">{track.albums?.title || 'Single'}</TableCell>
                                            <TableCell className="text-[10px] text-zinc-500 uppercase tracking-wider py-2.5">{track.genre}</TableCell>
                                            <TableCell className="py-2.5">
                                                <Badge 
                                                    variant="outline" 
                                                    className={`text-[9px] uppercase font-black tracking-wider h-5 px-2 ${
                                                        track.status === 'approved' 
                                                            ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' 
                                                            : track.status === 'rejected' 
                                                            ? 'text-red-400 border-red-500/30 bg-red-500/10' 
                                                            : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                                                    }`}
                                                >
                                                    {track.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-[10px] text-zinc-500 font-mono tracking-tighter py-2.5">
                                                {new Date(track.created_at).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {tracks.length === 0 && !isLoadingTracks && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-[200px]">
                                                <div className="flex flex-col items-center justify-center text-center py-8">
                                                    <Music className="h-12 w-12 text-zinc-800 mb-3" />
                                                    <p className="text-sm font-bold text-zinc-500 mb-1">No Tracks Uploaded</p>
                                                    <p className="text-xs text-zinc-600">This user hasn't uploaded any music yet.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {isLoadingTracks && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-[200px]">
                                                <div className="flex items-center justify-center">
                                                    <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                    </div>
                </TabsContent>

                <TabsContent value="funds" className="flex-1 mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 p-4 pb-3 min-h-0 overflow-hidden">
                    <div className="grid grid-cols-[300px_1fr] gap-4 h-full">
                        <div className="border-r border-white/5 pr-4">
                            <FundsManager userId={user.id} currentBalance={user.balance || 0} onSuccess={fetchHistory} />
                        </div>
                        <div className="flex flex-col min-h-0">
                            <div className="flex justify-between items-center mb-3 px-1">
                                <h3 className="font-black text-base flex items-center gap-2 uppercase tracking-tight">
                                    <History className="h-3.5 w-3.5 text-emerald-400" /> 
                                    Transaction History
                                </h3>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={exportTransactionsCSV}
                                        disabled={history.length === 0}
                                        className="bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 h-7 text-[10px] font-bold uppercase tracking-wider px-3"
                                    >
                                        <Download className="h-3 w-3 mr-1.5" /> Export CSV
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={fetchHistory} 
                                        disabled={isLoadingHistory} 
                                        className="text-zinc-500 hover:text-white h-7 px-2"
                                    >
                                        {isLoadingHistory ? <Loader2 className="h-3 w-3 animate-spin" /> : <History className="h-3 w-3" />}
                                    </Button>
                                </div>
                            </div>
                            <ScrollArea className="flex-1 border border-white/5 rounded-xl bg-zinc-900/30">
                                <Table>
                                    <TableBody>
                                        {history.map((log) => (
                                            <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.03] transition-colors">
                                                <TableCell className="py-2.5">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-zinc-300">{log.description}</span>
                                                        <span className="text-[10px] text-zinc-600 font-mono">{new Date(log.created_at).toLocaleString()}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right py-2.5">
                                                    <span className={`font-mono font-bold text-sm ${log.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        {log.amount >= 0 ? '+' : ''}{Math.abs(log.amount).toFixed(2)}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {history.length === 0 && !isLoadingHistory && (
                                            <TableRow>
                                                <TableCell colSpan={2} className="h-[200px]">
                                                    <div className="flex flex-col items-center justify-center text-center py-8">
                                                        <History className="h-12 w-12 text-zinc-800 mb-3" />
                                                        <p className="text-sm font-bold text-zinc-500 mb-1">No Transactions</p>
                                                        <p className="text-xs text-zinc-600">No transaction history found.</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {isLoadingHistory && (
                                            <TableRow>
                                                <TableCell colSpan={2} className="h-[200px]">
                                                    <div className="flex items-center justify-center">
                                                        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                <ScrollBar orientation="vertical" />
                            </ScrollArea>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="admin" className="flex-1 mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 p-4 pb-3 min-h-0 overflow-hidden">
                    <div className="grid grid-cols-2 gap-6 h-full">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <h3 className="font-black text-base flex items-center gap-2 text-red-400 uppercase tracking-tight">
                                    <ShieldAlert className="h-3.5 w-3.5" /> Account Status
                                </h3>
                                <p className="text-[10px] text-zinc-500 font-medium">Manage user access & permissions.</p>
                            </div>
                            
                            <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10 space-y-3">
                                <div className="flex items-center justify-between border-b border-red-500/10 pb-3">
                                    <span className="text-xs font-bold text-red-200">Current Status</span>
                                    <Badge className={`uppercase text-[9px] tracking-widest border px-2.5 py-0.5 ${currentStatus === 'banned' ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'}`}>
                                        {currentStatus || 'Active'}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {currentStatus !== 'active' && (
                                        <Button variant="outline" className="w-full text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white h-8 text-[10px] font-bold uppercase tracking-wider justify-start pl-3" onClick={() => handleStatusChange('active')}>
                                            <CheckCircle2 className="h-3 w-3 mr-2" /> Activate Account
                                        </Button>
                                    )}
                                    {currentStatus !== 'suspended' && (
                                        <Button variant="outline" className="w-full text-amber-400 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500 hover:text-white h-8 text-[10px] font-bold uppercase tracking-wider justify-start pl-3" onClick={() => handleStatusChange('suspended')}>
                                            <ShieldAlert className="h-3 w-3 mr-2" /> Suspend Access
                                        </Button>
                                    )}
                                    {currentStatus !== 'banned' && (
                                        <Button className="w-full bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-600 hover:text-white h-8 text-[10px] font-bold uppercase tracking-wider justify-start pl-3" onClick={() => handleStatusChange('banned')}>
                                            <Ban className="h-3 w-3 mr-2" /> Ban User Permanently
                                        </Button>
                                    )}
                                    <div className="pt-2 border-t border-red-500/10 mt-1">
                                        <Button variant="ghost" className="w-full text-indigo-300 hover:text-white hover:bg-white/10 h-8 text-[10px] font-bold uppercase tracking-wider justify-start pl-3" onClick={handleImpersonate}>
                                            <ShieldAlert className="h-3 w-3 mr-2" /> Impersonate User
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-black text-base flex items-center gap-2 uppercase tracking-tight text-white">
                                <FileText className="h-3.5 w-3.5" /> Admin Internal Notes
                            </h3>
                            <AdminNotesManager userId={user.id} initialNotes={user.admin_notes || ''} />
                        </div>
                    </div>
                </TabsContent>
             </Tabs>
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
        <div className="space-y-4">
             <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center shadow-lg">
                <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-0.5">Wallet Balance</p>
                <p className={`text-3xl font-black tracking-tight ${currentBalance < 0 ? 'text-red-400' : 'bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'}`}>
                    ${currentBalance.toFixed(2)}
                </p>
            </div>

            <form onSubmit={handleAddFunds} className="space-y-3">
                <div className="space-y-0.5">
                    <h3 className="font-bold text-xs text-white">Manual Adjustment</h3>
                    <p className="text-[9px] text-zinc-500 font-medium">Credit or debit the user's wallet.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-900 rounded-lg border border-white/5">
                    <button 
                        type="button"
                        onClick={() => setType('credit')}
                        className={`text-[9px] font-black uppercase tracking-wider py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${type === 'credit' ? 'bg-emerald-500/10 text-emerald-400 shadow-lg border border-emerald-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                         + Credit
                    </button>
                    <button 
                        type="button"
                        onClick={() => setType('debit')}
                        className={`text-[9px] font-black uppercase tracking-wider py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${type === 'debit' ? 'bg-red-500/10 text-red-400 shadow-lg border border-red-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                         - Debit
                    </button>
                </div>

                <div className="space-y-2.5">
                    <div className="grid gap-1">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">Amount ($)</label>
                        <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            required 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)}
                            className="bg-zinc-900/50 border-white/5 text-white placeholder:text-zinc-700 font-mono font-bold text-base h-10 rounded-lg"
                        />
                    </div>
                    <div className="grid gap-1">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">Description</label>
                        <Input 
                            type="text" 
                            placeholder={type === 'credit' ? "e.g. Bonus" : "e.g. Correction"}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="bg-zinc-900/50 border-white/5 text-white placeholder:text-zinc-700 h-9 rounded-lg text-xs"
                        />
                    </div>
                </div>
                
                <Button type="submit" disabled={isLoading} className={`w-full font-bold uppercase tracking-wide text-[10px] h-9 rounded-lg shadow-lg transition-all ${type === 'credit' ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-red-500 hover:bg-red-400 text-white'}`}>
                    {isLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                    {type === 'credit' ? 'Add Funds' : 'Deduct Funds'}
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
        <div className="space-y-2.5">
            <Textarea 
                placeholder="Internal notes about this user (only visible to admins)..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="min-h-[150px] bg-zinc-900/50 border-white/5 text-zinc-300 placeholder:text-zinc-700 resize-none rounded-xl text-xs"
            />
            <Button size="sm" onClick={handleSaveNotes} disabled={isSaving} className="w-full bg-white text-black hover:bg-zinc-200 font-bold uppercase text-[10px] tracking-wider h-8">
                {isSaving ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                Save Internal Notes
            </Button>
        </div>
    )
}
