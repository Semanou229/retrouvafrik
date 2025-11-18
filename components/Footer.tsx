import Link from 'next/link'
import { Heart } from 'lucide-react'
import AdBanner from './AdBanner'
import RetrouvAfrikLogo from './RetrouvAfrikLogo'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      {/* Publicité footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <AdBanner placement="footer" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <RetrouvAfrikLogo variant="full" width={50} height={50} className="text-2xl" />
            </div>
            <p className="text-gray-400 leading-relaxed">
              Reconnectons ceux qui se cherchent grâce à la solidarité communautaire.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-lg">Navigation</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link href="/annonces" className="hover:text-primary transition-colors">Annonces</Link></li>
              <li><Link href="/publier" className="hover:text-primary transition-colors">Publier</Link></li>
              <li><Link href="/perdu-de-vue" className="hover:text-primary transition-colors">Perdu de vue</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-lg">Compte</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/connexion" className="hover:text-primary transition-colors">Connexion</Link></li>
              <li><Link href="/inscription" className="hover:text-primary transition-colors">Inscription</Link></li>
              <li><Link href="/mon-compte" className="hover:text-primary transition-colors">Mon compte</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-lg">Aide</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/comment-ca-marche" className="hover:text-primary transition-colors">Comment ça marche</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/annonceurs" className="hover:text-primary transition-colors">Annonceurs</Link></li>
              <li>
                <Link href="/don" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <span>Faites un don</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} RetrouvAfrik. Tous droits réservés.</p>
          <p className="mt-2">
            <Link href="/don" className="text-primary hover:text-primary-dark transition-colors font-semibold inline-flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Soutenez RetrouvAfrik
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

