import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

// Version ultra-simplifiée compatible Edge Runtime pour Cloudflare Pages
// Utilise headers() pour obtenir le token d'authentification depuis les cookies
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Retourner un client placeholder pour éviter les erreurs de build
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

  // Obtenir les headers de la requête pour extraire les cookies
  let authToken: string | null = null
  try {
    const headersList = headers()
    const cookieHeader = headersList.get('cookie')
    
    if (cookieHeader) {
      // Extraire le token depuis les cookies Supabase
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = value
        return acc
      }, {} as Record<string, string>)
      
      // Supabase stocke le token dans sb-<project-ref>-auth-token
      const projectRef = supabaseUrl.split('//')[1]?.split('.')[0]
      if (projectRef) {
        authToken = cookies[`sb-${projectRef}-auth-token`] || null
      }
    }
  } catch (error) {
    // Dans Edge Runtime, headers() peut ne pas être disponible
    // Continuer sans token d'authentification
  }

  // Créer le client avec le token si disponible
  const clientOptions: any = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }

  // Ajouter le token dans les headers si disponible
  if (authToken) {
    clientOptions.global = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  }

  return createClient(supabaseUrl, supabaseAnonKey, clientOptions)
}
