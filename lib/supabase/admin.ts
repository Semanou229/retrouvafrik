import { createClient } from '@supabase/supabase-js'

// Client Supabase avec service role key pour les opérations admin
// Ce client contourne RLS et doit être utilisé uniquement côté serveur
export const createAdminSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL est manquant')
  }

  if (!supabaseServiceKey) {
    // Si la service role key n'est pas disponible, retourner null
    // Le code appelant devra gérer ce cas
    console.warn('SUPABASE_SERVICE_ROLE_KEY n\'est pas définie. Les opérations admin pourraient être limitées.')
    return null
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

