import { siteConfig } from './config'

export const generateMetadata = (pageData = {}) => {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    keywords = [],
  } = pageData

  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const fullDescription = description || siteConfig.description
  const fullImage = image || siteConfig.ogImage
  const fullUrl = url ? `${siteConfig.url}${url}` : siteConfig.url

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: [
      'Laddu Gopal',
      'Vastra',
      'Mukut',
      'Bansuri',
      'Devotional wear',
      'Haryana',
      'Krishna',
      'Hindu deity',
      'Religious items',
      'Handcrafted',
      'Peacock Green',
      'Copper',
      ...keywords,
    ].join(', '),
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_IN',
      type: type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
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
    alternates: {
      canonical: fullUrl,
    },
  }
}

export const generateJsonLd = (data) => {
  const baseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/hero/peckok.jpeg`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Haryana',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    sameAs: [
      siteConfig.links.facebook,
      siteConfig.links.instagram,
      siteConfig.links.twitter,
    ],
  }

  if (data.type === 'product') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      description: data.description,
      image: data.images,
      brand: {
        '@type': 'Brand',
        name: siteConfig.name,
      },
      offers: {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: 'INR',
        availability: data.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: siteConfig.name,
        },
      },
      aggregateRating: data.rating
        ? {
            '@type': 'AggregateRating',
            ratingValue: data.rating,
            reviewCount: data.reviews,
          }
        : undefined,
    }
  }

  if (data.type === 'breadcrumb') {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: data.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }
  }

  return baseJsonLd
}
