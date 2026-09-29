import PageHero from '../components/PageHero'
import ContactCtaBanner from '../components/ContactCtaBanner'
import RevealImg from '../components/RevealImg'
import SEO from '../components/SEO'
import { useSiteContent } from '../context/SiteContentContext'

export default function Services() {
  const { services_page } = useSiteContent()

  const serviceList = [
    services_page?.service1,
    services_page?.service2,
  ].filter(Boolean)

  return (
    <main>
      <SEO
        title={`${services_page.hero_title || 'Youth Mental Health Services Brisbane'} | The Black Lantern Clinic`}
        description="Specialist youth psychiatry and psychotherapy services in Tarragindi, Brisbane for young people aged 12–25. ADHD, depression, anxiety, trauma & EMDR."
        canonicalUrl="https://theblacklanternclinic.com/services"
      />
      <PageHero
        title={services_page.hero_title}
        imageSrc={services_page.hero_bg}
        showOverlay={true}
      />

      {/* ── Intro ── */}
      <div className="services-intro fade-up">
        {services_page.intro_eyebrow && (
          <p className="eyebrow" style={{ marginBottom: '0.8rem' }}>
            {services_page.intro_eyebrow}
          </p>
        )}
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, marginBottom: '1.2rem' }}>
          {services_page.intro_title}
        </h2>
        {services_page.intro_body && (
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text)', lineHeight: 1.9 }}>
            {services_page.intro_body}
          </p>
        )}
      </div>

      {/* ── Service Rows ── */}
      <section>
        {serviceList.map((s, i) => {
          if (!s) return null
          const photoSrc = s.photo && s.photo.trim() !== ''
            ? s.photo
            : (s.title?.toLowerCase().includes('therapy') ? '/therapy.webp' : '/services_psychiatry_brain.webp')

          return (
            <div
              key={s.num || i}
              className={`service-row${i % 2 !== 0 ? ' service-row--alt' : ''}`}
            >
              <div className="service-row__image">
                <div className="service-row__image-inner">
                  <RevealImg src={photoSrc} alt={s.title || 'Service image'} />
                </div>
              </div>
              <div className="service-row__content fade-up">
                <p className="service-row__num">{s.num || `0${i + 1}`} — Service</p>
                <h2 className="service-row__title">{s.title}</h2>
                {s.tagline && <p className="service-row__tagline">{s.tagline}</p>}
                {s.desc && <p className="service-row__body">{s.desc}</p>}
                {s.bullets && s.bullets.length > 0 && (
                  <ul className="service-row__list">
                    {s.bullets.map((b, idx) => (
                      <li key={idx} className="service-row__list-item">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )
        })}
      </section>

      <ContactCtaBanner
        title={services_page.cta_title}
        body={services_page.cta_body}
      />
    </main>
  )
}
