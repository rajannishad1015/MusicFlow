import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ChevronLeft, Send, User, Shield, Lock, CheckCircle, XCircle, Clock, ExternalLink, FileIcon } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { adminReplyTx, updateTicketStatus } from '@/app/dashboard/support/actions'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AttachmentPreview from './attachment-preview' // Only used in ChatInterface essentially, but leaving if used elsewhere? No, it was only in the loop.
import ChatInterface from './chat-interface'

export default async function AdminTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { id } = await params

  // Check Admin
  const { data: admin } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  if (admin?.role !== 'admin') return notFound()

  // Fetch Ticket
  const { data: ticket } = await supabase
    .from('tickets')
    .select('*, profiles(full_name, artist_name, email, id)')
    .eq('id', id)
    .single()

  if (!ticket) return notFound()

  // Fetch Messages (Include Internal)
  const { data: messages } = await supabase
    .from('ticket_messages')
    .select('*, profiles(full_name, artist_name, role)')
    .eq('ticket_id', ticket.id)
    .order('created_at', { ascending: true })

  const getStatusBadge = (status: string) => {
     switch (status) {
      case 'open': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'resolved': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-6">
       {/* Header */}
       <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/support">
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5">
                        <ChevronLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-black text-white">{ticket.subject}</h1>
                        <Badge variant="outline" className={`capitalize border shadow-[0_0_10px_rgba(0,0,0,0.2)] ${getStatusBadge(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-2 mt-1">
                        <span>Ticket #{ticket.id.slice(0, 8)}</span>
                        <span>•</span>
                        <span className="capitalize">{ticket.category}</span>
                        <span>•</span>
                        <span>{new Date(ticket.created_at).toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <form action={updateTicketStatus} className="flex items-center gap-2">
                    <input type="hidden" name="ticketId" value={ticket.id} />
                    <Select name="status" defaultValue={ticket.status}>
                        <SelectTrigger className="w-[180px] bg-zinc-900 border-white/10 text-white">
                            <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-white/10 text-white">
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button type="submit" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border border-white/5">Update</Button>
                </form>

                {ticket.status !== 'resolved' && (
                    <form action={updateTicketStatus}>
                        <input type="hidden" name="ticketId" value={ticket.id} />
                        <input type="hidden" name="status" value="resolved" />
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-emerald-500/50">
                            <CheckCircle size={16} /> Mark Resolved
                        </Button>
                    </form>
                )}
            </div>
       </div>

       <div className="flex-1 flex gap-6 overflow-hidden">
            {/* Chat Area */}
            <div className="flex-1 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden flex flex-col shadow-2xl">
                <div className="flex-1 p-6 overflow-y-auto">
                    <ChatInterface 
                        initialMessages={messages || []} 
                        ticketId={ticket.id} 
                        adminId={user?.id || ''} 
                    />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-zinc-950/50 border-t border-white/5 backdrop-blur-xl">
                    <form action={adminReplyTx} className="space-y-3">
                        <input type="hidden" name="ticketId" value={ticket.id} />
                        <div className="flex justify-between items-center mb-2">
                             <div className="flex items-center gap-4">
                                 <label className="flex items-center gap-2 text-xs text-zinc-400 font-bold uppercase tracking-wider cursor-pointer hover:text-white transition-colors">
                                    <input type="checkbox" name="isInternal" className="rounded bg-zinc-800 border-zinc-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-zinc-900" />
                                    <span className="flex items-center gap-1.5"><Lock size={10} /> Internal Note</span>
                                 </label>
                                 <div className="h-4 w-px bg-white/10" />
                                 <div className="relative group">
                                    <Input 
                                        type="file" 
                                        name="attachment" 
                                        className="hidden" 
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="flex items-center gap-1.5 text-xs text-zinc-400 font-bold uppercase tracking-wider cursor-pointer hover:text-white transition-colors">
                                        <FileIcon size={12} /> Attach File
                                    </label>
                                 </div>
                             </div>
                        </div>
                        <div className="relative">
                            <Textarea 
                                name="message" 
                                required 
                                placeholder="Type your reply..." 
                                className="pr-24 bg-zinc-900/80 border-white/10 min-h-[80px] text-white placeholder:text-zinc-600 focus:bg-zinc-900 focus:border-indigo-500/50 resize-none"
                            />
                            <Button type="submit" size="sm" className="absolute right-3 bottom-3 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                                <Send size={14} className="mr-2" /> Send
                            </Button>
                        </div>
                    </form>
                </div>
           </div>

           {/* User Info Sidebar */}
           <div className="w-80 shrink-0 space-y-6">
                <Card className="bg-zinc-900/40 backdrop-blur-md border-white/5 shadow-xl text-white">
                    <CardHeader className="pb-3 border-b border-white/5">
                        <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">User Intelligence</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shadow-inner">
                                <User className="text-zinc-300" size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-white text-lg tracking-tight leading-none mb-1">{ticket.profiles?.artist_name}</div>
                                <div className="text-xs text-zinc-500 font-medium">{ticket.profiles?.full_name}</div>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                             <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-zinc-500 font-medium">Email</span>
                                <span className="font-bold text-zinc-300 truncate max-w-[150px]">{ticket.profiles?.email}</span>
                             </div>
                             <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-zinc-500 font-medium">User ID</span>
                                <span className="font-mono text-[10px] text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded">{ticket.profiles?.id.slice(0,8)}</span>
                             </div>
                        </div>
                        <Link href={`/dashboard/users/${ticket.profiles?.id}`} className="block">
                            <Button variant="outline" className="w-full bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all">View Full Profile</Button>
                        </Link>
                    </CardContent>
                </Card>
           </div>
       </div>
    </div>
  )
}
