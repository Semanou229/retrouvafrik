import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import AdminResourcesManager from '@/components/AdminResourcesManager'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminRessourcesPage() {
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

  // Utiliser le client admin pour récupérer toutes les ressources
  let resources: any[] = []
  let queryError: any = null

  try {
    const adminSupabase = createAdminSupabaseClient()
    
    if (!adminSupabase) {
      throw new Error('Client admin non disponible. Vérifiez SUPABASE_SERVICE_ROLE_KEY.')
    }

    const { data, error } = await adminSupabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      queryError = error
      console.error('Erreur lors de la récupération des ressources:', error)
    } else {
      resources = data || []
    }
  } catch (err: any) {
    queryError = err
    console.error('Erreur lors de la récupération des ressources:', err)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminResourcesManager initialResources={resources} />
        {queryError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              Erreur lors du chargement des ressources: {queryError.message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

