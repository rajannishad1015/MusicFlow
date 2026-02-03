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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-gray-500 mt-1">Manage artists, admins and monitor their activity.</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
         <form className="flex gap-2 w-full md:max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input name="query" placeholder="Search by name or email..." defaultValue={query} className="pl-9" />
            <Button type="submit" variant="secondary">Search</Button>
         </form>
         <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <Link href="/dashboard/users?role=all">
                <Button variant={role === 'all' ? 'secondary' : 'ghost'} size="sm" className="h-8 rounded-md">
                    <UsersIcon className="h-3.5 w-3.5 mr-1.5" /> All
                </Button>
            </Link>
            <Link href="/dashboard/users?role=artist">
                <Button variant={role === 'artist' ? 'secondary' : 'ghost'} size="sm" className="h-8 rounded-md">
                    <Music className="h-3.5 w-3.5 mr-1.5" /> Artists
                </Button>
            </Link>
            <Link href="/dashboard/users?role=admin">
                <Button variant={role === 'admin' ? 'secondary' : 'ghost'} size="sm" className="h-8 rounded-md">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Admins
                </Button>
            </Link>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 dark:bg-gray-900/50">
              <TableHead className="w-[80px]">User</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Tracks</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile: any) => (
              <TableRow key={profile.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                 <TableCell>
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold">
                        {profile.artist_name?.[0] || profile.full_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{profile.artist_name || profile.full_name || 'N/A'}</span>
                            {profile.status && profile.status !== 'active' && (
                                <Badge variant={profile.status === 'banned' ? 'destructive' : 'outline'} className="text-[10px] h-4 px-1 capitalize">
                                    {profile.status}
                                </Badge>
                            )}
                        </div>
                        <span className="text-xs text-gray-500">{profile.email}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant={profile.role === 'admin' ? 'destructive' : 'secondary'} className="capitalize font-medium">
                        {profile.role}
                    </Badge>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-1.5">
                        <Music className="h-3.5 w-3.5 text-gray-400" />
                        <span className="font-medium">{trackCountMap?.[profile.id] || 0}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <span className="font-bold text-green-600">${(profile.balance || 0).toFixed(2)}</span>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
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
                    <TableCell colSpan={7} className="text-center h-48 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                            <Search className="h-8 w-8 opacity-20" />
                            <p>No users found matching your search.</p>
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
