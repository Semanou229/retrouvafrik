import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ResourceDetail from '@/components/ResourceDetail'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function ResourceDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createServerSupabaseClient()
  
  // Récupérer la ressource par slug
  const { data: resource, error } = await supabase
    .from('resources')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (error || !resource) {
    notFound()
  }

  // Incrémenter le compteur de vues (de manière asynchrone, ne pas bloquer le rendu)
  supabase
    .from('resources')
    .update({ views_count: (resource.views_count || 0) + 1 })
    .eq('id', resource.id)
    .then(() => {})

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ResourceDetail resource={resource} />
      </div>
    </div>
  )
}

