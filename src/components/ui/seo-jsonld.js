import { generateJsonLd } from '@/lib/seo'

export default function SEOJsonLD({ data }) {
  const jsonLd = generateJsonLd(data)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
