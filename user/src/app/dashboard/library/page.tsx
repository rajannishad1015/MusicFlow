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

export default async function LibraryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return <div>Unauthorized</div>

  const { data: tracks, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('artist_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Library</h1>
      </div>

       <div className="bg-white rounded-md border dark:bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tracks?.map((track) => (
              <TableRow key={track.id}>
                <TableCell className="font-medium">{track.title}</TableCell>
                <TableCell>{track.genre}</TableCell>
                <TableCell>{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</TableCell>
                <TableCell>{new Date(track.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                    <Badge variant={track.status === 'approved' ? 'default' : track.status === 'rejected' ? 'destructive' : 'secondary'}>
                        {track.status}
                    </Badge>
                </TableCell>
              </TableRow>
            ))}
             {tracks?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        You haven't uploaded any tracks yet.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
       </div>
    </div>
  )
}
