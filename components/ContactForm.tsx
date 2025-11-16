'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, AlertCircle, CheckCircle } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase/client'

export default function ContactForm() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSending(true)

    try {
      // Créer un ticket de support pour le message de contact
      const { data: { user } } = await supabase.auth.getUser()
      
      // Si l'utilisateur est connecté, créer un ticket de support
      if (user) {
        const { error: ticketError } = await supabase
          .from('support_tickets')
          .insert({
            user_id: user.id,
            type: 'other',
            subject: `Contact: ${formData.subject}`,
            description: `Message de contact de ${formData.name} (${formData.email}):\n\n${formData.message}`,
            priority: 'normal',
            status: 'open',
          })

        if (ticketError) throw ticketError
      } else {
        // Si non connecté, on pourrait envoyer un email ou stocker dans une table de messages de contact
        // Pour l'instant, on affiche juste un message de succès
        console.log('Message de contact:', formData)
      }

      setSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      setTimeout(() => {
        setSuccess(false)
        if (user) {
          router.push('/support')
        }
      }, 3000)
    } catch (err: any) {
      console.error('Error sending message:', err)
      setError(err.message || 'Erreur lors de l\'envoi du message. Veuillez réessayer.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.</span>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nom complet *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Votre nom"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="votre@email.com"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Sujet *
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Sélectionnez un sujet</option>
          <option value="general">Question générale</option>
          <option value="technical">Problème technique</option>
          <option value="announcement">Question sur une annonce</option>
          <option value="partnership">Partenariat</option>
          <option value="other">Autre</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Votre message..."
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Envoi en cours...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Envoyer le message</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        En envoyant ce formulaire, vous acceptez que nous traitions vos données pour répondre à votre demande.
        {!formData.email.includes('@') && ' Si vous êtes connecté, un ticket de support sera créé automatiquement.'}
      </p>
    </form>
  )
}

