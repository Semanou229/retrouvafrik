'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, Save, X, Globe, MapPin, Loader2 } from 'lucide-react'

interface Country {
  id: string
  name: string
  code: string
}

interface City {
  id: string
  name: string
  country_id: string
  country?: {
    name: string
  }
}

interface CountriesCitiesManagerProps {
  initialCountries: Country[]
  initialCities: City[]
}

export default function CountriesCitiesManager({
  initialCountries,
  initialCities,
}: CountriesCitiesManagerProps) {
  const [countries, setCountries] = useState<Country[]>(initialCountries)
  const [cities, setCities] = useState<City[]>(initialCities)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // États pour l'édition
  const [editingCountry, setEditingCountry] = useState<string | null>(null)
  const [editingCity, setEditingCity] = useState<string | null>(null)
  const [newCountryName, setNewCountryName] = useState('')
  const [newCountryCode, setNewCountryCode] = useState('')
  const [newCityName, setNewCityName] = useState('')
  const [showAddCountry, setShowAddCountry] = useState(false)
  const [showAddCity, setShowAddCity] = useState(false)

  const supabase = createSupabaseClient()

  const filteredCities = selectedCountry
    ? cities.filter(c => c.country_id === selectedCountry)
    : cities

  const handleAddCountry = async () => {
    if (!newCountryName.trim() || !newCountryCode.trim()) {
      setError('Veuillez remplir tous les champs')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: insertError } = await supabase
        .from('countries')
        .insert([{ name: newCountryName.trim(), code: newCountryCode.trim().toUpperCase() }])
        .select()
        .single()

      if (insertError) throw insertError

      setCountries([...countries, data])
      setNewCountryName('')
      setNewCountryCode('')
      setShowAddCountry(false)
      setSuccess('Pays ajouté avec succès !')
      setTimeout(() => setSuccess(null), 3000)
      // Rafraîchir la page pour mettre à jour les données
      window.location.reload()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout du pays')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCountry = async (id: string, name: string, code: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('countries')
        .update({ name: name.trim(), code: code.trim().toUpperCase() })
        .eq('id', id)

      if (updateError) throw updateError

      setCountries(countries.map(c => c.id === id ? { ...c, name, code } : c))
      setEditingCountry(null)
      setSuccess('Pays modifié avec succès !')
      setTimeout(() => setSuccess(null), 3000)
      // Rafraîchir la page pour mettre à jour les données
      setTimeout(() => window.location.reload(), 1000)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification du pays')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCountry = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce pays ? Toutes ses villes seront également supprimées.')) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('countries')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setCountries(countries.filter(c => c.id !== id))
      setCities(cities.filter(c => c.country_id !== id))
      setSelectedCountry(null)
      setSuccess('Pays supprimé avec succès !')
      setTimeout(() => setSuccess(null), 3000)
      // Rafraîchir la page pour mettre à jour les données
      setTimeout(() => window.location.reload(), 1000)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression du pays')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCity = async () => {
    if (!newCityName.trim() || !selectedCountry) {
      setError('Veuillez sélectionner un pays et entrer un nom de ville')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: insertError } = await supabase
        .from('cities')
        .insert([{ name: newCityName.trim(), country_id: selectedCountry }])
        .select('*, country:countries(name)')
        .single()

      if (insertError) throw insertError

      setCities([...cities, data])
      setNewCityName('')
      setShowAddCity(false)
      setSuccess('Ville ajoutée avec succès !')
      setTimeout(() => setSuccess(null), 3000)
      // Rafraîchir la page pour mettre à jour les données
      setTimeout(() => window.location.reload(), 1000)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout de la ville')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCity = async (id: string, name: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('cities')
        .update({ name: name.trim() })
        .eq('id', id)

      if (updateError) throw updateError

      setCities(cities.map(c => c.id === id ? { ...c, name } : c))
      setEditingCity(null)
      setSuccess('Ville modifiée avec succès !')
      setTimeout(() => setSuccess(null), 3000)
      // Rafraîchir la page pour mettre à jour les données
      setTimeout(() => window.location.reload(), 1000)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification de la ville')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCity = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette ville ?')) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('cities')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setCities(cities.filter(c => c.id !== id))
      setSuccess('Ville supprimée avec succès !')
      setTimeout(() => setSuccess(null), 3000)
      // Rafraîchir la page pour mettre à jour les données
      setTimeout(() => window.location.reload(), 1000)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de la ville')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Gestion des Pays et Villes</h1>
        </div>
        <p className="text-orange-100">Administrez la liste des pays et villes disponibles dans RetrouvAfrik</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <X className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <Save className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Section Pays */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary" />
                Pays ({countries.length})
              </h2>
              <button
                onClick={() => setShowAddCountry(!showAddCountry)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          </div>

          {/* Formulaire d'ajout */}
          {showAddCountry && (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du pays *
                  </label>
                  <input
                    type="text"
                    value={newCountryName}
                    onChange={(e) => setNewCountryName(e.target.value)}
                    placeholder="Ex: Bénin"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code pays (2 lettres) *
                  </label>
                  <input
                    type="text"
                    value={newCountryCode}
                    onChange={(e) => setNewCountryCode(e.target.value.toUpperCase())}
                    placeholder="Ex: BJ"
                    maxLength={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCountry}
                    disabled={isLoading}
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Ajouter'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCountry(false)
                      setNewCountryName('')
                      setNewCountryCode('')
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Liste des pays */}
          <div className="p-6">
            <div className="space-y-2">
              {countries.map((country) => (
                <div
                  key={country.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {editingCountry === country.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        defaultValue={country.name}
                        onBlur={(e) => {
                          const newName = e.target.value
                          const codeInput = document.getElementById(`code-${country.id}`) as HTMLInputElement
                          if (newName !== country.name || codeInput.value !== country.code) {
                            handleUpdateCountry(country.id, newName, codeInput.value)
                          } else {
                            setEditingCountry(null)
                          }
                        }}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                      <input
                        id={`code-${country.id}`}
                        type="text"
                        defaultValue={country.code}
                        maxLength={2}
                        className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <span className="font-semibold">{country.name}</span>
                        <span className="text-gray-500 ml-2">({country.code})</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingCountry(country.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCountry(country.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Villes */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Villes ({filteredCities.length})
              </h2>
              <button
                onClick={() => setShowAddCity(!showAddCity)}
                disabled={!selectedCountry}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par pays
              </label>
              <select
                value={selectedCountry || ''}
                onChange={(e) => {
                  setSelectedCountry(e.target.value || null)
                  setShowAddCity(false)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Tous les pays</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Formulaire d'ajout */}
          {showAddCity && selectedCountry && (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la ville *
                  </label>
                  <input
                    type="text"
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                    placeholder="Ex: Cotonou"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCity()
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCity}
                    disabled={isLoading}
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Ajouter'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCity(false)
                      setNewCityName('')
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Liste des villes */}
          <div className="p-6 max-h-[600px] overflow-y-auto">
            {selectedCountry ? (
              <div className="space-y-2">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <div
                      key={city.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {editingCity === city.id ? (
                        <input
                          type="text"
                          defaultValue={city.name}
                          onBlur={(e) => {
                            if (e.target.value !== city.name) {
                              handleUpdateCity(city.id, e.target.value)
                            } else {
                              setEditingCity(null)
                            }
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateCity(city.id, (e.target as HTMLInputElement).value)
                            }
                          }}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                          autoFocus
                        />
                      ) : (
                        <>
                          <span className="font-medium">{city.name}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingCity(city.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCity(city.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Aucune ville pour ce pays. Ajoutez-en une !
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Sélectionnez un pays pour voir ses villes
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

