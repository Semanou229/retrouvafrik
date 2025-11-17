export type AnnouncementType = 'person' | 'animal' | 'object'
export type AnnouncementStatus = 'active' | 'resolved' | 'archived'
export type UrgencyLevel = 'normal' | 'urgent'
export type ObjectMode = 'perdu' | 'trouve'

export interface Announcement {
  id: string
  type: AnnouncementType
  mode?: ObjectMode // Pour les objets : 'perdu' ou 'trouve'
  is_lost_sight?: boolean // Pour distinguer "perdu de vue" des personnes disparues
  title: string
  description: string
  disappearance_date: string
  last_location: {
    country: string
    city: string
    address?: string
  }
  urgency: UrgencyLevel
  status: AnnouncementStatus
  photos: string[]
  videos?: string[] // URLs YouTube ou Vimeo
  contact_email: string
  contact_phone?: string
  contact_other?: string
  contact_visibility: 'public' | 'members_only'
  secret_detail?: string // Détail secret pour les objets trouvés
  user_id: string
  views_count: number
  verified?: boolean // Badge de vérification admin
  hidden?: boolean // Masqué par l'admin
  approved?: boolean // Approuvé par l'admin
  admin_notes?: string // Notes de l'admin
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  announcement_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user?: {
    email: string
  }
  announcement?: {
    id: string
    title: string
  }
}

export interface Report {
  id: string
  announcement_id: string
  user_id?: string
  type: 'seen' | 'information' | 'other'
  description: string
  location?: string
  date?: string
  contact_email: string
  contact_phone?: string
  photos?: string[]
  created_at: string
  announcement?: {
    id: string
    title: string
  }
}

export interface User {
  id: string
  email: string
  created_at: string
}

export interface Message {
  id: string
  announcement_id: string
  sender_id: string
  recipient_id: string
  content: string
  photo_url?: string
  location?: {
    lat: number
    lng: number
    address?: string
  }
  message_type: 'text' | 'photo' | 'location' | 'recognition'
  is_read: boolean
  created_at: string
  updated_at: string
  sender?: {
    email: string
  }
  recipient?: {
    email: string
  }
  announcement?: {
    id: string
    title: string
    type?: string
  }
}

export interface Recognition {
  id: string
  announcement_id: string
  user_id?: string
  message: string
  contact_email: string
  contact_phone?: string
  photo_url?: string
  location?: {
    lat: number
    lng: number
    address?: string
  }
  created_at: string
}

export interface ObjectClaim {
  id: string
  announcement_id: string
  claimant_id?: string
  message: string
  contact_email: string
  contact_phone?: string
  description: string
  secret_proof?: string
  status: 'pending' | 'validated' | 'rejected'
  created_at: string
  updated_at: string
}

export interface SupportTicket {
  id: string
  user_id?: string
  type: 'technical' | 'announcement_review' | 'modification_request' | 'fraud'
  subject: string
  description: string
  announcement_id?: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  assigned_to?: string
  internal_notes?: string
  created_at: string
  updated_at: string
  resolved_at?: string
  user?: {
    email: string
  }
  assigned_admin?: {
    email: string
  }
  announcement?: {
    id: string
    title: string
  }
}
