import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Version compatible Edge Runtime pour Cloudflare Pages
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  // Dans Edge Runtime, cookies() peut ne pas fonctionner comme prévu
  // Utilisons createClient directement avec les cookies extraits manuellement
  try {
    // Essayer d'utiliser cookies() si disponible (Node.js runtime)
    const cookieStore = cookies()
    const cookieHeader = cookieStore.toString()
    
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: cookieHeader ? { Cookie: cookieHeader } : {},
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  } catch (error) {
    // Fallback pour Edge Runtime : créer un client sans cookies
    // Les cookies seront gérés côté client
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }
}
