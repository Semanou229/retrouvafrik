'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createSupabaseClient } from '@/lib/supabase/client'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const advertiserSchema = z.object({
  company_name: z.string().min(2, 'Le nom de l\'entreprise est requis'),
  contact_name: z.string().min(2, 'Le nom du contact est requis'),
  contact_email: z.string().email('Email invalide'),
  contact_phone: z.string().optional(),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  description: z.string().min(50, 'La description doit contenir au moins 50 caractères'),
  budget_range: z.enum(['< 100€', '100€ - 500€', '500€ - 1000€', '1000€ - 5000€', '> 5000€', 'À discuter']),
  target_audience: z.string().optional(),
})

type FormData = z.infer<typeof advertiserSchema>

export default function AdvertiserForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(advertiserSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const { error: insertError } = await supabase
        .from('ad_requests')
        .insert([
          {
            company_name: data.company_name,
            contact_name: data.contact_name,
            contact_email: data.contact_email,
            contact_phone: data.contact_phone || null,
            website: data.website || null,
            description: data.description,
            budget_range: data.budget_range,
            target_audience: data.target_audience || null,
            status: 'pending',
          },
        ])

      if (insertError) {
        throw new Error(insertError.message || 'Erreur lors de l\'envoi de la demande')
      }

      setSuccess(true)
      reset()

      // Envoyer une notification à l'admin
      try {
        await fetch('/api/admin/notify-ad-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyName: data.company_name,
            contactEmail: data.contact_email,
          }),
        })
      } catch (notificationError) {
        console.error('Erreur notification admin:', notificationError)
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur s\'est produite. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-900 mb-2">Demande envoyée avec succès !</h3>
        <p className="text-green-700">
          Merci pour votre intérêt. Notre équipe vous contactera dans les plus brefs délais à l'adresse email fournie.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de l'entreprise *
          </label>
          <input
            {...register('company_name')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ex: Ma Société SARL"
          />
          {errors.company_name && (
            <p className="text-red-500 text-sm mt-1">{errors.company_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du contact *
          </label>
          <input
            {...register('contact_name')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ex: Jean Dupont"
          />
          {errors.contact_name && (
            <p className="text-red-500 text-sm mt-1">{errors.contact_name.message}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email de contact *
          </label>
          <input
            {...register('contact_email')}
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="contact@entreprise.com"
          />
          {errors.contact_email && (
            <p className="text-red-500 text-sm mt-1">{errors.contact_email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <input
            {...register('contact_phone')}
            type="tel"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="+225 07 12 34 56 78"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site web
        </label>
        <input
          {...register('website')}
          type="url"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="https://www.entreprise.com"
        />
        {errors.website && (
          <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description de votre projet publicitaire *
        </label>
        <textarea
          {...register('description')}
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Décrivez votre projet, vos objectifs, votre public cible..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget estimé *
          </label>
          <select
            {...register('budget_range')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Sélectionnez un budget</option>
            <option value="< 100€">Moins de 100€</option>
            <option value="100€ - 500€">100€ - 500€</option>
            <option value="500€ - 1000€">500€ - 1000€</option>
            <option value="1000€ - 5000€">1000€ - 5000€</option>
            <option value="> 5000€">Plus de 5000€</option>
            <option value="À discuter">À discuter</option>
          </select>
          {errors.budget_range && (
            <p className="text-red-500 text-sm mt-1">{errors.budget_range.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Public cible (optionnel)
          </label>
          <input
            {...register('target_audience')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ex: Jeunes adultes 18-35 ans, Côte d'Ivoire"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Envoi en cours...</span>
          </>
        ) : (
          'Envoyer la demande'
        )}
      </button>
    </form>
  )
}

