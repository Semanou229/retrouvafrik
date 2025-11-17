import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    
    // Créer le client Supabase avec les cookies pour vérifier la session
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set(name, value, options)
            } catch (error) {
              // En Edge Runtime, on ne peut pas toujours modifier les cookies
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set(name, '', { ...options, maxAge: 0 })
            } catch (error) {
              // En Edge Runtime, on ne peut pas toujours modifier les cookies
            }
          },
        },
      }
    )
    
    // Vérifier que l'utilisateur est authentifié
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ [API] Erreur session:', sessionError)
      return NextResponse.json(
        { error: 'Erreur d\'authentification', details: sessionError.message },
        { status: 401 }
      )
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
    let finalUserId: string | null = null
    if (session?.user?.id) {
      finalUserId = session.user.id
      console.log('✅ [API] Utilisation de session.user.id:', session.user.id)
    } else {
      // Pour les annonces anonymes, s'assurer que user_id est null
      finalUserId = null
      console.log('⚠️ [API] Création annonce anonyme (user_id = null)')
    }
    
    announcementData.user_id = finalUserId
    
    // Utiliser le service role key pour contourner RLS et garantir l'insertion
    // C'est sécurisé car on vérifie d'abord la session avec le client normal
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
      console.error('❌ [API] SUPABASE_SERVICE_ROLE_KEY non définie')
      return NextResponse.json(
        { error: 'Configuration serveur manquante' },
        { status: 500 }
      )
    }
    
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
    
    // Insérer l'annonce avec le client admin qui contourne RLS
    // On a déjà vérifié la session avec le client normal
    const { data: announcement, error: insertError } = await adminSupabase
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

