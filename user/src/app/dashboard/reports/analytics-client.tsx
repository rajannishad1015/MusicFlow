'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface AnalyticsClientProps {
  revenueData: any[]
}

export default function AnalyticsClient({ revenueData }: AnalyticsClientProps) {
    // Process data for charts
    // Group revenue by month
    const groupedData = revenueData.reduce((acc: any, curr: any) => {
        const date = new Date(curr.created_at)
        const month = date.toLocaleString('default', { month: 'short' })
        const year = date.getFullYear()
        const key = `${month} ${year}`
        
        if (!acc[key]) {
            acc[key] = { name: key, total: 0 }
        }
        acc[key].total += Number(curr.amount)
        return acc
    }, {})
    
    // Sort chronologically (rough sort by date string implementation, better to use proper dates in prod)
    const chartData = Object.values(groupedData).reverse() 

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-950 border-zinc-800 shadow-xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader>
          <CardTitle className="text-zinc-100">Revenue Overview</CardTitle>
          <CardDescription className="text-zinc-400">Monthly earnings breakdown.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2 relative z-10">
          <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={0}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                stroke="#52525b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#a1a1aa' }}
              />
              <YAxis
                stroke="#52525b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: '#a1a1aa' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }}
                cursor={{ fill: '#27272a' }}
              />
              <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="bg-zinc-950 border-zinc-800 shadow-xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader>
          <CardTitle className="text-zinc-100">Growth Trend</CardTitle>
          <CardDescription className="text-zinc-400">Cumulative earnings trajectory.</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={0}>
             <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }}
                />
                <Area type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
             </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
