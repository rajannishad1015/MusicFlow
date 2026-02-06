'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Upload, 
    Music, 
    Image as ImageIcon, 
    X, 
    CheckCircle2, 
    AlertCircle, 
    ArrowRight,
    Settings,
    Layers,
    Download,
    Monitor,
    RefreshCw,
    Info,
    Scissors,
    Volume2,
    Tags,
    Play,
    Pause,
    Plus,
    Trash2,
    Sparkles,
    Smartphone,
    Cloud,
    Layout,
    ImagePlus
} from 'lucide-react'
import { useFFmpeg, AudioProcessingSettings } from '@/hooks/useFFmpeg'
import { processImage } from '@/lib/imageProcessor'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface FileItem {
    id: string
    file: File
    type: 'audio' | 'image'
    status: 'pending' | 'processing' | 'completed' | 'error'
    progress: number
    resultBlob?: Blob
    error?: string
    // Advanced Settings per file
    settings: {
        format: string
        bitrate: string
        normalize: boolean
        trimStart: string
        trimEnd: string
        metadata: {
            title: string
            artist: string
            album: string
        }
    }
}

const PRESETS = [
    { name: 'Spotify High', icon: Cloud, format: 'ogg', bitrate: '320k', normalize: true },
    { name: 'Apple Digital', icon: Smartphone, format: 'm4a', bitrate: '256k', normalize: true },
    { name: 'Hi-Res Master', icon: Sparkles, format: 'wav', bitrate: '1411k', normalize: false },
    { name: 'Radio MP3', icon: Monitor, format: 'mp3', bitrate: '192k', normalize: true },
]

type TabType = 'audio' | 'image'

