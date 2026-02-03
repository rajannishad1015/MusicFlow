import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, MessageSquare, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import CreateTicketDialog from './create-ticket-dialog'

export default async function SupportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: tickets } = await supabase
    .from('tickets')
    .select('*, ticket_messages(count)')
    .eq('user_id', user?.id)
    .order('updated_at', { ascending: false })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'in_progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'resolved': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
      case 'closed': return 'bg-zinc-900/50 text-zinc-600 border-zinc-800'
      default: return 'bg-zinc-500/10 text-zinc-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support & Help</h1>
          <p className="text-zinc-500">Track issues and get help from our team.</p>
        </div>
        <CreateTicketDialog />
      </div>

      <div className="grid gap-4">
        {tickets && tickets.length > 0 ? (
          tickets.map((ticket) => (
             <Link key={ticket.id} href={`/dashboard/support/${ticket.id}`} className="block">
                <Card className="bg-zinc-900/50 border-white/5 hover:bg-white/5 transition-colors group">
                    <CardHeader className="p-4 sm:p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-semibold group-hover:text-emerald-400 transition-colors">
                                {ticket.subject}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 text-xs">
                                <span>#{ticket.id.slice(0, 8)}</span>
                                <span>•</span>
                                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                <span>•</span>
                                <span className="capitalize">{ticket.category}</span>
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className={`capitalize ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                            </Badge>
                             <Badge variant="outline" className={`capitalize ${getStatusColor(ticket.status)}`}>
                                {status === 'resolved' ? 'Resolved' : ticket.status.replace('_', ' ')}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-2">
                         <div className="flex items-center text-xs text-zinc-500 gap-1">
                            <MessageSquare size={14} />
                            <span>{(ticket.ticket_messages[0] as any)?.count || 0} messages</span>
                         </div>
                    </CardContent>
                </Card>
             </Link>
          ))
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-zinc-900/20">
             <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-zinc-500" />
             </div>
             <h3 className="text-lg font-medium">No tickets found</h3>
             <p className="text-zinc-500 text-sm mb-6">You haven't submitted any support requests yet.</p>
             <CreateTicketDialog />
          </div>
        )}
      </div>
    </div>
  )
}
