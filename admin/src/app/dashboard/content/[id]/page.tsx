import { getTrackDetails } from './actions'
import { notFound } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Check, X, ArrowLeft, Calendar, Mic, Disc, FileText, Globe, DollarSign } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import AudioPlayer from '@/components/admin/audio-player'
import AdminNotes from '@/components/admin/admin-notes'
import { updateTrackStatus } from '../actions' // Reusing from list view actions
import { format } from 'date-fns'
import MetadataEditor from '@/components/admin/metadata-editor'

export default async function TrackReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { track, notes } = await getTrackDetails(id)

    if (!track) return notFound()

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
             {/* Header */}
             <div className="flex items-center justify-between mb-6 shrink-0">
                  <div className="flex items-center gap-4">
                      <Link href="/dashboard/content" className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
                          <ArrowLeft size={20} />
                      </Link>
                      <div>
                          <div className="flex items-center gap-3">
                              <h1 className="text-2xl font-black text-white tracking-tight">{track.title}</h1>
                              <Badge variant="outline" className={`
                                  ${track.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                    track.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}
                                  uppercase tracking-widest text-[10px] h-5
                              `}>
                                  {track.status}
                              </Badge>
                          </div>
                          <p className="text-zinc-500 text-sm font-medium flex items-center gap-2">
                              {track.profiles?.artist_name} • {track.albums?.title}
                          </p>
                      </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                        {/* Actions Component would go here, simpler to just implement basic buttons for now or client component */}
                        <ActionButtons track={track} />
                  </div>
             </div>

             {/* Split Layout */}
             <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
                  
                  {/* Left Panel: Media & Analysis (Scrollable independently ideally, but strict grid is fine) */}
                  <div className="col-span-4 flex flex-col gap-6 overflow-y-auto h-full pr-2">
                       {/* Audio Player */}
                       <AudioPlayer url={track.file_url} title={track.title} />

                       {/* Cover Art */}
                       <Card className="bg-white/[0.03] border-white/5 backdrop-blur-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <Disc size={14} /> Cover Art
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-square relative rounded-xl overflow-hidden border border-white/5 group">
                                     <Image 
                                        src={track.albums?.cover_art_url || '/placeholder.png'} 
                                        alt="Cover" 
                                        fill 
                                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                                     />
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                     <div className="bg-white/5 rounded-lg p-3">
                                         <span className="text-[10px] text-zinc-500 uppercase font-bold block">Resolution</span>
                                         <span className="text-sm font-mono text-zinc-300">3000 x 3000</span>
                                     </div>
                                     <div className="bg-white/5 rounded-lg p-3">
                                         <span className="text-[10px] text-zinc-500 uppercase font-bold block">Format</span>
                                         <span className="text-sm font-mono text-zinc-300">JPG</span>
                                     </div>
                                </div>
                            </CardContent>
                       </Card>

                       {/* Admin Notes */}
                       <Card className="bg-white/[0.03] border-white/5 backdrop-blur-xl flex-1 min-h-[300px]">
                           <CardContent className="h-full pt-6">
                               <AdminNotes trackId={track.id} notes={notes || []} />
                           </CardContent>
                       </Card>
                  </div>

                  {/* Right Panel: Metadata (Scrollable) */}
                  <div className="col-span-8 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                       <Tabs defaultValue="metadata" className="flex-1 flex flex-col">
                            <div className="px-6 pt-6 pb-2 border-b border-white/5">
                                <TabsList className="bg-zinc-900/50 border border-white/5 h-10 p-1">
                                    <TabsTrigger value="metadata" className="text-xs uppercase font-bold tracking-wider data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Metadata</TabsTrigger>
                                    <TabsTrigger value="credits" className="text-xs uppercase font-bold tracking-wider data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Credits</TabsTrigger>
                                    <TabsTrigger value="legal" className="text-xs uppercase font-bold tracking-wider data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Legal & Rights</TabsTrigger>
                                    <TabsTrigger value="json" className="text-xs uppercase font-bold tracking-wider data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Raw JSON</TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                 <TabsContent value="metadata" className="space-y-8 mt-0">
                                     <MetadataEditor track={track} />
                                 </TabsContent>

                                 <TabsContent value="credits" className="space-y-8 mt-0">
                                     <Section title="Artists" icon={Mic}>
                                         <GridItem label="Primary Artist" value={track.primary_artist || track.albums?.primary_artist} />
                                         <GridItem label="Featuring" value={track.featuring_artist || track.albums?.featuring_artist || '-'} />
                                     </Section>
                                     <Section title="Contributors" icon={FileText}>
                                         {track.lyricists?.map((l: any, i:number) => (
                                              <GridItem key={i} label="Lyricist" value={`${l.firstName} ${l.lastName}`} />
                                         ))}
                                         {track.composers?.map((c: any, i:number) => (
                                              <GridItem key={i} label="Composer" value={`${c.firstName} ${c.lastName}`} />
                                         ))}
                                         <GridItem label="Producer" value={track.producers || '-'} />
                                     </Section>
                                 </TabsContent>

                                 <TabsContent value="legal" className="space-y-8 mt-0">
                                      <Section title="Copyright" icon={Globe}>
                                          <GridItem label="P Line" value={track.track_p_line || track.albums?.p_line} />
                                          <GridItem label="C Line" value={track.albums?.c_line} />
                                          <GridItem label="Label" value={track.albums?.label_name} />
                                          <GridItem label="Publisher" value={track.publisher} />
                                      </Section>
                                      
                                      <Section title="Distribution" icon={DollarSign}>
                                          <GridItem label="Price Tier" value={track.price_tier} />
                                          <GridItem label="Callertune Timing" value={track.caller_tune_timing || '-'} />
                                          <GridItem label="Platforms" value={track.albums?.target_platforms?.join(", ") || 'All'} fullWidth />
                                      </Section>
                                 </TabsContent>

                                 <TabsContent value="json" className="mt-0">
                                      <pre className="bg-zinc-950 p-4 rounded-xl text-[10px] text-green-400 font-mono overflow-auto border border-white/10">
                                          {JSON.stringify(track, null, 2)}
                                      </pre>
                                 </TabsContent>
                            </div>
                       </Tabs>
                  </div>
             </div>
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

function GridItem({ label, value, fontMono, isBadge, badgeColor, fullWidth }: { label: string, value: any, fontMono?: boolean, isBadge?: boolean, badgeColor?: string, fullWidth?: boolean }) {
    return (
        <div className={fullWidth ? 'col-span-full' : ''}>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">{label}</span>
            {isBadge ? (
                <Badge variant="outline" className={`h-5 ${badgeColor === 'red' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                    {value}
                </Badge>
            ) : (
                <span className={`text-sm text-zinc-200 font-medium ${fontMono ? 'font-mono' : ''}`}>
                    {value || '-'}
                </span>
            )}
        </div>
    )
}

import ActionButtons from './client-actions'
