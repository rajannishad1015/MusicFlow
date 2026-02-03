'use client'

import { updateProfile } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function ProfileForm({ profile }: { profile: any }) {

  const handleSubmit = async (formData: FormData) => {
    try {
        await updateProfile(formData)
        toast.success("Profile updated successfully")
    } catch (e: any) {
        toast.error("Failed to update profile: " + e.message)
    }
  }

  return (
    <form action={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Artist Profile</CardTitle>
          <CardDescription>Update your public artist information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="artistName">Artist Name</Label>
                <Input id="artistName" name="artistName" defaultValue={profile?.artist_name || ''} placeholder="Stage Name" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="fullName">Legal Name</Label>
                <Input id="fullName" name="fullName" defaultValue={profile?.full_name || ''} placeholder="Legal Name" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" defaultValue={profile?.bio || ''} placeholder="Tell us about yourself..." />
            </div>
             <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile?.email} disabled className="bg-gray-100" />
            </div>

            <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Payment Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input id="bankName" name="bankName" defaultValue={profile?.bank_name || ''} placeholder="e.g. HDFC Bank" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input id="accountNumber" name="accountNumber" defaultValue={profile?.account_number || ''} placeholder="XXXXXXXXXXXX" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ifscCode">IFSC Code</Label>
                        <Input id="ifscCode" name="ifscCode" defaultValue={profile?.ifsc_code || ''} placeholder="e.g. HDFC0001234" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="panNumber">PAN Number</Label>
                        <Input id="panNumber" name="panNumber" defaultValue={profile?.pan_number || ''} placeholder="ABCDE1234F" />
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Button type="submit">Save Changes</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
