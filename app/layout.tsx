import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PrimeFlow Solutions — Look Premium. Get Trusted. Get Customers.',
  description: 'PrimeFlow Solutions — brand designer for beauty businesses. Premium websites, booking systems, and digital branding for small businesses. Book a free consultation.',
  openGraph: {
    title: 'PrimeFlow Solutions — Look Premium. Get Trusted. Get Customers.',
    description: 'Brand designer for beauty businesses. Premium websites, booking systems, and digital branding for small businesses.',
    images: ['https://placehold.co/1200x630/F5B800/1a1a18?text=PrimeFlow+Solutions'],
    type: 'website',
  },
}

const darkModeScript = `(function(){var s=localStorage.getItem('theme');if(s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}})();`

const ldJson = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'PrimeFlow Solutions',
  description: 'Digital solutions studio helping small businesses look premium online. Brand identity, websites, booking systems, and visibility systems.',
  telephone: '+237678683534',
  sameAs: ['https://www.instagram.com/primeflow_1'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
