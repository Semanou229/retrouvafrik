import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MessagesPage from '@/components/MessagesPage'

export const dynamic = 'force-dynamic'

export default async function MessagesRoute({
  searchParams,
}: {
  searchParams: { announcement?: string }
}) {
  const supabase = createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/connexion?redirect=/messages')
  }

  // Fetch user's messages with proper joins
  const { data: messages } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id(email),
      recipient:recipient_id(email),
      announcement:announcements(id, title, type)
    `)
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(1000)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MessagesPage 
          initialMessages={messages || []}
          announcementId={searchParams.announcement}
        />
      </div>
    </div>
  )
}

