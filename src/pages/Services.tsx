import PageHero from '../components/PageHero'
import ContactCtaBanner from '../components/ContactCtaBanner'
import RevealImg from '../components/RevealImg'
import SEO from '../components/SEO'

interface ServiceItem {
  num: string
  title: string
  tagline: string
  desc: string
  bullets: string[]
  photo: string
  alt: string
}

const SERVICES: ServiceItem[] = [
  {
    num: '01',
    title: 'Psychiatry',
    tagline: 'Led by a child and adolescent psychiatrist',
    desc: 'Our clinic is led by Dr Joel Adams-Bedford, a child and adolescent psychiatrist who has a wide range of interests. He aims to provide detailed assessment, formulation and treatment for children, adolescents and young adults. He sees young people presenting with many kinds of concerns at The Black Lantern Clinic including:',
    bullets: [
      'Mood Disorders',
      'Neurodevelopmental Disorders',
      'Anxiety Disorders',
      'Trauma and Personality Concerns',
      'Deliberate Self-Harm',
    ],
    photo: '/services_psychiatry_brain.webp',
    alt: 'Stylized brain illustration representing psychiatry and mental health services',
  },
  {
    num: '02',
    title: 'Therapy',
    tagline: 'Evidence-based therapy matched to where you are.',
    desc: "Therapy is available for a wide range of presentations. Our clinicians use approaches matched to each person's individual needs and developmental stage — not a one-size-fits-all model. We work with young people experiencing:",
    bullets: [
      'Anxiety and worry',
      'Depression and low mood',
      'Trauma and PTSD',
      'Emotional regulation difficulties',
      'Life transitions and adjustment',
    ],
    photo: '/therapy.webp',
    alt: 'Therapy session',
  },
]

export default function Services() {
  return (
    <main>
      <SEO
        title="Youth Psychiatry & Therapy Services | The Black Lantern Clinic"
        description="Comprehensive psychiatric assessment, medication management, and evidence-based therapy for young people aged 12 to 25 in Brisbane."
        canonicalUrl="https://theblacklanternclinic.com/services"
      />
      <PageHero
        title="What we offer"
        imageSrc="/page-hero-bg.jpg"
        showOverlay={true}
      />

      {/* ── Intro ── */}
      <div className="services-intro fade-up">
        <p className="eyebrow" style={{ marginBottom: '0.8rem' }}>Our services</p>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, marginBottom: '1.2rem' }}>
          Specialist mental health services for young people
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-text)', lineHeight: 1.9 }}>
          The Black Lantern Clinic offers psychiatric services to young people aged 12 to 25,
          based in Brisbane, Queensland. All care is evidence-based, person-centred, and tailored to each individual.
        </p>
      </div>

      {/* ── Service Rows ── */}
      <section>
        {SERVICES.map((s, i) => (
          <div
            key={s.num}
            className={`service-row${i % 2 !== 0 ? ' service-row--alt' : ''}`}
          >
            <div className="service-row__image">
              <div className="service-row__image-inner">
                <RevealImg src={s.photo} alt={s.alt} />
              </div>
            </div>
            <div className="service-row__content fade-up">
              <p className="service-row__num">{s.num} — Service</p>
              <h2 className="service-row__title">{s.title}</h2>
              <p className="service-row__tagline">{s.tagline}</p>
              <p className="service-row__body">{s.desc}</p>
              {s.bullets && s.bullets.length > 0 && (
                <ul className="service-row__list">
                  {s.bullets.map((b, idx) => (
                    <li key={idx} className="service-row__list-item">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </section>

      <ContactCtaBanner
        title="Not sure which service is right?"
        body="Give us a call or send an email. We're happy to talk through your situation and help you work out the most appropriate pathway — before you make a booking."
      />
    </main>
  )
}
