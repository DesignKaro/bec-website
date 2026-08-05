import PageHero from '../components/PageHero'
import SEO from '../components/SEO'

export default function Privacy() {
  return (
    <main>
      <SEO
        title="Privacy Policy | The Black Lantern Clinic"
        description="Read how The Black Lantern Clinic handles personal health information, confidentiality, and youth privacy rights in Queensland."
        canonicalUrl="https://theblacklanternclinic.com/privacy"
      />
      <PageHero
        title="Privacy Policy"
        imageSrc="/page-hero-bg.webp"
        showOverlay={true}
      />

      <div className="legal-content">
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '2rem' }}>
          Last updated: July 2026
        </p>

        <h2>Introduction</h2>
        <p>
          The Black Lantern Clinic ("we", "our", "us") is committed to protecting the privacy and
          confidentiality of our clients, their families, and all individuals who interact with our
          services. This Privacy Policy explains how we collect, use, store, and disclose personal
          information in accordance with the Australian Privacy Act 1988 (Cth) and the Australian
          Privacy Principles (APPs).
        </p>

        <h2>What Information We Collect</h2>
        <h3>Personal Information</h3>
        <p>We may collect the following personal information:</p>
        <ul>
          <li>Full name, date of birth, and contact details</li>
          <li>Medicare and health insurance details</li>
          <li>Referral information from GPs and other health professionals</li>
          <li>Health and medical history relevant to your care</li>
          <li>Emergency contact details</li>
          <li>Communication records including emails and form submissions</li>
        </ul>

        <h3>Sensitive Information</h3>
        <p>
          As a mental health clinic, we collect sensitive health information. This includes clinical
          notes, assessment results, diagnosis information, and treatment records. We collect this
          information with your consent and only where it is necessary for the provision of care, or
          where collection is required or authorised by law.
        </p>

        <h2>How We Use Your Information</h2>
        <p>We use personal information to:</p>
        <ul>
          <li>Provide and manage your mental health care</li>
          <li>Coordinate care with other treating health professionals</li>
          <li>Process Medicare and insurance claims</li>
          <li>Send appointment reminders and administrative communications</li>
          <li>Comply with our legal and regulatory obligations</li>
          <li>Improve the quality of our services</li>
        </ul>

        <h2>Disclosure of Information</h2>
        <p>
          We will not disclose your personal information to third parties without your consent,
          except where required or authorised by law. We may share information with:
        </p>
        <ul>
          <li>Other treating health professionals with your consent, or where permitted under the Privacy Act 1988 (Cth)</li>
          <li>Child protection and child safety authorities, where we are required to report under Queensland child protection law</li>
          <li>Medicare Australia and health insurers for billing purposes</li>
          <li>Regulatory bodies where required by law</li>
          <li>Emergency services where there is serious risk to life</li>
        </ul>

        <h2>Storage and Security</h2>
        <p>
          All personal and health information is stored securely using industry-standard encryption
          and access controls. Clinical records are maintained for a minimum of seven years from the
          date of last contact, or until a child reaches the age of 25, whichever is later.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information held by us</li>
          <li>Request correction of inaccurate information</li>
          <li>Lodge a complaint about how your information has been handled</li>
          <li>Withdraw consent at any time, subject to legal requirements</li>
        </ul>

        <h3>Young People and Their Families</h3>
        <p>
          Where a client is under 18, access to their information by a parent or carer is handled in line with our Parent &amp; Carer Involvement and Youth Confidentiality Policy. This means we take account of a young person's maturity and their right to confidentiality, alongside any safety considerations, when deciding what information can be shared and with whom.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions or concerns about your privacy, please contact us at{' '}
          <a href="mailto:admin@theblacklanternclinic.com" style={{ color: 'var(--color-accent)' }}>
            admin@theblacklanternclinic.com
          </a>{' '}
          or on <a href="tel:+61418542638" style={{ color: 'var(--color-accent)' }}>0418 542 638</a>.
        </p>
        <p>
          You may also lodge a complaint with the Office of the Australian Information Commissioner
          (OAIC) at <a href="https://www.oaic.gov.au" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>www.oaic.gov.au</a>.
        </p>
      </div>
    </main>
  )
}
