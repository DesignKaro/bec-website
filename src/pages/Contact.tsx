import { useState, useEffect, useRef, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.4
    }
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="contact-page-main">
      <SEO
        title="Contact Us | The Black Lantern Clinic Brisbane"
        description="Get in touch with our Brisbane clinic team. Enquire about appointments, referrals, fees, and location in Brisbane, QLD."
        canonicalUrl="https://theblacklanternclinic.com/contact"
      />
      <div className="contact-card-wrapper">
        <div className="contact-card-container fade-in">
          
          {/* LEFT SIDE: Info & Background Video */}
          <div className="contact-card__left">
            <video
              ref={videoRef}
              className="contact-card__video"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/hero-bg.webm" type="video/webm" />
              <source src="/hero-bg.mp4" type="video/mp4" />
            </video>
            <div className="contact-card__left-overlay" />
            <div className="contact-card__left-content">
              <div>
                <h1 className="contact-card__title">
                  You have questions.<br />
                  We have time.
                </h1>
                <p className="contact-card__subtitle">
                  Whether you're a young person, a parent, a carer, or a GP — we're happy to talk.
                  You don't need to have everything figured out before you call.
                </p>
              </div>

              <div className="contact-card__details-grid">
                <div className="contact-card__detail-block">
                  <span className="contact-card__detail-label">Hours</span>
                  <p className="contact-card__detail-value">
                    Mon – Fri: 09:00 – 17:00<br />
                    Sat: By appointment
                  </p>
                </div>
                <div className="contact-card__detail-block">
                  <span className="contact-card__detail-label">Support Channels</span>
                  <p className="contact-card__detail-value">
                    GPs &amp; Medical Referrals<br />
                    Parent &amp; Carer Support<br />
                    Self-Referrals Welcome
                  </p>
                </div>
                <div className="contact-card__detail-block">
                  <span className="contact-card__detail-label">Email</span>
                  <p className="contact-card__detail-value">
                    <a href="mailto:admin@theblacklanternclinic.com">
                      admin@theblacklanternclinic.com
                    </a>
                  </p>
                </div>
                <div className="contact-card__detail-block">
                  <span className="contact-card__detail-label">Contact</span>
                  <p className="contact-card__detail-value">
                    <a href="tel:+61418542638">0418 542 638</a>
                  </p>
                </div>
                <div className="contact-card__detail-block contact-card__detail-block--full">
                  <span className="contact-card__detail-label">Crisis Support</span>
                  <p className="contact-card__detail-value">
                    The Black Lantern Clinic is not a crisis clinic, if you are experiencing a mental health crisis or emergency please contact 000 or lifeline 13 11 14 or 24/7 MH Call 1300 642 255
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Floating White Form Card */}
          <div className="contact-card__right">
            <div className="contact-form-card">
              {submitted ? (
                <div className="contact-form-success">
                  <p className="contact-form-success__title">Thank you</p>
                  <p className="contact-form-success__text">
                    Your message has been received. Our intake coordinators will review your details and contact you within one business day.
                  </p>
                </div>
              ) : (
                <form className="contact-minimal-form" onSubmit={handleSubmit}>
                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <input id="contact-first-name" type="text" placeholder="First Name" required />
                    </div>
                    <div className="contact-form-group">
                      <input id="contact-last-name" type="text" placeholder="Last Name" required />
                    </div>
                  </div>

                  <div className="contact-form-group">
                    <input id="contact-email" type="email" placeholder="Email" required />
                  </div>

                  <div className="contact-form-group">
                    <input id="contact-phone" type="tel" placeholder="Phone Number" required />
                  </div>

                  <div className="contact-form-group">
                    <textarea id="contact-message" placeholder="Enquiry" rows={5} required />
                  </div>

                  <div className="contact-form-checkbox-row">
                    <label className="checkbox-container">
                      <input type="checkbox" required />
                      <span className="checkbox-label">
                        I accept the terms listed in the <Link to="/privacy">Privacy Policy</Link>
                      </span>
                    </label>
                  </div>

                  <div>
                    <button type="submit" className="minimal-submit-btn">
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
