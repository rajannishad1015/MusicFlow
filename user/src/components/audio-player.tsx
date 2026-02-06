'use client'

import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface AudioPlayerProps {
    url: string
    title?: string
    autoStartAnalysis?: boolean
}

export default function AudioPlayer({ url, title, autoStartAnalysis = false }: AudioPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const wavesurfer = useRef<WaveSurfer | null>(null)
    const analyser = useRef<AnalyserNode | null>(null)
    const animationId = useRef<number>(0)
    
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [viewMode, setViewMode] = useState<'waveform' | 'spectrum'>('waveform')
    const [analysis, setAnalysis] = useState<any>(null)
    const [analyzing, setAnalyzing] = useState(false)

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
             if (autoStartAnalysis) runFullAnalysis()
        })

        wavesurfer.current.on('audioprocess', () => {
             setCurrentTime(wavesurfer.current?.getCurrentTime() || 0)
        })

        wavesurfer.current.on('finish', () => setIsPlaying(false))
        wavesurfer.current.on('play', () => setIsPlaying(true))
        wavesurfer.current.on('pause', () => setIsPlaying(false))

        return () => {
            cancelAnimationFrame(animationId.current)
            if (wavesurfer.current) wavesurfer.current.destroy()
        }
    }, [url])

    // Spectrum Animation
    useEffect(() => {
        if (viewMode === 'spectrum' && isPlaying && canvasRef.current && wavesurfer.current) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            const ws = wavesurfer.current as any
            
            // Try to get analyser, if not set up, try to connect
            if (!analyser.current && ws.backend && ws.backend.ac) {
                 analyser.current = ws.backend.ac.createAnalyser()
                 analyser.current!.fftSize = 256
                 // Attempt to connect gain node to analyser
                 if (ws.backend.gainNode) {
                    ws.backend.gainNode.connect(analyser.current)
                 }
            }

            if (!ctx || !analyser.current) return

            const bufferLength = analyser.current.frequencyBinCount
            const dataArray = new Uint8Array(bufferLength)
            const width = canvas.width
            const height = canvas.height
            const barWidth = (width / bufferLength) * 2.5
            
            const renderFrame = () => {
                animationId.current = requestAnimationFrame(renderFrame)
                analyser.current!.getByteFrequencyData(dataArray)
                
                ctx.clearRect(0, 0, width, height)
                
                let x = 0
                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = (dataArray[i] / 255) * height
                    
                    const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight)
                    gradient.addColorStop(0, '#4f46e5')
                    gradient.addColorStop(1, '#10b981')
                    
                    ctx.fillStyle = gradient
                    ctx.fillRect(x, height - barHeight, barWidth, barHeight)
                    
                    x += barWidth + 1
                }
            }
            renderFrame()
        } else {
            cancelAnimationFrame(animationId.current)
        }
    }, [viewMode, isPlaying])

    const runFullAnalysis = async () => {
        if (analysis) return
        setAnalyzing(true)
        try {
            // Dynamic import to avoid SSR issues
            const { AudioAnalyzer } = await import('@/lib/audio-analysis')
            const analyzer = new AudioAnalyzer()
            
            // Fetch blob
            const response = await fetch(url)
            const blob = await response.blob()
            const file = new File([blob], "track.mp3") // Name doesn't matter for analysis
            
            const result = await analyzer.analyzeFile(file)
            setAnalysis(result)
        } catch (e) {
            console.error(e)
        } finally {
            setAnalyzing(false)
        }
    }

    const togglePlay = () => wavesurfer.current?.playPause()

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

    return (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex flex-col gap-1">
                     <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Preview Track</span>
                     {title && <h3 className="text-sm font-bold text-white truncate max-w-[200px]">{title}</h3>}
                 </div>
                 <div className="flex gap-2">
                     <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded-md">
                        {formatTime(currentTime)} / {formatTime(duration)}
                     </span>
                 </div>
            </div>

            {/* Visualization Area */}
            <div className="relative h-[80px]">
                 {!isReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 rounded-lg z-10 backdrop-blur-sm">
                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                 )}
                 
                 <div className={viewMode === 'waveform' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}>
                    <div ref={containerRef} className="w-full" />
                 </div>
                 
                 <canvas 
                    ref={canvasRef} 
                    width={800} 
                    height={80} 
                    className={`w-full h-full rounded-lg ${viewMode === 'spectrum' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`} 
                 />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" size="icon" type="button"
                        className="h-10 w-10 rounded-full bg-zinc-900 border-white/10 text-white hover:bg-zinc-800 hover:text-indigo-400"
                        onClick={togglePlay}
                    >
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                    </Button>
                    
                    <Button variant="ghost" size="icon" type="button" className="text-zinc-400 hover:text-white" onClick={() => wavesurfer.current?.skip(-5)}>
                        <SkipBack size={16} />
                    </Button>
                     <Button variant="ghost" size="icon" type="button" className="text-zinc-400 hover:text-white" onClick={() => wavesurfer.current?.skip(5)}>
                        <SkipForward size={16} />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                     <Button 
                        variant="outline" size="sm" type="button"
                        onClick={() => setViewMode(viewMode === 'waveform' ? 'spectrum' : 'waveform')}
                        className={`text-xs font-bold uppercase tracking-wider h-8 ${viewMode === 'spectrum' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'text-zinc-400 border-white/10'}`}
                    >
                        {viewMode === 'waveform' ? 'Show Spectrum' : 'Show Waveform'}
                    </Button>
                </div>

                <div className="flex items-center gap-3 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-white/5">
                     <button onClick={toggleMute} type="button" className="text-zinc-400 hover:text-white transition-colors">
                         {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                     </button>
                     <Slider defaultValue={[1]} max={1} step={0.01} value={[isMuted ? 0 : volume]} onValueChange={handleVolumeChange} className="w-20"/>
                </div>
            </div>

            {/* Technical Metrics Panel - User View */}
            <div className="pt-4 border-t border-white/5">
                {!analysis ? (
                    <Button 
                        variant="ghost" 
                        onClick={runFullAnalysis} 
                        type="button"
                        disabled={analyzing}
                        className="w-full h-8 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5"
                    >
                        {analyzing ? <span className="animate-pulse">Analyzing Quality...</span> : 'Check Audio Quality'}
                    </Button>
                ) : (
                    <div className="grid grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
                         <Metric label="Peak" value={`${analysis.peakLevel} dB`} isWarning={analysis.clippingDetected} />
                         <Metric label="Volume" value={`${analysis.averageVolume} dB`} />
                         <Metric label="Quality" value={`${analysis.sampleRate / 1000} kHz`} />
                         <Metric label="Issues" value={analysis.silenceDetected ? 'Silence' : analysis.clippingDetected ? 'Clipping' : 'None'} isWarning={analysis.silenceDetected || analysis.clippingDetected} />
                    </div>
                )}
            </div>
        </div>
    )
}

function Metric({ label, value, isWarning }: { label: string, value: string, isWarning?: boolean }) {
    return (
        <div className={`bg-white/5 rounded-lg p-2 text-center border ${isWarning ? 'border-red-500/20 bg-red-500/5' : 'border-transparent'}`}>
            <span className="block text-[9px] font-black uppercase text-zinc-500 tracking-wider mb-1">{label}</span>
            <span className={`block text-xs font-mono font-medium ${isWarning ? 'text-red-400' : 'text-emerald-400'}`}>{value}</span>
        </div>
    )
}
