import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier si l'utilisateur est admin
    const user = session.user
    const isAdmin = user.email?.includes('admin') || user.user_metadata?.role === 'admin'

    if (!isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }

    // Récupérer les paramètres de requête
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Utiliser le client admin si disponible, sinon le client normal
    let queryClient = supabase
    
    try {
      const adminSupabase = createAdminSupabaseClient()
      if (adminSupabase) {
        queryClient = adminSupabase
      }
    } catch (error) {
      console.warn('Client admin non disponible, utilisation du client normal')
    }

    // Construire la requête
    let query = queryClient
      .from('announcements')
      .select('*, user:user_id(email)')
      .order('created_at', { ascending: false })

    // Appliquer les filtres
    if (status === 'pending') {
      query = query.eq('approved', false)
    } else if (status === 'hidden') {
      query = query.eq('hidden', true)
    } else if (status === 'verified') {
      query = query.eq('verified', true)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: announcements, error: queryError } = await query.limit(100)

    if (queryError) {
      console.error('Erreur lors de la récupération des annonces:', queryError)
      return NextResponse.json(
        { error: queryError.message || 'Erreur lors de la récupération des annonces' },
        { status: 500 }
      )
    }

    return NextResponse.json({ announcements: announcements || [] })
  } catch (error: any) {
    console.error('Erreur API admin announcements:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

