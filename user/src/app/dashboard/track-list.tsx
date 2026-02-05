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
import { useState } from "react"
import { Play, Pause, AlertCircle, Edit2, Trash2, ShieldAlert } from 'lucide-react'
import { requestTakedown, deleteTrack } from "./actions"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link'

export default function TrackList({ tracks }: { tracks: any[] }) {
  const [isTakedownOpen, setIsTakedownOpen] = useState(false)
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  const [takedownReason, setTakedownReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (tracks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="text-zinc-500" />
             </div>
             <h3 className="text-white font-bold text-lg mb-2">No Releases Found</h3>
             <p className="text-zinc-500 text-sm max-w-xs">Your discography is empty. Start your journey by creating your first release.</p>
        </div>
      )
  }

  const getStatusBadge = (status: string) => {
    const styles = {
        approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
        rejected: "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
        pending: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
        draft: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]",
        takedown_requested: "bg-orange-500/10 text-orange-400 border-orange-500/20"
    }[status] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";

    return (
        <Badge className={`uppercase text-[9px] font-black tracking-widest border px-2 py-0.5 rounded-full backdrop-blur-md transition-all hover:scale-105 ${styles}`}>
            {status === 'takedown_requested' ? 'Takedown Pending' : status}
        </Badge>
    );
  }

  const openTakedownDialog = (trackId: string) => {
      setSelectedTrackId(trackId)
      setTakedownReason('')
      setIsTakedownOpen(true)
  }

  const submitTakedown = async () => {
      if (!selectedTrackId) return
      if (!takedownReason || takedownReason.trim().length < 5) {
          toast.error("Please provide a valid reason (min 5 characters)")
          return
      }

      setIsSubmitting(true)
      try {
          await requestTakedown(selectedTrackId, takedownReason)
          toast.success("Takedown request submitted")
          setIsTakedownOpen(false)
      } catch (err: any) {
          toast.error(err.message || "Failed to request takedown")
      } finally {
          setIsSubmitting(false)
      }
  }

  const handleDelete = async (trackId: string) => {
      if (!confirm("Are you sure you want to PERMANENTLY delete this release? This cannot be undone.")) return;
      try {
          await deleteTrack(trackId)
          toast.success("Release deleted successfully")
      } catch (err: any) {
          toast.error(err.message || "Failed to delete release")
      }
  }

  return (
    <div className="rounded-md">
        <Table>
            <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
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
                    <TableRow key={track.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <TableCell className="py-4">
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
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => openTakedownDialog(track.id)}
                                    className="h-8 w-8 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-full"
                                    title="Request Takedown"
                                >
                                    <ShieldAlert size={14} />
                                </Button>
                             )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

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
