import { siteConfig } from '@/lib/config'

export const dynamic = 'force-static'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/', '/api/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
