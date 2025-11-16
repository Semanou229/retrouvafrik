import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Trouvita - Reconnectons ceux qui se cherchent',
  description: 'Plateforme communautaire pour retrouver les personnes disparues, animaux perdus et objets égarés en Afrique',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

