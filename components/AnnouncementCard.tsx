'use client'

import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { MapPin, Calendar, Eye, AlertTriangle } from 'lucide-react'
import type { Announcement } from '@/lib/types'

interface AnnouncementCardProps {
  announcement: Announcement
}

const getTypeLabel = (announcement: Announcement) => {
  if (announcement.type === 'person') {
    return announcement.is_lost_sight ? 'Perdu de vue' : 'Personne disparue'
  }
  if (announcement.type === 'animal') return 'Animal perdu'
  if (announcement.type === 'object') {
    return announcement.mode === 'trouve' ? 'Objet trouvé' : 'Objet perdu'
  }
  return 'Annonce'
}

const typeColors = {
  person: 'bg-primary/10 text-primary-dark',
  animal: 'bg-primary/10 text-primary-dark',
  object: 'bg-primary/10 text-primary-dark',
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const typeLabel = getTypeLabel(announcement)
  const typeColor = typeColors[announcement.type]
  const photoUrl = announcement.photos && announcement.photos.length > 0 
    ? announcement.photos[0] 
    : null

  return (
    <Link href={`/annonces/${announcement.id}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer h-full flex flex-col border border-gray-100 transform hover:-translate-y-1">
        {/* Image */}
        <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
          {photoUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={photoUrl}
                alt={announcement.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span>Aucune photo</span>
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold bg-white shadow-md ${typeColor}`}>
              {typeLabel}
            </span>
            {announcement.urgency === 'urgent' && (
              <span className="bg-primary text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-lg">
                <AlertTriangle className="w-3 h-3" />
                Urgent
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {announcement.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {announcement.description}
          </p>
          
          {/* Info */}
          <div className="space-y-2 mt-auto">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">
                {announcement.last_location.city}, {announcement.last_location.country}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>
                {format(new Date(announcement.disappearance_date), 'd MMMM yyyy', { locale: fr })}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Eye className="w-4 h-4 mr-1" />
              <span>{announcement.views_count || 0} vues</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

