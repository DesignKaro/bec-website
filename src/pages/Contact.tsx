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

  const hiddenFormRef = useRef<HTMLFormElement>(null)
  const iframeSubmittedRef = useRef(false)

  const getSerializedData = () => {
    const dataParams = new URLSearchParams()
    dataParams.append('names[first_name]', firstName)
    dataParams.append('names[last_name]', lastName)
    dataParams.append('first_name', firstName)
    dataParams.append('last_name', lastName)
    dataParams.append('firstname', firstName)
    dataParams.append('lastname', lastName)
    dataParams.append('email', email)
    dataParams.append('input_email', email)
    dataParams.append('email_address', email)
    dataParams.append('phone', phone)
    dataParams.append('mobile', phone)
    dataParams.append('mobile_number', phone)
    dataParams.append('phone_mobile', phone)
    dataParams.append('numeric-1', phone)
    dataParams.append('message', message)
    dataParams.append('description', message)
    dataParams.append('textarea', message)
    return dataParams.toString()
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setErrorMessage('')

    if (hiddenFormRef.current) {
      iframeSubmittedRef.current = true
      hiddenFormRef.current.submit()
      setTimeout(() => {
        setSubmitted(true)
        setSubmitting(false)
      }, 1000)
    } else {
      setSubmitted(true)
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

      {/* Hidden iframe & fallback form to bypass cross-origin browser CORS policies */}
      <iframe
        name="fluentform_submission_target"
        id="fluentform_submission_target"
        style={{ display: 'none', width: 0, height: 0, border: 0 }}
        title="Form submission frame"
        onLoad={() => {
          if (iframeSubmittedRef.current) {
            setSubmitted(true)
            setSubmitting(false)
          }
        }}
      />
      <form
        ref={hiddenFormRef}
        action="https://api.theblacklanternclinic.com/wp-admin/admin-ajax.php"
        method="POST"
        target="fluentform_submission_target"
        style={{ display: 'none' }}
      >
        <input type="hidden" name="action" value="fluentform_submit" />
        <input type="hidden" name="form_id" value="3" />
        <input type="hidden" name="data" value={getSerializedData()} />
        <input type="hidden" name="names[first_name]" value={firstName} />
        <input type="hidden" name="names[last_name]" value={lastName} />
        <input type="hidden" name="first_name" value={firstName} />
        <input type="hidden" name="last_name" value={lastName} />
        <input type="hidden" name="firstname" value={firstName} />
        <input type="hidden" name="lastname" value={lastName} />
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="input_email" value={email} />
        <input type="hidden" name="email_address" value={email} />
        <input type="hidden" name="phone" value={phone} />
        <input type="hidden" name="mobile" value={phone} />
        <input type="hidden" name="mobile_number" value={phone} />
        <input type="hidden" name="phone_mobile" value={phone} />
        <input type="hidden" name="numeric-1" value={phone} />
        <input type="hidden" name="message" value={message} />
        <input type="hidden" name="description" value={message} />
        <input type="hidden" name="textarea" value={message} />
      </form>
    </main>
  )
}
