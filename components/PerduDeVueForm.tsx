'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createSupabaseClient } from '@/lib/supabase/client'
import { ArrowRight, ArrowLeft, Upload, X, AlertCircle, Heart } from 'lucide-react'

const perduDeVueSchema = z.object({
  person_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
  year_or_period: z.string().min(1, 'L\'année ou période est obligatoire'),
  relationship: z.string().min(1, 'Le lien avec cette personne est obligatoire'),
  story: z.string().min(100, 'L\'histoire doit contenir au moins 100 caractères'),
  contact_email: z.string().email('Email invalide'),
  contact_phone: z.string().optional(),
  contact_other: z.string().optional(),
  contact_visibility: z.enum(['public', 'members_only']),
})

type FormData = z.infer<typeof perduDeVueSchema>

const STEPS = [
  { id: 1, title: 'Informations sur la personne' },
  { id: 2, title: 'Votre histoire' },
  { id: 3, title: 'Photo d\'époque' },
  { id: 4, title: 'Coordonnées' },
  { id: 5, title: 'Vérification' },
]

export default function PerduDeVueForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [photos, setPhotos] = useState<File[]>([])
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseClient()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(perduDeVueSchema),
    defaultValues: {
      contact_visibility: 'members_only',
      contact_email: user?.email || '',
    },
  })

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (photos.length + files.length > 5) {
      setError('Maximum 5 photos autorisées')
      return
    }
    
    const newPhotos = [...photos, ...files]
    setPhotos(newPhotos)
    
    const newUrls = files.map(file => URL.createObjectURL(file))
    setPhotoUrls([...photoUrls, ...newUrls])
  }

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    const newUrls = photoUrls.filter((_, i) => i !== index)
    setPhotos(newPhotos)
    setPhotoUrls(newUrls)
  }

  const uploadPhotos = async (): Promise<string[]> => {
    if (photos.length === 0) return []
    
    const uploadedUrls: string[] = []
    
    try {
      for (const photo of photos) {
        const fileExt = photo.name.split('.').pop()
        const fileName = `perdu-de-vue/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `announcements/${fileName}`
        
        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filePath, photo, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (uploadError) {
          console.error('Upload error:', uploadError)
          continue
        }
        
        const { data: urlData } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath)
        
        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl)
        }
      }
    } catch (error) {
      console.error('Error uploading photos:', error)
    }
    
    return uploadedUrls
  }

  const onSubmit = async (data: FormData) => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const photoUrls = await uploadPhotos()

      // Créer l'annonce "Perdu de vue" (non approuvée par défaut)
      const announcementData = {
        type: 'person',
        title: `Recherche de ${data.person_name} - ${data.year_or_period}`,
        description: `Lien avec cette personne : ${data.relationship}\n\n${data.story}`,
        disappearance_date: new Date().toISOString().split('T')[0], // Date actuelle pour "perdu de vue"
        last_location: {
          country: 'Non spécifié',
          city: 'Non spécifié',
        },
        urgency: 'normal',
        photos: photoUrls,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone || null,
        contact_other: data.contact_other || null,
        contact_visibility: data.contact_visibility,
        user_id: user?.id || null,
        status: 'active',
        is_lost_sight: true, // Marquer comme "perdu de vue"
        approved: false, // Nécessite l'approbation de l'admin
      }

      const { data: announcement, error: insertError } = await supabase
        .from('announcements')
        .insert([announcementData])
        .select()
        .single()

      if (insertError) {
        console.error('Insert error:', insertError)
        throw new Error(insertError.message || 'Erreur lors de la création de l\'annonce')
      }

      if (!announcement) {
        throw new Error('L\'annonce n\'a pas pu être créée')
      }

      // Déclencher l'envoi des notifications par email aux membres du secteur
      try {
        await fetch('/api/notifications/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ announcementId: announcement.id }),
        })
        // On ne bloque pas la navigation si l'envoi d'emails échoue
      } catch (notificationError) {
        console.error('Erreur lors de l\'envoi des notifications:', notificationError)
        // On continue quand même
      }

      router.push(`/annonces/${announcement.id}`)
      router.refresh()
    } catch (err: any) {
      console.error('Form submission error:', err)
      setError(err.message || 'Une erreur s\'est produite lors de la publication. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex-1 ${step.id < STEPS.length ? 'mr-2' : ''}`}
            >
              <div
                className={`h-2 rounded ${
                  step.id <= currentStep ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
              <p
                className={`text-xs mt-2 text-center ${
                  step.id <= currentStep ? 'text-primary font-semibold' : 'text-gray-500'
                }`}
              >
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Informations sur la personne */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-semibold">Informations sur la personne</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la personne *
            </label>
            <input
              {...register('person_name')}
              placeholder="Exemple : Amadou Diallo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.person_name && (
              <p className="text-red-600 text-sm mt-1">{errors.person_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Année ou période *
            </label>
            <input
              {...register('year_or_period')}
              placeholder="Exemple : 2010, ou 'Il y a 15 ans', ou 'Période 2005-2010'"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.year_or_period && (
              <p className="text-red-600 text-sm mt-1">{errors.year_or_period.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Indiquez quand vous avez perdu contact avec cette personne
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien avec elle *
            </label>
            <select
              {...register('relationship')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Sélectionner...</option>
              <option value="Ami(e)">Ami(e)</option>
              <option value="Collègue">Collègue</option>
              <option value="Camarade de classe">Camarade de classe</option>
              <option value="Voisin(e)">Voisin(e)</option>
              <option value="Membre de famille">Membre de famille</option>
              <option value="Connaissance">Connaissance</option>
              <option value="Autre">Autre</option>
            </select>
            {errors.relationship && (
              <p className="text-red-600 text-sm mt-1">{errors.relationship.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Histoire */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-semibold">Votre histoire / témoignage</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Histoire / témoignage détaillé *
            </label>
            <textarea
              {...register('story')}
              rows={10}
              placeholder="Racontez votre histoire avec cette personne. Décrivez les souvenirs que vous avez, les moments partagés, les circonstances de votre séparation, et tout ce qui pourrait aider quelqu'un à reconnaître cette personne..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.story && (
              <p className="text-red-600 text-sm mt-1">{errors.story.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Minimum 100 caractères. Plus votre histoire est détaillée, plus elle a de chances d'être reconnue.
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Photos */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-semibold">Photo d'époque (si disponible)</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Si vous avez des photos d'époque de cette personne, ajoutez-les ici. Les photos peuvent grandement aider à la reconnaître.
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <label className="cursor-pointer">
              <span className="text-primary font-semibold">Cliquez pour sélectionner</span>
              <span className="text-gray-600"> ou glissez-déposez vos photos ici</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">Maximum 5 photos</p>
          </div>

          {photoUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photoUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-primary-dark">
              💡 <strong>Note :</strong> Les photos sont optionnelles. Vous pouvez continuer sans photos si vous n'en avez pas.
            </p>
          </div>
        </div>
      )}

      {/* Step 4: Coordonnées */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Comment vous contacter ?</h2>
          <p className="text-gray-600 mb-4">
            Ces informations permettront à la communauté de vous joindre si quelqu'un reconnaît cette personne.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              {...register('contact_email')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.contact_email && (
              <p className="text-red-600 text-sm mt-1">{errors.contact_email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone (optionnel)
            </label>
            <input
              type="tel"
              {...register('contact_phone')}
              placeholder="+225 XX XX XX XX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Autres moyens de contact (optionnel)
            </label>
            <input
              {...register('contact_other')}
              placeholder="WhatsApp, Facebook, Instagram..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibilité des coordonnées
            </label>
            <select
              {...register('contact_visibility')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="members_only">Uniquement les membres connectés</option>
              <option value="public">Tous les visiteurs</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              Pour votre sécurité, nous recommandons de limiter la visibilité aux membres connectés.
            </p>
          </div>
        </div>
      )}

      {/* Step 5: Vérification */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Vérifiez votre annonce avant publication</h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div>
              <span className="font-semibold">Nom de la personne :</span> {watch('person_name')}
            </div>
            <div>
              <span className="font-semibold">Année/Période :</span> {watch('year_or_period')}
            </div>
            <div>
              <span className="font-semibold">Lien :</span> {watch('relationship')}
            </div>
            <div>
              <span className="font-semibold">Histoire :</span>
              <p className="mt-1 text-gray-700">{watch('story')}</p>
            </div>
            <div>
              <span className="font-semibold">Photos :</span> {photos.length} photo(s)
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Précédent
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStep === 5 ? (
            <>
              {isSubmitting ? 'Publication...' : 'Publier l\'annonce'}
            </>
          ) : (
            <>
              Suivant
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}

