'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FileText, Video, Search, Filter, Calendar, Eye, Star } from 'lucide-react'
import Link from 'next/link'

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

interface ResourcesListProps {
  initialResources: Resource[]
}

export default function ResourcesList({ initialResources }: ResourcesListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [resources] = useState<Resource[]>(initialResources)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [typeFilter, setTypeFilter] = useState<'all' | 'article' | 'video'>(
    (searchParams.get('type') as any) || 'all'
  )

  const filteredResources = useMemo(() => {
    let filtered = [...resources]

    // Filtrer par type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(r => r.type === typeFilter)
    }

    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        r =>
          r.title.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query) ||
          r.content.toLowerCase().includes(query)
      )
    }

    // Trier : ressources en vedette en premier, puis par date de publication
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
      return dateB - dateA
    })

    return filtered
  }, [resources, typeFilter, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (typeFilter !== 'all') params.set('type', typeFilter)
    if (searchQuery) params.set('search', searchQuery)
    router.push(`/ressources?${params.toString()}`)
  }

  const featuredResources = filteredResources.filter(r => r.featured)
  const regularResources = filteredResources.filter(r => !r.featured)

  return (
    <div className="space-y-8">
      {/* Filtres */}
      <div className="bg-gray-50 rounded-lg p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une ressource..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as any)
                const params = new URLSearchParams()
                params.set('type', e.target.value)
                if (searchQuery) params.set('search', searchQuery)
                router.push(`/ressources?${params.toString()}`)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="article">Articles</option>
              <option value="video">Vidéos</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Ressources en vedette */}
      {featuredResources.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            En vedette
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} featured />
            ))}
          </div>
        </div>
      )}

      {/* Toutes les ressources */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {featuredResources.length > 0 ? 'Toutes les ressources' : 'Ressources'}
        </h2>
        {regularResources.length === 0 && featuredResources.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Aucune ressource trouvée</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ResourceCard({ resource, featured = false }: { resource: Resource; featured?: boolean }) {
  return (
    <Link
      href={`/ressources/${resource.slug}`}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
    >
      {resource.thumbnail_url && (
        <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={resource.thumbnail_url}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {resource.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <Video className="w-12 h-12 text-white" />
            </div>
          )}
          {featured && (
            <div className="absolute top-2 right-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            resource.type === 'article'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-purple-100 text-purple-800'
          }`}>
            {resource.type === 'article' ? (
              <FileText className="w-3 h-3" />
            ) : (
              <Video className="w-3 h-3" />
            )}
            {resource.type === 'article' ? 'Article' : 'Vidéo'}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
          {resource.title}
        </h3>
        {resource.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {resource.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {resource.published_at && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(resource.published_at), 'dd MMM yyyy', { locale: fr })}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {resource.views_count || 0} vues
          </div>
        </div>
      </div>
    </Link>
  )
}

