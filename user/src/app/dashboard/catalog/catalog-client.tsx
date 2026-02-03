'use client'

import { useState } from 'react'
import TrackList from '../track-list'
import { Input } from "@/components/ui/input"
import { Search, Filter, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function CatalogClient({ initialTracks }: { initialTracks: any[] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const filteredTracks = initialTracks.filter(track => {
        const matchesSearch = track.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              track.id?.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesStatus = statusFilter === 'all' || track.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'approved', label: 'Approved' },
        { id: 'pending', label: 'Pending' },
        { id: 'draft', label: 'Drafts' },
        { id: 'rejected', label: 'Rejected' },
    ]

    return (
        <div className="space-y-6">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.03] p-4 rounded-xl border border-white/10 backdrop-blur-md">
                
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
                    <Input 
                        placeholder="Search by Title or ISRC..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-black/20 border-white/10 text-white h-10 rounded-full focus:bg-black/40 transition-all font-medium text-sm"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                    <Filter className="text-zinc-500 h-4 w-4 mr-2 hidden md:block" />
                    {filters.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setStatusFilter(filter.id)}
                            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                                statusFilter === filter.id 
                                ? 'bg-indigo-500 text-white border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                                : 'bg-white/5 text-zinc-400 border-white/10 hover:border-white/30 hover:bg-white/10'
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Info */}
            <div className="flex justify-between items-center px-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    Showing {filteredTracks.length} Releases
                </span>
                {(searchQuery || statusFilter !== 'all') && (
                     <Button 
                        variant="link" 
                        onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                        className="text-indigo-400 text-xs h-auto p-0 hover:text-indigo-300"
                    >
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Track List */}
            <TrackList tracks={filteredTracks} />
        </div>
    )
}
