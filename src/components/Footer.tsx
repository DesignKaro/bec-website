import { Link } from 'react-router-dom'
import { AtSign, PhoneCall } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'

export default function Footer() {
  const year = new Date().getFullYear()
  const { general, heroes } = useSiteContent()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__box">
          {/* Background Image */}
          <img
            src={heroes.footer_bg || '/footer-bg.webp'}
            alt="Footer background"
            className="footer__bg-img"
          />
          <div className="footer__video-overlay" />

          {/* Main Footer Content */}
          <div className="footer__content-grid">
            {/* Column 1: Logo */}
            <div className="footer__brand-col">
              <Link to="/" className="footer__logo-link">
                <img 
                  src="/white-lan.webp" 
                  alt="The Black Lantern Clinic" 
                  className="footer__logo-img" 
                />
              </Link>
              <p className="footer__brand-desc">
                Specialist psychiatric and mental health care for young people aged 12 to 25.
              </p>
            </div>

            {/* Column 2: Contact */}
            <div className="footer__info-col">
              <span className="footer__section-title">Contact</span>
              <ul className="footer__contact-list">
                <li>
                  <div className="footer__icon-badge">
                    <AtSign size={14} strokeWidth={1.8} className="footer__contact-icon" />
                  </div>
                  <a href={`mailto:${general.email}`} className="footer__link">
                    {general.email}
                  </a>
                </li>
                <li>
                  <div className="footer__icon-badge">
                    <PhoneCall size={14} strokeWidth={1.8} className="footer__contact-icon" />
                  </div>
                  <a href={`tel:${general.phone.replace(/\s+/g, '')}`} className="footer__link">
                    {general.phone}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Menu */}
            <div className="footer__menu-col">
              <span className="footer__section-title">Menu</span>
              <nav className="footer__nav-list">
                <Link to="/about" className="footer__link">About Us</Link>
                <Link to="/team" className="footer__link">Our Team</Link>
                <Link to="/services" className="footer__link">Services</Link>
                <Link to="/contact" className="footer__link">Contact</Link>
              </nav>
            </div>

            {/* Column 4: Hours & Support */}
            <div className="footer__hours-col">
              <span className="footer__section-title">Hours &amp; Care</span>
              <ul className="footer__hours-list">
                <li>{general.hours}</li>
                <li>Sat: By appointment only</li>
                <li className="footer__crisis-item">
                  <strong>Crisis Support</strong><br />
                  {general.crisis_text}
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer__legal-bar">
            <div className="footer__legal-left">
              <span className="footer__copyright-text">
                © {year} The Black Lantern Clinic
              </span>
              <Link to="/privacy" className="footer__legal-link">Privacy Policy</Link>
              <Link to="/terms" className="footer__legal-link">Terms &amp; Conditions</Link>
              <Link to="/cancellation-policy" className="footer__legal-link">Cancellation Policy</Link>
            </div>
            <div className="footer__legal-right">
              <span className="footer__credit">
                Youth Mental Health · Brisbane, Queensland
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
