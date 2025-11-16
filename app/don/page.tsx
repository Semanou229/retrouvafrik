import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Heart, Server, Users, Shield, Zap, Globe, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function DonPage() {
  const supabase = createServerSupabaseClient()
  
  // Récupérer les paramètres de don actifs
  const { data: donationSettings } = await supabase
    .from('donation_settings')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const donationUrl = donationSettings?.donation_url || '#'
  const donationTitle = donationSettings?.title || 'Faites un don'
  const donationDescription = donationSettings?.description || 'Votre soutien nous permet de continuer à aider la communauté'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-primary-darkest text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <Heart className="w-10 h-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {donationTitle}
            </h1>
            <p className="text-xl text-orange-100 mb-8">
              {donationDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi soutenir RetrouvAfrik ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RetrouvAfrik est une plateforme gratuite et accessible à tous. Votre don nous permet de maintenir et d'améliorer nos services pour aider encore plus de personnes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Coûts des serveurs */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Server className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Coûts des serveurs</h3>
              <p className="text-gray-700 leading-relaxed">
                Chaque mois, nous devons payer pour les serveurs qui hébergent RetrouvAfrik. Ces coûts augmentent avec le nombre d'utilisateurs et d'annonces. Votre don nous aide à couvrir ces frais essentiels.
              </p>
              <div className="mt-6 p-4 bg-white rounded-lg border border-primary/20">
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-primary">Coût mensuel estimé :</span> 150-300€
                </p>
              </div>
            </div>

            {/* Stockage des photos */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Stockage des photos</h3>
              <p className="text-gray-700 leading-relaxed">
                Chaque annonce peut contenir jusqu'à 10 photos. Avec des milliers d'annonces actives, le stockage représente un coût significatif. Votre contribution nous permet de conserver toutes ces images importantes.
              </p>
              <div className="mt-6 p-4 bg-white rounded-lg border border-primary/20">
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-primary">Stockage actuel :</span> Plus de 50 000 photos
                </p>
              </div>
            </div>

            {/* Maintenance et développement */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Maintenance et sécurité</h3>
              <p className="text-gray-700 leading-relaxed">
                Nous devons maintenir la plateforme à jour, corriger les bugs, améliorer la sécurité et ajouter de nouvelles fonctionnalités. Tout cela nécessite du temps et des ressources.
              </p>
              <div className="mt-6 p-4 bg-white rounded-lg border border-primary/20">
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-primary">Mises à jour :</span> Hebdomadaires
                </p>
              </div>
            </div>

            {/* Support utilisateurs */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Support utilisateurs</h3>
              <p className="text-gray-700 leading-relaxed">
                Notre équipe répond aux questions, vérifie les annonces, modère le contenu et aide les utilisateurs en difficulté. Votre don nous permet de maintenir ce niveau de service.
              </p>
              <div className="mt-6 p-4 bg-white rounded-lg border border-primary/20">
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-primary">Temps de réponse :</span> Moins de 24h
                </p>
              </div>
            </div>

            {/* Amélioration continue */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Expansion géographique</h3>
              <p className="text-gray-700 leading-relaxed">
                Nous souhaitons étendre RetrouvAfrik à d'autres pays africains et améliorer nos services. Votre soutien nous permet de planifier cette croissance et d'aider encore plus de personnes.
              </p>
              <div className="mt-6 p-4 bg-white rounded-lg border border-primary/20">
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-primary">Objectif :</span> 20+ pays africains
                </p>
              </div>
            </div>

            {/* Impact communautaire */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Impact communautaire</h3>
              <p className="text-gray-700 leading-relaxed">
                Grâce à votre soutien, nous avons déjà aidé des centaines de familles à retrouver leurs proches. Chaque don compte et contribue directement à ces retrouvailles.
              </p>
              <div className="mt-6 p-4 bg-white rounded-lg border border-primary/20">
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-primary">Cas résolus :</span> 189+ retrouvailles
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Chaque contribution fait la différence
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Même un petit don nous aide à maintenir RetrouvAfrik gratuit et accessible à tous. 
            Votre générosité permet à des familles de retrouver leurs proches.
          </p>
          <a
            href={donationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all shadow-xl transform hover:scale-105"
          >
            <Heart className="w-6 h-6" />
            Faire un don maintenant
            <ArrowRight className="w-6 h-6" />
          </a>
          <p className="text-orange-100 text-sm mt-4">
            Vous serez redirigé vers notre plateforme de paiement sécurisée
          </p>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              💡 Transparence totale
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous croyons en la transparence. Tous les dons sont utilisés exclusivement pour :
            </p>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Les coûts d'infrastructure et de serveurs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Le stockage et la gestion des photos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Le développement et l'amélioration de la plateforme</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Le support et la modération</span>
              </li>
            </ul>
            <p className="text-sm text-gray-600">
              RetrouvAfrik reste et restera toujours <strong>100% gratuit</strong> pour tous les utilisateurs. 
              Aucun don n'est obligatoire, mais chaque contribution nous aide énormément.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

