import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmailToAdmin, getAdminEmail } from '@/lib/utils/email'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    console.log('📧 [API] Notification admin - Nouvelle annonce')
    const { announcementId } = await request.json()
    console.log('📧 [API] Announcement ID:', announcementId)

    if (!announcementId) {
      console.error('❌ [API] ID d\'annonce manquant')
      return NextResponse.json(
        { error: 'ID d\'annonce manquant' },
        { status: 400 }
      )
    }

    // Utiliser le service role key pour contourner RLS
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

    // Récupérer l'annonce avec le client admin (contourne RLS)
    const { data: announcement, error: announcementError } = await adminSupabase
      .from('announcements')
      .select('id, title, type, user_id, created_at, last_location')
      .eq('id', announcementId)
      .single()

    if (announcementError || !announcement) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      )
    }

    // Récupérer l'email de l'utilisateur
    let userEmail = 'Utilisateur anonyme'
    let userName = 'Utilisateur'
    if (announcement.user_id) {
      try {
        const { data: userData } = await adminSupabase.auth.admin.getUserById(announcement.user_id)
        if (userData?.user) {
          userEmail = userData.user.email || 'Utilisateur anonyme'
          const metadata = userData.user.user_metadata || {}
          userName = metadata.full_name || metadata.first_name || userEmail.split('@')[0]
        }
      } catch (err) {
        console.error('Erreur récupération utilisateur:', err)
      }
    }

    const approvalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://retrouvafrik.vercel.app'}/admin/annonces?announcement=${announcementId}`

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
          .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .label { font-weight: bold; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Nouvelle annonce à approuver</h1>
          </div>
          <div class="content">
            <p>Bonjour,</p>
            <p>Une nouvelle annonce a été créée sur RetrouvAfrik et nécessite votre approbation avant d'être visible sur le site.</p>
            
            <div class="details">
              <p><span class="label">Titre :</span> ${announcement.title}</p>
              <p><span class="label">Type :</span> ${announcement.type === 'person' ? 'Personne' : announcement.type === 'animal' ? 'Animal' : 'Objet'}</p>
              <p><span class="label">Créée par :</span> ${userName} (${userEmail})</p>
              ${announcement.last_location?.country ? `<p><span class="label">Localisation :</span> ${announcement.last_location?.city ? announcement.last_location.city + ', ' : ''}${announcement.last_location.country}</p>` : ''}
              <p><span class="label">Date de création :</span> ${new Date(announcement.created_at).toLocaleString('fr-FR')}</p>
            </div>

            <a href="${approvalUrl}" class="button">Voir et approuver l'annonce</a>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              Cette annonce restera invisible sur le site jusqu'à votre approbation.
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    console.log('📧 [API] Envoi email à admin:', getAdminEmail())
    const result = await sendEmailToAdmin({
      subject: `🔔 Nouvelle annonce à approuver - ${announcement.title}`,
      html: emailHtml,
    })

    console.log('📧 [API] Résultat envoi email:', result)

    if (!result.success) {
      console.error('❌ [API] Erreur envoi email:', result.error)
      return NextResponse.json(
        { error: result.error || 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      )
    }

    console.log('✅ [API] Email envoyé avec succès à l\'administrateur')
    return NextResponse.json({
      success: true,
      message: 'Email envoyé à l\'administrateur',
    })
  } catch (error: any) {
    console.error('Erreur notification admin:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

