'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, ChevronDown, CheckCircle, Upload, DollarSign, AlertTriangle, FileText } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function FAQPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent flex items-center gap-3">
                    <HelpCircle size={32} className="text-indigo-400" />
                    Help & Documentation
                </h1>
                <p className="text-zinc-400 mt-2 max-w-2xl">
                    Everything you need to know about distributing your music, managing your account, and getting paid.
                </p>
            </div>

            {/* Quick Links / Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CategoryCard icon={Upload} title="Uploading" description="Formats, covers, and metadata" />
                <CategoryCard icon={CheckCircle} title="Distribution" description="Stores, timing, and takedowns" />
                <CategoryCard icon={DollarSign} title="Royalties" description="Payments and banking" />
                <CategoryCard icon={AlertTriangle} title="Troubleshooting" description="Common issues and fixes" />
            </div>

            {/* FAQs */}
            <div className="space-y-6">
                <Section title="Getting Started & Uploading" icon={Upload}>
                    <FAQItem question="What audio formats do you accept?">
                        We accept high-quality audio files to ensure the best listening experience.
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
                            <li><strong>MP3:</strong> Minimum 320kbps (Recommended)</li>
                            <li><strong>WAV:</strong> 16-bit or 24-bit, 44.1kHz or 48kHz</li>
                            <li><strong>FLAC:</strong> Lossless compression</li>
                        </ul>
                        Files below 128kbps will be automatically rejected.
                    </FAQItem>
                    <FAQItem question="What are the requirements for Cover Art?">
                        Your cover art must meet store standards to avoid rejection:
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
                             <li><strong>Size:</strong> Minimum 3000 x 3000 pixels.</li>
                             <li><strong>Format:</strong> JPG or PNG.</li>
                             <li><strong>Ratio:</strong> Perfect square (1:1).</li>
                             <li><strong>Content:</strong> No blurry images, no URLs, no pricing info, and no third-party logos.</li>
                        </ul>
                    </FAQItem>
                    <FAQItem question="How long does the review process take?">
                        Our review team typically processes uploads within <strong>24-48 hours</strong>. You will receive an email notification once your track is approved or if changes are required.
                    </FAQItem>
                </Section>

                <Section title="Distribution & Stores" icon={CheckCircle}>
                    <FAQItem question="Which platforms will my music be on?">
                        We distribute to all major streaming platforms including Spotify, Apple Music, YouTube Music, Amazon Music, JioSaavn, Gaana, Wynk, Resso, and 150+ others globally.
                    </FAQItem>
                    <FAQItem question="How long does it take to go live on Spotify?">
                        Once approved by us, it usually takes:
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
                            <li><strong>Spotify:</strong> 2-5 days</li>
                            <li><strong>Apple Music:</strong> 1-3 days</li>
                            <li><strong>YouTube Music:</strong> 1-3 days</li>
                            <li><strong>Others:</strong> Up to 7-10 days</li>
                        </ul>
                        We recommend uploading at least 2 weeks in advance for a planned release.
                    </FAQItem>
                    <FAQItem question="Can I take down my music later?">
                        Yes. You can request a takedown from the "My Uploads" page. Takedowns typically take 1-2 weeks to reflect across all platforms.
                    </FAQItem>
                </Section>

                <Section title="Earnings & Payments" icon={DollarSign}>
                    <FAQItem question="When do I get paid?">
                        Royalties are reported monthly with a lag of 2-3 months (industry standard). For example, earnings from January are usually reported and available for withdrawal in April.
                    </FAQItem>
                    <FAQItem question="What is the minimum withdrawal amount?">
                        The minimum withdrawal threshold is <strong>$50</strong> (or equivalent in your currency).
                    </FAQItem>
                    <FAQItem question="How do I add my bank details?">
                        Go to <strong>Settings &gt; Finance</strong> to add your bank account or PayPal details. Ensure your name matches the legal name on your account.
                    </FAQItem>
                </Section>
            </div>

            {/* Support CTA */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                    <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Can't find the answer?</h3>
                <p className="text-zinc-400 max-w-lg mx-auto">
                    Our support team is here to help. Create a ticket and we'll get back to you as soon as possible.
                </p>
                <Link href="/dashboard/support">
                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
                        Contact Support
                    </Button>
                </Link>
            </div>
        </div>
    )
}

function CategoryCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <Card className="bg-white/5 border-white/5 hover:bg-white/10 transition-colors cursor-default">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="p-3 bg-zinc-900 rounded-full text-indigo-400">
                    <Icon size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-white">{title}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}

function Section({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <Icon size={20} className="text-zinc-500" />
                {title}
            </h3>
            <div className="grid gap-3">
                {children}
            </div>
        </div>
    )
}

function FAQItem({ question, children }: { question: string, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-medium text-zinc-200">{question}</span>
                <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-4 pb-4 pt-0 text-sm text-zinc-400 leading-relaxed border-t border-white/5 mt-2 pt-4">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
