'use client'

import { useTransition } from 'react'
import { updateUserRole } from './actions'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface UserRoleButtonProps {
    userId: string
    currentRole: string
    currentUserId: string | undefined
}

export default function UserRoleButton({ userId, currentRole, currentUserId }: UserRoleButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleToggle = () => {
        const newRole = currentRole === 'admin' ? 'artist' : 'admin'
        
        startTransition(async () => {
            try {
                // Create FormData to match the server action signature
                const formData = new FormData()
                formData.append('userId', userId)
                formData.append('newRole', newRole)
                
                await updateUserRole(formData)
                toast.success(`User role updated to ${newRole}`)
            } catch (e: any) {
                toast.error("Failed to update role: " + e.message)
            }
        })
    }

    return (
        <Button 
            variant="outline" 
            size="sm"
            onClick={handleToggle}
            disabled={userId === currentUserId || isPending}
            className={`
                h-8 text-xs font-bold uppercase tracking-wider border transition-all
                ${currentRole === 'admin' 
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500 hover:text-white' 
                    : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'}
            `}
        >
            {isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            {currentRole === 'admin' ? 'Demote' : 'Make Admin'}
        </Button>
    )
}
