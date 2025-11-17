/**
 * Utility functions for sending emails
 */

const ADMIN_EMAIL = 'hello@retrouvafrik.com'

/**
 * Get admin email address
 */
export function getAdminEmail(): string {
  return ADMIN_EMAIL
}

/**
 * Send email via SMTP API
 */
export async function sendEmail({
  to,
  subject,
  html,
  from,
  fromName,
}: {
  to: string
  subject: string
  html: string
  from?: string
  fromName?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const smtpApiKey = process.env.SMTP_API_KEY
    const smtpApiEndpoint = process.env.SMTP_API_ENDPOINT || '/api/smtp/send'

    if (!smtpApiKey) {
      console.error('SMTP_API_KEY not configured')
      return { success: false, error: 'SMTP_API_KEY not configured' }
    }

    // Use absolute URL if SMTP_API_ENDPOINT is relative
    const endpoint = smtpApiEndpoint.startsWith('http')
      ? smtpApiEndpoint
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://retrouvafrik.vercel.app'}${smtpApiEndpoint}`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${smtpApiKey}`,
      },
      body: JSON.stringify({
        email: {
          from: from || `${fromName || 'RetrouvAfrik'} <${process.env.SMTP_FROM || 'noreply@retrouvafrik.com'}>`,
          to,
          subject,
          html,
        },
      }),
    })

    if (!response.ok) {
      let errorData: any = {}
      try {
        errorData = await response.json()
      } catch {
        const errorText = await response.text()
        errorData = { error: errorText }
      }
      throw new Error(errorData.error || 'Erreur lors de l\'envoi de l\'email')
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error sending email:', error)
    return { success: false, error: error.message || 'Erreur lors de l\'envoi de l\'email' }
  }
}

/**
 * Send email to admin
 */
export async function sendEmailToAdmin({
  subject,
  html,
}: {
  subject: string
  html: string
}): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to: getAdminEmail(),
    subject,
    html,
  })
}

/**
 * Send email to user
 */
export async function sendEmailToUser({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to,
    subject,
    html,
  })
}

