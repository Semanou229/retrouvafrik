'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  X,
  Send,
  Loader2,
  User,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
} from 'lucide-react'
import { useAuth } from '@/app/providers'

interface TicketMessage {
  id: string
  ticket_id: string
  user_id?: string
  message: string
  is_admin: boolean
  created_at: string
}

interface TicketDetailModalProps {
  ticket: {
    id: string
    user_id?: string
    type: string
    subject: string
    description: string
    status: string
    priority: string
    announcement_id?: string
    created_at: string
    updated_at: string
    announcement?: { id: string; title: string }
  }
  isOpen: boolean
  onClose: () => void
  isAdmin?: boolean
  onUpdate?: () => void
}

export default function TicketDetailModal({
  ticket,
  isOpen,
  onClose,
  isAdmin = false,
  onUpdate,
}: TicketDetailModalProps) {
  const { user } = useAuth()
  const supabase = createSupabaseClient()
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && ticket.id) {
      loadMessages()
    }
  }, [isOpen, ticket.id])

  const loadMessages = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticket.id)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError
      setMessages(data || [])
    } catch (err: any) {
      console.error('Error loading messages:', err)
      setError(err.message || 'Erreur lors du chargement des messages')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsSending(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from('ticket_messages')
        .insert([
          {
            ticket_id: ticket.id,
            user_id: user?.id,
            message: newMessage.trim(),
            is_admin: isAdmin,
          },
        ])

      if (insertError) throw insertError

      setNewMessage('')
      await loadMessages()
      
      // Mettre à jour le statut du ticket si c'est la première réponse admin
      if (isAdmin && ticket.status === 'open') {
        await supabase
          .from('support_tickets')
          .update({ status: 'in_progress' })
          .eq('id', ticket.id)
      }

      if (onUpdate) onUpdate()
    } catch (err: any) {
      console.error('Error sending message:', err)
      setError(err.message || 'Erreur lors de l\'envoi du message')
    } finally {
      setIsSending(false)
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Ouvert'
      case 'in_progress':
        return 'En cours'
      case 'resolved':
        return 'Résolu'
      case 'closed':
        return 'Fermé'
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'normal':
        return 'bg-blue-500'
      case 'low':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Urgente'
      case 'high':
        return 'Élevée'
      case 'normal':
        return 'Normale'
      case 'low':
        return 'Faible'
      default:
        return priority
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{ticket.subject}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getStatusColor(ticket.status)}`}>
                {getStatusLabel(ticket.status)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getPriorityColor(ticket.priority)}`}>
                {getPriorityLabel(ticket.priority)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {format(new Date(ticket.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}
              </span>
              {ticket.announcement && (
                <a
                  href={`/annonces/${ticket.announcement.id}`}
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" />
                  Voir l'annonce
                </a>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Original ticket description */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {isAdmin ? (
                <User className="w-5 h-5 text-gray-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-primary" />
              )}
              <span className="font-semibold text-gray-700">
                {isAdmin ? 'Utilisateur' : 'Vous'}
              </span>
              <span className="text-sm text-gray-500">
                {format(new Date(ticket.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Messages */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-lg ${
                    msg.is_admin
                      ? 'bg-primary/10 border-l-4 border-primary'
                      : 'bg-gray-50 border-l-4 border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {msg.is_admin ? (
                      <Shield className="w-5 h-5 text-primary" />
                    ) : (
                      <User className="w-5 h-5 text-gray-600" />
                    )}
                    <span className="font-semibold text-gray-700">
                      {msg.is_admin ? 'Support RetrouvAfrik' : 'Vous'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(msg.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucune réponse pour le moment
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isAdmin ? 'Répondre au ticket...' : 'Ajouter une information...'}
              rows={3}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSendMessage()
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Envoyer
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Appuyez sur Ctrl+Entrée pour envoyer rapidement
          </p>
        </div>
      </div>
    </div>
  )
}

