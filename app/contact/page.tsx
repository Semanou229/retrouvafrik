import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import { Mail, Phone, MapPin, MessageCircle, HelpCircle, Send } from 'lucide-react'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
// export const runtime = 'edge' // Désactivé: async_hooks non disponible dans Edge Runtime

export default async function ContactPage() {
  const supabase = createServerSupabaseClient()
  
  // Récupérer les coordonnées de contact depuis la base de données
  const { data: contactSettings } = await supabase
    .from('contact_settings')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const contactEmail = contactSettings?.email || 'contact@retrouvafrik.com'
  const contactPhone = contactSettings?.phone || '+229 XX XX XX XX'
  const contactAddress = contactSettings?.address || 'Cotonou, Bénin'
  const contactHours = contactSettings?.hours || 'Lundi - Vendredi, 9h - 18h'

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-primary-darkest text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl text-orange-100">
              Nous sommes là pour vous aider. N'hésitez pas à nous contacter.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Informations de contact
                </h2>
                <p className="text-gray-600 mb-8">
                  Vous pouvez nous contacter par email, téléphone ou nous rendre visite. Notre équipe est disponible pour répondre à toutes vos questions.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <a href={`mailto:${contactEmail}`} className="text-primary hover:text-primary-dark transition-colors">
                        {contactEmail}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">Réponse sous 24h</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                      <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="text-primary hover:text-primary-dark transition-colors">
                        {contactPhone}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">{contactHours}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
                      <p className="text-gray-700">{contactAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Section */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20 mt-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Besoin d'aide technique ?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Pour les problèmes techniques, demandes de vérification d'annonces, ou signalements de fraudes, utilisez notre système de tickets de support.
                    </p>
                    <Link
                      href="/support"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
                    >
                      <span>Créer un ticket de support</span>
                      <Send className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Envoyez-nous un message
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

