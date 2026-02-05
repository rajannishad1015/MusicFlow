'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, Trash2, ExternalLink, Info, BellOff } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/app/dashboard/notifications/actions'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    const unreadCount = notifications.filter(n => !n.is_read).length

    const loadNotifications = async () => {
        const data = await fetchNotifications()
        setNotifications(data)
        setLoading(false)
    }

    useEffect(() => {
        loadNotifications()
        // Poll every 1 minute for new notifications
        const interval = setInterval(loadNotifications, 60000)
        return () => clearInterval(interval)
    }, [])

    const handleMarkAsRead = async (id: string) => {
        const result = await markAsRead(id)
        if (result.success) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
        }
    }

    const handleMarkAllRead = async () => {
        const result = await markAllAsRead()
        if (result.success) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        }
    }

    const handleDelete = async (id: string) => {
        const result = await deleteNotification(id)
        if (result.success) {
            setNotifications(prev => prev.filter(n => n.id !== id))
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'upload_status': return <Info className="w-4 h-4 text-indigo-400" />
            case 'support_reply': return <Info className="w-4 h-4 text-emerald-400" />
            case 'payment': return <Info className="w-4 h-4 text-amber-400" />
            default: return <Info className="w-4 h-4 text-zinc-400" />
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-white/5 transition-colors group">
                    <Bell className={cn(
                        "h-5 w-5 transition-transform group-hover:scale-110",
                        unreadCount > 0 ? "text-indigo-400 animate-pulse" : "text-zinc-500"
                    )} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-zinc-950"></span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-zinc-950/95 backdrop-blur-2xl border-white/10 shadow-2xl mr-4 sm:mr-8" align="end">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Notifications</h3>
                    {unreadCount > 0 && (
                        <button 
                            onClick={handleMarkAllRead}
                            className="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Mark all read
                        </button>
                    )}
                </div>

                <ScrollArea className="h-80">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3">
                            <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Scanning Network...</p>
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {notifications.map((notification) => (
                                <div 
                                    key={notification.id} 
                                    className={cn(
                                        "p-4 transition-colors relative group",
                                        !notification.is_read ? "bg-white/[0.02]" : "bg-transparent opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-1">
                                            {getTypeIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-xs font-bold text-white leading-tight">{notification.title}</p>
                                            <p className="text-[11px] text-zinc-500 leading-normal">{notification.message}</p>
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-tight">
                                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                </span>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!notification.is_read && (
                                                        <button 
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                            className="text-emerald-500 hover:text-emerald-400 p-1"
                                                            title="Mark as read"
                                                        >
                                                            <Check size={12} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDelete(notification.id)}
                                                        className="text-zinc-600 hover:text-rose-500 p-1"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                    {notification.link && (
                                                        <Link 
                                                            href={notification.link}
                                                            onClick={() => {
                                                                handleMarkAsRead(notification.id)
                                                                setOpen(false)
                                                            }}
                                                            className="text-indigo-400 hover:text-indigo-300 p-1"
                                                            title="View details"
                                                        >
                                                            <ExternalLink size={12} />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {!notification.is_read && (
                                        <div className="absolute right-4 top-4 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-60 text-center px-8">
                            <BellOff className="h-10 w-10 text-zinc-800 mb-4" />
                            <p className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">Silence</p>
                            <p className="text-[10px] text-zinc-700 font-bold leading-relaxed">Your intelligence feed is currently empty. System operational.</p>
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <div className="p-3 border-t border-white/5 text-center">
                        <Link href="/dashboard/notifications" onClick={() => setOpen(false)}>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-colors">View Efficiency Log</p>
                        </Link>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}
