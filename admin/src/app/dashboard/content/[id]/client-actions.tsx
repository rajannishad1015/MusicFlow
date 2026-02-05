'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, Loader2 } from 'lucide-react'
import { updateTrackStatus } from '../actions' // Using shared actions from list view or creating new wrapper
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ActionButtons({ track }: { track: any }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')

    const handleApprove = async () => {
        setLoading(true)
        try {
            await updateTrackStatus(track.id, 'approved')
            toast.success('Track approved successfully')
            router.refresh()
        } catch (error: any) {
            toast.error('Failed to approve: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a rejection reason')
            return
        }
        setLoading(true)
        try {
            await updateTrackStatus(track.id, 'rejected', rejectionReason)
            setIsRejectDialogOpen(false)
            setRejectionReason('')
            toast.success('Track rejected')
            router.refresh()
        } catch (error: any) {
            toast.error('Failed to reject: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    if (track.status === 'approved') {
        return (
             <Button 
                variant="destructive" 
                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                onClick={() => setIsRejectDialogOpen(true)}
                disabled={loading}
            >
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <X className="mr-2" size={16} />}
                Take Down
            </Button>
        )
    }

    if (track.status === 'rejected') {
        return (
             <Button 
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={handleApprove}
                disabled={loading}
            >
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Check className="mr-2" size={16} />}
                Re-Approve
            </Button>
        )
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <Button 
                    className="bg-white/5 text-zinc-400 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 border border-white/10"
                    variant="outline"
                    onClick={() => setIsRejectDialogOpen(true)}
                    disabled={loading}
                >
                    <X className="mr-2" size={16} /> Reject
                </Button>
                <Button 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    onClick={handleApprove}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Check className="mr-2" size={16} />}
                    Approve Release
                </Button>
            </div>

            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{track.status === 'approved' ? 'Take Down' : 'Reject'} Release</DialogTitle>
                        <DialogDescription>
                            Please provide a detailed reason for the artist.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea 
                        placeholder="e.g. Audio quality issues at 0:45, Cover art pixelated..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="min-h-[120px]"
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleReject} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Confirm Action'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
