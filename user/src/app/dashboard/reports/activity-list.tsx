'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpRight, DollarSign, Calendar } from "lucide-react"

interface ActivityListProps {
  logs: any[]
}

export default function ActivityList({ logs }: ActivityListProps) {
  if (!logs || logs.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-[300px] text-zinc-500">
            <DollarSign className="h-10 w-10 mb-2 opacity-20" />
            <p className="text-sm">No recent activity</p>
        </div>
    )
  }

  return (
    <ScrollArea className="h-[350px] pr-4">
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                <ArrowUpRight className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-200 leading-none">{log.description || 'Earnings Credited'}</p>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(log.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </div>
              </div>
            </div>
            <div className="font-bold text-emerald-400">
              +${Number(log.amount).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
