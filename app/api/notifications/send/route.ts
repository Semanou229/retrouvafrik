import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { announcementId } = await request.json()

    if (!announcementId) {
      return NextResponse.json(
        { error: 'announcementId est requis' },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur est authentifié
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Récupérer l'annonce
    const { data: announcement, error: announcementError } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', announcementId)
      .single()

    if (announcementError || !announcement) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est l'auteur de l'annonce ou un admin
    const isAdmin = session.user.email?.includes('admin') || session.user.user_metadata?.role === 'admin'
    if (announcement.user_id !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Appeler la Edge Function Supabase pour envoyer les emails
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      )
    }

    // Appeler la Edge Function
    const functionUrl = `${supabaseUrl}/functions/v1/send-announcement-notifications`
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ announcementId }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Erreur Edge Function:', errorData)
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi des notifications', details: errorData },
        { status: response.status }
      )
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Notifications envoyées avec succès',
      result,
    })
  } catch (error: any) {
    console.error('Erreur API notifications:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

