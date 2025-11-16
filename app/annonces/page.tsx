import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import AnnouncementsPage from '@/components/AnnouncementsPage'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

interface SearchParams {
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
  sort?: 'recent' | 'popular' | 'urgent'
  view?: 'recent' | 'popular' | 'recognize'
}

export default async function AnnoncesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = createServerSupabaseClient()
  
  // Récupérer les pays et villes depuis la base de données pour les passer au composant
  const { data: countries } = await supabase
    .from('countries')
    .select('*')
    .order('name', { ascending: true })

  // Build query - Ne pas afficher les annonces masquées ou non approuvées
  let query = supabase
    .from('announcements')
    .select('*')
    .eq('status', 'active')
    .eq('hidden', false)
    .eq('approved', true)

  // Apply filters
  if (searchParams.category) {
    query = query.eq('type', searchParams.category)
  }
  if (searchParams.lost_sight === 'true') {
    query = query.eq('is_lost_sight', true)
  } else if (searchParams.lost_sight === 'false') {
    query = query.eq('is_lost_sight', false)
  }
  if (searchParams.city) {
    query = query.ilike('last_location->>city', `%${searchParams.city}%`)
  }
  if (searchParams.country) {
    query = query.ilike('last_location->>country', `%${searchParams.country}%`)
  }
  if (searchParams.date_from) {
    query = query.gte('disappearance_date', searchParams.date_from)
  }
  if (searchParams.date_to) {
    query = query.lte('disappearance_date', searchParams.date_to)
  }

  // Determine sort order
  let sortColumn = 'created_at'
  let ascending = false // Default to descending order
  
  if (searchParams.sort === 'popular') {
    sortColumn = 'views_count'
    ascending = false
  } else if (searchParams.sort === 'recent') {
    sortColumn = 'created_at'
    ascending = false
  } else if (searchParams.sort === 'urgent') {
    query = query.eq('urgency', 'urgent')
    sortColumn = 'created_at'
    ascending = false
  }

  const { data: allAnnouncements } = await query.order(sortColumn, { ascending })

  // Filter announcements based on view type
  let announcements = allAnnouncements || []
  
  if (searchParams.view === 'popular') {
    announcements = (allAnnouncements || []).sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
  } else if (searchParams.view === 'recognize') {
    // Pour "Vous pourriez reconnaître..." - seulement personnes de type "perdu de vue"
    announcements = (allAnnouncements || []).filter(a => a.type === 'person' && a.is_lost_sight === true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnnouncementsPage 
          announcements={announcements}
          initialFilters={searchParams}
          initialCountries={countries || []}
        />
      </div>
    </div>
  )
}

