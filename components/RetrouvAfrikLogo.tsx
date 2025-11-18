'use client'

import React from 'react'

interface RetrouvAfrikLogoProps {
  className?: string
  showText?: boolean
}

export default function RetrouvAfrikLogo({ className = '', showText = true }: RetrouvAfrikLogoProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Silhouette de l'Afrique en orange */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Silhouette de l'Afrique - forme simplifiée mais reconnaissable */}
        <path
          d="M25 20 L30 18 L35 20 L40 25 L42 30 L45 38 L48 45 L50 52 L52 60 L55 68 L58 75 L60 82 L62 88 L65 92 L68 95 L72 92 L75 88 L78 82 L80 75 L82 68 L85 60 L88 52 L90 45 L92 38 L90 30 L88 25 L85 20 L80 18 L75 15 L70 12 L65 10 L60 8 L55 7 L50 6 L45 7 L40 8 L35 10 L30 12 L25 15 Z"
          fill="#ff6b35"
        />
        {/* Détail golfe de Guinée */}
        <path
          d="M35 30 L38 35 L40 40 L38 45 L35 42 L32 38 L35 32 Z"
          fill="#f7931e"
        />
        {/* Détail corne de l'Afrique */}
        <path
          d="M75 50 L78 55 L80 60 L78 65 L75 62 L72 58 L75 52 Z"
          fill="#f7931e"
        />
        {/* Détail Madagascar */}
        <path
          d="M85 70 L88 75 L90 80 L88 85 L85 82 L82 78 L85 72 Z"
          fill="#f7931e"
        />
      </svg>
      
      {/* Texte "Retrouv" en orange */}
      {showText && (
        <span className="text-xl font-bold text-primary">Retrouv</span>
      )}
    </div>
  )
}

