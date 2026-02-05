import { getAuditLogs } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, User, CheckCircle, XCircle, Edit, ShieldAlert, Clock, Activity } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default async function AuditLogPage() {
  const logs = await getAuditLogs()

  const getIcon = (action: string) => {
      switch(action) {
          case 'APPROVED_TRACK': return <CheckCircle className="text-emerald-500" size={16} />
          case 'REJECTED_TRACK': return <XCircle className="text-red-500" size={16} />
          case 'EDITED_METADATA': return <Edit className="text-indigo-500" size={16} />
          case 'ADDED_NOTE': return <FileText className="text-amber-500" size={16} />
          default: return <Activity className="text-zinc-500" size={16} />
      }
  }

  const formatDetails = (details: any) => {
      if (!details) return null
      // if it has 'reason', show it prominently
      if (details.reason) return <span className="text-red-300 italic">" {details.reason} "</span>
      // if it has 'updated_fields', show count
      if (details.updated_fields) return <span className="text-indigo-300">Updated {details.updated_fields.length} fields</span>
      
      return <span className="text-zinc-500 text-[10px] font-mono">{JSON.stringify(details).slice(0, 50)}...</span>
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
        <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                <ShieldAlert className="text-indigo-500 mb-1" /> Audit Logs
            </h1>
            <p className="text-zinc-400 font-medium">Monitor admin activity and system actions.</p>
        </div>

        <Card className="bg-white/[0.03] border-white/5 backdrop-blur-xl flex-1 overflow-hidden flex flex-col">
            <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Activity size={14} /> Recent Activity
                    </CardTitle>
                    <Badge variant="outline" className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20 font-mono text-[10px]">
                        Last 100 Actions
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative">
                <div className="absolute inset-0 overflow-y-auto">
                    {logs.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {logs.map((log) => (
                                <div key={log.id} className="p-4 hover:bg-white/5 transition-colors flex items-start gap-4 group">
                                    <div className="mt-1 p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                                        {getIcon(log.action)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-white">
                                                {log.admin?.full_name || 'Unknown Admin'}
                                            </span>
                                            <span className="text-xs text-zinc-500 font-medium">
                                                {log.action.replace(/_/g, ' ')}
                                            </span>
                                            <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 text-[10px] h-5 px-1.5 ml-auto font-mono">
                                                {log.target_type}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-zinc-400 flex items-center gap-2">
                                           {formatDetails(log.details)}
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                                            <Clock size={10} />
                                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                        </div>
                                        {log.ip_address && (
                                            <div className="text-[9px] text-zinc-700 font-mono mt-1 group-hover:text-zinc-600 transition-colors">
                                                IP: {log.ip_address}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
                            <ShieldAlert size={48} className="opacity-20" />
                            <p>No activity logs found.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
