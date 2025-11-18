import Link from 'next/link'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import AdBanner from '@/components/AdBanner'
import { Search, Users, Heart, ArrowRight, CheckCircle, Shield, TrendingUp, Globe, Sparkles } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import AnnouncementCard from '@/components/AnnouncementCard'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function HomePage() {
  const supabase = createServerSupabaseClient()
  
  // Fetch recent announcements - Ne pas afficher les annonces masquées ou non approuvées
  const { data: recentAnnouncements } = await supabase
    .from('announcements')
    .select('*')
    .eq('status', 'active')
    .eq('hidden', false)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(6)

  // Fetch urgent announcements - Ne pas afficher les annonces masquées ou non approuvées
  const { data: urgentAnnouncements } = await supabase
    .from('announcements')
    .select('*')
    .eq('status', 'active')
    .eq('urgency', 'urgent')
    .eq('hidden', false)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(3)

  // Fetch real statistics from database
  // Total active announcements (approved and not hidden)
  const { count: totalAnnouncements } = await supabase
    .from('announcements')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .eq('hidden', false)
    .eq('approved', true)

  // Resolved announcements
  const { count: resolvedCount } = await supabase
    .from('announcements')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'resolved')

  // Unique active members (users who have created announcements)
  const { data: uniqueUsers } = await supabase
    .from('announcements')
    .select('user_id')
    .eq('hidden', false)
    .eq('approved', true)
  
  const uniqueMembers = new Set(uniqueUsers?.map(a => a.user_id) || []).size

  // Total views (shares/engagement) - sum of all views_count
  const { data: allAnnouncementsForViews } = await supabase
    .from('announcements')
    .select('views_count')
    .eq('hidden', false)
    .eq('approved', true)
  
  const totalViews = allAnnouncementsForViews?.reduce((sum, a) => sum + (a.views_count || 0), 0) || 0

  // Real stats from database
  const stats = {
    announcements: totalAnnouncements || 0,
    resolved: 10, // Fixed value: 10 retrouvailles
    members: 30, // Fixed value: 30 membres
    shares: totalViews, // Using views as proxy for shares/engagement
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section - Modern & Animated */}
      <HeroSection stats={stats} />

      {/* How it works - Premium Design */}
      <section className="pt-0 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-b from-white to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 text-primary mb-3 sm:mb-4">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Comment ça marche</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Trois étapes simples pour retrouver ce qui compte
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Un processus simple et efficace pour maximiser vos chances de retrouvailles
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                number: '01',
                title: 'Publiez votre annonce',
                description: 'Racontez votre histoire, ajoutez des photos et précisez les détails importants. Votre annonce sera visible par toute la communauté RetrouvAfrik.',
                icon: Shield,
              },
              {
                number: '02',
                title: 'La communauté se mobilise',
                description: 'Les membres de RetrouvAfrik partagent, commentent et signalent des informations. Chaque partage augmente les chances de retrouvailles.',
                icon: Users,
              },
              {
                number: '03',
                title: 'Restez connecté',
                description: 'Recevez des notifications pour chaque nouvelle information. Vous pouvez aussi suivre les annonces qui vous touchent.',
                icon: CheckCircle,
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="absolute -top-4 sm:-top-6 left-6 sm:left-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary/10 mb-3 sm:mb-4">{step.number}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Announcements */}
      {urgentAnnouncements && urgentAnnouncements.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-primary mb-2 sm:mb-3">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Urgent</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Annonces urgentes</h2>
              </div>
              <Link
                href="/annonces?sort=urgent"
                className="hidden md:flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
              >
                <span>Voir toutes</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {urgentAnnouncements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Announcements */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-primary mb-2 sm:mb-3">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Découvrir</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Annonces récentes</h2>
            </div>
            <Link
              href="/annonces"
              className="flex sm:hidden md:flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors text-sm sm:text-base"
            >
              <span>Voir toutes les annonces</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
          {recentAnnouncements && recentAnnouncements.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recentAnnouncements.map((announcement, index) => (
                <div key={announcement.id}>
                  <AnnouncementCard announcement={announcement} />
                  {/* Publicité entre les annonces (toutes les 3 annonces) */}
                  {index === 2 && (
                    <div className="mt-6">
                      <AdBanner placement="between_posts" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 bg-gradient-to-br from-orange-50 to-white rounded-xl sm:rounded-2xl border-2 border-dashed border-primary/20 px-4">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-primary/30 mx-auto mb-4" />
              <p className="text-lg sm:text-xl text-gray-600 mb-2 font-semibold">
                Aucune annonce pour le moment
              </p>
              <p className="text-sm sm:text-base text-gray-500 mb-6">Soyez le premier à publier !</p>
              <Link
                href="/publier"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg"
              >
                <span>Publier une annonce</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary via-primary-dark to-primary-darkest text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Rejoignez la communauté RetrouvAfrik
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-orange-50 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Ensemble, créons plus de retrouvailles. Chaque partage compte, chaque information peut faire la différence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/inscription"
              className="bg-white text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-orange-50 transition-all transform hover:scale-105 shadow-xl inline-flex items-center justify-center"
            >
              Créer un compte gratuit
            </Link>
            <Link
              href="/perdu-de-vue"
              className="bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-white/10 transition-all backdrop-blur-sm inline-flex items-center justify-center"
            >
              Découvrir "Perdu de vue"
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
