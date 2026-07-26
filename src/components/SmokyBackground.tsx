import { useEffect, useRef } from 'react'

interface SmokyBackgroundProps {
  opacity?: number
  showEmbers?: boolean
  className?: string
}

export default function SmokyBackground({
  opacity = 0.85,
  showEmbers = true,
  className = '',
}: SmokyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = 0
    let height = 0

    // Check prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Mouse tracking for subtle interactive smoke wind
    let mouseX = 0.5
    let mouseY = 0.5
    let targetMouseX = 0.5
    let targetMouseY = 0.5

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        targetMouseX = (e.clientX - rect.left) / rect.width
        targetMouseY = (e.clientY - rect.top) / rect.height
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
    }

    // Pre-render smoke particle texture offscreen for performance
    const createSmokeParticleTexture = () => {
      const pCanvas = document.createElement('canvas')
      pCanvas.width = 256
      pCanvas.height = 256
      const pCtx = pCanvas.getContext('2d')
      if (!pCtx) return pCanvas

      const grad = pCtx.createRadialGradient(128, 128, 0, 128, 128, 128)
      grad.addColorStop(0, 'rgba(235, 230, 220, 0.45)')
      grad.addColorStop(0.35, 'rgba(160, 155, 150, 0.22)')
      grad.addColorStop(0.7, 'rgba(60, 65, 75, 0.08)')
      grad.addColorStop(1, 'rgba(15, 18, 25, 0)')

      pCtx.fillStyle = grad
      pCtx.beginPath()
      pCtx.arc(128, 128, 128, 0, Math.PI * 2)
      pCtx.fill()
      return pCanvas
    }

    const smokeTexture = createSmokeParticleTexture()

    // Smoke Particle Class
    interface SmokeParticle {
      x: number
      y: number
      size: number
      vx: number
      vy: number
      rotation: number
      vRot: number
      alpha: number
      targetAlpha: number
      life: number
      maxLife: number
      growth: number
    }

    interface EmberParticle {
      x: number
      y: number
      size: number
      vx: number
      vy: number
      alpha: number
      maxAlpha: number
      color: string
      pulseSpeed: number
      pulsePhase: number
    }

    const smokeParticles: SmokeParticle[] = []
    const emberParticles: EmberParticle[] = []

    const resize = () => {
      if (!container || !canvas) return
      const rect = container.getBoundingClientRect()
      width = canvas.width = rect.width || window.innerWidth
      height = canvas.height = rect.height || window.innerHeight

      // Re-init particles
      initParticles()
    }

    const initParticles = () => {
      smokeParticles.length = 0
      emberParticles.length = 0

      const numSmoke = Math.min(Math.floor((width * height) / 22000), 40)
      for (let i = 0; i < numSmoke; i++) {
        smokeParticles.push(createSmokeParticle(true))
      }

      if (showEmbers) {
        const numEmbers = Math.min(Math.floor((width * height) / 35000), 25)
        for (let i = 0; i < numEmbers; i++) {
          emberParticles.push(createEmberParticle(true))
        }
      }
    }

    const createSmokeParticle = (randomizeLife = false): SmokeParticle => {
      const maxLife = 300 + Math.random() * 400
      const currentLife = randomizeLife ? Math.random() * maxLife : 0
      return {
        x: Math.random() * (width + 200) - 100,
        y: Math.random() * (height + 200) - 100,
        size: 160 + Math.random() * 280,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.15 - Math.random() * 0.25,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.0015,
        alpha: 0,
        targetAlpha: 0.08 + Math.random() * 0.2,
        life: currentLife,
        maxLife,
        growth: 0.12 + Math.random() * 0.2,
      }
    }

    const createEmberParticle = (randomizeY = false): EmberParticle => {
      const amberColors = ['#f5d393', '#e0b574', '#b8956a', '#ffffff', '#ffd8a8']
      return {
        x: Math.random() * width,
        y: randomizeY ? Math.random() * height : height + 20,
        size: 1 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.6,
        alpha: 0.1 + Math.random() * 0.7,
        maxAlpha: 0.4 + Math.random() * 0.5,
        color: amberColors[Math.floor(Math.random() * amberColors.length)],
        pulseSpeed: 0.02 + Math.random() * 0.04,
        pulsePhase: Math.random() * Math.PI * 2,
      }
    }

    const render = () => {
      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      ctx.clearRect(0, 0, width, height)

      // Draw subtle dark gradient background tint
      const baseGrad = ctx.createLinearGradient(0, 0, 0, height)
      baseGrad.addColorStop(0, 'rgba(10, 12, 18, 0.4)')
      baseGrad.addColorStop(0.5, 'rgba(18, 21, 30, 0.25)')
      baseGrad.addColorStop(1, 'rgba(10, 12, 18, 0.6)')
      ctx.fillStyle = baseGrad
      ctx.fillRect(0, 0, width, height)

      // Mouse influence wind
      const windX = (mouseX - 0.5) * 0.4
      const windY = (mouseY - 0.5) * 0.2

      // Draw Smoke Particles
      for (let i = 0; i < smokeParticles.length; i++) {
        const p = smokeParticles[i]
        p.life++
        p.size += p.growth * 0.2
        p.rotation += p.vRot

        p.x += p.vx + windX
        p.y += p.vy + windY

        // Calculate fade in and out based on life cycle
        const lifeRatio = p.life / p.maxLife
        if (lifeRatio < 0.2) {
          p.alpha = (lifeRatio / 0.2) * p.targetAlpha
        } else if (lifeRatio > 0.7) {
          p.alpha = ((1 - lifeRatio) / 0.3) * p.targetAlpha
        } else {
          p.alpha = p.targetAlpha
        }

        if (p.life >= p.maxLife || p.y < -p.size || p.x < -p.size || p.x > width + p.size) {
          smokeParticles[i] = createSmokeParticle(false)
          continue
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.alpha * opacity
        ctx.drawImage(smokeTexture, -p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()
      }

      // Draw Ember Particles
      if (showEmbers) {
        for (let i = 0; i < emberParticles.length; i++) {
          const e = emberParticles[i]
          e.x += e.vx + windX * 0.5
          e.y += e.vy
          e.pulsePhase += e.pulseSpeed

          const currentAlpha = Math.max(
            0,
            e.alpha + Math.sin(e.pulsePhase) * 0.25
          )

          if (e.y < -10 || e.x < -10 || e.x > width + 10) {
            emberParticles[i] = createEmberParticle(false)
            continue
          }

          ctx.save()
          ctx.beginPath()
          ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2)
          ctx.fillStyle = e.color
          ctx.globalAlpha = currentAlpha * opacity
          ctx.shadowBlur = 8
          ctx.shadowColor = e.color
          ctx.fill()
          ctx.restore()
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    window.addEventListener('resize', resize)
    resize()

    if (prefersReducedMotion) {
      render() // Single frame for reduced motion
    } else {
      animationFrameId = requestAnimationFrame(render)
    }

    return () => {
      window.removeEventListener('resize', resize)
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
      }
      cancelAnimationFrame(animationFrameId)
    }
  }, [opacity, showEmbers])

  return (
    <div
      ref={containerRef}
      className={`smoky-bg-wrapper ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="smoky-bg-canvas" />
      <div className="smoky-bg-fog-layer smoky-bg-fog-1" />
      <div className="smoky-bg-fog-layer smoky-bg-fog-2" />
      <div className="smoky-bg-lantern-glow" />
    </div>
  )
}
