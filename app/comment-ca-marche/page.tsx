import Navigation from '@/components/Navigation'
import { CheckCircle, Search, Plus, MessageCircle, Shield, Heart, Users, Bell, Eye } from 'lucide-react'
import Link from 'next/link'

export default function CommentCaMarchePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-primary-darkest text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Comment ça marche ?
            </h1>
            <p className="text-xl text-orange-100">
              RetrouvAfrik est simple, rapide et efficace. Découvrez comment utiliser la plateforme pour retrouver vos proches, animaux ou objets perdus.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold">1</span>
              </div>
              <div className="flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">Publiez votre annonce</h3>
              <p className="text-gray-600 leading-relaxed text-center mb-6">
                Créez une annonce détaillée avec des photos, la description, la date et le lieu de disparition. Plus les informations sont précises, plus les chances de retrouver augmentent.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Ajoutez jusqu'à 10 photos claires</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Décrivez en détail les caractéristiques</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Indiquez la date et le lieu précis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Ajoutez des vidéos si disponibles</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <Link
                  href="/publier"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Publier maintenant
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold">2</span>
              </div>
              <div className="flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">La communauté s'active</h3>
              <p className="text-gray-600 leading-relaxed text-center mb-6">
                Votre annonce est visible par des milliers de membres actifs. Chacun peut partager, commenter ou apporter des informations utiles.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Partagez sur les réseaux sociaux</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Les membres peuvent commenter</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Recevez des notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Messages privés pour informations</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <Link
                  href="/annonces"
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Search className="w-5 h-5" />
                  Voir les annonces
                </Link>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold">3</span>
              </div>
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">Retrouvez !</h3>
              <p className="text-gray-600 leading-relaxed text-center mb-6">
                Grâce aux informations partagées par la communauté et à la mobilisation, les retrouvailles deviennent possibles. Marquez votre annonce comme "Retrouvé" une fois résolue.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Recevez des informations utiles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Contactez les personnes qui ont vu</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Marquez comme "Retrouvé"</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Partagez votre histoire de réussite</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RetrouvAfrik offre des outils puissants pour faciliter les retrouvailles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Recherche avancée */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Recherche avancée</h3>
              <p className="text-gray-600 text-sm">
                Filtrez par catégorie, localisation, date et bien plus. Trouvez rapidement ce que vous cherchez.
              </p>
            </div>

            {/* Galerie photos */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Galerie photos</h3>
              <p className="text-gray-600 text-sm">
                Visualisez toutes les photos en grand format avec une galerie interactive pour faciliter l'identification.
              </p>
            </div>

            {/* Vidéos */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Vidéos intégrées</h3>
              <p className="text-gray-600 text-sm">
                Ajoutez des vidéos YouTube ou Vimeo pour mieux identifier la personne, l'animal ou l'objet.
              </p>
            </div>

            {/* Messages privés */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Messages privés</h3>
              <p className="text-gray-600 text-sm">
                Communiquez en privé avec les personnes qui ont des informations, partagez des photos et localisations.
              </p>
            </div>

            {/* Reconnaissance */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reconnaissance</h3>
              <p className="text-gray-600 text-sm">
                Pour les personnes "perdues de vue", utilisez le bouton "Je reconnais cette personne" pour aider.
              </p>
            </div>

            {/* Notifications */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Notifications</h3>
              <p className="text-gray-600 text-sm">
                Recevez des notifications en temps réel quand quelqu'un commente ou envoie une information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Types d'annonces */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Types d'annonces disponibles
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Personnes */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="text-5xl mb-4">👤</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personnes disparues</h3>
              <p className="text-gray-600 mb-6">
                Recherchez une personne disparue ou retrouvez quelqu'un que vous avez perdu de vue. Partagez l'histoire et les circonstances pour faciliter la reconnaissance.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Personnes disparues récemment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Perdu de vue (amis, famille)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Bouton "Je reconnais cette personne"</span>
                </li>
              </ul>
              <Link
                href="/perdu-de-vue"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold"
              >
                En savoir plus
                <span>→</span>
              </Link>
            </div>

            {/* Animaux */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="text-5xl mb-4">🐶</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Animaux perdus</h3>
              <p className="text-gray-600 mb-6">
                Votre animal de compagnie s'est échappé ? Publiez une annonce avec ses photos et caractéristiques. La communauté vous aidera à le retrouver.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Chiens, chats, oiseaux...</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Description détaillée</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Photos et vidéos</span>
                </li>
              </ul>
              <Link
                href="/publier"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold"
              >
                Publier une annonce
                <span>→</span>
              </Link>
            </div>

            {/* Objets */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Objets perdus / trouvés</h3>
              <p className="text-gray-600 mb-6">
                Vous avez perdu un objet important ? Ou vous en avez trouvé un ? RetrouvAfrik gère les deux cas avec des fonctionnalités adaptées.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Objets perdus</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Objets trouvés (recherche du propriétaire)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Détail secret pour vérification</span>
                </li>
              </ul>
              <Link
                href="/publier"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold"
              >
                Publier une annonce
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                RetrouvAfrik est-il gratuit ?
              </h3>
              <p className="text-gray-600">
                Oui, RetrouvAfrik est 100% gratuit pour tous les utilisateurs. Vous pouvez publier des annonces, rechercher et utiliser toutes les fonctionnalités sans frais.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Dois-je créer un compte pour publier ?
              </h3>
              <p className="text-gray-600">
                Il est recommandé de créer un compte pour gérer vos annonces, recevoir des notifications et communiquer avec la communauté. Cependant, vous pouvez consulter les annonces sans compte.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Combien de photos puis-je ajouter ?
              </h3>
              <p className="text-gray-600">
                Vous pouvez ajouter jusqu'à 10 photos par annonce. Les photos sont essentielles pour faciliter l'identification, alors n'hésitez pas à en ajouter plusieurs sous différents angles.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Comment fonctionne "Perdu de vue" ?
              </h3>
              <p className="text-gray-600">
                "Perdu de vue" est spécialement conçu pour retrouver des personnes avec qui vous avez perdu contact (amis d'enfance, famille éloignée, etc.). Vous pouvez raconter l'histoire et la communauté peut vous aider à les retrouver.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Que faire si je trouve quelque chose ?
              </h3>
              <p className="text-gray-600">
                Si vous avez trouvé un objet, utilisez la fonctionnalité "Objet trouvé" pour publier une annonce et rechercher le propriétaire. Vous pouvez définir un détail secret pour vérifier l'identité du vrai propriétaire.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Mes informations de contact sont-elles publiques ?
              </h3>
              <p className="text-gray-600">
                Vous pouvez choisir si vos coordonnées sont visibles par tous ou uniquement par les membres connectés. Pour votre sécurité, nous recommandons de limiter la visibilité aux membres.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Rejoignez la communauté RetrouvAfrik et aidez à reconnecter ceux qui se cherchent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/publier"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all shadow-xl transform hover:scale-105"
            >
              <Plus className="w-6 h-6" />
              Publier une annonce
            </Link>
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all shadow-xl transform hover:scale-105"
            >
              <Users className="w-6 h-6" />
              Créer un compte
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

