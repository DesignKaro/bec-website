import PageHero from '../components/PageHero'
import ContactCtaBanner from '../components/ContactCtaBanner'
import RevealImg from '../components/RevealImg'
import SEO from '../components/SEO'

const MAIN_TEAM = [
  {
    name: 'Dr. Joel Adams-Bedford',
    role: 'Clinical Director & Child and Adolescent Psychiatrist',
    creds: 'FRANZCP | Sub-specialty certificate in child and adolescent psychiatry',
    photo: '/team_joel.webp',
    bio: [
      "Dr Joel Adams-Bedford is a child and adolescent psychiatrist and a co-founder of The Black Lantern Clinic. He holds a Fellowship of the Royal Australian and New Zealand College of Psychiatrists (FRANZCP) with subspecialty training in child and adolescent psychiatry and brings over a decade of clinical experience across some of Australia's most demanding mental health environments. These include consultant roles in the adolescent inpatient unit and acute response team at Queensland Children's Hospital, and earlier work in correctional and youth detention settings in NSW and the ACT.",
      "That breadth of experience shapes the way he works. Dr Joel has a particular interest in young people who have fallen through the cracks — young people who have been hard to reach, hard to read, or who have never quite had a satisfying explanation for why things feel so difficult. He approaches every assessment without assumptions and is willing to sit with complexity until he gets the picture right.",
      "His clinical interests include neurodevelopmental and mood disorders in adolescents. He is committed to young people having a genuine voice in their own care, as a core part of good clinical practice.",
      "At The Black Lantern Clinic, Dr Joel offers comprehensive psychiatric assessments, structured interventions and ongoing psychiatric management.",
    ],
    reversed: false,
  },
  {
    name: 'Rebecca Willis',
    role: 'Practice Director & Psychotherapist',
    creds: 'BSW | Currently completing Graduate Diploma of Psychology',
    photo: '/team_rebecca.webp',
    bio: [
      "Rebecca is a co-founder of The Black Lantern Clinic and brings over five years of experience working in mental health across Queensland Health, the Department of Education, and Youth Justice. This gives her a broad understanding of the systems young people and families navigate, and the gaps that a clinic like this one is designed to fill.",
      "Alongside her Bachelor of Social Work, Rebecca has undertaken extensive professional development in evidence-based therapies, including EMDR, and is currently completing her Graduate Diploma of Psychology.",
      "In her role as Practice Director, Rebecca oversees the day-to-day operations of the clinic, ensuring that every client's experience — from the very first enquiry through to the end of their care — is seamless, warm, and well supported. While Rebecca's focus is on the administrative and operational running of the clinic, her clinical background means she brings genuine insight and care to every interaction.",
      "Rebecca is committed to equity of access and is always available to assist with questions about fees, billing, referrals, or navigating services. If you are unsure about anything, she is your first point of contact.",
    ],
    reversed: true,
  },
]

export default function Team() {
  return (
    <main>
      <SEO
        title="Meet Our Team | The Black Lantern Clinic Brisbane"
        description="Meet Dr. Joel Adams-Bedford (Child & Adolescent Psychiatrist) and Rebecca Willis (Psychotherapist) — dedicated Brisbane youth mental health specialists."
        canonicalUrl="https://theblacklanternclinic.com/team"
      />
      <PageHero
        title="The people behind the clinic"
        imageSrc="/policy_hero.webp"
        showOverlay={false}
      />

      {/* ── Intro ── */}
      <div className="team-intro fade-up">
        <h2 className="team-intro__title">
          A small, dedicated team
        </h2>
        <p className="team-intro__body">
          We're a small clinic by design. That means you'll work with clinicians who know you —
          the same people across your care, not a rotation of unfamiliar faces. Everyone here
          is committed to the same thing: getting it right for each young person we see.
        </p>
      </div>

      {/* ── Main Team ── */}
      <section>
        {MAIN_TEAM.map((member) => (
          <div
            key={member.name}
            className={`team-member-row${member.reversed ? ' team-member-row--reversed' : ''}`}
          >
            <div className="team-member__image">
              <div className="team-member__image-inner">
                <RevealImg src={member.photo} alt={member.name} />
              </div>
            </div>
            <div className="team-member__content fade-up">
              <h2 className="team-member__name">{member.name}</h2>
              <p className="team-member__role">{member.role}</p>
              <p className="team-member__creds">{member.creds}</p>
              <div className="team-member__bio">
                {member.bio.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Admin & Support note ── */}
      <section className="team-support-section">
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }} className="fade-up">
          <p className="eyebrow" style={{ marginBottom: '0.8rem' }}>Behind the scenes</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 300, marginBottom: '1.4rem' }}>
            Our admin team
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text)', lineHeight: 1.9 }}>
            Behind our clinicians is a small, warm admin team. They're your first point of contact for
            questions about referrals, fees, bookings, and anything else. If you're not sure where to
            start, just ask — they'll point you in the right direction.
          </p>
        </div>
      </section>

      <ContactCtaBanner
        title="We'd love to hear from you"
        body="Our team is here to answer your questions and help you find the right pathway. Don't hesitate to get in touch — there's no wrong question."
      />
    </main>
  )
}
