import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ContactSettingsManager from '@/components/ContactSettingsManager'

export const dynamic = 'force-dynamic'
// export const runtime = 'edge' // Désactivé: async_hooks non disponible dans Edge Runtime

export default async function AdminContactPage() {
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
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContactSettingsManager />
      </div>
    </div>
  )
}

