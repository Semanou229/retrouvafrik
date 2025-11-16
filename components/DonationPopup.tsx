'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { X, Heart, Server, Zap, Shield } from 'lucide-react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/client'

export default function DonationPopup() {
  const pathname = usePathname()
  const [showPopup, setShowPopup] = useState(false)
  const [donationUrl, setDonationUrl] = useState('#')
  const [donationTitle, setDonationTitle] = useState('Faites un don')
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Ne pas afficher le popup sur la page de don elle-même
    if (pathname === '/don') {
      return
    }

    // Vérifier si l'utilisateur a déjà fermé le popup
    const popupClosed = localStorage.getItem('donation_popup_closed')
    if (popupClosed) {
      const closedTime = parseInt(popupClosed, 10)
      const now = Date.now()
      // Ne pas réafficher si fermé il y a moins de 24h
      if (now - closedTime < 24 * 60 * 60 * 1000) {
        return
      }
    }

    // Charger les paramètres de don
    const loadDonationSettings = async () => {
      const supabase = createSupabaseClient()
      const { data } = await supabase
        .from('donation_settings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (data && data.is_active) {
        setDonationUrl(data.donation_url)
        setDonationTitle(data.title || 'Faites un don')
        setIsActive(true)
      }
    }

    loadDonationSettings()
  }, [pathname])

  useEffect(() => {
    if (!isActive) return

    // Timer 1: Afficher après 30 secondes
    const timer1 = setTimeout(() => {
      setShowPopup(true)
    }, 30000) // 30 secondes

    // Timer 2: Afficher après 5 minutes si pas encore affiché
    const timer2 = setTimeout(() => {
      setShowPopup(true)
    }, 300000) // 5 minutes

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [isActive])

  const handleClose = () => {
    setShowPopup(false)
    localStorage.setItem('donation_popup_closed', Date.now().toString())
  }

  if (!showPopup) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {donationTitle}
          </h2>
          <p className="text-gray-600">
            RetrouvAfrik est gratuit grâce à votre soutien
          </p>
        </div>

        {/* Reasons */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
            <Server className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-gray-900">Coûts des serveurs</p>
              <p className="text-gray-600">150-300€/mois pour héberger la plateforme</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
            <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-gray-900">Stockage des photos</p>
              <p className="text-gray-600">Plus de 50 000 photos à conserver</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-gray-900">Maintenance & sécurité</p>
              <p className="text-gray-600">Mises à jour hebdomadaires et support</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <a
            href={donationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="block w-full bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors text-center"
          >
            Faire un don maintenant
          </a>
          <Link
            href="/don"
            onClick={handleClose}
            className="block w-full text-center text-primary hover:underline text-sm font-medium"
          >
            En savoir plus sur nos besoins
          </Link>
          <button
            onClick={handleClose}
            className="block w-full text-center text-gray-500 hover:text-gray-700 text-sm"
          >
            Peut-être plus tard
          </button>
        </div>
      </div>
    </div>
  )
}

