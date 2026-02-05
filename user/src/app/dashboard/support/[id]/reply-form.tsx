'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Link as LinkIcon, X, Loader2, FileIcon } from 'lucide-react'
import { replyTx } from '../actions'
import { toast } from "sonner"

export default function ReplyForm({ ticketId }: { ticketId: string }) {
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function clientAction(formData: FormData) {
        setLoading(true)
        try {
            await replyTx(formData)
            formRef.current?.reset()
            setFile(null)
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

    return (
        <form ref={formRef} action={clientAction} className="relative max-w-3xl mx-auto">
            <input type="hidden" name="ticketId" value={ticketId} />
            
            {/* File Preview */}
            {file && (
                <div className="absolute bottom-full left-0 mb-2 bg-zinc-900 border border-white/10 p-2 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-1">
                     <div className="bg-zinc-800 p-1.5 rounded-md">
                        <FileIcon size={14} className="text-zinc-400" />
                     </div>
                     <span className="text-xs text-zinc-300 max-w-[150px] truncate">{file.name}</span>
                     <button 
                        type="button" 
                        onClick={() => {
                            setFile(null)
                            if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="text-zinc-500 hover:text-white"
                     >
                        <X size={14} />
                     </button>
                </div>
            )}

            <div className="flex gap-3 items-end">
                {/* File Trigger */}
                <input 
                    type="file" 
                    name="attachment" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" 
                    id="reply-attachment"
                />
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => fileInputRef.current?.click()}
                    className={`rounded-full h-10 w-10 shrink-0 transition-colors ${file ? 'text-emerald-400 bg-emerald-400/10' : 'text-zinc-500 hover:text-white hover:bg-white/10'}`}
                >
                    <LinkIcon size={20} />
                </Button>

                <div className="flex-1 relative bg-zinc-900 border border-white/10 rounded-2xl focus-within:border-indigo-500/50 transition-colors">
                    <Input 
                        name="message" 
                        required 
                        placeholder="Type your message..." 
                        className="border-0 bg-transparent py-6 pl-4 pr-12 focus-visible:ring-0 text-white placeholder:text-zinc-600"
                        autoComplete="off"
                    />
                    <Button 
                        type="submit" 
                        size="icon" 
                        disabled={loading}
                        className="absolute right-1.5 top-1.5 h-9 w-9 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5" />}
                    </Button>
                </div>
            </div>
        </form>
    )
}
