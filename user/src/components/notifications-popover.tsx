'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, Trash2, Info, AlertTriangle, MessageSquare, X } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from 'next/link'

type Notification = {
  id: string
  type: 'message' | 'announcement' | 'rejection' | 'system'
  title: string
  message: string
  link?: string
  is_read: boolean
  created_at: string
}

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchNotifications()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
        },
        () => {
          fetchNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (data) {
      setNotifications(data as Notification[])
      setUnreadCount(data.filter((n: Notification) => !n.is_read).length)
    }
  }

  const markAsRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
    
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  const clearNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await supabase.from('notifications').delete().eq('id', id)
    setNotifications(prev => prev.filter(n => n.id !== id))
    // Re-calc unread count if we deleted an unread one
    const notification = notifications.find(n => n.id === id)
    if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'rejection': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'announcement': return <Info className="h-4 w-4 text-blue-500" />
      case 'message': return <MessageSquare className="h-4 w-4 text-emerald-500" />
      default: return <Bell className="h-4 w-4 text-zinc-500" />
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-0 bg-zinc-950 border-zinc-800 text-zinc-100 shadow-2xl" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto px-2 py-1 text-[10px] text-zinc-400 hover:text-white"
                onClick={markAllAsRead}
            >
                Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-zinc-800">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "flex gap-3 p-4 transition-colors hover:bg-white/5 cursor-pointer relative group",
                    !notification.is_read && "bg-indigo-500/5"
                  )}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className="mt-1 bg-zinc-900 p-2 rounded-full h-fit border border-zinc-800 shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-sm font-medium leading-none", !notification.is_read ? "text-white" : "text-zinc-400")}>
                        {notification.title}
                        </p>
                        <button 
                            onClick={(e) => clearNotification(notification.id, e)}
                            className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <X size={14} />
                        </button>
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-[10px] text-zinc-600">
                        {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                        {notification.link && (
                            <Link href={notification.link} className="text-[10px] text-indigo-400 hover:underline">
                                View Details
                            </Link>
                        )}
                    </div>
                  </div>
                  {!notification.is_read && (
                    <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-indigo-500" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500 gap-2">
              <Bell className="h-8 w-8 opacity-20" />
              <p className="text-sm">No notifications yet</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
