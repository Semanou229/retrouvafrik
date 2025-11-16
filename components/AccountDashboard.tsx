'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  FileText,
  Eye,
  MessageCircle,
  Info,
  CheckCircle,
  Archive,
  Trash2,
  Plus,
  TrendingUp,
  User,
  Settings,
  Edit,
  Mail,
  MapPin,
  HelpCircle,
} from 'lucide-react'
import Link from 'next/link'
import type { Announcement, Comment, Report, Message, SupportTicket } from '@/lib/types'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import EditAnnouncementModal from './EditAnnouncementModal'
import { getFirstName, getGreetingMessage } from '@/lib/utils'

interface AccountDashboardProps {
  announcements: Announcement[]
  comments: Comment[]
  reports: Report[]
  messages: Message[]
  tickets: SupportTicket[]
  stats: {
    totalAnnouncements: number
    activeAnnouncements: number
    resolvedAnnouncements: number
    totalViews: number
    totalComments: number
    totalReports: number
  }
  user: SupabaseUser
}

export default function AccountDashboard({
  announcements,
  comments,
  reports,
  messages,
  tickets,
  stats,
  user,
}: AccountDashboardProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved' | 'archived'>('all')
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const supabase = createSupabaseClient()

  const filteredAnnouncements = announcements.filter((a) => {
    if (filter === 'all') return true
    return a.status === filter
  })

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('announcements')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      router.refresh()
    } else {
      alert('Erreur lors de la mise à jour: ' + error.message)
    }
  }

  const handleMarkAsFound = async (id: string) => {
    if (!confirm('Marquer cette annonce comme "Retrouvé" ? Elle sera archivée et ne sera plus visible publiquement.')) return

    const { error } = await supabase
      .from('announcements')
      .update({ status: 'resolved' })
      .eq('id', id)

    if (!error) {
      router.refresh()
    } else {
      alert('Erreur lors de la mise à jour: ' + error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.')) return

    const { error } = await supabase.from('announcements').delete().eq('id', id)

    if (!error) {
      router.refresh()
    } else {
      alert('Erreur lors de la suppression: ' + error.message)
    }
  }

  const firstName = getFirstName(user)
  const greetingMessage = getGreetingMessage(firstName)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <User className="w-6 h-6 sm:w-8 sm:h-8" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Mon tableau de bord</h1>
            </div>
            <p className="text-orange-100 text-sm sm:text-base md:text-lg">{greetingMessage}</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Annonces publiées</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalAnnouncements}</p>
            </div>
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Vues totales</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.totalViews}</p>
            </div>
            <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-primary flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Commentaires reçus</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalComments}</p>
            </div>
            <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Annonces résolues</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.resolvedAnnouncements}</p>
            </div>
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary flex-shrink-0 ml-2" />
          </div>
        </div>
      </div>

      {/* My Announcements */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold">Mes annonces</h2>
            <Link
              href="/publier"
              className="flex items-center justify-center gap-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Publier une annonce</span>
              <span className="sm:hidden">Publier</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'Toutes' },
              { value: 'active', label: 'En cours' },
              { value: 'resolved', label: 'Résolues' },
              { value: 'archived', label: 'Archivées' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as any)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Announcements list */}
        <div className="p-4 sm:p-6">
          {filteredAnnouncements.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <Link
                          href={`/annonces/${announcement.id}`}
                          className="text-base sm:text-lg md:text-xl font-bold hover:text-primary transition-colors break-words"
                        >
                          {announcement.title}
                        </Link>
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            announcement.status === 'active'
                              ? 'bg-primary/10 text-primary-dark'
                              : announcement.status === 'resolved'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {announcement.status === 'active'
                            ? 'En cours'
                            : announcement.status === 'resolved'
                            ? 'Résolue'
                            : 'Archivée'}
                        </span>
                        {announcement.urgency === 'urgent' && (
                          <span className="bg-primary text-white px-3 py-1 rounded-lg text-xs font-semibold">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">{announcement.description}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
                        <span>
                          {format(new Date(announcement.created_at), 'd MMM yyyy', { locale: fr })}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span>{announcement.views_count || 0} vues</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="capitalize">{announcement.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-6 flex-shrink-0">
                      <button
                        onClick={() => setEditingAnnouncement(announcement)}
                        className="p-2 sm:p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      {announcement.status === 'active' && (
                        <button
                          onClick={() => handleMarkAsFound(announcement.id)}
                          className="p-2 sm:p-3 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Marquer comme Retrouvé"
                        >
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(announcement.id, 'archived')}
                        className="p-2 sm:p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Archiver"
                      >
                        <Archive className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="p-2 sm:p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4 font-semibold">
                {filter === 'all'
                  ? "Vous n'avez pas encore publié d'annonce."
                  : `Aucune annonce ${filter === 'active' ? 'en cours' : filter === 'resolved' ? 'résolue' : 'archivée'}.`}
              </p>
              {filter === 'all' && (
                <Link
                  href="/publier"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Publier ma première annonce
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages History */}
      {messages && messages.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold">Historique de messages reçus</h2>
              <Link
                href="/messages"
                className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center gap-1"
              >
                <span className="hidden sm:inline">Voir tous les messages</span>
                <span className="sm:hidden">Voir tout</span>
                <MessageCircle className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {messages.slice(0, 10).map((message) => {
                const announcement = (message as any).announcement
                const sender = (message as any).sender
                return (
                  <div
                    key={message.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <Link
                            href={`/annonces/${message.announcement_id}`}
                            className="font-semibold hover:text-primary transition-colors"
                          >
                            {announcement?.title || 'Annonce supprimée'}
                          </Link>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">De:</span> {sender?.email || 'Utilisateur anonyme'}
                        </p>
                        <p className="text-sm text-gray-700 mb-2 line-clamp-2">{message.content}</p>
                        {message.photo_url && (
                          <div className="mb-2">
                            <span className="text-xs text-gray-500">📷 Photo jointe</span>
                          </div>
                        )}
                        {message.location && (
                          <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>Localisation partagée</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          {format(new Date(message.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}
                          {!message.is_read && (
                            <span className="ml-2 bg-primary text-white px-2 py-0.5 rounded-full text-xs">
                              Non lu
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {messages.length > 10 && (
              <div className="mt-4 text-center">
                <Link
                  href="/messages"
                  className="text-primary hover:text-primary-dark font-semibold text-sm"
                >
                  Voir {messages.length - 10} message{messages.length - 10 > 1 ? 's' : ''} de plus
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Reports */}
      {reports.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold">Mes signalements</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold mb-1">
                        {(report as any).announcement?.title || 'Annonce supprimée'}
                      </p>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{report.description}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(report.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mes tickets de support */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold">Mes tickets de support</h2>
            <Link
              href="/support"
              className="flex items-center justify-center gap-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouveau ticket</span>
              <span className="sm:hidden">Nouveau</span>
            </Link>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {tickets.length > 0 ? (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="font-semibold text-base sm:text-lg break-words">{ticket.subject}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                            ticket.status === 'open'
                              ? 'bg-blue-500'
                              : ticket.status === 'in_progress'
                              ? 'bg-yellow-500'
                              : ticket.status === 'resolved'
                              ? 'bg-green-500'
                              : 'bg-gray-500'
                          }`}
                        >
                          {ticket.status === 'open'
                            ? 'Ouvert'
                            : ticket.status === 'in_progress'
                            ? 'En cours'
                            : ticket.status === 'resolved'
                            ? 'Résolu'
                            : 'Fermé'}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                            ticket.priority === 'urgent'
                              ? 'bg-red-500'
                              : ticket.priority === 'high'
                              ? 'bg-orange-500'
                              : ticket.priority === 'normal'
                              ? 'bg-blue-500'
                              : 'bg-gray-500'
                          }`}
                        >
                          {ticket.priority === 'urgent'
                            ? 'Urgent'
                            : ticket.priority === 'high'
                            ? 'Élevée'
                            : ticket.priority === 'normal'
                            ? 'Normale'
                            : 'Faible'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          {ticket.type === 'technical'
                            ? '🔧 Problème technique'
                            : ticket.type === 'announcement_review'
                            ? '📋 Vérification d\'annonce'
                            : ticket.type === 'modification_request'
                            ? '✏️ Demande de modification'
                            : '🛡️ Fraude'}
                        </span>
                        <span>•</span>
                        <span>
                          {format(new Date(ticket.created_at), 'd MMM yyyy', { locale: fr })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">Vous n'avez pas encore de ticket de support.</p>
              <Link
                href="/support"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                Créer un ticket
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingAnnouncement && (
        <EditAnnouncementModal
          announcement={editingAnnouncement}
          onClose={() => setEditingAnnouncement(null)}
        />
      )}
    </div>
  )
}
