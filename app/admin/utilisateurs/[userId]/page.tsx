import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import UserAccountView from '@/components/UserAccountView'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminUserViewPage({
  params,
}: {
  params: { userId: string }
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

  const userId = params.userId

  // Utiliser le client admin pour récupérer toutes les données de l'utilisateur
  const adminSupabase = createAdminSupabaseClient()
  if (!adminSupabase) {
    redirect('/admin/utilisateurs')
  }

  // Récupérer les annonces de l'utilisateur
  const { data: announcements } = await adminSupabase
    .from('announcements')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  // Récupérer les commentaires de l'utilisateur
  const { data: comments } = await adminSupabase
    .from('comments')
    .select('*, announcement:announcements(id, title)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  // Récupérer les signalements de l'utilisateur
  const { data: reports } = await adminSupabase
    .from('reports')
    .select('*, announcement:announcements(id, title)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  // Récupérer les messages reçus par l'utilisateur
  const { data: messages } = await adminSupabase
    .from('messages')
    .select(`
      *,
      announcement:announcements(id, title, type)
    `)
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  // Récupérer les messages envoyés par l'utilisateur
  const { data: sentMessages } = await adminSupabase
    .from('messages')
    .select(`
      *,
      announcement:announcements(id, title, type)
    `)
    .eq('sender_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  // Récupérer les tickets de support de l'utilisateur
  const { data: tickets } = await adminSupabase
    .from('support_tickets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  // Récupérer les informations de l'utilisateur via l'API admin
  let userInfo: any = null
  try {
    const { data: { users }, error: usersError } = await adminSupabase.auth.admin.listUsers()
    if (!usersError && users) {
      userInfo = users.users.find(u => u.id === userId)
    }
  } catch (err) {
    console.error('Error fetching user info:', err)
  }

  // Calculer les statistiques
  const stats = {
    totalAnnouncements: announcements?.length || 0,
    activeAnnouncements: announcements?.filter((a) => a.status === 'active').length || 0,
    resolvedAnnouncements: announcements?.filter((a) => a.status === 'resolved').length || 0,
    totalViews: announcements?.reduce((sum, a) => sum + (a.views_count || 0), 0) || 0,
    totalComments: comments?.length || 0,
    totalReports: reports?.length || 0,
  }

  // Combiner tous les messages (reçus et envoyés)
  const allMessages = [
    ...(messages || []).map((msg: any) => ({ ...msg, direction: 'received' })),
    ...(sentMessages || []).map((msg: any) => ({ ...msg, direction: 'sent' })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Banner d'impersonation */}
      <div className="bg-yellow-500 text-white py-3 px-4 text-center font-semibold">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span>🔍 Mode Admin : Visualisation du compte utilisateur</span>
          <span className="text-yellow-100">|</span>
          <span>{userInfo?.email || userId}</span>
          <span className="text-yellow-100">|</span>
          <a
            href="/admin/utilisateurs"
            className="underline hover:text-yellow-100"
          >
            Retour à la liste
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserAccountView
          announcements={announcements || []}
          comments={comments || []}
          reports={reports || []}
          messages={allMessages || []}
          tickets={tickets || []}
          stats={stats}
          user={userInfo || { id: userId, email: 'Utilisateur' }}
          isAdminView={true}
          adminUserId={user.id}
        />
      </div>
    </div>
  )
}

