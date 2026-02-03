'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { submitTrack } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { UploadCloud, Loader2, Music, Image as ImageIcon, X, Calendar, Disc, Check, ChevronRight, ChevronLeft } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const ALL_PLATFORMS = [
    { id: 'spotify', name: 'Spotify', icon: '' },
    { id: 'apple_music', name: 'Apple Music', icon: '' },
    { id: 'amazon', name: 'Amazon Music', icon: '' },
    { id: 'youtube', name: 'YouTube Music', icon: '' },
    { id: 'tidal', name: 'Tidal', icon: '' },
    { id: 'deezer', name: 'Deezer', icon: '' },
    { id: 'jiosaavn', name: 'JioSaavn', icon: '' },
    { id: 'gaana', name: 'Gaana', icon: '' },
]

export default function UploadForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  // File States
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [duration, setDuration] = useState(initialData?.duration || 0)

  // Core Metadata
  const [releaseType, setReleaseType] = useState(initialData?.albums?.type || 'single')
  const [title, setTitle] = useState(initialData?.title || '')
  const [labelName, setLabelName] = useState(initialData?.albums?.label_name || '')
  const [primaryArtist, setPrimaryArtist] = useState(initialData?.albums?.primary_artist || '')
  const [featuringArtist, setFeaturingArtist] = useState(initialData?.albums?.featuring_artist || '')
  const [genre, setGenre] = useState(initialData?.genre || '')
  const [subGenre, setSubGenre] = useState(initialData?.albums?.sub_genre || '')
  
  // Dates
  const [releaseDate, setReleaseDate] = useState(initialData?.albums?.release_date ? new Date(initialData.albums.release_date).toISOString().split('T')[0] : '')
  const [originalReleaseDate, setOriginalReleaseDate] = useState(initialData?.albums?.original_release_date ? new Date(initialData.albums.original_release_date).toISOString().split('T')[0] : '')

  // Identifiers & Legal
  const currentYear = new Date().getFullYear().toString()
  const [upc, setUpc] = useState(initialData?.albums?.upc || '') 
  
  // Track Details State
  const [trackVersion, setTrackVersion] = useState('original')
  const [isInstrumental, setIsInstrumental] = useState('no')
  const [trackTitle, setTrackTitle] = useState(initialData?.title || '') // Defaults to release title
  const [versionSubtitle, setVersionSubtitle] = useState('')
  const [trackPrimaryArtist, setTrackPrimaryArtist] = useState('')
  const [trackFeaturingArtist, setTrackFeaturingArtist] = useState('')
  const [trackGenre, setTrackGenre] = useState('')
  const [trackSubGenre, setTrackSubGenre] = useState('')
  const [trackPLine, setTrackPLine] = useState('')
  const [trackTitleLanguage, setTrackTitleLanguage] = useState('english')
  const [trackLyricsLanguage, setTrackLyricsLanguage] = useState('english')
  
  const [lyricists, setLyricists] = useState<{firstName: string, lastName: string}[]>([])
  const [newLyricistFirst, setNewLyricistFirst] = useState('')
  const [newLyricistLast, setNewLyricistLast] = useState('')

  const [composers, setComposers] = useState<{firstName: string, lastName: string}[]>([])
  const [newComposerFirst, setNewComposerFirst] = useState('')
  const [newComposerLast, setNewComposerLast] = useState('')
  
  const [producer, setProducer] = useState('')
  const [productionYear, setProductionYear] = useState(currentYear)
  const [publisher, setPublisher] = useState('')
  const [hasISRC, setHasISRC] = useState('no')
  const [isrc, setIsrc] = useState('')
  const [priceTier, setPriceTier] = useState('mid')
  const [explicitType, setExplicitType] = useState('no')
  const [callerTuneTiming, setCallerTuneTiming] = useState('')
  const [distributeVideo, setDistributeVideo] = useState('no')
  
  // Artist Dialog State
  const [isArtistDialogOpen, setIsArtistDialogOpen] = useState(false)
  const [artistDialogMode, setArtistDialogMode] = useState<'release' | 'track' | 'release-featuring' | 'track-featuring'>('release')
  const [artistDialogName, setArtistDialogName] = useState('')
  const [artistDialogSpotify, setArtistDialogSpotify] = useState('')
  const [artistDialogApple, setArtistDialogApple] = useState('')

  // Platform IDs State
  const [primaryArtistSpotify, setPrimaryArtistSpotify] = useState('')
  const [primaryArtistApple, setPrimaryArtistApple] = useState('')
  const [featuringArtistSpotify, setFeaturingArtistSpotify] = useState('')
  const [featuringArtistApple, setFeaturingArtistApple] = useState('')
  
  const [trackPrimaryArtistSpotify, setTrackPrimaryArtistSpotify] = useState('')
  const [trackPrimaryArtistApple, setTrackPrimaryArtistApple] = useState('')
  const [trackFeaturingArtistSpotify, setTrackFeaturingArtistSpotify] = useState('')
  const [trackFeaturingArtistApple, setTrackFeaturingArtistApple] = useState('')

  const openArtistDialog = (mode: 'release' | 'track' | 'release-featuring' | 'track-featuring') => {
      setArtistDialogMode(mode)
      if (mode === 'release') {
          setArtistDialogName(primaryArtist)
          setArtistDialogSpotify(primaryArtistSpotify)
          setArtistDialogApple(primaryArtistApple)
      } else if (mode === 'release-featuring') {
          setArtistDialogName(featuringArtist)
          setArtistDialogSpotify(featuringArtistSpotify)
          setArtistDialogApple(featuringArtistApple)
      } else if (mode === 'track') {
          setArtistDialogName(trackPrimaryArtist)
          setArtistDialogSpotify(trackPrimaryArtistSpotify)
          setArtistDialogApple(trackPrimaryArtistApple)
       } else if (mode === 'track-featuring') {
          setArtistDialogName(trackFeaturingArtist)
          setArtistDialogSpotify(trackFeaturingArtistSpotify)
          setArtistDialogApple(trackFeaturingArtistApple)
      }
      setIsArtistDialogOpen(true)
  }

  const saveArtistDetails = () => {
      if (!artistDialogName) return 
      
      if (artistDialogMode === 'release') {
          setPrimaryArtist(artistDialogName)
          setPrimaryArtistSpotify(artistDialogSpotify)
          setPrimaryArtistApple(artistDialogApple)
      } else if (artistDialogMode === 'release-featuring') {
          setFeaturingArtist(artistDialogName)
          setFeaturingArtistSpotify(artistDialogSpotify)
          setFeaturingArtistApple(artistDialogApple)
      } else if (artistDialogMode === 'track') {
          setTrackPrimaryArtist(artistDialogName)
          setTrackPrimaryArtistSpotify(artistDialogSpotify)
          setTrackPrimaryArtistApple(artistDialogApple)
      } else if (artistDialogMode === 'track-featuring') {
          setTrackFeaturingArtist(artistDialogName)
          setTrackFeaturingArtistSpotify(artistDialogSpotify)
          setTrackFeaturingArtistApple(artistDialogApple)
      }
      setIsArtistDialogOpen(false)
  }

  // Platforms
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(initialData?.albums?.target_platforms || ALL_PLATFORMS.map(p => p.id))


  // Parse initial P/C lines or default
  const parseLine = (line: string, type: 'P' | 'C') => {
      if (!line) return { year: currentYear, text: '' }
      const match = line.match(/(\d{4})\s+(.*)/)
      if (match) return { year: match[1], text: match[2] }
      return { year: currentYear, text: line.replace(/[℗©]\s*/, '').trim() }
  }

  const initialP = parseLine(initialData?.albums?.p_line || '', 'P')
  const initialC = parseLine(initialData?.albums?.c_line || '', 'C')

  const [pLineYear, setPLineYear] = useState(initialP.year)
  const [pLineText, setPLineText] = useState(initialP.text)
  const [cLineYear, setCLineYear] = useState(initialC.year)
  const [cLineText, setCLineText] = useState(initialC.text)

  const [courtesyLine, setCourtesyLine] = useState(initialData?.albums?.courtesy_line || '')

  // Additional
  const [description, setDescription] = useState(initialData?.albums?.description || '')
  const [language, setLanguage] = useState(initialData?.language || 'English')
  const [lyrics, setLyrics] = useState(initialData?.lyrics || '')
  
  // Helpers
  const addLyricist = () => {
    if(newLyricistFirst && newLyricistLast) {
        setLyricists([...lyricists, { firstName: newLyricistFirst, lastName: newLyricistLast }])
        setNewLyricistFirst('')
        setNewLyricistLast('')
    }
  }
  const removeLyricist = (i: number) => setLyricists(lyricists.filter((_, idx) => idx !== i))

  const addComposer = () => {
    if(newComposerFirst && newComposerLast) {
        setComposers([...composers, { firstName: newComposerFirst, lastName: newComposerLast }])
        setNewComposerFirst('')
        setNewComposerLast('')
    }
  }
  const removeComposer = (i: number) => setComposers(composers.filter((_, idx) => idx !== i))
  
  const togglePlatform = (id: string) => {
      if (selectedPlatforms.includes(id)) {
          setSelectedPlatforms(selectedPlatforms.filter(p => p !== id))
      } else {
          setSelectedPlatforms([...selectedPlatforms, id])
      }
  }
  
  const toggleAllPlatforms = () => {
      if (selectedPlatforms.length === ALL_PLATFORMS.length) {
          setSelectedPlatforms([])
      } else {
          setSelectedPlatforms(ALL_PLATFORMS.map(p => p.id))
      }
  }


  const releaseTypes = [
      { id: 'ep', label: 'EP' },
      { id: 'single', label: 'Single' },
      { id: 'album', label: 'Album' },
      { id: 'compilation', label: 'Compilation' },
  ]
  
  const currentYearInt = new Date().getFullYear()
  const years = Array.from({ length: currentYearInt - 1900 + 1 }, (_, i) => (currentYearInt - i).toString())


  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
      const audio = new Audio(URL.createObjectURL(file))
      audio.onloadedmetadata = () => {
        setDuration(Math.round(audio.duration))
      }
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCoverFile(e.target.files[0])
    }
  }
  
  const validateStep = (step: number) => {
      if (step === 1) {
          if (!releaseType || !title || !labelName || !primaryArtist || !releaseDate || !genre || (!coverFile && !initialData?.albums?.cover_art_url)) {
              toast.error("Please fill in all required fields in Step 1, including Cover Art.")
              return false
          }
      }
      if (step === 2) {
          if ((!audioFile && !initialData?.file_url) || !trackTitle || !productionYear || !publisher) {
              toast.error("Please upload audio and fill in required track details.")
              return false
          }
      }
      return true
  }

  const nextStep = () => {
      if (validateStep(currentStep)) {
          setCurrentStep(prev => Math.min(prev + 1, 4))
          window.scrollTo(0, 0)
      }
  }
  
  const prevStep = () => {
      setCurrentStep(prev => Math.max(prev - 1, 1))
      window.scrollTo(0, 0)
  }

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent, status: 'pending' | 'draft' = 'pending') => {
    e.preventDefault()
    
    setLoading(true)
    const supabase = createClient()
    const timestamp = Date.now()

    try {
        if (!audioFile && !initialData?.file_url) throw new Error("Audio file is required")
        let audioUrl = initialData?.file_url
        let coverArtUrl = initialData?.albums?.cover_art_url

        if (audioFile) {
             const audioPath = `tracks/${timestamp}_${audioFile.name}`
             const { error: audioError } = await supabase.storage.from('music-files-new').upload(audioPath, audioFile)
             if (audioError) throw audioError
             const { data: audioData } = supabase.storage.from('music-files-new').getPublicUrl(audioPath)
             audioUrl = audioData.publicUrl
        }

        if (coverFile) {
            const coverPath = `covers/${timestamp}_${coverFile.name}`
            const { error: coverError } = await supabase.storage.from('cover-art-new').upload(coverPath, coverFile)
            if (coverError) throw coverError
            const { data: coverData } = supabase.storage.from('cover-art-new').getPublicUrl(coverPath)
            coverArtUrl = coverData.publicUrl
        }

        const formData = {
            id: initialData?.id,
            title,
            genre,
            subGenre,
            releaseType,
            labelName,
            primaryArtist,
            featuringArtist,
            originalReleaseDate,
            pLine: `℗ ${pLineYear} ${pLineText}`,
            cLine: `© ${cLineYear} ${cLineText}`,
            courtesyLine,
            description,
            language,
            duration,
            explicit: explicitType === 'yes', 
            lyrics,
            
            // Detailed Audio Details
            trackVersion, 
            isInstrumental: isInstrumental === 'yes',
            trackTitle: trackTitle || title,
            versionSubtitle,
            trackPrimaryArtist,
            trackFeaturingArtist,
            trackGenre,
            trackSubGenre,
            trackPLine,
            trackTitleLanguage,
            trackLyricsLanguage,
            
            // Artist Platform IDs
            primaryArtistSpotify,
            primaryArtistApple,
            featuringArtistSpotify,
            featuringArtistApple,
            trackPrimaryArtistSpotify,
            trackPrimaryArtistApple,
            trackFeaturingArtistSpotify,
            trackFeaturingArtistApple,

            lyricists,
            composers,
            producer,
            productionYear,
            publisher,
            isrc: hasISRC === 'yes' ? isrc : '',
            priceTier,
            explicitType,
            callerTuneTiming,
            distributeVideo: distributeVideo === 'yes',
            
            selectedPlatforms,
            
            audioUrl,
            coverArtUrl,
            releaseDate,
            status: initialData?.status || 'pending'
        }

        const result = await submitTrack(formData)
        if (result.success) {
            toast.success(initialData ? "Release updated successfully!" : "Release submitted successfully!")
            router.push('/dashboard/catalog')
        }
    } catch (error: any) {
        console.error(error)
        toast.error(error.message || "Failed to submit release")
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="pb-20">
        
        {/* Stepper Header */}
        <div className="mb-8 pt-4 pb-6 bg-zinc-950 border-b border-white/5">
             <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-zinc-800"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-emerald-500 transition-all duration-500 origin-left" style={{ transform: `scaleX(${(currentStep - 1) / 3})` }}></div>
                    
                    {/* Steps */}
                    {[
                        { num: 1, label: 'Release Info', icon: Disc },
                        { num: 2, label: 'Song Info', icon: Music },
                        { num: 3, label: 'Platforms', icon: UploadCloud },
                        { num: 4, label: 'Submission', icon: Check }
                    ].map((step) => (
                        <div key={step.num} className="flex flex-col items-center gap-2 bg-zinc-950 px-2 relative z-10">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                 currentStep > step.num ? 'bg-emerald-500 border-emerald-500 text-white' :
                                 currentStep === step.num ? 'bg-zinc-950 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
                                 'bg-zinc-900 border-zinc-700 text-zinc-500'
                             }`}>
                                 {currentStep > step.num ? <Check size={18} /> : <step.icon size={18} />}
                             </div>
                             <span className={`text-[10px] uppercase font-bold tracking-widest ${
                                 currentStep >= step.num ? 'text-emerald-500' : 'text-zinc-600'
                             }`}>{step.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <form className="max-w-6xl mx-auto px-4">
            
            {/* STEP 1: Release Info */}
            <div className={currentStep === 1 ? 'block space-y-8 animate-in fade-in slide-in-from-right-4 duration-300' : 'hidden'}>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* Left: Metadata Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Release Type */}
                         <div className="space-y-3">
                            <Label className="text-xs uppercase font-black text-zinc-500 tracking-widest ml-1">Release Type <span className="text-red-500">*</span></Label>
                            <div className="flex gap-4">
                                {releaseTypes.map((type) => (
                                    <button
                                        type="button"
                                        key={type.id}
                                        onClick={(e) => { e.preventDefault(); setReleaseType(type.id); }}
                                        className={`px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
                                            releaseType === type.id 
                                            ? 'bg-indigo-500 text-white border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                                            : 'bg-white/5 text-zinc-400 border-white/10 hover:border-white/30 hover:bg-white/10'
                                        }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-zinc-400">Release Title <span className="text-red-500">*</span></Label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Release Title" className="bg-white/5 border-white/10 text-white h-12" />
                            </div>
                             <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-zinc-400">Label Name <span className="text-red-500">*</span></Label>
                                <Input value={labelName} onChange={(e) => setLabelName(e.target.value)} placeholder="Label Name" className="bg-white/5 border-white/10 text-white h-12" />
                            </div>
                        </div>
                        
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-zinc-400">Primary Artist <span className="text-red-500">*</span></Label>
                                <div className="flex gap-2">
                                    <Input value={primaryArtist} onChange={(e) => setPrimaryArtist(e.target.value)} placeholder="Select Primary Artist" className="bg-white/5 border-white/10 text-white h-12" />
                                    <Button type="button" onClick={() => openArtistDialog('release')} size="icon" className="h-12 w-12 bg-indigo-500 hover:bg-indigo-600 rounded-lg shrink-0">+</Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-zinc-400">Featuring Artist</Label>
                                <div className="flex gap-2">
                                    <Input value={featuringArtist} onChange={(e) => setFeaturingArtist(e.target.value)} placeholder="Select Featuring Artist" className="bg-white/5 border-white/10 text-white h-12" />
                                    <Button type="button" onClick={() => openArtistDialog('release-featuring')} size="icon" className="h-12 w-12 bg-indigo-500 hover:bg-indigo-600 rounded-lg shrink-0">+</Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-zinc-400">Genre <span className="text-red-500">*</span></Label>
                                <Select value={genre} onValueChange={setGenre}>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-12"><SelectValue placeholder="Select Genre" /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                        <SelectItem value="pop">Pop</SelectItem>
                                        <SelectItem value="hiphop">Hip Hop</SelectItem>
                                        <SelectItem value="rnb">R&B</SelectItem>
                                        <SelectItem value="rock">Rock</SelectItem>
                                        <SelectItem value="electronic">Electronic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-zinc-400">Sub Genre <span className="text-red-500">*</span></Label>
                                <Input value={subGenre} onChange={(e) => setSubGenre(e.target.value)} placeholder="Enter sub genre" className="bg-white/5 border-white/10 text-white h-12" />
                            </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-zinc-400">Release Date <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} className="bg-white/5 border-white/10 text-white h-12 pl-10" />
                                    <Calendar className="absolute left-3 top-3.5 text-zinc-500 h-5 w-5 pointer-events-none" />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-zinc-400">Original Release Date</Label>
                                <div className="relative">
                                    <Input type="date" value={originalReleaseDate} onChange={(e) => setOriginalReleaseDate(e.target.value)} className="bg-white/5 border-white/10 text-white h-12 pl-10" />
                                    <Calendar className="absolute left-3 top-3.5 text-zinc-500 h-5 w-5 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-zinc-400">UPC/EAN (Optional)</Label>
                                <Input value={upc} onChange={(e) => setUpc(e.target.value)} placeholder="UPC/EAN" className="bg-white/5 border-white/10 text-white h-12" />
                            </div>
                             <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-zinc-400">P-Line <span className="text-red-500">*</span></Label>
                                <div className="flex gap-2">
                                    <Select value={pLineYear} onValueChange={setPLineYear}>
                                        <SelectTrigger className="w-[100px] bg-white/5 border-white/10 text-white h-12"><SelectValue placeholder="Year" /></SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white max-h-[300px]">{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <Input value={pLineText} onChange={(e) => setPLineText(e.target.value)} placeholder="Owner" className="flex-1 bg-white/5 border-white/10 text-white h-12" />
                                </div>
                            </div>
                        </div>
                        
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-zinc-400">Courtesy Line</Label>
                                <Input value={courtesyLine} onChange={(e) => setCourtesyLine(e.target.value)} placeholder="Courtesy of Your Label Name" className="bg-white/5 border-white/10 text-white h-12" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-zinc-400">C-Line <span className="text-red-500">*</span></Label>
                                <div className="flex gap-2">
                                    <Select value={cLineYear} onValueChange={setCLineYear}>
                                        <SelectTrigger className="w-[100px] bg-white/5 border-white/10 text-white h-12"><SelectValue placeholder="Year" /></SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white max-h-[300px]">{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <Input value={cLineText} onChange={(e) => setCLineText(e.target.value)} placeholder="Owner" className="flex-1 bg-white/5 border-white/10 text-white h-12" />
                                </div>
                            </div>
                        </div>

                         <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-zinc-400">Additional Information & Requests</Label>
                            <Textarea 
                                value={description} onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter any additional information or special requests here..."
                                className="bg-white/5 border-white/10 text-white min-h-[100px]"
                            />
                        </div>

                    </div>
                    
                     {/* Right: Cover Art */}
                    <div className="space-y-6">
                        <Card className="bg-white/[0.03] border-white/10 backdrop-blur-xl overflow-hidden h-full">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                                    <Disc size={16} /> Cover Art <span className="text-red-500">*</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center">
                                <div className={`relative transition-all aspect-square w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer group hover:border-indigo-500/50 hover:bg-indigo-500/5 ${coverFile || initialData?.albums?.cover_art_url ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-black/20'}`}>
                                    <input type="file" accept="image/*" onChange={handleCoverChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    {coverFile || initialData?.albums?.cover_art_url ? (
                                        <img src={coverFile ? URL.createObjectURL(coverFile) : initialData.albums.cover_art_url} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <ImageIcon className="text-zinc-500 group-hover:text-indigo-400 transition-colors" size={32} />
                                            </div>
                                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Upload Cover</p>
                                            <p className="text-[10px] text-zinc-600 mt-2">3000 x 3000px · JPG/PNG</p>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>


            {/* STEP 2: Song Info - Replicated from Mockup */}
            <div className={currentStep === 2 ? 'block space-y-8 animate-in fade-in slide-in-from-right-4 duration-300' : 'hidden'}>
                 
                 {/* Audio File Upload Header */}
                 <Card className="bg-white/[0.03] border-white/10 backdrop-blur-xl overflow-hidden mb-8">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                            <Music size={16} /> Audio Source <span className="text-red-500">*</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`relative transition-all h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer group hover:border-indigo-500/50 hover:bg-indigo-500/5 ${audioFile || initialData?.file_url ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-black/20'}`}>
                            <input type="file" accept="audio/*" onChange={handleAudioChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            {audioFile || initialData?.file_url ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <Music className="text-emerald-500" size={16} />
                                    </div>
                                    <p className="text-xs text-emerald-400 font-bold max-w-[300px] truncate">{audioFile?.name || 'Existing File'}</p>
                                </div>
                            ) : (
                                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-2"><UploadCloud size={16} /> Upload WAV/FLAC</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                 {/* Detailed Info Grid */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                     
                     {/* LEFT COLUMN */}
                     <div className="space-y-6">
                         
                         {/* Track Version */}
                         <div className="space-y-3">
                             <Label className="text-xs uppercase font-bold text-zinc-400">Track Version <span className="text-red-500">*</span></Label>
                             <div className="flex gap-4 flex-wrap">
                                 {['original', 'karaoke', 'medley', 'cover'].map((ver) => (
                                     <label key={ver} className="flex items-center gap-2 cursor-pointer group">
                                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${trackVersion === ver ? 'border-indigo-500' : 'border-zinc-600 group-hover:border-zinc-500'}`}>
                                             {trackVersion === ver && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                                         </div>
                                         <input type="radio" className="hidden" name="trackVersion" value={ver} checked={trackVersion === ver} onChange={() => setTrackVersion(ver)} />
                                         <span className="text-sm text-zinc-300 capitalize">{ver}</span>
                                     </label>
                                 ))}
                             </div>
                         </div>

                         {/* Instrumental */}
                         <div className="space-y-3">
                             <Label className="text-xs uppercase font-bold text-zinc-400">Instrumental <span className="text-red-500">*</span></Label>
                             <div className="flex gap-4">
                                 {['yes', 'no'].map((opt) => (
                                     <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isInstrumental === opt ? 'border-indigo-500' : 'border-zinc-600 group-hover:border-zinc-500'}`}>
                                             {isInstrumental === opt && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                                         </div>
                                         <input type="radio" className="hidden" name="isInstrumental" value={opt} checked={isInstrumental === opt} onChange={() => setIsInstrumental(opt)} />
                                         <span className="text-sm text-zinc-300 capitalize">{opt}</span>
                                     </label>
                                 ))}
                             </div>
                         </div>
                         
                         <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-zinc-400">Title <span className="text-red-500">*</span></Label>
                            <Input value={trackTitle} onChange={(e) => setTrackTitle(e.target.value)} placeholder="Title" className="bg-white/5 border-white/10 text-white h-12" />
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-zinc-400">Version/Subtitle</Label>
                            <Input value={versionSubtitle} onChange={(e) => setVersionSubtitle(e.target.value)} placeholder="Version Subtitle" className="bg-white/5 border-white/10 text-white h-12" />
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-zinc-400">Primary Artist <span className="text-red-500">*</span></Label>
                            <div className="flex gap-2">
                                <Input value={trackPrimaryArtist} onChange={(e) => setTrackPrimaryArtist(e.target.value)} placeholder="Select Primary Artist" className="bg-white/5 border-white/10 text-white h-12" />
                                <Button type="button" onClick={() => openArtistDialog('track')} size="icon" className="h-12 w-12 bg-indigo-500 hover:bg-indigo-600 rounded-lg shrink-0">+</Button>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-zinc-400">Featuring Artist</Label>
                            <div className="flex gap-2">
                                <Input value={trackFeaturingArtist} onChange={(e) => setTrackFeaturingArtist(e.target.value)} placeholder="Select Featuring Artist" className="bg-white/5 border-white/10 text-white h-12" />
                                <Button type="button" onClick={() => openArtistDialog('track-featuring')} size="icon" className="h-12 w-12 bg-indigo-500 hover:bg-indigo-600 rounded-lg shrink-0">+</Button>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                             <Label className="text-xs uppercase font-bold text-zinc-400">Lyricist <span className="text-red-500">*</span></Label>
                             <div className="flex gap-2">
                                <Input value={newLyricistFirst} onChange={(e) => setNewLyricistFirst(e.target.value)} placeholder="First Name" className="bg-white/5 border-white/10 text-white h-12" />
                                <Input value={newLyricistLast} onChange={(e) => setNewLyricistLast(e.target.value)} placeholder="Last Name" className="bg-white/5 border-white/10 text-white h-12" />
                             </div>
                             <Button type="button" onClick={addLyricist} className="bg-indigo-500 hover:bg-indigo-600 text-white w-full h-10">+ Add</Button>
                             {/* Display Lists */}
                             {lyricists.length > 0 && (
                                 <div className="space-y-1 mt-2">
                                     {lyricists.map((l, i) => (
                                         <div key={i} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded text-sm text-zinc-300">
                                             <span>{l.firstName} {l.lastName}</span>
                                             <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => removeLyricist(i)}/>
                                         </div>
                                     ))}
                                 </div>
                             )}
                        </div>

                        <div className="space-y-3">
                             <Label className="text-xs uppercase font-bold text-zinc-400">Composer <span className="text-red-500">*</span></Label>
                             <div className="flex gap-2">
                                <Input value={newComposerFirst} onChange={(e) => setNewComposerFirst(e.target.value)} placeholder="First Name" className="bg-white/5 border-white/10 text-white h-12" />
                                <Input value={newComposerLast} onChange={(e) => setNewComposerLast(e.target.value)} placeholder="Last Name" className="bg-white/5 border-white/10 text-white h-12" />
                             </div>
                             <Button type="button" onClick={addComposer} className="bg-indigo-500 hover:bg-indigo-600 text-white w-full h-10">+ Add</Button>
                              {composers.length > 0 && (
                                 <div className="space-y-1 mt-2">
                                     {composers.map((c, i) => (
                                         <div key={i} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded text-sm text-zinc-300">
                                             <span>{c.firstName} {c.lastName}</span>
                                             <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => removeComposer(i)}/>
                                         </div>
                                     ))}
                                 </div>
                             )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-zinc-400">Music Producer <span className="text-red-500">*</span></Label>
                            <Input value={producer} onChange={(e) => setProducer(e.target.value)} placeholder="Music Producer" className="bg-white/5 border-white/10 text-white h-12" />
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-zinc-400">Lyrics</Label>
                            <Textarea value={lyrics} onChange={(e) => setLyrics(e.target.value)} placeholder="Lyrics" className="bg-white/5 border-white/10 text-white min-h-[120px]" />
                        </div>

                     </div>

                     {/* RIGHT COLUMN */}
                     <div className="space-y-6">
                         
                          <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-zinc-400">P Line <span className="text-red-500">*</span></Label>
                            <Input value={trackPLine} onChange={(e) => setTrackPLine(e.target.value)} placeholder="Phonographic Copyright Line" className="bg-white/5 border-white/10 text-white h-12" />
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-zinc-400">Production Year <span className="text-red-500">*</span></Label>
                            <Input value={productionYear} onChange={(e) => setProductionYear(e.target.value)} placeholder="2026" className="bg-white/5 border-white/10 text-white h-12" />
                        </div>
                        
                         <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-zinc-400">Publisher</Label>
                            <Input value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="Publisher" className="bg-white/5 border-white/10 text-white h-12" />
                        </div>
                        
                         <div className="space-y-3">
                             <Label className="text-xs uppercase font-bold text-zinc-400">Have Your Own ISRC? <span className="text-red-500">*</span></Label>
                             <div className="flex gap-4">
                                 {['yes', 'no'].map((opt) => (
                                     <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${hasISRC === opt ? 'border-indigo-500' : 'border-zinc-600 group-hover:border-zinc-500'}`}>
                                             {hasISRC === opt && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                                         </div>
                                         <input type="radio" className="hidden" name="hasISRC" value={opt} checked={hasISRC === opt} onChange={() => setHasISRC(opt)} />
                                         <span className="text-sm text-zinc-300 capitalize">{opt}</span>
                                     </label>
                                 ))}
                             </div>
                             {hasISRC === 'yes' && (
                                <Input value={isrc} onChange={(e) => setIsrc(e.target.value)} placeholder="Enter ISRC" className="bg-white/5 border-white/10 text-white h-12 mt-2" />
                             )}
                         </div>

                        <div className="space-y-2">
                             <Label className="text-xs uppercase font-bold text-zinc-400">Genre <span className="text-red-500">*</span></Label>
                             <Select value={trackGenre} onValueChange={setTrackGenre}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white h-12"><SelectValue placeholder="Select Genre" /></SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="pop">Pop</SelectItem>
                                    <SelectItem value="hiphop">Hip Hop</SelectItem>
                                    <SelectItem value="rnb">R&B</SelectItem>
                                    <SelectItem value="rock">Rock</SelectItem>
                                    <SelectItem value="electronic">Electronic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-zinc-400">Sub Genre <span className="text-red-500">*</span></Label>
                            <Input value={trackSubGenre} onChange={(e) => setTrackSubGenre(e.target.value)} placeholder="Sub Genre" className="bg-white/5 border-white/10 text-white h-12" />
                        </div>
                        
                         <div className="space-y-2">
                             <Label className="text-xs uppercase font-bold text-zinc-400">Price Tier <span className="text-red-500">*</span></Label>
                             <Select value={priceTier} onValueChange={setPriceTier}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white h-12"><SelectValue placeholder="Select Price Tier" /></SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="mid">Mid</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="premium">Premium</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                         <div className="space-y-3">
                             <Label className="text-xs uppercase font-bold text-zinc-400">Explicit Version <span className="text-red-500">*</span></Label>
                             <div className="flex gap-4">
                                 {['yes', 'no', 'cleaned'].map((opt) => (
                                     <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${explicitType === opt ? 'border-indigo-500' : 'border-zinc-600 group-hover:border-zinc-500'}`}>
                                             {explicitType === opt && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                                         </div>
                                         <input type="radio" className="hidden" name="explicitType" value={opt} checked={explicitType === opt} onChange={() => setExplicitType(opt)} />
                                         <span className="text-sm text-zinc-300 capitalize">{opt}</span>
                                     </label>
                                 ))}
                             </div>
                         </div>
                         
                         <div className="space-y-2">
                             <Label className="text-xs uppercase font-bold text-zinc-400">Track Title Language <span className="text-red-500">*</span></Label>
                             <Select value={trackTitleLanguage} onValueChange={setTrackTitleLanguage}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white h-12"><SelectValue placeholder="Track Title Language" /></SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="english">English</SelectItem>
                                    <SelectItem value="spanish">Spanish</SelectItem>
                                    <SelectItem value="hindi">Hindi</SelectItem>
                                    <SelectItem value="french">French</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                             <Label className="text-xs uppercase font-bold text-zinc-400">Lyrics Language <span className="text-red-500">*</span></Label>
                             <Select value={trackLyricsLanguage} onValueChange={setTrackLyricsLanguage}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white h-12"><SelectValue placeholder="Lyrics Language" /></SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="english">English</SelectItem>
                                    <SelectItem value="spanish">Spanish</SelectItem>
                                    <SelectItem value="hindi">Hindi</SelectItem>
                                    <SelectItem value="french">French</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-zinc-400">Caller Tune Timing <span className="text-red-500">*</span></Label>
                            <Input value={callerTuneTiming} onChange={(e) => setCallerTuneTiming(e.target.value)} placeholder="HH:MM:SS" className="bg-white/5 border-white/10 text-white h-12" />
                        </div>
                        
                         <div className="space-y-3">
                             <Label className="text-xs uppercase font-bold text-zinc-400">Want to distribute music video?</Label>
                             <div className="flex gap-4">
                                 {['yes', 'no'].map((opt) => (
                                     <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${distributeVideo === opt ? 'border-indigo-500' : 'border-zinc-600 group-hover:border-zinc-500'}`}>
                                             {distributeVideo === opt && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                                         </div>
                                         <input type="radio" className="hidden" name="distributeVideo" value={opt} checked={distributeVideo === opt} onChange={() => setDistributeVideo(opt)} />
                                         <span className="text-sm text-zinc-300 capitalize">{opt}</span>
                                     </label>
                                 ))}
                             </div>
                         </div>
                     </div>
                 </div>
            </div>
            

            {/* STEP 3: Platforms */}
            <div className={currentStep === 3 ? 'block space-y-8 animate-in fade-in slide-in-from-right-4 duration-300' : 'hidden'}>
                <div className="space-y-4">
                     <div className="flex justify-between items-center border-b border-white/10 pb-4">
                         <h3 className="text-sm font-black uppercase text-zinc-400 tracking-widest">Select Platforms</h3>
                         <Button type="button" variant="outline" size="sm" onClick={toggleAllPlatforms} className="border-white/10 text-zinc-300 hover:bg-white/10">
                             {selectedPlatforms.length === ALL_PLATFORMS.length ? 'Deselect All' : 'Select All'}
                         </Button>
                     </div>
                     
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {ALL_PLATFORMS.map(platform => (
                             <div 
                                key={platform.id}
                                onClick={() => togglePlatform(platform.id)}
                                className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 ${
                                    selectedPlatforms.includes(platform.id) 
                                    ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                }`}
                             >
                                 <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                     selectedPlatforms.includes(platform.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-600'
                                 }`}>
                                     {selectedPlatforms.includes(platform.id) && <Check size={14} />}
                                 </div>
                                 <span className={`font-bold text-sm ${selectedPlatforms.includes(platform.id) ? 'text-emerald-400' : 'text-zinc-400'}`}>{platform.name}</span>
                             </div>
                         ))}
                     </div>
                     
                     <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mt-8">
                         <span className="font-bold flex items-center gap-2"><UploadCloud size={16}/> Note:</span> Distribution typically takes 2-5 days for approval and delivery to these stores.
                     </div>
                </div>
            </div>

            {/* STEP 4: Submission */}
             <div className={currentStep === 4 ? 'block space-y-8 animate-in fade-in slide-in-from-right-4 duration-300' : 'hidden'}>
                 <div className="space-y-6">
                     <h3 className="text-center text-2xl font-black text-white uppercase tracking-widest">Review & Submit</h3>
                     
                     <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-6">
                         
                         <div className="flex gap-6 items-start">
                             <div className="w-32 h-32 rounded-lg bg-black/50 overflow-hidden shrink-0 border border-white/10">
                                 {(coverFile || initialData?.albums?.cover_art_url) && (
                                     <img src={coverFile ? URL.createObjectURL(coverFile) : initialData.albums.cover_art_url} className="w-full h-full object-cover" />
                                 )}
                             </div>
                             <div>
                                 <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
                                 <p className="text-zinc-400 flex items-center gap-2 mb-1"><span className="text-zinc-600 text-xs font-bold uppercase">Artist:</span> {primaryArtist}</p>
                                 <p className="text-zinc-400 flex items-center gap-2 mb-1"><span className="text-zinc-600 text-xs font-bold uppercase">Label:</span> {labelName}</p>
                                 <p className="text-zinc-400 flex items-center gap-2"><span className="text-zinc-600 text-xs font-bold uppercase">Date:</span> {releaseDate}</p>
                             </div>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                             <div>
                                 <p className="text-xs uppercase font-bold text-zinc-600 mb-1">Track Details</p>
                                 <p className="text-sm text-zinc-300 font-bold">{trackTitle} <span className="text-zinc-500 font-normal">({trackVersion})</span></p>
                                 <p className="text-xs text-zinc-500 mt-1">{trackGenre} • {trackSubGenre}</p>
                                 {trackFeaturingArtist && <p className="text-xs text-zinc-400 mt-1">Feat. {trackFeaturingArtist}</p>}
                             </div>
                              <div>
                                 <p className="text-xs uppercase font-bold text-zinc-600 mb-1">Audio Source</p>
                                 <p className="text-sm text-zinc-300 truncate">{audioFile?.name || initialData?.file_url || 'No File'}</p>
                                 <p className="text-xs text-zinc-500 mt-1">{duration ? `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}` : '0:00'} • {isInstrumental === 'yes' ? 'Instrumental' : 'Vocal'}</p>
                             </div>
                             <div>
                                 <p className="text-xs uppercase font-bold text-zinc-600 mb-1">Distribution</p>
                                 <p className="text-sm text-zinc-300">{selectedPlatforms.length} Stores Selected</p>
                                 <p className="text-xs text-zinc-500 mt-1">Price Tier: {priceTier}</p>
                             </div>
                             <div>
                                 <p className="text-xs uppercase font-bold text-zinc-600 mb-1">Metadata</p>
                                 <p className="text-sm text-zinc-300">{cLineText} / {pLineText}</p>
                                 <p className="text-xs text-zinc-500 mt-1">ISRC: {hasISRC === 'yes' ? isrc : 'Auto-Generate'}</p>
                             </div>
                         </div>
                     </div>
                     
                     <div className="flex items-center gap-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500 text-sm">
                         <div className="w-auto"><Check size={20} /></div>
                         <p>By submitting, you confirm that you have full rights to distribute this content.</p>
                     </div>
                 </div>
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/10">
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={prevStep} 
                    disabled={currentStep === 1 || loading}
                    className={`text-zinc-400 hover:text-white hover:bg-white/5 ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                >
                    <ChevronLeft className="mr-2" size={16} /> Back
                </Button>
                
                {currentStep < 4 ? (
                    <Button 
                        type="button" 
                        onClick={nextStep}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 px-8 rounded-full shadow-lg shadow-indigo-500/20"
                    >
                        Next Step <ChevronRight className="ml-2" size={16} />
                    </Button>
                ) : (
                    <Button 
                        type="button"
                        onClick={(e) => handleSubmit(e, 'pending')} 
                        disabled={loading}
                        className="bg-white text-black hover:bg-emerald-400 hover:text-black font-black uppercase tracking-[0.2em] h-14 px-10 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(52,211,153,0.5)] transition-all text-sm"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <UploadCloud className="mr-2" size={18} />}
                        Confirm Submission
                    </Button>
                )}
            </div>
            
            {/* Artist Details Dialog */}
            <Dialog open={isArtistDialogOpen} onOpenChange={setIsArtistDialogOpen}>
                <DialogContent className="bg-zinc-950 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Add Artist Details</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Enter the artist's name and platform links.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-zinc-400">Artist Name <span className="text-red-500">*</span></Label>
                            <Input value={artistDialogName} onChange={(e) => setArtistDialogName(e.target.value)} placeholder="Artist Name" className="bg-white/5 border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-zinc-400">Spotify Artist ID/Link (Optional)</Label>
                            <Input value={artistDialogSpotify} onChange={(e) => setArtistDialogSpotify(e.target.value)} placeholder="Spotify Link" className="bg-white/5 border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-zinc-400">Apple Music Artist ID/Link (Optional)</Label>
                            <Input value={artistDialogApple} onChange={(e) => setArtistDialogApple(e.target.value)} placeholder="Apple Music Link" className="bg-white/5 border-white/10 text-white" />
                        </div>
                    </div>
                    <DialogFooter>
                         <Button variant="ghost" type="button" onClick={() => setIsArtistDialogOpen(false)} className="text-zinc-400 hover:text-white">Cancel</Button>
                         <Button type="button" onClick={saveArtistDetails} className="bg-indigo-600 hover:bg-indigo-500 text-white">Save Artist</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </form>
    </div>
  )
}
