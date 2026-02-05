'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function StatusFilter() {
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const handleFilter = (status: string) => {
    const params = new URLSearchParams(searchParams)
    if (status && status !== 'all') {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    replace(`?${params.toString()}`)
  }

  return (
    <Select 
        defaultValue={searchParams.get('status')?.toString() || "all"} 
        onValueChange={handleFilter}
    >
      <SelectTrigger className="w-[140px] bg-zinc-900/50 border-white/5 h-9 text-xs">
        <SelectValue placeholder="Filter Status" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-white/10 text-white">
        <SelectItem value="all" className="focus:bg-zinc-800 focus:text-white">All Status</SelectItem>
        <SelectItem value="open" className="focus:bg-zinc-800 focus:text-white">Open</SelectItem>
        <SelectItem value="in_progress" className="focus:bg-zinc-800 focus:text-white">In Progress</SelectItem>
        <SelectItem value="resolved" className="focus:bg-zinc-800 focus:text-white">Resolved</SelectItem>
        <SelectItem value="closed" className="focus:bg-zinc-800 focus:text-white">Closed</SelectItem>
      </SelectContent>
    </Select>
  )
}
