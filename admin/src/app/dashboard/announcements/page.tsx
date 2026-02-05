'use client'

import { useState } from 'react'
import { sendBroadcast } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Megaphone, Send, Loader2, AlertCircle } from 'lucide-react'

export default function BroadcastPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
        await sendBroadcast(formData)
        toast.success("Broadcast sent successfully to all users")
        form.reset()
    } catch (error: any) {
        toast.error(error.message || "Failed to send broadcast")
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                <Megaphone className="h-8 w-8 text-indigo-500" />
                Broadcast Center
            </h1>
            <p className="text-zinc-500 mt-2">Send announcements, updates, or alerts to all registered artists.</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>New Announcement</CardTitle>
                <CardDescription>This message will appear in the notification center of EVERY user.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="type">Notification Type</Label>
                        <Select name="type" defaultValue="announcement">
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="announcement">📢 Announcement (Info)</SelectItem>
                                <SelectItem value="system">🔔 System Upgrade</SelectItem>
                                <SelectItem value="message">💬 General Message</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Title/Subject</Label>
                        <Input id="title" name="title" placeholder="e.g., Platform Maintenance Update" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message Content</Label>
                        <Textarea 
                            id="message" 
                            name="message" 
                            placeholder="Write your announcement here..." 
                            className="min-h-[150px]"
                            required 
                        />
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex items-start gap-3 text-sm text-yellow-600">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>Warning: This action cannot be undone. All active users will receive this notification immediately.</p>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Send Broadcast
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  )
}
