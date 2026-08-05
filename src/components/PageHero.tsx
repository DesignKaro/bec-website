
import { useSiteContent } from '../context/SiteContentContext'

interface PageHeroProps {
  eyebrow?: string
  title: string
  imageSrc?: string
  imageAlt?: string
  showOverlay?: boolean
}

export default function PageHero({ eyebrow, title, imageSrc, imageAlt = 'Hero background', showOverlay = true }: PageHeroProps) {
  const { heroes } = useSiteContent()
  const activeImageSrc = imageSrc || heroes.subpage_bg || '/page-hero-bg.webp'

  return (
    <div className="page-hero">
      {/* Background Image */}
      <img
        src={activeImageSrc}
        alt={imageAlt}
        className="page-hero__bg-img"
      />

      {/* Overlay */}
      {showOverlay && <div className="page-hero__overlay" />}

      {/* Content */}
      <div className="page-hero__content">
        {eyebrow && (
          <p className="eyebrow eyebrow--alt page-hero__eyebrow">{eyebrow}</p>
        )}
        <h1 className="page-hero__title">{title}</h1>
      </div>
    </div>
  )
}
