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
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Check, X, Download, Search, Music, ExternalLink } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export default function ContentList({ initialTracks, status = 'pending' }: { initialTracks: any[], status?: string }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTrack, setSelectedTrack] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

  const filteredTracks = initialTracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (track.profiles?.artist_name || track.profiles?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (track.isrc || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (track.albums?.upc || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (track.albums?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleApprove = async (id: string) => {
    try {
        await updateTrackStatus(id, 'approved')
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
      // Expanded Metadata Headers
      const headers = [
          "Track Title", "Track Version", "Artist Name", "Featured Artist", 
          "Album Title", "UPC", "ISRC", "Release Date", "Original Release Date",
          "Main Genre", "Sub Genre", "Language", "Explicit", "Duration (s)", 
          "Track Number", "Album Type", "Label", "P Line", "C Line",
          "Spotify ID", "Apple ID", "Cover Art URL", "Audio File URL", "Artist Email"
      ]

      // Map Data
      const row = [
          track.title,
          track.version || "",
          track.profiles?.artist_name || track.profiles?.full_name || "",
          track.albums?.featuring_artist || "",
          track.albums?.title || "Single",
          track.albums?.upc || "",
          track.isrc || "",
          track.albums?.release_date || "",
          track.albums?.original_release_date || "",
          track.genre,
          track.albums?.sub_genre || "",
          track.language,
          track.is_explicit ? "Yes" : "No",
          track.duration,
          track.track_number,
          track.albums?.type || "Single",
          track.albums?.label_name || "",
          track.albums?.p_line || "",
          track.albums?.c_line || "",
          track.albums?.primary_artist_spotify_id || "",
          track.albums?.primary_artist_apple_id || "",
          track.albums?.cover_art_url || "",
          track.file_url,
          track.profiles?.email
      ]

      const csvContent = [
          headers.join(','),
          row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')
      ].join('\n')

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
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search Title, Artist, UPC, ISRC..." 
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-md border dark:bg-gray-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Track Info</TableHead>
              <TableHead>UPC / ISRC</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Audio Preview</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTracks.map((track) => (
              <TableRow key={track.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{track.title}</span>
                    <span className="text-xs text-gray-500">{track.profiles?.artist_name || 'Unknown'} • {track.albums?.title || 'Single'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] h-4 font-mono">UPC</Badge>
                        <span className="text-xs font-mono">{track.albums?.upc || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] h-4 font-mono">ISRC</Badge>
                        <span className="text-xs font-mono">{track.isrc || 'N/A'}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{track.genre}</span>
                    <span className="text-xs text-gray-400">{track.albums?.sub_genre || 'No Sub-genre'}</span>
                  </div>
                </TableCell>
                <TableCell>
                    <span className="text-sm">{new Date(track.created_at).toLocaleDateString()}</span>
                </TableCell>
                <TableCell>
                   <audio controls src={track.file_url} className="h-8 w-40" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleDownload(track)} title="Download CSV Metadata">
                          <Download size={14} />
                      </Button>

                      {(!status || status === 'pending') && (
                          <>
                              <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 h-8" onClick={() => handleApprove(track.id)}>
                                  <Check size={14} className="mr-1" /> Approve
                              </Button>
                              <Button size="sm" variant="destructive" className="h-8" onClick={() => {
                                  setSelectedTrack(track)
                                  setIsRejectDialogOpen(true)
                              }}>
                                  <X size={14} className="mr-1" /> Reject
                              </Button>
                          </>
                      )}

                      {status === 'approved' && (
                          <Button size="sm" variant="destructive" className="h-8" onClick={() => {
                              setSelectedTrack(track)
                              setIsRejectDialogOpen(true)
                          }}>
                              <X size={14} className="mr-1" /> Take Down
                          </Button>
                      )}
                      
                      {status === 'rejected' && (
                           <Button size="sm" variant="outline" className="h-8" onClick={() => handleApprove(track.id)}>
                              <Check size={14} className="mr-1" /> Re-Approve
                          </Button>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredTracks.length === 0 && (
              <TableRow>
                  <TableCell colSpan={6} className="text-center h-32 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                        <Music className="h-8 w-8 opacity-20" />
                        <p>No {status} tracks found matching search.</p>
                    </div>
                  </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{status === 'approved' ? 'Take Down' : 'Reject'} Track: {selectedTrack?.title}</DialogTitle>
                <DialogDescription>
                    Please provide a reason. This will be sent to the artist.
                </DialogDescription>
            </DialogHeader>
            <Textarea 
                placeholder="e.g. Low audio quality, copyright infringement..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
            />
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleReject}>
                    {status === 'approved' ? 'Confirm Take Down' : 'Confirm Rejection'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
