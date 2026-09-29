import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const WaveIcon = () => (
  <svg className="navbar__wave-icon" width="26" height="26" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ marginLeft: '8px', display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="18" cy="18" r="17" />
    <path d="M 6 12 Q 12 10 18 12 T 30 12" />
    <path d="M 5 16 Q 12 14 18 16 T 31 16" />
    <path d="M 4 20 Q 12 18 18 20 T 32 20" />
    <path d="M 6 24 Q 12 22 18 24 T 30 24" />
    <path d="M 9 28 Q 12 26 18 28 T 27 28" />
    <path d="M 12 8 Q 15 6 18 8 T 24 8" />
  </svg>
)

export default function Navbar() {
  const [solid, setSolid] = useState(false)
  const [hideDock, setHideDock] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setSolid(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    const footerEl = document.querySelector('.footer')
    let observer: IntersectionObserver | null = null
    if (footerEl) {
      observer = new IntersectionObserver(([entry]) => {
        setHideDock(entry.isIntersecting)
      }, { rootMargin: '0px 0px -60px 0px' })
      observer.observe(footerEl)
    } else {
      setHideDock(false)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (observer) observer.disconnect()
    }
  }, [location.pathname])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
    document.body.classList.remove('no-scroll')
  }, [location])

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
        document.body.classList.remove('no-scroll')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  const toggleMenu = () => {
    const next = !menuOpen
    setMenuOpen(next)
    document.body.classList.toggle('no-scroll', next)
  }

  const scrollToTop = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasDarkHero = ['/', '/about', '/team', '/services', '/privacy', '/terms', '/cancellation-policy'].includes(location.pathname)
  const hasHero = hasDarkHero || location.pathname === '/contact'
  const isSolid = solid || !hasHero || menuOpen
  const isTopLight = !hasDarkHero && !isSolid  // contact page at top → dark text
  const pageClass = location.pathname === '/' ? 'home' : location.pathname.substring(1)

  const { general } = useSiteContent()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Treatments & Services' },
    { path: '/team', label: 'Our Team' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className={`navbar ${isSolid ? 'solid' : isTopLight ? 'top-light' : 'transparent'} ${isSolid && hideDock && !menuOpen ? 'dock-hidden' : ''} navbar--${pageClass}`} aria-label="Main Navigation">
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo" aria-label="The Black Lantern Clinic Home">
            <img 
              src={isSolid || isTopLight ? "/black-lan.webp" : "/white-lan.webp"} 
              alt="The Black Lantern Clinic" 
              className="navbar__logo-img" 
            />
          </Link>

          <div className="navbar__right">
            <Link to={general.booking_url || '/contact'} className="navbar__book-link">
              {general.booking_btn_text || 'Book an appointment'}
            </Link>
            <button 
              className="navbar__menu-btn" 
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="menu-drawer"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <span className="navbar__menu-btn-text">{menuOpen ? 'Close' : 'Menu'}</span>
              <WaveIcon />
            </button>
            {isSolid && (
              <button 
                className="navbar__scroll-top-btn" 
                onClick={scrollToTop}
                title="Scroll to top"
                aria-label="Scroll to top"
              >
                <ArrowUp size={14} strokeWidth={2.2} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Fullscreen Drawer Overlay */}
      <div id="menu-drawer" className={`menu-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen} role="dialog" aria-label="Site Navigation Drawer">
        <div className="menu-drawer__inner">
          <div className="menu-drawer__header">
            <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)} aria-label="The Black Lantern Clinic Home">
              <img 
                src="/black-lan.webp" 
                alt="The Black Lantern Clinic" 
                className="navbar__logo-img" 
              />
            </Link>
            <div className="navbar__right">
              <Link to={general.booking_url || '/contact'} className="navbar__book-link" onClick={() => setMenuOpen(false)}>
                {general.booking_btn_text || 'Book an appointment'}
              </Link>
              <button 
                className="navbar__menu-btn" 
                onClick={toggleMenu}
                aria-expanded={menuOpen}
                aria-controls="menu-drawer"
                aria-label="Close navigation menu"
              >
                <span className="navbar__menu-btn-text">Close</span>
                <WaveIcon />
              </button>
            </div>
          </div>

          <div className="menu-drawer__content">
            <nav className="menu-drawer__links" aria-label="Drawer Navigation">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`menu-drawer__link${location.pathname === item.path ? ' active' : ''}`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="menu-drawer__footer">
            <div className="menu-drawer__footer-left">
              <a href={`tel:${general.phone.replace(/[^\d+]/g, '')}`} className="menu-drawer__footer-item" aria-label={`Phone: ${general.phone}`}>{general.phone}</a>
              <a href={`mailto:${general.email}`} className="menu-drawer__footer-item" aria-label={`Email: ${general.email}`}>{general.email}</a>
              <span className="menu-drawer__footer-item">{general.address || general.location_text}</span>
            </div>
            <div className="menu-drawer__footer-right">
              <a href={general.instagram_url || 'https://instagram.com'} target="_blank" rel="noopener noreferrer" className="menu-drawer__social-link" aria-label="Visit our Instagram page">
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
