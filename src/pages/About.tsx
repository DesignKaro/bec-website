import { Flame, Compass, Leaf, Users, Microscope, Repeat2 } from 'lucide-react'
import PageHero from '../components/PageHero'
import ContactCtaBanner from '../components/ContactCtaBanner'
import RevealImg from '../components/RevealImg'
import SEO from '../components/SEO'

const VALUES = [
  {
    icon: <Microscope size={28} strokeWidth={1.25} />,
    title: 'Evidence-based',
    desc: "Everything we do is grounded in the best available clinical research. We don't guess — we rely on what the evidence actually shows.",
  },
  {
    icon: <Flame size={28} strokeWidth={1.25} />,
    title: 'Person-centred',
    desc: "Your goals and your voice sit at the centre of everything. We're here for you — not a diagnosis, not a checklist.",
  },
  {
    icon: <Leaf size={28} strokeWidth={1.25} />,
    title: 'Trauma-informed',
    desc: 'We know many young people have been through hard things. Our clinic is designed to feel safe, predictable, and free of pressure.',
  },
  {
    icon: <Compass size={28} strokeWidth={1.25} />,
    title: 'Developmentally appropriate',
    desc: 'We calibrate our approach to where you actually are — not just how old you are. Development is not one-size-fits-all.',
  },
  {
    icon: <Users size={28} strokeWidth={1.25} />,
    title: 'Collaborative',
    desc: 'With your consent, we work alongside your GP, school, family, and other supports to make sure care is connected, not fragmented.',
  },
  {
    icon: <Repeat2 size={28} strokeWidth={1.25} />,
    title: 'Continuity of care',
    desc: "You'll see the same clinicians throughout your care. We think that matters — and the evidence agrees. No revolving door.",
  },
]

export default function About() {
  return (
    <main>
      <SEO
        title="Who We Are | The Black Lantern Clinic Brisbane"
        description="Learn about our Brisbane youth mental health clinic's philosophy, evidence-based values, trauma-informed care, and person-centred approach."
        canonicalUrl="https://theblacklanternclinic.com/about"
      />
      <PageHero
        title="Who we are"
        imageSrc="/policy_hero.webp"
        showOverlay={false}
      />

      {/* ── Clinic Story ── */}
      <section className="about-story">
        <div className="about-story__image">
          <div className="about-story__image-inner">
            <RevealImg src="/about_story.webp" alt="The Black Lantern Clinic therapy room" />
          </div>
        </div>
        <div className="about-story__content fade-up">
          <p className="eyebrow about-story__eyebrow">Our story</p>
          <h2 className="about-story__title">
            "A steady light, when the path feels uncertain."
          </h2>
          <div className="about-story__body">
            <p>
              The Black Lantern Clinic is a private specialist youth mental health clinic in Brisbane, Queensland. We see young people aged 12 to 25, and where it helps, their families and carers too. Our clinic’s philosophy is in our name, like a lantern, we aim to provide a guiding light to illuminate the darkness and show you the path forward.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="about-values-section">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="fade-up">
          <p className="eyebrow" style={{ marginBottom: '0.8rem' }}>What we stand for</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300 }}>
            Our values
          </h2>
        </div>
        <div className="values-grid">
          {VALUES.map((v, idx) => (
            <div className={`value-card fade-up stagger-${(idx % 3) + 1}`} key={v.title}>
              <div className="value-card__icon">{v.icon}</div>
              <h3 className="value-card__title">{v.title}</h3>
              <p className="value-card__desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Approach ── */}
      <section>
        <div className="approach-row">
          <div className="approach-row__image">
            <div className="approach-row__image-inner">
              <RevealImg src="/about_approach_play.webp" alt="Welcoming clinic environment" />
            </div>
          </div>
          <div className="approach-row__content fade-up">
            <p className="approach-row__num">01 — Our approach</p>
            <h2 className="approach-row__title">
              Person-centred care, from the very first contact
            </h2>
            <p className="approach-row__body">
              From the first enquiry, you'll be met with clarity and warmth. We take time to understand
              each young person's situation before recommending any pathway. No assumptions, no rushing —
              just honest conversation about what might actually help.
            </p>
          </div>
        </div>

        <div className="approach-row approach-row--reversed">
          <div className="approach-row__image">
            <div className="approach-row__image-inner">
              <RevealImg src="/about_approach_meeting.webp" alt="Collaborative care meeting" />
            </div>
          </div>
          <div className="approach-row__content fade-up">
            <p className="approach-row__num">02 — How we work</p>
            <h2 className="approach-row__title">
              We don't work in isolation
            </h2>
            <p className="approach-row__body">
              Mental health doesn't happen in a vacuum. With your consent, we work alongside your GP,
              school, family, and other services to make sure care is coordinated — and that nothing
              falls through the cracks.
            </p>
          </div>
        </div>
      </section>

      <ContactCtaBanner
        title="Want to know if we're the right fit?"
        body="You're welcome to call or email before making a referral or booking. We're happy to answer questions about our services, fees, or how to get started — no commitment required."
      />
    </main>
  )
}
