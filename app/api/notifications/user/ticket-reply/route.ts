import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { sendEmailToUser } from '@/lib/utils/email'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { ticketMessageId } = await request.json()

    if (!ticketMessageId) {
      return NextResponse.json(
        { error: 'ID de message de ticket manquant' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // Récupérer le message du ticket
    const { data: ticketMessage, error: ticketMessageError } = await supabase
      .from('ticket_messages')
      .select(`
        id,
        message,
        ticket_id,
        is_admin,
        created_at,
        ticket:support_tickets(id, subject, user_id)
      `)
      .eq('id', ticketMessageId)
      .single()

    if (ticketMessageError || !ticketMessage) {
      return NextResponse.json(
        { error: 'Message de ticket non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que c'est une réponse admin
    if (!ticketMessage.is_admin) {
      return NextResponse.json({
        success: true,
        message: 'Ce n\'est pas une réponse admin, email non envoyé',
      })
    }

    const ticket = ticketMessage.ticket as any
    if (!ticket || !ticket.user_id) {
      return NextResponse.json({
        success: true,
        message: 'Ticket ou utilisateur non trouvé',
      })
    }

    // Récupérer l'email de l'utilisateur
    let userEmail: string | null = null
    let userName = 'Utilisateur'
    try {
      const { data: userData } = await supabase.auth.admin.getUserById(ticket.user_id)
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

    const ticketUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://retrouvafrik.vercel.app'}/support?ticket=${ticket.id}`

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
          .reply-box { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ff6b35; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 Réponse à votre ticket de support</h1>
          </div>
          <div class="content">
            <p>Bonjour ${userName},</p>
            <p>Vous avez reçu une réponse à votre ticket de support sur RetrouvAfrik.</p>
            
            <div class="reply-box">
              <p><strong>Sujet du ticket :</strong> ${ticket.subject}</p>
              <p><strong>Réponse :</strong></p>
              <p>${ticketMessage.message}</p>
            </div>

            <a href="${ticketUrl}" class="button">Voir le ticket</a>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              Si vous avez d'autres questions, n'hésitez pas à répondre directement au ticket.
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    const result = await sendEmailToUser({
      to: userEmail,
      subject: `💬 Réponse à votre ticket : ${ticket.subject}`,
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
    console.error('Erreur notification utilisateur ticket:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

