import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import SearchForm from '@/components/SearchForm'
import AnnouncementCard from '@/components/AnnouncementCard'
import { Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface SearchParams {
  type?: string
  urgency?: string
  status?: string
  query?: string
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = createServerSupabaseClient()
  
  let query = supabase
    .from('announcements')
    .select('*')
    .eq('status', 'active')

  // Apply filters
  if (searchParams.type) {
    query = query.eq('type', searchParams.type)
  }
  if (searchParams.urgency) {
    query = query.eq('urgency', searchParams.urgency)
  }
  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }
  if (searchParams.query) {
    query = query.or(`title.ilike.%${searchParams.query}%,description.ilike.%${searchParams.query}%`)
  }

  const { data: announcements } = await query.order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Search className="w-8 h-8" />
            Rechercher une annonce
          </h1>
          <p className="text-gray-600">
            Utilisez les filtres ci-dessous pour affiner votre recherche
          </p>
        </div>

        <SearchForm initialParams={searchParams} />

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              Résultats {announcements && `(${announcements.length})`}
            </h2>
          </div>

          {announcements && announcements.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">
                Aucune annonce ne correspond à votre recherche.
              </p>
              <p className="text-gray-500">
                Essayez de modifier vos critères ou publiez une nouvelle annonce.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

