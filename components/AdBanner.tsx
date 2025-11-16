'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { X } from 'lucide-react'
import Image from 'next/image'

interface AdCampaign {
  id: string
  title: string
  ad_url: string
  image_url?: string
  placement: 'header' | 'sidebar' | 'footer' | 'between_posts' | 'popup'
  max_impressions?: number
  max_clicks?: number
}

interface AdBannerProps {
  placement: AdCampaign['placement']
  className?: string
}

export default function AdBanner({ placement, className = '' }: AdBannerProps) {
  const [campaign, setCampaign] = useState<AdCampaign | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const now = new Date().toISOString()
        
        const { data: campaigns } = await supabase
          .from('ad_campaigns')
          .select('*')
          .eq('placement', placement)
          .eq('status', 'active')
          .lte('start_date', now)
          .gte('end_date', now)
          .order('priority', { ascending: false })
          .limit(1)

        if (campaigns && campaigns.length > 0) {
          const selectedCampaign = campaigns[0]
          
          // Vérifier les limites d'impressions/clics
          const { data: stats } = await supabase
            .from('ad_stats')
            .select('impressions, clicks')
            .eq('campaign_id', selectedCampaign.id)
            .eq('date', new Date().toISOString().split('T')[0])
            .single()

          const todayImpressions = stats?.impressions || 0
          const todayClicks = stats?.clicks || 0

          if (
            (!selectedCampaign.max_impressions || todayImpressions < selectedCampaign.max_impressions) &&
            (!selectedCampaign.max_clicks || todayClicks < selectedCampaign.max_clicks)
          ) {
            setCampaign(selectedCampaign)
            // Enregistrer l'impression
            recordImpression(selectedCampaign.id)
          }
        }
      } catch (err) {
        console.error('Erreur chargement campagne pub:', err)
      }
    }

    loadCampaign()
  }, [placement])

  const recordImpression = async (campaignId: string) => {
    const today = new Date().toISOString().split('T')[0]
    
    // Vérifier si une entrée existe déjà pour aujourd'hui
    const { data: existing } = await supabase
      .from('ad_stats')
      .select('id, impressions')
      .eq('campaign_id', campaignId)
      .eq('date', today)
      .single()

    if (existing) {
      // Incrémenter les impressions
      await supabase
        .from('ad_stats')
        .update({ impressions: (existing.impressions || 0) + 1 })
        .eq('id', existing.id)
    } else {
      // Créer une nouvelle entrée
      await supabase
        .from('ad_stats')
        .insert([{ campaign_id: campaignId, date: today, impressions: 1, clicks: 0 }])
    }
  }

  const handleClick = async () => {
    if (!campaign) return

    const today = new Date().toISOString().split('T')[0]
    
    const { data: existing } = await supabase
      .from('ad_stats')
      .select('id, clicks')
      .eq('campaign_id', campaign.id)
      .eq('date', today)
      .single()

    if (existing) {
      await supabase
        .from('ad_stats')
        .update({ clicks: (existing.clicks || 0) + 1 })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('ad_stats')
        .insert([{ campaign_id: campaign.id, date: today, impressions: 0, clicks: 1 }])
    }

    // Ouvrir le lien dans un nouvel onglet
    window.open(campaign.ad_url, '_blank', 'noopener,noreferrer')
  }

  if (!campaign || !isVisible) return null

  // Styles selon le placement
  const placementStyles = {
    header: 'w-full h-20 md:h-24',
    sidebar: 'w-full aspect-[3/4] max-w-[300px]',
    footer: 'w-full h-20 md:h-24',
    between_posts: 'w-full h-32 md:h-40',
    popup: 'fixed bottom-4 right-4 w-80 md:w-96 z-50 shadow-2xl',
  }

  return (
    <div className={`relative ${placementStyles[placement]} ${className}`}>
      {placement === 'popup' && (
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors z-10"
          aria-label="Fermer la publicité"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      )}
      <a
        href={campaign.ad_url}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full relative rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
      >
        {campaign.image_url ? (
          <Image
            src={campaign.image_url}
            alt={campaign.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
            <span className="text-primary font-semibold text-sm md:text-base px-4 text-center">
              {campaign.title}
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
          Publicité
        </div>
      </a>
    </div>
  )
}

