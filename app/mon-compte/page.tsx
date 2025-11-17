import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AccountDashboard from '@/components/AccountDashboard'
import ProfileSettings from '@/components/ProfileSettings'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function MonComptePage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/connexion')
  }

  // Check if profile is complete, redirect to complete profile page if not
  const metadata = session.user.user_metadata || {}
  if (!metadata.first_name && !metadata.full_name) {
    redirect('/completer-profil')
  }

  // Fetch user's announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  // Fetch user's comments
  const { data: comments } = await supabase
    .from('comments')
    .select('*, announcement:announcements(id, title)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch user's reports
  const { data: reports } = await supabase
    .from('reports')
    .select('*, announcement:announcements(id, title)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(10)

      // Fetch user's received messages
      const { data: messages } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(email),
          recipient:recipient_id(email),
          announcement:announcements(id, title, type)
        `)
        .eq('recipient_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      // Fetch user's support tickets
      const { data: tickets } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10)

  // Calculate statistics
  const stats = {
    totalAnnouncements: announcements?.length || 0,
    activeAnnouncements: announcements?.filter((a) => a.status === 'active').length || 0,
    resolvedAnnouncements: announcements?.filter((a) => a.status === 'resolved').length || 0,
    totalViews: announcements?.reduce((sum, a) => sum + (a.views_count || 0), 0) || 0,
    totalComments: comments?.length || 0,
    totalReports: reports?.length || 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AccountDashboard
            announcements={announcements || []}
            comments={comments || []}
            reports={reports || []}
            messages={messages || []}
            tickets={tickets || []}
            stats={stats}
            user={session.user}
          />
      </div>
    </div>
  )
}

