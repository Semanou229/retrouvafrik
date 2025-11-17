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
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import type { Announcement, Comment, Report, Message, SupportTicket } from '@/lib/types'
import EditAnnouncementModal from './EditAnnouncementModal'

interface UserAccountViewProps {
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
  user: {
    id: string
    email?: string
    user_metadata?: {
      full_name?: string
    }
  }
  isAdminView?: boolean
  adminUserId?: string
}

export default function UserAccountView({
  announcements,
  comments,
  reports,
  messages,
  tickets,
  stats,
  user,
  isAdminView = false,
  adminUserId,
}: UserAccountViewProps) {
  const router = useRouter()
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const supabase = createSupabaseClient()

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return

    try {
      // Si c'est une vue admin, utiliser le client admin pour contourner RLS
      if (isAdminView && adminUserId) {
        // Créer une route API pour la suppression admin
        const response = await fetch(`/api/admin/announcements/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) throw new Error('Erreur lors de la suppression')
      } else {
        const { error } = await supabase.from('announcements').delete().eq('id', id)
        if (error) throw error
      }
      router.refresh()
    } catch (err: any) {
      alert('Erreur lors de la suppression: ' + err.message)
    }
  }

  const handleMarkAsResolved = async (id: string) => {
    try {
      // Si c'est une vue admin, utiliser le client admin pour contourner RLS
      if (isAdminView && adminUserId) {
        const response = await fetch(`/api/admin/announcements/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'resolved' }),
        })
        if (!response.ok) throw new Error('Erreur lors de la mise à jour')
      } else {
        const { error } = await supabase
          .from('announcements')
          .update({ status: 'resolved' })
          .eq('id', id)
        if (error) throw error
      }
      router.refresh()
    } catch (err: any) {
      alert('Erreur lors de la mise à jour: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {isAdminView ? 'Compte utilisateur' : 'Mon compte'}
            </h1>
            <p className="text-gray-600">
              {user.email || 'Utilisateur'} {user.user_metadata?.full_name && `- ${user.user_metadata.full_name}`}
            </p>
          </div>
          {isAdminView && (
            <Link
              href="/admin/utilisateurs"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
          )}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Annonces</p>
                <p className="text-2xl font-bold text-primary">{stats.totalAnnouncements}</p>
              </div>
              <FileText className="w-8 h-8 text-primary/50" />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Résolues</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolvedAnnouncements}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500/50" />
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vues</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalViews}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500/50" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-purple-600">{messages.length}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-purple-500/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Mes annonces */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Mes annonces ({announcements.length})
            </h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="font-semibold text-base sm:text-lg break-words">{announcement.title}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                            announcement.status === 'active'
                              ? 'bg-green-500'
                              : announcement.status === 'resolved'
                              ? 'bg-blue-500'
                              : 'bg-gray-500'
                          }`}
                        >
                          {announcement.status === 'active'
                            ? 'Active'
                            : announcement.status === 'resolved'
                            ? 'Résolue'
                            : 'Archivée'}
                        </span>
                        {!announcement.approved && (
                          <span className="px-2 py-1 rounded text-xs font-semibold text-white bg-yellow-500">
                            En attente
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2 line-clamp-2">{announcement.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          {format(new Date(announcement.created_at), 'd MMM yyyy', { locale: fr })}
                        </span>
                        <span>•</span>
                        <span>{announcement.views_count || 0} vues</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Link
                        href={`/annonces/${announcement.id}`}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Voir l'annonce"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      {announcement.status === 'active' && (
                        <>
                          <button
                            onClick={() => setEditingAnnouncement(announcement)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleMarkAsResolved(announcement.id)}
                            className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                            title="Marquer comme résolu"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucune annonce pour le moment
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Messages ({messages.length})
            </h2>
            {isAdminView && messages.length > 0 && (
              <Link
                href={`/admin/utilisateurs/${user.id}/messages`}
                className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center gap-1"
              >
                Voir toutes les conversations
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            )}
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.slice(0, 10).map((message: any) => (
                <div
                  key={message.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold mb-1">{message.announcement?.title || 'Annonce supprimée'}</p>
                      <p className="text-gray-600 mb-2 line-clamp-2">{message.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          {format(new Date(message.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}
                        </span>
                        {message.direction && (
                          <>
                            <span>•</span>
                            <span className={message.direction === 'sent' ? 'text-blue-600' : 'text-green-600'}>
                              {message.direction === 'sent' ? 'Envoyé' : 'Reçu'}
                            </span>
                          </>
                        )}
                        {message.sender_id && (
                          <>
                            <span>•</span>
                            <span className="text-xs">
                              {message.sender_id === user.id ? 'De moi' : `De: ${message.sender_id.substring(0, 8)}...`}
                            </span>
                          </>
                        )}
                        {message.recipient_id && (
                          <>
                            <span>•</span>
                            <span className="text-xs">
                              {message.recipient_id === user.id ? 'Pour moi' : `Pour: ${message.recipient_id.substring(0, 8)}...`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {message.announcement && (
                      <Link
                        href={isAdminView ? `/admin/utilisateurs/${user.id}/messages?announcement=${message.announcement.id}` : `/messages?announcement=${message.announcement.id}`}
                        className="ml-4 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Voir la conversation"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucun message pour le moment
            </div>
          )}
        </div>
      </div>

      {/* Tickets de support */}
      {tickets.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Tickets de support ({tickets.length})
            </h2>
          </div>
          <div className="p-4 sm:p-6">
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
                      </div>
                      <p className="text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          {format(new Date(ticket.created_at), 'd MMM yyyy', { locale: fr })}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/admin/support`}
                      className="ml-4 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Voir le ticket"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {editingAnnouncement && (
        <EditAnnouncementModal
          announcement={editingAnnouncement}
          onClose={() => setEditingAnnouncement(null)}
        />
      )}
    </div>
  )
}

