import { useState, useEffect, useRef, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function Contact() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.4
    }
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMessage('')

    try {
      const payload = new URLSearchParams()
      payload.append('action', 'fluentform_submit')
      payload.append('form_id', '3')
      payload.append('names[first_name]', firstName)
      payload.append('names[last_name]', lastName)
      payload.append('first_name', firstName)
      payload.append('last_name', lastName)
      payload.append('email', email)
      payload.append('phone', phone)
      payload.append('mobile', phone)
      payload.append('phone_mobile', phone)
      payload.append('numeric-1', phone)
      payload.append('message', message)

      const response = await fetch('https://api.theblacklanternclinic.com/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: payload.toString(),
      })

      const data = await response.json()

      if (data && data.success) {
        setSubmitted(true)
      } else {
        setErrorMessage(
          data?.data?.error || data?.data?.result?.message || 'There was an issue submitting your enquiry. Please try again or contact us directly.'
        )
      }
    } catch (err) {
      console.error('Fluent Forms submission error:', err)
      setErrorMessage('Failed to connect to the clinic server. Please check your connection or contact us directly via email.')
    } finally {
      setSubmitting(false)
    }
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
                  {errorMessage && (
                    <div className="contact-form-error">
                      {errorMessage}
                    </div>
                  )}

                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <input
                        id="contact-first-name"
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="contact-form-group">
                      <input
                        id="contact-last-name"
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="contact-form-group">
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="contact-form-group">
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="contact-form-group">
                    <textarea
                      id="contact-message"
                      placeholder="Enquiry"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <div className="contact-form-checkbox-row">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        required
                      />
                      <span className="checkbox-label">
                        I accept the terms listed in the <Link to="/privacy">Privacy Policy</Link>
                      </span>
                    </label>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="minimal-submit-btn"
                      disabled={submitting}
                    >
                      {submitting ? 'Sending...' : 'Submit'}
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
