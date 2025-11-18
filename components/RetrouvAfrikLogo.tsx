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
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Silhouette simplifiée de l'Afrique */}
        <path
          d="M20 15 L25 12 L30 15 L35 20 L38 25 L40 30 L42 35 L45 40 L48 45 L50 50 L52 55 L55 60 L58 65 L60 70 L62 75 L65 80 L68 82 L70 80 L72 75 L75 70 L78 65 L80 60 L82 55 L85 50 L88 45 L90 40 L88 35 L85 30 L82 25 L80 20 L75 18 L70 15 L65 12 L60 10 L55 8 L50 7 L45 8 L40 10 L35 12 L30 15 Z"
          fill="#ff6b35"
          stroke="#ff6b35"
          strokeWidth="1"
        />
        {/* Forme plus précise de l'Afrique */}
        <path
          d="M25 15 L30 12 L35 15 L40 18 L42 22 L45 28 L48 35 L50 42 L52 50 L55 58 L58 65 L60 72 L62 78 L65 82 L68 85 L72 82 L75 78 L78 72 L80 65 L82 58 L85 50 L88 42 L90 35 L88 28 L85 22 L82 18 L78 15 L72 12 L65 10 L58 8 L50 7 L42 8 L35 10 L28 12 L25 15 Z"
          fill="#ff6b35"
        />
        {/* Détails supplémentaires pour rendre l'Afrique plus reconnaissable */}
        <path
          d="M35 25 L38 30 L40 35 L38 40 L35 38 L32 35 L35 30 Z"
          fill="#f7931e"
        />
        <path
          d="M60 45 L62 50 L65 55 L62 60 L60 58 L58 55 L60 50 Z"
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

