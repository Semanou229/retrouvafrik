import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdManagement from '@/components/AdManagement'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function PublicitesAdminPage() {
  const supabase = createServerSupabaseClient()
  
  // Vérifier que l'utilisateur est admin
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/connexion')
  }

  const user = session.user
  const isAdmin = user.email?.includes('admin') || user.user_metadata?.role === 'admin'

  if (!isAdmin) {
    redirect('/mon-compte')
  }

  // Récupérer les demandes de pub
  const { data: adRequests } = await supabase
    .from('ad_requests')
    .select('*')
    .order('created_at', { ascending: false })

  // Récupérer les campagnes actives
  const { data: campaigns } = await supabase
    .from('ad_campaigns')
    .select('*')
    .order('created_at', { ascending: false })

  // Récupérer les emplacements
  const { data: placements } = await supabase
    .from('ad_placements')
    .select('*')
    .order('name', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdManagement
          initialAdRequests={adRequests || []}
          initialCampaigns={campaigns || []}
          initialPlacements={placements || []}
        />
      </div>
    </div>
  )
}

