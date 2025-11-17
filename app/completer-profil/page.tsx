import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CompleteProfileForm from '@/components/CompleteProfileForm'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function CompleterProfilPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/connexion')
  }

  // Check if profile is already complete
  const metadata = session.user.user_metadata || {}
  if (metadata.first_name || metadata.full_name) {
    redirect('/profil')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <CompleteProfileForm />
    </div>
  )
}

