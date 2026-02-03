import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ChevronLeft, Send, Clock, User, Shield } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { replyTx } from './actions'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function TicketPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch Ticket
  const { data: ticket } = await supabase
    .from('tickets')
    .select('*, profiles(full_name, artist_name, email)')
    .eq('id', params.id)
    .single()

  if (!ticket) return notFound()

  // Verify Ownership (User)
  if (ticket.user_id !== user?.id) return notFound()

  // Fetch Messages
  const { data: messages } = await supabase
    .from('ticket_messages')
    .select('*, profiles(full_name, artist_name, role)')
    .eq('ticket_id', ticket.id)
    .eq('is_internal', false)
    .order('created_at', { ascending: true })

  const getStatusBadge = (status: string) => {
     switch (status) {
      case 'open': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'in_progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'resolved': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
      case 'closed': return 'bg-zinc-900/50 text-zinc-600 border-zinc-800'
      default: return 'bg-zinc-500/10 text-zinc-500'
    }
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
       {/* Header */}
       <div className="flex items-center gap-4 mb-6 shrink-0">
            <Link href="/dashboard/support">
                <Button variant="ghost" size="icon" className="hover:bg-white/5">
                    <ChevronLeft size={20} />
                </Button>
            </Link>
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-xl font-bold">{ticket.subject}</h1>
                    <Badge variant="outline" className={`capitalize ${getStatusBadge(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                    </Badge>
                </div>
                <div className="text-sm text-zinc-500 flex items-center gap-2">
                    <span>Ticket #{ticket.id.slice(0, 8)}</span>
                    <span>•</span>
                    <span className="capitalize">{ticket.category}</span>
                </div>
            </div>
       </div>

       {/* Chat Area */}
       <div className="flex-1 bg-zinc-900/30 border border-white/5 rounded-xl overflow-hidden flex flex-col">
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <div className="space-y-6">
                    {messages && messages.map((msg) => {
                        const isMe = msg.sender_id === user?.id
                        const isAdmin = msg.profiles?.role === 'admin'
                        return (
                            <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                <Avatar className="h-8 w-8 border border-white/10">
                                    <AvatarFallback className={isAdmin ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-400'}>
                                        {isAdmin ? <Shield size={14} /> : <User size={14} />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`flex items-center gap-2 text-xs mb-1 ${isMe ? 'flex-row-reverse' : ''} text-zinc-500`}>
                                        <span className="font-medium text-zinc-300">
                                            {isAdmin ? 'Support Team' : (msg.profiles?.artist_name || 'You')}
                                        </span>
                                        <span>{new Date(msg.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                    </div>
                                    <div className={`p-3 rounded-lg text-sm ${isMe ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-white/5'}`}>
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Input Area */}
            {ticket.status !== 'closed' ? (
                <div className="p-4 bg-zinc-900 border-t border-white/5">
                    <form action={replyTx} className="relative">
                        <input type="hidden" name="ticketId" value={ticket.id} />
                        <Input 
                            name="message" 
                            required 
                            placeholder="Type your reply..." 
                            className="pr-12 bg-zinc-950 border-white/10 py-6"
                            autoComplete="off"
                        />
                        <Button type="submit" size="icon" className="absolute right-1 top-1 h-10 w-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-sm">
                            <Send size={18} />
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="p-4 bg-zinc-900 border-t border-white/5 text-center text-zinc-500 text-sm">
                    This ticket is closed. You can no longer reply.
                </div>
            )}
       </div>
    </div>
  )
}
