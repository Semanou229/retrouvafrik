'use client'

import { useState } from 'react'
import { useAuth } from '@/app/providers'
import { createSupabaseClient } from '@/lib/supabase/client'
import { X, Package, AlertCircle } from 'lucide-react'

interface ObjectClaimModalProps {
  announcementId: string
  announcementOwnerId: string
  announcementOwnerEmail: string
  onClose: () => void
}

export default function ObjectClaimModal({
  announcementId,
  announcementOwnerId,
  announcementOwnerEmail,
  onClose,
}: ObjectClaimModalProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [description, setDescription] = useState('')
  const [secretProof, setSecretProof] = useState('')
  const [contactEmail, setContactEmail] = useState(user?.email || '')
  const [contactPhone, setContactPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('Vous devez être connecté pour réclamer un objet')
      return
    }

    if (!message.trim() || !description.trim()) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }

    setIsSubmitting(true)

    try {
      // Créer la réclamation
      const { error: claimError } = await supabase
        .from('object_claims')
        .insert([
          {
            announcement_id: announcementId,
            claimant_id: user.id,
            message,
            description,
            secret_proof: secretProof || null,
            contact_email: contactEmail,
            contact_phone: contactPhone || null,
            status: 'pending',
          },
        ])

      if (claimError) {
        throw new Error(claimError.message || 'Erreur lors de la création de la réclamation')
      }

      // Envoyer un message privé à l'auteur de l'annonce
      const { error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            announcement_id: announcementId,
            sender_id: user.id,
            recipient_id: announcementOwnerId,
            content: `Quelqu'un pense que l'objet trouvé lui appartient. Vérifiez les détails dans vos réclamations.`,
            message_type: 'text',
            is_read: false,
          },
        ])

      if (messageError) {
        console.error('Erreur lors de l\'envoi du message:', messageError)
        // On continue même si le message échoue
      }

      alert('Votre réclamation a été envoyée avec succès. L\'auteur de l\'annonce vous contactera si l\'objet vous appartient.')
      onClose()
    } catch (err: any) {
      console.error('Erreur:', err)
      setError(err.message || 'Une erreur s\'est produite. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Je pense que c'est mon objet</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Important :</strong> Décrivez l'objet en détail pour prouver qu'il vous appartient. 
              Si l'auteur de l'annonce a indiqué un détail secret, vous pouvez le mentionner ici.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message à l'auteur de l'annonce *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Bonjour, je pense que cet objet m'appartient..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description détaillée de l'objet pour prouver l'authenticité *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Décrivez l'objet en détail : dimensions exactes, marque, modèle, signes distinctifs, usures, inscriptions, accessoires inclus..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Plus vous serez précis, plus il sera facile de vérifier que l'objet vous appartient.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Détail secret (si mentionné dans l'annonce)
            </label>
            <input
              type="text"
              value={secretProof}
              onChange={(e) => setSecretProof(e.target.value)}
              placeholder="Exemple: Le prénom sur la carte commence par 'M'..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Si l'auteur a mentionné un détail secret dans son annonce, indiquez-le ici pour prouver votre identité.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de contact *
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone (optionnel)
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+229 97 00 00 00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer la réclamation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

