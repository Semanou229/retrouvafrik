'use client'

import { Play } from 'lucide-react'

interface VideoEmbedProps {
  url: string
  title?: string
}

// Fonction pour convertir une URL YouTube/Vimeo en URL d'embed
const getEmbedUrl = (url: string): string | null => {
  // YouTube patterns
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  // Vimeo patterns
  const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  return null
}

export default function VideoEmbed({ url, title }: VideoEmbedProps) {
  const embedUrl = getEmbedUrl(url)

  if (!embedUrl) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 text-center">
        <p className="text-gray-600">URL vidéo invalide. Veuillez utiliser une URL YouTube ou Vimeo.</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline mt-2 inline-block"
        >
          Ouvrir le lien
        </a>
      </div>
    )
  }

  const isYouTube = embedUrl.includes('youtube.com')
  const isVimeo = embedUrl.includes('vimeo.com')

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xl">
      <iframe
        src={embedUrl}
        title={title || 'Vidéo'}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      {isYouTube && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
          YouTube
        </div>
      )}
      {isVimeo && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
          Vimeo
        </div>
      )}
    </div>
  )
}

