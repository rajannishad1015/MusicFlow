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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from 'next/link' // Actually we need a client component for search or use forms

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

  const { data: { user: currentUser } } = await supabase.auth.getUser()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-md border dark:bg-gray-900">
         <form className="flex gap-2 flex-1">
            <Input name="query" placeholder="Search by name or email..." defaultValue={query} className="max-w-sm" />
            <Button type="submit" variant="secondary">Search</Button>
         </form>
         <div className="flex items-center gap-2">
            <Link href="/dashboard/users?role=all"><Button variant={role === 'all' ? 'default' : 'ghost'} size="sm">All</Button></Link>
            <Link href="/dashboard/users?role=artist"><Button variant={role === 'artist' ? 'default' : 'ghost'} size="sm">Artist</Button></Link>
            <Link href="/dashboard/users?role=admin"><Button variant={role === 'admin' ? 'default' : 'ghost'} size="sm">Admin</Button></Link>
         </div>
      </div>

      <div className="bg-white rounded-md border dark:bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Avatar</TableHead>
              <TableHead>Artist Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile: any) => (
              <TableRow key={profile.id}>
                 <TableCell>
                  <Avatar>
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback>{profile.artist_name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{profile.artist_name || profile.full_name || 'N/A'}</TableCell>
                <TableCell>{profile.email}</TableCell>
                <TableCell>
                    <Badge variant={profile.role === 'admin' ? 'destructive' : 'default'}>
                        {profile.role}
                    </Badge>
                </TableCell>
                <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                        <UserRoleButton 
                            userId={profile.id} 
                            currentRole={profile.role} 
                            currentUserId={currentUser?.id} 
                        />
                        <UserDetailsDialog user={profile} />
                </TableCell>
              </TableRow>
            ))}
            {profiles?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        No users found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
