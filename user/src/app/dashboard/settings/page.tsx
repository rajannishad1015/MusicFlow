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
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Cinematic Header */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl group">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-zinc-900/50 to-zinc-950 opacity-80"></div>
        <div className="absolute top-[-50%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] mix-blend-screen animate-pulse duration-[4s]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8 p-8 md:p-12">
          <div className="relative group/avatar">
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 blur-xl opacity-40 group-hover/avatar:opacity-60 transition-opacity duration-500 rounded-full"></div>
             <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full bg-zinc-950 border-4 border-zinc-900/50 flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
                ) : (
                    <User size={64} className="text-zinc-700" />
                )}
             </div>
             <div className="absolute bottom-2 right-2 h-8 w-8 bg-emerald-500 border-4 border-zinc-950 rounded-full flex items-center justify-center shadow-lg" title="Active">
                <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
             </div>
          </div>
          
          <div className="text-center md:text-left flex-1 mb-2">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm mb-2">{profile?.artist_name || 'Artist Name'}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-sm font-medium">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 backdrop-blur-md shadow-sm hover:bg-white/10 transition-colors">
                    <Lock size={12} className="text-zinc-500" />
                    <span className="font-mono tracking-wider text-xs">ID: {profile?.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs uppercase tracking-wider font-bold">Verified Artist</span>
                </div>
            </div>
          </div>

          <div className="flex gap-3 relative z-20">
             <EditProfileDialog profile={profile} trigger={
                 <Button className="bg-white hover:bg-zinc-200 text-black border-0 font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-0.5">
                    <Edit2 size={16} className="mr-2" />
                    Edit Profile
                 </Button>
             } />
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
         {/* Left Column: Contact Info */}
         <div className="md:col-span-4 space-y-6">
             <Card className="bg-zinc-950/50 border-white/10 shadow-xl overflow-hidden relative h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <CardHeader className="pb-4 border-b border-white/5 bg-white/[0.02]">
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-indigo-400 shadow-inner">
                            <User size={16} />
                        </div>
                        Contact Info
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 relative z-10">
                    <div className="space-y-2 group">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <Mail size={10} /> Email Address
                        </div>
                        <div className="flex items-center gap-3 text-zinc-200 bg-zinc-900 p-3.5 rounded-xl border border-white/5 group-hover:border-indigo-500/30 group-hover:bg-zinc-900/80 transition-all shadow-inner">
                            <span className="truncate font-medium text-sm">{profile?.email}</span>
                        </div>
                    </div>
                    <div className="space-y-2 group">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                             <Phone size={10} /> Phone Number
                        </div>
                        <div className="flex items-center gap-3 text-zinc-200 bg-zinc-900 p-3.5 rounded-xl border border-white/5 group-hover:border-indigo-500/30 group-hover:bg-zinc-900/80 transition-all shadow-inner">
                            <span className="font-medium text-sm font-mono">{profile?.phone || 'Not set'}</span>
                        </div>
                    </div>
                    <div className="space-y-2 group">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                             <MapPin size={10} /> Address
                        </div>
                        <div className="flex items-start gap-3 text-zinc-200 bg-zinc-900 p-3.5 rounded-xl border border-white/5 group-hover:border-indigo-500/30 group-hover:bg-zinc-900/80 transition-all shadow-inner min-h-[80px]">
                            <span className="text-sm leading-relaxed text-zinc-400 font-medium">{profile?.address || 'No address provided'}</span>
                        </div>
                    </div>
                </CardContent>
             </Card>
         </div>

         {/* Right Column: Financial & Security */}
         <div className="md:col-span-8 space-y-8">
            {/* Financial Details */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2 px-1">
                    <div className="h-6 w-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Financial Details</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Bank Name</div>
                            <div className="font-bold text-white text-lg">{profile?.bank_name || 'Not linked'}</div>
                        </div>
                        <CreditCard className="absolute bottom-4 right-4 text-emerald-500/10 h-12 w-12 group-hover:text-emerald-500/20 transition-colors" />
                    </div>
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Account Number</div>
                            <div className="font-mono font-bold text-white text-lg tracking-wider">
                                {profile?.account_number ? `•••• ${profile.account_number.slice(-4)}` : '••••'}
                            </div>
                        </div>
                    </div>
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">IFSC Code</div>
                            <div className="font-mono font-bold text-white text-lg">{profile?.ifsc_code || '---'}</div>
                        </div>
                    </div>
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">PAN Number</div>
                            <div className="font-mono font-bold text-white text-lg">{profile?.pan_number || '---'}</div>
                        </div>
                    </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">PayPal Email</div>
                            <div className="font-bold text-white text-lg">{profile?.paypal_email || 'Not linked'}</div>
                        </div>
                    </div>
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">UPI ID</div>
                            <div className="font-mono font-bold text-white text-lg">{profile?.upi_id || 'Not linked'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 mb-2 px-1">
                    <div className="h-6 w-1 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Security</h3>
                </div>
                <div className="bg-zinc-950 border border-white/10 rounded-2xl p-1 shadow-2xl">
                    <div className="bg-zinc-900/50 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-20 pointer-events-none"></div>
                        <div className="flex items-center gap-5 relative z-10">
                             <div className="h-14 w-14 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center text-indigo-400 shadow-lg">
                                <Lock size={24} />
                             </div>
                             <div>
                                <div className="text-base font-bold text-white mb-0.5">Password</div>
                                <div className="text-xs text-zinc-500 font-medium">Last changed 30 days ago</div>
                             </div>
                        </div>
                        <div className="relative z-10 w-full sm:w-auto">
                            <ChangePasswordDialog trigger={
                                <Button variant="outline" className="w-full sm:w-auto bg-transparent border-white/10 text-zinc-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all duration-300">
                                    Change Password
                                </Button>
                            } />
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  )
}
