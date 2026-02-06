'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"
import { Play, Pause, AlertCircle, Edit2, Trash2, ShieldAlert, ClipboardCheck } from 'lucide-react'
import { bulkDeleteTracks, requestTakedown, deleteTrack, requestCorrection } from "./actions"
import Link from 'next/link'
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"

export default function TrackList({ tracks }: { tracks: any[] }) {
  const [isTakedownOpen, setIsTakedownOpen] = useState(false)
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false)
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  
  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [takedownReason, setTakedownReason] = useState('')
  const [correctionField, setCorrectionField] = useState('title')
  const [correctionValue, setCorrectionValue] = useState('')
  const [correctionReason, setCorrectionReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Helper Functions
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Rejected</Badge>
      case 'draft':
        return <Badge className="bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20 border-zinc-500/20">Draft</Badge>
      case 'pending':
        return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">Pending</Badge>
      default:
        return <Badge variant="outline" className="text-zinc-400 border-zinc-700">{status}</Badge>
    }
  }

  // Bulk Actions Handlers
  const handleSelectAll = (checked: boolean) => {
      if (checked) {
          setSelectedIds(tracks.map(t => t.id))
      } else {
          setSelectedIds([])
      }
  }

  const handleSelectOne = (checked: boolean, id: string) => {
      if (checked) {
          setSelectedIds(prev => [...prev, id])
      } else {
          setSelectedIds(prev => prev.filter(tid => tid !== id))
      }
  }

  const handleBulkDelete = async () => {
      if (selectedIds.length === 0) return
      if (!confirm(`Are you sure you want to delete ${selectedIds.length} tracks? This cannot be undone.`)) return

      setIsSubmitting(true)
      try {
          await bulkDeleteTracks(selectedIds)
          toast.success(`Successfully deleted ${selectedIds.length} tracks`)
          setSelectedIds([])
      } catch (err: any) {
          toast.error(err.message || "Bulk delete failed")
      } finally {
          setIsSubmitting(false)
      }
  }

  // Individual Action Handlers
  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this track? This action cannot be undone.")) return

      try {
          await deleteTrack(id)
          toast.success("Track deleted successfully")
      } catch (err: any) {
          toast.error(err.message || "Failed to delete track")
      }
  }

  const openTakedownDialog = (id: string) => {
      setSelectedTrackId(id)
      setTakedownReason('')
      setIsTakedownOpen(true)
  }

  const submitTakedown = async () => {
      if (!selectedTrackId) return
      if (!takedownReason.trim()) {
          toast.error("Please provide a reason for takedown")
          return
      }

      setIsSubmitting(true)
      try {
          await requestTakedown(selectedTrackId, takedownReason)
          toast.success("Takedown request submitted")
          setIsTakedownOpen(false)
      } catch (err: any) {
          toast.error(err.message || "Failed to submit request")
      } finally {
          setIsSubmitting(false)
      }
  }

  // Filter selectable tracks for "Delete" (Draft/Rejected only)
  const canDeleteSelected = selectedIds.every(id => {
      const track = tracks.find(t => t.id === id)
      return track && (track.status === 'draft' || track.status === 'rejected')
  })

  return (
    <div className="rounded-md relative pb-20">
        <Table>
            <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="w-[40px]">
                        <Checkbox 
                            checked={tracks.length > 0 && selectedIds.length === tracks.length}
                            onCheckedChange={handleSelectAll}
                            className="border-zinc-600 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                        />
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 h-10 w-[80px]">Cover</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 h-10">Title / ISRC</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 h-10">Genre</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 h-10">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 h-10 text-right">Delivery Date</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 h-10 w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tracks.map((track) => (
                    <TableRow key={track.id} className={`border-white/5 hover:bg-white/[0.02] transition-colors group ${selectedIds.includes(track.id) ? 'bg-white/[0.04]' : ''}`}>
                        <TableCell className="py-4">
                            <Checkbox 
                                checked={selectedIds.includes(track.id)}
                                onCheckedChange={(checked) => handleSelectOne(checked as boolean, track.id)}
                                className="border-zinc-600 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                            />
                        </TableCell>
                        <TableCell className="py-4">
                            {/* ... (Existing Cover Art Cell) ... */}
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden shadow-lg border border-white/10 group-hover:border-white/30 transition-all">
                                <img src={track.albums?.cover_art_url || "/placeholder.png"} alt="Cover" className="h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Play size={16} className="text-white fill-white" />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">{track.title}</span>
                                <span className="text-[10px] text-zinc-500 font-mono mt-1 flex items-center gap-2">
                                    <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5">ID: {track.id.substring(0, 8).toUpperCase()}</span>
                                    {track.isrc && <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5 text-zinc-400">ISRC: {track.isrc}</span>}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <span className="text-xs font-medium text-zinc-400 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                {track.genre}
                            </span>
                        </TableCell>
                        <TableCell>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        {getStatusBadge(track.status)}
                                    </TooltipTrigger>
                                    {track.status === 'rejected' && track.rejection_reason && (
                                        <TooltipContent side="right" className="bg-red-950 border-red-900 text-red-200">
                                            <p className="font-bold text-xs uppercase tracking-wider mb-1">Rejection Reason:</p>
                                            <p className="text-xs">{track.rejection_reason}</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right">
                            <span className="text-xs font-medium text-zinc-500 tabular-nums">
                                {new Date(track.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                        </TableCell>
                        <TableCell>
                            {/* Existing Actions (Edit/Delete/Correction/Takedown) - Kept same */}
                             {(track.status === 'draft' || track.status === 'rejected') && (
                                <div className="flex items-center gap-1">
                                    <Link href={`/dashboard/tracks/${track.id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full">
                                            <Edit2 size={14} />
                                        </Button>
                                    </Link>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDelete(track.id)}
                                        className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full"
                                        title="Delete Release"
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                             )}
                             {track.status === 'approved' && (
                                <div className="flex items-center gap-1">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => {
                                            setSelectedTrackId(track.id);
                                            setCorrectionField('title');
                                            setCorrectionValue(track.title);
                                            setCorrectionReason('');
                                            setIsCorrectionOpen(true);
                                        }}
                                        className="h-8 w-8 text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-full"
                                        title="Request Metadata Correction"
                                    >
                                        <ClipboardCheck size={14} />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => openTakedownDialog(track.id)}
                                        className="h-8 w-8 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-full"
                                        title="Request Takedown"
                                    >
                                        <ShieldAlert size={14} />
                                    </Button>
                                </div>
                             )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

        {/* Bulk Action Floating Bar */}
        {selectedIds.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl z-50 animate-in slide-in-from-bottom-5">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                    {selectedIds.length} Selected
                </span>
                <div className="h-4 w-px bg-white/10"></div>
                <div className="flex items-center gap-2">
                    {canDeleteSelected ? (
                        <Button 
                            onClick={handleBulkDelete} 
                            disabled={isSubmitting}
                            variant="destructive"
                            size="sm"
                            className="rounded-full h-8 text-xs font-bold uppercase tracking-wider bg-red-500 hover:bg-red-600"
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete Selected'}
                        </Button>
                    ) : (
                        <span className="text-[10px] text-zinc-500 italic">Selection contains non-deletable items</span>
                    )}
                    <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedIds([])}
                        className="rounded-full h-8 text-xs text-zinc-400 hover:text-white"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        )}

        <Dialog open={isCorrectionOpen} onOpenChange={setIsCorrectionOpen}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-indigo-400">
                        <ClipboardCheck size={20} /> Request Correction
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Suggest metadata updates for your approved release. Admins will review the changes.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label className="text-zinc-300">Field to Correct</Label>
                        <select 
                            value={correctionField} 
                            onChange={(e) => setCorrectionField(e.target.value)}
                            className="bg-white/5 border border-white/10 text-white rounded-md p-2 text-sm"
                        >
                            <option value="title">Release Title</option>
                            <option value="isrc">ISRC</option>
                            <option value="genre">Genre</option>
                            <option value="primary_artist">Artist Name</option>
                            <option value="p_line">P-Line</option>
                            <option value="c_line">C-Line</option>
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-zinc-300">New Value</Label>
                        <Input
                            value={correctionValue}
                            onChange={(e) => setCorrectionValue(e.target.value)}
                            placeholder="Enter the correct metadata..."
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-zinc-300">Reason / Reference</Label>
                        <Textarea
                            value={correctionReason}
                            onChange={(e) => setCorrectionReason(e.target.value)}
                            placeholder="Why is this change necessary?"
                            className="bg-white/5 border-white/10 text-white min-h-[80px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsCorrectionOpen(false)} className="text-zinc-400 hover:text-white">Cancel</Button>
                    <Button 
                        onClick={async () => {
                            if (!selectedTrackId) return;
                            setIsSubmitting(true);
                            try {
                                await requestCorrection(selectedTrackId, correctionField, correctionValue, correctionReason);
                                toast.success("Correction request submitted");
                                setIsCorrectionOpen(false);
                            } catch (err: any) {
                                toast.error(err.message || "Failed to submit request");
                            } finally {
                                setIsSubmitting(false);
                            }
                        }} 
                        disabled={isSubmitting} 
                        className="bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Update'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={isTakedownOpen} onOpenChange={setIsTakedownOpen}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-amber-500">
                        <ShieldAlert size={20} /> Request Takedown
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Are you sure you want to take down this release? This action will notify the admin team.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="reason" className="text-zinc-300">Reason for removal</Label>
                        <Textarea
                            id="reason"
                            value={takedownReason}
                            onChange={(e) => setTakedownReason(e.target.value)}
                            placeholder="Please explain why you want to take down this release..."
                            className="bg-white/5 border-white/10 text-white min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsTakedownOpen(false)} className="text-zinc-400 hover:text-white">Cancel</Button>
                    <Button onClick={submitTakedown} disabled={isSubmitting} className="bg-amber-600 hover:bg-amber-500 text-white">
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}
