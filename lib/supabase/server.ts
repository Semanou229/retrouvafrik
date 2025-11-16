import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Version compatible Edge Runtime pour Cloudflare Pages avec @supabase/ssr
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Retourner un client avec des valeurs par défaut pour éviter les erreurs de build
    console.warn('Missing Supabase environment variables, using placeholder client')
    return createServerClient(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {
            // No-op in Edge Runtime
          },
        },
      }
    )
  }

  // Utiliser @supabase/ssr qui est compatible avec Edge Runtime
  // Il gère automatiquement les cookies dans Edge Runtime
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        try {
          const cookieStore = cookies()
          return cookieStore.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }))
        } catch {
          // Dans Edge Runtime, cookies() peut ne pas être disponible
          // Retourner un tableau vide, les cookies seront gérés côté client
          return []
        }
      },
      setAll(cookiesToSet) {
        try {
          const cookieStore = cookies()
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Dans Edge Runtime, on ne peut pas définir les cookies côté serveur
          // Ils seront gérés automatiquement côté client
        }
      },
    },
  })
}
