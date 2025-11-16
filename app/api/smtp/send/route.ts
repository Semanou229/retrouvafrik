import { NextResponse } from 'next/server'

// Note: Edge Runtime désactivé car async_hooks n'est pas disponible dans Edge Runtime
// export const runtime = 'edge'

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

    // Option 1: Utiliser Resend API (compatible Edge Runtime)
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      try {
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

        if (!resendResponse.ok) {
          const errorData = await resendResponse.json().catch(() => ({}))
          throw new Error(errorData.message || 'Erreur Resend API')
        }

        const result = await resendResponse.json()
        return NextResponse.json({
          success: true,
          messageId: result.id,
          provider: 'resend',
        })
      } catch (resendError: any) {
        console.error('Erreur Resend:', resendError)
        // Continuer avec l'option 2 si Resend échoue
      }
    }

    // Option 2: Utiliser Supabase Edge Function pour l'envoi SMTP
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      try {
        // Appeler une Edge Function Supabase qui gère l'envoi SMTP
        // Note: Vous devrez créer cette Edge Function dans Supabase
        const functionUrl = `${supabaseUrl}/functions/v1/send-email`
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            to: email.to,
            subject: email.subject,
            html: email.html,
            from: email.from || `${process.env.SMTP_FROM_NAME || 'RetrouvAfrik'} <${process.env.SMTP_FROM || 'noreply@retrouvafrik.com'}>`,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Erreur Edge Function')
        }

        const result = await response.json()
        return NextResponse.json({
          success: true,
          messageId: result.messageId,
          provider: 'supabase-edge-function',
        })
      } catch (supabaseError: any) {
        console.error('Erreur Supabase Edge Function:', supabaseError)
        // Continuer avec l'option 3 si Supabase échoue
      }
    }

    // Option 3: Retourner une erreur si aucune option n'est disponible
    return NextResponse.json(
      {
        error: 'Aucun service d\'envoi d\'email configuré. Configurez RESEND_API_KEY ou créez une Edge Function Supabase pour l\'envoi SMTP.',
        hint: 'Pour utiliser Resend: ajoutez RESEND_API_KEY dans vos variables d\'environnement. Pour utiliser SMTP via Supabase: créez une Edge Function dans supabase/functions/send-email/',
      },
      { status: 503 }
    )
  } catch (error: any) {
    console.error('Erreur API SMTP:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    )
  }
}
