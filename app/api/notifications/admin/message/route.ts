import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { sendEmailToAdmin } from '@/lib/utils/email'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { messageId } = await request.json()

    if (!messageId) {
      return NextResponse.json(
        { error: 'ID de message manquant' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // Récupérer le message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        sender_id,
        recipient_id,
        announcement_id,
        created_at,
        announcement:announcements(id, title, type)
      `)
      .eq('id', messageId)
      .single()

    if (messageError || !message) {
      return NextResponse.json(
        { error: 'Message non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si le destinataire est admin
    const { data: recipientData } = await supabase.auth.admin.getUserById(message.recipient_id)
    const isAdminRecipient = recipientData?.user?.email?.includes('admin') || 
                             recipientData?.user?.email === 'hello@retrouvafrik.com' ||
                             recipientData?.user?.user_metadata?.role === 'admin'

    if (!isAdminRecipient) {
      return NextResponse.json({
        success: true,
        message: 'Le destinataire n\'est pas admin, email non envoyé',
      })
    }

    // Récupérer les informations de l'expéditeur
    let senderEmail = 'Utilisateur anonyme'
    let senderName = 'Utilisateur'
    if (message.sender_id) {
      try {
        const { data: senderData } = await supabase.auth.admin.getUserById(message.sender_id)
        if (senderData?.user) {
          senderEmail = senderData.user.email || 'Utilisateur anonyme'
          const metadata = senderData.user.user_metadata || {}
          senderName = metadata.full_name || metadata.first_name || senderEmail.split('@')[0]
        }
      } catch (err) {
        console.error('Erreur récupération expéditeur:', err)
      }
    }

    const messageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://retrouvafrik.vercel.app'}/messages?announcement=${message.announcement_id}`

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
          .message-box { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ff6b35; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 Nouveau message</h1>
          </div>
          <div class="content">
            <p>Bonjour,</p>
            <p>Vous avez reçu un nouveau message sur RetrouvAfrik.</p>
            
            <div class="message-box">
              <p><strong>De :</strong> ${senderName} (${senderEmail})</p>
              ${(message.announcement as any)?.title ? `<p><strong>Annonce :</strong> ${(message.announcement as any).title}</p>` : ''}
              <p><strong>Message :</strong></p>
              <p>${message.content}</p>
            </div>

            <a href="${messageUrl}" class="button">Voir le message</a>
          </div>
        </div>
      </body>
      </html>
    `

    const result = await sendEmailToAdmin({
      subject: `💬 Nouveau message de ${senderName}`,
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
      message: 'Email envoyé à l\'administrateur',
    })
  } catch (error: any) {
    console.error('Erreur notification admin message:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

