import { Link } from 'react-router-dom'
import { useSiteContent } from '../context/SiteContentContext'

interface ContactCtaBannerProps {
  title?: string
  body?: string
}

export default function ContactCtaBanner({
  title,
  body,
}: ContactCtaBannerProps) {
  const { cta } = useSiteContent()
  const displayTitle = title ?? cta.title
  const displayBody = body ?? cta.body

  return (
    <section className="cta-banner fade-up">
      <div className="cta-banner__inner">
        <h2 className="cta-banner__title">{displayTitle}</h2>
        <p className="cta-banner__body">{displayBody}</p>
        <Link to="/contact" className="hero__pill-btn hero__pill-btn--dark" id="cta-contact-btn">
          {cta.btn_text || 'Get in Touch'}
        </Link>
      </div>
    </section>
  )
}
