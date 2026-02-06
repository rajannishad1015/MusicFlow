'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { cn } from '@/lib/utils'
import { 
    LayoutDashboard, 
    Disc, 
    ListMusic, 
    FileBarChart, 
    Ticket, 
    CreditCard, 
    ShieldCheck, 
    Wrench, 
    Megaphone, 
    UserPlus, 
    Film, 
    HelpCircle, 
    LogOut,
    ChevronDown,
    PlusCircle
} from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

export default function Sidebar({ user, signOut, pendingTickets }: { user: any, signOut: () => Promise<void>, pendingTickets: number }) {
    const pathname = usePathname()

    return (
        <div className="w-64 flex-shrink-0 bg-zinc-950 text-zinc-400 flex flex-col h-screen border-r border-zinc-800 relative z-20">
            {/* Logo Section (Sophisticated Silver) */}
            <div className="p-7 pb-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-xl" />
                        <div className="relative w-9 h-9 bg-white flex items-center justify-center rounded-sm shadow-2xl">
                            <Disc className="w-5 h-5 text-black" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white tracking-tight leading-none">
                            MusicFlow
                        </h1>
                        <p className="text-[9px] text-zinc-500 font-medium uppercase tracking-[0.15em] mt-1.5 font-mono">Artist Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation - Executive Refinement */}
            <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 scrollbar-hide">
                <p className="px-4 text-[9px] font-semibold text-zinc-600 uppercase tracking-[0.15em] mb-3">Management</p>
                <NavItem href="/dashboard" icon={LayoutDashboard} label="Overview" active={pathname === '/dashboard'} />
                <NavItem href="/dashboard/catalog" icon={ListMusic} label="Releases" active={pathname === '/dashboard/catalog'} />
                <NavItem href="/dashboard/upload" icon={PlusCircle} label="New Delivery" active={pathname === '/dashboard/upload'} />
                
                <div className="h-6" />
                <p className="px-4 text-[9px] font-semibold text-zinc-600 uppercase tracking-[0.15em] mb-3">Enterprise</p>
                <NavItem href="/dashboard/reports" icon={FileBarChart} label="Analytics" active={pathname === '/dashboard/reports'} />
                <NavItem href="/dashboard/finance" icon={CreditCard} label="Finance" active={pathname === '/dashboard/finance'} />
                <div className="relative">
                    <NavItem href="/dashboard/support" icon={Ticket} label="Support" active={pathname?.startsWith('/dashboard/support')} />
                    {pendingTickets > 0 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg shadow-rose-500/20 animate-pulse">
                            {pendingTickets}
                        </span>
                    )}
                </div>
                <NavItem href="/dashboard/settings" icon={Wrench} label="Settings" active={pathname === '/dashboard/settings'} />

                {/* Section Divider */}
                <div className="py-4 px-4">
                    <div className="h-px bg-zinc-800/50" />
                </div>

                {/* Dropdowns */}
                <NavGroup icon={ShieldCheck} label="Rights Manager" />
                <NavGroup icon={Wrench} label="Tools" items={[
                    { href: "/dashboard/tools/audio-converter", label: "Audio Converter" },
                    { href: "/dashboard/tools/advanced-options", label: "Advanced Options" }
                ]} />
                <NavGroup icon={Megaphone} label="Promotions" />

                {/* Section Divider */}
                <div className="py-4 px-4">
                    <div className="h-px bg-zinc-800/50" />
                </div>

                <NavItem href="/dashboard/invite" icon={UserPlus} label="Invite Artist" active={pathname === '/dashboard/invite'} />
                <NavItem href="/dashboard/faq" icon={HelpCircle} label="Documentation" active={pathname === '/dashboard/faq'} />
            </nav>

            {/* Footer / User Profile */}
            <div className="p-6 border-t border-zinc-800">
                <div className="flex items-center gap-3 mb-5 px-1">
                     <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 text-xs font-semibold">
                        {user.email?.[0].toUpperCase()}
                     </div>
                     <div className="overflow-hidden flex-1">
                        <p className="text-xs font-semibold text-zinc-100 truncate">{user.user_metadata?.full_name || 'Verified Artist'}</p>
                        <p className="text-[10px] text-zinc-500 font-medium truncate tracking-tight">{user.email}</p>
                     </div>
                </div>
                
                <form action={signOut}>
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2.5 h-10 transition-all duration-200 hover:bg-white/5 hover:text-white text-zinc-500 rounded-lg group" 
                        type="submit"
                    >
                        <LogOut size={14} className="opacity-60 group-hover:opacity-100" />
                        <span className="text-xs font-medium">Log Out</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}

function NavItem({ href, icon: Icon, label, active }: { href: string, icon: any, label: string, active?: boolean }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        startTransition(() => {
            router.push(href)
        })
    }

    return (
        <Link href={href} onClick={handleClick}>
            <div className={cn(
                "group relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ease-out",
                "hover:scale-[1.02] active:scale-[0.98]",
                active 
                    ? "bg-white/10 text-white shadow-lg shadow-indigo-500/10" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5",
                isPending && "opacity-60"
            )}>
                {/* Active indicator */}
                {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-lg shadow-indigo-500/50" />
                )}
                
                <Icon size={16} className={cn(
                    "transition-all duration-300 ease-out",
                    active ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "text-zinc-600 group-hover:text-zinc-400 group-hover:scale-110"
                )} />
                <span className="text-xs font-medium tracking-wide">{label}</span>
                
                {/* Hover glow effect */}
                {!active && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
            </div>
        </Link>
    )
}

function NavGroup({ 
    icon: Icon, 
    label, 
    items 
}: { 
    icon: any, 
    label: string, 
    items?: { href: string, label: string }[] 
}) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    return (
        <div>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 transition-all duration-300 rounded-lg group",
                    isOpen ? "text-white bg-white/5" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                )}
            >
                <div className="flex items-center gap-3">
                    <Icon size={16} className={cn(
                        "transition-all duration-200",
                        isOpen ? "text-indigo-400" : "text-zinc-600 group-hover:text-zinc-400"
                    )} />
                    <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
                </div>
                <ChevronDown size={12} className={cn("transition-transform duration-200 text-zinc-600", isOpen && "rotate-180")} />
            </button>
            
            {isOpen && (
                <div className="ml-9 mt-1 space-y-1 py-1 border-l border-zinc-800">
                    {items ? items.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "px-4 py-2 text-xs font-medium transition-all duration-200 relative",
                                pathname === item.href 
                                    ? "text-indigo-400" 
                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-r-lg"
                            )}>
                                {pathname === item.href && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-indigo-500 rounded-full" />
                                )}
                                {item.label}
                            </div>
                        </Link>
                    )) : (
                        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600 italic">No Options Available</div>
                    )}
                </div>
            )}
        </div>
    )
}
