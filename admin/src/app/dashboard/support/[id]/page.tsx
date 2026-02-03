import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ChevronLeft, Send, User, Shield, Lock, CheckCircle, XCircle, Clock } from 'lucide-react'
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

export default async function AdminTicketPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check Admin
  const { data: admin } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  if (admin?.role !== 'admin') return notFound()

  // Fetch Ticket
  const { data: ticket } = await supabase
    .from('tickets')
    .select('*, profiles(full_name, artist_name, email, id)')
    .eq('id', params.id)
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
                    <Button variant="ghost" size="icon">
                        <ChevronLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900">{ticket.subject}</h1>
                        <Badge variant="outline" className={`capitalize ${getStatusBadge(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <span>Ticket #{ticket.id.slice(0, 8)}</span>
                        <span>•</span>
                        <span className="capitalize">{ticket.category}</span>
                        <span>•</span>
                        <span>{new Date(ticket.created_at).toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <form action={updateTicketStatus} className="flex items-center gap-2">
                <input type="hidden" name="ticketId" value={ticket.id} />
                <Select name="status" defaultValue={ticket.status}>
                    <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
                <Button type="submit" variant="secondary">Update</Button>
            </form>
       </div>

       <div className="flex-1 flex gap-6 overflow-hidden">
            {/* Chat Area */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-6">
                        {messages && messages.map((msg) => {
                            const isMe = msg.sender_id === user?.id
                            const isInternal = msg.is_internal
                            return (
                                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                    <Avatar className="h-8 w-8 border border-gray-200">
                                        <AvatarFallback className={isMe ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}>
                                            {isMe ? <Shield size={14} /> : <User size={14} />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`flex items-center gap-2 text-xs mb-1 ${isMe ? 'flex-row-reverse' : ''} text-gray-500`}>
                                            <span className="font-medium text-gray-900">
                                                {msg.profiles?.role === 'admin' ? 'Admin (' + msg.profiles?.full_name + ')' : (msg.profiles?.artist_name || 'User')}
                                            </span>
                                            {isInternal && <span className="flex items-center gap-1 text-amber-600 font-bold px-1.5 py-0.5 bg-amber-50 rounded text-[10px] uppercase tracking-wide"><Lock size={10} /> Internal Note</span>}
                                            <span>{new Date(msg.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                        </div>
                                        <div className={`p-3 rounded-lg text-sm shadow-sm ${
                                            isInternal 
                                                ? 'bg-amber-50 text-amber-900 border border-amber-200' 
                                                : isMe 
                                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                                    : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                                        }`}>
                                            {msg.message}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <form action={adminReplyTx} className="space-y-3">
                        <input type="hidden" name="ticketId" value={ticket.id} />
                        <div className="flex items-center gap-2 mb-2">
                             <input type="checkbox" name="isInternal" id="isInternal" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                             <label htmlFor="isInternal" className="text-xs text-gray-600 font-medium flex items-center gap-1 cursor-pointer select-none">
                                <Lock size={12} /> Post as Internal Note (User won't see this)
                             </label>
                        </div>
                        <div className="relative">
                            <Textarea 
                                name="message" 
                                required 
                                placeholder="Type your reply..." 
                                className="pr-12 bg-white border-gray-300 min-h-[80px]"
                            />
                            <Button type="submit" size="sm" className="absolute right-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Send size={14} className="mr-2" /> Send
                            </Button>
                        </div>
                    </form>
                </div>
           </div>

           {/* User Info Sidebar */}
           <div className="w-80 shrink-0 space-y-6">
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="pb-3 border-b border-gray-100">
                        <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">User Details</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="text-gray-500" />
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">{ticket.profiles?.artist_name}</div>
                                <div className="text-xs text-gray-500">{ticket.profiles?.full_name}</div>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                             <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Email</span>
                                <span className="font-medium text-gray-900">{ticket.profiles?.email}</span>
                             </div>
                             <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">User ID</span>
                                <span className="font-mono text-xs text-gray-500">{ticket.profiles?.id.slice(0,8)}...</span>
                             </div>
                        </div>
                        <Link href={`/dashboard/users/${ticket.profiles?.id}`} className="block">
                            <Button variant="outline" className="w-full">View Full Profile</Button>
                        </Link>
                    </CardContent>
                </Card>
           </div>
       </div>
    </div>
  )
}
