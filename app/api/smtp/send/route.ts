import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const { smtp, email } = await request.json()

    // Vérifier la clé API
    const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '')
    const expectedApiKey = process.env.SMTP_API_KEY

    if (!expectedApiKey || apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Import dynamique de nodemailer pour éviter les problèmes de build
    let nodemailerModule: any = null
    try {
      nodemailerModule = await import('nodemailer')
    } catch (importError) {
      console.error('Erreur lors de l\'import de nodemailer:', importError)
      return NextResponse.json(
        { error: 'Module nodemailer non disponible. Utilisez les Edge Functions Supabase pour l\'envoi d\'emails.' },
        { status: 503 }
      )
    }

    if (!nodemailerModule) {
      return NextResponse.json(
        { error: 'Module nodemailer non disponible.' },
        { status: 503 }
      )
    }

    // Configuration SMTP depuis les variables d'environnement ou les paramètres
    const smtpConfig = {
      host: smtp?.host || process.env.SMTP_HOST,
      port: parseInt(smtp?.port || process.env.SMTP_PORT || '587'),
      secure: smtp?.secure || process.env.SMTP_SECURE === 'true', // true pour port 465
      auth: {
        user: smtp?.user || process.env.SMTP_USER,
        pass: smtp?.password || process.env.SMTP_PASSWORD,
      },
    }

    if (!smtpConfig.host || !smtpConfig.auth.user || !smtpConfig.auth.pass) {
      return NextResponse.json(
        { error: 'Configuration SMTP manquante' },
        { status: 400 }
      )
    }

    // Créer le transporteur SMTP
    // Gérer les deux formats d'import : ES modules (default) et CommonJS
    const nodemailer = nodemailerModule.default || nodemailerModule
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: smtpConfig.auth,
    })

    // Vérifier la connexion SMTP
    await transporter.verify()

    // Envoyer l'email
    const info = await transporter.sendMail({
      from: email.from || `${process.env.SMTP_FROM_NAME || 'RetrouvAfrik'} <${process.env.SMTP_FROM || smtpConfig.auth.user}>`,
      to: email.to,
      subject: email.subject,
      html: email.html,
    })

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    })
  } catch (error: any) {
    console.error('Erreur SMTP:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    )
  }
}

