'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Simulates audio fingerprinting against external DB
async function checkAudioFingerprint(fileUrl: string, title: string) {
    // In a real scenario, we'd send the file buffer/URL to ACRCloud or Audible Magic
    // Simulation: Flag anything with 'copyright' or 'leaked' in the title
    const suspiciousKeywords = ['copyright', 'leaked', 'test-match'];
    const isMatched = suspiciousKeywords.some(kw => title.toLowerCase().includes(kw));
    
    return {
        isMatched,
        fingerprintId: isMatched ? `MATCH-${Math.random().toString(36).substr(2, 9)}` : null
    };
}

// Simulates automated transcoding (e.g. via FFmpeg or Supabase Edge Functions)
async function simulateTranscode(fileUrl: string) {
    // In reality, this would trigger an async job.
    // We return placeholders for the standard and preview MP3 versions.
    return {
        standardUrl: fileUrl.replace(/\.(wav|flac|aif)$/i, '.mp3'), // Mocked transformation
        previewUrl: fileUrl.replace(/\.(wav|flac|aif|mp3)$/i, '_preview.mp3')
    };
}

export async function submitTrack(formData: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // Get Artist ID
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()
    
    if (!profile) throw new Error('Profile not found')

    // 1. Check if Editing
    if (formData.id) {
        // Update Track
        const { error: updateError } = await supabase
            .from('tracks')
            .update({
                title: formData.title,
                genre: formData.genre,
                language: formData.language,
                file_url: formData.audioUrl,
                duration: formData.duration,
                is_explicit: formData.explicit, 
                status: formData.status || 'pending',
                lyrics: formData.lyrics,
                copyright_line: formData.copyright_line || formData.copyrightLine, // handle camel vs snake
                publishing_line: formData.publishing_line || formData.publishingLine,
                contributors: formData.contributors,
                rejection_reason: null // Clear rejection reason on resubmit
            })
            .eq('id', formData.id)
            .eq('artist_id', user.id) // Security check

        if (updateError) throw new Error(updateError.message)

        // Update Album Cover if needed (Assuming 1:1 track-album for singles)
        // We need to fetch the track to get album_id first
        const { data: track } = await supabase.from('tracks').select('album_id').eq('id', formData.id).single()
        
        if (track?.album_id) {
             await supabase.from('albums').update({
                cover_art_url: formData.coverArtUrl,
                title: formData.title + (formData.releaseType === 'single' ? ' - Single' : ''), 
                release_date: formData.releaseDate || null,
                label_name: formData.labelName,
                primary_artist: formData.primaryArtist,
                genre: formData.genre,
                sub_genre: formData.subGenre,
                original_release_date: formData.originalReleaseDate || null,
                p_line: formData.pLine,
                c_line: formData.cLine,
                courtesy_line: formData.courtesyLine,
                description: formData.description
             }).eq('id', track.album_id)
        }

        revalidatePath('/dashboard')
        return { success: true }
    }

    // 2. Create Album (New Upload)
    const { data: album, error: albumError } = await supabase
        .from('albums')
        .insert({
            artist_id: user.id,
            title: formData.title + (formData.releaseType === 'single' ? ' - Single' : ''),
            type: formData.releaseType || 'single',
            cover_art_url: formData.coverArtUrl,
            release_date: formData.releaseDate || null,
            total_tracks: 1,
            label_name: formData.labelName,
            primary_artist: formData.primaryArtist,
            featuring_artist: formData.featuringArtist,
            genre: formData.genre,
            sub_genre: formData.subGenre,
            original_release_date: formData.originalReleaseDate || null,
            p_line: formData.pLine,
            c_line: formData.cLine,
            courtesy_line: formData.courtesyLine,
            description: formData.description,
            target_platforms: formData.selectedPlatforms,
            primary_artist_spotify_id: formData.primaryArtistSpotify,
            primary_artist_apple_id: formData.primaryArtistApple,
            featuring_artist_spotify_id: formData.featuringArtistSpotify,
            featuring_artist_apple_id: formData.featuringArtistApple
        })
        .select()
        .single()

    if (albumError) throw new Error((albumError as any).message)

    // 2.5 Check Fingerprinting & Transcoding
    const { isMatched, fingerprintId } = await checkAudioFingerprint(formData.audioUrl, formData.title);
    const { standardUrl, previewUrl } = await simulateTranscode(formData.audioUrl);

    // 3. Create Track
    const { error: trackError } = await supabase
        .from('tracks')
        .insert({
            artist_id: user.id,
            album_id: album.id,
            title: formData.trackTitle || formData.title, // Use track title if specific, else release title
            file_url: formData.audioUrl,
            duration: formData.duration || 0,
            is_explicit: formData.explicit,
            lyrics: formData.lyrics,
            copyright_line: formData.cLine,
            publishing_line: formData.pLine,
            
            // New Detailed Fields
            version_type: formData.trackVersion,
            is_instrumental: formData.isInstrumental,
            version_subtitle: formData.versionSubtitle,
            // Track specific overrides
            primary_artist: formData.trackPrimaryArtist, 
            featuring_artist: formData.trackFeaturingArtist,
            sub_genre: formData.trackSubGenre,
            genre: formData.trackGenre || formData.genre, // Fallback to release genre if not set?? Or separate column. Track has its own genre column.
            
            lyricists: formData.lyricists,
            composers: formData.composers,
            producers: formData.producer,
            production_year: formData.productionYear || null,
            publisher: formData.publisher,
            isrc: formData.isrc,
            price_tier: formData.priceTier,
            explicit_type: formData.explicitType,
            caller_tune_timing: formData.callerTuneTiming,
            distribute_video: formData.distributeVideo,
            title_language: formData.trackTitleLanguage,
            lyrics_language: formData.trackLyricsLanguage,
            track_p_line: formData.trackPLine,
             // Artist IDs
            primary_artist_spotify_id: formData.trackPrimaryArtistSpotify,
            primary_artist_apple_id: formData.trackPrimaryArtistApple,
            featuring_artist_spotify_id: formData.trackFeaturingArtistSpotify,
            featuring_artist_apple_id: formData.trackFeaturingArtistApple,

            // Tech Metadata
            bitrate: formData.audioAnalysis?.bitrate,
            sample_rate: formData.audioAnalysis?.sampleRate,
            channels: formData.audioAnalysis?.channels,
            encoding: formData.audioAnalysis?.format, // e.g., 'MP3'
            
            // Phase 2: Transcoding & Fingerprinting
            preview_url: previewUrl,
            standard_url: standardUrl,
            fingerprint_id: fingerprintId,
            is_flagged: isMatched,
            status: isMatched ? 'flagged' : (formData.status || 'pending'),

            file_size: 0 // We could get this from file size if passed, skipping for now or adding prop
        })
    
    // If draft, do not send notification/email logic (if we had it)
    
    if (trackError) throw new Error((trackError as any).message)

    revalidatePath('/dashboard')
    return { success: true }
}
