import PageHero from '../components/PageHero'
import SEO from '../components/SEO'

export default function Terms() {
  return (
    <main>
      <SEO
        title="Terms & Conditions | The Black Lantern Clinic"
        description="Terms and conditions governing care, fees, payments, overdue accounts, and legal jurisdiction under Queensland law."
        canonicalUrl="https://theblacklanternclinic.com/terms"
      />
      <PageHero
        title="Terms &amp; Conditions"
        imageSrc="/page-hero-bg.webp"
        showOverlay={true}
      />

      <div className="legal-content">
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '2rem' }}>
          Last updated: July 2026
        </p>

        <h2>Agreement to Terms</h2>
        <p>
          By accessing or using the services of The Black Lantern Clinic ("the Clinic"), you agree
          to be bound by these Terms and Conditions. Please read them carefully before engaging
          with our services.
        </p>

        <h2>Services</h2>
        <h3>Nature of Services</h3>
        <p>
          The Black Lantern Clinic provides mental health assessment, therapy, and support services
          for young people aged 12 to 25, delivered by qualified clinical professionals. Our services
          are provided as private healthcare services and are not a substitute for emergency or acute
          psychiatric care.
        </p>

        <h3>Clinical Decisions</h3>
        <p>
          All clinical decisions are made by qualified health professionals in accordance with
          professional standards and ethical guidelines. Clients and families are encouraged to
          actively participate in their care planning but acknowledge that clinical recommendations
          are based on professional judgement.
        </p>

        <h2>Fees and Payment</h2>
        <h3>Consultation Fees</h3>
        <p>
          Our consultation fees are provided at the time of booking and may be subject to change.
          Current fees are available on request. Medicare rebates may apply to eligible services
          with an appropriate referral.
        </p>

        <h3>Payment</h3>
        <p>
          Payment is required at the time of your appointment unless a prior arrangement has been
          made. We accept credit card, debit card, and bank transfer. Medicare rebates, where
          applicable, are processed automatically where card details are held on file.
        </p>

        <h3>Overdue Accounts</h3>
        <p>
          We understand that circumstances can make payment difficult, and we will always try to work with you. If an account remains unpaid, we will send a written reminder after 14 days. If it is still outstanding after 28 days, our Practice Director will contact you to discuss the balance and, where needed, arrange a payment plan.
        </p>
        <p>
          The Black Lantern Clinic is not an emergency or crisis service. If you need urgent or emergency support, we will always direct you to the appropriate services, regardless of your account status. For non-urgent appointments, we may pause further bookings until the account is resolved or a payment arrangement is in place. In the rare event that an account remains unresolved despite these steps, it may be referred to an external collection service, but only with the approval of both our Practice Director and Clinical Director, and after we have made reasonable efforts to reach a workable arrangement with you.
        </p>

        <h2>Confidentiality</h2>
        <p>
          All information shared within the therapeutic relationship is held in strict confidence
          in accordance with our Privacy Policy and the applicable professional codes of conduct.
          Limits to confidentiality exist where there is a risk of serious harm to the client or others,
          or where disclosure is required by law.
        </p>

        <h2>Client Responsibilities</h2>
        <p>Clients and their representatives are expected to:</p>
        <ul>
          <li>Provide accurate and complete information relevant to their care</li>
          <li>Attend appointments at the agreed time or provide adequate notice of cancellation</li>
          <li>Treat all clinic staff with courtesy and respect</li>
          <li>Comply with the agreed treatment plan and communicate openly with their clinician</li>
          <li>Advise the Clinic of any changes in contact details or health circumstances</li>
        </ul>

        <h2>Limitation of Liability</h2>
        <p>
          To the extent permitted by law, The Black Lantern Clinic is not liable for any loss or
          damage arising from reliance on information provided through our website, or from
          disruptions to service outside our reasonable control. Nothing in these Terms excludes,
          restricts or modifies any consumer guarantee, right or remedy you have under the Australian
          Consumer Law or any other law that cannot lawfully be excluded.
        </p>

        <h2>Amendments</h2>
        <p>
          We reserve the right to update these Terms and Conditions from time to time. Continued
          use of our services following notification of changes constitutes acceptance of the
          updated terms.
        </p>

        <h2>Governing Law</h2>
        <p>
          These Terms are governed by the laws of Queensland, Australia. Any disputes arising in connection with these Terms or our services will be subject to the exclusive jurisdiction of the courts of Queensland.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these Terms may be directed to{' '}
          <a href="mailto:admin@theblacklanternclinic.com" style={{ color: 'var(--color-accent)' }}>
            admin@theblacklanternclinic.com
          </a>.
        </p>
      </div>
    </main>
  )
}
