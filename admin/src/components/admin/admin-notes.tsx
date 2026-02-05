'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { addAdminNote } from '@/app/dashboard/content/[id]/actions'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminNotes({ trackId, notes }: { trackId: string, notes: any[] }) {
    const [newNote, setNewNote] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!newNote.trim()) return
        setLoading(true)
        try {
            await addAdminNote(trackId, newNote)
            setNewNote('')
            toast.success('Note added')
        } catch (error: any) {
            toast.error('Failed to add note: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Internal Notes</h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 max-h-[400px]">
                {notes.length === 0 ? (
                    <div className="text-center py-8 text-zinc-600 text-sm italic">
                        No notes yet. Start the discussion.
                    </div>
                ) : (
                    notes.map((note) => (
                        <div key={note.id} className="flex gap-3 group">
                            <Avatar className="h-8 w-8 border border-white/10">
                                <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                                    {note.admin?.full_name?.substring(0, 2).toUpperCase() || 'AD'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-zinc-300">{note.admin?.full_name || 'Admin'}</span>
                                    <span className="text-[10px] text-zinc-600">{formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}</span>
                                </div>
                                <p className="text-sm text-zinc-400 bg-white/5 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl leading-relaxed">
                                    {note.note}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="relative">
                <Textarea 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a private note..."
                    className="bg-zinc-900/50 border-white/10 text-white min-h-[80px] pr-12 resize-none focus-visible:ring-indigo-500/20"
                />
                <Button 
                    size="icon" 
                    className="absolute bottom-2 right-2 h-8 w-8 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
                    disabled={!newNote.trim() || loading}
                    onClick={handleSubmit}
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </Button>
            </div>
        </div>
    )
}
