import { createClient } from '@/utils/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UserRoleButton from "./user-role-button"
import UserDetailsDialog from "./user-details-dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Search, UserPlus, Users as UsersIcon, ShieldCheck, Music } from 'lucide-react'

export default async function UsersPage({ searchParams }: { searchParams: { query?: string, role?: string } }) {
  const supabase = await createClient()
  const query = (await searchParams).query || ''
  const role = (await searchParams).role || 'all'

  let dbQuery = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (query) {
    dbQuery = dbQuery.or(`email.ilike.%${query}%,artist_name.ilike.%${query}%,full_name.ilike.%${query}%`)
  }

  if (role !== 'all') {
    dbQuery = dbQuery.eq('role', role)
  }

  const { data: profiles, error } = await dbQuery

  if (error) {
    return <div>Error loading users</div>
  }

  // Fetch track counts for these profiles
  const { data: tracks } = await supabase
    .from('tracks')
    .select('user_id')
    .in('user_id', profiles?.map(p => p.id) || [])

  const trackCountMap = tracks?.reduce((acc: any, curr: any) => {
    acc[curr.user_id] = (acc[curr.user_id] || 0) + 1
    return acc
  }, {})

  const { data: { user: currentUser } } = await supabase.auth.getUser()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">User Management</h1>
          <p className="text-zinc-500 font-medium tracking-wide text-sm uppercase">Manage accounts & permissions</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-full">
                <span className="text-xs text-zinc-400 font-mono">Total Users: <span className="text-white font-bold">{profiles?.length || 0}</span></span>
            </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.03] backdrop-blur-xl p-4 rounded-2xl border border-white/5">
         <form className="flex gap-2 w-full md:max-w-md relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <Input 
                name="query" 
                placeholder="Search by name or email..." 
                defaultValue={query} 
                className="pl-9 bg-zinc-900/50 border-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500/50 h-10 rounded-xl" 
            />
            <Button type="submit" className="bg-white text-black hover:bg-zinc-200 border-0 rounded-xl font-bold">Search</Button>
         </form>
         <div className="flex items-center gap-1 bg-zinc-900/50 p-1.5 rounded-xl border border-white/5">
            <Link href="/dashboard/users?role=all">
                <Button variant={role === 'all' ? 'secondary' : 'ghost'} size="sm" className={`h-8 rounded-lg text-xs font-bold ${role === 'all' ? 'bg-white text-black hover:bg-zinc-200' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
                    <UsersIcon className="h-3.5 w-3.5 mr-1.5" /> All
                </Button>
            </Link>
            <Link href="/dashboard/users?role=artist">
                <Button variant={role === 'artist' ? 'secondary' : 'ghost'} size="sm" className={`h-8 rounded-lg text-xs font-bold ${role === 'artist' ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
                    <Music className="h-3.5 w-3.5 mr-1.5" /> Artists
                </Button>
            </Link>
            <Link href="/dashboard/users?role=admin">
                <Button variant={role === 'admin' ? 'secondary' : 'ghost'} size="sm" className={`h-8 rounded-lg text-xs font-bold ${role === 'admin' ? 'bg-amber-500 text-white hover:bg-amber-400' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
                    <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Admins
                </Button>
            </Link>
         </div>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 bg-white/[0.02] hover:bg-white/[0.02]">
              <TableHead className="w-[80px] text-[10px] uppercase font-black tracking-widest text-zinc-500">User</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Contact Info</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Role</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Tracks</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Wallet</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Joined</TableHead>
              <TableHead className="text-right text-[10px] uppercase font-black tracking-widest text-zinc-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile: any) => (
              <TableRow key={profile.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                 <TableCell>
                  <Avatar className="h-10 w-10 border border-white/10 ring-2 ring-transparent group-hover:ring-white/10 transition-all">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="bg-indigo-900/50 text-indigo-200 font-bold border border-white/5">
                        {profile.artist_name?.[0] || profile.full_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">{profile.artist_name || profile.full_name || 'N/A'}</span>
                            {profile.status && profile.status !== 'active' && (
                                <Badge variant="outline" className={`text-[9px] uppercase font-black tracking-wider h-4 px-1.5 rounded border ${profile.status === 'banned' ? 'text-red-400 border-red-500/20 bg-red-500/10' : 'text-zinc-400 border-zinc-500/20 bg-zinc-500/10'}`}>
                                    {profile.status}
                                </Badge>
                            )}
                        </div>
                        <span className="text-xs text-zinc-500 font-mono">{profile.email}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge className={`text-[9px] uppercase font-black tracking-wider border px-2 py-0.5 rounded-full ${profile.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'bg-white/5 text-zinc-400 border-white/10'}`}>
                        {profile.role}
                    </Badge>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-1.5">
                        <div className="p-1 rounded bg-white/5">
                            <Music className="h-3 w-3 text-zinc-500" />
                        </div>
                        <span className="font-bold text-white tabular-nums">{trackCountMap?.[profile.id] || 0}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <span className="font-bold text-emerald-400 tabular-nums flex items-center gap-1">
                        <span className="text-[10px] text-emerald-500/50">$</span>
                        {(profile.balance || 0).toFixed(2)}
                    </span>
                </TableCell>
                <TableCell className="text-xs text-zinc-500 tabular-nums">
                    {new Date(profile.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                        <UserRoleButton 
                            userId={profile.id} 
                            currentRole={profile.role} 
                            currentUserId={currentUser?.id} 
                        />
                        <UserDetailsDialog user={profile} />
                    </div>
                </TableCell>
              </TableRow>
            ))}
            {(profiles?.length === 0) && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center h-48">
                        <div className="flex flex-col items-center gap-3 text-zinc-500">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                <Search className="h-6 w-6 opacity-50" />
                            </div>
                            <p className="font-medium">No users found matching your search.</p>
                        </div>
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
