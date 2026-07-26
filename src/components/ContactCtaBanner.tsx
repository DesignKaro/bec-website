import { Link } from 'react-router-dom'

interface ContactCtaBannerProps {
  title?: string
  body?: string
}

export default function ContactCtaBanner({
  title = 'Ready to take the first step?',
  body = 'We understand that reaching out can feel difficult. Our team is here to listen, support, and guide you — at every stage of the journey.',
}: ContactCtaBannerProps) {
  return (
    <section className="cta-banner fade-up">
      <div className="cta-banner__inner">
        <h2 className="cta-banner__title">{title}</h2>
        <p className="cta-banner__body">{body}</p>
        <Link to="/contact" className="hero__pill-btn hero__pill-btn--dark" id="cta-contact-btn">
          Get in Touch
        </Link>
      </div>
    </section>
  )
}
