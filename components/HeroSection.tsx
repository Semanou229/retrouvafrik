'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, ArrowRight, Sparkles, Heart, Users, CheckCircle, TrendingUp, Play } from 'lucide-react'

interface HeroSectionProps {
  stats: {
    announcements: number
    resolved: number
    members: number
    shares: number
  }
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-white min-h-[90vh] flex items-center">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(255,107,53,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255,107,53,0.1) 0%, transparent 50%),
              linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 60px 60px, 60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-32 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left order-1">
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6 transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Plateforme communautaire de solidarité</span>
            </div>

            {/* Main Title */}
            <h1 
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900 transform transition-all duration-700 delay-100 ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'
              }`}
            >
              Reconnectons ceux qui{' '}
              <span className="text-primary">se cherchent</span>
            </h1>

            {/* Subtitle */}
            <p 
              className={`text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0 transform transition-all duration-700 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'
              }`}
            >
              RetrouvAfrik aide les familles à retrouver leurs proches disparus, animaux perdus et objets égarés en Afrique. Ensemble, créons des retrouvailles.
            </p>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 justify-center lg:justify-start transform transition-all duration-700 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'
              }`}
            >
              <Link
                href="/publier"
                className="group inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
              >
                <span>Publier une annonce</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/comment-ca-marche"
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Comment ça marche</span>
                <span className="sm:hidden">Comment ça marche</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div 
              className={`flex flex-wrap items-center gap-4 sm:gap-6 justify-center lg:justify-start text-xs sm:text-sm text-gray-600 transform transition-all duration-700 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span>100% Gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="hidden sm:inline">Sans inscription requise</span>
                <span className="sm:hidden">Sans inscription</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span>Communauté active</span>
              </div>
            </div>
          </div>

          {/* Right Column - Stats Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 order-2 lg:order-2">
            {[
              { value: stats.announcements, label: 'Annonces', icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
              { value: stats.resolved, label: 'Retrouvailles', icon: CheckCircle, color: 'bg-green-50 text-green-600' },
              { value: stats.members, label: 'Membres', icon: Users, color: 'bg-purple-50 text-purple-600' },
              { value: stats.shares, label: 'Partages', icon: Heart, color: 'bg-pink-50 text-pink-600' },
            ].map((stat, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all transform hover:-translate-y-1 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transitionDelay: `${500 + index * 100}ms`,
                }}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value.toLocaleString()}+
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div 
          className={`mt-8 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-gray-200 transform transition-all duration-700 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
              <span className="font-medium">{stats.members.toLocaleString()}+ membres actifs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0" />
              <span className="font-medium">{stats.resolved.toLocaleString()} retrouvailles réussies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0" />
              <span className="font-medium">14 pays africains</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
