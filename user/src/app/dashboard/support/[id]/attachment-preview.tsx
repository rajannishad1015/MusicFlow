'use client'

import { useState } from 'react'
import { FileIcon, ExternalLink } from 'lucide-react'

interface AttachmentPreviewProps {
  url: string
}

export default function AttachmentPreview({ url }: AttachmentPreviewProps) {
  const [hasError, setHasError] = useState(false)

  if (!url) return null

  const isImage = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i) != null
  }

  // If it's not an image extension or we've detected an error loading it as an image
  if (!isImage(url) || hasError) {
    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-xs bg-black/20 p-2 rounded hover:bg-black/30 transition-colors"
        >
            <FileIcon className="w-4 h-4" />
            <span>View Attachment</span>
        </a>
    )
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block max-w-xs group/img relative overflow-hidden rounded-lg">
      <img 
        src={url} 
        alt="Attachment" 
        className="w-full h-auto object-cover transition-transform group-hover/img:scale-105"
        onError={() => setHasError(true)}
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
        <ExternalLink size={16} />
      </div>
    </a>
  )
}
