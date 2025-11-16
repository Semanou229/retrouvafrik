import { createClient } from '@supabase/supabase-js'

// Version compatible Edge Runtime pour Cloudflare Pages
// N'utilise pas cookies() car cela ne fonctionne pas correctement dans Edge Runtime
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Retourner un client avec des valeurs par défaut pour éviter les erreurs de build
    // En production, cela devrait être géré par les variables d'environnement
    console.warn('Missing Supabase environment variables, using placeholder client')
    return createClient(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )
  }

  // Créer un client simple sans gestion de cookies côté serveur
  // Dans Edge Runtime, les cookies sont gérés automatiquement par le navigateur
  // Ce client fonctionnera pour les requêtes publiques (lecture seule)
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
