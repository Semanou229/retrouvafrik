import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Créer le client Supabase avec la clé service_role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Récupérer les notifications en attente
    const { data: pendingNotifications, error: fetchError } = await supabase
      .from("announcement_notifications")
      .select(`
        id,
        announcement_id,
        user_id,
        announcement:announcements(
          id,
          title,
          type,
          description,
          last_location,
          photos,
          urgency,
          created_at
        ),
        user:auth.users!announcement_notifications_user_id_fkey(
          email,
          email_confirmed_at
        )
      `)
      .eq("email_sent", false)
      .limit(50); // Traiter par lots de 50

    if (fetchError) {
      console.error("Erreur lors de la récupération des notifications:", fetchError);
      throw fetchError;
    }

    if (!pendingNotifications || pendingNotifications.length === 0) {
      return new Response(
        JSON.stringify({ message: "Aucune notification en attente" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Traiter chaque notification
    for (const notification of pendingNotifications) {
      try {
        const announcement = notification.announcement as any;
        const user = notification.user as any;

        if (!announcement || !user || !user.email) {
          await supabase
            .from("announcement_notifications")
            .update({
              email_sent: false,
              error_message: "Données manquantes",
            })
            .eq("id", notification.id);
          results.failed++;
          continue;
        }

        // Construire le contenu de l'email
        const announcementUrl = `${supabaseUrl.replace(
          "/rest/v1",
          ""
        )}/annonces/${announcement.id}`;
        const location = announcement.last_location || {};
        const locationText = location.city && location.city !== "Non spécifié"
          ? `${location.city}, ${location.country}`
          : location.country || "Non spécifié";

        const emailSubject = `🔔 Nouvelle annonce dans votre secteur - ${announcement.title}`;
        const emailBody = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
              .announcement-card { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF6B35; }
              .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .urgent { background: #fff3cd; border-left-color: #ffc107; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔔 Nouvelle annonce dans votre secteur</h1>
                <p>Une nouvelle annonce a été publiée près de chez vous</p>
              </div>
              <div class="content">
                <h2>${announcement.title}</h2>
                <div class="announcement-card ${announcement.urgency === 'urgent' ? 'urgent' : ''}">
                  <p><strong>Type:</strong> ${announcement.type === 'person' ? 'Personne' : announcement.type === 'animal' ? 'Animal' : 'Objet'}</p>
                  <p><strong>Localisation:</strong> ${locationText}</p>
                  ${announcement.urgency === 'urgent' ? '<p><strong style="color: #ff6b35;">⚠️ URGENT</strong></p>' : ''}
                  <p><strong>Description:</strong></p>
                  <p>${announcement.description.substring(0, 200)}${announcement.description.length > 200 ? '...' : ''}</p>
                </div>
                <div style="text-align: center;">
                  <a href="${announcementUrl}" class="button">Voir l'annonce complète</a>
                </div>
                <p style="margin-top: 30px; color: #666; font-size: 14px;">
                  Vous recevez cet email car vous êtes inscrit pour recevoir des notifications pour les nouvelles annonces dans votre secteur (${locationText}).
                </p>
              </div>
              <div class="footer">
                <p>RetrouvAfrik - Plateforme de solidarité</p>
                <p><a href="${supabaseUrl.replace("/rest/v1", "")}/mon-compte">Gérer mes préférences de notification</a></p>
              </div>
            </div>
          </body>
          </html>
        `;

        // Envoyer l'email via SMTP en utilisant l'API Next.js
        const smtpApiEndpoint = Deno.env.get("SMTP_API_ENDPOINT") || 
          `${Deno.env.get("NEXT_PUBLIC_SITE_URL") || "http://localhost:3000"}/api/smtp/send`;
        const smtpApiKey = Deno.env.get("SMTP_API_KEY");
        
        if (!smtpApiKey) {
          console.error("SMTP_API_KEY manquante dans les variables d'environnement Supabase");
          throw new Error("Configuration SMTP manquante: SMTP_API_KEY");
        }

        try {
          // Appeler l'API Next.js qui utilise nodemailer pour envoyer via SMTP
          const apiResponse = await fetch(smtpApiEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${smtpApiKey}`,
            },
            body: JSON.stringify({
              email: {
                from: `${Deno.env.get("SMTP_FROM_NAME") || "RetrouvAfrik"} <${Deno.env.get("SMTP_FROM") || "notifications@retrouvafrik.com"}>`,
                to: user.email,
                subject: emailSubject,
                html: emailBody,
              },
            }),
          });

          if (!apiResponse.ok) {
            const errorData = await apiResponse.json().catch(() => ({ error: await apiResponse.text() }));
            throw new Error(`Erreur API SMTP: ${JSON.stringify(errorData)}`);
          }

          const result = await apiResponse.json();
          console.log(`Email envoyé avec succès à ${user.email}, Message ID: ${result.messageId}`);
        } catch (smtpError: any) {
          console.error("Erreur SMTP:", smtpError);
          throw new Error(`Erreur lors de l'envoi SMTP: ${smtpError.message}`);
        }
        await supabase
          .from("announcement_notifications")
          .update({
            email_sent: true,
            sent_at: new Date().toISOString(),
          })
          .eq("id", notification.id);

        results.success++;
      } catch (error: any) {
        console.error(
          `Erreur pour la notification ${notification.id}:`,
          error
        );
        await supabase
          .from("announcement_notifications")
          .update({
            email_sent: false,
            error_message: error.message || "Erreur inconnue",
          })
          .eq("id", notification.id);
        results.failed++;
        results.errors.push(
          `Notification ${notification.id}: ${error.message}`
        );
      }
    }

    return new Response(
      JSON.stringify({
        message: `Traitement terminé: ${results.success} envoyés, ${results.failed} échoués`,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Erreur générale:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

