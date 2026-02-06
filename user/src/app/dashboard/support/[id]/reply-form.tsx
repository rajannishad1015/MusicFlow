'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, Link as LinkIcon, X, Loader2, FileIcon, Paperclip } from 'lucide-react'
import { replyTx } from '../actions'
import { toast } from "sonner"

export default function ReplyForm({ ticketId }: { ticketId: string }) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function clientAction(formData: FormData) {
        setLoading(true)
        try {
            await replyTx(formData)
            formRef.current?.reset()
            setFile(null)
            setMessage('')
            toast.success("Reply sent")
        } catch (error: any) {
            toast.error(error.message || "Failed to send reply")
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
        if (e.type === 'submit') e.preventDefault()
        if (!message.trim() && !file) return

        const formData = new FormData()
        formData.append('ticketId', ticketId)
        formData.append('message', message)
        if (file) {
            formData.append('attachment', file)
        }

        await clientAction(formData)
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="relative flex flex-col gap-3 group">
            
            {/* Input Area */}
            <div className="relative bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all shadow-inner">
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="min-h-[60px] max-h-[200px] w-full bg-transparent border-0 resize-none focus-visible:ring-0 p-4 text-sm font-medium text-white placeholder:text-zinc-500 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit(e)
                        }
                    }}
                />
                
                {/* Toolbar */}
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/50 border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Input
                                type="file"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                accept="image/*,.pdf"
                                disabled={loading}
                            />
                            <Button 
                                type="button" 
                                size="icon" 
                                variant="ghost" 
                                className={`h-8 w-8 rounded-full transition-colors ${file ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                            >
                                <Paperclip size={16} />
                            </Button>
                        </div>
                        {file && (
                            <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-300 text-[10px] font-bold px-2 py-1 rounded-md border border-indigo-500/20 animate-in fade-in zoom-in-95 duration-200">
                                <span className="max-w-[100px] truncate">{file.name}</span>
                                <button type="button" onClick={() => setFile(null)} className="hover:text-white transition-colors">
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-zinc-600 font-medium hidden sm:inline-block">
                            Press <kbd className="font-sans font-bold text-zinc-500">Enter</kbd> to send
                        </span>
                        <Button 
                            type="submit" 
                            disabled={(!message.trim() && !file) || loading}
                            className={`
                                h-8 px-4 rounded-lg font-bold text-xs transition-all duration-300
                                ${(!message.trim() && !file) || loading
                                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transform hover:-translate-y-0.5'
                                }
                            `}
                        >
                            {loading ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <div className="flex items-center gap-1.5">
                                    Send <Send size={12} className={message.trim() ? "translate-x-0.5 transition-transform" : ""} />
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}
