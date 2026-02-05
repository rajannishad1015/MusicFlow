'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Upload, FileUp, CheckCircle2, AlertTriangle, Download, ArrowLeft } from 'lucide-react'
import { processRoyaltyFile } from './actions'
import { toast } from "sonner"
import Link from 'next/link'

export default function RoyaltyUploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setResult(null)
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setLoading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await processRoyaltyFile(formData)
            setResult(res)
            if (res.failureCount === 0) {
                toast.success(`Successfully processed ${res.successCount} records!`)
            } else {
                toast.warning(`Processed with errors. ${res.successCount} success, ${res.failureCount} failed.`)
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to process file")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
             <div className="flex items-center gap-4">
                <Link href="/dashboard/payouts">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Upload Royalty Report</h1>
                    <p className="text-gray-500 mt-1">Bulk credit user wallets via CSV upload.</p>
                </div>
             </div>

             <div className="grid gap-6 md:grid-cols-2">
                 <Card>
                     <CardHeader>
                         <CardTitle>File Upload</CardTitle>
                         <CardDescription>Upload your monthly royalty CSV.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                         <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-8 flex flex-col items-center text-center space-y-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                             <div className="p-4 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
                                 <FileUp size={32} />
                             </div>
                             <div>
                                 <h3 className="font-semibold">Click to upload or drag and drop</h3>
                                 <p className="text-sm text-gray-500 mt-1">CSV files only (Max 10MB)</p>
                             </div>
                             <input 
                                type="file" 
                                accept=".csv"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" // Hacky overlay for entire zone click
                             />
                             {/* Standard Input Fallback if overlay is tricky with layout, let's stick to standard button inside */}
                             <div className="relative z-10">
                                 <input 
                                    type="file" 
                                    accept=".csv" 
                                    id="file-upload" 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                 />
                                 <label htmlFor="file-upload">
                                    <Button variant="secondary" className="pointer-events-none">Select File</Button>
                                 </label>
                             </div>
                         </div>
                         
                         {file && (
                             <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                 <div className="flex items-center gap-3 overflow-hidden">
                                     <FileUp size={16} className="text-indigo-600 shrink-0" />
                                     <span className="text-sm font-medium truncate">{file.name}</span>
                                     <span className="text-xs text-gray-500 shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                                 </div>
                                 <Button size="sm" onClick={handleUpload} disabled={loading}>
                                     {loading ? "Processing..." : "Process Payouts"}
                                 </Button>
                             </div>
                         )}
                     </CardContent>
                 </Card>

                 <Card>
                     <CardHeader>
                         <CardTitle>CSV Template</CardTitle>
                         <CardDescription>Format your file exactly as shown below.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                         <div className="bg-gray-950 text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                             <div className="text-gray-500 mb-2 select-none"># Header is optional, order matters</div>
                             <div>email,amount,description</div>
                             <div className="text-green-400">artist@example.com,150.00,"Jan 2024 Royalties"</div>
                             <div className="text-green-400">band@music.com,1250.50,"Q1 Earnings"</div>
                         </div>
                         <Button variant="outline" className="w-full gap-2" onClick={() => {
                             const csv = "email,amount,description\nartist@example.com,0.00,Royalties"
                             const blob = new Blob([csv], { type: 'text/csv' })
                             const url = window.URL.createObjectURL(blob)
                             const a = document.createElement('a')
                             a.href = url
                             a.download = "royalty_template.csv"
                             a.click()
                         }}>
                             <Download size={16} /> Download Template
                         </Button>
                     </CardContent>
                 </Card>
             </div>

             {result && (
                 <Card className={result.failureCount > 0 ? "border-amber-500/50 bg-amber-500/5" : "border-green-500/50 bg-green-500/5"}>
                     <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                             {result.failureCount === 0 ? (
                                 <CheckCircle2 className="text-green-600" />
                             ) : (
                                 <AlertTriangle className="text-amber-600" />
                             )}
                             Processing Complete
                         </CardTitle>
                     </CardHeader>
                     <CardContent>
                         <div className="flex gap-8 mb-4">
                             <div>
                                 <p className="text-sm text-gray-500">Success</p>
                                 <p className="text-2xl font-bold text-green-600">{result.successCount}</p>
                             </div>
                             <div>
                                 <p className="text-sm text-gray-500">Failed</p>
                                 <p className="text-2xl font-bold text-red-600">{result.failureCount}</p>
                             </div>
                         </div>
                         
                         {result.errors.length > 0 && (
                             <div className="mt-4 p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 max-h-60 overflow-y-auto">
                                 <h4 className="font-semibold mb-2 text-red-600 text-sm">Error Log</h4>
                                 <ul className="space-y-1 text-xs font-mono text-gray-600 dark:text-gray-400">
                                     {result.errors.map((err: string, i: number) => (
                                         <li key={i} className="border-b border-gray-100 dark:border-gray-900 pb-1 last:border-0">{err}</li>
                                     ))}
                                 </ul>
                             </div>
                         )}
                     </CardContent>
                 </Card>
             )}
        </div>
    )
}
