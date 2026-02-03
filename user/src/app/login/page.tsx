import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Disc, Music, Radio, Headphones, Mic2, PlayCircle } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="h-screen relative overflow-hidden bg-black">
      {/* Background Image with Professional Grading */}
      <div 
        className="absolute inset-0 bg-[url('/auth-bg.png')] bg-cover bg-center bg-no-repeat"
        style={{ filter: 'brightness(0.4) contrast(1.1) saturate(0.9)' }}
      />
      
      {/* Sophisticated Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/20 to-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.03),transparent_50%)]" />

      {/* Content Container */}
      <div className="relative z-10 h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-6xl flex items-center justify-between gap-16">
          {/* Left Side - Professional Branding */}
          <div className="hidden lg:block flex-1 max-w-xl">
            <div className="mb-12">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/5 blur-xl" />
                  <div className="relative w-12 h-12 bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <Disc className="w-7 h-7 text-black" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white tracking-[-0.03em] leading-none uppercase">MusicFlow</h1>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1.5 opacity-80">Distribution Excellence</p>
                </div>
              </div>
            </div>
            
            <div className="mb-12 space-y-4">
              <h2 className="text-6xl font-black text-white leading-[1] tracking-tighter uppercase">
                Powering<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
                  Global Sound
                </span>
              </h2>
              <p className="text-gray-400 text-base font-medium max-w-sm leading-relaxed tracking-tight border-l border-white/10 pl-5">
                The premium distribution infrastructure for elite independent artists and professional labels.
              </p>
            </div>

            {/* Features (Refined Grid) */}
            <div className="grid grid-cols-2 gap-3 mb-12">
              <FeatureCard icon={Music} label="Lossless Distribution" />
              <FeatureCard icon={Radio} label="150+ Store Network" />
              <FeatureCard icon={Headphones} label="Advanced Analytics" />
              <FeatureCard icon={Mic2} label="Priority Support" />
            </div>

            {/* Partner Network */}
            <div className="pt-8 border-t border-white/5">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mb-6 opacity-60">Global Distribution Network</p>
              <div className="flex items-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                <img src="/stores/spotify.png" alt="Spotify" className="h-4 object-contain" />
                <img src="/stores/apple.png" alt="Apple Music" className="h-4 object-contain" />
                <img src="/stores/amazon.png" alt="Amazon Music" className="h-4 object-contain" />
                <img src="/stores/youtube.png" alt="YouTube Music" className="h-5 object-contain" />
                <img src="/stores/deezer.png" alt="Deezer" className="h-4 object-contain" />
              </div>
            </div>
          </div>

          {/* Right Side - Floating Square White Login Card */}
          <div className="w-full lg:w-[480px]">
            <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-10 min-h-[580px] flex flex-col justify-center">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <Disc className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">MusicFlow</h1>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Distribution</p>
                </div>
              </div>

              {/* Form Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                  Sign In
                </h2>
                <p className="text-gray-600 font-medium">
                  Enter your credentials to access the platform
                </p>
              </div>

              {/* Login Form */}
              <form action={login} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">
                    Email Address
                  </label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="artist@example.com" 
                    required 
                    className="h-14 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-0 rounded-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">
                    Password
                  </label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    placeholder="••••••••"
                    required 
                    className="h-14 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-0 rounded-none transition-all"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 border-gray-300 bg-white text-black focus:ring-black rounded-none" 
                    />
                    <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900">Keep me logged in</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm font-bold border-b-2 border-transparent hover:border-black transition-all">
                    Forgot?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-widest rounded-none shadow-xl transition-all"
                >
                  Enter Dashboard
                </Button>

                <div className="text-center pt-4">
                  <span className="text-gray-500 text-sm">
                    New to MusicFlow?{' '}
                  </span>
                  <Link href="/signup" className="text-sm font-black border-b-2 border-black hover:bg-black hover:text-white px-1 transition-all">
                    JOIN NOW
                  </Link>
                </div>
              </form>

              {/* Trust Badge */}
              <div className="mt-10 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-tighter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Encrypted Connection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="group relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/5 p-4 hover:bg-white/10 transition-all duration-300 cursor-default">
      <div className="relative flex items-center gap-3">
        <div className="w-8 h-8 bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
          <Icon className="w-4 h-4 text-white/80 group-hover:text-inherit transition-colors" />
        </div>
        <span className="text-[10px] font-bold text-white/70 tracking-widest uppercase group-hover:text-white transition-colors">{label}</span>
      </div>
    </div>
  )
}

