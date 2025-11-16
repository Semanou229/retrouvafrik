'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, Filter, X } from 'lucide-react'

interface SearchFormProps {
  initialParams?: {
    type?: string
    urgency?: string
    status?: string
    query?: string
  }
}

export default function SearchForm({ initialParams }: SearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialParams?.query || '')
  const [type, setType] = useState(initialParams?.type || '')
  const [urgency, setUrgency] = useState(initialParams?.urgency || '')
  const [showFilters, setShowFilters] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (query) params.set('query', query)
    if (type) params.set('type', type)
    if (urgency) params.set('urgency', urgency)
    
    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    setQuery('')
    setType('')
    setUrgency('')
    router.push('/search')
  }

  const hasFilters = type || urgency || query

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom, ville, description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Filter toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>Filtres</span>
          {hasFilters && (
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              {[type, urgency].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Submit button */}
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Rechercher
        </button>

        {/* Clear filters */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Réinitialiser</span>
          </button>
        )}
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'annonce
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Tous</option>
              <option value="person">Personnes disparues</option>
              <option value="animal">Animaux perdus</option>
              <option value="object">Objets perdus</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Tous</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </div>
      )}
    </form>
  )
}

