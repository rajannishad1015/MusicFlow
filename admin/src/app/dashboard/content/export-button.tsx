'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { getExportData } from './export-actions'
import { toast } from "sonner"

export default function ExportButton({ status = 'approved' }: { status?: string }) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
        const data = await getExportData(status)
        
        if (!data || data.length === 0) {
            toast.error(`No ${status} tracks found to export.`)
            return
        }

        // Comprehensive CSV headers - ALL upload wizard fields
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
            
            // Artists
            "Primary Artist",
            "Featuring Artist",
            "Track Primary Artist",
            "Track Featuring Artist",
            
            // Artist Platform IDs (Release Level)
            "Primary Artist Spotify ID",
            "Primary Artist Apple ID",
            "Featuring Artist Spotify ID",
            "Featuring Artist Apple ID",
            
            // Artist Platform IDs (Track Level)
            "Track Primary Artist Spotify ID",
            "Track Primary Artist Apple ID",
            "Track Featuring Artist Spotify ID",
            "Track Featuring Artist Apple ID",
            
            // Credits
            "Lyricists",
            "Composers",
            "Producers",
            "Publisher",
            
            // Legal/Copyright
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
            
            // Artists
            track.albums?.primary_artist || "",
            track.albums?.featuring_artist || "",
            track.primary_artist || "",
            track.featuring_artist || "",
            
            // Artist Platform IDs (Release Level)
            track.albums?.primary_artist_spotify_id || "",
            track.albums?.primary_artist_apple_id || "",
            track.albums?.featuring_artist_spotify_id || "",
            track.albums?.featuring_artist_apple_id || "",
            
            // Artist Platform IDs (Track Level)
            track.primary_artist_spotify_id || "",
            track.primary_artist_apple_id || "",
            track.featuring_artist_spotify_id || "",
            track.featuring_artist_apple_id || "",
            
            // Credits - Properly formatted strings
            Array.isArray(track.lyricists) ? track.lyricists.map((l: any) => `${l.firstName} ${l.lastName}`).join(", ") : (track.lyricists || ""),
            Array.isArray(track.composers) ? track.composers.map((c: any) => `${c.firstName} ${c.lastName}`).join(", ") : (track.composers || ""),
            track.producers || "",
            track.publisher || "",
            
            // Legal/Copyright
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
        link.setAttribute('download', `musicflow_export_${status}_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.success(`Exported ${data.length} tracks successfully!`)

    } catch (error: any) {
        toast.error("Export failed: " + error.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <Button onClick={handleExport} disabled={loading} variant="outline" className="gap-2">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        Export CSV
    </Button>
  )
}
