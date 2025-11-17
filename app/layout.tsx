import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'RetrouvAfrik - Reconnectons ceux qui se cherchent',
  description: 'Plateforme communautaire pour retrouver les personnes disparues, animaux perdus et objets égarés en Afrique',
  keywords: 'retrouvailles, personnes disparues, animaux perdus, objets égarés, Afrique, communauté, solidarité',
  openGraph: {
    title: 'RetrouvAfrik - Reconnectons ceux qui se cherchent',
    description: 'Plateforme communautaire pour retrouver les personnes disparues, animaux perdus et objets égarés en Afrique',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RetrouvAfrik - Reconnectons ceux qui se cherchent',
    description: 'Plateforme communautaire pour retrouver les personnes disparues, animaux perdus et objets égarés en Afrique',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

