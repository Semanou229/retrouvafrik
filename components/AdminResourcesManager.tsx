'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  FileText,
  Video,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Loader2,
  Calendar,
  User,
  Star,
  ExternalLink,
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  slug: string
  description: string | null
  content: string
  type: 'article' | 'video'
  video_url: string | null
  thumbnail_url: string | null
  author_id: string | null
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  views_count: number
  published_at: string | null
  created_at: string
  updated_at: string
}

interface AdminResourcesManagerProps {
  initialResources: Resource[]
}

export default function AdminResourcesManager({
  initialResources,
}: AdminResourcesManagerProps) {
  const router = useRouter()
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'article' | 'video'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const supabase = createSupabaseClient()

  const filteredResources = useMemo(() => {
    let filtered = [...resources]

    if (typeFilter !== 'all') {
      filtered = filtered.filter(r => r.type === typeFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        r =>
          r.title.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query) ||
          r.content.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [resources, typeFilter, statusFilter, searchQuery])

  const handleCreate = () => {
    setEditingResource(null)
    setIsModalOpen(true)
  }

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('resources')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setResources(resources.filter(r => r.id !== id))
      setSuccess('Ressource supprimée avec succès !')
      setTimeout(() => setSuccess(null), 3000)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression')
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (resource: Resource) => {
    setIsLoading(true)
    setError(null)

    try {
      const newStatus = resource.status === 'published' ? 'draft' : 'published'
      const updateData: any = { status: newStatus }
      
      if (newStatus === 'published' && !resource.published_at) {
        updateData.published_at = new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('resources')
        .update(updateData)
        .eq('id', resource.id)

      if (updateError) throw updateError

      setResources(resources.map(r => 
        r.id === resource.id 
          ? { ...r, status: newStatus, published_at: updateData.published_at || r.published_at }
          : r
      ))
      setSuccess(`Ressource ${newStatus === 'published' ? 'publiée' : 'dépubliée'} avec succès !`)
      setTimeout(() => setSuccess(null), 3000)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour')
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFeatured = async (resource: Resource) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('resources')
        .update({ featured: !resource.featured })
        .eq('id', resource.id)

      if (updateError) throw updateError

      setResources(resources.map(r => 
        r.id === resource.id ? { ...r, featured: !r.featured } : r
      ))
      setSuccess(`Ressource ${!resource.featured ? 'mise en vedette' : 'retirée de la vedette'} !`)
      setTimeout(() => setSuccess(null), 3000)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour')
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Ressources</h1>
          <p className="text-gray-600 mt-1">Gérez les articles de blog et les vidéos</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle ressource
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Recherche */}
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

          {/* Filtre type */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="article">Articles</option>
              <option value="video">Vidéos</option>
            </select>
          </div>

          {/* Filtre statut */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillons</option>
              <option value="published">Publiés</option>
              <option value="archived">Archivés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des ressources */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ressource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Aucune ressource trouvée
                  </td>
                </tr>
              ) : (
                filteredResources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {resource.thumbnail_url && (
                          <img
                            src={resource.thumbnail_url}
                            alt={resource.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{resource.title}</p>
                            {resource.featured && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          {resource.description && (
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {resource.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        resource.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : resource.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {resource.status === 'published' ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        {resource.status === 'published' ? 'Publié' : resource.status === 'draft' ? 'Brouillon' : 'Archivé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.views_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.published_at
                        ? format(new Date(resource.published_at), 'dd MMM yyyy', { locale: fr })
                        : format(new Date(resource.created_at), 'dd MMM yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {resource.status === 'published' && (
                          <a
                            href={`/ressources/${resource.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-dark"
                            title="Voir"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleToggleFeatured(resource)}
                          className={`${resource.featured ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
                          title={resource.featured ? 'Retirer de la vedette' : 'Mettre en vedette'}
                        >
                          <Star className={`w-4 h-4 ${resource.featured ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(resource)}
                          className="text-gray-600 hover:text-gray-900"
                          title={resource.status === 'published' ? 'Dépublier' : 'Publier'}
                        >
                          {resource.status === 'published' ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(resource)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(resource.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal pour créer/modifier une ressource */}
      {isModalOpen && (
        <ResourceModal
          resource={editingResource}
          onClose={() => {
            setIsModalOpen(false)
            setEditingResource(null)
          }}
          onSave={() => {
            setIsModalOpen(false)
            setEditingResource(null)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}

// Composant modal pour créer/modifier une ressource
function ResourceModal({
  resource,
  onClose,
  onSave,
}: {
  resource: Resource | null
  onClose: () => void
  onSave: () => void
}) {
  const [formData, setFormData] = useState({
    title: resource?.title || '',
    slug: resource?.slug || '',
    description: resource?.description || '',
    content: resource?.content || '',
    type: resource?.type || 'article' as 'article' | 'video',
    video_url: resource?.video_url || '',
    thumbnail_url: resource?.thumbnail_url || '',
    status: resource?.status || 'draft' as 'draft' | 'published' | 'archived',
    featured: resource?.featured || false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseClient()
  const router = useRouter()

  // Générer le slug automatiquement depuis le titre
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Vous devez être connecté')

      const resourceData: any = {
        ...formData,
        author_id: user.id,
        slug: formData.slug || generateSlug(formData.title),
      }

      if (resourceData.status === 'published' && !resource?.published_at) {
        resourceData.published_at = new Date().toISOString()
      }

      if (resource) {
        // Mise à jour
        const { error: updateError } = await supabase
          .from('resources')
          .update(resourceData)
          .eq('id', resource.id)

        if (updateError) throw updateError
      } else {
        // Création
        const { error: insertError } = await supabase
          .from('resources')
          .insert([resourceData])

        if (insertError) throw insertError
      }

      onSave()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {resource ? 'Modifier la ressource' : 'Nouvelle ressource'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de ressource *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="article"
                    checked={formData.type === 'article'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'article' | 'video' })}
                    className="w-4 h-4"
                  />
                  <FileText className="w-5 h-5" />
                  <span>Article</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="video"
                    checked={formData.type === 'video'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'article' | 'video' })}
                    className="w-4 h-4"
                  />
                  <Video className="w-5 h-5" />
                  <span>Vidéo</span>
                </label>
              </div>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="exemple-article"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Contenu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.type === 'article' ? 'Contenu de l\'article *' : 'Description de la vidéo *'}
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* URL vidéo (si vidéo) */}
            {formData.type === 'video' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la vidéo (YouTube/Vimeo) *
                </label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  required={formData.type === 'video'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            )}

            {/* Image de couverture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'image de couverture
              </label>
              <input
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>

            {/* Mise en vedette */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Mettre en vedette
              </label>
            </div>

            {/* Boutons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {resource ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

