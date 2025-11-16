'use client'

import { useState } from 'react'
import { X, Send, Image as ImageIcon, MapPin, Loader2, UserCheck } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface RecognitionModalProps {
  announcementId: string
  onClose: () => void
}

export default function RecognitionModal({
  announcementId,
  onClose,
}: RecognitionModalProps) {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const [message, setMessage] = useState('')
  const [contactEmail, setContactEmail] = useState(user?.email || '')
  const [contactPhone, setContactPhone] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setError('Vous devez être connecté pour signaler une reconnaissance')
      return
    }

    if (!message.trim()) {
      setError('Veuillez décrire comment vous reconnaissez cette personne')
      return
    }

    if (!contactEmail.trim()) {
      setError('Veuillez fournir votre email de contact')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      let photoUrl: string | null = null

      // Upload photo if provided
      if (photo) {
        const fileExt = photo.name.split('.').pop()
        const fileName = `recognitions/${announcementId}/${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('messages')
          .upload(fileName, photo)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('messages')
          .getPublicUrl(fileName)

        photoUrl = publicUrl
      }

      // Créer la reconnaissance
      const { error: recognitionError } = await supabase
        .from('recognitions')
        .insert([{
          announcement_id: announcementId,
          user_id: user.id,
          message,
          contact_email: contactEmail,
          contact_phone: contactPhone || null,
          photo_url: photoUrl,
          location: location,
        }])

      if (recognitionError) throw recognitionError

      onClose()
      router.refresh()
      
      // Afficher un message de succès
      alert('Merci ! Votre signalement a été envoyé. Le propriétaire de l\'annonce vous contactera si nécessaire.')
    } catch (err: any) {
      console.error('Error submitting recognition:', err)
      setError(err.message || 'Une erreur s\'est produite lors de l\'envoi')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Je reconnais cette personne</h2>
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-primary-dark">
              💡 <strong>Important :</strong> Décrivez comment vous reconnaissez cette personne. 
              Où et quand l'avez-vous vue ? Quel était le contexte ?
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre témoignage *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Décrivez où et comment vous avez reconnu cette personne. Quand l'avez-vous vue ? Dans quel contexte ?..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre email *
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
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

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo (optionnel)
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Si vous avez une photo de cette personne ou du lieu où vous l'avez vue
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                id="recognition-photo-upload"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <label
                htmlFor="recognition-photo-upload"
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
            <p className="text-sm text-gray-500 mb-2">
              Où avez-vous vu cette personne ?
            </p>
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

