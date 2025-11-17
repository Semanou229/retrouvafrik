import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Vérifier que l'utilisateur est authentifié
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ [API] Erreur session:', sessionError)
      return NextResponse.json(
        { error: 'Erreur d\'authentification', details: sessionError.message },
        { status: 401 }
      )
    }
    
    if (!session) {
      console.warn('⚠️ [API] Pas de session, tentative création annonce anonyme')
      // Permettre les annonces anonymes
    }
    
    const announcementData = await request.json()
    
    console.log('📝 [API] Création annonce:', {
      hasSession: !!session,
      userId: session?.user?.id,
      announcementUserId: announcementData.user_id,
      type: announcementData.type,
      title: announcementData.title,
    })
    
    // S'assurer que user_id correspond à la session si l'utilisateur est authentifié
    if (session?.user?.id) {
      announcementData.user_id = session.user.id
      console.log('✅ [API] Utilisation de session.user.id:', session.user.id)
    } else {
      // Pour les annonces anonymes, s'assurer que user_id est null
      announcementData.user_id = null
      console.log('⚠️ [API] Création annonce anonyme (user_id = null)')
    }
    
    // Insérer l'annonce avec le client serveur qui a accès à la session
    const { data: announcement, error: insertError } = await supabase
      .from('announcements')
      .insert([announcementData])
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ [API] Insert error:', insertError)
      console.error('❌ [API] Détails erreur:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
      })
      return NextResponse.json(
        { 
          error: insertError.message || 'Erreur lors de la création de l\'annonce',
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
        },
        { status: 500 }
      )
    }
    
    if (!announcement) {
      return NextResponse.json(
        { error: 'L\'annonce n\'a pas pu être créée' },
        { status: 500 }
      )
    }
    
    console.log('✅ [API] Annonce créée avec succès:', announcement.id)
    
    return NextResponse.json({ announcement }, { status: 201 })
  } catch (error: any) {
    console.error('❌ [API] Erreur inattendue:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    )
  }
}

