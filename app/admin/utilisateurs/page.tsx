import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import AdminUsersManager from '@/components/AdminUsersManager'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminUtilisateursPage() {
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

  // Utiliser le client admin pour récupérer tous les utilisateurs
  const adminSupabase = createAdminSupabaseClient()
  if (!adminSupabase) {
    redirect('/admin')
  }

  // Récupérer tous les utilisateurs depuis Supabase Auth
  let users: any[] = []
  try {
    const { data, error: usersError } = await adminSupabase.auth.admin.listUsers()
    if (!usersError && data) {
      users = data.users.map((u: any) => ({
        id: u.id,
        email: u.email || '',
        created_at: u.created_at || new Date().toISOString(),
        user_metadata: u.user_metadata || {},
      }))
    }
  } catch (err) {
    console.error('Error fetching users:', err)
  }

  // Récupérer les statuts des utilisateurs
  const { data: userStatuses } = await supabase
    .from('user_status')
    .select('*')

  // Récupérer les statistiques par utilisateur (nombre d'annonces)
  const { data: announcements } = await supabase
    .from('announcements')
    .select('user_id')
    .not('user_id', 'is', null)

  // Créer un map des stats par user_id
  const userStatsMap = new Map<string, number>()
  announcements?.forEach((announcement) => {
    const count = userStatsMap.get(announcement.user_id) || 0
    userStatsMap.set(announcement.user_id, count + 1)
  })

  // Convertir en format attendu par le composant
  const userStats = Array.from(userStatsMap.entries()).map(([user_id, count]) => ({
    user_id,
    count,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminUsersManager
          initialUsers={users || []}
          initialUserStatuses={userStatuses || []}
          initialUserStats={userStats || []}
        />
      </div>
    </div>
  )
}

