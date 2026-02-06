'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createTicket } from './actions'
import { toast } from "sonner"
import { Plus, Loader2, Ticket } from 'lucide-react'

export default function CreateTicketDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    
    try {
        await createTicket(formData)
        toast.success("Ticket created successfully")
        setOpen(false)
    } catch (error: any) {
        toast.error(error.message || "Failed to create ticket")
    } finally {
        setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Plus size={16} /> New Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-white/10 text-white p-0 overflow-hidden gap-0 shadow-2xl">
        <div className="bg-zinc-900 border-b border-white/5 p-6 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"/>
            <DialogTitle className="text-lg font-black text-white flex items-center gap-2 relative z-10 tracking-tight">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <Ticket size={16} />
                </div>
                Open Support Ticket
            </DialogTitle>
            <DialogDescription className="text-zinc-400 mt-2 relative z-10 text-sm">
                Submit your query and our team will get back to you.
            </DialogDescription>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-5 p-6 bg-zinc-950">
            <div className="space-y-2">
                <Label htmlFor="subject" className="text-[11px] font-bold uppercase text-zinc-500 tracking-wider">Subject</Label>
                <Input 
                    id="subject" 
                    name="subject" 
                    required 
                    placeholder="Brief summary of the issue" 
                    className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:bg-zinc-900 transition-all font-medium" 
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category" className="text-[11px] font-bold uppercase text-zinc-500 tracking-wider">Category</Label>
                    <Select name="category" required defaultValue="general">
                        <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white focus:ring-offset-0 focus:border-indigo-500/50">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="finance">Billing & Finance</SelectItem>
                            <SelectItem value="copyright">Copyright & Legal</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="priority" className="text-[11px] font-bold uppercase text-zinc-500 tracking-wider">Priority</Label>
                     <Select name="priority" required defaultValue="medium">
                        <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white focus:ring-offset-0 focus:border-indigo-500/50">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                            <SelectItem value="low">Low Priority</SelectItem>
                            <SelectItem value="medium">Medium Priority</SelectItem>
                            <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="message" className="text-[11px] font-bold uppercase text-zinc-500 tracking-wider">Message</Label>
                <Textarea 
                    id="message" 
                    name="message" 
                    required 
                    placeholder="Provide detailed information..." 
                    className="bg-zinc-900/50 border-white/10 min-h-[120px] text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:bg-zinc-900 resize-none transition-all font-medium leading-relaxed" 
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="attachment" className="text-[11px] font-bold uppercase text-zinc-500 tracking-wider">Attachment {<span className="text-zinc-600 normal-case tracking-normal font-normal">(Optional)</span>}</Label>
                <div className="relative group">
                    <Input 
                        id="attachment" 
                        name="attachment" 
                        type="file" 
                        className="bg-zinc-900/50 border-white/10 text-xs text-zinc-400 file:bg-zinc-800 file:text-zinc-300 file:border-0 file:rounded-md file:mr-4 file:px-3 file:py-1 file:text-[10px] file:uppercase file:font-bold file:tracking-wider cursor-pointer hover:file:bg-zinc-700 transition-colors pr-2" 
                    />
                </div>
            </div>

            <DialogFooter className="pt-2 border-t border-white/5 mt-4">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white hover:bg-white/5">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Ticket className="mr-2 h-4 w-4" />}
                    Submit Ticket
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
