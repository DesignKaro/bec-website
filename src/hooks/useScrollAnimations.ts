import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Global scroll-triggered animation observer.
 * Watches all elements with .fade-up, .fade-in, or .img-reveal classes
 * and adds .in-view when they enter the viewport.
 * Re-runs on route change.
 */
export function useScrollAnimations() {
  const location = useLocation()

  useEffect(() => {
    // Small delay to ensure DOM is painted after route change
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view')
              observer.unobserve(entry.target)
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      )

      document
        .querySelectorAll('.fade-up, .fade-in, .img-reveal')
        .forEach((el) => {
          el.classList.remove('in-view')
          observer.observe(el)
        })

      return () => observer.disconnect()
    }, 120)

    return () => clearTimeout(timer)
  }, [location.pathname])
}
