'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Download, Loader2, Filter, Calendar } from "lucide-react"
import { getExportData } from './export-actions'
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ExportButton({ status = 'approved' }: { status?: string }) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  
  // Filter States
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [genre, setGenre] = useState('')

  const handleExport = async () => {
    setLoading(true)
    try {
        const data = await getExportData(status, { startDate, endDate, genre })
        
        if (!data || data.length === 0) {
            toast.error(`No tracks found matching your filters.`)
            setLoading(false)
            return
        }

        // Comprehensive CSV headers
        const headers = [
            // Basic Track Info
            "Track Title",
            "Artist Name",
            "Album Title",
            "Release Type",
            
            // Identifiers
            "ISRC",
            "UPC",
            
            // Dates
            "Release Date",
            "Original Release Date",
            "Production Year",
            
            // Track Details
            "Genre",
            "Sub Genre",
            "Language",
            "Title Language",
            "Lyrics Language",
            "Explicit",
            "Explicit Type",
            "Duration (s)",
            "Track Number",
            
            // Version Info
            "Version Type",
            "Version Subtitle",
            "Is Instrumental",

            // Technical/Assets
            "Format",
            "Bitrate (kbps)",
            "Sample Rate (Hz)",
            "Channels",

            // Artists
            "Primary Artist",
            "Featuring Artist",
            "Track Primary Artist",
            "Track Featuring Artist",
            
            // Artist Platform IDs
            "Primary Artist Spotify ID",
            "Primary Artist Apple ID",
            "Featuring Artist Spotify ID",
            "Featuring Artist Apple ID",
            
            "Track Primary Artist Spotify ID",
            "Track Primary Artist Apple ID",
            "Track Featuring Artist Spotify ID",
            "Track Featuring Artist Apple ID",
            
            // Credits
            "Lyricists",
            "Composers",
            "Producers",
            "Publisher",
            
            // Legal
            "P-Line",
            "C-Line",
            "Track P-Line",
            "Courtesy Line",
            
            // Distribution
            "Label Name",
            "Price Tier",
            "Target Platforms",
            "Distribute Video",
            "Caller Tune Timing",
            
            // Media
            "Audio File URL",
            "Cover Art URL",
            
            // Metadata
            "Description",
            "Lyrics",
            
            // Artist Info
            "Artist Email",
            "Artist Full Name",
            "Artist ID",
            
            // Status
            "Status",
            "Submission Date"
        ]

        // Map data to comprehensive rows
        const rows = data.map((track: any) => [
            // Basic Track Info
            track.title,
            track.profiles?.artist_name || track.profiles?.full_name || "",
            track.albums?.title || "Single",
            track.albums?.type || "Single",
            
            // Identifiers
            track.isrc || "",
            track.albums?.upc || "",
            
            // Dates
            track.albums?.release_date || "",
            track.albums?.original_release_date || "",
            track.production_year || "",
            
            // Track Details
            track.genre || "",
            track.sub_genre || track.albums?.sub_genre || "",
            track.language || "",
            track.title_language || "",
            track.lyrics_language || "",
            track.is_explicit ? "Yes" : "No",
            track.explicit_type || "",
            track.duration || "",
            track.track_number || "",
            
            // Version Info
            track.version_type || "",
            track.version_subtitle || "",
            track.is_instrumental ? "Yes" : "No",

            // Technical/Assets
            track.encoding || "",
            track.bitrate || "",
            track.sample_rate || "",
            track.channels || "",
            
            // Artists
            track.albums?.primary_artist || "",
            track.albums?.featuring_artist || "",
            track.primary_artist || "",
            track.featuring_artist || "",
            
            // IDs
            track.albums?.primary_artist_spotify_id || "",
            track.albums?.primary_artist_apple_id || "",
            track.albums?.featuring_artist_spotify_id || "",
            track.albums?.featuring_artist_apple_id || "",
            
            track.primary_artist_spotify_id || "",
            track.primary_artist_apple_id || "",
            track.featuring_artist_spotify_id || "",
            track.featuring_artist_apple_id || "",
            
            // Credits - Properly formatted strings
            Array.isArray(track.lyricists) ? track.lyricists.map((l: any) => `${l.firstName} ${l.lastName}`).join(", ") : (track.lyricists || ""),
            Array.isArray(track.composers) ? track.composers.map((c: any) => `${c.firstName} ${c.lastName}`).join(", ") : (track.composers || ""),
            track.producers || "",
            track.publisher || "",
            
            // Legal
            track.albums?.p_line || "",
            track.albums?.c_line || "",
            track.track_p_line || "",
            track.albums?.courtesy_line || "",
            
            // Distribution
            track.albums?.label_name || "",
            track.price_tier || "",
            track.albums?.target_platforms?.join("; ") || "",
            track.distribute_video ? "Yes" : "No",
            track.caller_tune_timing || "",
            
            // Media
            track.file_url || "",
            track.albums?.cover_art_url || "",
            
            // Metadata
            track.albums?.description || "",
            track.lyrics || "",
            
            // Artist Info
            track.profiles?.email || "",
            track.profiles?.full_name || "",
            track.artist_id || "",
            
            // Status
            track.status || "pending",
            track.created_at || ""
        ])

        // construct CSV string
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
        ].join('\n')

        // trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `musicflow_export_${status}_filtered.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.success(`Exported ${data.length} tracks successfully!`)
        setOpen(false) // Close dialog on success

    } catch (error: any) {
        toast.error("Export failed: " + error.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
                <Filter size={16} /> Export Options
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
            <DialogHeader>
                <DialogTitle>Export Data</DialogTitle>
                <DialogDescription className="text-zinc-400">
                    Filter the data you want to export. Leave fields empty to export everything.
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="start-date" className="text-zinc-400">Start Date</Label>
                        <Input 
                            id="start-date" 
                            type="date" 
                            className="bg-zinc-900 border-white/10"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                         <Label htmlFor="end-date" className="text-zinc-400">End Date</Label>
                         <Input 
                            id="end-date" 
                            type="date" 
                            className="bg-zinc-900 border-white/10"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="genre" className="text-zinc-400">Genre</Label>
                    <Input 
                        id="genre" 
                        placeholder="e.g. Pop, Hip Hop" 
                        className="bg-zinc-900 border-white/10"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                    />
                </div>
            </div>
            <DialogFooter className="sm:justify-between">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-zinc-400">Cancel</Button>
                <Button type="button" onClick={handleExport} disabled={loading} className="gap-2">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    Download CSV
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
