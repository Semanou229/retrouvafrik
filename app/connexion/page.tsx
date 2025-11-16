import Navigation from '@/components/Navigation'
import LoginForm from '@/components/LoginForm'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function ConnexionPage() {
  // Si l'utilisateur est déjà connecté, rediriger vers son compte
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/mon-compte')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Se connecter</h1>
          <p className="text-gray-600 mb-6">Accédez à votre espace RetrouvAfrik</p>
          
          <LoginForm />
          
          <div className="mt-6 text-center">
            <Link href="/inscription" className="text-primary hover:underline">
              Pas encore de compte ? Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

