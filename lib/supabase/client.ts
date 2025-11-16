import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

export const createSupabaseClient = () => {
  // Check if env vars are available first
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // During build time (static generation), env vars might not be available
  // Return a placeholder client that won't cause errors
  if (!supabaseUrl || !supabaseAnonKey) {
    // Create a minimal client with placeholder values
    // This prevents errors during build but won't work at runtime
    // Components should handle this gracefully
    return createClient(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
    )
  }
  
  // Always use client component client when in browser
  if (typeof window !== 'undefined') {
    try {
      return createClientComponentClient()
    } catch (error) {
      // Fallback to direct client creation if helper fails
      return createClient(supabaseUrl, supabaseAnonKey)
    }
  }
  
  // Server-side fallback
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Don't create instance at module level - let components create it when needed
// This prevents errors during static page generation

