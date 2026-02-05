'use client'

import { useState } from 'react'
import { updateProfile } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

export default function EditProfileDialog({ profile, trigger }: { profile: any, trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
        await updateProfile(formData)
        toast.success("Profile updated successfully")
        setOpen(false)
    } catch (e: any) {
        toast.error("Failed to update profile: " + e.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Edit Profile</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Profile</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-6 py-4">
             {/* Hidden Fields for required updates */}
             <input type="hidden" name="fullName" value={profile?.full_name || ''} />
             <input type="hidden" name="artistName" value={profile?.artist_name || ''} />
             <input type="hidden" name="bio" value={profile?.bio || ''} />

            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-zinc-300">Phone Number</Label>
                    <Input id="phone" name="phone" defaultValue={profile?.phone || ''} placeholder="+91 9876543210" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address" className="text-zinc-300">Address</Label>
                    <Textarea id="address" name="address" defaultValue={profile?.address || ''} placeholder="Your full address" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                </div>
            </div>

            <div className="border-t border-white/10 pt-4">
                <h3 className="text-sm font-medium mb-4 text-zinc-400">Bank Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="bankName" className="text-zinc-300">Bank Name</Label>
                        <Input id="bankName" name="bankName" defaultValue={profile?.bank_name || ''} placeholder="e.g. HDFC Bank" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accountNumber" className="text-zinc-300">Account Number</Label>
                        <Input id="accountNumber" name="accountNumber" defaultValue={profile?.account_number || ''} placeholder="XXXXXXXXXXXX" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ifscCode" className="text-zinc-300">IFSC Code</Label>
                        <Input id="ifscCode" name="ifscCode" defaultValue={profile?.ifsc_code || ''} placeholder="e.g. HDFC0001234" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="panNumber" className="text-zinc-300">PAN Number</Label>
                        <Input id="panNumber" name="panNumber" defaultValue={profile?.pan_number || ''} placeholder="ABCDE1234F" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                    </div>
                </div>
            </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
