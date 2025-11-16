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
    trigger,
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

  const handleNext = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    console.log('🟢 handleNext appelé, étape actuelle:', currentStep)
    setError(null) // Réinitialiser les erreurs
    
    const values = watch()
    console.log('📋 Valeurs actuelles:', values)
    let isValid = true
    
    try {
      switch (currentStep) {
        case 1:
          // Valider les champs de l'étape 1
          console.log('🔍 Validation étape 1')
          const step1Valid = await trigger(['person_name', 'year_or_period', 'relationship'] as any)
          console.log('✅ Résultat validation étape 1:', step1Valid)
          if (!step1Valid) {
            isValid = false
            if (!values.person_name || values.person_name.trim().length < 2) {
              setError('Le nom doit contenir au moins 2 caractères')
            } else if (!values.year_or_period || values.year_or_period.trim().length === 0) {
              setError('L\'année ou période est obligatoire')
            } else if (!values.relationship || values.relationship.trim().length === 0) {
              setError('Le lien avec cette personne est obligatoire')
            }
          }
          break
        case 2:
          // Valider le champ story
          console.log('🔍 Validation étape 2, longueur:', values.story?.length)
          const step2Valid = await trigger(['story'] as any)
          console.log('✅ Résultat validation étape 2:', step2Valid)
          if (!step2Valid) {
            isValid = false
            if (!values.story || values.story.trim().length < 100) {
              setError('L\'histoire doit contenir au moins 100 caractères')
            }
          }
          break
        case 3:
          // Pas de validation nécessaire pour les photos (optionnelles)
          console.log('✅ Étape 3 - pas de validation nécessaire')
          isValid = true
          break
        case 4:
          // Valider les champs de contact
          console.log('🔍 Validation étape 4, email:', values.contact_email)
          const step4Valid = await trigger(['contact_email', 'contact_visibility'] as any)
          console.log('✅ Résultat validation étape 4:', step4Valid)
          if (!step4Valid) {
            isValid = false
            if (!values.contact_email || !z.string().email().safeParse(values.contact_email).success) {
              setError('Un email valide est obligatoire')
            } else if (!values.contact_visibility) {
              setError('La visibilité des coordonnées est obligatoire')
            }
          }
          break
        default:
          isValid = true
      }
      
      console.log('📊 Résultat final validation:', isValid, '| Étape actuelle:', currentStep)
      if (isValid && currentStep < 5) {
        const nextStep = currentStep + 1
        console.log('➡️ Passage à l\'étape suivante:', nextStep)
        setCurrentStep(nextStep)
        console.log('✅ Étape mise à jour')
      } else {
        console.log('⚠️ Validation échouée ou dernière étape atteinte')
      }
    } catch (err) {
      console.error('❌ Erreur dans handleNext:', err)
      setError('Une erreur s\'est produite. Veuillez réessayer.')
    }
  }

  const onSubmit = async (data: FormData) => {
    if (currentStep < 5) {
      // Ne devrait pas arriver ici car handleNext gère la navigation
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

      // Envoyer un email à l'admin pour approbation
      try {
        await fetch('/api/admin/notify-announcement', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ announcementId: announcement.id }),
        })
      } catch (notificationError) {
        console.error('Erreur lors de l\'envoi de la notification admin:', notificationError)
      }

      // Rediriger vers une page de confirmation d'attente d'approbation
      router.push(`/annonces/${announcement.id}?pending=true`)
      router.refresh()
    } catch (err: any) {
      console.error('Form submission error:', err)
      setError(err.message || 'Une erreur s\'est produite lors de la publication. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (currentStep === 5) {
      // Dernière étape : soumettre le formulaire avec validation
      // Utiliser handleSubmit pour valider tous les champs avant soumission
      const isValid = await trigger()
      if (isValid) {
        const formData = watch()
        await onSubmit(formData as FormData)
      } else {
        setError('Veuillez remplir tous les champs obligatoires correctement.')
      }
    } else {
      // Si ce n'est pas la dernière étape, traiter comme un clic sur "Suivant"
      await handleNext()
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
      {/* Progress bar */}
      <div className="mb-6 md:mb-8">
        {/* Barre de progression mobile avec scroll horizontal */}
        <div className="block md:hidden overflow-x-auto pb-2 -mx-6 px-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style dangerouslySetInnerHTML={{__html: `
            .mobile-progress::-webkit-scrollbar {
              display: none;
            }
          `}} />
          <div className="flex gap-3 min-w-max px-2 mobile-progress">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className="flex-shrink-0 w-24"
              >
                <div
                  className={`h-2 rounded ${
                    step.id <= currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
                <p
                  className={`text-[10px] mt-2 text-center leading-tight ${
                    step.id <= currentStep ? 'text-primary font-semibold' : 'text-gray-500'
                  }`}
                  title={step.title}
                >
                  {step.id === 1 ? 'Infos' : 
                   step.id === 2 ? 'Histoire' :
                   step.id === 3 ? 'Photo' :
                   step.id === 4 ? 'Contact' : 'Vérif'}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Barre de progression desktop */}
        <div className="hidden md:flex justify-between mb-2 gap-2">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="flex-1 min-w-0"
            >
              <div
                className={`h-2 rounded ${
                  step.id <= currentStep ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
              <p
                className={`text-xs mt-2 text-center truncate ${
                  step.id <= currentStep ? 'text-primary font-semibold' : 'text-gray-500'
                }`}
                title={step.title}
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
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
            <h2 className="text-xl md:text-2xl font-semibold">Informations sur la personne</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la personne *
            </label>
            <input
              {...register('person_name')}
              placeholder="Exemple : Amadou Diallo"
              className="w-full px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
              className="w-full px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
              className="w-full px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
            <h2 className="text-xl md:text-2xl font-semibold">Votre histoire / témoignage</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Histoire / témoignage détaillé *
            </label>
            <textarea
              {...register('story')}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
              placeholder="Racontez votre histoire avec cette personne. Décrivez les souvenirs que vous avez, les moments partagés, les circonstances de votre séparation, et tout ce qui pourrait aider quelqu'un à reconnaître cette personne..."
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
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <Upload className="w-6 h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
            <h2 className="text-xl md:text-2xl font-semibold">Photo d'époque (si disponible)</h2>
          </div>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            Si vous avez des photos d'époque de cette personne, ajoutez-les ici. Les photos peuvent grandement aider à la reconnaître.
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8 text-center">
            <Upload className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
            <label className="cursor-pointer">
              <span className="text-primary font-semibold text-sm md:text-base">Cliquez pour sélectionner</span>
              <span className="text-gray-600 text-sm md:text-base hidden sm:inline"> ou glissez-déposez vos photos ici</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs md:text-sm text-gray-500 mt-2">Maximum 5 photos</p>
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
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Comment vous contacter ?</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            Ces informations permettront à la communauté de vous joindre si quelqu'un reconnaît cette personne.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              {...register('contact_email')}
              className="w-full px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
              className="w-full px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Autres moyens de contact (optionnel)
            </label>
            <input
              {...register('contact_other')}
              placeholder="WhatsApp, Facebook, Instagram..."
              className="w-full px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibilité des coordonnées
            </label>
            <select
              {...register('contact_visibility')}
              className="w-full px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="members_only">Uniquement les membres connectés</option>
              <option value="public">Tous les visiteurs</option>
            </select>
            <p className="text-xs md:text-sm text-gray-500 mt-2">
              Pour votre sécurité, nous recommandons de limiter la visibilité aux membres connectés.
            </p>
          </div>
        </div>
      )}

      {/* Step 5: Vérification */}
      {currentStep === 5 && (
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Vérifiez votre annonce avant publication</h2>
          <div className="bg-gray-50 rounded-lg p-4 md:p-6 space-y-3 md:space-y-4">
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
      <div className="flex justify-between mt-6 md:mt-8 gap-3">
        <button
          type="button"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Précédent</span>
          <span className="sm:hidden">Préc.</span>
        </button>
        {currentStep === 5 ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 md:px-6 md:py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base w-full sm:w-auto justify-center"
          >
            {isSubmitting ? 'Publication...' : 'Publier l\'annonce'}
          </button>
        ) : (
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('🔵 Bouton Suivant cliqué, étape actuelle:', currentStep)
              try {
                await handleNext(e)
                console.log('✅ handleNext terminé')
              } catch (err) {
                console.error('❌ Erreur dans handleNext:', err)
              }
            }}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 md:px-6 md:py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base w-full sm:w-auto"
          >
            Suivant
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  )
}

