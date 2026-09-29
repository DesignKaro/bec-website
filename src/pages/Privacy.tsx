import PageHero from '../components/PageHero'
import SEO from '../components/SEO'
import { useSiteContent } from '../context/SiteContentContext'

export default function Privacy() {
  const { privacy_page } = useSiteContent()

  return (
    <main>
      <SEO
        title={`${privacy_page.hero_title || 'Privacy Policy'} | The Black Lantern Clinic`}
        description="Read how The Black Lantern Clinic handles personal health information, confidentiality, and youth privacy rights in Queensland."
        canonicalUrl="https://theblacklanternclinic.com/privacy"
      />
      <PageHero
        title={privacy_page.hero_title || 'Privacy Policy'}
        imageSrc={privacy_page.hero_bg || '/privacy_hero.webp'}
        showOverlay={true}
      />

      <div className="legal-content">
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '2rem' }}>
          {privacy_page.updated_date || 'Last updated: July 2026'}
        </p>

        <div dangerouslySetInnerHTML={{ __html: privacy_page.content }} />
      </div>
    </main>
  )
}
