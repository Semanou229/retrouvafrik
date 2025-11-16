import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import AdminUserMessagesPage from '@/components/AdminUserMessagesPage'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminUserMessagesViewPage({
  params,
  searchParams,
}: {
  params: { userId: string }
  searchParams: { announcement?: string }
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

  // Utiliser le client admin pour récupérer tous les messages de l'utilisateur
  const adminSupabase = createAdminSupabaseClient()
  if (!adminSupabase) {
    redirect('/admin/utilisateurs')
  }

  // Récupérer tous les messages de l'utilisateur (reçus et envoyés)
  const { data: messages } = await adminSupabase
    .from('messages')
    .select(`
      *,
      announcement:announcements(id, title, type)
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(1000)

  // Récupérer les informations de l'utilisateur
  let userInfo: any = null
  try {
    const { data: { users }, error: usersError } = await adminSupabase.auth.admin.listUsers()
    if (!usersError && users) {
      userInfo = users.users.find(u => u.id === userId)
    }
  } catch (err) {
    console.error('Error fetching user info:', err)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Banner d'impersonation */}
      <div className="bg-yellow-500 text-white py-3 px-4 text-center font-semibold">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span>🔍 Mode Admin : Visualisation des messages utilisateur</span>
          <span className="text-yellow-100">|</span>
          <span>{userInfo?.email || userId}</span>
          <span className="text-yellow-100">|</span>
          <a
            href={`/admin/utilisateurs/${userId}`}
            className="underline hover:text-yellow-100"
          >
            Retour au compte
          </a>
          <span className="text-yellow-100">|</span>
          <a
            href="/admin/utilisateurs"
            className="underline hover:text-yellow-100"
          >
            Liste des utilisateurs
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminUserMessagesPage
          initialMessages={messages || []}
          userId={userId}
          userEmail={userInfo?.email || 'Utilisateur'}
          announcementId={searchParams.announcement}
        />
      </div>
    </div>
  )
}

