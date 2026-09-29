import PageHero from '../components/PageHero'
import SEO from '../components/SEO'
import { useSiteContent } from '../context/SiteContentContext'

export default function Terms() {
  const { terms_page } = useSiteContent()

  return (
    <main>
      <SEO
        title={`${terms_page.hero_title || 'Terms & Conditions'} | The Black Lantern Clinic`}
        description="Terms and conditions governing care, fees, payments, overdue accounts, and legal jurisdiction under Queensland law."
        canonicalUrl="https://theblacklanternclinic.com/terms"
      />
      <PageHero
        title={terms_page.hero_title || 'Terms & Conditions'}
        imageSrc={terms_page.hero_bg || '/terms_hero.webp'}
        showOverlay={true}
      />

      <div className="legal-content">
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '2rem' }}>
          {terms_page.updated_date || 'Last updated: July 2026'}
        </p>

        <div dangerouslySetInnerHTML={{ __html: terms_page.content }} />
      </div>
    </main>
  )
}
