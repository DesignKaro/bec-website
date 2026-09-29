import { useEffect } from 'react'
import { useSiteContent } from '../context/SiteContentContext'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  type?: string
  robots?: string
}

const DEFAULT_TITLE = 'Psychiatrist Brisbane | Youth Mental Health | The Black Lantern Clinic'
const DEFAULT_DESC = 'Private youth mental health clinic in Tarragindi, Brisbane, providing psychiatric assessment, treatment and therapeutic support for young people aged 12–25.'
const SITE_NAME = 'The Black Lantern Clinic'

export default function SEO({
  title,
  description,
  keywords = 'youth mental health brisbane, child psychiatrist brisbane, adolescent psychiatry queensland, youth therapy brisbane, EMDR therapy brisbane, private youth clinic',
  canonicalUrl,
  ogImage,
  type = 'website',
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
}: SEOProps) {
  const { seo, general } = useSiteContent()
  const activeTitle = title || seo.home_title || DEFAULT_TITLE
  const activeDesc = description || seo.home_desc || DEFAULT_DESC
  const activeOgImage = ogImage || seo.og_image || 'https://theblacklanternclinic.com/og-image.webp'

  useEffect(() => {
    // 1. Update Document Title
    document.title = activeTitle

    // Helper to update or create meta tags
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attrName, attrVal)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // Helper to update or create link tags
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement
      if (!element) {
        element = document.createElement('link')
        element.setAttribute('rel', rel)
        document.head.appendChild(element)
      }
      element.setAttribute('href', href)
    }

    // Enforce preferred non-www canonical URL
    const rawUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://theblacklanternclinic.com/')
    const currentUrl = rawUrl.replace(/^https?:\/\/www\./i, 'https://')

    // 2. Standard & Local Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', activeDesc)
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords)
    setMetaTag('meta[name="author"]', 'name', 'author', SITE_NAME)
    setMetaTag('meta[name="robots"]', 'name', 'robots', robots)
    setMetaTag('meta[name="geo.region"]', 'name', 'geo.region', 'AU-QLD')
    setMetaTag('meta[name="geo.placename"]', 'name', 'geo.placename', 'Brisbane')
    setLinkTag('canonical', currentUrl)

    // 3. Open Graph (OG) Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', activeTitle)
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', activeDesc)
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type)
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl)
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', activeOgImage)
    setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200')
    setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630')
    setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', activeTitle)
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME)
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_AU')

    // 4. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', activeTitle)
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', activeDesc)
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', activeOgImage)
    setMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', activeTitle)

    // 5. Schema.org JSON-LD Structured Data Graph
    const schemaId = 'schema-json-ld'
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.id = schemaId
      scriptTag.type = 'application/ld+json'
      document.head.appendChild(scriptTag)
    }

    const jsonLdData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'MedicalClinic',
          '@id': 'https://theblacklanternclinic.com/#clinic',
          'name': 'The Black Lantern Clinic',
          'url': 'https://theblacklanternclinic.com',
          'logo': 'https://theblacklanternclinic.com/black-lan.webp',
          'image': activeOgImage,
          'description': activeDesc,
          'telephone': general.phone || '0418 542 638',
          'email': general.email || 'admin@theblacklanternclinic.com',
          'medicalSpecialty': ['Psychiatric', 'Psychotherapy', 'Pediatric'],
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': general.address ? general.address.split(',')[0].trim() : '195 Fingal Street',
            'addressLocality': 'Tarragindi, Brisbane',
            'addressRegion': 'QLD',
            'postalCode': '4121',
            'addressCountry': 'AU',
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': -27.5255,
            'longitude': 153.0425,
          },
          'openingHoursSpecification': [
            {
              '@type': 'OpeningHoursSpecification',
              'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              'opens': '09:00',
              'closes': '17:00',
            },
          ],
          'priceRange': '$$$',
          'knowsAbout': [
            'Child & Adolescent Psychiatry',
            'Psychotherapy',
            'EMDR Therapy',
            'Youth Mental Health (Ages 12-25)',
            'Neurodevelopmental Assessments',
          ],
        },
        {
          '@type': 'Physician',
          '@id': 'https://theblacklanternclinic.com/#joel-adams-bedford',
          'name': 'Dr. Joel Adams-Bedford',
          'jobTitle': 'Child & Adolescent Psychiatrist',
          'worksFor': {
            '@id': 'https://theblacklanternclinic.com/#clinic',
          },
          'medicalSpecialty': 'Psychiatric',
        },
        {
          '@type': 'WebPage',
          '@id': `${currentUrl}#webpage`,
          'url': currentUrl,
          'name': activeTitle,
          'description': activeDesc,
          'isPartOf': {
            '@type': 'WebSite',
            '@id': 'https://theblacklanternclinic.com/#website',
            'url': 'https://theblacklanternclinic.com',
            'name': 'The Black Lantern Clinic',
          },
        },
      ],
    }

    scriptTag.textContent = JSON.stringify(jsonLdData)
  }, [activeTitle, activeDesc, activeOgImage, keywords, canonicalUrl, type, general, robots])

  return null
}
