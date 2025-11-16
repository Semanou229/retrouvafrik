import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const runtime = 'edge'

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
    const { data: announcementData, error: announcementError } = await supabase
      .from('announcements')
      .select('id, title, type, user_id, created_at')
      .eq('id', announcementId)
      .single()

    if (announcementError || !announcementData) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      )
    }

    const announcement = announcementData as {
      id: string
      title: string
      type: string
      user_id: string | null
      created_at: string
    }

    // Récupérer l'email de l'utilisateur si user_id existe
    let userEmail = 'Utilisateur anonyme'
    if (announcement.user_id) {
      try {
        const { data: userData } = await supabase.auth.admin.getUserById(announcement.user_id)
        if (userData?.user?.email) {
          userEmail = userData.user.email
        }
      } catch (err) {
        console.error('Erreur récupération email utilisateur:', err)
      }
    }

    // Récupérer l'email de l'admin
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const admin = users?.find(
      (u: any) => u.user_metadata?.role === 'admin' || u.email?.includes('admin')
    )

    if (!admin) {
      return NextResponse.json(
        { error: 'Aucun administrateur trouvé' },
        { status: 404 }
      )
    }

    // Construire l'URL d'approbation
    const approvalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://retrouvafrik.vercel.app'}/admin/annonces?announcement=${announcementId}`

    // Envoyer l'email via l'API SMTP
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://retrouvafrik.vercel.app'}/api/smtp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SMTP_API_KEY || 'default-key'}`,
      },
      body: JSON.stringify({
        email: {
          to: admin.email,
          subject: `🔔 Nouvelle annonce à approuver - ${announcement.title}`,
          html: `
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
                    <p><span class="label">Créée par :</span> ${userEmail}</p>
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
          `,
        },
        resendApiKey: process.env.RESEND_API_KEY,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json().catch(() => ({}))
      console.error('Erreur envoi email:', errorData)
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email', details: errorData },
        { status: 500 }
      )
    }

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

