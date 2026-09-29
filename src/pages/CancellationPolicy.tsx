import PageHero from '../components/PageHero'
import SEO from '../components/SEO'
import { useSiteContent } from '../context/SiteContentContext'

export default function CancellationPolicy() {
  const { cancellation_page } = useSiteContent()

  return (
    <main>
      <SEO
        title={`${cancellation_page.hero_title || 'Cancellation Policy'} | The Black Lantern Clinic`}
        description="Clear guide to appointment cancellations, 24-hour notice policy, Medicare fee separation, and safety-first follow-up procedures."
        canonicalUrl="https://theblacklanternclinic.com/cancellation-policy"
      />
      <PageHero
        title={cancellation_page.hero_title || 'Cancellation Policy'}
        imageSrc={cancellation_page.hero_bg || '/policy_hero.webp'}
        showOverlay={true}
      />

      <div className="legal-content">
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '2rem' }}>
          {cancellation_page.updated_date || 'Last updated: July 2026'}
        </p>

        <div dangerouslySetInnerHTML={{ __html: cancellation_page.content }} />
      </div>
    </main>
  )
}
