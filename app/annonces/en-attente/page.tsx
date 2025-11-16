import Navigation from '@/components/Navigation'
import { CheckCircle, Clock, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function EnAttentePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          {/* Icône de succès */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>

          {/* Titre */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Votre annonce a été soumise avec succès !
          </h1>

          {/* Message principal */}
          <div className="space-y-4 mb-8">
            <p className="text-gray-600 text-lg">
              Merci d'avoir partagé votre histoire sur RetrouvAfrik.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">En attente d'approbation</h3>
                  <p className="text-blue-800 text-sm mb-3">
                    Votre annonce est actuellement en cours de vérification par notre équipe de modération. 
                    Cette étape est importante pour garantir la qualité et la sécurité de notre plateforme.
                  </p>
                  <p className="text-blue-800 text-sm">
                    <strong>Vous recevrez un email</strong> dès que votre annonce sera approuvée et publiée sur le site.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-left">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-2">Délai de traitement</h3>
                  <p className="text-orange-800 text-sm">
                    Le délai de traitement est généralement de <strong>24 à 48 heures</strong>. 
                    En cas d'urgence, n'hésitez pas à nous contacter via le système de support.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/mon-compte"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Voir mes annonces
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/annonces"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Voir les autres annonces
            </Link>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              En attendant l'approbation, vous pouvez modifier ou supprimer votre annonce depuis votre tableau de bord.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

