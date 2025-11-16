import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SupportTicketForm from '@/components/SupportTicketForm'
import SupportTicketItem from '@/components/SupportTicketItem'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function SupportPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/connexion?redirect=/support')
  }

  // Récupérer les annonces de l'utilisateur pour le formulaire
  const { data: userAnnouncements } = await supabase
    .from('announcements')
    .select('id, title')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  // Récupérer les tickets récents de l'utilisateur avec le statut des messages non lus
  const { data: userTickets } = await supabase
    .from('support_tickets')
    .select('*, announcement:announcements(id, title)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Vérifier les messages non lus pour chaque ticket
  const ticketsWithUnreadStatus = await Promise.all(
    (userTickets || []).map(async (ticket) => {
      const { count } = await supabase
        .from('ticket_messages')
        .select('*', { count: 'exact', head: true })
        .eq('ticket_id', ticket.id)
        .eq('is_admin', true)
        .eq('is_read', false)

      return {
        ...ticket,
        has_unread_messages: (count || 0) > 0,
      }
    })
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Support & Assistance</h1>
          <p className="text-gray-600">
            Nous sommes là pour vous aider. Soumettez un ticket et notre équipe vous répondra rapidement.
          </p>
        </div>

        {/* Liste des tickets récents */}
        {ticketsWithUnreadStatus && ticketsWithUnreadStatus.length > 0 && (
          <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-4">Mes tickets récents</h2>
            <div className="space-y-3">
              {ticketsWithUnreadStatus.map((ticket) => (
                <SupportTicketItem key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </div>
        )}

        <SupportTicketForm userAnnouncements={userAnnouncements || []} />
      </div>
    </div>
  )
}

