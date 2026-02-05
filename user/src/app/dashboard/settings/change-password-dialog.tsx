'use client'

import { useState } from 'react'
import { changePassword } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2 } from 'lucide-react'

export default function ChangePasswordDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
        await changePassword(formData)
        toast.success("Password updated successfully")
        setOpen(false)
    } catch (e: any) {
        toast.error("Failed to update password: " + e.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Change Password</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Change Password</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Enter your new password below.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">New Password</Label>
                <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required
                    placeholder="••••••••" 
                    className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" 
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm Password</Label>
                <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password"
                    required 
                    placeholder="••••••••" 
                    className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" 
                />
            </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white w-full sm:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
