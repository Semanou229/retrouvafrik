'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Clock, FileText, Eye } from 'lucide-react'
import TicketDetailModal from './TicketDetailModal'

interface SupportTicketItemProps {
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
}

export default function SupportTicketItem({ ticket }: SupportTicketItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">{ticket.subject}</h3>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold text-white ${getStatusColor(ticket.status)}`}
              >
                {getStatusLabel(ticket.status)}
              </span>
            </div>
            <p className="text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {format(new Date(ticket.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}
              </span>
              {ticket.announcement && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {ticket.announcement.title}
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsModalOpen(true)
            }}
            className="ml-4 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      <TicketDetailModal
        ticket={ticket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isAdmin={false}
      />
    </>
  )
}

