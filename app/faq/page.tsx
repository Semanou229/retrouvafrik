'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { HelpCircle, ChevronDown, Search } from 'lucide-react'
import Link from 'next/link'

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const faqs = [
    {
      category: 'Général',
      questions: [
        {
          question: 'Qu\'est-ce que RetrouvAfrik ?',
          answer: 'RetrouvAfrik est une plateforme communautaire gratuite qui aide à retrouver les personnes disparues, les animaux perdus et les objets égarés en Afrique. Nous mettons en relation les personnes qui cherchent avec celles qui peuvent aider.',
        },
        {
          question: 'RetrouvAfrik est-il vraiment gratuit ?',
          answer: 'Oui, RetrouvAfrik est 100% gratuit pour tous les utilisateurs. Vous pouvez publier des annonces, rechercher et utiliser toutes les fonctionnalités sans aucun frais.',
        },
        {
          question: 'Dois-je créer un compte pour utiliser RetrouvAfrik ?',
          answer: 'Non, vous pouvez consulter les annonces sans compte. Cependant, créer un compte vous permet de publier des annonces, recevoir des notifications, gérer vos annonces et communiquer avec la communauté.',
        },
        {
          question: 'Dans quels pays RetrouvAfrik est-il disponible ?',
          answer: 'RetrouvAfrik est actuellement disponible dans 14 pays africains : Bénin, Burkina Faso, Côte d\'Ivoire, Guinée, Mali, Niger, Sénégal, Togo, Cameroun, Centrafrique (RCA), Tchad, Congo-Brazzaville, République Démocratique du Congo (RDC), et Gabon.',
        },
      ],
    },
    {
      category: 'Annonces',
      questions: [
        {
          question: 'Combien de photos puis-je ajouter à mon annonce ?',
          answer: 'Vous pouvez ajouter jusqu\'à 10 photos par annonce. Les photos sont essentielles pour faciliter l\'identification, nous recommandons d\'en ajouter plusieurs sous différents angles.',
        },
        {
          question: 'Puis-je ajouter des vidéos à mon annonce ?',
          answer: 'Oui, vous pouvez ajouter des vidéos hébergées sur YouTube ou Vimeo. Cela peut aider à mieux identifier la personne, l\'animal ou l\'objet recherché.',
        },
        {
          question: 'Comment marquer mon annonce comme "Retrouvé" ?',
          answer: 'Connectez-vous à votre compte, allez dans "Mon compte" > "Mes annonces", puis cliquez sur "Marquer comme retrouvé" pour l\'annonce concernée.',
        },
        {
          question: 'Puis-je modifier ou supprimer mon annonce ?',
          answer: 'Oui, vous pouvez modifier ou supprimer vos annonces depuis votre tableau de bord dans la section "Mes annonces".',
        },
        {
          question: 'Que signifie "Perdu de vue" ?',
          answer: '"Perdu de vue" est une fonctionnalité spéciale pour retrouver des personnes avec qui vous avez perdu contact (amis d\'enfance, famille éloignée, etc.). Vous pouvez raconter votre histoire et la communauté peut vous aider à les retrouver.',
        },
      ],
    },
    {
      category: 'Objets trouvés',
      questions: [
        {
          question: 'J\'ai trouvé un objet, que dois-je faire ?',
          answer: 'Publiez une annonce de type "Objet trouvé". Vous pouvez définir un détail secret pour vérifier l\'identité du vrai propriétaire. Ne révélez pas tous les détails publiquement pour éviter les réclamations frauduleuses.',
        },
        {
          question: 'Comment fonctionne le détail secret pour les objets trouvés ?',
          answer: 'Le détail secret est une information que seul le vrai propriétaire connaît (ex: une inscription particulière, une marque spécifique). Vous pouvez vérifier cette information avant de rendre l\'objet.',
        },
        {
          question: 'Je pense avoir trouvé mon objet perdu, comment procéder ?',
          answer: 'Cliquez sur "Je pense que c\'est mon objet" sur l\'annonce correspondante. Envoyez un message privé décrivant l\'objet et le détail secret. Le propriétaire de l\'annonce pourra vérifier et vous contacter.',
        },
      ],
    },
    {
      category: 'Messages et communication',
      questions: [
        {
          question: 'Comment contacter quelqu\'un qui a des informations ?',
          answer: 'Cliquez sur "J\'ai une information" sur l\'annonce concernée. Vous pourrez envoyer un message privé avec vos informations, photos ou localisation.',
        },
        {
          question: 'Mes coordonnées sont-elles publiques ?',
          answer: 'Vous pouvez choisir si vos coordonnées (email, téléphone) sont visibles par tous ou uniquement par les membres connectés. Pour votre sécurité, nous recommandons de limiter la visibilité aux membres.',
        },
        {
          question: 'Comment recevoir des notifications ?',
          answer: 'Les notifications sont automatiquement activées lorsque vous créez un compte. Vous recevrez des alertes par email pour les nouveaux messages, commentaires et informations sur vos annonces.',
        },
      ],
    },
    {
      category: 'Sécurité et confidentialité',
      questions: [
        {
          question: 'Mes données sont-elles sécurisées ?',
          answer: 'Oui, nous utilisons des technologies de sécurité avancées pour protéger vos données. Vos informations personnelles ne sont jamais partagées avec des tiers sans votre consentement.',
        },
        {
          question: 'Que faire en cas de contenu suspect ou frauduleux ?',
          answer: 'Signalez immédiatement le contenu suspect en utilisant le bouton "Signaler" sur l\'annonce ou le commentaire. Notre équipe modère rapidement tous les signalements.',
        },
        {
          question: 'Comment signaler une annonce frauduleuse ?',
          answer: 'Cliquez sur le bouton "Signaler" sur l\'annonce concernée, sélectionnez la raison (fraude, contenu inapproprié, etc.) et notre équipe examinera rapidement votre signalement.',
        },
      ],
    },
    {
      category: 'Support',
      questions: [
        {
          question: 'Comment contacter le support RetrouvAfrik ?',
          answer: 'Vous pouvez créer un ticket de support depuis votre compte dans la section "Support". Notre équipe répond généralement sous 24 heures. Vous pouvez également nous contacter via la page Contact.',
        },
        {
          question: 'Quels types de problèmes puis-je signaler au support ?',
          answer: 'Vous pouvez signaler les problèmes techniques, demander la vérification d\'une annonce, demander des modifications, signaler des fraudes ou poser toute question sur l\'utilisation de la plateforme.',
        },
        {
          question: 'Combien de temps faut-il pour obtenir une réponse ?',
          answer: 'Notre équipe s\'engage à répondre à tous les tickets de support dans un délai de 24 heures, du lundi au vendredi.',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-primary-darkest text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Questions fréquentes
            </h1>
            <p className="text-xl text-orange-100">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher dans les FAQ..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                id="faq-search"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqs
              .map((category) => ({
                ...category,
                questions: category.questions.filter(
                  (faq) =>
                    !searchQuery ||
                    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
                ),
              }))
              .filter((category) => category.questions.length > 0)
              .map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-primary/10 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">{category.category}</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {category.questions.map((faq, faqIndex) => (
                      <details
                        key={faqIndex}
                        className="group"
                      >
                        <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between">
                          <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 transform group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="px-6 py-4 bg-gray-50">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            
            {faqs
              .map((category) => ({
                ...category,
                questions: category.questions.filter(
                  (faq) =>
                    !searchQuery ||
                    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
                ),
              }))
              .filter((category) => category.questions.length > 0).length === 0 && searchQuery && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-2 font-semibold">
                  Aucun résultat trouvé
                </p>
                <p className="text-gray-500">
                  Essayez avec d'autres mots-clés ou{' '}
                  <Link href="/contact" className="text-primary hover:text-primary-dark font-semibold">
                    contactez-nous
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Still have questions */}
          <div className="mt-12 bg-gradient-to-r from-primary to-primary-dark rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Vous avez encore des questions ?</h3>
            <p className="text-orange-100 mb-6">
              Notre équipe est là pour vous aider. Contactez-nous ou créez un ticket de support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Nous contacter
              </Link>
              <Link
                href="/support"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Créer un ticket
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

