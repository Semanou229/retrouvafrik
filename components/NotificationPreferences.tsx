'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers'
import { Bell, BellOff, MapPin, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { getCountriesFromDB, getCitiesByCountryFromDB } from '@/lib/countries-cities-db'
import { countries as staticCountries, getCitiesByCountry } from '@/lib/countries-cities'

interface NotificationPreference {
  id: string
  country: string
  city: string | null
  notify_on_new_announcement: boolean
  notify_on_same_city: boolean
  notify_on_same_country: boolean
}

export default function NotificationPreferences() {
  const { user } = useAuth()
  const supabase = createSupabaseClient()
  const [preferences, setPreferences] = useState<NotificationPreference[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [countries, setCountries] = useState(staticCountries)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [availableCities, setAvailableCities] = useState<string[]>([])

  // Charger les pays depuis la base de données
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const dbCountries = await getCountriesFromDB()
        if (dbCountries.length > 0) {
          const formattedCountries = dbCountries.map(c => ({
            name: c.name,
            code: c.code,
            cities: [],
          }))
          setCountries(formattedCountries)
        }
      } catch (err) {
        console.error('Erreur lors du chargement des pays:', err)
      }
    }
    loadCountries()
  }, [])

  // Charger les villes quand le pays change
  useEffect(() => {
    const loadCities = async () => {
      if (selectedCountry) {
        try {
          const dbCities = await getCitiesByCountryFromDB(selectedCountry)
          if (dbCities.length > 0) {
            setAvailableCities(dbCities)
          } else {
            setAvailableCities(getCitiesByCountry(selectedCountry))
          }
        } catch (err) {
          console.error('Erreur lors du chargement des villes:', err)
          setAvailableCities(getCitiesByCountry(selectedCountry))
        }
      } else {
        setAvailableCities([])
      }
    }
    loadCities()
  }, [selectedCountry])

  // Charger les préférences existantes et créer une préférence par défaut avec le pays de l'utilisateur
  useEffect(() => {
    if (user) {
      loadPreferences()
    }
  }, [user])

  useEffect(() => {
    if (user && preferences.length === 0) {
      createDefaultPreference()
    }
  }, [user, preferences.length])

  const createDefaultPreference = async () => {
    if (!user) return
    
    try {
      // Vérifier si l'utilisateur a déjà des préférences
      const { data: existingPrefs } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)

      if (existingPrefs && existingPrefs.length > 0) {
        return // L'utilisateur a déjà des préférences
      }

      // Récupérer le pays de l'utilisateur depuis ses métadonnées ou ses annonces
      let userCountry = user.user_metadata?.location_country || user.user_metadata?.country
      
      // Si pas de pays dans les métadonnées, chercher dans les annonces de l'utilisateur
      if (!userCountry) {
        try {
          const { data: userAnnouncements } = await supabase
            .from('announcements')
            .select('last_location')
            .eq('user_id', user.id)
            .not('last_location', 'is', null)
            .limit(1)
            .single()
          
          if (userAnnouncements?.last_location?.country) {
            userCountry = userAnnouncements.last_location.country
          }
        } catch (err) {
          // Pas d'annonce ou erreur, on continue sans pays
          console.log('Pas de pays trouvé dans les annonces')
        }
      }
      
      // Si toujours pas de pays, utiliser le pays depuis last_location des annonces récentes
      if (!userCountry) {
        try {
          const { data: recentAnnouncements } = await supabase
            .from('announcements')
            .select('last_location')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)
          
          if (recentAnnouncements && recentAnnouncements.length > 0) {
            const announcementWithCountry = recentAnnouncements.find(
              (a: any) => a.last_location?.country
            )
            if (announcementWithCountry?.last_location?.country) {
              userCountry = announcementWithCountry.last_location.country
            }
          }
        } catch (err) {
          console.error('Erreur récupération pays depuis annonces:', err)
        }
      }
      
      // Créer une préférence par défaut avec le pays trouvé
      // Si pas de pays, on ne crée pas de préférence (l'utilisateur devra en créer une manuellement)
      if (userCountry) {
        console.log('📧 [NotificationPreferences] Création préférence par défaut avec pays:', userCountry)
        const { error } = await supabase
          .from('user_notification_preferences')
          .insert({
            user_id: user.id,
            country: userCountry,
            city: null,
            notify_on_new_announcement: true, // Par défaut, recevoir les emails sauf si décoché
            notify_on_same_city: false,
            notify_on_same_country: true,
          })

        if (!error) {
          console.log('✅ [NotificationPreferences] Préférence par défaut créée')
          await loadPreferences()
        } else {
          console.error('❌ [NotificationPreferences] Erreur création préférence:', error)
        }
      } else {
        console.log('⚠️ [NotificationPreferences] Pas de pays trouvé pour créer préférence par défaut')
      }
    } catch (err) {
      console.error('Erreur lors de la création de la préférence par défaut:', err)
    }
  }

  const loadPreferences = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPreferences(data || [])
    } catch (error: any) {
      console.error('Erreur lors du chargement des préférences:', error)
      setMessage({ type: 'error', text: 'Erreur lors du chargement des préférences' })
    } finally {
      setLoading(false)
    }
  }

  const addPreference = async () => {
    if (!user || !selectedCountry) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner au moins un pays' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .insert({
          user_id: user.id,
          country: selectedCountry,
          city: selectedCity || null,
          notify_on_new_announcement: true,
          notify_on_same_city: !!selectedCity,
          notify_on_same_country: !selectedCity,
        })

      if (error) throw error

      setMessage({ type: 'success', text: 'Préférence ajoutée avec succès' })
      setSelectedCountry('')
      setSelectedCity('')
      await loadPreferences()
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout:', error)
      setMessage({ type: 'error', text: error.message || 'Erreur lors de l\'ajout' })
    } finally {
      setSaving(false)
    }
  }

  const updatePreference = async (id: string, updates: Partial<NotificationPreference>) => {
    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Préférence mise à jour' })
      await loadPreferences()
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error)
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la mise à jour' })
    } finally {
      setSaving(false)
    }
  }

  const deletePreference = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette préférence ?')) return

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Préférence supprimée' })
      await loadPreferences()
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error)
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la suppression' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Message de statut */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Ajouter une nouvelle préférence */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Ajouter un secteur de notification</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pays *
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value)
                setSelectedCity('')
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Sélectionner un pays</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville (optionnel)
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedCountry}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Toutes les villes</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Si vous ne sélectionnez pas de ville, vous recevrez des notifications pour tout le pays
            </p>
          </div>

          <div className="flex items-end">
            <button
              onClick={addPreference}
              disabled={!selectedCountry || saving}
              className="w-full bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              {saving ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>

      {/* Liste des préférences */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Mes secteurs de notification</h2>
        </div>

        {preferences.length === 0 ? (
          <div className="text-center py-12">
            <BellOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">
              Vous n'avez pas encore configuré de secteur de notification.
            </p>
            <p className="text-gray-500 text-sm">
              Ajoutez un secteur ci-dessus pour recevoir des emails lorsqu'une nouvelle annonce est publiée dans ce secteur.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {preferences.map((pref) => (
              <div
                key={pref.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {pref.city ? `${pref.city}, ${pref.country}` : pref.country}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {pref.city ? 'Ville spécifique' : 'Tout le pays'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pref.notify_on_new_announcement}
                          onChange={(e) =>
                            updatePreference(pref.id, {
                              notify_on_new_announcement: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-primary rounded focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">Recevoir des emails pour les annonces d'autres utilisateurs</span>
                      </label>

                      {pref.city && (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pref.notify_on_same_city}
                            onChange={(e) =>
                              updatePreference(pref.id, {
                                notify_on_same_city: e.target.checked,
                                notify_on_same_country: !e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-primary rounded focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">Uniquement ma ville</span>
                        </label>
                      )}

                      {!pref.city && (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pref.notify_on_same_country}
                            onChange={(e) =>
                              updatePreference(pref.id, {
                                notify_on_same_country: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-primary rounded focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">Tout le pays</span>
                        </label>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deletePreference(pref.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Comment ça fonctionne ?</p>
            <p className="mb-2">
              Lorsqu'une nouvelle annonce est publiée dans un secteur que vous avez configuré, vous recevrez automatiquement un email de notification.
            </p>
            <p>
              Vous pouvez ajouter plusieurs secteurs (pays ou villes) pour recevoir des notifications sur différentes zones géographiques.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

