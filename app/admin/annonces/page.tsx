import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminAnnouncementsManager from '@/components/AdminAnnouncementsManager'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

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

  // Construire la requête
  let query = supabase
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

  const { data: announcements } = await query.limit(100)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminAnnouncementsManager initialAnnouncements={announcements || []} />
      </div>
    </div>
  )
}

