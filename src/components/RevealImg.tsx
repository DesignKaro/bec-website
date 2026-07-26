import { useEffect, useRef, useState } from 'react'

interface RevealImgProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Wraps an <img> with a two-phase reveal:
 * 1. While image is loading → glass blur overlay + shimmer placeholder
 * 2. When image loads AND enters viewport → smooth blur-to-clear transition
 */
export default function RevealImg({ src, alt, className = '', style }: RevealImgProps) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Intersection Observer — wait for element to enter viewport
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const revealed = loaded && inView

  return (
    <div ref={wrapRef} className="reveal-img-wrap" style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
      {/* Glass shimmer placeholder — visible while loading */}
      {!loaded && (
        <div className="reveal-img-shimmer" aria-hidden="true" />
      )}

      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setLoaded(true)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: revealed ? 1 : 0,
          filter: revealed ? 'blur(0px) saturate(1) brightness(1)' : 'blur(18px) saturate(0.5) brightness(0.9)',
          transform: revealed ? 'scale(1)' : 'scale(1.04)',
          transition: 'opacity 1.1s cubic-bezier(0.25,1,0.5,1), filter 1.1s cubic-bezier(0.25,1,0.5,1), transform 1.1s cubic-bezier(0.25,1,0.5,1)',
          willChange: 'filter, opacity, transform',
        }}
      />
    </div>
  )
}
