import { Inter } from 'next/font/google'
import '../styles/globals.css'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import SizeGuideModal from '@/components/ui/size-guide-modal'
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Balgopaal Vastram - Devotional Wear for Laddu Gopal',
  description:
    'Handcrafted devotional wear for Laddu Gopal including vastra, mukut, and bansuri. Made with love in Haryana with peacock green and copper themes.',
  keywords:
    'Laddu Gopal, Vastra, Mukut, Bansuri, Devotional wear, Haryana, Krishna, Hindu deity, Religious items, Handcrafted, Peacock Green, Copper',
  authors: [{ name: 'Balgopaal Vastram' }],
  creator: 'Balgopaal Vastram',
  publisher: 'Balgopaal Vastram',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://balgopaal-vastram.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Balgopaal Vastram - Devotional Wear for Laddu Gopal',
    description:
      'Handcrafted devotional wear for Laddu Gopal including vastra, mukut, and bansuri. Made with love in Haryana.',
    url: 'https://balgopaal-vastram.com',
    siteName: 'Balgopaal Vastram',
    images: [
      {
        url: '/hero/peckok.jpeg',
        width: 1200,
        height: 630,
        alt: 'Balgopaal Vastram - Devotional Wear for Laddu Gopal',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Balgopaal Vastram - Devotional Wear for Laddu Gopal',
    description:
      'Handcrafted devotional wear for Laddu Gopal including vastra, mukut, and bansuri. Made with love in Haryana.',
    images: ['/hero/peckok.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pt-20">{children}
          <Toaster
          position="top-right"
          toastOptions={{
            className: "",
            style: {
              background: "transparent",
              padding: 0,
              margin: 0,
              boxShadow: "none",
            },
          }}
        />
          </main>
          <Footer />
          <SizeGuideModal />
        </div>
      </body>
    </html>
  )
}
