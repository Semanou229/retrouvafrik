'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Shield,
  Search,
  Filter,
  AlertTriangle,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import type { Announcement } from '@/lib/types'

interface AdminAnnouncementsManagerProps {
  initialAnnouncements: any[]
}

export default function AdminAnnouncementsManager({
  initialAnnouncements,
}: AdminAnnouncementsManagerProps) {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'hidden' | 'verified'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const supabase = createSupabaseClient()

  const filteredAnnouncements = useMemo(() => {
    let filtered = [...announcements]

    if (statusFilter === 'pending') {
      filtered = filtered.filter(a => !a.approved)
    } else if (statusFilter === 'hidden') {
      filtered = filtered.filter(a => a.hidden)
    } else if (statusFilter === 'verified') {
      filtered = filtered.filter(a => a.verified)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        a =>
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.contact_email.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [announcements, statusFilter, searchQuery])

  const handleApprove = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('announcements')
        .update({ approved: true })
        .eq('id', id)

      if (updateError) throw updateError

      setAnnouncements(announcements.map(a => (a.id === id ? { ...a, approved: true } : a)))
      setSuccess('Annonce approuvée avec succès !')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'approbation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('announcements')
        .update({ approved: false })
        .eq('id', id)

      if (updateError) throw updateError

      setAnnouncements(announcements.map(a => (a.id === id ? { ...a, approved: false } : a)))
      setSuccess('Annonce refusée avec succès !')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du refus')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleVerified = async (id: string) => {
    const announcement = announcements.find(a => a.id === id)
    if (!announcement) return

    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('announcements')
        .update({ verified: !announcement.verified })
        .eq('id', id)

      if (updateError) throw updateError

      setAnnouncements(
        announcements.map(a => (a.id === id ? { ...a, verified: !a.verified } : a))
      )
      setSuccess(`Badge de vérification ${!announcement.verified ? 'ajouté' : 'retiré'} !`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleHidden = async (id: string) => {
    const announcement = announcements.find(a => a.id === id)
    if (!announcement) return

    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('announcements')
        .update({ hidden: !announcement.hidden })
        .eq('id', id)

      if (updateError) throw updateError

      setAnnouncements(
        announcements.map(a => (a.id === id ? { ...a, hidden: !a.hidden } : a))
      )
      setSuccess(`Annonce ${!announcement.hidden ? 'masquée' : 'démasquée'} !`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotes = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('announcements')
        .update({ admin_notes: adminNotes })
        .eq('id', id)

      if (updateError) throw updateError

      setAnnouncements(announcements.map(a => (a.id === id ? { ...a, admin_notes: adminNotes } : a)))
      setEditingNotes(null)
      setAdminNotes('')
      setSuccess('Notes enregistrées !')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return

    setIsLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase.from('announcements').delete().eq('id', id)

      if (deleteError) throw deleteError

      setAnnouncements(announcements.filter(a => a.id !== id))
      setSuccess('Annonce supprimée avec succès !')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Gestion des annonces</h1>
            </div>
            <p className="text-orange-100">Approuvez, vérifiez et gérez toutes les annonces</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une annonce..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Toutes' },
              { value: 'pending', label: 'En attente' },
              { value: 'verified', label: 'Vérifiées' },
              { value: 'hidden', label: 'Masquées' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === option.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des annonces */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6">
          <div className="space-y-4">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`border rounded-xl p-6 ${
                    announcement.hidden
                      ? 'border-red-200 bg-red-50/50'
                      : announcement.verified
                      ? 'border-green-200 bg-green-50/50'
                      : !announcement.approved
                      ? 'border-yellow-200 bg-yellow-50/50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          href={`/annonces/${announcement.id}`}
                          className="text-xl font-bold hover:text-primary transition-colors"
                        >
                          {announcement.title}
                        </Link>
                        {announcement.verified && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Vérifiée
                          </span>
                        )}
                        {announcement.hidden && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                            <EyeOff className="w-3 h-3" />
                            Masquée
                          </span>
                        )}
                        {!announcement.approved && (
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            En attente
                          </span>
                        )}
                        {announcement.urgency === 'urgent' && (
                          <span className="bg-primary text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2 line-clamp-2">{announcement.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          {format(new Date(announcement.created_at), 'd MMM yyyy', { locale: fr })}
                        </span>
                        <span>•</span>
                        <span>{(announcement.user as any)?.email || 'Utilisateur anonyme'}</span>
                        <span>•</span>
                        <span>{announcement.views_count || 0} vues</span>
                      </div>
                      {announcement.admin_notes && (
                        <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Notes admin :</p>
                          <p className="text-sm text-gray-600">{announcement.admin_notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {!announcement.approved ? (
                        <button
                          onClick={() => handleApprove(announcement.id)}
                          disabled={isLoading}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                          title="Approuver"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReject(announcement.id)}
                          disabled={isLoading}
                          className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                          title="Refuser"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleVerified(announcement.id)}
                        disabled={isLoading}
                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                          announcement.verified
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        title={announcement.verified ? 'Retirer le badge' : 'Ajouter le badge'}
                      >
                        <Shield className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleToggleHidden(announcement.id)}
                        disabled={isLoading}
                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                          announcement.hidden
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        title={announcement.hidden ? 'Démasquer' : 'Masquer'}
                      >
                        {announcement.hidden ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditingNotes(announcement.id)
                          setAdminNotes(announcement.admin_notes || '')
                        }}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        title="Ajouter des notes"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        disabled={isLoading}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Formulaire de notes */}
                  {editingNotes === announcement.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Ajouter des notes pour cette annonce..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveNotes(announcement.id)}
                          disabled={isLoading}
                          className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enregistrer'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingNotes(null)
                            setAdminNotes('')
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Aucune annonce trouvée</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

