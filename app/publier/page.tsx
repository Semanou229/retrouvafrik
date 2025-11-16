import Navigation from '@/components/Navigation'
import PublicationForm from '@/components/PublicationForm'

export default function PublierPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Publier une annonce</h1>
          <p className="text-gray-600">
            Partagez votre histoire et mobilisez la communauté pour vous aider
          </p>
        </div>

        <PublicationForm />
      </div>
    </div>
  )
}

