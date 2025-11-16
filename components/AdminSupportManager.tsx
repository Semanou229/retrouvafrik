'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Edit,
  User,
  FileText,
  Loader2,
  ArrowRight,
  Shield,
} from 'lucide-react'
import Link from 'next/link'
import type { SupportTicket } from '@/lib/types'

interface AdminSupportManagerProps {
  initialTickets: any[]
  currentAdminId: string
}

export default function AdminSupportManager({
  initialTickets,
  currentAdminId,
}: AdminSupportManagerProps) {
  const router = useRouter()
  const [tickets, setTickets] = useState(initialTickets)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'normal' | 'high' | 'urgent'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingTicket, setEditingTicket] = useState<string | null>(null)
  const [internalNotes, setInternalNotes] = useState('')
  const supabase = createSupabaseClient()

  const filteredTickets = useMemo(() => {
    let filtered = [...tickets]

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        t =>
          t.subject.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          (t.user_id || '').toLowerCase().includes(query)
      )
    }

    return filtered
  }, [tickets, statusFilter, priorityFilter, searchQuery])

  const handleStatusChange = async (id: string, newStatus: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const updateData: any = { status: newStatus }
      if (newStatus === 'resolved' || newStatus === 'closed') {
        updateData.resolved_at = new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', id)

      if (updateError) throw updateError

      setTickets(tickets.map(t => (t.id === id ? { ...t, ...updateData } : t)))
      setSuccess('Statut mis à jour avec succès !')
      setTimeout(() => setSuccess(null), 3000)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssign = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('support_tickets')
        .update({ assigned_to: currentAdminId, status: 'in_progress' })
        .eq('id', id)

      if (updateError) throw updateError

      setTickets(
        tickets.map(t =>
          t.id === id ? { ...t, assigned_to: currentAdminId, status: 'in_progress' } : t
        )
      )
      setSuccess('Ticket assigné avec succès !')
      setTimeout(() => setSuccess(null), 3000)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'assignation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotes = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('support_tickets')
        .update({ internal_notes: internalNotes })
        .eq('id', id)

      if (updateError) throw updateError

      setTickets(tickets.map(t => (t.id === id ? { ...t, internal_notes: internalNotes } : t)))
      setEditingTicket(null)
      setInternalNotes('')
      setSuccess('Notes enregistrées !')
      setTimeout(() => setSuccess(null), 3000)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500'
      case 'in_progress':
        return 'bg-yellow-500'
      case 'resolved':
        return 'bg-green-500'
      case 'closed':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-500'
      case 'normal':
        return 'bg-blue-500'
      case 'high':
        return 'bg-orange-500'
      case 'urgent':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'technical':
        return 'Problème technique'
      case 'announcement_review':
        return 'Vérification d\'annonce'
      case 'modification_request':
        return 'Demande de modification'
      case 'fraud':
        return 'Fraude'
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <HelpCircle className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Gestion des tickets de support</h1>
            </div>
            <p className="text-orange-100">Gérez et répondez aux demandes de support des utilisateurs</p>
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

      {/* Statistiques rapides */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tickets ouverts</p>
              <p className="text-3xl font-bold text-blue-500">
                {tickets.filter(t => t.status === 'open').length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">En cours</p>
              <p className="text-3xl font-bold text-yellow-500">
                {tickets.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Résolus</p>
              <p className="text-3xl font-bold text-green-500">
                {tickets.filter(t => t.status === 'resolved').length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-900">{tickets.length}</p>
            </div>
            <FileText className="w-10 h-10 text-primary" />
          </div>
        </div>
      </div>

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
                placeholder="Rechercher un ticket..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="open">Ouvert</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolu</option>
              <option value="closed">Fermé</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Toutes les priorités</option>
              <option value="low">Faible</option>
              <option value="normal">Normale</option>
              <option value="high">Élevée</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des tickets */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6">
          <div className="space-y-4">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`border rounded-xl p-6 ${
                    ticket.status === 'closed'
                      ? 'border-gray-200 bg-gray-50/50'
                      : ticket.priority === 'urgent'
                      ? 'border-red-200 bg-red-50/50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{ticket.subject}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold text-white ${getStatusColor(
                            ticket.status
                          )}`}
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
                          className={`px-2 py-1 rounded text-xs font-semibold text-white ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority === 'low'
                            ? 'Faible'
                            : ticket.priority === 'normal'
                            ? 'Normale'
                            : ticket.priority === 'high'
                            ? 'Élevée'
                            : 'Urgente'}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-primary/10 text-primary">
                          {getTypeLabel(ticket.type)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{ticket.user_id ? `ID: ${ticket.user_id.substring(0, 8)}...` : 'Utilisateur anonyme'}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {format(new Date(ticket.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}
                          </span>
                        </div>
                        {ticket.announcement && (
                          <>
                            <span>•</span>
                            <Link
                              href={`/annonces/${ticket.announcement.id}`}
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <FileText className="w-4 h-4" />
                              <span>Voir l'annonce</span>
                            </Link>
                          </>
                        )}
                      </div>
                      {ticket.assigned_admin && (
                        <div className="mt-2 text-sm text-gray-600">
                          Assigné à : {ticket.assigned_to ? `ID: ${ticket.assigned_to.substring(0, 8)}...` : 'Non assigné'}
                        </div>
                      )}
                      {ticket.internal_notes && (
                        <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Notes internes :</p>
                          <p className="text-sm text-gray-600">{ticket.internal_notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {ticket.status === 'open' && (
                        <button
                          onClick={() => handleAssign(ticket.id)}
                          disabled={isLoading}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                          title="S'assigner le ticket"
                        >
                          <User className="w-5 h-5" />
                        </button>
                      )}
                      {ticket.status !== 'closed' && (
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          disabled={isLoading}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary disabled:opacity-50"
                        >
                          <option value="open">Ouvert</option>
                          <option value="in_progress">En cours</option>
                          <option value="resolved">Résolu</option>
                          <option value="closed">Fermé</option>
                        </select>
                      )}
                      <button
                        onClick={() => {
                          setEditingTicket(ticket.id)
                          setInternalNotes(ticket.internal_notes || '')
                        }}
                        className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        title="Ajouter des notes"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Formulaire de notes */}
                  {editingTicket === ticket.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes internes
                      </label>
                      <textarea
                        value={internalNotes}
                        onChange={(e) => setInternalNotes(e.target.value)}
                        placeholder="Ajouter des notes internes pour ce ticket..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveNotes(ticket.id)}
                          disabled={isLoading}
                          className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enregistrer'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingTicket(null)
                            setInternalNotes('')
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
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Aucun ticket trouvé</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

