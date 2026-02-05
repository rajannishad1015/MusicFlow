'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"

interface ExportButtonProps {
  data: any[]
}

export default function ExportButton({ data }: ExportButtonProps) {
  const handleExport = () => {
    try {
        if (!data || data.length === 0) {
            toast.error("No data available to export")
            return
        }

        const headers = ["ID", "Date", "Description", "Amount (USD)"]
        const csvContent = [
            headers.join(","),
            ...data.map(row => [
                row.id,
                new Date(row.created_at).toISOString(),
                `"${row.description || ''}"`,
                row.amount
            ].join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `revenue_report_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.success("Report downloaded successfully")
    } catch (error) {
        toast.error("Failed to generate report")
        console.error(error)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} className="gap-2 bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white">
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  )
}
