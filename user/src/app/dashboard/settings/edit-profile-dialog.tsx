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
                    <Label htmlFor="legalName" className="text-zinc-300">Legal Name</Label>
                    <Input id="legalName" name="legalName" defaultValue={profile?.legal_name || ''} placeholder="Your full legal name as per ID" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="text-zinc-300">Date of Birth</Label>
                        <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={profile?.date_of_birth || ''} className="bg-zinc-900 border-white/10 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender" className="text-zinc-300">Gender</Label>
                        <select id="gender" name="gender" defaultValue={profile?.gender || ''} className="flex h-10 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="non-binary">Non-binary</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-zinc-300">Phone Number</Label>
                    <Input id="phone" name="phone" defaultValue={profile?.phone || ''} placeholder="+91 9876543210" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address" className="text-zinc-300">Address</Label>
                    <Textarea id="address" name="address" defaultValue={profile?.address || ''} placeholder="Street address" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 h-20" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city" className="text-zinc-300">City</Label>
                        <Input id="city" name="city" defaultValue={profile?.city || ''} placeholder="City" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="postalCode" className="text-zinc-300">Postal Code</Label>
                        <Input id="postalCode" name="postalCode" defaultValue={profile?.postal_code || ''} placeholder="PIN" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country" className="text-zinc-300">Country</Label>
                        <Input id="country" name="country" defaultValue={profile?.country || ''} placeholder="Country" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 pt-4">
                <h3 className="text-sm font-medium mb-4 text-zinc-400">Artist Verification (Phase 3)</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="spotifyArtistId" className="text-zinc-300">Spotify Artist URI</Label>
                        <Input id="spotifyArtistId" name="spotifyArtistId" defaultValue={profile?.spotify_artist_id || ''} placeholder="spotify:artist:..." className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="appleArtistId" className="text-zinc-300">Apple Artist ID</Label>
                        <Input id="appleArtistId" name="appleArtistId" defaultValue={profile?.apple_artist_id || ''} placeholder="e.g. 123456789" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                    </div>
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
                    <div className="space-y-2">
                        <Label htmlFor="paypalEmail" className="text-zinc-300">PayPal Email</Label>
                        <Input id="paypalEmail" name="paypalEmail" type="email" defaultValue={profile?.paypal_email || ''} placeholder="you@example.com" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="upiId" className="text-zinc-300">UPI ID</Label>
                        <Input id="upiId" name="upiId" defaultValue={profile?.upi_id || ''} placeholder="username@upi" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                    </div>
                </div>
            </div>
            <div className="border-t border-white/10 pt-4">
                <h3 className="text-sm font-medium mb-4 text-zinc-400">Social Presence</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="instagramUrl" className="text-zinc-300">Instagram URL</Label>
                        <Input id="instagramUrl" name="instagramUrl" defaultValue={profile?.instagram_url || ''} placeholder="https://instagram.com/..." className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="twitterUrl" className="text-zinc-300">Twitter URL</Label>
                        <Input id="twitterUrl" name="twitterUrl" defaultValue={profile?.twitter_url || ''} placeholder="https://twitter.com/..." className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="youtubeUrl" className="text-zinc-300">YouTube Channel</Label>
                        <Input id="youtubeUrl" name="youtubeUrl" defaultValue={profile?.youtube_url || ''} placeholder="https://youtube.com/@..." className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="websiteUrl" className="text-zinc-300">Website</Label>
                        <Input id="websiteUrl" name="websiteUrl" defaultValue={profile?.website_url || ''} placeholder="https://yourwebsite.com" className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="tiktokUrl" className="text-zinc-300">TikTok URL</Label>
                        <Input id="tiktokUrl" name="tiktokUrl" defaultValue={profile?.tiktok_url || ''} placeholder="https://tiktok.com/@..." className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600" />
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
