import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ChevronLeft, Send, Clock, User, Shield, Lock, Link as LinkIcon, XCircle } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { replyTx } from '../actions'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import ReplyForm from './reply-form'
// AttachmentPreview is internal to ChatInterface now
import ChatInterface from './chat-interface'

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { id } = await params

  // Fetch Ticket
  const { data: ticket } = await supabase
    .from('tickets')
    .select('*, profiles(full_name, artist_name, email)')
    .eq('id', id)
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
    <div className="h-[calc(100vh-120px)] flex flex-col max-w-5xl mx-auto w-full group/page animate-in fade-in slide-in-from-bottom-4 duration-700">
       {/* Cinematic Header */}
       <div className="relative overflow-hidden rounded-t-2xl bg-zinc-950 border border-white/10 border-b-0 shrink-0 z-20 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent opacity-50"></div>
            <div className="relative z-10 p-4 sm:p-5 flex items-center gap-4">
                <Link href="/dashboard/support">
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full ring-1 ring-white/5 shadow-lg bg-zinc-900/50 backdrop-blur-md">
                        <ChevronLeft size={18} />
                    </Button>
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                        <h1 className="text-lg font-black text-white truncate tracking-tight">{ticket.subject}</h1>
                        <Badge variant="outline" className={`capitalize shrink-0 font-bold tracking-wider ${getStatusBadge(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium h-5">
                        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-white/5 text-zinc-500">
                            <span className="font-mono">ID: {ticket.id.slice(0, 8)}</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-zinc-700"/>
                        <span className="capitalize text-zinc-300">{ticket.category}</span>
                    </div>
                </div>
                <Link href="/dashboard/support">
                    <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-white/5 rounded-full active:scale-95 transition-all">
                        <XCircle size={22} strokeWidth={1.5} />
                    </Button>
                </Link>
            </div>
       </div>

       {/* Chat Area */}
       <div className="flex-1 bg-zinc-950 border border-white/10 border-t-0 flex flex-col relative overflow-hidden shadow-2xl rounded-b-2xl">
            {/* Background Accent */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/5 via-zinc-950/40 to-zinc-950/80 pointer-events-none" />

            <div className="flex-1 p-0 overflow-y-auto z-10 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <ChatInterface 
                    initialMessages={messages || []} 
                    ticketId={ticket.id} 
                    userId={user?.id || ''}
                    ticketCreatedAt={ticket.created_at} 
                />
            </div>

            {/* Input Area */}
            {ticket.status !== 'closed' ? (
                <div className="p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-xl border-t border-white/10 z-20">
                    <ReplyForm ticketId={ticket.id} />
                </div>
            ) : (
                <div className="p-6 bg-zinc-950 border-t border-white/5 z-20">
                    <div className="max-w-md mx-auto bg-zinc-900/50 border border-white/10 rounded-xl p-6 text-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <div className="w-12 h-12 bg-zinc-800/80 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500 ring-4 ring-zinc-900">
                             <Lock size={20} />
                        </div>
                        <h3 className="text-base font-bold text-white mb-1">Ticket Closed</h3>
                        <p className="text-xs text-zinc-400 font-medium">This conversation has been resolved. If you need further help, please create a new ticket.</p>
                    </div>
                </div>
            )}
       </div>
    </div>
  )
}
