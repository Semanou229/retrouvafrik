// Fonction utilitaire pour envoyer des emails via SMTP
// Utilise une connexion SMTP directe

interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
  fromName: string;
  secure: boolean; // true pour SSL/TLS
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

// Fonction pour envoyer un email via SMTP
export async function sendEmailViaSMTP(
  config: SMTPConfig,
  emailData: EmailData
): Promise<void> {
  // Note: Deno ne supporte pas directement les sockets SMTP
  // Cette fonction nécessite une bibliothèque SMTP compatible Deno
  // ou un service de relais SMTP HTTP
  
  // Solution recommandée: Utiliser un service de relais SMTP HTTP
  // comme Mailgun, SendGrid, ou votre propre serveur SMTP avec API HTTP
  
  // Pour un envoi SMTP direct, vous pouvez utiliser:
  // 1. Une bibliothèque comme "deno-smtp" (si disponible)
  // 2. Un service de relais SMTP HTTP
  // 3. Un webhook vers votre serveur qui envoie via SMTP
  
  // Exemple avec un service de relais HTTP (Mailgun, SendGrid, etc.)
  const relayUrl = Deno.env.get("SMTP_RELAY_URL");
  
  if (relayUrl) {
    // Utiliser un service de relais HTTP
    const response = await fetch(relayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${config.user}:${config.password}`)}`,
      },
      body: JSON.stringify({
        from: `${config.fromName} <${config.from}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur SMTP Relay: ${errorText}`);
    }
    
    return;
  }
  
  // Si pas de relais HTTP, essayer d'utiliser directement SMTP
  // Cela nécessite une bibliothèque SMTP compatible Deno
  // Pour l'instant, on va utiliser une approche avec fetch vers un endpoint personnalisé
  
  // Alternative: Créer un endpoint API dans votre application Next.js qui envoie via SMTP
  const apiEndpoint = Deno.env.get("SMTP_API_ENDPOINT");
  
  if (apiEndpoint) {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SMTP_API_KEY") || ""}`,
      },
      body: JSON.stringify({
        smtp: {
          host: config.host,
          port: config.port,
          user: config.user,
          password: config.password,
          secure: config.secure,
        },
        email: {
          from: `${config.fromName} <${config.from}>`,
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur API SMTP: ${errorText}`);
    }
    
    return;
  }
  
  // Si aucune méthode n'est configurée, lancer une erreur
  throw new Error(
    "Aucune méthode SMTP configurée. " +
    "Configurez SMTP_RELAY_URL ou SMTP_API_ENDPOINT dans les variables d'environnement."
  );
}

