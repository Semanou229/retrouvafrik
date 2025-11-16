'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Heart, Save, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'

interface DonationSetting {
  id: string
  title: string
  description: string | null
  donation_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function DonationSettingsManager() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [settings, setSettings] = useState<DonationSetting | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [donationUrl, setDonationUrl] = useState('')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('donation_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Error loading settings:', error)
        setError('Erreur lors du chargement des paramètres: ' + error.message)
        setLoading(false)
        return
      }

      if (data) {
        setSettings(data)
        setTitle(data.title)
        setDescription(data.description || '')
        setDonationUrl(data.donation_url)
        setIsActive(data.is_active)
      }
    } catch (err: any) {
      console.error('Error:', err)
      setError('Erreur lors du chargement: ' + (err.message || 'Erreur inconnue'))
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !donationUrl.trim()) {
      setError('Le titre et l\'URL sont obligatoires')
      return
    }

    // Validation URL
    try {
      new URL(donationUrl)
    } catch {
      setError('URL invalide. Veuillez entrer une URL complète (ex: https://paypal.me/retrouvafrik)')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      if (settings) {
        // Update existing
        const { error: updateError } = await supabase
          .from('donation_settings')
          .update({
            title: title.trim(),
            description: description.trim() || null,
            donation_url: donationUrl.trim(),
            is_active: isActive,
          })
          .eq('id', settings.id)

        if (updateError) throw updateError
      } else {
        // Create new
        const { error: insertError } = await supabase
          .from('donation_settings')
          .insert({
            title: title.trim(),
            description: description.trim() || null,
            donation_url: donationUrl.trim(),
            is_active: isActive,
          })

        if (insertError) throw insertError
      }

      setSuccess('Paramètres de don enregistrés avec succès !')
      setTimeout(() => {
        setSuccess(null)
        router.refresh()
      }, 2000)
    } catch (err: any) {
      console.error('Error saving:', err)
      setError(err.message || 'Erreur lors de l\'enregistrement')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des dons</h2>
            <p className="text-gray-600">Configurez les liens et messages pour les dons</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du bouton de don *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Faites un don, Soutenez RetrouvAfrik..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ce titre apparaîtra sur les boutons et dans le popup
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Ex: Votre don nous aide à maintenir la plateforme et à aider plus de personnes"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Description qui apparaîtra sur la page de don
            </p>
          </div>

          {/* Donation URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL du lien de don *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={donationUrl}
                onChange={(e) => setDonationUrl(e.target.value)}
                placeholder="https://paypal.me/retrouvafrik ou https://stripe.com/..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {donationUrl && (
                <a
                  href={donationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                  title="Tester le lien"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              URL complète vers votre plateforme de paiement (PayPal, Stripe, etc.)
            </p>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
              Activer les appels aux dons
            </label>
            <p className="text-xs text-gray-500 ml-auto">
              Si désactivé, les popups et boutons de don seront masqués
            </p>
          </div>

          {/* Preview */}
          <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
            <h3 className="font-semibold text-gray-900 mb-4">Aperçu</h3>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">{description || 'Description du don'}</p>
                <a
                  href={donationUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  {title || 'Faites un don'}
                </a>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={saving || !title.trim() || !donationUrl.trim()}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Enregistrer les paramètres
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

