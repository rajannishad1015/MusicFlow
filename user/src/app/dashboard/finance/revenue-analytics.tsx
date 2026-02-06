'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Sector } from 'recharts'
import { TrendingUp, Globe, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react'

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6']
const GRADIENTS = [
    { start: '#818cf8', end: '#4f46e5' }, // Indigo
    { start: '#34d399', end: '#059669' }, // Emerald
    { start: '#fb7185', end: '#e11d48' }, // Rose
    { start: '#fbbf24', end: '#d97706' }, // Amber
    { start: '#a78bfa', end: '#7c3aed' }, // Violet
]

interface RevenueAnalyticsProps {
    data: {
        platformData: { name: string, value: number }[];
        trackData: { name: string, value: number }[];
        monthlyData: { month: string, revenue: number }[];
        countryData: { name: string, value: number }[];
    }
}

export default function RevenueAnalytics({ data }: RevenueAnalyticsProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    const totalRevenue = data.platformData.reduce((acc, curr) => acc + curr.value, 0);
    const activeItem = activeIndex !== null ? data.platformData[activeIndex] : null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid gap-6 md:grid-cols-2">
                
                {/* 1. Revenue by Platform (Pie) */}
                <Card className="bg-zinc-950 border-white/10 shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <CardHeader className="relative pb-0 border-b border-white/5">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                                    <PieChartIcon size={14} /> Revenue Distribution
                                </CardTitle>
                                <CardDescription className="text-zinc-500 text-[10px] mt-1 uppercase tracking-wider font-medium">By Platform</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="h-[400px] flex flex-col pt-6">
                        <div className="flex-1 relative min-h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <defs>
                                        {GRADIENTS.map((grad, i) => (
                                            <linearGradient key={`grad-${i}`} id={`pieGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={grad.start} />
                                                <stop offset="100%" stopColor={grad.end} />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <Pie
                                        {...{
                                            activeIndex: activeIndex ?? undefined,
                                            activeShape: (props: any) => {
                                                const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
                                                return (
                                                    <g>
                                                        <Sector
                                                            cx={cx}
                                                            cy={cy}
                                                            innerRadius={innerRadius}
                                                            outerRadius={outerRadius + 6}
                                                            startAngle={startAngle}
                                                            endAngle={endAngle}
                                                            fill={fill}
                                                            cornerRadius={8}
                                                        />
                                                        <Sector
                                                            cx={cx}
                                                            cy={cy}
                                                            startAngle={startAngle}
                                                            endAngle={endAngle}
                                                            innerRadius={outerRadius + 15}
                                                            outerRadius={outerRadius + 18}
                                                            fill={fill}
                                                            opacity={0.2}
                                                            cornerRadius={4}
                                                        />
                                                    </g>
                                                );
                                            },
                                            data: data.platformData,
                                            cx: "50%",
                                            cy: "50%",
                                            innerRadius: 80,
                                            outerRadius: 110,
                                            paddingAngle: 4,
                                            dataKey: "value",
                                            stroke: "none",
                                            onMouseEnter: onPieEnter,
                                            onMouseLeave: onPieLeave,
                                            animationBegin: 0,
                                            animationDuration: 1000
                                        } as any}
                                    >
                                        {data.platformData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={`url(#pieGrad-${index % GRADIENTS.length})`}
                                                className="transition-all duration-300 cursor-pointer outline-none focus:outline-none"
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            
                            {/* Donuts Center Info */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center flex flex-col items-center justify-center w-36 h-36 rounded-full bg-zinc-950/80 backdrop-blur-3xl border border-white/5 z-10 shadow-2xl">
                                {activeItem ? (
                                    <div className="animate-in fade-in zoom-in duration-200">
                                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] block mb-1">{activeItem.name}</span>
                                        <span className="text-2xl font-black text-white leading-none tabular-nums tracking-tighter block">${activeItem.value.toLocaleString()}</span>
                                        <span className="text-[9px] font-bold text-zinc-500 mt-2 block bg-white/5 px-2 py-0.5 rounded-full">
                                            {((activeItem.value / totalRevenue) * 100).toFixed(1)}% Share
                                        </span>
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in duration-500 text-center">
                                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] block">Total</span>
                                        <span className="block text-xl font-black text-white mt-1 leading-none tabular-nums tracking-tighter">${totalRevenue.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Custom Legend */}
                        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 pb-2 pt-2 border-t border-white/5 bg-white/[0.01]">
                            {data.platformData.map((entry, index) => (
                                <div 
                                    key={entry.name} 
                                    className={`flex items-center gap-2 transition-all duration-300 cursor-pointer group/legend ${activeIndex === index ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-80'}`}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                >
                                    <span 
                                        className="w-2 h-2 rounded-full transition-transform duration-300 group-hover/legend:scale-125" 
                                        style={{ 
                                            background: activeIndex === index ? COLORS[index % COLORS.length] : `transparent`,
                                            border: `2px solid ${COLORS[index % COLORS.length]}`,
                                            boxShadow: activeIndex === index ? `0 0 10px ${COLORS[index % COLORS.length]}` : 'none'
                                        }} 
                                    />
                                    <span className={`text-[10px] uppercase font-bold tracking-wider ${activeIndex === index ? 'text-white' : 'text-zinc-500'}`}>
                                        {entry.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Top Tracks (Bar Chart) */}
                <Card className="bg-zinc-950 border-white/10 shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <CardHeader className="relative pb-0 border-b border-white/5">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
                             <BarChart3 size={14} /> Top Earning Tracks
                        </CardTitle>
                        <CardDescription className="text-zinc-500 text-[10px] mt-1 uppercase tracking-wider font-medium">Cumulative Revenue</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] p-6 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.trackData} layout="vertical" margin={{ left: 0, right: 30, top: 10, bottom: 10 }} barSize={24}>
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    stroke="#71717a" 
                                    fontSize={10} 
                                    tickLine={false}
                                    axisLine={false}
                                    width={140}
                                    tickFormatter={(val) => val.length > 22 ? `${val.substring(0, 20)}...` : val}
                                    className="font-bold text-zinc-400"
                                />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 4 }}
                                    contentStyle={{ 
                                        backgroundColor: '#09090b', 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                        color: '#fff' 
                                    }}
                                    itemStyle={{ fontWeight: 'bold', fontSize: '12px', color: '#10b981' }}
                                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                                />
                                <defs>
                                    <linearGradient id="barTrackGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#34d399" />
                                        <stop offset="100%" stopColor="#059669" />
                                    </linearGradient>
                                </defs>
                                <Bar 
                                    dataKey="value" 
                                    fill="url(#barTrackGrad)" 
                                    radius={[0, 4, 4, 0]}
                                    className="filter drop-shadow-[0_0_5px_rgba(16,185,129,0.3)] transition-all duration-500 hover:brightness-110" 
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Monthly Trends (Area Chart) */}
            <Card className="bg-zinc-950 border-white/10 shadow-2xl overflow-hidden relative group">
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-rose-500/5 pointer-events-none" />
                <CardHeader className="relative border-b border-white/5">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                             <TrendingUp size={14} /> Revenue Trend
                        </CardTitle>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-bold uppercase text-indigo-400 tracking-wider">
                            <Activity size={10} /> Monthly
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-[300px] p-0 pt-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.monthlyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                                     <stop offset="0%" stopColor="#818cf8" />
                                     <stop offset="100%" stopColor="#4f46e5" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis 
                                dataKey="month" 
                                stroke="#52525b" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                                dy={10}
                                fontWeight={700}
                            />
                            <YAxis 
                                stroke="#52525b" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false}
                                tickFormatter={(val) => `$${val}`}
                                fontWeight={700}
                                dx={-10}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#09090b', 
                                    border: '1px solid rgba(255,255,255,0.1)', 
                                    borderRadius: '8px', 
                                    color: '#fff',
                                    padding: '8px 12px'
                                }}
                                itemStyle={{ fontWeight: '800', fontSize: '13px', color: '#818cf8' }}
                                labelStyle={{ color: '#a1a1aa', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '4px' }}
                                formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="url(#strokeGradient)" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorRevenue)" 
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff', className: 'animate-ping' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            
            {/* 4. Geography (Bar) - Optional if needed, preserving existing components */}
             <Card className="bg-zinc-950 border-white/10 shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <CardHeader className="relative border-b border-white/5">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-rose-400 flex items-center gap-2">
                         <Globe size={14} /> Top Territories
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] p-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.countryData} barSize={40}>
                             <defs>
                                <linearGradient id="countryBarGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#fb7185" />
                                    <stop offset="100%" stopColor="#e11d48" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="#71717a" 
                                fontSize={10} 
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                                fontWeight={700}
                            />
                            <YAxis 
                                stroke="#71717a" 
                                fontSize={10} 
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `$${val}`}
                            />
                            <Tooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 4 }}
                                contentStyle={{ 
                                    backgroundColor: '#09090b', 
                                    border: '1px solid rgba(255,255,255,0.1)', 
                                    borderRadius: '8px', 
                                    color: '#fff' 
                                }}
                                itemStyle={{ fontWeight: '800', fontSize: '12px', color: '#fb7185' }}
                                formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                            />
                            <Bar 
                                dataKey="value" 
                                fill="url(#countryBarGrad)" 
                                radius={[6, 6, 0, 0]} 
                                className="filter drop-shadow-[0_0_5px_rgba(244,63,94,0.3)] transition-all duration-300 hover:brightness-110"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
    )
}
