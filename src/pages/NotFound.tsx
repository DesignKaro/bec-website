import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function NotFound() {
  return (
    <main className="not-found-page" style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8rem 1.5rem 6rem',
      textAlign: 'center',
      position: 'relative',
      background: 'radial-gradient(ellipse at 50% 30%, rgba(201, 168, 124, 0.08) 0%, transparent 70%)',
    }}>
      <SEO
        title="Page Not Found | The Black Lantern Clinic"
        description="The page you are looking for cannot be found. Return to The Black Lantern Clinic home or contact our clinic in Brisbane."
        robots="noindex, follow"
      />

      <div style={{ maxWidth: '580px', margin: '0 auto' }} className="fade-up">
        {/* Subtle Lantern Silhouette Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 2rem',
          borderRadius: '50%',
          border: '1px solid rgba(201, 168, 124, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent, #c9a87c)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v3m0 14v3M4.93 4.93l2.12 2.12m9.9 9.9l2.12 2.12M2 12h3m14 0h3M4.93 19.07l2.12-2.12m9.9-9.9l2.12-2.12" opacity="0.4" />
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="10" x2="12" y2="14" />
          </svg>
        </div>

        <p className="eyebrow" style={{ marginBottom: '1rem', letterSpacing: '0.18em' }}>
          Error 404
        </p>

        <h1 style={{
          fontFamily: 'var(--font-serif, "Spectral", serif)',
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          fontWeight: 300,
          color: 'var(--color-heading, #ffffff)',
          lineHeight: 1.2,
          marginBottom: '1.2rem',
        }}>
          The path ahead is unclear
        </h1>

        <p style={{
          fontSize: '1rem',
          color: 'var(--color-text-muted, #9e9e9e)',
          lineHeight: 1.8,
          marginBottom: '2.5rem',
        }}>
          The page you’re looking for doesn’t exist or may have been moved. Like our clinic's guiding philosophy, let us offer some light to help you find your way back.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <Link
            to="/"
            className="hero__pill-btn"
            style={{ minWidth: '150px' }}
          >
            Return Home
          </Link>
          <Link
            to="/services"
            className="hero__pill-btn hero__pill-btn--dark"
            style={{ minWidth: '150px' }}
          >
            Our Services
          </Link>
          <Link
            to="/contact"
            className="hero__pill-btn hero__pill-btn--dark"
            style={{ minWidth: '150px' }}
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </main>
  )
}
