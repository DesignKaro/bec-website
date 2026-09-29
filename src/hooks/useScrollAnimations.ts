import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Global scroll-triggered animation observer.
 * Watches all elements with .fade-up, .fade-in, or .img-reveal classes
 * and adds .in-view when they enter the viewport.
 * Continuously handles dynamic DOM updates and browser reloads.
 */
export function useScrollAnimations() {
  const location = useLocation()

  useEffect(() => {
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
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px',
      }
    )

    const observeElements = () => {
      document
        .querySelectorAll('.fade-up, .fade-in, .img-reveal')
        .forEach((el) => {
          if (!el.classList.contains('in-view')) {
            observer.observe(el)
          }
        })
    }

    // Run at multiple ticks to catch async API renders
    observeElements()
    const t1 = setTimeout(observeElements, 50)
    const t2 = setTimeout(observeElements, 250)
    const t3 = setTimeout(observeElements, 600)

    // MutationObserver to watch for dynamic DOM insertions (e.g. WP REST API content loading)
    const mutationObserver = new MutationObserver(() => {
      observeElements()
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [location.pathname])
}
