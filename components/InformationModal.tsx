'use client'

import { useState } from 'react'
import { X, Send, Image as ImageIcon, MapPin, Loader2 } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface InformationModalProps {
  announcementId: string
  announcementOwnerId: string
  announcementOwnerEmail: string
  onClose: () => void
}

export default function InformationModal({
  announcementId,
  announcementOwnerId,
  announcementOwnerEmail,
  onClose,
}: InformationModalProps) {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const [message, setMessage] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useChat, setUseChat] = useState(true)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        // Optionnel: obtenir l'adresse via une API de géocodage inverse
        // Pour l'instant, on utilise juste les coordonnées
        setLocation({
          lat: latitude,
          lng: longitude,
        })
      },
      (err) => {
        setError('Impossible d\'obtenir votre localisation: ' + err.message)
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('Vous devez être connecté pour envoyer une information')
      return
    }

    if (!message.trim() && !photo && !location) {
      setError('Veuillez fournir au moins un message, une photo ou une localisation')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      let photoUrl: string | null = null

      // Upload photo if provided
      if (photo) {
        const fileExt = photo.name.split('.').pop()
        const fileName = `${announcementId}/${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('messages')
          .upload(fileName, photo)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('messages')
          .getPublicUrl(fileName)

        photoUrl = publicUrl
      }

      if (useChat) {
        // Envoyer via le système de chat RetrouvAfrik
        const messageData: any = {
          announcement_id: announcementId,
          sender_id: user.id,
          recipient_id: announcementOwnerId,
          content: message || 'J\'ai une information concernant cette annonce',
          message_type: photo ? 'photo' : location ? 'location' : 'text',
        }

        if (photoUrl) messageData.photo_url = photoUrl
        if (location) messageData.location = location

        const { error: messageError } = await supabase
          .from('messages')
          .insert([messageData])

        if (messageError) throw messageError

        // Rediriger vers la page de chat
        router.push(`/messages?announcement=${announcementId}`)
      } else {
        // Envoyer via email (fallback)
        // Ici, on pourrait utiliser un service d'email ou simplement créer un message
        const { error: messageError } = await supabase
          .from('messages')
          .insert([{
            announcement_id: announcementId,
            sender_id: user.id,
            recipient_id: announcementOwnerId,
            content: message || 'J\'ai une information concernant cette annonce',
            message_type: photo ? 'photo' : location ? 'location' : 'text',
            photo_url: photoUrl,
            location: location,
          }])

        if (messageError) throw messageError
      }

      onClose()
      router.refresh()
    } catch (err: any) {
      console.error('Error sending information:', err)
      setError(err.message || 'Une erreur s\'est produite lors de l\'envoi')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">J'ai une information</h2>
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Décrivez l'information que vous avez..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ajouter une photo (optionnel)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                {photoPreview ? (
                  <div className="relative w-full h-48 mb-4">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhoto(null)
                        setPhotoPreview(null)
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-primary font-semibold">Cliquez pour ajouter une photo</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation (optionnel)
            </label>
            {location ? (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Localisation enregistrée</p>
                    <p className="text-sm text-gray-600">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLocation(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MapPin className="w-5 h-5" />
                <span>Partager ma localisation</span>
              </button>
            )}
          </div>

          {/* Send method */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useChat}
                onChange={(e) => setUseChat(e.target.checked)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">
                Envoyer via le chat RetrouvAfrik (recommandé)
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-2 ml-6">
              Le propriétaire de l'annonce recevra votre message dans sa messagerie RetrouvAfrik
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Envoyer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

