import { useEffect, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'

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

  const handleScroll = useCallback(() => {
    setSolid(window.scrollY > 40)

    const footerEl = document.querySelector('.footer')
    if (footerEl) {
      const footerRect = footerEl.getBoundingClientRect()
      setHideDock(footerRect.top <= window.innerHeight - 60)
    } else {
      setHideDock(false)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
    document.body.classList.remove('no-scroll')
  }, [location])

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


  return (
    <>
      <nav className={`navbar ${isSolid ? 'solid' : isTopLight ? 'top-light' : 'transparent'} ${isSolid && hideDock && !menuOpen ? 'dock-hidden' : ''} navbar--${pageClass}`}>
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo">
            <img 
              src={isSolid || isTopLight ? "/black-lan.webp" : "/white-lan.webp"} 
              alt="The Black Lantern Clinic" 
              className="navbar__logo-img" 
            />
          </Link>

          <div className="navbar__right">
            <Link to="/contact" className="navbar__book-link">Book an<br className="navbar__book-br" /> appointment</Link>
            <button className="navbar__menu-btn" onClick={toggleMenu}>
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
      <div className={`menu-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="menu-drawer__inner">
          <div className="menu-drawer__header">
            <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
              <img 
                src="/black-lan.webp" 
                alt="The Black Lantern Clinic" 
                className="navbar__logo-img" 
              />
            </Link>
            <div className="navbar__right">
              <Link to="/contact" className="navbar__book-link" onClick={() => setMenuOpen(false)}>Book an<br className="navbar__book-br" /> appointment</Link>
              <button className="navbar__menu-btn" onClick={toggleMenu}>
                <span className="navbar__menu-btn-text">Close</span>
                <WaveIcon />
              </button>
            </div>
          </div>

          <div className="menu-drawer__content">
            <nav className="menu-drawer__links">
              <Link to="/" className="menu-drawer__link">Home</Link>
              <Link to="/about" className="menu-drawer__link">About Us</Link>
              <Link to="/services" className="menu-drawer__link">Treatments &amp; Services</Link>
              <Link to="/team" className="menu-drawer__link">Our Team</Link>
              <Link to="/contact" className="menu-drawer__link">Contact</Link>
            </nav>
          </div>

          <div className="menu-drawer__footer">
            <div className="menu-drawer__footer-left">
              <a href="tel:+61418542638" className="menu-drawer__footer-item">0418 542 638</a>
              <a href="mailto:admin@theblacklanternclinic.com" className="menu-drawer__footer-item">admin@theblacklanternclinic.com</a>
              <span className="menu-drawer__footer-item">Brisbane, Queensland</span>
            </div>
            <div className="menu-drawer__footer-right">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="menu-drawer__social-link">
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
