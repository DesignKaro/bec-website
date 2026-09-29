import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useSiteContent } from '../context/SiteContentContext'

export default function Contact() {
  const { general, contact_page } = useSiteContent()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')


  const getSerializedData = () => {
    // 1. Pack all form fields into URL-encoded format expected inside $_POST['data']
    const innerParams = new URLSearchParams()

    // Name fields (nested and flat formats)
    innerParams.append('names[first_name]', firstName.trim())
    innerParams.append('names[last_name]', lastName.trim())
    innerParams.append('first_name', firstName.trim())
    innerParams.append('last_name', lastName.trim())
    innerParams.append('firstname', firstName.trim())
    innerParams.append('lastname', lastName.trim())
    innerParams.append('name', `${firstName.trim()} ${lastName.trim()}`.trim())

    // Email fields
    innerParams.append('email', email.trim())
    innerParams.append('input_email', email.trim())
    innerParams.append('email_address', email.trim())

    // Phone fields
    innerParams.append('phone', phone.trim())
    innerParams.append('mobile', phone.trim())
    innerParams.append('mobile_number', phone.trim())
    innerParams.append('phone_mobile', phone.trim())
    innerParams.append('numeric-1', phone.trim())
    innerParams.append('phone-1', phone.trim())

    // Message fields
    innerParams.append('message', message.trim())
    innerParams.append('description', message.trim())
    innerParams.append('comments', message.trim())
    innerParams.append('textarea', message.trim())

    // Terms & Conditions / Agreement
    innerParams.append('accepted_terms', acceptedTerms ? 'yes' : 'no')
    innerParams.append('terms-n-condition', acceptedTerms ? 'on' : '')
    innerParams.append('agree', acceptedTerms ? 'on' : '')
    innerParams.append('checkbox', acceptedTerms ? '1' : '0')

    const serializedData = innerParams.toString()

    // 2. Fluent Forms AJAX submission handler parses $_POST['data'] with parse_str()
    const payload = new URLSearchParams()
    payload.append('action', 'fluentform_submit')
    payload.append('form_id', '3')
    payload.append('data', serializedData)

    // Also append flat fields at top level as safeguard
    innerParams.forEach((val, key) => {
      payload.append(key, val)
    })

    return payload.toString()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!acceptedTerms) {
      setErrorMessage('Please accept the terms and conditions to proceed.')
      return
    }

    setSubmitting(true)
    setErrorMessage('')

    try {
      // 1. Primary submission via REST API with verified response and error handling
      const res = await fetch('https://api.theblacklanternclinic.com/wp-json/bec/v1/contact-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok || (data && data.success === false)) {
        throw new Error((data && data.message) || 'Submission failed. Please verify your details and try again.')
      }

      // 2. Redundant capture via Fluent Forms in background
      try {
        fetch('https://api.theblacklanternclinic.com/wp-admin/admin-ajax.php', {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          body: getSerializedData(),
        }).catch(() => {})
      } catch {
        // Redundant capture error swallowed safely
      }

      setSubmitted(true)
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setMessage('')
      setAcceptedTerms(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to submit your message right now. Please call or email our clinic directly.'
      setErrorMessage(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <SEO
        title={`${contact_page.hero_title || 'Contact Us'} | The Black Lantern Clinic Brisbane`}
        description="Contact The Black Lantern Clinic in Tarragindi, Brisbane. Inquire about youth psychiatry, psychotherapy, consultations, fees, and referral pathways."
        canonicalUrl="https://theblacklanternclinic.com/contact"
      />
      
      {/* Dynamic Full-Width Floating Contact Card Container */}
      <div className="contact-card-wrapper">
        <div className="contact-card-container fade-in">
          
          {/* LEFT SIDE: Info & Background Image */}
          <div className="contact-card__left">
            <img
              src={contact_page.hero_bg || "/contact_hero.webp"}
              alt="Background"
              className="contact-card__bg-img"
            />
            <div className="contact-card__left-overlay" />
            <div className="contact-card__left-content">
              <div className="contact-card__intro contact-card__intro--desktop">
                <h1 className="contact-card__title">
                  {contact_page.card_title}
                </h1>
                <p className="contact-card__subtitle">
                  {contact_page.card_subtitle}
                </p>
              </div>

              <div className="contact-card__info-header contact-card__info-header--mobile">
                <span className="contact-card__detail-label">Clinic Information</span>
              </div>

              <div className="contact-card__details-grid">
                <div className="contact-card__detail-block">
                  <span className="contact-card__detail-label">Hours</span>
                  <p className="contact-card__detail-value">
                    {general.hours}<br />
                    {general.sat_hours}
                  </p>
                </div>
                <div className="contact-card__detail-block">
                  <span className="contact-card__detail-label">Address</span>
                  <p className="contact-card__detail-value">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(general.address || '195 Fingal Street, Tarragindi QLD 4121')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {general.address}
                    </a>
                  </p>
                </div>
                <div className="contact-card__detail-block">
                  <span className="contact-card__detail-label">Contact</span>
                  <p className="contact-card__detail-value">
                    <a href={`tel:${general.phone.replace(/[^\d+]/g, '')}`}>{general.phone}</a>
                  </p>
                </div>
                <div className="contact-card__detail-block">
                  <span className="contact-card__detail-label">Email</span>
                  <p className="contact-card__detail-value">
                    <a href={`mailto:${general.email}`}>
                      {general.email}
                    </a>
                  </p>
                </div>
                <div className="contact-card__detail-block contact-card__detail-block--full">
                  <span className="contact-card__detail-label">Support Channels</span>
                  <p className="contact-card__detail-value">
                    GPs &amp; Medical Referrals<br />
                    Parent &amp; Carer Support<br />
                    Self-Referrals Welcome
                  </p>
                </div>
                <div className="contact-card__detail-block contact-card__detail-block--full">
                  <span className="contact-card__detail-label">Crisis Support</span>
                  <p className="contact-card__detail-value">
                    {general.crisis_text}
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
                  <h2 className="contact-form-success__title">Thank you</h2>
                  <p className="contact-form-success__text">
                    Your message has been received. Our intake coordinators will review your details and contact you within one business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false)
                      setFirstName('')
                      setLastName('')
                      setEmail('')
                      setPhone('')
                      setMessage('')
                      setAcceptedTerms(false)
                    }}
                    className="minimal-submit-btn"
                    style={{
                      marginTop: '1.5rem',
                      width: 'auto',
                      padding: '0.75rem 1.6rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                    }}
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <>
                  <div className="contact-card__intro contact-card__intro--mobile">
                    <h2 className="contact-card__title">
                      {contact_page.card_title}
                    </h2>
                    <p className="contact-card__subtitle">
                      {contact_page.card_subtitle}
                    </p>
                  </div>

                  <form className="contact-minimal-form" onSubmit={handleSubmit}>
                  {errorMessage && (
                    <div className="contact-form-error" role="alert" aria-live="polite">
                      {errorMessage}
                    </div>
                  )}

                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <label htmlFor="contact-first-name" className="contact-form-label">First Name *</label>
                      <input
                        type="text"
                        id="contact-first-name"
                        autoComplete="given-name"
                        placeholder="e.g. Sarah"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="contact-form-group">
                      <label htmlFor="contact-last-name" className="contact-form-label">Last Name *</label>
                      <input
                        type="text"
                        id="contact-last-name"
                        autoComplete="family-name"
                        placeholder="e.g. Jenkins"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="contact-email" className="contact-form-label">Email Address *</label>
                    <input
                      type="email"
                      id="contact-email"
                      autoComplete="email"
                      placeholder="e.g. sarah@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="contact-phone" className="contact-form-label">Phone Number *</label>
                    <input
                      type="tel"
                      id="contact-phone"
                      autoComplete="tel"
                      placeholder="e.g. 0400 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="contact-message" className="contact-form-label">Enquiry Message *</label>
                    <textarea
                      id="contact-message"
                      placeholder="How can our clinic help you?"
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
                      aria-label={submitting ? 'Sending enquiry...' : 'Submit enquiry form'}
                    >
                      {submitting ? 'Sending...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </>
            )}
            </div>
          </div>

        </div>
      </div>

    </main>
  )
}
