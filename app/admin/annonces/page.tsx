import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import AdminAnnouncementsManager from '@/components/AdminAnnouncementsManager'

export const dynamic = 'force-dynamic'
// Note: On ne peut pas utiliser Edge Runtime avec le service role key
// Car il nécessite des variables d'environnement qui ne sont pas disponibles en Edge
export const runtime = 'nodejs'

export default async function AdminAnnoncesPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string }
}) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/connexion')
  }

  // Vérifier si l'utilisateur est admin
  const user = session.user
  const isAdmin = user.email?.includes('admin') || user.user_metadata?.role === 'admin'

  if (!isAdmin) {
    redirect('/mon-compte')
  }

  // Utiliser le client admin pour contourner RLS et récupérer toutes les annonces
  const adminSupabase = createAdminSupabaseClient()

  // Construire la requête
  let query = adminSupabase
    .from('announcements')
    .select('*, user:user_id(email)')
    .order('created_at', { ascending: false })

  // Appliquer les filtres
  if (searchParams.status === 'pending') {
    query = query.eq('approved', false)
  } else if (searchParams.status === 'hidden') {
    query = query.eq('hidden', true)
  } else if (searchParams.status === 'verified') {
    query = query.eq('verified', true)
  }

  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
  }

  const { data: announcements, error: queryError } = await query.limit(100)

  // Log pour déboguer
  if (queryError) {
    console.error('Erreur lors de la récupération des annonces:', queryError)
  }
  console.log('Annonces récupérées:', announcements?.length || 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {queryError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Erreur: {queryError.message}
          </div>
        )}
        <AdminAnnouncementsManager initialAnnouncements={announcements || []} />
      </div>
    </div>
  )
}

