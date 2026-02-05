import { createClient } from '@/utils/supabase/server'
import { User, Mail, Phone, MapPin, Lock, Edit2, CreditCard } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import EditProfileDialog from './edit-profile-dialog'
import ChangePasswordDialog from './change-password-dialog'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Cinematic Gradient Header */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 p-8 md:p-10">
          <div className="relative">
             <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-50 rounded-full"></div>
             <div className="relative h-32 w-32 rounded-full bg-zinc-950 border-4 border-zinc-900 flex items-center justify-center overflow-hidden shadow-2xl">
                {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                    <User size={48} className="text-zinc-600" />
                )}
             </div>
          </div>
          
          <div className="text-center md:text-left flex-1 mb-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">{profile?.artist_name || 'Artist Name'}</h1>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                    <Lock size={12} />
                    <span className="font-mono">ID: {profile?.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span>Verified Artist</span>
                </div>
            </div>
          </div>

          <div className="flex gap-3">
             <EditProfileDialog profile={profile} trigger={
                 <Button className="bg-white text-black hover:bg-zinc-200 border-0">
                    <Edit2 size={16} className="mr-2" />
                    Edit Profile
                 </Button>
             } />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         {/* Contact Info */}
         <Card className="md:col-span-1 bg-zinc-900/50 border-white/5 shadow-none h-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <User size={18} className="text-indigo-400" />
                    Contact Info
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-1.5">
                    <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Email Address</div>
                    <div className="flex items-center gap-3 text-zinc-300 bg-zinc-900/80 p-3 rounded-lg border border-white/5">
                        <Mail size={16} className="text-zinc-500" />
                        <span className="truncate">{profile?.email}</span>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Phone Number</div>
                    <div className="flex items-center gap-3 text-zinc-300 bg-zinc-900/80 p-3 rounded-lg border border-white/5">
                        <Phone size={16} className="text-zinc-500" />
                        <span>{profile?.phone || 'Not set'}</span>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Address</div>
                    <div className="flex items-start gap-3 text-zinc-300 bg-zinc-900/80 p-3 rounded-lg border border-white/5">
                        <MapPin size={16} className="text-zinc-500 mt-0.5" />
                        <span className="text-sm leading-relaxed">{profile?.address || 'No address provided'}</span>
                    </div>
                </div>
            </CardContent>
         </Card>

         {/* Account & Security */}
         <div className="md:col-span-2 space-y-6">
            <Card className="bg-zinc-900/50 border-white/5 shadow-none">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                        <CreditCard size={18} className="text-emerald-400" />
                        Financial Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5 space-y-1">
                            <div className="text-xs text-zinc-500 font-medium">Bank Name</div>
                            <div className="font-semibold text-white">{profile?.bank_name || 'Not linked'}</div>
                        </div>
                        <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5 space-y-1">
                            <div className="text-xs text-zinc-500 font-medium">Account Number</div>
                            <div className="font-semibold text-white tracking-widest">
                                {profile?.account_number ? `•••• ${profile.account_number.slice(-4)}` : '••••'}
                            </div>
                        </div>
                        <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5 space-y-1">
                            <div className="text-xs text-zinc-500 font-medium">IFSC Code</div>
                            <div className="font-semibold text-white">{profile?.ifsc_code || '---'}</div>
                        </div>
                        <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5 space-y-1">
                            <div className="text-xs text-zinc-500 font-medium">PAN Number</div>
                            <div className="font-semibold text-white">{profile?.pan_number || '---'}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-white/5 shadow-none">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                        <Lock size={18} className="text-rose-400" />
                        Security
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between bg-zinc-950/50 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-4">
                             <div className="bg-zinc-900 p-2 rounded-lg text-zinc-400">
                                <Lock size={20} />
                             </div>
                             <div>
                                <div className="text-sm font-medium text-white">Password</div>
                                <div className="text-xs text-zinc-500">Last changed 30 days ago</div>
                             </div>
                        </div>
                        <ChangePasswordDialog trigger={
                            <Button variant="outline" size="sm" className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                                Change
                            </Button>
                        } />
                    </div>
                </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}
