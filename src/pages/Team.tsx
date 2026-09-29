import PageHero from '../components/PageHero'
import ContactCtaBanner from '../components/ContactCtaBanner'
import RevealImg from '../components/RevealImg'
import SEO from '../components/SEO'
import { useSiteContent } from '../context/SiteContentContext'

export default function Team() {
  const { team_page } = useSiteContent()

  const members = [team_page.member1, team_page.member2].filter(
    (m): m is NonNullable<typeof m> => Boolean(m && m.name)
  )

  return (
    <main>
      <SEO
        title={`${team_page.hero_title || 'Meet Our Team'} | The Black Lantern Clinic Brisbane`}
        description="Meet Dr. Joel Adams-Bedford (Child & Adolescent Psychiatrist) and Rebecca Willis (Practice Director & Psychotherapist) at The Black Lantern Clinic in Brisbane."
        canonicalUrl="https://theblacklanternclinic.com/team"
      />
      <PageHero
        title={team_page.hero_title}
        imageSrc={team_page.hero_bg}
        showOverlay={true}
      />

      {/* ── Intro ── */}
      {team_page.intro_title && (
        <div className="team-intro fade-up">
          <h2 className="team-intro__title">{team_page.intro_title}</h2>
          {team_page.intro_body && (
            <p className="team-intro__body">{team_page.intro_body}</p>
          )}
        </div>
      )}

      {/* ── Main Team ── */}
      <section>
        {members.map((member, index) => {
          const photoSrc = member.photo && member.photo.trim() !== ''
            ? member.photo
            : (member.name?.toLowerCase().includes('rebecca') ? '/team_rebecca.webp' : '/team_joel.webp')

          const isReversed = member.reversed !== undefined ? member.reversed : (index % 2 !== 0)

          const rawBio: unknown = member.bio
          const bioParagraphs: string[] = Array.isArray(rawBio)
            ? rawBio.flatMap((b: unknown) => (typeof b === 'string' ? b.split('\n').map((s: string) => s.trim()).filter(Boolean) : []))
            : (typeof rawBio === 'string' ? rawBio.split('\n').map((s: string) => s.trim()).filter(Boolean) : [])

          return (
            <div
              key={member.name || index}
              className={`team-member-row${isReversed ? ' team-member-row--reversed' : ''}`}
            >
              <div className="team-member__image">
                <div className="team-member__image-inner">
                  <RevealImg src={photoSrc} alt={member.name || 'Team member photo'} />
                </div>
              </div>
              <div className="team-member__content fade-up">
                <h2 className="team-member__name">{member.name}</h2>
                <p className="team-member__role">{member.role}</p>
                {member.creds && <p className="team-member__creds">{member.creds}</p>}
                <div className="team-member__bio">
                  {bioParagraphs.length > 0 ? (
                    bioParagraphs.map((p, i) => <p key={i}>{p}</p>)
                  ) : (
                    <p>{typeof member.bio === 'string' ? member.bio : ''}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {/* ── Admin & Support note ── */}
      {team_page.support_title && (
        <section className="team-support-section">
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }} className="fade-up">
            {team_page.support_eyebrow && (
              <p className="eyebrow" style={{ marginBottom: '0.8rem' }}>
                {team_page.support_eyebrow}
              </p>
            )}
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 300, marginBottom: '1.4rem' }}>
              {team_page.support_title}
            </h2>
            {team_page.support_body && (
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text)', lineHeight: 1.9 }}>
                {team_page.support_body}
              </p>
            )}
          </div>
        </section>
      )}

      <ContactCtaBanner
        title={team_page.cta_title}
        body={team_page.cta_body}
      />
    </main>
  )
}

