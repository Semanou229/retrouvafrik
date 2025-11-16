import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import AnnouncementCard from '@/components/AnnouncementCard'

export const dynamic = 'force-dynamic'
// export const runtime = 'edge' // Désactivé: async_hooks non disponible dans Edge Runtime

export default async function PerduDeVuePage() {
  const supabase = createServerSupabaseClient()
  
  // Fetch "perdu de vue" announcements only - Ne pas afficher les annonces masquées ou non approuvées
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('type', 'person')
    .eq('is_lost_sight', true) // Uniquement les annonces "perdu de vue"
    .eq('status', 'active')
    .eq('hidden', false)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(12)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-primary-darkest text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Perdu de vue</h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-50">
              Peut-être reconnaîtrez-vous l'une des personnes évoquées dans ces histoires.
              À votre tour, publiez votre propre annonce "Perdu de vue" et lancez votre bouteille à la mer.
            </p>
            <Link
              href="/perdu-de-vue/publier"
              className="inline-block bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-xl transform hover:scale-105"
            >
              Publier mon histoire
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Dans la vie, il arrive que des liens se distendent, que des visages s'effacent de notre mémoire, 
              que des personnes chères disparaissent de notre horizon. Parfois, c'est le temps qui passe. 
              Parfois, ce sont les circonstances de la vie.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Cette section est dédiée à toutes ces histoires de personnes "perdues de vue" - des amis d'enfance, 
              des membres de famille éloignée, des voisins, des connaissances qui ont compté et dont on aimerait 
              retrouver la trace.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Chaque histoire est une bouteille à la mer. Chaque partage est une vague qui peut la porter plus loin. 
              Et peut-être, un jour, quelqu'un reconnaîtra un visage, un nom, une histoire qui résonne avec la sienne.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4 font-semibold">
              Rejoignez cette communauté de recherche et d'espoir. Partagez votre histoire. 
              Aidez les autres à retrouver ce qu'ils cherchent.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Témoignages de la communauté</h2>
            <Link
              href="/annonces?category=person&view=recognize"
              className="text-primary hover:underline flex items-center gap-1"
            >
              <span>Voir toutes les histoires</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {announcements && announcements.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">
                Aucune histoire pour le moment.
              </p>
              <Link
                href="/perdu-de-vue/publier"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Publier la première histoire
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Partagez votre histoire</h2>
          <p className="text-gray-600 mb-8">
            Chaque histoire compte. Chaque partage peut faire la différence. 
            Publiez votre annonce "Perdu de vue" et laissez la communauté vous aider.
          </p>
          <Link
            href="/perdu-de-vue/publier"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Publier mon histoire
          </Link>
        </div>
      </section>
    </div>
  )
}

