import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import ResourcesList from '@/components/ResourcesList'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function RessourcesPage({
  searchParams,
}: {
  searchParams: { type?: string; search?: string }
}) {
  const supabase = createServerSupabaseClient()
  
  // Récupérer les ressources publiées
  let query = supabase
    .from('resources')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  // Filtrer par type si spécifié
  if (searchParams.type && (searchParams.type === 'article' || searchParams.type === 'video')) {
    query = query.eq('type', searchParams.type)
  }

  const { data: resources } = await query

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ressources
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos articles de blog et vidéos pour vous aider dans vos recherches
          </p>
        </div>

        <ResourcesList initialResources={resources || []} />
      </div>
    </div>
  )
}

