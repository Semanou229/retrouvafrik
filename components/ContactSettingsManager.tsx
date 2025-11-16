'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Mail, Phone, MapPin, Clock, Save, AlertCircle, CheckCircle } from 'lucide-react'

interface ContactSetting {
  id: string
  email: string
  phone: string | null
  address: string | null
  hours: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function ContactSettingsManager() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [settings, setSettings] = useState<ContactSetting | null>(null)

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [hours, setHours] = useState('')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error)
        setError('Erreur lors du chargement des paramètres')
        return
      }

      if (data) {
        setSettings(data)
        setEmail(data.email)
        setPhone(data.phone || '')
        setAddress(data.address || '')
        setHours(data.hours || '')
        setIsActive(data.is_active)
      }
    } catch (err: any) {
      console.error('Error:', err)
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!email.trim()) {
      setError('L\'email est obligatoire')
      return
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Email invalide')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      if (settings) {
        // Update existing
        const { error: updateError } = await supabase
          .from('contact_settings')
          .update({
            email: email.trim(),
            phone: phone.trim() || null,
            address: address.trim() || null,
            hours: hours.trim() || null,
            is_active: isActive,
          })
          .eq('id', settings.id)

        if (updateError) throw updateError
      } else {
        // Create new
        const { error: insertError } = await supabase
          .from('contact_settings')
          .insert({
            email: email.trim(),
            phone: phone.trim() || null,
            address: address.trim() || null,
            hours: hours.trim() || null,
            is_active: isActive,
          })

        if (insertError) throw insertError
      }

      setSuccess('Paramètres de contact enregistrés avec succès !')
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
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des coordonnées de contact</h2>
            <p className="text-gray-600">Configurez les informations de contact affichées sur la page Contact</p>
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
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email de contact *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@retrouvafrik.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email affiché sur la page Contact et utilisé pour les demandes
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Téléphone (optionnel)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+229 XX XX XX XX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Numéro de téléphone affiché sur la page Contact
            </p>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Adresse (optionnel)
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              placeholder="Cotonou, Bénin"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Adresse physique affichée sur la page Contact
            </p>
          </div>

          {/* Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Horaires (optionnel)
            </label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Lundi - Vendredi, 9h - 18h"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Horaires d'ouverture affichés sur la page Contact
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
              Activer les coordonnées de contact
            </label>
            <p className="text-xs text-gray-500 ml-auto">
              Si désactivé, les coordonnées ne seront pas affichées publiquement
            </p>
          </div>

          {/* Preview */}
          <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
            <h3 className="font-semibold text-gray-900 mb-4">Aperçu</h3>
            <div className="space-y-3 bg-white p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{email || 'Non défini'}</p>
                </div>
              </div>
              {phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Téléphone</p>
                    <p className="text-sm text-gray-600">{phone}</p>
                  </div>
                </div>
              )}
              {address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Adresse</p>
                    <p className="text-sm text-gray-600">{address}</p>
                  </div>
                </div>
              )}
              {hours && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Horaires</p>
                    <p className="text-sm text-gray-600">{hours}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={saving || !email.trim()}
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
                  Enregistrer les coordonnées
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

