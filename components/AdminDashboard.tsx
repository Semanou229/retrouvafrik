'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  FileText,
  Users,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
  Shield,
  Filter,
  Search,
  Globe,
  Heart,
  Mail,
} from 'lucide-react'
import Link from 'next/link'
import type { Announcement, Comment, Report } from '@/lib/types'

interface AdminDashboardProps {
  announcements: Announcement[]
  comments: Comment[]
  reports: Report[]
  stats: {
    totalAnnouncements: number
    activeAnnouncements: number
    resolvedAnnouncements: number
    urgentAnnouncements: number
    totalComments: number
    totalReports: number
    totalUsers: number
  }
}

export default function AdminDashboard({
  announcements,
  comments,
  reports,
  stats,
}: AdminDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'announcements' | 'comments' | 'reports'>('announcements')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createSupabaseClient()

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('announcements')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      router.refresh()
    }
  }

  const handleDelete = async (id: string, type: 'announcement' | 'comment' | 'report') => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return

    const table = type === 'announcement' ? 'announcements' : type === 'comment' ? 'comments' : 'reports'
    const { error } = await supabase.from(table).delete().eq('id', id)

    if (!error) {
      router.refresh()
    }
  }

  const filteredAnnouncements = announcements.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Tableau de bord administrateur</h1>
            </div>
            <p className="text-orange-100 text-sm sm:text-base">Gérez la plateforme RetrouvAfrik</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Link
          href="/admin/annonces"
          className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all hover:border-primary"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">Gérer les annonces</h3>
              <p className="text-xs sm:text-sm text-gray-600">Approuver, vérifier et masquer</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/utilisateurs"
          className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all hover:border-primary"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">Gérer les utilisateurs</h3>
              <p className="text-xs sm:text-sm text-gray-600">Suspendre, bannir, ajouter admins</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/stats"
          className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all hover:border-primary"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">Statistiques</h3>
              <p className="text-xs sm:text-sm text-gray-600">Dashboard et analyses</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/pays-villes"
          className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all hover:border-primary"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">Pays et villes</h3>
              <p className="text-xs sm:text-sm text-gray-600">Gérer les localisations</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/support"
          className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all hover:border-primary"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">Support & Tickets</h3>
              <p className="text-xs sm:text-sm text-gray-600">Gérer les tickets de support</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/dons"
          className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all hover:border-primary"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">Gestion des dons</h3>
              <p className="text-xs sm:text-sm text-gray-600">Configurer les liens de don</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/publicites"
          className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all hover:border-primary"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">Publicités</h3>
              <p className="text-xs sm:text-sm text-gray-600">Gérer les campagnes pub</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/contact"
          className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all hover:border-primary"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">Coordonnées de contact</h3>
              <p className="text-xs sm:text-sm text-gray-600">Gérer les informations de contact</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Total annonces</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalAnnouncements}</p>
            </div>
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">En cours</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.activeAnnouncements}</p>
            </div>
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-primary flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Résolues</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.resolvedAnnouncements}</p>
            </div>
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Utilisateurs</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary flex-shrink-0 ml-2" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex-1 min-w-0 px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'announcements'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annonces ({announcements.length})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 min-w-0 px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'comments'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Commentaires ({comments.length})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 min-w-0 px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Signalements ({reports.length})
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Filters */}
          {activeTab === 'announcements' && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une annonce..."
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">En cours</option>
                <option value="resolved">Résolues</option>
                <option value="archived">Archivées</option>
              </select>
            </div>
          )}

          {/* Content */}
          {activeTab === 'announcements' && (
            <div className="space-y-3 sm:space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <Link
                          href={`/annonces/${announcement.id}`}
                          className="text-base sm:text-lg font-semibold hover:text-primary transition-colors break-words"
                        >
                          {announcement.title}
                        </Link>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
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
                          <span className="bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {announcement.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                        <span>{announcement.type}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{announcement.views_count || 0} vues</span>
                        <span className="hidden sm:inline">•</span>
                        <span>
                          {format(new Date(announcement.created_at), 'd MMM yyyy', { locale: fr })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-4 flex-shrink-0">
                      {announcement.status === 'active' && (
                        <button
                          onClick={() => handleStatusChange(announcement.id, 'resolved')}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Marquer comme résolue"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(announcement.id, 'announcement')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-3 sm:space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold text-sm sm:text-base">{comment.user?.email || 'Anonyme'}</span>
                        <span className="text-xs sm:text-sm text-gray-500 break-words">
                          sur "{comment.announcement?.title || 'Annonce supprimée'}"
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 mb-2 break-words">{comment.content}</p>
                      <span className="text-xs text-gray-500">
                        {format(new Date(comment.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(comment.id, 'comment')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors sm:ml-4 flex-shrink-0 self-start"
                    >
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-3 sm:space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        <span className="font-semibold text-sm sm:text-base break-words">
                          Signalement sur "{report.announcement?.title || 'Annonce supprimée'}"
                        </span>
                        <span className="px-2 py-1 bg-primary/10 text-primary-dark rounded text-xs font-semibold whitespace-nowrap">
                          {report.type}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 mb-2 break-words">{report.description}</p>
                      <div className="text-xs text-gray-500">
                        <span>Contact: {report.contact_email}</span>
                        {report.location && <span> • {report.location}</span>}
                        <span className="block mt-1">
                          {format(new Date(report.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(report.id, 'report')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors sm:ml-4 flex-shrink-0 self-start"
                    >
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

