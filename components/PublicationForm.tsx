'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createSupabaseClient } from '@/lib/supabase/client'
import { ArrowRight, ArrowLeft, Upload, X, AlertCircle, Video, Plus } from 'lucide-react'
import { getCountriesFromDB, getCitiesByCountryFromDB } from '@/lib/countries-cities-db'
import { countries as staticCountries, getCitiesByCountry } from '@/lib/countries-cities'

const announcementSchema = z.object({
  type: z.enum(['person', 'animal', 'object']),
  mode: z.enum(['perdu', 'trouve']).optional(), // Pour les objets uniquement
  title: z.string().min(10, 'Le titre doit contenir au moins 10 caractères').max(100),
  description: z.string().min(50, 'La description doit contenir au moins 50 caractères'),
  disappearance_date: z.string().min(1, 'La date est obligatoire'),
  country: z.string().min(1, 'Le pays est obligatoire'),
  city: z.string().min(1, 'La ville est obligatoire'),
  address: z.string().optional(),
  urgency: z.enum(['normal', 'urgent']),
  contact_email: z.string().email('Email invalide'),
  contact_phone: z.string().optional(),
  contact_other: z.string().optional(),
  contact_visibility: z.enum(['public', 'members_only']),
  secret_detail: z.string().optional(), // Pour les objets trouvés
  videos: z.array(z.string().url('URL invalide')).optional(), // URLs YouTube ou Vimeo
}).refine((data) => {
  // Si type est 'object', mode est obligatoire
  if (data.type === 'object' && !data.mode) {
    return false
  }
  return true
}, {
  message: 'Veuillez choisir si l\'objet est perdu ou trouvé',
  path: ['mode'],
}).refine((data) => {
  // Si objet trouvé, secret_detail est obligatoire
  if (data.type === 'object' && data.mode === 'trouve' && !data.secret_detail?.trim()) {
    return false
  }
  return true
}, {
  message: 'Le détail secret est obligatoire pour les objets trouvés',
  path: ['secret_detail'],
})

type FormData = z.infer<typeof announcementSchema>

const STEPS = [
  { id: 1, title: 'Type d\'annonce' },
  { id: 2, title: 'Informations essentielles' },
  { id: 3, title: 'Photos & Vidéos' },
  { id: 4, title: 'Coordonnées' },
  { id: 5, title: 'Vérification' },
]

