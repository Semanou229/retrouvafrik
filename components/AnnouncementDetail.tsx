'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { MapPin, Calendar, Eye, Share2, AlertTriangle, MessageCircle, Info, UserCheck, Package, Mail, Phone, MessageSquare, EyeOff, Copy, Check, Video, Heart, Clock, Users } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/app/providers'
import CommentSection from './CommentSection'
import ReportModal from './ReportModal'
import ShareModal from './ShareModal'
import InformationModal from './InformationModal'
import RecognitionModal from './RecognitionModal'
import ObjectClaimModal from './ObjectClaimModal'
import ImageGallery from './ImageGallery'
import VideoEmbed from './VideoEmbed'
import type { Announcement, Comment } from '@/lib/types'

interface AnnouncementDetailProps {
  announcement: Announcement
  comments: Comment[]
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

// Fonction pour extraire le numéro WhatsApp depuis contact_other
const extractWhatsApp = (contactOther?: string): string | null => {
  if (!contactOther) return null
  
  // Chercher des patterns WhatsApp communs
  const whatsappPatterns = [
    /whatsapp[:\s]*(\+?\d{8,15})/i,
    /wa[:\s]*(\+?\d{8,15})/i,
    /(\+?\d{8,15})/,
  ]
  
  for (const pattern of whatsappPatterns) {
    const match = contactOther.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  
  // Si on trouve "whatsapp" dans le texte, retourner le texte complet
  if (contactOther.toLowerCase().includes('whatsapp')) {
    return contactOther
  }
  
  return null
}

// Fonction pour extraire les informations "perdu de vue" depuis la description
const parseLostSightInfo = (announcement: Announcement) => {
  if (!announcement.is_lost_sight) return null
  
  // Extraire le nom depuis le titre (format: "Recherche de [Nom] - [Année/Période]")
  const titleMatch = announcement.title.match(/Recherche de (.+?) - (.+)/)
  const personName = titleMatch ? titleMatch[1].trim() : ''
  const yearOrPeriod = titleMatch ? titleMatch[2].trim() : ''
  
  // Extraire le lien et l'histoire depuis la description
  const descriptionParts = announcement.description.split('\n\n')
  let relationship = ''
  let story = ''
  
  if (descriptionParts.length > 0) {
    const relationshipMatch = descriptionParts[0].match(/Lien avec cette personne : (.+)/)
    relationship = relationshipMatch ? relationshipMatch[1].trim() : ''
    
    // Le reste est l'histoire
    story = descriptionParts.slice(1).join('\n\n').trim()
  }
  
  return {
    personName,
    yearOrPeriod,
    relationship,
    story,
  }
}

export default function AnnouncementDetail({ announcement, comments: initialComments }: AnnouncementDetailProps) {
  const { user } = useAuth()
  const [showReportModal, setShowReportModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showInformationModal, setShowInformationModal] = useState(false)
  const [showRecognitionModal, setShowRecognitionModal] = useState(false)
  const [showObjectClaimModal, setShowObjectClaimModal] = useState(false)
  
  // États pour révéler/masquer les contacts
  const [showEmail, setShowEmail] = useState(false)
  const [showPhone, setShowPhone] = useState(false)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const typeLabel = getTypeLabel(announcement)
  const typeColor = typeColors[announcement.type]
  const photos = announcement.photos || []
  const isObjectFound = announcement.type === 'object' && announcement.mode === 'trouve'
  const whatsAppNumber = extractWhatsApp(announcement.contact_other)
  const lostSightInfo = parseLostSightInfo(announcement)

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header amélioré */}
      <div className="bg-gradient-to-br from-white via-primary/5 to-primary/10 rounded-2xl shadow-xl p-8 border border-primary/20">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md ${typeColor}`}>
              {typeLabel}
            </span>
            {announcement.verified && (
              <span className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md">
                <Info className="w-4 h-4" />
                Vérifiée
              </span>
            )}
            {announcement.urgency === 'urgent' && (
              <span className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                Urgent
              </span>
            )}
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-primary/30 rounded-xl hover:bg-primary/10 hover:border-primary transition-all shadow-md"
          >
            <Share2 className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">Partager</span>
          </button>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 leading-tight">
          {lostSightInfo ? (
            <>
              Recherche de <span className="text-primary">{lostSightInfo.personName}</span>
              {lostSightInfo.yearOrPeriod && (
                <span className="text-gray-600 font-normal"> - {lostSightInfo.yearOrPeriod}</span>
              )}
            </>
          ) : (
            announcement.title
          )}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-base text-gray-700">
          {announcement.last_location.city !== 'Non spécifié' && (
            <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl shadow-sm">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium">
                {announcement.last_location.city}, {announcement.last_location.country}
              </span>
            </div>
          )}
          {!lostSightInfo && (
            <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl shadow-sm">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">
                {format(new Date(announcement.disappearance_date), 'd MMMM yyyy', { locale: fr })}
              </span>
            </div>
          )}
          {lostSightInfo && lostSightInfo.yearOrPeriod && (
            <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl shadow-sm">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">
                Perdu de vue : {lostSightInfo.yearOrPeriod}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl shadow-sm">
            <Eye className="w-5 h-5 text-primary" />
            <span className="font-medium">{announcement.views_count || 0} vues</span>
          </div>
        </div>
      </div>

      {/* Galerie photos */}
      {photos.length > 0 && (
        <ImageGallery images={photos} title={announcement.title} />
      )}

      {/* Vidéos */}
      {announcement.videos && announcement.videos.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Vidéos</h2>
            <span className="text-sm text-gray-500">({announcement.videos.length} vidéo{announcement.videos.length > 1 ? 's' : ''})</span>
          </div>
          <div className="space-y-6">
            {announcement.videos.map((videoUrl, index) => (
              <div key={index} className="space-y-2">
                <VideoEmbed url={videoUrl} title={`${announcement.title} - Vidéo ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Affichage personnalisé pour "Perdu de vue" */}
      {lostSightInfo ? (
        <div className="space-y-6">
          {/* Informations principales */}
          <div className="bg-gradient-to-br from-primary/10 via-white to-primary/5 rounded-2xl shadow-xl p-8 border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Informations sur la personne recherchée</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nom de la personne */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Nom recherché</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">{lostSightInfo.personName || 'Non spécifié'}</p>
              </div>

              {/* Année/Période */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Quand perdu de vue</h3>
                </div>
                <p className="text-xl font-bold text-gray-900">{lostSightInfo.yearOrPeriod || 'Non spécifié'}</p>
              </div>

              {/* Lien avec la personne */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Lien avec cette personne</h3>
                </div>
                <p className="text-lg font-semibold text-primary">{lostSightInfo.relationship || 'Non spécifié'}</p>
              </div>
            </div>
          </div>

          {/* Histoire/Témoignage */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-primary rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">Histoire / Témoignage</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">
                {lostSightInfo.story || announcement.description}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Description standard pour les autres types d'annonces */
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Description</h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">
              {announcement.description}
            </p>
          </div>
        </div>
      )}

      {/* Contact Information améliorée avec boutons de révélation */}
      <div className="bg-gradient-to-br from-primary/5 via-white to-primary/5 rounded-2xl shadow-xl p-8 border-2 border-primary/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-primary rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-900">Coordonnées de contact</h2>
        </div>
        <p className="text-gray-600 mb-6 text-sm">
          Cliquez sur les boutons ci-dessous pour révéler les informations de contact
        </p>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Email */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-primary/50 transition-all shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <span className="font-semibold text-gray-900">Email</span>
              </div>
            </div>
            {showEmail ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <a 
                    href={`mailto:${announcement.contact_email}`} 
                    className="text-primary font-medium hover:underline break-all"
                  >
                    {announcement.contact_email}
                  </a>
                  <button
                    onClick={() => handleCopy(announcement.contact_email, 'email')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Copier"
                  >
                    {copied === 'email' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
                <button
                  onClick={() => setShowEmail(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors"
                >
                  <EyeOff className="w-4 h-4" />
                  Masquer
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowEmail(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all shadow-md hover:shadow-lg"
              >
                <Eye className="w-4 h-4" />
                Afficher l'email
              </button>
            )}
          </div>

          {/* Téléphone */}
          {announcement.contact_phone && (
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-primary/50 transition-all shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-900">Téléphone</span>
                </div>
              </div>
              {showPhone ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <a 
                      href={`tel:${announcement.contact_phone}`} 
                      className="text-primary font-medium hover:underline"
                    >
                      {announcement.contact_phone}
                    </a>
                    <button
                      onClick={() => handleCopy(announcement.contact_phone, 'phone')}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Copier"
                    >
                      {copied === 'phone' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => setShowPhone(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors"
                  >
                    <EyeOff className="w-4 h-4" />
                    Masquer
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowPhone(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
                >
                  <Eye className="w-4 h-4" />
                  Afficher le numéro
                </button>
              )}
            </div>
          )}

          {/* WhatsApp */}
          {whatsAppNumber && (
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-primary/50 transition-all shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-900">WhatsApp</span>
                </div>
              </div>
              {showWhatsApp ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <a 
                      href={`https://wa.me/${whatsAppNumber.replace(/[^0-9+]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 font-medium hover:underline break-all"
                    >
                      {whatsAppNumber}
                    </a>
                    <button
                      onClick={() => handleCopy(whatsAppNumber, 'whatsapp')}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Copier"
                    >
                      {copied === 'whatsapp' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/${whatsAppNumber.replace(/[^0-9+]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all shadow-md"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Ouvrir WhatsApp
                    </a>
                    <button
                      onClick={() => setShowWhatsApp(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Masquer"
                    >
                      <EyeOff className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowWhatsApp(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
                >
                  <Eye className="w-4 h-4" />
                  Afficher WhatsApp
                </button>
              )}
            </div>
          )}
        </div>

        {/* Autres informations de contact (si pas WhatsApp) */}
        {announcement.contact_other && !whatsAppNumber && (
          <div className="mt-6 bg-white rounded-xl p-6 border-2 border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Autres informations</h3>
            <p className="text-gray-700">{announcement.contact_other}</p>
          </div>
        )}
      </div>

      {/* Actions améliorées */}
      <div className="bg-gradient-to-r from-primary/10 via-white to-primary/10 rounded-2xl shadow-xl p-8 border-2 border-primary/20">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => {
              if (user) {
                setShowInformationModal(true)
              } else {
                window.location.href = '/connexion?redirect=' + encodeURIComponent(window.location.pathname)
              }
            }}
            className="flex-1 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
          >
            <Info className="w-6 h-6" />
            J'ai une information
          </button>
          
          {announcement.type === 'person' && (
            <button
              onClick={() => {
                if (user) {
                  setShowRecognitionModal(true)
                } else {
                  window.location.href = '/connexion?redirect=' + encodeURIComponent(window.location.pathname)
                }
              }}
              className="flex-1 bg-primary-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-darkest transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
            >
              <UserCheck className="w-6 h-6" />
              Je reconnais cette personne
            </button>
          )}

          {isObjectFound && (
            <button
              onClick={() => {
                if (user) {
                  setShowObjectClaimModal(true)
                } else {
                  window.location.href = '/connexion?redirect=' + encodeURIComponent(window.location.pathname)
                }
              }}
              className="flex-1 bg-primary-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-darkest transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
            >
              <Package className="w-6 h-6" />
              Je pense que c'est mon objet
            </button>
          )}
        </div>
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-gray-600 flex items-center justify-center gap-4 flex-wrap">
            <span className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="font-semibold">{initialComments.length} commentaire{initialComments.length > 1 ? 's' : ''}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              <span className="font-semibold">Partagez pour augmenter la visibilité</span>
            </span>
          </p>
        </div>
      </div>

      {/* Comments */}
      <CommentSection announcementId={announcement.id} initialComments={initialComments} />

      {/* Modals */}
      {showReportModal && (
        <ReportModal
          announcementId={announcement.id}
          onClose={() => setShowReportModal(false)}
        />
      )}
      {showShareModal && (
        <ShareModal
          announcement={announcement}
          onClose={() => setShowShareModal(false)}
        />
      )}
      {showInformationModal && (
        <InformationModal
          announcementId={announcement.id}
          announcementOwnerId={announcement.user_id}
          announcementOwnerEmail={announcement.contact_email}
          onClose={() => setShowInformationModal(false)}
        />
      )}
      {showRecognitionModal && (
        <RecognitionModal
          announcementId={announcement.id}
          onClose={() => setShowRecognitionModal(false)}
        />
      )}
      {showObjectClaimModal && (
        <ObjectClaimModal
          announcementId={announcement.id}
          announcementOwnerId={announcement.user_id}
          announcementOwnerEmail={announcement.contact_email}
          onClose={() => setShowObjectClaimModal(false)}
        />
      )}
    </div>
  )
}
