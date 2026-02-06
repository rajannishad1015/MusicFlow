'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, User } from 'lucide-react'
import AttachmentPreview from './attachment-preview'

interface Message {
  id: string
  ticket_id: string
  sender_id: string
  message: string
  attachment_url: string | null
  is_internal: boolean
  created_at: string
  profiles?: {
    full_name: string | null
    artist_name: string | null
    role: string
  }
}

interface ChatInterfaceProps {
  initialMessages: Message[]
  ticketId: string
  userId: string
  ticketCreatedAt: string
}

export default function ChatInterface({ initialMessages, ticketId, userId, ticketCreatedAt }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Sync state with server revalidation
  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  // Initial scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Realtime Subscription
  useEffect(() => {
    // 1. Subscribe to new messages
    const channel = supabase
      .channel(`ticket_chat_${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ticket_messages',
          filter: `ticket_id=eq.${ticketId}`
        },
        async (payload) => {
            const newMsg = payload.new as Message
            if (newMsg.is_internal) return

            const isMe = newMsg.sender_id === userId
            const stubbedProfile = {
                full_name: isMe ? 'You' : 'Support Agent',
                artist_name: isMe ? 'You' : 'Support Team',
                role: isMe ? 'user' : 'admin'
            }

            const msgWithProfile = {
                ...newMsg,
                profiles: stubbedProfile
            }

            setMessages((current) => {
                if (current.find(m => m.id === newMsg.id)) return current
                return [...current, msgWithProfile]
            })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [ticketId, userId, supabase])

  return (
    <div className="flex flex-col space-y-8 pb-4 max-w-4xl mx-auto px-4 sm:px-6 py-6 font-sans">
        {/* Date Divider */}
        <div className="flex items-center justify-center sticky top-0 z-20">
             <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 text-zinc-400 text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                {new Date(ticketCreatedAt).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
             </div>
        </div>

        <div className="flex flex-col space-y-8">
            {messages.map((msg, index) => {
                const isMe = msg.sender_id === userId
                const isAdmin = msg.profiles?.role === 'admin'
                
                return (
                    <div 
                        key={msg.id} 
                        className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''} group animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out`}
                    >
                        <Avatar className={`h-9 w-9 border shadow-lg shrink-0 mt-1 ${isMe ? 'border-indigo-500/20' : 'border-zinc-700/50'}`}>
                            <AvatarFallback className={`text-[10px] font-black ${
                                isAdmin 
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' 
                                    : (isMe ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-800 text-zinc-400')
                            }`}>
                                {isAdmin ? <Shield size={14} /> : <User size={14} />}
                            </AvatarFallback>
                        </Avatar>

                        <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                            
                            {/* Header Label */}
                            <div className={`flex items-center gap-2 text-[10px] mb-1.5 px-1 ${isMe ? 'flex-row-reverse' : ''} text-zinc-500 opacity-60 group-hover:opacity-100 transition-all duration-300`}>
                                <span className={`font-bold tracking-wide ${isAdmin ? 'text-indigo-400' : 'text-zinc-400'}`}>
                                    {isMe ? 'You' : (isAdmin ? 'Support Team' : msg.profiles?.artist_name)}
                                </span>
                                <span className="text-zinc-700">•</span>
                                <span className="font-mono">{new Date(msg.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            {/* Message Bubble */}
                            <div className={`
                                px-5 py-3.5 text-sm relative shadow-[0_2px_10px_rgba(0,0,0,0.2)] backdrop-blur-md
                                transition-all hover:scale-[1.01] duration-200
                                ${isMe 
                                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-tr-sm border border-indigo-500/30' 
                                    : 'bg-zinc-900/90 text-zinc-200 border border-white/10 rounded-2xl rounded-tl-sm hover:bg-zinc-800'
                                }
                            `}>
                                <p className="whitespace-pre-wrap font-medium tracking-normal leading-relaxed text-[13.5px]">{msg.message}</p>
                                
                                {msg.attachment_url && (
                                    <div className={`mt-3 pt-3 ${isMe ? 'border-indigo-500/30' : 'border-white/10'} border-t`}>
                                        <AttachmentPreview url={msg.attachment_url} />
                                    </div>
                                )}
                            </div>

                            {/* Status Helpers for Admin */}
                            {isAdmin && (
                                <div className="mt-2 flex items-center gap-1.5 px-1 opacity-80">
                                    <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                        <Shield size={8} />
                                    </span>
                                    <span className="text-[9px] font-bold text-indigo-400 tracking-widest uppercase">Official Staff</span>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
        <div ref={bottomRef} className="h-2" />
    </div>
  )
}
