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
    <div className="space-y-6">
      <div className="relative max-w-md group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
        <Input 
          placeholder="Search Title, Artist, UPC, ISRC..." 
          className="pl-9 bg-zinc-900/50 border-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500/50 h-10 rounded-xl transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 bg-white/[0.02] hover:bg-white/[0.02]">
              <TableHead className="w-[300px] text-[10px] uppercase font-black tracking-widest text-zinc-500">Track Info</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Identifiers</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Genre</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Submitted</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Preview</TableHead>
              <TableHead className="text-right text-[10px] uppercase font-black tracking-widest text-zinc-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTracks.map((track) => (
              <TableRow key={track.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                <TableCell>
                  <div className="flex flex-col">
                    <a href={`/dashboard/content/${track.id}`} className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors hover:underline">{track.title}</a>
                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{track.profiles?.artist_name || 'Unknown'} • <span className="text-zinc-600">{track.albums?.title || 'Single'}</span></span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] h-4 px-1 bg-white/5 border-white/10 text-zinc-400 font-mono tracking-wider">UPC</Badge>
                        <span className="text-xs font-mono text-zinc-300">{track.albums?.upc || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] h-4 px-1 bg-white/5 border-white/10 text-zinc-400 font-mono tracking-wider">ISRC</Badge>
                        <span className="text-xs font-mono text-zinc-300">{track.isrc || 'N/A'}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-zinc-300 bg-white/5 px-2 py-0.5 rounded-full w-fit border border-white/5">{track.genre}</span>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider pl-1">{track.albums?.sub_genre || '-'}</span>
                  </div>
                </TableCell>
                <TableCell>
                    <span className="text-xs text-zinc-500 font-mono">{new Date(track.created_at).toLocaleDateString()}</span>
                </TableCell>
                <TableCell>
                   <div className="p-1 bg-zinc-950/50 rounded-lg border border-white/5 w-fit">
                       <audio controls src={track.file_url} className="h-6 w-36 opacity-80 hover:opacity-100 transition-opacity" />
                   </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="outline" onClick={() => handleDownload(track)} className="h-8 w-8 p-0 rounded-lg bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800">
                          <Download size={14} />
                      </Button>

                      {(!status || status === 'pending') && (
                          <>
                              <Button size="sm" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 h-8 rounded-lg font-bold text-xs" onClick={() => handleApprove(track.id)}>
                                  <Check size={14} className="mr-1" /> Approve
                              </Button>
                              <Button size="sm" className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 h-8 rounded-lg font-bold text-xs" onClick={() => {
                                  setSelectedTrack(track)
                                  setIsRejectDialogOpen(true)
                              }}>
                                  <X size={14} className="mr-1" /> Reject
                              </Button>
                          </>
                      )}

                      {status === 'approved' && (
                          <Button size="sm" className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 h-8 rounded-lg font-bold text-xs" onClick={() => {
                              setSelectedTrack(track)
                              setIsRejectDialogOpen(true)
                          }}>
                              <X size={14} className="mr-1" /> Take Down
                          </Button>
                      )}
                      
                      {status === 'rejected' && (
                           <Button size="sm" variant="outline" className="h-8 rounded-lg bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={() => handleApprove(track.id)}>
                              <Check size={14} className="mr-1" /> Re-Approve
                          </Button>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredTracks.length === 0 && (
              <TableRow>
                  <TableCell colSpan={6} className="text-center h-48">
                    <div className="flex flex-col items-center gap-3 text-zinc-500">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                            <Music className="h-6 w-6 opacity-30" />
                        </div>
                        <p className="font-medium">No {status} tracks found.</p>
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
