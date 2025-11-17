import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { sendEmailToUser } from '@/lib/utils/email'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { announcementId } = await request.json()

    if (!announcementId) {
      return NextResponse.json(
        { error: 'ID d\'annonce manquant' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // Récupérer l'annonce
    const { data: announcement, error: announcementError } = await supabase
      .from('announcements')
      .select('id, title, type, user_id, status')
      .eq('id', announcementId)
      .single()

    if (announcementError || !announcement) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      )
    }

    if (announcement.status !== 'active') {
      return NextResponse.json({
        success: true,
        message: 'Annonce non approuvée, email non envoyé',
      })
    }

    // Récupérer l'email de l'utilisateur
    if (!announcement.user_id) {
      return NextResponse.json({
        success: true,
        message: 'Pas d\'utilisateur associé, email non envoyé',
      })
    }

    let userEmail: string | null = null
    let userName = 'Utilisateur'
    try {
      const { data: userData } = await supabase.auth.admin.getUserById(announcement.user_id)
      if (userData?.user) {
        userEmail = userData.user.email || null
        const metadata = userData.user.user_metadata || {}
        userName = metadata.full_name || metadata.first_name || userEmail?.split('@')[0] || 'Utilisateur'
      }
    } catch (err) {
      console.error('Erreur récupération utilisateur:', err)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de l\'utilisateur' },
        { status: 500 }
      )
    }

    if (!userEmail) {
      return NextResponse.json({
        success: true,
        message: 'Email utilisateur non trouvé',
      })
    }

    const announcementUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://retrouvafrik.vercel.app'}/annonces/${announcementId}`

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Votre annonce a été approuvée</h1>
          </div>
          <div class="content">
            <p>Bonjour ${userName},</p>
            <p>Nous avons le plaisir de vous informer que votre annonce "<strong>${announcement.title}</strong>" a été approuvée et est maintenant visible sur RetrouvAfrik.</p>
            
            <p>Les membres de la communauté peuvent maintenant voir votre annonce et vous contacter.</p>

            <a href="${announcementUrl}" class="button">Voir mon annonce</a>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              Merci de contribuer à RetrouvAfrik !
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    const result = await sendEmailToUser({
      to: userEmail,
      subject: `✅ Votre annonce "${announcement.title}" a été approuvée`,
      html: emailHtml,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Email envoyé à l\'utilisateur',
    })
  } catch (error: any) {
    console.error('Erreur notification utilisateur:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

