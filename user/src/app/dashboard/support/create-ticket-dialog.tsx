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
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-white p-0 overflow-hidden gap-0 shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <DialogTitle className="text-xl font-black text-white flex items-center gap-2 relative z-10 tracking-tight">
                <Ticket size={22} className="text-white" />
                Open New Support Ticket
            </DialogTitle>
            <DialogDescription className="text-indigo-100 mt-1 relative z-10 font-medium">
                Submit your query and our team will assist you shortly.
            </DialogDescription>
        </div>
        <form onSubmit={onSubmit} className="space-y-5 p-6">
            <div className="space-y-2">
                <Label htmlFor="subject" className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Subject</Label>
                <Input id="subject" name="subject" required placeholder="Brief summary of the issue" className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category" className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Category</Label>
                    <Select name="category" required defaultValue="general">
                        <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white focus:ring-offset-0">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="finance">Billing & Finance</SelectItem>
                            <SelectItem value="copyright">Copyright & Legal</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="priority" className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Priority</Label>
                     <Select name="priority" required defaultValue="medium">
                        <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white focus:ring-offset-0">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="low">Low Priority</SelectItem>
                            <SelectItem value="medium">Medium Priority</SelectItem>
                            <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="message" className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Message</Label>
                <Textarea 
                    id="message" 
                    name="message" 
                    required 
                    placeholder="Provide detailed information about your request..." 
                    className="bg-zinc-900/50 border-white/10 min-h-[120px] text-white placeholder:text-zinc-600 focus:border-indigo-500/50 resize-none" 
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="attachment" className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Attachment (Optional)</Label>
                <Input 
                    id="attachment" 
                    name="attachment" 
                    type="file" 
                    className="bg-zinc-900/50 border-white/10 text-xs text-zinc-400 file:bg-zinc-800 file:text-white file:border-0 file:rounded-sm file:mr-4 file:px-3 file:py-1 file:text-xs file:font-semibold cursor-pointer hover:file:bg-zinc-700 transition-colors" 
                />
            </div>

            <DialogFooter className="pt-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white hover:bg-white/5">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Ticket className="mr-2 h-4 w-4" />}
                    Submit Ticket
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