export default function AudioConverterPage() {
    const [logs, setLogs] = useState<string[]>([])
    const addLog = useCallback((msg: string) => {
        setLogs(prev => [...prev.slice(-49), msg])
    }, [])

    const { convert, cancel, loading: ffmpegLoading, loaded: ffmpegLoaded, load: loadFFmpeg } = useFFmpeg(addLog)
    const [activeTab, setActiveTab] = useState<TabType>('audio')
    const processingRef = useRef(false)
    const [audioQueue, setAudioQueue] = useState<FileItem[]>([])
    const [imageQueue, setImageQueue] = useState<FileItem[]>([])
    
    const [imageSettings, setImageSettings] = useState({
        imageSize: '3000',
        imageFormat: 'image/jpeg',
        cropToSquare: 'true',
        quality: 90,
        keepOriginalSize: false
    })
    
    const audioRef = useRef<HTMLAudioElement>(null)
    const [playingId, setPlayingId] = useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const addFiles = (newFiles: File[], type: TabType) => {
        const fileItems: FileItem[] = newFiles
            .filter(f => (type === 'audio' ? f.type.startsWith('audio') : f.type.startsWith('image')))
            .map(file => ({
                id: Math.random().toString(36).substring(7),
                file,
                type,
                status: 'pending',
                progress: 0,
                settings: {
                    format: type === 'audio' ? 'mp3' : 'image/jpeg',
                    bitrate: '320k',
                    normalize: true,
                    trimStart: '',
                    trimEnd: '',
                    metadata: {
                        title: file.name.substring(0, file.name.lastIndexOf('.')),
                        artist: '',
                        album: ''
                    }
                }
            }))
        
        if (type === 'audio') setAudioQueue(prev => [...prev, ...fileItems])
        else setImageQueue(prev => [...prev, ...fileItems])
    }

    const applyPreset = (preset: typeof PRESETS[0]) => {
        setAudioQueue(prev => prev.map(f => ({
            ...f,
            settings: { 
                ...f.settings, 
                format: preset.format, 
                bitrate: preset.bitrate,
                normalize: preset.normalize
            }
        })))
        toast.success(`Applied ${preset.name} settings to all audio files`)
    }

    const stopProcessing = () => {
        processingRef.current = false;
        cancel();
        addLog('⏹ Processing cancelled by user');
        toast.info('Processing Stopped');
    }

    const processAudio = async () => {
        if (ffmpegLoading) {
            stopProcessing();
            return;
        }

        const pending = audioQueue.filter(f => f.status === 'pending')
        if (pending.length === 0) return;

        // Validation Check
        const invalid = pending.find(f => !f.settings.format);
        if (invalid) {
            toast.error(`Format not selected for ${invalid.file.name}`);
            return;
        }

        if (!ffmpegLoaded) {
             try {
                await loadFFmpeg()
             } catch (e) {
                toast.error("Failed to start Audio Engine. Check console.")
                return;
             }
        }
        
        processingRef.current = true;
        
        for (const item of pending) {
            if (!processingRef.current) break;

            updateStatus(item.id, 'audio', { status: 'processing', progress: 0 })
            try {
                // Find manual or automatic cover art
                let coverBlob: Blob | undefined = undefined
                const manualCoverId = (item.settings as any).coverArtId
                
                if (manualCoverId) {
                    coverBlob = imageQueue.find(f => f.id === manualCoverId)?.resultBlob
                } else {
                    // Fallback to first completed image
                    coverBlob = imageQueue.find(f => f.status === 'completed')?.resultBlob
                }
                
                const result = await convert(item.file, {
                    ...item.settings,
                    coverArt: coverBlob
                }, (p) => updateStatus(item.id, 'audio', { progress: Math.round(p * 100) }))
                
                if (!processingRef.current) {
                    updateStatus(item.id, 'audio', { status: 'pending', progress: 0 })
                    break;
                }

                updateStatus(item.id, 'audio', { status: 'completed', progress: 100, resultBlob: result })
                addLog(`✓ Successfully processed: ${item.file.name}`)
            } catch (err: any) {
                if (!processingRef.current) {
                    updateStatus(item.id, 'audio', { status: 'pending', progress: 0 })
                } else {
                    updateStatus(item.id, 'audio', { status: 'error', error: err.message })
                    addLog(`✖ Error processing ${item.file.name}: ${err.message}`)
                }
            }
        }
        processingRef.current = false;
    }

    const processImages = async () => {
        if (processingRef.current) {
            stopProcessing()
            return
        }

        const pending = imageQueue.filter(f => f.status === 'pending')
        if (pending.length === 0) return

        processingRef.current = true
        
        for (const item of pending) {
            if (!processingRef.current) break

            updateStatus(item.id, 'image', { status: 'processing', progress: 0 })
            try {
                addLog(`▶ Processing studio task: ${item.file.name}`)
                const size = imageSettings.keepOriginalSize ? 0 : parseInt(imageSettings.imageSize)
                const result = await processImage(item.file, {
                    width: size,
                    height: size,
                    format: imageSettings.imageFormat as any,
                    cropToSquare: imageSettings.cropToSquare === 'true',
                    quality: imageSettings.quality
                })

                if (!processingRef.current) {
                    updateStatus(item.id, 'image', { status: 'pending', progress: 0 })
                    break;
                }

                updateStatus(item.id, 'image', { status: 'completed', progress: 100, resultBlob: result })
                addLog(`✓ Studio task complete: ${item.file.name}`)
            } catch (err: any) {
                if (!processingRef.current) {
                    updateStatus(item.id, 'image', { status: 'pending', progress: 0 })
                } else {
                    updateStatus(item.id, 'image', { status: 'error', error: err.message })
                    addLog(`✖ Studio error: ${err.message}`)
                }
            }
        }
        processingRef.current = false
    }

    const updateStatus = useCallback((id: string, type: TabType, updates: Partial<FileItem>) => {
        const setter = type === 'audio' ? setAudioQueue : setImageQueue
        setter(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
    }, [])

    const updateAudioSettings = useCallback((id: string, s: any) => {
        setAudioQueue(prev => prev.map(f => f.id === id ? { 
            ...f, 
            settings: { ...f.settings, ...s } 
        } : f))
    }, [])

    const removeFile = (id: string, type: TabType) => {
        const setter = type === 'audio' ? setAudioQueue : setImageQueue
        setter(prev => prev.filter(f => f.id !== id))
    }

    const downloadFile = async (item: FileItem) => {
        if (!item.resultBlob) return
        const ext = item.type === 'audio' ? item.settings.format : imageSettings.imageFormat.split('/')[1]
        const name = `${item.settings.metadata.title}_processed.${ext}`
        
        const url = URL.createObjectURL(item.resultBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const togglePreview = (file: File, id: string) => {
        if (playingId === id) {
            audioRef.current?.pause()
            setPlayingId(null)
        } else {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            if (audioRef.current) {
                audioRef.current.src = url
                audioRef.current.play()
                setPlayingId(id)
            }
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            <audio ref={audioRef} onEnded={() => setPlayingId(null)} className="hidden" />

            {/* Premium Header */}
            <div className="p-10 bg-zinc-900/50 border border-zinc-800 rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/10 opacity-50" />
                <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                             <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl">
                                <Layers className="w-6 h-6 text-black" />
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight text-white">Advanced Processor</h1>
                        </div>
                        <p className="text-zinc-400 text-lg font-medium">Professional grade client-side audio and image toolkit.</p>
                    </div>
                    
                    <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
                         <TabButton active={activeTab === 'audio'} icon={Music} label="Audio Workstation" onClick={() => setActiveTab('audio')} />
                         <TabButton active={activeTab === 'image'} icon={ImageIcon} label="Cover Art Studio" onClick={() => setActiveTab('image')} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="xl:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                        {activeTab === 'audio' ? (
                            <motion.div key="audio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                {/* Audio Workstation */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {PRESETS.map((p) => (
                                        <PresetButton key={p.name} preset={p} onClick={() => applyPreset(p)} />
                                    ))}
                                </div>

                                <Dropzone 
                                    label="Drop your Music Tracks" 
                                    sub="WAV, MP3, FLAC, OGG supported"
                                    icon={Music}
                                    onDrop={(files: File[]) => addFiles(files, 'audio')} 
                                />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">Audio Queue ({audioQueue.length})</h3>
                                        <Button 
                                            size="sm" 
                                            className={`${ffmpegLoading ? 'bg-rose-500 hover:bg-rose-400' : 'bg-indigo-500 hover:bg-indigo-400'} text-white font-bold rounded-xl transition-colors`}
                                            onClick={processAudio}
                                            disabled={audioQueue.filter(f => f.status === 'pending').length === 0 && !ffmpegLoading}
                                        >
                                            {ffmpegLoading ? <X className="w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                            {ffmpegLoading ? 'Cancel Processing' : 'Process Audio'}
                                        </Button>
                                    </div>
                                    <QueueList 
                                        items={audioQueue} 
                                        type="audio"
                                        imageQueue={imageQueue}
                                        playingId={playingId}
                                        onTogglePreview={togglePreview}
                                        onRemove={(id: string) => removeFile(id, 'audio')}
                                        onDownload={downloadFile}
                                        onUpdateSettings={updateAudioSettings}
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="image" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                {/* Cover Art Studio */}
                                <Dropzone 
                                    label="Drop your Cover Art" 
                                    sub="JPG, PNG, WebP supported (3000px ready)"
                                    icon={ImageIcon}
                                    onDrop={(files: File[]) => addFiles(files, 'image')} 
                                    color="rose"
                                />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">Image Queue ({imageQueue.length})</h3>
                                        <Button 
                                            size="sm" 
                                            className={`${processingRef.current ? 'bg-zinc-600 hover:bg-zinc-500' : 'bg-rose-500 hover:bg-rose-400'} text-white font-bold rounded-xl transition-colors`}
                                            onClick={processImages}
                                            disabled={imageQueue.filter(f => f.status === 'pending').length === 0 && !processingRef.current}
                                        >
                                            {processingRef.current ? <X className="w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                            {processingRef.current ? 'Cancel Processing' : 'Process Images'}
                                        </Button>
                                    </div>
                                    <QueueList 
                                        items={imageQueue} 
                                        type="image"
                                        onRemove={(id: string) => removeFile(id, 'image')}
                                        onDownload={downloadFile}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <Card className="p-8 bg-zinc-950 border-zinc-800 rounded-3xl space-y-8 sticky top-10">
                        {activeTab === 'audio' ? (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-indigo-400" />
                                        Audio Engine
                                    </h3>
                                    <p className="text-xs text-zinc-500">Global audio processing settings</p>
                                </div>
                                <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 space-y-3">
                                    <div className="flex items-center gap-2 text-indigo-400">
                                        <Sparkles className="w-4 h-4" />
                                        <h4 className="text-xs font-bold uppercase">Auto-Embedding</h4>
                                    </div>
                                    <p className="text-[10px] leading-relaxed text-zinc-500">
                                        Processed artwork from the <b>Studio</b> will be automatically embedded into your tracks during audio conversion.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Core Status</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${ffmpegLoaded ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                            <span className="text-[10px] font-bold text-zinc-300">{ffmpegLoaded ? 'LOADED' : 'WAITING'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-rose-400" />
                                        Studio Config
                                    </h3>
                                    <p className="text-xs text-zinc-500">Optimization settings for artwork</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Delivery Size</label>
                                        <div className="flex items-center gap-2 mb-2">
                                             <input 
                                                type="checkbox" 
                                                checked={imageSettings.keepOriginalSize} 
                                                onChange={(e) => setImageSettings(s => ({ ...s, keepOriginalSize: e.target.checked }))}
                                                className="w-4 h-4 accent-rose-500 rounded bg-zinc-900 border-zinc-800"
                                            />
                                            <span className="text-xs text-zinc-400">Keep Original Size</span>
                                        </div>
                                        <Select 
                                            value={imageSettings.imageSize} 
                                            onValueChange={(v) => setImageSettings(s => ({ ...s, imageSize: v }))}
                                            disabled={imageSettings.keepOriginalSize}
                                        >
                                            <SelectTrigger className="bg-zinc-900 border-zinc-800 h-12 rounded-xl text-zinc-300 disabled:opacity-50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-300">
                                                <SelectItem value="3000">3000 x 3000 (iTunes/Spotify)</SelectItem>
                                                <SelectItem value="1500">1500 x 1500 (Basic)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Quality: {imageSettings.quality}%</label>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="10" 
                                            max="100" 
                                            value={imageSettings.quality} 
                                            onChange={(e) => setImageSettings(s => ({ ...s, quality: parseInt(e.target.value) }))}
                                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Output Format</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['image/jpeg', 'image/png', 'image/webp'].map(fmt => (
                                                <button 
                                                    key={fmt}
                                                    onClick={() => setImageSettings(s => ({ ...s, imageFormat: fmt }))}
                                                    className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${imageSettings.imageFormat === fmt ? 'bg-rose-500 text-white border-rose-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                                                >
                                                    {fmt.split('/')[1]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                     <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 space-y-3">
                                        <div className="flex items-center gap-2 text-rose-400">
                                            <Info className="w-4 h-4" />
                                            <h4 className="text-xs font-bold uppercase">Pro Tip</h4>
                                        </div>
                                        <p className="text-[10px] leading-relaxed text-zinc-500">
                                            Use <b>WebP</b> at 80% quality for the best balance of size and fidelity for web use.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Terminal */}
                        <div className="pt-6 border-t border-zinc-900 space-y-4">
                            <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                                <Monitor className="w-3 h-3" />
                                Action Terminal
                            </h4>
                            <div className="bg-black/50 rounded-xl p-4 h-48 overflow-y-auto border border-zinc-900 font-mono text-[10px] space-y-1 custom-scrollbar">
                                {logs.length === 0 && <p className="text-zinc-700 italic">Waiting for activity...</p>}
                                {logs.map((log, i) => (
                                    <p key={i} className={
                                        log.startsWith('✓') ? 'text-emerald-500' : 
                                        log.startsWith('✖') ? 'text-rose-500' : 
                                        'text-zinc-500'
                                    }>
                                        {log}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function TabButton({ active, icon: Icon, label, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all ${active ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-600 hover:text-zinc-400'}`}
        >
            <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : ''}`} />
            <span className="text-sm">{label}</span>
        </button>
    )
}

function PresetButton({ preset, onClick }: any) {
    return (
        <button onClick={onClick} className="flex items-center gap-3 p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl hover:border-indigo-500/50 hover:bg-zinc-900/50 transition-all group group">
            <div className="w-10 h-10 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800 group-hover:bg-indigo-500/10 transition-colors">
                <preset.icon className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400" />
            </div>
            <div className="text-left">
                <p className="text-xs font-bold text-zinc-100 uppercase tracking-wider">{preset.name}</p>
                <p className="text-[10px] text-zinc-500 font-medium uppercase">{preset.format.toUpperCase()} • {preset.bitrate}</p>
            </div>
        </button>
    )
}

function Dropzone({ label, sub, icon: Icon, onDrop, color = 'indigo' }: any) {
    const colorClasses = {
        indigo: 'hover:border-indigo-500/50 ring-indigo-500 text-indigo-400',
        rose: 'hover:border-rose-500/50 ring-rose-500 text-rose-400'
    }[color as 'indigo' | 'rose'] || 'hover:border-indigo-500/50 ring-indigo-500 text-indigo-400'

    return (
        <div 
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); onDrop(Array.from(e.dataTransfer.files)); }}
            onClick={() => {
                const input = document.createElement('input'); input.type = 'file'; input.multiple = true;
                input.onchange = (e: any) => onDrop(Array.from(e.target.files)); input.click();
            }}
            className={`group relative h-48 rounded-3xl border-2 border-dashed border-zinc-800 bg-zinc-900/10 hover:bg-zinc-900/20 transition-all flex flex-col items-center justify-center cursor-pointer p-8 overflow-hidden ${colorClasses.split(' ')[0]}`}
        >
            <div className={`w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-zinc-800 group-hover:${colorClasses.split(' ')[1]} transition-all duration-500`}>
                <Icon className={`w-6 h-6 text-zinc-500 group-hover:${colorClasses.split(' ')[2]}`} />
            </div>
            <h3 className="text-lg font-bold text-zinc-200">{label}</h3>
            <p className="text-xs text-zinc-500 mt-1">{sub}</p>
        </div>
    )
}

function QueueList({ items, type, imageQueue, playingId, onTogglePreview, onRemove, onDownload, onUpdateSettings }: {
    items: FileItem[],
    type: TabType,
    imageQueue?: FileItem[],
    playingId?: string | null,
    onTogglePreview?: (file: File, id: string) => void,
    onRemove: (id: string) => void,
    onDownload: (item: FileItem) => void,
    onUpdateSettings?: (id: string, settings: any) => void
}) {
    return (
        <AnimatePresence mode="popLayout">
            {items.map((item) => (
                <motion.div key={item.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="mb-3">
                    <Card className="bg-zinc-900/40 border-zinc-800 p-4 hover:border-zinc-700 transition-all">
                        <div className="flex items-center gap-4">
                            <div 
                                onClick={() => type === 'audio' && onTogglePreview?.(item.file, item.id)}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                                    type === 'audio' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-rose-500/10 text-rose-400'
                                } ${playingId === item.id ? 'ring-2 ring-indigo-500' : ''}`}
                            >
                                {playingId === item.id ? <Pause className="w-5 h-5" /> : type === 'audio' ? <Music className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-bold text-zinc-100 truncate pr-4">{item.file.name}</h4>
                                    <div className="flex items-center gap-2">
                                        {item.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                        {item.status === 'error' && (
                                            <div className="flex items-center gap-1 group/err relative">
                                                <AlertCircle className="w-4 h-4 text-rose-500" />
                                                <span className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-zinc-950 border border-zinc-800 text-[10px] text-rose-400 rounded-lg opacity-0 group-hover/err:opacity-100 transition-opacity z-50 shadow-2xl">
                                                    {item.error || 'Unknown error occurred'}
                                                </span>
                                            </div>
                                        )}
                                        {item.status === 'pending' && (
                                            <div className="flex items-center gap-1">
                                                {type === 'audio' && (
                                                    <MetadataEditor 
                                                        item={item} 
                                                        imageQueue={imageQueue || []}
                                                        onUpdate={(u: any) => onUpdateSettings?.(item.id, u)} 
                                                    />
                                                )}
                                                <button onClick={() => onRemove(item.id)} className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        {item.status === 'completed' && (
                                            <button onClick={() => onDownload(item)} className="p-1.5 text-emerald-500 hover:text-emerald-400">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-zinc-600">{(item.file.size / (1024*1024)).toFixed(1)} MB</span>
                                    <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div className="h-full bg-indigo-500" initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </AnimatePresence>
    )
}

function MetadataEditor({ item, imageQueue, onUpdate }: { item: FileItem, imageQueue: FileItem[], onUpdate: (updates: any) => void }) {
    const [staged, setStaged] = useState({
        ...item.settings.metadata,
        trimStart: item.settings.trimStart,
        trimEnd: item.settings.trimEnd,
        coverArtId: (item.settings as any).coverArtId || ''
    })

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="p-1.5 text-zinc-600 hover:text-indigo-400 transition-colors">
                    <Tags className="w-4 h-4" />
                </button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-zinc-900 text-zinc-300 rounded-3xl max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Track Logic & Meta</DialogTitle>
                    <DialogDescription className="text-zinc-500">Fine-tune processing for {item.file.name}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Metadata</label>
                        <div className="space-y-3">
                            <Input placeholder="Title" value={staged.title} onChange={(e) => setStaged(s => ({ ...s, title: e.target.value }))} className="bg-zinc-900 border-zinc-800" />
                            <div className="grid grid-cols-2 gap-3">
                                <Input placeholder="Artist" value={staged.artist} onChange={(e) => setStaged(s => ({ ...s, artist: e.target.value }))} className="bg-zinc-900 border-zinc-800" />
                                <Input placeholder="Album" value={staged.album} onChange={(e) => setStaged(s => ({ ...s, album: e.target.value }))} className="bg-zinc-900 border-zinc-800" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Linked Artwork</label>
                        <Select value={staged.coverArtId} onValueChange={(v) => setStaged(s => ({ ...s, coverArtId: v }))}>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 h-12 rounded-xl text-zinc-300">
                                <SelectValue placeholder="Automatic (First Completed Image)" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-300">
                                <SelectItem value="">Automatic (Default)</SelectItem>
                                {imageQueue.filter(img => img.status === 'completed').map(img => (
                                    <SelectItem key={img.id} value={img.id}>{img.file.name}</SelectItem>
                                ))}
                                {imageQueue.filter(img => img.status === 'completed').length === 0 && (
                                    <div className="p-2 text-[10px] text-zinc-500 italic text-center">No processed images available yet</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-900">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Trim Start (sec)</label>
                            <Input placeholder="e.g. 0" value={staged.trimStart} onChange={(e) => setStaged(s => ({ ...s, trimStart: e.target.value }))} className="bg-zinc-900 border-zinc-800" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Trim End (sec)</label>
                            <Input placeholder="e.g. 180" value={staged.trimEnd} onChange={(e) => setStaged(s => ({ ...s, trimEnd: e.target.value }))} className="bg-zinc-900 border-zinc-800" />
                        </div>
                    </div>
                </div>
                <Button className="w-full bg-indigo-500 text-white font-bold h-12 rounded-xl hover:bg-indigo-400" onClick={() => { 
                    onUpdate({ 
                        metadata: { title: staged.title, artist: staged.artist, album: staged.album },
                        trimStart: staged.trimStart,
                        trimEnd: staged.trimEnd,
                        coverArtId: staged.coverArtId
                    }); 
                    toast.success('Logic Staged');
                }}>Apply & Save</Button>
            </DialogContent>
        </Dialog>
    )
}