export default function PublicationForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [photos, setPhotos] = useState<File[]>([])
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [videoInput, setVideoInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countries, setCountries] = useState(staticCountries)
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const supabase = createSupabaseClient()
  const progressBarRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  // Charger les pays depuis la base de données au montage
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const dbCountries = await getCountriesFromDB()
        if (dbCountries.length > 0) {
          // Convertir les pays de la DB en format attendu
          const formattedCountries = await Promise.all(
            dbCountries.map(async (c) => ({
              name: c.name,
              code: c.code,
              cities: await getCitiesByCountryFromDB(c.name),
            }))
          )
          setCountries(formattedCountries)
        }
      } catch (err) {
        console.error('Erreur lors du chargement des pays:', err)
        // Utiliser les pays statiques en cas d'erreur
      }
    }
    loadCountries()
  }, [])

  // Effet pour scroller automatiquement vers l'étape actuelle sur mobile
  useEffect(() => {
    if (progressBarRef.current && stepRefs.current[currentStep - 1]) {
      const stepElement = stepRefs.current[currentStep - 1]
      const container = progressBarRef.current
      
      if (stepElement) {
        const stepLeft = stepElement.offsetLeft
        const stepWidth = stepElement.offsetWidth
        const containerWidth = container.offsetWidth
        const scrollLeft = stepLeft - (containerWidth / 2) + (stepWidth / 2)
        
        container.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: 'smooth'
        })
      }
    }
  }, [currentStep])

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      type: undefined,
      mode: undefined,
      urgency: 'normal',
      contact_visibility: 'members_only',
      contact_email: user?.email || '',
      country: 'Bénin',
      city: 'Cotonou',
    },
  })

  const selectedType = watch('type')
  const selectedMode = watch('mode')
  const selectedCountry = watch('country')

  // Charger les villes quand le pays change
  useEffect(() => {
    const loadCities = async () => {
      if (selectedCountry) {
        try {
          const dbCities = await getCitiesByCountryFromDB(selectedCountry)
          if (dbCities.length > 0) {
            setAvailableCities(dbCities)
          } else {
            // Fallback sur les villes statiques
            setAvailableCities(getCitiesByCountry(selectedCountry))
          }
        } catch (err) {
          console.error('Erreur lors du chargement des villes:', err)
          // Fallback sur les villes statiques
          setAvailableCities(getCitiesByCountry(selectedCountry))
        }
      } else {
        setAvailableCities([])
      }
    }
    loadCities()
  }, [selectedCountry])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (photos.length + files.length > 10) {
      setError('Maximum 10 photos autorisées')
      return
    }
    
    const newPhotos = [...photos, ...files]
    setPhotos(newPhotos)
    
    // Create preview URLs
    const newUrls = files.map(file => URL.createObjectURL(file))
    setPhotoUrls([...photoUrls, ...newUrls])
  }

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    const newUrls = photoUrls.filter((_, i) => i !== index)
    setPhotos(newPhotos)
    setPhotoUrls(newUrls)
  }

  const addVideo = () => {
    if (!videoInput.trim()) {
      setError('Veuillez entrer une URL YouTube ou Vimeo')
      return
    }

    // Validation basique de l'URL
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/
    
    if (!youtubeRegex.test(videoInput) && !vimeoRegex.test(videoInput)) {
      setError('URL invalide. Veuillez utiliser une URL YouTube ou Vimeo.')
      return
    }

    if (videos.includes(videoInput)) {
      setError('Cette vidéo a déjà été ajoutée')
      return
    }

    setVideos([...videos, videoInput])
    setVideoInput('')
    setError(null)
  }

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index))
  }

  const uploadPhotos = async (): Promise<string[]> => {
    if (photos.length === 0) return []
    
    const uploadedUrls: string[] = []
    
    try {
      for (const photo of photos) {
        const fileExt = photo.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `announcements/${fileName}`
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('photos')
          .upload(filePath, photo, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (uploadError) {
          console.error('Upload error:', uploadError)
          // Continue avec les autres photos même si une échoue
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
      // Si l'upload échoue complètement, on continue quand même sans photos
    }
    
    return uploadedUrls
  }

  const handleNext = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    console.log('🔵 [PublicationForm] handleNext appelé, étape actuelle:', currentStep)

    // Valider uniquement les champs de l'étape actuelle
    let isValid = true
    const fieldsToValidate: (keyof FormData)[] = []

    if (currentStep === 1) {
      // Étape 1: Type d'annonce (pas de validation nécessaire, juste selectedType)
      if (!selectedType) {
        setError('Veuillez sélectionner un type d\'annonce')
        return
      }
      // S'assurer que le type est bien enregistré dans le formulaire
      if (selectedType && !watch('type')) {
        setValue('type', selectedType as 'person' | 'animal' | 'object')
      }
      isValid = true
    } else if (currentStep === 2) {
      // Étape 2: Informations essentielles
      const currentType = watch('type')
      const currentMode = watch('mode')
      
      // Valider les champs de base
      fieldsToValidate.push('title', 'description', 'disappearance_date', 'country', 'city', 'urgency')
      
      // Si c'est un objet, valider aussi le mode
      if (currentType === 'object') {
        fieldsToValidate.push('mode')
        // Si objet trouvé, valider aussi le secret_detail
        if (currentMode === 'trouve') {
          fieldsToValidate.push('secret_detail')
        }
      }
      
      console.log('📋 [PublicationForm] Champs à valider pour étape 2:', fieldsToValidate)
      console.log('📋 [PublicationForm] Valeurs actuelles:', {
        type: currentType,
        mode: currentMode,
        title: watch('title'),
        description: watch('description'),
        disappearance_date: watch('disappearance_date'),
        country: watch('country'),
        city: watch('city'),
        urgency: watch('urgency'),
        secret_detail: watch('secret_detail'),
      })
    } else if (currentStep === 3) {
      // Étape 3: Photos & Vidéos (pas de validation obligatoire)
      isValid = true
    } else if (currentStep === 4) {
      // Étape 4: Coordonnées
      fieldsToValidate.push('contact_email', 'contact_visibility')
    }

    if (fieldsToValidate.length > 0) {
      isValid = await trigger(fieldsToValidate as any)
      console.log('📋 [PublicationForm] Validation des champs:', fieldsToValidate, 'Résultat:', isValid)
      
      // Si la validation échoue, vérifier quels champs ont des erreurs
      if (!isValid) {
        const errorMessages: string[] = []
        const values = watch()
        
        // Vérifier chaque champ individuellement
        for (const field of fieldsToValidate) {
          const fieldError = errors[field as keyof typeof errors]
          if (fieldError) {
            errorMessages.push(fieldError.message as string)
          } else if (!values[field as keyof FormData]) {
            // Si le champ est vide et n'a pas d'erreur spécifique
            const fieldLabel: Record<string, string> = {
              title: 'Le titre',
              description: 'La description',
              disappearance_date: 'La date',
              country: 'Le pays',
              city: 'La ville',
              urgency: 'L\'urgence',
              mode: 'Le mode (perdu/trouvé)',
              secret_detail: 'Le détail secret',
            }
            errorMessages.push(`${fieldLabel[field] || field} est obligatoire`)
          }
        }
        
        if (errorMessages.length > 0) {
          setError(errorMessages[0]) // Afficher la première erreur
        } else {
          setError('Veuillez remplir tous les champs obligatoires')
        }
        return // Ne pas passer à l'étape suivante
      }
    }

    if (isValid) {
      console.log('✅ [PublicationForm] Validation réussie, passage à l\'étape suivante')
      setError(null)
      setCurrentStep(currentStep + 1)
    } else {
      console.log('❌ [PublicationForm] Validation échouée')
      if (!error) {
        setError('Veuillez remplir tous les champs obligatoires')
      }
    }
  }

  const onSubmit = async (data: FormData) => {
    // Cette fonction est appelée uniquement à l'étape 5 (soumission finale)

    setIsSubmitting(true)
    setError(null)

    try {
      // Upload photos
      const photoUrls = await uploadPhotos()

      // Create announcement (non approuvée par défaut)
      const announcementData: any = {
        type: data.type,
        title: data.title,
        description: data.description,
        disappearance_date: data.disappearance_date,
        last_location: {
          country: data.country,
          city: data.city,
          address: data.address || null,
        },
        urgency: data.urgency,
        photos: photoUrls,
        videos: videos.length > 0 ? videos : null,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone || null,
        contact_other: data.contact_other || null,
        contact_visibility: data.contact_visibility,
        user_id: user?.id || null,
        status: 'pending', // En attente d'approbation admin
        approved: false, // Nécessite l'approbation de l'admin
      }

      // Ajouter mode et secret_detail pour les objets
      if (data.type === 'object') {
        announcementData.mode = data.mode
        if (data.mode === 'trouve' && data.secret_detail) {
          announcementData.secret_detail = data.secret_detail
        }
      }

      console.log('📝 [PublicationForm] Tentative d\'insertion annonce:', {
        user_id: announcementData.user_id,
        type: announcementData.type,
        title: announcementData.title,
        status: announcementData.status,
      })
      
      // Vérifier la session avant l'insertion
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('🔐 [PublicationForm] Session utilisateur:', {
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
        sessionError: sessionError?.message,
        currentUserId: user?.id,
        announcementUserId: announcementData.user_id,
      })
      
      // Toujours utiliser l'ID de la session si l'utilisateur est authentifié
      // Cela garantit que user_id correspond à auth.uid() pour RLS
      if (session?.user?.id) {
        console.log('✅ [PublicationForm] Utilisateur authentifié, utilisation de session.user.id:', session.user.id)
        announcementData.user_id = session.user.id
      } else {
        console.log('⚠️ [PublicationForm] Pas de session, création annonce anonyme (user_id = null)')
        announcementData.user_id = null
      }

      const { data: announcement, error: insertError } = await supabase
        .from('announcements')
        .insert([announcementData])
        .select()
        .single()

      if (insertError) {
        console.error('❌ [PublicationForm] Insert error:', insertError)
        console.error('❌ [PublicationForm] Détails erreur:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
        })
        throw new Error(insertError.message || 'Erreur lors de la création de l\'annonce')
      }

      if (!announcement) {
        throw new Error('L\'annonce n\'a pas pu être créée')
      }

      // Envoyer un email à l'admin pour approbation
      try {
        console.log('📧 [PublicationForm] Envoi notification admin pour annonce:', announcement.id)
        const notificationResponse = await fetch('/api/notifications/admin/announcement', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ announcementId: announcement.id }),
        })
        const notificationResult = await notificationResponse.json()
        console.log('📧 [PublicationForm] Résultat notification admin:', notificationResult)
        if (!notificationResponse.ok) {
          console.error('❌ [PublicationForm] Erreur notification admin:', notificationResult)
        }
      } catch (notificationError) {
        console.error('❌ [PublicationForm] Erreur lors de l\'envoi de la notification admin:', notificationError)
      }

      // Rediriger vers une page de confirmation d'attente d'approbation
      router.push('/annonces/en-attente')
    } catch (err: any) {
      console.error('Form submission error:', err)
      setError(err.message || 'Une erreur s\'est produite lors de la publication. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      {/* Progress bar */}
      <div className="mb-6 md:mb-8">
        {/* Barre de progression mobile avec scroll horizontal */}
        <div className="block md:hidden">
          <div 
            ref={progressBarRef}
            className="overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-2 min-w-max">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  ref={(el) => { stepRefs.current[index] = el }}
                  className="flex-shrink-0 w-20"
                >
                  <div
                    className={`h-1.5 rounded ${
                      step.id <= currentStep ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                  <p
                    className={`text-[9px] mt-1.5 text-center leading-tight whitespace-nowrap ${
                      step.id <= currentStep ? 'text-primary font-semibold' : 'text-gray-500'
                    }`}
                    title={step.title}
                  >
                    {step.id === 1 ? 'Type' : 
                     step.id === 2 ? 'Infos' :
                     step.id === 3 ? 'Médias' :
                     step.id === 4 ? 'Contact' : 'Vérif'}
                  </p>
                </div>
              ))}
            </div>
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

      {/* Step 1: Type */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Quel type d'annonce souhaitez-vous publier ?</h2>
          <p className="text-gray-600 mb-6">
            Sélectionnez le type d'annonce. Vous serez automatiquement dirigé vers l'étape suivante.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { value: 'person', label: '👤 Personne disparue', desc: 'Racontez l\'histoire, expliquez les circonstances et invitez la communauté à reconnaître quelqu\'un.' },
              { value: 'animal', label: '🐶 Animal perdu', desc: 'Décrivez l\'animal, la localisation et tout élément permettant de l\'identifier.' },
              { value: 'object', label: '📦 Objet perdu / trouvé', desc: 'Décrivez l\'objet, son importance et la zone où il a été perdu ou trouvé.' },
            ].map((option) => (
              <label
                key={option.value}
                onClick={() => {
                  const value = option.value as 'person' | 'animal' | 'object'
                  setValue('type', value, { shouldValidate: false })
                  // Si c'est un objet, on reste sur cette étape pour choisir le mode
                  if (value !== 'object') {
                    setTimeout(() => {
                      setCurrentStep(2)
                    }, 300)
                  }
                }}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedType === option.value
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  checked={selectedType === option.value}
                  onChange={() => {}}
                  className="sr-only"
                />
                <div className="font-bold text-lg mb-2">{option.label}</div>
                <div className="text-sm text-gray-600">{option.desc}</div>
              </label>
            ))}
          </div>

          {/* Choix du mode pour les objets */}
          {selectedType === 'object' && !selectedMode && (
            <div className="mt-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Quel est votre situation ?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <label
                  onClick={() => {
                    setValue('mode', 'perdu', { shouldValidate: false })
                    setTimeout(() => {
                      setCurrentStep(2)
                    }, 300)
                  }}
                  className="border-2 border-gray-200 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg hover:border-primary"
                >
                  <div className="font-bold text-lg mb-2 text-primary">🟥 Objet perdu</div>
                  <div className="text-sm text-gray-600">Vous avez perdu un objet et vous le recherchez</div>
                </label>
                <label
                  onClick={() => {
                    setValue('mode', 'trouve', { shouldValidate: false })
                    setTimeout(() => {
                      setCurrentStep(2)
                    }, 300)
                  }}
                  className="border-2 border-gray-200 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg hover:border-primary"
                >
                  <div className="font-bold text-lg mb-2 text-primary">🟦 Objet trouvé</div>
                  <div className="text-sm text-gray-600">Vous avez trouvé un objet et vous recherchez le propriétaire</div>
                </label>
              </div>
            </div>
          )}

          {selectedType && selectedType !== 'object' && (
            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary-dark">
                ✓ Type sélectionné : <strong>
                  {selectedType === 'person' ? '👤 Personne disparue' : 
                   '🐶 Animal perdu'}
                </strong>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Passage automatique à l'étape suivante...
              </p>
            </div>
          )}

          {selectedType === 'object' && selectedMode && (
            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary-dark">
                ✓ Type sélectionné : <strong>📦 Objet {selectedMode === 'perdu' ? 'perdu' : 'trouvé'}</strong>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Passage automatique à l'étape suivante...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Informations essentielles */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Informations essentielles</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de l'annonce *
            </label>
            <input
              {...register('title')}
              placeholder={
                selectedType === 'person'
                  ? 'Exemple : Personne disparue à Cotonou le 15 janvier'
                  : selectedType === 'animal'
                  ? 'Exemple : Chien perdu à Cotonou le 15 janvier'
                  : selectedMode === 'trouve'
                  ? 'Exemple : J\'ai trouvé un portefeuille à Cotonou'
                  : 'Exemple : Objet perdu à Cotonou le 15 janvier'
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description détaillée *
            </label>
            <textarea
              {...register('description')}
              rows={6}
              placeholder={
                selectedType === 'person'
                  ? 'Racontez l\'histoire de cette personne, les circonstances de sa disparition, description physique, vêtements portés...'
                  : selectedType === 'animal'
                  ? 'Décrivez votre animal : race, couleur, taille, particularités (puce, collier, cicatrices)...'
                  : selectedMode === 'trouve'
                  ? 'Décrivez l\'objet trouvé (sans dévoiler tous les détails) : type, couleur générale, lieu de trouvaille...'
                  : 'Décrivez l\'objet en détail : dimensions, couleur, marque, particularités, valeur...'
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Champ secret pour les objets trouvés */}
          {selectedType === 'object' && selectedMode === 'trouve' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔐 Détail secret (non visible publiquement) *
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  Indiquez une information secrète que seul le vrai propriétaire pourra connaître (ex: prénom sur la carte, numéro partiel, signe particulier, couleur exacte d'une housse...). Cette information ne sera pas affichée publiquement et servira à vérifier l'identité du propriétaire.
                </p>
                <textarea
                  {...register('secret_detail')}
                  rows={3}
                  placeholder="Exemple: Le prénom inscrit sur la carte d'identité commence par 'M', ou: La housse est de couleur bleu foncé avec un motif floral..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {errors.secret_detail && (
                  <p className="text-red-600 text-sm mt-1">{errors.secret_detail.message}</p>
                )}
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  id="security-check"
                  defaultChecked
                  className="mt-1"
                  readOnly
                />
                <label htmlFor="security-check" className="cursor-pointer">
                  Je ne montrerai l'objet qu'à une personne capable de prouver qu'il s'agit bien du sien.
                </label>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de disparition *
              </label>
              <input
                type="date"
                {...register('disappearance_date')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.disappearance_date && (
                <p className="text-red-600 text-sm mt-1">{errors.disappearance_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut d'urgence
              </label>
              <select
                {...register('urgency')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dernière localisation connue *
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <select
                  {...register('country')}
                  defaultValue="Bénin"
                  onChange={(e) => {
                    setValue('country', e.target.value)
                    setValue('city', '') // Réinitialiser la ville quand le pays change
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>
                )}
              </div>
              <div>
                {selectedCountry && availableCities.length > 0 ? (
                  <select
                    {...register('city')}
                    defaultValue=""
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Sélectionnez une ville</option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    {...register('city')}
                    placeholder="Cotonou"
                    defaultValue="Cotonou"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
                {errors.city && (
                  <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>
              <div>
                <input
                  {...register('address')}
                  placeholder="Quartier, rue (optionnel)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Photos & Vidéos */}
      {currentStep === 3 && (
        <div className="space-y-8">
          {/* Section Photos */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Ajouter des photos</h2>
            <p className="text-gray-600 mb-4">
              Les photos sont essentielles pour aider la communauté à reconnaître et retrouver. Ajoutez au moins une photo claire.
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
              <p className="text-sm text-gray-500 mt-2">Maximum 10 photos</p>
            </div>

            {photoUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
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
          </div>

          {/* Section Vidéos */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold mb-4">Ajouter des vidéos (optionnel)</h2>
            <p className="text-gray-600 mb-4">
              Les vidéos peuvent aider à mieux identifier la personne, l'animal ou l'objet. Ajoutez des liens YouTube ou Vimeo.
            </p>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={videoInput}
                  onChange={(e) => {
                    setVideoInput(e.target.value)
                    setError(null)
                  }}
                  placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addVideo()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addVideo}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              {videos.length > 0 && (
                <div className="space-y-3">
                  {videos.map((videoUrl, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Video className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{videoUrl}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-500">
                💡 Astuce : Copiez l'URL complète de la vidéo depuis YouTube ou Vimeo et collez-la ici.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Coordonnées */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Comment vous contacter ?</h2>
          <p className="text-gray-600 mb-4">
            Ces informations permettront à la communauté de vous joindre en cas d'information utile.
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
              <span className="font-semibold">Type :</span> {watch('type') === 'person' ? 'Personne disparue' : watch('type') === 'animal' ? 'Animal perdu' : 'Objet perdu'}
            </div>
            <div>
              <span className="font-semibold">Titre :</span> {watch('title')}
            </div>
            <div>
              <span className="font-semibold">Description :</span>
              <p className="mt-1 text-gray-700">{watch('description')}</p>
            </div>
            <div>
              <span className="font-semibold">Localisation :</span> {watch('city')}, {watch('country')}
            </div>
            <div>
              <span className="font-semibold">Date :</span> {watch('disappearance_date')}
            </div>
            <div>
              <span className="font-semibold">Photos :</span> {photos.length} photo(s)
            </div>
            {videos.length > 0 && (
              <div>
                <span className="font-semibold">Vidéos :</span> {videos.length} vidéo(s)
                <div className="mt-2 space-y-2">
                  {videos.map((videoUrl, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                      {videoUrl}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="sm:inline">Précédent</span>
            <span className="sm:hidden">Préc.</span>
          </button>
        )}
        <div className={`${currentStep > 1 ? 'sm:ml-auto' : 'sm:ml-auto'} w-full sm:w-auto order-1 sm:order-2`}>
          {currentStep === 5 ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-primary text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              {isSubmitting ? 'Publication...' : 'Publier l\'annonce'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting || (currentStep === 1 && !selectedType)}
              className="flex items-center justify-center gap-2 bg-primary text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              Suivant
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

