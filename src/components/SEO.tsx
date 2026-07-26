import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  type?: string
}

const DEFAULT_TITLE = 'The Black Lantern Clinic | Specialist Youth Psychiatry & Therapy Brisbane'
const DEFAULT_DESC = 'Specialist youth mental health clinic in Brisbane providing psychiatric assessment and evidence-based therapy for young people aged 12 to 25.'
const DEFAULT_IMAGE = 'https://theblacklanternclinic.com/og-image.png'
const SITE_NAME = 'The Black Lantern Clinic'

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  keywords = 'youth mental health brisbane, child psychiatrist brisbane, adolescent psychiatry queensland, youth therapy brisbane, EMDR therapy brisbane, private youth clinic',
  canonicalUrl,
  ogImage = DEFAULT_IMAGE,
  type = 'website',
}: SEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title

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

    const currentUrl = canonicalUrl || window.location.href

    // 2. Standard & Local Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', description)
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords)
    setMetaTag('meta[name="author"]', 'name', 'author', SITE_NAME)
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    setMetaTag('meta[name="geo.region"]', 'name', 'geo.region', 'AU-QLD')
    setMetaTag('meta[name="geo.placename"]', 'name', 'geo.placename', 'Brisbane')
    setLinkTag('canonical', currentUrl)

    // 3. Open Graph (OG) Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title)
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description)
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type)
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl)
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage)
    setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200')
    setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630')
    setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', title)
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME)
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_AU')

    // 4. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage)
    setMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', title)

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
          'image': ogImage,
          'description': DEFAULT_DESC,
          'telephone': '0418 542 638',
          'email': 'admin@theblacklanternclinic.com',
          'medicalSpecialty': ['Psychiatric', 'Psychotherapy', 'Pediatric'],
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Brisbane',
            'addressRegion': 'QLD',
            'addressCountry': 'AU',
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': -27.4698,
            'longitude': 153.0251,
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
          'name': title,
          'description': description,
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
  }, [title, description, keywords, canonicalUrl, ogImage, type])

  return null
}
