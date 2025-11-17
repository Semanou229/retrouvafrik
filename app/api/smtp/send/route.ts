import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    console.log('📧 [SMTP API] Début traitement email')

    // Vérifier la clé API
    const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '')
    const expectedApiKey = process.env.SMTP_API_KEY

    if (!expectedApiKey || apiKey !== expectedApiKey) {
      console.error('❌ [SMTP API] Non autorisé - clé API invalide')
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Option 1: Utiliser Resend API si configuré
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      try {
        console.log('📧 [SMTP API] Tentative avec Resend')
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: email.from || `${process.env.SMTP_FROM_NAME || 'RetrouvAfrik'} <${process.env.SMTP_FROM || 'noreply@retrouvafrik.com'}>`,
            to: email.to,
            subject: email.subject,
            html: email.html,
          }),
        })

        if (resendResponse.ok) {
          const result = await resendResponse.json()
          console.log('✅ [SMTP API] Email envoyé via Resend')
          return NextResponse.json({
            success: true,
            messageId: result.id,
            provider: 'resend',
          })
        }
      } catch (resendError: any) {
        console.error('❌ [SMTP API] Erreur Resend:', resendError)
        // Continuer avec l'option 2 si Resend échoue
      }
    }

    // Option 2: Utiliser SMTP direct avec nodemailer
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPassword = process.env.SMTP_PASSWORD
    const smtpSecure = process.env.SMTP_SECURE === 'true'

    if (smtpHost && smtpPort && smtpUser && smtpPassword) {
      try {
        console.log('📧 [SMTP API] Tentative avec SMTP direct:', smtpHost)
        
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort, 10),
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPassword,
          },
        })

        const mailOptions = {
          from: email.from || `${process.env.SMTP_FROM_NAME || 'RetrouvAfrik'} <${process.env.SMTP_FROM || smtpUser}>`,
          to: email.to,
          subject: email.subject,
          html: email.html,
        }

        console.log('📧 [SMTP API] Envoi email à:', email.to)
        const info = await transporter.sendMail(mailOptions)
        
        console.log('✅ [SMTP API] Email envoyé via SMTP direct:', info.messageId)
        return NextResponse.json({
          success: true,
          messageId: info.messageId,
          provider: 'smtp-direct',
        })
      } catch (smtpError: any) {
        console.error('❌ [SMTP API] Erreur SMTP direct:', smtpError)
        return NextResponse.json(
          { 
            error: 'Erreur lors de l\'envoi SMTP',
            details: smtpError.message || 'Erreur inconnue',
            hint: 'Vérifiez vos paramètres SMTP (host, port, user, password)'
          },
          { status: 500 }
        )
      }
    }

    // Option 3: Retourner une erreur si aucune option n'est disponible
    console.error('❌ [SMTP API] Aucune configuration SMTP trouvée')
    return NextResponse.json(
      {
        error: 'Aucun service d\'envoi d\'email configuré.',
        hint: 'Configurez soit RESEND_API_KEY, soit SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD dans vos variables d\'environnement Vercel.',
      },
      { status: 503 }
    )
  } catch (error: any) {
    console.error('❌ [SMTP API] Erreur générale:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    )
  }
}
