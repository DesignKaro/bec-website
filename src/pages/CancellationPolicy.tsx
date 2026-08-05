import PageHero from '../components/PageHero'
import SEO from '../components/SEO'

export default function CancellationPolicy() {
  return (
    <main>
      <SEO
        title="Cancellation Policy | The Black Lantern Clinic"
        description="Clear guide to appointment cancellations, 24-hour notice policy, Medicare fee separation, and safety-first follow-up procedures."
        canonicalUrl="https://theblacklanternclinic.com/cancellation-policy"
      />
      <PageHero
        title="Cancellation Policy"
        imageSrc="/page-hero-bg.webp"
        showOverlay={true}
      />

      <div className="legal-content">
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '2rem' }}>
          Last updated: July 2026
        </p>

        <h2>Our Approach to Cancellations</h2>
        <p>
          We understand that life can be unpredictable, and that sometimes plans need to change.
          We ask that clients and families contact us as early as possible when an appointment
          cannot go ahead, so that we can offer that time to another person waiting for care.
        </p>

        <h2>Notice Requirement</h2>
        <p>
          We require a minimum of <strong>24 hours' notice</strong> to cancel or reschedule any
          appointment. This allows us to offer the appointment time to another client on our
          waiting list.
        </p>

        <h2>Cancellation Fee</h2>
        <p>
          A cancellation fee applies in the following circumstances:
        </p>
        <ul>
          <li>Cancellation with <strong>less than 24 hours' notice</strong></li>
          <li><strong>Non-attendance</strong> (no-show) without prior contact</li>
        </ul>
        <p>
          The cancellation fee is disclosed to you at the time of booking and is listed in our
          fee schedule, which is provided to you in writing and signed or electronically
          acknowledged by you prior to your first appointment.
        </p>

        <h2>Medicare & the Cancellation Fee</h2>
        <p>
          The cancellation fee is entirely separate from any Medicare claim. Medicare benefits
          are <strong>never</strong> claimed for non-attendance or late cancellation — the
          cancellation fee applies solely when less than 24 hours' notice is given or when a
          no-show occurs, and is not billed as a Medicare service.
        </p>

        <h2>Exceptions</h2>
        <p>
          We understand that genuine emergencies and sudden illness do occur. In these
          circumstances, please contact us as soon as possible. Cancellation fees may be waived
          at our discretion where exceptional circumstances are communicated promptly.
        </p>

        <h2>Repeated Cancellations</h2>
        <p>
          Where a client repeatedly cancels or does not attend scheduled appointments, the Clinic may review their place on the waitlist or active caseload. Before any decision to discharge, we follow our internal follow-up process. Which includes checking on the young person's safety and wellbeing, and we will always seek to discuss the situation with the client or their family first.
        </p>

        <h2>How to Cancel or Reschedule</h2>
        <p>
          To cancel or reschedule an appointment, please contact us by:
        </p>
        <ul>
          <li>
            Phone: <a href="tel:+61418542638" style={{ color: 'var(--color-accent)' }}>0418 542 638</a>
          </li>
          <li>
            Email: <a href="mailto:admin@theblacklanternclinic.com" style={{ color: 'var(--color-accent)' }}>admin@theblacklanternclinic.com</a>
          </li>
        </ul>
        <p>
          Cancellations by email are only confirmed once you receive a written acknowledgement
          from our team.
        </p>

        <h2>Clinician Cancellations</h2>
        <p>
          In the rare event that your clinician is unable to attend a scheduled appointment, we
          will notify you as soon as possible and offer an alternative time at no additional cost.
          No cancellation fee will apply in these circumstances.
        </p>

        <h2>Questions</h2>
        <p>
          If you have any questions about this policy, please speak with our reception team on{' '}
          <a href="tel:+61418542638" style={{ color: 'var(--color-accent)' }}>0418 542 638</a> or
          email us at{' '}
          <a href="mailto:admin@theblacklanternclinic.com" style={{ color: 'var(--color-accent)' }}>admin@theblacklanternclinic.com</a>.
        </p>
      </div>
    </main>
  )
}
