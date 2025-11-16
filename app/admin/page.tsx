import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/AdminDashboard'

export const dynamic = 'force-dynamic'
// export const runtime = 'edge' // Désactivé: async_hooks non disponible dans Edge Runtime

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/connexion')
  }

  // Check if user is admin (you can add admin check logic here)
  // For now, we'll allow any logged-in user to access admin
  // In production, add proper admin role check

  // Fetch all announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  // Fetch all comments
  const { data: comments } = await supabase
    .from('comments')
    .select('*, announcement:announcements(id, title)')
    .order('created_at', { ascending: false })
    .limit(50)

  // Fetch all reports
  const { data: reports } = await supabase
    .from('reports')
    .select('*, announcement:announcements(id, title)')
    .order('created_at', { ascending: false })
    .limit(50)

  // Fetch users count
  const { count: usersCount } = await supabase
    .from('announcements')
    .select('user_id', { count: 'exact', head: true })

  // Calculate statistics
  const stats = {
    totalAnnouncements: announcements?.length || 0,
    activeAnnouncements: announcements?.filter((a) => a.status === 'active').length || 0,
    resolvedAnnouncements: announcements?.filter((a) => a.status === 'resolved').length || 0,
    urgentAnnouncements: announcements?.filter((a) => a.urgency === 'urgent').length || 0,
    totalComments: comments?.length || 0,
    totalReports: reports?.length || 0,
    totalUsers: usersCount || 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard
          announcements={announcements || []}
          comments={comments || []}
          reports={reports || []}
          stats={stats}
        />
      </div>
    </div>
  )
}

