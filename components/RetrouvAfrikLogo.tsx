'use client'

import React from 'react'
import Image from 'next/image'

interface RetrouvAfrikLogoProps {
  className?: string
  width?: number
  height?: number
  showText?: boolean
  variant?: 'icon-only' | 'full'
}

export default function RetrouvAfrikLogo({ 
  className = '', 
  width = 40, 
  height = 40, 
  showText = false,
  variant = 'icon-only'
}: RetrouvAfrikLogoProps) {
  // Variant 'icon-only' : seulement la silhouette de l'Afrique (pour header)
  if (variant === 'icon-only') {
    return (
      <div className={`flex items-center ${className}`}>
        {/* Seulement la silhouette de l'Afrique */}
        <svg
          width={width}
          height={height}
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          {/* Silhouette de l'Afrique en orange */}
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
      </div>
    )
  }

  // Variant 'full' : Logo complet avec loupe et texte (pour footer)
  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo complet : Loupe blanche avec Afrique orange + Texte RetrouvAfrik */}
      <svg
        width={width * 4}
        height={height}
        viewBox="0 0 240 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Loupe blanche - cercle principal */}
        <circle cx="25" cy="25" r="20" stroke="white" strokeWidth="3.5" fill="none"/>
        
        {/* Manche de la loupe */}
        <line x1="38" y1="38" x2="48" y2="48" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        
        {/* Silhouette de l'Afrique en orange dans la loupe */}
        <g transform="translate(7, 5) scale(0.35)">
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
        </g>
        
        {/* Texte "Retrouv" en orange */}
        <text x="60" y="33" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="bold" fill="#ff6b35" letterSpacing="0.5">
          Retrouv
        </text>
        
        {/* Texte "Afrik" en blanc */}
        <text x="135" y="33" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="bold" fill="white" letterSpacing="0.5">
          Afrik
        </text>
      </svg>
    </div>
  )
}

