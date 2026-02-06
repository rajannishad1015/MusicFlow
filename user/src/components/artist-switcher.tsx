'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users } from 'lucide-react'

interface ArtistSwitcherProps {
    artists: { id: string; artist_name: string }[];
}

export default function ArtistSwitcher({ artists }: ArtistSwitcherProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentArtistId = searchParams.get('artistId')

    const handleValueChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value === 'all') {
            params.delete('artistId')
        } else {
            params.set('artistId', value)
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2">
            <Users size={16} className="text-zinc-500" />
            <Select value={currentArtistId || 'all'} onValueChange={handleValueChange}>
                <SelectTrigger className="w-[200px] bg-zinc-900 border-white/10 text-white h-8 text-xs font-bold uppercase tracking-widest">
                    <SelectValue placeholder="All Artists" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10 text-white">
                    <SelectItem value="all" className="text-xs font-bold uppercase">All Artists</SelectItem>
                    {artists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id} className="text-xs font-bold uppercase">
                            {artist.artist_name || 'Unnamed Artist'}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
