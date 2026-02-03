'use client'

import { useState } from 'react'
import { updateTrackStatus } from './actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Play, Pause, Check, X, Download } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export default function ContentList({ initialTracks, status = 'pending' }: { initialTracks: any[], status?: string }) {
  const [selectedTrack, setSelectedTrack] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)

  const handleApprove = async (id: string) => {
    try {
        await updateTrackStatus(id, 'approved')
        // Optimistic update or router.refresh handling happens via server action revalidate
    } catch (e) {
        console.error(e)
    }
  }

  const handleReject = async () => {
    if (!selectedTrack) return
    try {
        await updateTrackStatus(selectedTrack.id, 'rejected', rejectionReason)
        setIsRejectDialogOpen(false)
        setRejectionReason('')
        setSelectedTrack(null)
    } catch (e) {
        console.error(e)
    }
  }

  const handleDownload = (track: any) => {
      // 1. Define Headers
      const headers = [
          "Track Title", "Artist Name", "Album Title", "ISRC", "UPC", 
          "Release Date", "Genre", "Language", "Explicit", "Duration (s)", 
          "Track Number", "Album Type", "Audio File URL", "Artist Email"
      ]

      // 2. Map Data
      const row = [
          track.title,
          track.profiles?.artist_name || track.profiles?.full_name,
          track.albums?.title || "Single",
          track.isrc || "",
          track.albums?.upc || "",
          track.albums?.release_date || "",
          track.genre,
          track.language,
          track.is_explicit ? "Yes" : "No",
          track.duration,
          track.track_number,
          track.albums?.type || "Single",
          track.file_url,
          track.profiles?.email
      ]

      // 3. Generate CSV
      const csvContent = [
          headers.join(','),
          row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')
      ].join('\n')

      // 4. Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${track.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_metadata.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
  }

  return (
    <div className="bg-white rounded-md border dark:bg-gray-900">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Audio</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialTracks.map((track) => (
            <TableRow key={track.id}>
              <TableCell className="font-medium">{track.title}</TableCell>
              <TableCell>{track.profiles?.artist_name || 'Unknown'}</TableCell>
              <TableCell>{track.genre}</TableCell>
              <TableCell>{new Date(track.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                 <audio controls src={track.file_url} className="h-8 w-48" />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                    {/* Common Action: Download CSV */}
                    <Button size="sm" variant="outline" onClick={() => handleDownload(track)} title="Download Metadata">
                        <Download size={16} />
                    </Button>

                    {/* Pending Actions */}
                    {(!status || status === 'pending') && (
                        <>
                            <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(track.id)}>
                                <Check size={16} className="mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => {
                                setSelectedTrack(track)
                                setIsRejectDialogOpen(true)
                            }}>
                                <X size={16} className="mr-1" /> Reject
                            </Button>
                        </>
                    )}

                    {/* Approved Actions (Take Down) */}
                    {status === 'approved' && (
                        <Button size="sm" variant="destructive" onClick={() => {
                            setSelectedTrack(track)
                            setIsRejectDialogOpen(true)
                        }}>
                            <X size={16} className="mr-1" /> Take Down
                        </Button>
                    )}
                    
                    {/* Rejected Actions (Maybe Re-approve mistake?) */}
                    {status === 'rejected' && (
                         <Button size="sm" variant="outline" onClick={() => handleApprove(track.id)}>
                            <Check size={16} className="mr-1" /> Re-Approve
                        </Button>
                    )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {initialTracks.length === 0 && (
            <TableRow>
                <TableCell colSpan={6} className="text-center h-24">No {status} tracks found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Reject Track: {selectedTrack?.title}</DialogTitle>
                <DialogDescription>
                    Please provide a reason for rejection. This will be sent to the artist.
                </DialogDescription>
            </DialogHeader>
            <Textarea 
                placeholder="e.g. Low audio quality, copyright infringement..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
            />
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleReject}>Reject Track</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
