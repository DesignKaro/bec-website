import { Flame, Compass, Leaf, Users, Microscope, Repeat2 } from 'lucide-react'
import PageHero from '../components/PageHero'
import ContactCtaBanner from '../components/ContactCtaBanner'
import RevealImg from '../components/RevealImg'
import SEO from '../components/SEO'
import { useSiteContent } from '../context/SiteContentContext'

const getValueIcon = (title: string, index: number) => {
  const t = (title || '').toLowerCase()
  if (t.includes('evidence') || t.includes('research')) return <Microscope size={28} strokeWidth={1.25} />
  if (t.includes('person') || t.includes('centre')) return <Flame size={28} strokeWidth={1.25} />
  if (t.includes('trauma') || t.includes('safe')) return <Leaf size={28} strokeWidth={1.25} />
  if (t.includes('development') || t.includes('calibrat')) return <Compass size={28} strokeWidth={1.25} />
  if (t.includes('collab') || t.includes('team')) return <Users size={28} strokeWidth={1.25} />
  if (t.includes('continuity') || t.includes('revolv')) return <Repeat2 size={28} strokeWidth={1.25} />
  switch (index % 6) {
    case 0: return <Microscope size={28} strokeWidth={1.25} />
    case 1: return <Flame size={28} strokeWidth={1.25} />
    case 2: return <Leaf size={28} strokeWidth={1.25} />
    case 3: return <Compass size={28} strokeWidth={1.25} />
    case 4: return <Users size={28} strokeWidth={1.25} />
    default: return <Repeat2 size={28} strokeWidth={1.25} />
  }
}

export default function About() {
  const { about } = useSiteContent()

  return (
    <main>
      <SEO
        title="Who We Are | The Black Lantern Clinic Brisbane"
        description="Learn about our Brisbane youth mental health clinic's philosophy, evidence-based values, trauma-informed care, and person-centred approach."
        canonicalUrl="https://theblacklanternclinic.com/about"
      />
      <PageHero
        title={about.hero_title}
        imageSrc={about.hero_bg || '/about_hero.webp'}
        showOverlay={true}
      />

      {/* ── Clinic Story ── */}
      <section className="about-story">
        <div className="about-story__image">
          <div className="about-story__image-inner">
            <RevealImg src={about.story_img || '/about_story.webp'} alt="The Black Lantern Clinic therapy room" />
          </div>
        </div>
        <div className="about-story__content fade-up">
          <p className="eyebrow about-story__eyebrow">{about.story_eyebrow}</p>
          <h2 className="about-story__title">
            {about.story_title}
          </h2>
          <div className="about-story__body">
            <p>{about.story_p1}</p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="about-values-section">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="fade-up">
          <p className="eyebrow" style={{ marginBottom: '0.8rem' }}>{about.values_eyebrow}</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300 }}>
            {about.values_title}
          </h2>
        </div>
        <div className="values-grid">
          {(about.values_list || []).map((v, idx) => (
            <div className={`value-card fade-up stagger-${(idx % 3) + 1}`} key={v.title || idx}>
              <div className="value-card__icon">{getValueIcon(v.title, idx)}</div>
              <h3 className="value-card__title">{v.title}</h3>
              <p className="value-card__desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Approach ── */}
      <section>
        <div className="approach-row">
          <div className="approach-row__image">
            <div className="approach-row__image-inner">
              <RevealImg src={about.app1_img || '/about_approach_play.webp'} alt="Welcoming clinic environment" />
            </div>
          </div>
          <div className="approach-row__content fade-up">
            <p className="approach-row__num">{about.app1_num}</p>
            <h2 className="approach-row__title">{about.app1_title}</h2>
            <p className="approach-row__body">{about.app1_body}</p>
          </div>
        </div>

        <div className="approach-row approach-row--reversed">
          <div className="approach-row__image">
            <div className="approach-row__image-inner">
              <RevealImg src={about.app2_img || '/about_approach_meeting.webp'} alt="Collaborative care meeting" />
            </div>
          </div>
          <div className="approach-row__content fade-up">
            <p className="approach-row__num">{about.app2_num}</p>
            <h2 className="approach-row__title">{about.app2_title}</h2>
            <p className="approach-row__body">{about.app2_body}</p>
          </div>
        </div>
      </section>

      <ContactCtaBanner
        title={about.cta_title}
        body={about.cta_body}
      />
    </main>
  )
}
