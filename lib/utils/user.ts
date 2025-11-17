/**
 * Helper functions for user data
 */

/**
 * Get user display name (first name, full name, or email fallback)
 */
export function getUserDisplayName(user: any): string {
  if (!user) return 'Utilisateur'
  
  const metadata = user.user_metadata || {}
  
  // Try to get first name
  if (metadata.first_name) {
    return metadata.first_name
  }
  
  // Try to get full name
  if (metadata.full_name) {
    // Extract first name from full name if it contains a space
    const parts = metadata.full_name.trim().split(/\s+/)
    if (parts.length > 0) {
      return parts[0]
    }
    return metadata.full_name
  }
  
  // Fallback to email (first part before @)
  if (user.email) {
    return user.email.split('@')[0]
  }
  
  return 'Utilisateur'
}

/**
 * Get user full name or email fallback
 */
export function getUserFullName(user: any): string {
  if (!user) return 'Utilisateur'
  
  const metadata = user.user_metadata || {}
  
  if (metadata.full_name) {
    return metadata.full_name
  }
  
  if (metadata.first_name) {
    return metadata.first_name
  }
  
  if (user.email) {
    return user.email.split('@')[0]
  }
  
  return 'Utilisateur'
}

/**
 * Check if user has completed their profile (has name)
 */
export function hasCompletedProfile(user: any): boolean {
  if (!user) return false
  
  const metadata = user.user_metadata || {}
  return !!(metadata.first_name || metadata.full_name)
}

