'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AnnouncementCard from './AnnouncementCard'
import AdBanner from './AdBanner'
import { Filter, Search, TrendingUp, Clock, Eye, Sparkles } from 'lucide-react'
import type { Announcement } from '@/lib/types'
import { getCountriesFromDB, getCitiesByCountryFromDB } from '@/lib/countries-cities-db'
import { countries as staticCountries, getCitiesByCountry } from '@/lib/countries-cities'

interface AnnouncementsPageProps {
  announcements: Announcement[]
  initialFilters?: {
    category?: string
    city?: string
    country?: string
    date_from?: string
    date_to?: string
    gender?: string
    age_min?: string
    age_max?: string
    object_type?: string
    object_mode?: string
    animal_species?: string
    animal_breed?: string
    lost_sight?: string
    sort?: string
    view?: string
  }
  initialCountries?: Array<{ id: string; name: string; code: string }>
}

export default function AnnouncementsPage({ announcements, initialFilters, initialCountries }: AnnouncementsPageProps) {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(true) // Ouvert par défaut
  const [activeView, setActiveView] = useState<'recent' | 'popular' | 'recognize'>(
    (initialFilters?.view as 'recent' | 'popular' | 'recognize') || 'recent'
  )

  // Filter states
  const [category, setCategory] = useState(initialFilters?.category || '')
  const [city, setCity] = useState(initialFilters?.city || '')
  const [country, setCountry] = useState(initialFilters?.country || '')
  const [countries, setCountries] = useState(
    initialCountries?.map(c => ({ name: c.name, code: c.code, cities: [] })) || staticCountries
  )
  const [availableCities, setAvailableCities] = useState<string[]>([])

  // Charger les pays depuis la base de données si non fournis
  useEffect(() => {
    if (initialCountries && initialCountries.length > 0) {
      return // Déjà fournis par le serveur
    }
    
    const loadCountries = async () => {
      try {
        const dbCountries = await getCountriesFromDB()
        if (dbCountries.length > 0) {
          const formattedCountries = dbCountries.map(c => ({
            name: c.name,
            code: c.code,
            cities: [], // Les villes seront chargées dynamiquement
          }))
          setCountries(formattedCountries)
        }
      } catch (err) {
        console.error('Erreur lors du chargement des pays:', err)
      }
    }
    loadCountries()
  }, [initialCountries])

  // Charger les villes quand le pays change
  useEffect(() => {
    const loadCities = async () => {
      if (country) {
        try {
          const dbCities = await getCitiesByCountryFromDB(country)
          if (dbCities.length > 0) {
            setAvailableCities(dbCities)
          } else {
            setAvailableCities(getCitiesByCountry(country))
          }
        } catch (err) {
          console.error('Erreur lors du chargement des villes:', err)
          setAvailableCities(getCitiesByCountry(country))
        }
      } else {
        setAvailableCities([])
      }
    }
    loadCities()
  }, [country])
  const [dateFrom, setDateFrom] = useState(initialFilters?.date_from || '')
  const [dateTo, setDateTo] = useState(initialFilters?.date_to || '')
  const [gender, setGender] = useState(initialFilters?.gender || '')
  const [ageMin, setAgeMin] = useState(initialFilters?.age_min || '')
  const [ageMax, setAgeMax] = useState(initialFilters?.age_max || '')
  const [objectType, setObjectType] = useState(initialFilters?.object_type || '')
  const [objectMode, setObjectMode] = useState<'perdu' | 'trouve' | ''>(initialFilters?.object_mode as 'perdu' | 'trouve' | '' || '')
  const [lostSight, setLostSight] = useState(initialFilters?.lost_sight || '')
  const [animalSpecies, setAnimalSpecies] = useState(initialFilters?.animal_species || '')
  const [animalBreed, setAnimalBreed] = useState(initialFilters?.animal_breed || '')

  // Apply filters
  const filteredAnnouncements = useMemo(() => {
    let filtered = [...announcements]

    if (category) {
      filtered = filtered.filter(a => a.type === category)
    }
    if (city) {
      filtered = filtered.filter(a => 
        a.last_location.city?.toLowerCase().includes(city.toLowerCase())
      )
    }
    if (country) {
      filtered = filtered.filter(a => 
        a.last_location.country?.toLowerCase().includes(country.toLowerCase())
      )
    }
    if (dateFrom) {
      filtered = filtered.filter(a => new Date(a.disappearance_date) >= new Date(dateFrom))
    }
    if (dateTo) {
      filtered = filtered.filter(a => new Date(a.disappearance_date) <= new Date(dateTo))
    }
    if (gender && category === 'person') {
      filtered = filtered.filter(a => 
        a.description.toLowerCase().includes(gender.toLowerCase())
      )
    }
    if (objectType && category === 'object') {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(objectType.toLowerCase()) ||
        a.description.toLowerCase().includes(objectType.toLowerCase())
      )
    }
    if (objectMode && category === 'object') {
      filtered = filtered.filter(a => a.mode === objectMode)
    }
    if (lostSight && category === 'person') {
      if (lostSight === 'true') {
        filtered = filtered.filter(a => a.is_lost_sight === true)
      } else if (lostSight === 'false') {
        filtered = filtered.filter(a => a.is_lost_sight !== true)
      }
    }
    if (animalSpecies && category === 'animal') {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(animalSpecies.toLowerCase()) ||
        a.description.toLowerCase().includes(animalSpecies.toLowerCase())
      )
    }
    if (animalBreed && category === 'animal') {
      filtered = filtered.filter(a => 
        a.description.toLowerCase().includes(animalBreed.toLowerCase())
      )
    }

    // Apply view filters
    if (activeView === 'popular') {
      filtered = filtered.sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    } else if (activeView === 'recognize') {
      filtered = filtered.filter(a => a.type === 'person' && a.is_lost_sight === true)
    } else {
      filtered = filtered.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }

    return filtered
  }, [announcements, category, city, country, dateFrom, dateTo, gender, ageMin, ageMax, objectType, objectMode, lostSight, animalSpecies, animalBreed, activeView])

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    if (category) params.set('category', category)
    if (city) params.set('city', city)
    if (country) params.set('country', country)
    if (dateFrom) params.set('date_from', dateFrom)
    if (dateTo) params.set('date_to', dateTo)
    if (gender) params.set('gender', gender)
    if (ageMin) params.set('age_min', ageMin)
    if (ageMax) params.set('age_max', ageMax)
    if (objectType) params.set('object_type', objectType)
    if (objectMode) params.set('object_mode', objectMode)
    if (lostSight) params.set('lost_sight', lostSight)
    if (animalSpecies) params.set('animal_species', animalSpecies)
    if (animalBreed) params.set('animal_breed', animalBreed)
    if (activeView) params.set('view', activeView)
    
    router.push(`/annonces?${params.toString()}`)
  }

  const clearFilters = () => {
    setCategory('')
    setCity('')
    setCountry('')
    setDateFrom('')
    setDateTo('')
    setGender('')
    setAgeMin('')
    setAgeMax('')
    setObjectType('')
    setObjectMode('')
    setLostSight('')
    setAnimalSpecies('')
    setAnimalBreed('')
    router.push('/annonces')
  }

  const hasActiveFilters = category || city || country || dateFrom || dateTo || gender || ageMin || ageMax || objectType || objectMode || lostSight || animalSpecies || animalBreed

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Annonces</h1>
        <p className="text-gray-600">
          Parcourez toutes les annonces et utilisez les filtres pour trouver ce que vous cherchez
        </p>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveView('recent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'recent'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Récentes</span>
          </button>
          <button
            onClick={() => setActiveView('popular')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'popular'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Populaires</span>
          </button>
          <button
            onClick={() => setActiveView('recognize')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'recognize'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Vous pourriez reconnaître...</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span className="font-semibold">Filtres</span>
            {hasActiveFilters && (
              <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                Actifs
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="p-6 space-y-6 border-t border-gray-200">
            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Toutes les catégories</option>
                <option value="person">👤 Personne disparue</option>
                <option value="animal">🐶 Animal perdu</option>
                <option value="object">📦 Objet perdu / volé</option>
              </select>
            </div>

            {/* Localisation */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pays
                </label>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value)
                    setCity('') // Réinitialiser la ville quand le pays change
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Tous les pays</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville
                </label>
                {country && availableCities.length > 0 ? (
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Toutes les villes</option>
                    {availableCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Cotonou"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
              </div>
            </div>

            {/* Date */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de disparition (du)
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de disparition (au)
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtres spécifiques pour Personnes */}
            {category === 'person' && (
              <div className="bg-primary/5 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-primary">Filtres pour personnes</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={lostSight}
                      onChange={(e) => setLostSight(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Tous (disparues et perdues de vue)</option>
                      <option value="false">👤 Personnes disparues</option>
                      <option value="true">💭 Perdu de vue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Genre
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Tous</option>
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Âge minimum
                    </label>
                    <input
                      type="number"
                      value={ageMin}
                      onChange={(e) => setAgeMin(e.target.value)}
                      placeholder="Ex: 18"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Âge maximum
                    </label>
                    <input
                      type="number"
                      value={ageMax}
                      onChange={(e) => setAgeMax(e.target.value)}
                      placeholder="Ex: 65"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Filtres spécifiques pour Animaux */}
            {category === 'animal' && (
              <div className="bg-primary/5 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-primary">Filtres pour animaux</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Espèce
                    </label>
                    <input
                      type="text"
                      value={animalSpecies}
                      onChange={(e) => setAnimalSpecies(e.target.value)}
                      placeholder="Ex: Chien, Chat, Oiseau..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Race
                    </label>
                    <input
                      type="text"
                      value={animalBreed}
                      onChange={(e) => setAnimalBreed(e.target.value)}
                      placeholder="Ex: Berger allemand, Persan..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Filtres spécifiques pour Objets */}
            {category === 'object' && (
              <div className="bg-primary/5 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-primary">Filtres pour objets</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode
                    </label>
                    <select
                      value={objectMode}
                      onChange={(e) => setObjectMode(e.target.value as 'perdu' | 'trouve' | '')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Tous (perdus et trouvés)</option>
                      <option value="perdu">🟥 Objets perdus</option>
                      <option value="trouve">🟦 Objets trouvés</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'objet
                    </label>
                    <input
                      type="text"
                      value={objectType}
                      onChange={(e) => setObjectType(e.target.value)}
                      placeholder="Ex: Portefeuille, Téléphone, Clés..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={applyFilters}
                className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Appliquer les filtres
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {activeView === 'recent' && 'Annonces récentes'}
            {activeView === 'popular' && 'Annonces populaires'}
            {activeView === 'recognize' && 'Vous pourriez reconnaître...'}
          </h2>
          <span className="text-gray-600">
            {filteredAnnouncements.length} annonce(s) trouvée(s)
          </span>
        </div>

        {filteredAnnouncements.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <p className="text-gray-600 text-lg mb-4">
              Aucune annonce ne correspond à vos critères.
            </p>
            <p className="text-gray-500 mb-6">
              Essayez de modifier vos filtres ou consultez toutes les annonces.
            </p>
            <button
              onClick={clearFilters}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Voir toutes les annonces
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

