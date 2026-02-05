'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Disc, CheckCircle, DollarSign, Ticket, Mic2, FileText, Music, ShieldCheck } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { cn } from "@/lib/utils"
import RevenueCard from "@/components/revenue-card"
import Link from "next/link"

export default function DashboardHome({ 
    user, 
    tracks, 
    stats 
}: { 
    user: any, 
    tracks: any[], 
    stats: { 
        total: number, 
        approved: number, 
        revenue: number, 
        tickets: number,
        statusCounts: any[],
        genres: any[]
    } 
}) {
    
    // Config for Charts (Cinematic Neon Palette)
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7']; 
    
    // Status Data for Pie Chart (Advanced Cinematic Feel)
    const statusData = [
        { name: 'Approved', value: stats.statusCounts.find(s => s.status === 'approved')?.count || 0, color: '#10b981' }, // Emerald Glow
        { name: 'Rejected', value: stats.statusCounts.find(s => s.status === 'rejected')?.count || 0, color: '#ef4444' }, // Rose Neon
        { name: 'In Review', value: stats.statusCounts.find(s => s.status === 'pending')?.count || 0, color: '#f59e0b' }, // Amber Neon
        { name: 'Draft', value: stats.statusCounts.find(s => s.status === 'draft')?.count || 0, color: '#6366f1' },    // Indigo Glow
    ].filter(item => item.value > 0);
 
    // If empty, show a placeholder
    if (tracks.length === 0 && stats.total === 0) {
        return (
            <div className="flex items-center justify-center h-[60vh] w-full">
                <div className="text-center">
                    <div className="w-20 h-20 bg-white/5 backdrop-blur-3xl rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
                         <Music size={40} className="text-white/20" />
                    </div>
                    <h2 className="text-3xl font-black mb-4 text-white tracking-tighter">Initialize Your Catalog</h2>
                    <p className="text-zinc-500 mb-10 max-w-sm mx-auto font-medium">Your artistic journey begins with a single release. Launch your first delivery to track performance intelligence.</p>
                    <Link href="/dashboard/upload">
                        <Button className="h-14 px-10 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-full hover:bg-indigo-500 hover:text-white transition-all shadow-2xl">
                            Launch Your First Release
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12">
            {/* 1. Cinematic KPI Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative overflow-hidden p-1">
                {/* Background Glows */}
                <div className="absolute -inset-20 bg-indigo-500/5 blur-[120px] pointer-events-none rounded-full" />
                
                {/* Total Releases */}
                <Card className="bg-white/[0.03] backdrop-blur-2xl border-white/20 shadow-2xl relative overflow-hidden group transition-all hover:border-white/40">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em]">Discography</CardTitle>
                        <Disc className="h-4 w-4 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black tracking-tighter text-white">{stats.total}</div>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-black tracking-wider">TRACKS</span>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Total Distributions</p>
                        </div>
                    </CardContent>
                    <div className="absolute -right-2 -bottom-2 opacity-10 blur-xl group-hover:opacity-20 transition-opacity">
                         <Disc size={80} className="text-indigo-500" />
                    </div>
                </Card>

                {/* Validated */}
                <Card className="bg-white/[0.03] backdrop-blur-2xl border-white/20 shadow-2xl relative overflow-hidden group transition-all hover:border-emerald-500/50">
                     <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.25em]">Active Releases</CardTitle>
                        <CheckCircle className="h-4 w-4 text-emerald-500/20 group-hover:text-emerald-500 transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black tracking-tighter text-emerald-500">{stats.approved}</div>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-black tracking-wider">STREAMING</span>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Store Visibility</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue */}
                <div className="col-span-1">
                     <RevenueCard balance={stats.revenue} />
                </div>

                {/* Open Tickets */}
                <Card className="bg-white/[0.03] backdrop-blur-2xl border-white/20 shadow-2xl relative overflow-hidden group transition-all hover:border-indigo-500/50">
                     <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em]">Label Support</CardTitle>
                        <Ticket className="h-4 w-4 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black tracking-tighter text-white">{stats.tickets}</div>
                        <div className="flex items-center gap-2 mt-3">
                             <span className="text-[9px] bg-white/5 text-zinc-400 border border-white/10 px-2 py-0.5 rounded-full font-black tracking-wider">TICKETS</span>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Resolution Status</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 2. Advanced Intelligence Layer: Charts */}
            <div className="grid gap-8 md:grid-cols-12">
                {/* Distribution (Advanced Donut) */}
                <Card className="md:col-span-4 bg-white/[0.03] backdrop-blur-3xl border-white/20 shadow-2xl overflow-hidden group hover:border-white/40 transition-colors">
                    <CardHeader className="pb-0 pt-8 px-8">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Release Status</CardTitle>
                            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="flex flex-col gap-10">
                            {/* Pro Cinematic Donut */}
                            <div className="h-[200px] w-full relative" style={{ width: '100%', height: 200 }}>
                                <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0} debounce={1}>
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={95}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="rgba(0,0,0,0.5)"
                                            strokeWidth={4}
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.color} 
                                                    className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] transition-all duration-300 hover:opacity-80"
                                                />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)', color: '#fff' }}
                                            itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Intelligence */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1">Total</span>
                                    <span className="text-3xl font-black text-white leading-none tracking-tighter tabular-nums">{stats.total}</span>
                                </div>
                                {/* Outer Glow Effect */}
                                <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none scale-110 opacity-30" />
                            </div>

                            {/* Advanced Vertical Ledger */}
                            <div className="space-y-3">
                                {statusData.map((item, idx) => {
                                    const percentage = stats.total > 0 ? ((item.value / stats.total) * 100).toFixed(0) : 0;
                                    return (
                                        <div key={idx} className="flex items-center justify-between group/item cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}40` }} />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover/item:text-white transition-colors">{item.name}</span>
                                                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">Status</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-5 text-right">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-white tabular-nums">{item.value}</span>
                                                    <span className="text-[9px] font-medium text-zinc-600 font-mono tracking-tighter">{percentage}% SHARE</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Genre (Holographic Radar) */}
                <Card className="md:col-span-8 bg-white/[0.03] backdrop-blur-3xl border-white/20 shadow-2xl overflow-hidden hover:border-white/40 transition-colors group relative">
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />
                    
                    <CardHeader className="pb-0 pt-8 px-8 flex flex-row items-center justify-between relative z-10">
                        <div className="space-y-1">
                            <CardTitle className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                Genre Breakdown
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]" />
                            </CardTitle>
                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Success Metrics</p>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase tracking-widest backdrop-blur-md">
                            Style Mix
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 relative z-10">
                        <div className="h-[300px] w-full flex items-center justify-center" style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0} debounce={1}>
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.genres.length > 2 ? stats.genres : [...stats.genres, { genre: '', count: 0 }, { genre: '', count: 0 }]}>
                                    <PolarGrid gridType="polygon" stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis 
                                        dataKey="genre" 
                                        tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: '900', letterSpacing: '0.1em' }} 
                                    />
                                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                    <Radar
                                        name="Catalog Volume"
                                        dataKey="count"
                                        stroke="#818cf8"
                                        strokeWidth={3}
                                        fill="#6366f1"
                                        fillOpacity={0.4}
                                        className="filter drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                    />
                                    <RechartsTooltip
                                        cursor={false}
                                        contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                                        formatter={(value: any) => [`${value} Tracks`, 'Volume']}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Operational Ledger (Midnight Edition) */}
            <div className="grid gap-8 md:grid-cols-12 relative">
                 {/* Decorative Glow */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />

                 {/* System Health */}
                 <div className="md:col-span-3 space-y-4">
                     <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-2">Artist Account</h3>
                     
                     <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/20 flex flex-col gap-6 text-white shadow-2xl relative overflow-hidden group hover:border-white/40 transition-colors">
                         <div className="relative z-10">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Verification</p>
                            <p className="text-xl font-black tracking-tighter">Verified Artist</p>
                         </div>
                         <div className="relative z-10 flex items-center gap-2 mt-auto">
                             <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full">Official Status</div>
                         </div>
                         <ShieldCheck className="absolute -right-6 -bottom-6 text-white/5 group-hover:text-indigo-500/10 transition-colors" size={120} />
                     </div>

                     <div className="bg-white/5 p-4 border border-white/20 rounded-2xl flex items-center gap-4 group transition-all hover:bg-white/10 hover:border-white/40">
                         <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                             <FileText size={18} />
                         </div>
                         <div>
                             <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Agreements</p>
                             <p className="text-xs font-black text-white tracking-widest">Signed License</p>
                         </div>
                     </div>
                 </div>

                 {/* Catalog Ledger (Dark Mode) */}
                 <div className="md:col-span-9">
                     <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Recent Deliveries</h3>
                        <Link href="/dashboard/catalog" className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-[0.2em] transition-colors">View All Releases →</Link>
                     </div>
                     <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:border-white/40 transition-colors">
                        <div className="divide-y divide-white/5">
                            {tracks.length > 0 ? tracks.slice(0, 5).map((track) => (
                                <div key={track.id} className="p-5 flex items-center gap-6 hover:bg-white/5 transition-all group cursor-pointer">
                                    <div className="h-12 w-12 bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0 border border-white/5 shadow-inner">
                                        {track.albums?.cover_art_url ? (
                                            <img src={track.albums.cover_art_url} alt="Cover" className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-zinc-700"><Disc size={20} /></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-sm text-white truncate tracking-tight mb-1">{track.title}</p>
                                        <div className="flex items-center gap-3">
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate">{track.albums?.title || 'Collection'}</p>
                                            <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                            <p className="text-[10px] text-zinc-600 font-mono tracking-tighter">#{track.id.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex flex-col items-end gap-2">
                                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Node Status</span>
                                        <StatusBadge status={track.status} />
                                    </div>
                                </div>
                            )) : (
                                <div className="p-20 text-center">
                                    <p className="text-sm text-zinc-600 font-black uppercase tracking-[0.3em]">No Activity Records Found</p>
                                </div>
                            )}
                        </div>
                     </div>
                 </div>
            </div>
        </div>
    )
}

function LegendItem({ label, count, color }: { label: string, count: number, color: string }) {
    return (
        <div className="flex items-center justify-between p-3 border-b border-black/5 group hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2" style={{ backgroundColor: color }} />
                <span className="text-[11px] font-black text-black uppercase tracking-wider">{label}</span>
            </div>
            <span className="text-[11px] font-black text-gray-400 group-hover:text-black">{count}</span>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        draft: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
    }
    
    return (
        <span className={cn(
            "text-[8px] font-black px-3 py-1 rounded-full border shadow-[0_0_15px_rgba(0,0,0,0.2)] tracking-[0.1em]",
            styles[status] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
        )}>
            {status.toUpperCase()}
        </span>
    )
}
