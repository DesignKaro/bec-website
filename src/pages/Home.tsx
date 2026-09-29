import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ContactCtaBanner from '../components/ContactCtaBanner'
import RevealImg from '../components/RevealImg'
import SEO from '../components/SEO'
import { useSiteContent } from '../context/SiteContentContext'

export default function Home() {
  const { heroes, homepage, services, team, cta } = useSiteContent()
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
      <SEO canonicalUrl="https://theblacklanternclinic.com/" />
      {/* ── Hero ── */}
      <section ref={heroRef} className={`hero${loaded ? ' loaded' : ''} hero--home`}>
        {/* Background Image */}
        <img
          src={homepage.hero_bg || heroes.home_bg || '/hero-bg.webp'}
          alt="Hero background"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="hero__bg-img"
        />

        {/* Ambient Overlay */}
        <div className="hero__video-overlay" />

        {/* Centered Hero Content */}
        <div className="hero__content hero__content--digitalwerk">
          <div className="hero__top-image-container">
            <img
              src={homepage.hero_emblem || '/hero-sec-bg.webp'}
              alt="The Black Lantern Clinic"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="hero__top-image"
            />
          </div>

          <h1 className="hero__title hero__title--digitalwerk">
            <span className="hero__title-line">{homepage.hero_title || heroes.home_title}</span>
          </h1>

          <p className="hero__subtitle--digitalwerk">
            {homepage.hero_subtitle || heroes.home_subtitle}
          </p>

          <Link to={homepage.hero_btn_url || '/contact'} className="hero__pill-btn">
            {homepage.hero_btn_text || 'Get in Touch'}
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
          {homepage.about_eyebrow && (
            <p className="eyebrow" style={{ marginBottom: '1.2rem' }}>
              {homepage.about_eyebrow}
            </p>
          )}
          {homepage.about_title && (
            <p className="about-snippet__quote">
              {homepage.about_title}
            </p>
          )}
          {homepage.about_body && (
            <p className="about-snippet__body">
              {homepage.about_body}
            </p>
          )}
          <Link to={homepage.about_link_url || '/about'} className="link-arrow" id="home-about-link">
            {homepage.about_link_text || 'Learn about us'}
          </Link>
        </div>
        <div className="about-snippet__image">
          <div className="about-snippet__image-inner">
            <RevealImg src={homepage.about_img || '/about.webp'} alt="The Black Lantern Clinic reception" />
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
                  {homepage.services_title}
                </h2>
              </div>
              <Link to="/services" className="hero__pill-btn hero__pill-btn--dark services-preview__btn" id="home-services-link">
                View all services
              </Link>
            </div>

            {/* Column 2 & 3: Service Cards */}
            {services.map((s, idx) => {
              const cardImg = s.image && s.image.trim() !== '' 
                ? s.image 
                : (s.title?.toLowerCase().includes('therapy') ? '/therapy.webp' : '/services_psychiatry_brain.webp')
              return (
                <div className={`service-card service-card--simple fade-up stagger-${idx + 1}`} key={s.id || s.num || idx}>
                  <div className="service-card__icon-container">
                    <img src={cardImg} alt={s.title} className="service-card__icon-img" />
                  </div>
                  <h3 className="service-card__title">{s.title}</h3>
                  {s.content && <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>{s.content}</p>}
                  <Link 
                    to="/services" 
                    className="hero__pill-btn hero__pill-btn--dark hero__pill-btn--sm" 
                    id={`service-link-${s.id || idx}`}
                    aria-label={`Learn about ${s.title} services`}
                    style={{ marginTop: 'auto' }}
                  >
                    Learn about {s.title}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Team Preview ── */}
      <section className="team-preview section-padding">
        <div className="team-preview__inner">
          <div className="team-preview__header fade-up">
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.8rem' }}>The people behind the clinic</p>
              <h2 className="team-preview__title">{homepage.team_title}</h2>
            </div>
            <Link to="/team" className="link-arrow" id="home-team-link">View full team</Link>
          </div>

          <div className="team-grid">
            {team.map((m, idx) => (
              <Link to="/team" className={`team-card fade-up stagger-${idx + 1}`} key={m.name} aria-label={`Read bio and credentials for ${m.name}`}>
                <div className="team-card__photo">
                  <div className="team-card__photo-inner">
                    <RevealImg src={m.photo || (m.name?.includes('Rebecca') ? '/team_rebecca.webp' : '/team_joel.webp')} alt={m.name} />
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
        title={cta.title}
        body={cta.body}
      />
    </main>
  )
}
