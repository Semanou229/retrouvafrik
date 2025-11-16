'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Users,
  Shield,
  Ban,
  UserX,
  UserCheck,
  Search,
  Mail,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
} from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  email?: string
  created_at: string
  user_metadata?: {
    role?: string
    full_name?: string
  }
}

interface UserStatus {
  id: string
  user_id: string
  status: 'active' | 'suspended' | 'banned'
  reason?: string
  suspended_until?: string
}

interface AdminUsersManagerProps {
  initialUsers: User[]
  initialUserStatuses: UserStatus[]
  initialUserStats: Array<{ user_id: string }>
}

export default function AdminUsersManager({
  initialUsers,
  initialUserStatuses,
  initialUserStats,
}: AdminUsersManagerProps) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [userStatuses, setUserStatuses] = useState(initialUserStatuses)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'banned' | 'admin'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [suspendingUser, setSuspendingUser] = useState<string | null>(null)
  const [suspensionReason, setSuspensionReason] = useState('')
  const supabase = createSupabaseClient()

  // Créer un map des statuts par user_id
  const statusMap = useMemo(() => {
    const map = new Map<string, UserStatus>()
    userStatuses.forEach(status => {
      map.set(status.user_id, status)
    })
    return map
  }, [userStatuses])

  // Créer un map des stats par user_id
  const statsMap = useMemo(() => {
    const map = new Map<string, number>()
    initialUserStats.forEach(stat => {
      map.set(stat.user_id, (map.get(stat.user_id) || 0) + 1)
    })
    return map
  }, [initialUserStats])

  const filteredUsers = useMemo(() => {
    let filtered = [...users]

    if (statusFilter === 'admin') {
      filtered = filtered.filter(u => 
        u.email?.includes('admin') || u.user_metadata?.role === 'admin'
      )
    } else if (statusFilter !== 'all') {
      filtered = filtered.filter(u => {
        const status = statusMap.get(u.id)
        return status?.status === statusFilter
      })
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        u =>
          u.email?.toLowerCase().includes(query) ||
          u.user_metadata?.full_name?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [users, statusFilter, searchQuery, statusMap])

  const getUserStatus = (userId: string): 'active' | 'suspended' | 'banned' => {
    const status = statusMap.get(userId)
    return status?.status || 'active'
  }

  const handleSuspend = async (userId: string) => {
    if (!suspensionReason.trim()) {
      setError('Veuillez indiquer une raison pour la suspension')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error: upsertError } = await supabase
        .from('user_status')
        .upsert({
          user_id: userId,
          status: 'suspended',
          reason: suspensionReason.trim(),
        })

      if (upsertError) throw upsertError

      setUserStatuses([
        ...userStatuses.filter(s => s.user_id !== userId),
        {
          id: '',
          user_id: userId,
          status: 'suspended',
          reason: suspensionReason.trim(),
        },
      ])
      setSuspendingUser(null)
      setSuspensionReason('')
      setSuccess('Utilisateur suspendu avec succès !')
      setTimeout(() => setSuccess(null), 3000)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suspension')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBan = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir bannir cet utilisateur ?')) return

    setIsLoading(true)
    setError(null)

    try {
      const { error: upsertError } = await supabase
        .from('user_status')
        .upsert({
          user_id: userId,
          status: 'banned',
          reason: 'Banni par un administrateur',
        })

      if (upsertError) throw upsertError

      setUserStatuses([
        ...userStatuses.filter(s => s.user_id !== userId),
        {
          id: '',
          user_id: userId,
          status: 'banned',
          reason: 'Banni par un administrateur',
        },
      ])
      setSuccess('Utilisateur banni avec succès !')
      setTimeout(() => setSuccess(null), 3000)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erreur lors du bannissement')
    } finally {
      setIsLoading(false)
    }
  }

  const handleActivate = async (userId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('user_status')
        .delete()
        .eq('user_id', userId)

      if (deleteError) throw deleteError

      setUserStatuses(userStatuses.filter(s => s.user_id !== userId))
      setSuccess('Utilisateur réactivé avec succès !')
      setTimeout(() => setSuccess(null), 3000)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la réactivation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMakeAdmin = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir donner les droits administrateur à cet utilisateur ?')) return

    setIsLoading(true)
    setError(null)

    try {
      // Note: Cette opération nécessite l'API admin de Supabase avec les bonnes permissions
      // Pour l'instant, on utilise une fonction Edge Function ou on met à jour via l'interface Supabase
      // Ici, on simule la mise à jour côté client
      setUsers(
        users.map(u =>
          u.id === userId
            ? { ...u, user_metadata: { ...u.user_metadata, role: 'admin' } }
            : u
        )
      )
      setSuccess('Droits administrateur accordés avec succès ! Note: Cette modification doit être effectuée via l\'interface Supabase pour être permanente.')
      setTimeout(() => setSuccess(null), 5000)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'attribution des droits')
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
              <Users className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
            </div>
            <p className="text-orange-100">Gérez les comptes utilisateurs et leurs statuts</p>
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
                placeholder="Rechercher un utilisateur..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Tous' },
              { value: 'active', label: 'Actifs' },
              { value: 'suspended', label: 'Suspendus' },
              { value: 'banned', label: 'Bannis' },
              { value: 'admin', label: 'Admins' },
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

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6">
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const status = getUserStatus(user.id)
                const isAdmin = user.email?.includes('admin') || user.user_metadata?.role === 'admin'
                const announcementsCount = statsMap.get(user.id) || 0

                return (
                  <div
                    key={user.id}
                    className={`border rounded-xl p-6 ${
                      status === 'banned'
                        ? 'border-red-200 bg-red-50/50'
                        : status === 'suspended'
                        ? 'border-yellow-200 bg-yellow-50/50'
                        : isAdmin
                        ? 'border-blue-200 bg-blue-50/50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">{user.email}</p>
                            {user.user_metadata?.full_name && (
                              <p className="text-sm text-gray-600">{user.user_metadata.full_name}</p>
                            )}
                          </div>
                          {isAdmin && (
                            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Administrateur
                            </span>
                          )}
                          {status === 'banned' && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                              <Ban className="w-3 h-3" />
                              Banni
                            </span>
                          )}
                          {status === 'suspended' && (
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                              <UserX className="w-3 h-3" />
                              Suspendu
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Inscrit le {format(new Date(user.created_at), 'd MMM yyyy', { locale: fr })}
                            </span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{announcementsCount} annonce{announcementsCount > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        {statusMap.get(user.id)?.reason && (
                          <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Raison :</p>
                            <p className="text-sm text-gray-600">{statusMap.get(user.id)?.reason}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Link
                          href={`/admin/utilisateurs/${user.id}`}
                          className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                          title="Visiter le compte"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        {status === 'active' ? (
                          <>
                            <button
                              onClick={() => setSuspendingUser(user.id)}
                              disabled={isLoading}
                              className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                              title="Suspendre"
                            >
                              <UserX className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleBan(user.id)}
                              disabled={isLoading}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                              title="Bannir"
                            >
                              <Ban className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleActivate(user.id)}
                            disabled={isLoading}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                            title="Réactiver"
                          >
                            <UserCheck className="w-5 h-5" />
                          </button>
                        )}
                        {!isAdmin && (
                          <button
                            onClick={() => handleMakeAdmin(user.id)}
                            disabled={isLoading}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                            title="Donner les droits admin"
                          >
                            <Shield className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Formulaire de suspension */}
                    {suspendingUser === user.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Raison de la suspension *
                        </label>
                        <textarea
                          value={suspensionReason}
                          onChange={(e) => setSuspensionReason(e.target.value)}
                          placeholder="Expliquez pourquoi cet utilisateur est suspendu..."
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSuspend(user.id)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50"
                          >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Suspendre'}
                          </button>
                          <button
                            onClick={() => {
                              setSuspendingUser(null)
                              setSuspensionReason('')
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

