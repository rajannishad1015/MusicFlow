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

  if (!user) {
    return <div>Log in required</div>
  }

  const awaitedParams = await searchParams
  const query = awaitedParams?.q as string
  const status = awaitedParams?.status as string
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isLabel = profile?.role === 'label'

  let dbQuery = supabase
    .from('tickets')
    .select('*, ticket_messages(count)')
    .order('updated_at', { ascending: false })

  if (awaitedParams.artistId) {
    dbQuery = dbQuery.eq('user_id', awaitedParams.artistId)
  } else if (isLabel) {
    const { data: artistList } = await supabase
        .from('profiles')
        .select('id')
        .eq('label_id', user.id)
    const artistIds = artistList?.map(a => a.id) || []
    dbQuery = dbQuery.in('user_id', artistIds)
  } else {
    dbQuery = dbQuery.eq('user_id', user.id)
  }

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

  let statQuery = supabase
        .from('tickets')
        .select('status')

  if (awaitedParams.artistId) {
    statQuery = statQuery.eq('user_id', awaitedParams.artistId)
  } else if (isLabel) {
    const { data: artistList } = await supabase
        .from('profiles')
        .select('id')
        .eq('label_id', user.id)
    const artistIds = artistList?.map(a => a.id) || []
    statQuery = statQuery.in('user_id', artistIds)
  } else {
    statQuery = statQuery.eq('user_id', user.id)
  }

  const { data: allTickets } = await statQuery

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Stats */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Support Center</h1>
            <p className="text-zinc-400 mt-1">Get help and manage your support requests.</p>
          </div>
          <CreateTicketDialog />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-zinc-950 border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                <CardContent className="p-6 flex items-center gap-4 relative">
                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Tickets</p>
                        <p className="text-3xl font-black text-white tabular-nums tracking-tight mt-0.5">{totalTickets}</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-zinc-950 border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                <CardContent className="p-6 flex items-center gap-4 relative">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Active Issues</p>
                        <p className="text-3xl font-black text-white tabular-nums tracking-tight mt-0.5">{openTickets}</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-zinc-950 border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                <CardContent className="p-6 flex items-center gap-4 relative">
                    <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                        <Box size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Resolved</p>
                        <p className="text-3xl font-black text-white tabular-nums tracking-tight mt-0.5">{resolvedTickets}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Ticket size={18} className="text-indigo-400"/>
                Recent Tickets
            </h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <SearchInput />
                <StatusFilter />
            </div>
        </div>

        <div className="grid gap-2">
            {tickets && tickets.length > 0 ? (
            tickets.map((ticket) => (
                <Link key={ticket.id} href={`/dashboard/support/${ticket.id}`} className="block group">
                    <div className="bg-zinc-950 border border-white/5 rounded-xl p-4 sm:px-6 sm:py-5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-200 flex flex-col sm:flex-row gap-4 sm:items-center relative overflow-hidden">
                         <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="h-10 w-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 shrink-0 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all">
                            <Ticket size={16} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1.5">
                                <h3 className="text-base font-bold text-zinc-200 truncate group-hover:text-white transition-colors">
                                    {ticket.subject}
                                </h3>
                                <div className={`hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
                                <span className="font-mono text-zinc-600">ID: {ticket.id.slice(0, 8)}</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-700"/>
                                <span className="capitalize text-zinc-400">{ticket.category}</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-700"/>
                                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pt-2 sm:pt-0 border-t border-white/5 sm:border-0 mt-2 sm:mt-0">
                             <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                <MessageSquare size={12} />
                                <span className="font-bold">{(ticket.ticket_messages[0] as any)?.count || 0}</span>
                             </div>
                            
                            <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${getStatusColor(ticket.status)}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'open' ? 'bg-emerald-500 animate-pulse' : ticket.status === 'resolved' ? 'bg-indigo-500' : 'bg-zinc-500'}`} />
                                {ticket.status === 'resolved' ? 'Resolved' : ticket.status.replace('_', ' ')}
                            </div>
                            
                             <ChevronRight size={16} className="text-zinc-700 group-hover:text-white transition-colors hidden sm:block transform group-hover:translate-x-1 duration-200" />
                        </div>
                    </div>
                </Link>
            ))
            ) : (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl bg-zinc-950/50">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-inner">
                    <AlertCircle className="text-zinc-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">No Tickets Found</h3>
                <p className="text-zinc-500 text-sm mb-8 max-w-sm mx-auto mt-2">
                    {query || status ? "Adjust your filters to see more results." : "You haven't created any support tickets yet."}
                </p>
                {(!query && (!status || status === 'all')) && <CreateTicketDialog />}
            </div>
            )}
        </div>
      </div>
    </div>
  )
}
