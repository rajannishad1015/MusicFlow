'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Check, X, Pencil, Mic, Disc, FileText, Loader2 } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { format } from 'date-fns'
import { updateTrackMetadata } from '@/app/dashboard/content/[id]/actions'
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { GENRES, LANGUAGES, VERSION_TYPES } from "@/utils/constants"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  genre: z.string().min(1, "Genre is required"),
  sub_genre: z.string().optional(),
  language: z.string().min(1, "Language is required"),
  is_explicit: z.boolean().default(false),
  isrc: z.string().regex(/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/, { message: "Invalid ISRC format (e.g. USABC1234567)" }).optional().or(z.literal('')),
  version_type: z.string().optional(),
})

interface MetadataEditorProps {
    track: any
}

export default function MetadataEditor({ track }: MetadataEditorProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: track.title || '',
            genre: track.genre || '',
            sub_genre: track.sub_genre || '',
            language: track.language || '',
            is_explicit: track.is_explicit || false,
            isrc: track.isrc || '',
            version_type: track.version_type || '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            await updateTrackMetadata(track.id, values)
            toast.success("Metadata updated successfully")
            setIsEditing(false)
            // Ideally we'd refresh logic or rely on Next.js revalidatePath
        } catch (error: any) {
            toast.error("Failed to update: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    const cancelEdit = () => {
        form.reset()
        setIsEditing(false)
    }

    return (
        <div className="relative">
             <div className="absolute top-0 right-0 z-10">
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={cancelEdit} disabled={loading}>
                            <X size={14} className="mr-2" /> Cancel
                        </Button>
                        <Button size="sm" onClick={form.handleSubmit(onSubmit)} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                            {loading ? <Loader2 size={14} className="animate-spin mr-2" /> : <Check size={14} className="mr-2" />}
                            Save
                        </Button>
                    </div>
                ) : (
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white">
                        <Pencil size={14} className="mr-2" /> Edit Metadata
                    </Button>
                )}
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-0">
                    <Section title="Track Details" icon={Mic}>
                        <GridItem label="Title">
                            {isEditing ? (
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input {...field} className="bg-zinc-900 border-white/10 h-8 font-semibold" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <span className="text-sm text-zinc-200 font-medium">{track.title}</span>
                            )}
                        </GridItem>
                        
                        <GridItem label="Version">
                            {isEditing ? (
                                <FormField
                                    control={form.control}
                                    name="version_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-zinc-900 border-white/10 h-8">
                                                        <SelectValue placeholder="Select Version Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {VERSION_TYPES.map(type => (
                                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                 <span className="text-sm text-zinc-200 font-medium">{track.version_type || 'Original'}</span>
                            )}
                        </GridItem>

                        <GridItem label="Genre">
                            {isEditing ? (
                                <FormField
                                    control={form.control}
                                    name="genre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-zinc-900 border-white/10 h-8">
                                                        <SelectValue placeholder="Select Genre" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="max-h-[300px]">
                                                    {GENRES.map(g => (
                                                        <SelectItem key={g} value={g}>{g}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <span className="text-sm text-zinc-200 font-medium">{track.genre}</span>
                            )}
                        </GridItem>

                        <GridItem label="Sub Genre">
                            {isEditing ? (
                                <FormField
                                    control={form.control}
                                    name="sub_genre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input {...field} className="bg-zinc-900 border-white/10 h-8" placeholder="e.g. Trap, Indie Pop" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <span className="text-sm text-zinc-200 font-medium">{track.sub_genre || '-'}</span>
                            )}
                        </GridItem>

                        <GridItem label="Language">
                            {isEditing ? (
                                <FormField
                                    control={form.control}
                                    name="language"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-zinc-900 border-white/10 h-8">
                                                        <SelectValue placeholder="Select Language" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="max-h-[300px]">
                                                    {LANGUAGES.map(l => (
                                                        <SelectItem key={l} value={l}>{l}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                 <span className="text-sm text-zinc-200 font-medium">{track.language}</span>
                            )}
                        </GridItem>

                        <GridItem label="Explicit">
                             {isEditing ? (
                                <FormField
                                    control={form.control}
                                    name="is_explicit"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/5 p-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Explicit Content
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                 <Badge variant="outline" className={`h-5 ${track.is_explicit ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                                    {track.is_explicit ? 'Yes' : 'No'}
                                </Badge>
                            )}
                        </GridItem>

                        <GridItem label="ISRC">
                             {isEditing ? (
                                <FormField
                                    control={form.control}
                                    name="isrc"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input {...field} className="bg-zinc-900 border-white/10 h-8 font-mono" placeholder="US..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <span className="text-sm text-zinc-200 font-medium font-mono">{track.isrc || '-'}</span>
                            )}
                        </GridItem>

                        <GridItem label="Duration">
                            <span className="text-sm text-zinc-200 font-medium font-mono">
                                {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                            </span>
                        </GridItem>
                    </Section>

                     {/* Keep other sections read-only for now, can extend similarly */}
                     <Section title="Technical Specs" icon={Disc}>
                        <GridItem label="Format">
                            <span className="text-sm text-zinc-200 font-medium font-mono">{track.encoding || 'MP3'}</span>
                        </GridItem>
                        <GridItem label="Bitrate">
                            <span className="text-sm text-zinc-200 font-medium font-mono">{track.bitrate ? `${track.bitrate} kbps` : '-'}</span>
                        </GridItem>
                        <GridItem label="Sample Rate">
                            <span className="text-sm text-zinc-200 font-medium font-mono">{track.sample_rate ? `${track.sample_rate} Hz` : '-'}</span>
                        </GridItem>
                        <GridItem label="Channels">
                            <span className="text-sm text-zinc-200 font-medium">{track.channels ? (track.channels === 2 ? 'Stereo' : 'Mono') : '-'}</span>
                        </GridItem>
                        <GridItem label="File Size">
                            <span className="text-sm text-zinc-200 font-medium font-mono">{track.file_size ? `${(track.file_size / (1024*1024)).toFixed(2)} MB` : '-'}</span>
                        </GridItem>
                    </Section>
                    
                    <Section title="Album Info" icon={Disc}>
                        <GridItem label="Album Title">
                             <span className="text-sm text-zinc-200 font-medium">{track.albums?.title}</span>
                        </GridItem>
                        <GridItem label="UPC">
                             <span className="text-sm text-zinc-200 font-medium font-mono">{track.albums?.upc || '-'}</span>
                        </GridItem>
                        <GridItem label="Release Date">
                            <span className="text-sm text-zinc-200 font-medium">{track.albums?.release_date ? format(new Date(track.albums.release_date), 'PPP') : 'N/A'}</span>
                        </GridItem>
                        <GridItem label="Type">
                             <span className="text-sm text-zinc-200 font-medium">{track.albums?.type}</span>
                        </GridItem>
                    </Section>

                    <Section title="Lyrics" icon={FileText} fullWidth>
                        <p className="text-sm text-zinc-400 whitespace-pre-wrap leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 font-serif">
                            {track.lyrics || 'No lyrics provided.'}
                        </p>
                    </Section>
                </form>
            </Form>
        </div>
    )
}

function Section({ title, icon: Icon, children, fullWidth }: { title: string, icon: any, children: React.ReactNode, fullWidth?: boolean }) {
    return (
        <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Icon size={14} /> {title}
            </h3>
            <div className={`grid ${fullWidth ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'} gap-6`}>
                {children}
            </div>
            <Separator className="mt-8 opacity-10" />
        </div>
    )
}

function GridItem({ label, children }: { label: string, children: React.ReactNode }) {
    return (
        <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">{label}</span>
            {children}
        </div>
    )
}
