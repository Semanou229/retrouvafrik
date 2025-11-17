import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { sendEmailToAdmin } from '@/lib/utils/email'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { ticketId } = await request.json()

    if (!ticketId) {
      return NextResponse.json(
        { error: 'ID de ticket manquant' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // Récupérer le ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .select('id, type, subject, description, user_id, created_at, priority')
      .eq('id', ticketId)
      .single()

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: 'Ticket non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer les informations de l'utilisateur
    let userEmail = 'Utilisateur anonyme'
    let userName = 'Utilisateur'
    if (ticket.user_id) {
      try {
        const { data: userData } = await supabase.auth.admin.getUserById(ticket.user_id)
        if (userData?.user) {
          userEmail = userData.user.email || 'Utilisateur anonyme'
          const metadata = userData.user.user_metadata || {}
          userName = metadata.full_name || metadata.first_name || userEmail.split('@')[0]
        }
      } catch (err) {
        console.error('Erreur récupération utilisateur:', err)
      }
    }

    const ticketUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://retrouvafrik.vercel.app'}/admin/support?ticket=${ticketId}`

    const typeLabels: Record<string, string> = {
      bug: 'Bug',
      feature: 'Demande de fonctionnalité',
      question: 'Question',
      other: 'Autre',
    }

    const priorityLabels: Record<string, string> = {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute',
      urgent: 'Urgente',
    }

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
          .ticket-box { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ff6b35; }
          .label { font-weight: bold; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎫 Nouveau ticket de support</h1>
          </div>
          <div class="content">
            <p>Bonjour,</p>
            <p>Un nouveau ticket de support a été créé sur RetrouvAfrik.</p>
            
            <div class="ticket-box">
              <p><span class="label">Sujet :</span> ${ticket.subject}</p>
              <p><span class="label">Type :</span> ${typeLabels[ticket.type] || ticket.type}</p>
              <p><span class="label">Priorité :</span> ${priorityLabels[ticket.priority] || ticket.priority}</p>
              <p><span class="label">Créé par :</span> ${userName} (${userEmail})</p>
              <p><span class="label">Description :</span></p>
              <p>${ticket.description}</p>
            </div>

            <a href="${ticketUrl}" class="button">Voir et répondre au ticket</a>
          </div>
        </div>
      </body>
      </html>
    `

    const result = await sendEmailToAdmin({
      subject: `🎫 Nouveau ticket de support - ${ticket.subject}`,
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
    console.error('Erreur notification admin ticket:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

