import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { MessageSquare, AlertCircle, Search, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function AdminSupportPage({ searchParams }: { searchParams: { status?: string, q?: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Verify Admin
  const { data: admin } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  if (admin?.role !== 'admin') {
      return <div>Unauthorized</div>
  }

  const status = searchParams.status || 'all'
  const search = searchParams.q || ''

  let query = supabase
    .from('tickets')
    .select('*, profiles(full_name, artist_name, email), ticket_messages(count)')
    .order('updated_at', { ascending: false })

  if (status !== 'all') {
      query = query.eq('status', status)
  }
  
  if (search) {
      query = query.ilike('subject', `%${search}%`)
  }

  const { data: tickets } = await query

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'resolved': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'closed': return 'bg-gray-100 text-gray-500 border-gray-200'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-gray-500 mt-1">Manage and resolve user support requests.</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
           <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <form>
                    <Input 
                        name="q" 
                        placeholder="Search subjects..." 
                        defaultValue={search}
                        className="pl-9 bg-white border-gray-200 text-black" 
                    />
                </form>
           </div>
           <div className="flex gap-2">
                <Link href="/dashboard/support?status=all">
                    <Button variant={status === 'all' ? 'default' : 'outline'} size="sm">All</Button>
                </Link>
                <Link href="/dashboard/support?status=open">
                    <Button variant={status === 'open' ? 'default' : 'outline'} size="sm">Open</Button>
                </Link>
                <Link href="/dashboard/support?status=in_progress">
                    <Button variant={status === 'in_progress' ? 'default' : 'outline'} size="sm">In Progress</Button>
                </Link>
           </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
            <TableHeader className="bg-gray-50/50">
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Last Updated</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tickets && tickets.length > 0 ? (
                    tickets.map((ticket) => (
                        <TableRow key={ticket.id} className="hover:bg-gray-50 cursor-pointer">
                            <TableCell className="font-mono text-xs text-gray-500">
                                <Link href={`/dashboard/support/${ticket.id}`} className="hover:underline">
                                    #{ticket.id.slice(0, 8)}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Link href={`/dashboard/support/${ticket.id}`} className="block">
                                    <div className="font-medium text-gray-900">{ticket.subject}</div>
                                    <div className="text-xs text-gray-500 capitalize">{ticket.category}</div>
                                </Link>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm text-gray-900">{ticket.profiles?.artist_name || 'Unknown'}</div>
                                <div className="text-xs text-gray-500">{ticket.profiles?.email}</div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={`capitalize ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={`capitalize ${getStatusColor(ticket.status)}`}>
                                    {ticket.status.replace('_', ' ')}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right text-xs text-gray-500">
                                {new Date(ticket.updated_at).toLocaleDateString()}
                            </TableCell>
                             <TableCell className="text-right">
                                <Link href={`/dashboard/support/${ticket.id}`}>
                                    <Button variant="ghost" size="icon">
                                        <MessageSquare size={16} className="text-gray-400" />
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                            No tickets found
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
      </div>
    </div>
  )
}
