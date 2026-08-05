import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ContactCtaBanner from '../components/ContactCtaBanner'
import RevealImg from '../components/RevealImg'
import SEO from '../components/SEO'

const SERVICES = [
  {
    num: '01',
    title: 'Psychiatry',
    image: '/services_psychiatry_brain.webp',
  },
  {
    num: '02',
    title: 'Therapy',
    image: '/therapy.webp',
  },
]

const TEAM = [
  {
    name: 'Dr. Joel Adams-Bedford',
    role: 'Clinical Director & Child and Adolescent Psychiatrist',
    photo: '/team_joel.webp',
  },
  {
    name: 'Rebecca Willis',
    role: 'Practice Director & Psychotherapist',
    photo: '/team_rebecca.webp',
  },
]

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Australia/Brisbane',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }
      setCurrentTime(now.toLocaleTimeString('en-GB', options))
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main>
      <SEO
        title="The Black Lantern Clinic | Specialist Youth Psychiatry & Therapy Brisbane"
        description="Specialist youth mental health clinic in Brisbane for ages 12–25. Grounded, person-centred psychiatric assessment & evidence-based therapy."
        canonicalUrl="https://theblacklanternclinic.com/"
      />
      {/* ── Hero ── */}
      <section ref={heroRef} className={`hero${loaded ? ' loaded' : ''} hero--home`}>
        {/* Background Image */}
        <img
          src="/hero-bg.jpg"
          alt="Hero background"
          className="hero__bg-img"
        />

        {/* Ambient Overlay */}
        <div className="hero__video-overlay" />

        {/* Centered Hero Content */}
        <div className="hero__content hero__content--digitalwerk">
          <div className="hero__top-image-container">
            <img
              src="/hero-sec-bg.png"
              alt="The Black Lantern Clinic"
              className="hero__top-image"
            />
          </div>

          <h1 className="hero__title hero__title--digitalwerk">
            <span className="hero__title-line">Light for the Path ahead</span>
          </h1>

          <p className="hero__subtitle--digitalwerk">
            The Black Lantern Clinic is a private specialist youth mental health clinic in Brisbane, Queensland.
            We see young people aged 12 to 25 — and where it helps, their families and carers too.
          </p>

          <Link to="/contact" className="hero__pill-btn">
            Get in Touch
          </Link>
        </div>

        {/* Bottom Left: Live Brisbane Clock */}
        <div className="hero__bottom-left">
          Brisbane, {currentTime || '15:43:30'}
        </div>

        {/* Bottom Right: Animated Scroll Down Icon */}
        <button
          className="hero__bottom-right hero__scroll-down-btn"
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
          aria-label="Scroll down"
          title="Scroll down"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="hero__emblem-icon hero__bars-icon">
            <rect className="bar bar-1" x="2" y="10" width="3.5" height="12" rx="1.75" fill="currentColor" />
            <rect className="bar bar-2" x="8" y="5" width="3.5" height="17" rx="1.75" fill="currentColor" />
            <rect className="bar bar-3" x="14" y="2" width="3.5" height="20" rx="1.75" fill="currentColor" />
            <rect className="bar bar-4" x="20" y="7" width="3.5" height="15" rx="1.75" fill="currentColor" />
          </svg>
        </button>
      </section>

      {/* ── About Snippet ── */}
      <section id="about-section" className="about-snippet">
        <div className="about-snippet__content fade-up">
          <p className="eyebrow" style={{ marginBottom: '1.2rem' }}>About the clinic</p>
          <p className="about-snippet__quote">
            "A steady light,<br />when the path feels uncertain."
          </p>
          <p className="about-snippet__body">
            The Black Lantern Clinic is a private specialist youth mental health clinic in Brisbane, Queensland. We see young people aged 12 to 25, and where it helps, their families and carers too. Our clinic’s philosophy is in our name, like a lantern, we aim to provide a guiding light to illuminate the darkness and show you the path forward.
          </p>
          <Link to="/about" className="link-arrow" id="home-about-link">Learn about us</Link>
        </div>
        <div className="about-snippet__image">
          <div className="about-snippet__image-inner">
            <RevealImg src="/about.webp" alt="The Black Lantern Clinic reception" />
          </div>
        </div>
      </section>

      {/* ── Services Preview ── */}
      <section className="services-preview section-padding">
        <div className="services-preview__inner">
          <div className="services-grid-3col">
            {/* Column 1: Title, Label & Link */}
            <div className="services-preview__info-card fade-up">
              <div className="services-preview__info-header">
                <p className="eyebrow" style={{ marginBottom: '0.8rem' }}>What we offer</p>
                <h2 className="services-preview__title">
                  Specialist care for young people
                </h2>
              </div>
              <Link to="/services" className="hero__pill-btn hero__pill-btn--dark services-preview__btn" id="home-services-link">
                View all services
              </Link>
            </div>

            {/* Column 2 & 3: Service Cards */}
            {SERVICES.map((s, idx) => (
              <div className={`service-card service-card--simple fade-up stagger-${idx + 1}`} key={s.num}>
                {s.image && (
                  <div className="service-card__icon-container">
                    <img src={s.image} alt={s.title} className="service-card__icon-img" />
                  </div>
                )}
                <h3 className="service-card__title">{s.title}</h3>
                <Link to="/services" className="hero__pill-btn hero__pill-btn--dark hero__pill-btn--sm" id={`service-link-${s.num}`}>
                  Learn more
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Preview ── */}
      <section className="team-preview section-padding">
        <div className="team-preview__inner">
          <div className="team-preview__header fade-up">
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.8rem' }}>The people behind the clinic</p>
              <h2 className="team-preview__title">Meet our team</h2>
            </div>
            <Link to="/team" className="link-arrow" id="home-team-link">View full team</Link>
          </div>

          <div className="team-grid">
            {TEAM.map((m, idx) => (
              <Link to="/team" className={`team-card fade-up stagger-${idx + 1}`} key={m.name}>
                <div className="team-card__photo">
                  <div className="team-card__photo-inner">
                    <RevealImg src={m.photo} alt={m.name} />
                  </div>
                </div>
                <p className="team-card__name">{m.name}</p>
                <p className="team-card__role">{m.role}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <ContactCtaBanner
        title="Ready to take the first step?"
        body="We know reaching out can feel like a big step. Our team is here to answer your questions and help you work out if we're the right fit — no pressure, no obligation."
      />
    </main>
  )
}
