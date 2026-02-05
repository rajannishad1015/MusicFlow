import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, MessageSquare, AlertCircle, Search, ChevronRight, Ticket, Box } from 'lucide-react'
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

import SearchInput from './search-input'
import StatusFilter from './status-filter'

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const awaitedParams = await searchParams
  const query = awaitedParams?.q as string
  const status = awaitedParams?.status as string

  let dbQuery = supabase
    .from('tickets')
    .select('*, ticket_messages(count)')
    .eq('user_id', user?.id)
    .order('updated_at', { ascending: false })

  if (query) {
    dbQuery = dbQuery.ilike('subject', `%${query}%`)
  }

  if (status && status !== 'all') {
    dbQuery = dbQuery.eq('status', status)
  }

  const { data: tickets } = await dbQuery

  // Calculate Stats (Note: These should ideally be separate queries or handled differently if pagination is added, 
  // but for now filtering strictly by searchParams for the list is fine. 
  // To keep stats accurate regardless of filter, we might want a separate fetch, but to keep it simple effectively
  // let's show stats for the "current view" or ideally separate fetches. 
  // For robustness, let's fetch stats separately or accept that stats reflect the current filter context if that's desired behavior. 
  // Customarily, stats cards usually show GLOBAL stats. Let's do a quick separate lightweight fetch for stats to keep them consistent.)

  const { data: allTickets } = await supabase
        .from('tickets')
        .select('status')
        .eq('user_id', user?.id)

  const totalTickets = allTickets?.length || 0
  const openTickets = allTickets?.filter(t => t.status === 'open' || t.status === 'in_progress').length || 0
  const resolvedTickets = allTickets?.filter(t => t.status === 'resolved' || t.status === 'closed').length || 0

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
      case 'resolved': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
      case 'closed': return 'bg-zinc-900/50 text-zinc-500 border-zinc-800'
      default: return 'bg-zinc-500/10 text-zinc-500'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Support Center</h1>
            <p className="text-zinc-400 mt-1">Manage your support requests and get help.</p>
          </div>
          <CreateTicketDialog />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-zinc-900/50 border-white/5 p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <MessageSquare size={20} />
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Total Tickets</p>
                    <p className="text-2xl font-bold text-white">{totalTickets}</p>
                </div>
            </Card>
            <Card className="bg-zinc-900/50 border-white/5 p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Active Issues</p>
                    <p className="text-2xl font-bold text-white">{openTickets}</p>
                </div>
            </Card>
            <Card className="bg-zinc-900/50 border-white/5 p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Box size={20} />
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Resolved</p>
                    <p className="text-2xl font-bold text-white">{resolvedTickets}</p>
                </div>
            </Card>
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-white">Recent Tickets</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <SearchInput />
                <StatusFilter />
            </div>
        </div>

        <div className="grid gap-3">
            {tickets && tickets.length > 0 ? (
            tickets.map((ticket) => (
                <Link key={ticket.id} href={`/dashboard/support/${ticket.id}`} className="block group">
                    <div className="bg-zinc-900 border border-white/5 rounded-xl p-4 sm:p-5 hover:border-white/10 hover:bg-zinc-800/50 transition-all duration-200 flex flex-col sm:flex-row gap-4 sm:items-center">
                        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                            <Ticket size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-base font-semibold text-zinc-100 truncate group-hover:text-white transition-colors">
                                    {ticket.subject}
                                </h3>
                                <Badge variant="outline" className={`hidden sm:inline-flex capitalize ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                                <span className="font-mono text-zinc-600">#{ticket.id.slice(0, 8)}</span>
                                <span>•</span>
                                <span className="capitalize">{ticket.category}</span>
                                <span>•</span>
                                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                            <Badge variant="outline" className={`capitalize ${getStatusColor(ticket.status)}`}>
                                {ticket.status === 'resolved' ? 'Resolved' : ticket.status.replace('_', ' ')}
                            </Badge>
                             <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-white/5 px-2.5 py-1 rounded-full">
                                <MessageSquare size={12} />
                                <span>{(ticket.ticket_messages[0] as any)?.count || 0}</span>
                             </div>
                             <ChevronRight size={16} className="text-zinc-600 group-hover:text-zinc-300 transition-colors hidden sm:block" />
                        </div>
                    </div>
                </Link>
            ))
            ) : (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-zinc-950/30">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <AlertCircle className="text-zinc-600" size={24} />
                </div>
                <h3 className="text-lg font-medium text-white">No tickets found</h3>
                <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
                    {query || status ? "No tickets match your filter criteria." : "It looks like you haven't needed help yet."}
                </p>
                {(!query && (!status || status === 'all')) && <CreateTicketDialog />}
            </div>
            )}
        </div>
      </div>
    </div>
  )
}
