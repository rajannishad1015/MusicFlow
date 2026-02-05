'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, User, Lock } from 'lucide-react'
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
  adminId: string
}

export default function ChatInterface({ initialMessages, ticketId, adminId }: ChatInterfaceProps) {
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
    const channel = supabase
      .channel(`ticket_chat_admin_${ticketId}`)
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
            const isMe = newMsg.sender_id === adminId
            
            const stubbedProfile = {
                full_name: isMe ? 'You' : 'User',
                artist_name: isMe ? 'Admin' : 'Artist',
                role: isMe ? 'admin' : 'user'
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
  }, [ticketId, adminId, supabase])

  return (
    <div className="space-y-8 pb-4">
        {messages.map((msg) => {
            const isMe = msg.sender_id === adminId
            const isInternal = msg.is_internal

            return (
                <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''} group animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                    <Avatar className={`h-10 w-10 border shadow-sm shrink-0 ${isMe ? 'border-indigo-100' : 'border-gray-200'}`}>
                        <AvatarFallback className={`text-xs font-bold ${isMe ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                            {isMe ? <Shield size={16} /> : <User size={16} />}
                        </AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                        
                        <div className={`flex items-center gap-2 text-[10px] mb-2 px-1 ${isMe ? 'flex-row-reverse' : ''} text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200`}>
                            <span className="font-semibold text-gray-700">
                                {isMe ? 'You' : (msg.profiles?.role === 'admin' ? 'Support Team' : msg.profiles?.artist_name || 'User')}
                            </span>
                             {isInternal && <span className="flex items-center gap-0.5 text-amber-600 font-bold px-1.5 py-0.5 bg-amber-50 rounded border border-amber-100 text-[9px] uppercase tracking-wide"><Lock size={8} /> internal</span>}
                            <span>{new Date(msg.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <div className={`
                            px-5 py-3.5 text-sm leading-relaxed shadow-sm relative transition-all hover:shadow-md
                            ${isInternal 
                                ? 'bg-amber-50 text-amber-900 border border-amber-200/60 rounded-2xl' 
                                : isMe 
                                    ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-indigo-200' 
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-sm'
                            }
                        `}>
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                            
                            {msg.attachment_url && (
                                <div className={`mt-3 pt-3 ${isMe ? 'border-white/20' : 'border-gray-100'} border-t`}>
                                    <AttachmentPreview url={msg.attachment_url} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
        })}
        <div ref={bottomRef} className="h-4" />
    </div>
  )
}
