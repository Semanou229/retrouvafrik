import Navigation from '@/components/Navigation'
import SignupForm from '@/components/SignupForm'
import Link from 'next/link'

export default function InscriptionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Créer un compte RetrouvAfrik</h1>
          <p className="text-gray-600 mb-6">
            Rejoignez la communauté et aidez à créer des retrouvailles
          </p>
          
          <SignupForm />
          
          <div className="mt-6 text-center">
            <Link href="/connexion" className="text-primary hover:underline">
              Déjà un compte ? Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

