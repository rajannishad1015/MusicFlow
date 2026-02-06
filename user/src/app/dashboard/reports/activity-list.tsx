'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpRight, DollarSign, Calendar, TrendingUp } from "lucide-react"

interface ActivityListProps {
  logs: any[]
}

export default function ActivityList({ logs }: ActivityListProps) {
  if (!logs || logs.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-[300px] text-zinc-600 bg-zinc-950/20 rounded-2xl border border-white/5 mx-4">
            <div className="p-4 rounded-full bg-zinc-900/50 mb-4 border border-white/5">
              <DollarSign className="h-8 w-8 opacity-20" />
            </div>
            <p className="text-sm font-medium tracking-tight">No financial activity recorded</p>
            <p className="text-xs text-zinc-700 mt-1">Your earnings will appear here.</p>
        </div>
    )
  }

  return (
    <ScrollArea className="h-[400px] px-4">
      <div className="space-y-3 pb-4">
        {logs.map((log) => (
          <div key={log.id} className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm" />
            <div className="relative flex items-center justify-between p-4 rounded-xl bg-zinc-950/60 backdrop-blur-md border border-white/5 group-hover:border-white/10 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 flex items-center justify-center border border-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                  <TrendingUp className="h-5 w-5 text-emerald-500/80 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-zinc-100 tracking-tight leading-tight group-hover:text-white transition-colors">
                    {log.description || 'Revenue Credit'}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-900/50 px-1.5 py-0.5 rounded border border-white/5 group-hover:border-white/10">
                      {log.platform}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
                        <Calendar className="h-3 w-3 opacity-50" />
                        {new Date(log.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-sm font-black text-emerald-400 tabular-nums tracking-tight">
                  +${Number(log.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">
                  Settled
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
