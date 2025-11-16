import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminUsersManager from '@/components/AdminUsersManager'

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

  // Récupérer les utilisateurs depuis les annonces (méthode alternative)
  const { data: announcements } = await supabase
    .from('announcements')
    .select('user_id')
    .not('user_id', 'is', null)

  // Récupérer les statuts des utilisateurs
  const { data: userStatuses } = await supabase
    .from('user_status')
    .select('*')

  // Récupérer les statistiques par utilisateur
  const { data: userStats } = await supabase
    .from('announcements')
    .select('user_id')
    .not('user_id', 'is', null)

  // Créer une liste unique d'utilisateurs depuis les annonces
  const uniqueUserIds = Array.from(new Set(announcements?.map(a => a.user_id) || []))
  
  // Pour chaque utilisateur, récupérer les infos de base
  // Note: En production, utilisez l'API admin de Supabase avec les bonnes permissions
  const users = uniqueUserIds.map(userId => ({
    id: userId,
    email: 'user@example.com', // Sera remplacé par les vraies données
    created_at: new Date().toISOString(),
    user_metadata: {},
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

