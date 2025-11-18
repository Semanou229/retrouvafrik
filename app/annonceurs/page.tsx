import Navigation from '@/components/Navigation'
import AdvertiserForm from '@/components/AdvertiserForm'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default function AnnonceursPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Espace Annonceurs
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Faites connaître votre entreprise ou votre service sur RetrouvAfrik et touchez une communauté engagée de milliers d'utilisateurs à travers l'Afrique.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Pourquoi RetrouvAfrik ?</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Communauté engagée et solidaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Visibilité ciblée géographiquement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Statistiques détaillées de vos campagnes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Tarifs compétitifs et flexibles</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Nos Emplacements</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Bannière header</strong> - En haut de page</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Barre latérale</strong> - Publicités discrètes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Entre les annonces</strong> - Visibilité optimale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Footer</strong> - Présence constante</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-center mb-6">Demandez un devis</h2>
            <p className="text-center text-gray-600 mb-8">
              Remplissez le formulaire ci-dessous et notre équipe vous contactera dans les plus brefs délais.
            </p>
            <AdvertiserForm />
          </div>
        </div>
      </main>
    </div>
  )
}

