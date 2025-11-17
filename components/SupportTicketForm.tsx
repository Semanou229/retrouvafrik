'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createSupabaseClient } from '@/lib/supabase/client'
import { AlertCircle, CheckCircle, Loader2, HelpCircle, FileText, Edit, Shield } from 'lucide-react'

const ticketSchema = z.object({
  type: z.enum(['technical', 'announcement_review', 'modification_request', 'fraud']),
  subject: z.string().min(5, 'Le sujet doit contenir au moins 5 caractères').max(255),
  description: z.string().min(20, 'La description doit contenir au moins 20 caractères'),
  announcement_id: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
})

type FormData = z.infer<typeof ticketSchema>

interface SupportTicketFormProps {
  userAnnouncements: Array<{ id: string; title: string }>
}

export default function SupportTicketForm({ userAnnouncements }: SupportTicketFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createSupabaseClient()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      type: 'technical',
      priority: 'normal',
    },
  })

  const selectedType = watch('type')

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const { data: ticket, error: insertError } = await supabase
        .from('support_tickets')
        .insert([
          {
            user_id: user?.id || null,
            type: data.type,
            subject: data.subject,
            description: data.description,
            announcement_id: data.announcement_id || null,
            priority: data.priority,
            status: 'open',
          },
        ])
        .select()
        .single()

      if (insertError) throw insertError

      // Notifier l'admin par email
      try {
        await fetch('/api/notifications/admin/ticket', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ticketId: ticket.id }),
        })
      } catch (notificationError) {
        console.error('Erreur lors de l\'envoi de la notification admin:', notificationError)
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/mon-compte')
      }, 2000)
    } catch (err: any) {
      console.error('Form submission error:', err)
      setError(err.message || 'Une erreur s\'est produite lors de la soumission du ticket. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'technical':
        return <AlertCircle className="w-5 h-5" />
      case 'announcement_review':
        return <FileText className="w-5 h-5" />
      case 'modification_request':
        return <Edit className="w-5 h-5" />
      case 'fraud':
        return <Shield className="w-5 h-5" />
      default:
        return <HelpCircle className="w-5 h-5" />
    }
  }

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'technical':
        return 'Problème technique, bug, ou dysfonctionnement de la plateforme'
      case 'announcement_review':
        return 'Demande de vérification ou de révision d\'une annonce'
      case 'modification_request':
        return 'Demande de modification d\'une annonce existante'
      case 'fraud':
        return 'Signaler une fraude ou un comportement suspect'
      default:
        return ''
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ticket soumis avec succès !</h2>
        <p className="text-gray-600 mb-4">
          Votre ticket a été créé et notre équipe le traitera dans les plus brefs délais.
        </p>
        <p className="text-sm text-gray-500">Redirection en cours...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Type de ticket */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Type de ticket *
        </label>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { value: 'technical', label: 'Problème technique', icon: '🔧' },
            { value: 'announcement_review', label: 'Vérification d\'annonce', icon: '📋' },
            { value: 'modification_request', label: 'Demande de modification', icon: '✏️' },
            { value: 'fraud', label: 'Signaler une fraude', icon: '🛡️' },
          ].map((option) => (
            <label
              key={option.value}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedType === option.value
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                value={option.value}
                {...register('type')}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {getTypeDescription(option.value)}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
        {errors.type && (
          <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>
        )}
      </div>

      {/* Sujet */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sujet *
        </label>
        <input
          {...register('subject')}
          placeholder="Résumez brièvement votre problème..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {errors.subject && (
          <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description détaillée *
        </label>
        <textarea
          {...register('description')}
          rows={6}
          placeholder="Décrivez votre problème en détail. Plus vous fournissez d'informations, plus nous pourrons vous aider rapidement..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Annonce concernée (si applicable) */}
      {(selectedType === 'announcement_review' || selectedType === 'modification_request') && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annonce concernée (optionnel)
          </label>
          <select
            {...register('announcement_id')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Sélectionnez une annonce</option>
            {userAnnouncements.map((announcement) => (
              <option key={announcement.id} value={announcement.id}>
                {announcement.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Priorité */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priorité
        </label>
        <select
          {...register('priority')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="low">Faible</option>
          <option value="normal">Normale</option>
          <option value="high">Élevée</option>
          <option value="urgent">Urgente</option>
        </select>
      </div>

      {/* Bouton de soumission */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Soumettre le ticket
            </>
          )}
        </button>
      </div>
    </form>
  )
}

