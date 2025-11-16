import { createClient } from '@supabase/supabase-js'

// Client Supabase avec service role key pour les opérations admin
// Ce client contourne RLS et doit être utilisé uniquement côté serveur
export const createAdminSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Variables d\'environnement Supabase manquantes pour le client admin')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

