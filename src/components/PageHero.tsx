import { useEffect, useRef } from 'react'

interface PageHeroProps {
  eyebrow?: string
  title: string
  imageSrc?: string
  imageAlt?: string
  showOverlay?: boolean
}

export default function PageHero({ eyebrow, title, showOverlay = true }: PageHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.4
    }
  }, [])

  return (
    <div className="page-hero">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="page-hero__video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/hero-bg.webm" type="video/webm" />
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

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
