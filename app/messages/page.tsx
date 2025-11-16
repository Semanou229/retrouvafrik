import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MessagesPage from '@/components/MessagesPage'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

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
      announcement:announcements(id, title, type)
    `)
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(1000)

  // Fetch sender and recipient emails separately using service role
  // Note: This requires SUPABASE_SERVICE_ROLE_KEY
  const messagesWithUsers = messages ? await Promise.all(
    messages.map(async (msg: any) => {
      try {
        // Get sender email - use a direct query to auth.users if possible
        // Otherwise, we'll fetch it client-side
        const senderEmail = 'Chargement...'
        const recipientEmail = 'Chargement...'
        
        return {
          ...msg,
          sender: { email: senderEmail },
          recipient: { email: recipientEmail },
        }
      } catch (err) {
        return {
          ...msg,
          sender: { email: 'Utilisateur inconnu' },
          recipient: { email: 'Utilisateur inconnu' },
        }
      }
    })
  ) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MessagesPage 
          initialMessages={messagesWithUsers || []}
          announcementId={searchParams.announcement}
        />
      </div>
    </div>
  )
}

