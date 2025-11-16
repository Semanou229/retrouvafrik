import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSupportManager from '@/components/AdminSupportManager'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: { status?: string; priority?: string }
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
  // Note: On ne peut pas utiliser les relations user:user_id(email) car user_id est une référence à auth.users
  // On récupère juste les tickets, les emails seront récupérés côté client si nécessaire
  let query = supabase
    .from('support_tickets')
    .select(`
      *,
      announcement:announcements(id, title)
    `)
    .order('created_at', { ascending: false })

  // Appliquer les filtres
  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }
  if (searchParams.priority) {
    query = query.eq('priority', searchParams.priority)
  }

  const { data: tickets } = await query

  // Récupérer la liste des admins pour le transfert
  const { data: admins } = await supabase
    .from('announcements')
    .select('user_id')
    .not('user_id', 'is', null)
    .limit(1)

  // Note: En production, récupérer la vraie liste des admins depuis auth.users

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminSupportManager initialTickets={tickets || []} currentAdminId={user.id} />
      </div>
    </div>
  )
}

