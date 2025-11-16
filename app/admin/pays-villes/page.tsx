import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CountriesCitiesManager from '@/components/CountriesCitiesManager'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function AdminPaysVillesPage() {
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

  // Récupérer les pays et villes
  const { data: countries } = await supabase
    .from('countries')
    .select('*')
    .order('name', { ascending: true })

  const { data: cities } = await supabase
    .from('cities')
    .select('*, country:countries(name)')
    .order('name', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CountriesCitiesManager
          initialCountries={countries || []}
          initialCities={cities || []}
        />
      </div>
    </div>
  )
}

