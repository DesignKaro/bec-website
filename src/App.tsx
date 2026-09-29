import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import { SiteContentProvider } from './context/SiteContentContext'
import { useScrollAnimations } from './hooks/useScrollAnimations'
import './index.css'
import './App.css'

// Lazy load non-critical routes for code splitting & faster TTI
const About = lazy(() => import('./pages/About'))
const Team = lazy(() => import('./pages/Team'))
const Services = lazy(() => import('./pages/Services'))
const Contact = lazy(() => import('./pages/Contact'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const CancellationPolicy = lazy(() => import('./pages/CancellationPolicy'))
const NotFound = lazy(() => import('./pages/NotFound'))

const PageLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="reveal-img-shimmer" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
  </div>
)

function AppContent() {
  useScrollAnimations()

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollToTop />
      <Navbar />
      <div id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cancellation-policy" element={<CancellationPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <SiteContentProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </SiteContentProvider>
  )
}

