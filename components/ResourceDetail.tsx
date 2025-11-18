'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FileText, Video, Calendar, Eye, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

interface Resource {
  id: string
  title: string
  slug: string
  description: string | null
  content: string
  type: 'article' | 'video'
  video_url: string | null
  thumbnail_url: string | null
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  views_count: number
  published_at: string | null
  created_at: string
}

interface ResourceDetailProps {
  resource: Resource
}

export default function ResourceDetail({ resource }: ResourceDetailProps) {
  // Extraire l'ID de la vidéo YouTube ou Vimeo
  const getVideoId = (url: string | null) => {
    if (!url) return null
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    if (youtubeMatch) {
      return { type: 'youtube', id: youtubeMatch[1] }
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return { type: 'vimeo', id: vimeoMatch[1] }
    }
    
    return null
  }

  const videoInfo = resource.type === 'video' ? getVideoId(resource.video_url) : null

  return (
    <article className="space-y-8">
      {/* Bouton retour */}
      <Link
        href="/ressources"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux ressources
      </Link>

      {/* En-tête */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
            resource.type === 'article'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-purple-100 text-purple-800'
          }`}>
            {resource.type === 'article' ? (
              <FileText className="w-4 h-4" />
            ) : (
              <Video className="w-4 h-4" />
            )}
            {resource.type === 'article' ? 'Article' : 'Vidéo'}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          {resource.title}
        </h1>
        
        {resource.description && (
          <p className="text-xl text-gray-600">
            {resource.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500">
          {resource.published_at && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(resource.published_at), 'dd MMMM yyyy', { locale: fr })}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {resource.views_count || 0} vues
          </div>
        </div>
      </header>

      {/* Image de couverture */}
      {resource.thumbnail_url && (
        <div className="relative w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={resource.thumbnail_url}
            alt={resource.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Vidéo */}
      {resource.type === 'video' && videoInfo && (
        <div className="relative w-full pb-[56.25%] h-0 bg-gray-900 rounded-lg overflow-hidden">
          {videoInfo.type === 'youtube' ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoInfo.id}`}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <iframe
              src={`https://player.vimeo.com/video/${videoInfo.id}`}
              className="absolute top-0 left-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      )}

      {/* Contenu */}
      <div className="prose prose-lg max-w-none">
        {resource.type === 'article' ? (
          <div 
            className="text-gray-700 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: resource.content.replace(/\n/g, '<br />') }}
          />
        ) : (
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {resource.content}
          </div>
        )}
      </div>
    </article>
  )
}

