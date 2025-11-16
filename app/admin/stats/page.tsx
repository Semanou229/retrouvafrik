import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminStatsDashboard from '@/components/AdminStatsDashboard'

export const dynamic = 'force-dynamic'
// export const runtime = 'edge' // Désactivé: async_hooks non disponible dans Edge Runtime

export default async function AdminStatsPage() {
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

  // Récupérer les statistiques
  const { data: allAnnouncements } = await supabase
    .from('announcements')
    .select('*')

  const { data: resolvedAnnouncements } = await supabase
    .from('announcements')
    .select('*')
    .eq('status', 'resolved')

  // Statistiques par catégorie
  const { data: personAnnouncements } = await supabase
    .from('announcements')
    .select('id')
    .eq('type', 'person')

  const { data: animalAnnouncements } = await supabase
    .from('announcements')
    .select('id')
    .eq('type', 'animal')

  const { data: objectAnnouncements } = await supabase
    .from('announcements')
    .select('id')
    .eq('type', 'object')

  // Statistiques par ville
  const { data: cityStats } = await supabase
    .from('announcements')
    .select('last_location')

  // Compter les annonces par ville
  const cityCounts: Record<string, number> = {}
  cityStats?.forEach((announcement) => {
    const city = announcement.last_location?.city
    if (city) {
      cityCounts[city] = (cityCounts[city] || 0) + 1
    }
  })

  const topCities = Object.entries(cityCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([city, count]) => ({ city, count }))

  // Statistiques de croissance (par mois)
  const monthlyStats: Record<string, number> = {}
  allAnnouncements?.forEach((announcement) => {
    const month = new Date(announcement.created_at).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
    })
    monthlyStats[month] = (monthlyStats[month] || 0) + 1
  })

  const stats = {
    totalAnnouncements: allAnnouncements?.length || 0,
    personAnnouncements: personAnnouncements?.length || 0,
    animalAnnouncements: animalAnnouncements?.length || 0,
    objectAnnouncements: objectAnnouncements?.length || 0,
    resolvedAnnouncements: resolvedAnnouncements?.length || 0,
    topCities,
    monthlyStats,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminStatsDashboard stats={stats} />
      </div>
    </div>
  )
}

