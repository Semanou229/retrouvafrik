'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import {
  Globe,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar,
  TrendingUp,
  MousePointerClick,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  BarChart3,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface AdRequest {
  id: string
  company_name: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  website?: string
  description: string
  budget_range: string
  target_audience?: string
  status: 'pending' | 'approved' | 'rejected' | 'contacted'
  admin_notes?: string
  created_at: string
}

interface AdCampaign {
  id: string
  ad_request_id?: string
  title: string
  description?: string
  advertiser_name: string
  advertiser_email: string
  ad_url: string
  image_url?: string
  placement: 'header' | 'sidebar' | 'footer' | 'between_posts' | 'popup'
  start_date: string
  end_date: string
  max_impressions?: number
  max_clicks?: number
  status: 'active' | 'paused' | 'completed' | 'expired'
  priority: number
  created_at: string
}

interface AdPlacement {
  id: string
  name: string
  description?: string
  width?: number
  height?: number
  max_campaigns: number
  is_active: boolean
}

interface AdManagementProps {
  initialAdRequests: AdRequest[]
  initialCampaigns: AdCampaign[]
  initialPlacements: AdPlacement[]
}

export default function AdManagement({
  initialAdRequests,
  initialCampaigns,
  initialPlacements,
}: AdManagementProps) {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const [activeTab, setActiveTab] = useState<'requests' | 'campaigns' | 'create'>('requests')
  const [adRequests, setAdRequests] = useState<AdRequest[]>(initialAdRequests)
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(initialCampaigns)
  const [selectedRequest, setSelectedRequest] = useState<AdRequest | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [campaignStats, setCampaignStats] = useState<any>(null)

  // Formulaire de création de campagne
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    advertiser_name: '',
    advertiser_email: '',
    ad_url: '',
    image_url: '',
    placement: 'sidebar' as AdCampaign['placement'],
    start_date: '',
    end_date: '',
    max_impressions: '',
    max_clicks: '',
    priority: 0,
  })

  const updateRequestStatus = async (id: string, status: AdRequest['status'], notes?: string) => {
    const { error } = await supabase
      .from('ad_requests')
      .update({ status, admin_notes: notes || null })
      .eq('id', id)

    if (!error) {
      setAdRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status, admin_notes: notes } : r)))
      setSelectedRequest(null)
      router.refresh()
    }
  }

  const createCampaign = async () => {
    if (!campaignForm.title || !campaignForm.advertiser_email || !campaignForm.ad_url) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    const campaignData = {
      title: campaignForm.title,
      description: campaignForm.description || null,
      advertiser_name: campaignForm.advertiser_name,
      advertiser_email: campaignForm.advertiser_email,
      ad_url: campaignForm.ad_url,
      image_url: campaignForm.image_url || null,
      placement: campaignForm.placement,
      start_date: campaignForm.start_date,
      end_date: campaignForm.end_date,
      max_impressions: campaignForm.max_impressions ? parseInt(campaignForm.max_impressions) : null,
      max_clicks: campaignForm.max_clicks ? parseInt(campaignForm.max_clicks) : null,
      priority: campaignForm.priority,
      status: 'active' as const,
    }

    const { data, error } = await supabase
      .from('ad_campaigns')
      .insert([campaignData])
      .select()
      .single()

    if (!error && data) {
      setCampaigns((prev) => [data, ...prev])
      setShowCreateModal(false)
      setCampaignForm({
        title: '',
        description: '',
        advertiser_name: '',
        advertiser_email: '',
        ad_url: '',
        image_url: '',
        placement: 'sidebar',
        start_date: '',
        end_date: '',
        max_impressions: '',
        max_clicks: '',
        priority: 0,
      })
      router.refresh()
    } else {
      alert('Erreur lors de la création de la campagne: ' + (error?.message || 'Erreur inconnue'))
    }
  }

  const deleteCampaign = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) return

    const { error } = await supabase.from('ad_campaigns').delete().eq('id', id)

    if (!error) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id))
      router.refresh()
    }
  }

  const toggleCampaignStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active'
    const { error } = await supabase.from('ad_campaigns').update({ status: newStatus }).eq('id', id)

    if (!error) {
      setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus as any } : c)))
      router.refresh()
    }
  }

  const loadCampaignStats = async (campaignId: string) => {
    const { data: stats } = await supabase
      .from('ad_stats')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('date', { ascending: false })

    const campaign = campaigns.find((c) => c.id === campaignId)
    if (campaign) {
      const totalImpressions = stats?.reduce((sum, s) => sum + (s.impressions || 0), 0) || 0
      const totalClicks = stats?.reduce((sum, s) => sum + (s.clicks || 0), 0) || 0
      const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00'

      setCampaignStats({
        campaign,
        stats: stats || [],
        totalImpressions,
        totalClicks,
        ctr,
      })
      setShowStatsModal(true)
    }
  }

  const exportStats = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId)
    const stats = campaignStats?.stats || []

    const csv = [
      ['Date', 'Impressions', 'Clics', 'CTR (%)'].join(','),
      ...stats.map((s: any) =>
        [
          format(new Date(s.date), 'yyyy-MM-dd'),
          s.impressions || 0,
          s.clicks || 0,
          s.impressions > 0 ? ((s.clicks / s.impressions) * 100).toFixed(2) : '0.00',
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `stats-${campaign?.title || campaignId}-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      contacted: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800',
      expired: 'bg-red-100 text-red-800',
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Gestion des Publicités</h1>
            </div>
            <p className="text-orange-100">Gérez les demandes et campagnes publicitaires</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
              activeTab === 'requests'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            Demandes ({adRequests.filter((r) => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
              activeTab === 'campaigns'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            Campagnes ({campaigns.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('create')
              setShowCreateModal(true)
            }}
            className="px-4 py-2 font-semibold rounded-t-lg text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Créer une campagne
          </button>
        </div>

        {/* Demandes */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {adRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Aucune demande de publicité</p>
              </div>
            ) : (
              adRequests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{request.company_name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(request.status)}`}>
                          {request.status === 'pending' ? 'En attente' : request.status === 'approved' ? 'Approuvée' : request.status === 'rejected' ? 'Rejetée' : 'Contactée'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Contact:</strong> {request.contact_name} ({request.contact_email})
                        {request.contact_phone && ` - ${request.contact_phone}`}
                      </p>
                      {request.website && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Site web:</strong>{' '}
                          <a href={request.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {request.website}
                          </a>
                        </p>
                      )}
                      <p className="text-sm text-gray-700 mb-2">{request.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span><strong>Budget:</strong> {request.budget_range}</span>
                        {request.target_audience && <span><strong>Cible:</strong> {request.target_audience}</span>}
                        <span><strong>Date:</strong> {format(new Date(request.created_at), 'd MMM yyyy', { locale: fr })}</span>
                      </div>
                      {request.admin_notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                          <strong>Notes admin:</strong> {request.admin_notes}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateRequestStatus(request.id, 'approved')}
                            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                          >
                            Approuver
                          </button>
                          <button
                            onClick={() => {
                              const notes = prompt('Notes admin (optionnel):')
                              updateRequestStatus(request.id, 'contacted', notes || undefined)
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                          >
                            Marquer contacté
                          </button>
                          <button
                            onClick={() => {
                              const notes = prompt('Raison du rejet (optionnel):')
                              updateRequestStatus(request.id, 'rejected', notes || undefined)
                            }}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            Rejeter
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setCampaignForm({
                            title: request.company_name,
                            description: request.description,
                            advertiser_name: request.contact_name,
                            advertiser_email: request.contact_email,
                            ad_url: request.website || '',
                            image_url: '',
                            placement: 'sidebar',
                            start_date: '',
                            end_date: '',
                            max_impressions: '',
                            max_clicks: '',
                            priority: 0,
                          })
                          setShowCreateModal(true)
                          setActiveTab('create')
                        }}
                        className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-dark transition-colors"
                      >
                        Créer campagne
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Campagnes */}
        {activeTab === 'campaigns' && (
          <div className="space-y-4">
            {campaigns.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Aucune campagne publicitaire</p>
              </div>
            ) : (
              campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{campaign.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(campaign.status)}`}>
                          {campaign.status === 'active' ? 'Active' : campaign.status === 'paused' ? 'En pause' : campaign.status === 'completed' ? 'Terminée' : 'Expirée'}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                          {campaign.placement}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Annonceur:</strong> {campaign.advertiser_name} ({campaign.advertiser_email})
                      </p>
                      {campaign.description && <p className="text-sm text-gray-700 mb-2">{campaign.description}</p>}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>
                          <strong>Début:</strong> {format(new Date(campaign.start_date), 'd MMM yyyy', { locale: fr })}
                        </span>
                        <span>
                          <strong>Fin:</strong> {format(new Date(campaign.end_date), 'd MMM yyyy', { locale: fr })}
                        </span>
                        {campaign.max_impressions && (
                          <span>
                            <strong>Max impressions:</strong> {campaign.max_impressions.toLocaleString()}
                          </span>
                        )}
                        {campaign.max_clicks && (
                          <span>
                            <strong>Max clics:</strong> {campaign.max_clicks.toLocaleString()}
                          </span>
                        )}
                        <span>
                          <strong>Priorité:</strong> {campaign.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => loadCampaignStats(campaign.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Stats
                      </button>
                      <button
                        onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          campaign.status === 'active'
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {campaign.status === 'active' ? 'Pauser' : 'Activer'}
                      </button>
                      <button
                        onClick={() => deleteCampaign(campaign.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal création campagne */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Créer une campagne publicitaire</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                <input
                  type="text"
                  value={campaignForm.title}
                  onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: Promotion spéciale"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Description de la campagne"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom annonceur *</label>
                  <input
                    type="text"
                    value={campaignForm.advertiser_name}
                    onChange={(e) => setCampaignForm({ ...campaignForm, advertiser_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email annonceur *</label>
                  <input
                    type="email"
                    value={campaignForm.advertiser_email}
                    onChange={(e) => setCampaignForm({ ...campaignForm, advertiser_email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL de la publicité *</label>
                <input
                  type="url"
                  value={campaignForm.ad_url}
                  onChange={(e) => setCampaignForm({ ...campaignForm, ad_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://exemple.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL de l'image (optionnel)</label>
                <input
                  type="url"
                  value={campaignForm.image_url}
                  onChange={(e) => setCampaignForm({ ...campaignForm, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://exemple.com/image.jpg"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emplacement *</label>
                  <select
                    value={campaignForm.placement}
                    onChange={(e) => setCampaignForm({ ...campaignForm, placement: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="header">Header</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="footer">Footer</option>
                    <option value="between_posts">Entre les annonces</option>
                    <option value="popup">Popup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de début *</label>
                  <input
                    type="date"
                    value={campaignForm.start_date}
                    onChange={(e) => setCampaignForm({ ...campaignForm, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin *</label>
                  <input
                    type="date"
                    value={campaignForm.end_date}
                    onChange={(e) => setCampaignForm({ ...campaignForm, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max impressions</label>
                  <input
                    type="number"
                    value={campaignForm.max_impressions}
                    onChange={(e) => setCampaignForm({ ...campaignForm, max_impressions: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Illimité"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max clics</label>
                  <input
                    type="number"
                    value={campaignForm.max_clicks}
                    onChange={(e) => setCampaignForm({ ...campaignForm, max_clicks: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Illimité"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                  <input
                    type="number"
                    value={campaignForm.priority}
                    onChange={(e) => setCampaignForm({ ...campaignForm, priority: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={createCampaign}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Créer la campagne
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal statistiques */}
      {showStatsModal && campaignStats && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Statistiques - {campaignStats.campaign.title}</h2>
              <button onClick={() => setShowStatsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Impressions</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{campaignStats.totalImpressions.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MousePointerClick className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">Total Clics</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{campaignStats.totalClicks.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-600">Taux de clic (CTR)</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{campaignStats.ctr}%</p>
                </div>
              </div>
              <div className="mb-4">
                <button
                  onClick={() => exportStats(campaignStats.campaign.id)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exporter en CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
                      <th className="border border-gray-200 px-4 py-2 text-right">Impressions</th>
                      <th className="border border-gray-200 px-4 py-2 text-right">Clics</th>
                      <th className="border border-gray-200 px-4 py-2 text-right">CTR (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignStats.stats.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                          Aucune statistique disponible
                        </td>
                      </tr>
                    ) : (
                      campaignStats.stats.map((stat: any) => {
                        const ctr = stat.impressions > 0 ? ((stat.clicks / stat.impressions) * 100).toFixed(2) : '0.00'
                        return (
                          <tr key={stat.id}>
                            <td className="border border-gray-200 px-4 py-2">
                              {format(new Date(stat.date), 'd MMM yyyy', { locale: fr })}
                            </td>
                            <td className="border border-gray-200 px-4 py-2 text-right">{stat.impressions || 0}</td>
                            <td className="border border-gray-200 px-4 py-2 text-right">{stat.clicks || 0}</td>
                            <td className="border border-gray-200 px-4 py-2 text-right">{ctr}%</td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

