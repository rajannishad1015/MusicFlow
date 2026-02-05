'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export default function SearchInput() {
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    replace(`?${params.toString()}`)
  }, 300)

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-full px-4 py-1.5 flex items-center gap-2 w-64 focus-within:border-indigo-500/50 transition-colors">
      <Search size={14} className="text-zinc-500" />
      <input
        className="bg-transparent border-none focus:ring-0 text-sm text-zinc-200 placeholder:text-zinc-600 w-full outline-none"
        placeholder="Search tickets..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('q')?.toString()}
      />
    </div>
  )
}
