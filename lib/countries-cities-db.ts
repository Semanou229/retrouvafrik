/**
 * Fonctions pour récupérer les pays et villes depuis la base de données
 */

import { createSupabaseClient } from './supabase/client'

export interface Country {
  id: string
  name: string
  code: string
}

export interface City {
  id: string
  name: string
  country_id: string
}

/**
 * Récupère tous les pays depuis la base de données
 * Fonctionne côté client uniquement
 */
export async function getCountriesFromDB(): Promise<Country[]> {
  if (typeof window === 'undefined') {
    // Côté serveur, retourner un tableau vide (sera géré par le composant serveur)
    return []
  }

  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching countries:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error in getCountriesFromDB:', err)
    return []
  }
}

/**
 * Récupère les villes d'un pays depuis la base de données
 * Fonctionne côté client uniquement
 */
export async function getCitiesByCountryFromDB(countryName: string): Promise<string[]> {
  if (typeof window === 'undefined') {
    // Côté serveur, retourner un tableau vide
    return []
  }

  try {
    const supabase = createSupabaseClient()
  
    // D'abord, trouver le pays
    const { data: countryData, error: countryError } = await supabase
      .from('countries')
      .select('id')
      .eq('name', countryName)
      .single()

    if (countryError || !countryData) {
      console.error('Error fetching country:', countryError)
      return []
    }

    // Ensuite, récupérer les villes
    const { data: citiesData, error: citiesError } = await supabase
      .from('cities')
      .select('name')
      .eq('country_id', countryData.id)
      .order('name', { ascending: true })

    if (citiesError) {
      console.error('Error fetching cities:', citiesError)
      return []
    }

    return citiesData?.map(c => c.name) || []
  } catch (err) {
    console.error('Error in getCitiesByCountryFromDB:', err)
    return []
  }
}

/**
 * Récupère toutes les villes d'un pays avec leurs IDs
 */
export async function getCitiesWithIdsByCountry(countryId: string): Promise<City[]> {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('country_id', countryId)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching cities:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error in getCitiesWithIdsByCountry:', err)
    return []
  }
}
