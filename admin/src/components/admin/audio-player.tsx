'use client'

import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface AudioPlayerProps {
    url: string
    title?: string
}

export default function AudioPlayer({ url, title }: AudioPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const wavesurfer = useRef<WaveSurfer | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        if (!containerRef.current) return

        wavesurfer.current = WaveSurfer.create({
            container: containerRef.current,
            waveColor: '#4f46e5', // Indigo 600
            progressColor: '#10b981', // Emerald 500
            url: url,
            height: 80,
            barWidth: 2,
            barGap: 3,
            cursorColor: '#ffffff',
            cursorWidth: 1,
            barRadius: 3,
            normalize: true,
        })

        wavesurfer.current.on('ready', () => {
             setIsReady(true)
             setDuration(wavesurfer.current?.getDuration() || 0)
        })

        wavesurfer.current.on('audioprocess', () => {
             setCurrentTime(wavesurfer.current?.getCurrentTime() || 0)
        })

        wavesurfer.current.on('finish', () => {
            setIsPlaying(false)
        })

        wavesurfer.current.on('play', () => setIsPlaying(true))
        wavesurfer.current.on('pause', () => setIsPlaying(false))

        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy()
            }
        }
    }, [url])

    const togglePlay = () => {
        wavesurfer.current?.playPause()
    }

    const toggleMute = () => {
        if (wavesurfer.current) {
            const newMute = !isMuted
            setIsMuted(newMute)
            wavesurfer.current.setVolume(newMute ? 0 : volume)
        }
    }

    const handleVolumeChange = (value: number[]) => {
        const newVol = value[0]
        setVolume(newVol)
        setIsMuted(newVol === 0)
        wavesurfer.current?.setVolume(newVol)
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    }

    const downloadAudio = () => {
        const link = document.createElement('a')
        link.href = url
        link.download = title || 'audio_track'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex flex-col gap-1">
                     <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Audio Analysis</span>
                     {title && <h3 className="text-sm font-bold text-white truncate max-w-[200px]">{title}</h3>}
                 </div>
                 <div className="flex gap-2">
                     <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded-md">
                        {formatTime(currentTime)} / {formatTime(duration)}
                     </span>
                 </div>
            </div>

            <div className="relative mb-6">
                 {!isReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 rounded-lg z-10 backdrop-blur-sm">
                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                 )}
                 <div ref={containerRef} className="w-full" />
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" size="icon" 
                        className="h-10 w-10 rounded-full bg-zinc-900 border-white/10 text-white hover:bg-zinc-800 hover:text-indigo-400"
                        onClick={togglePlay}
                    >
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                    </Button>
                    
                    <Button 
                        variant="ghost" size="icon"
                        className="text-zinc-400 hover:text-white"
                        onClick={() => wavesurfer.current?.skip(-5)}
                    >
                        <SkipBack size={16} />
                    </Button>
                     <Button 
                        variant="ghost" size="icon"
                        className="text-zinc-400 hover:text-white"
                        onClick={() => wavesurfer.current?.skip(5)}
                    >
                        <SkipForward size={16} />
                    </Button>
                </div>

                <div className="flex items-center gap-3 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-white/5">
                     <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition-colors">
                         {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                     </button>
                     <Slider 
                        defaultValue={[1]} 
                        max={1} step={0.01} 
                        value={[isMuted ? 0 : volume]}
                        onValueChange={handleVolumeChange}
                        className="w-20"
                     />
                </div>

                <Button 
                    variant="outline" size="sm" 
                    className="h-9 rounded-full px-4 text-xs font-bold text-zinc-400 border-white/10 hover:bg-white/5 hover:text-white gap-2"
                    onClick={downloadAudio}
                >
                    <Download size={14} /> Download
                </Button>
            </div>
        </div>
    )
}
