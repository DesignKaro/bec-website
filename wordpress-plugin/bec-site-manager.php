<?php
/**
 * Plugin Name: BEC Site Manager (Headless CMS for The Black Lantern Clinic)
 * Description: Complete Tabbed Headless CMS plugin with 6 About Values Cards, Member 1 & 2 direct options, Service 1 & 2 options, Single-Form Preservation, Pre-filled Default Data, Native WordPress Media Library Uploaders, Native WYSIWYG Visual Text Editors, and Realtime Edge Cache Purge Bridge.
 * Version: 13.0.0
 * Author: DesignKaro
 * License: GPLv2 or later
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Helper function to retrieve options with automatic fallback
 */
function bec_get_option($option_name, $default = '') {
    $val = get_option($option_name);
    if ($val === false || $val === '') {
        return $default;
    }
    return $val;
}

class BEC_Site_Manager {
    public function __construct() {
        add_action('init', array($this, 'register_custom_post_types'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_init', array($this, 'handle_prefill_action'));
        add_action('admin_init', array($this, 'handle_purge_action'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        
        // Automatic Cache Purge hooks on settings or custom post changes
        add_action('updated_option', array($this, 'on_option_update'), 10, 3);
        add_action('added_option', array($this, 'on_option_update'), 10, 2);
        add_action('save_post', array($this, 'on_post_update'), 10, 3);
        add_action('deleted_post', array($this, 'on_post_update'), 10, 2);
        
        // Enable CORS & Zero-Cache Headers for REST API (bypasses LiteSpeed & Hostinger CDN edge)
        add_action('init', function() {
            if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
                if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/wp-json/bec/v1/') !== false) {
                    header('Access-Control-Allow-Origin: *');
                    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
                    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Wpnonce, X-Requested-With');
                    status_header(200);
                    exit;
                }
            }
        });

        add_action('rest_api_init', function() {
            remove_filter('rest_pre_serve_json', 'rest_send_cors_headers');
            add_filter('rest_pre_serve_json', function($value) {
                header('Access-Control-Allow-Origin: *');
                header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
                header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Wpnonce, X-Requested-With');
                
                // Enforce zero-cache headers to kill LiteSpeed & Hostinger CDN edge caching
                header_remove('Cache-Control');
                header_remove('Expires');
                header_remove('Pragma');
                header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0, s-maxage=0, post-check=0, pre-check=0');
                header('Pragma: no-cache');
                header('Expires: 0');
                header('X-LiteSpeed-Cache-Control: no-cache, no-store');
                header('X-LiteSpeed-Purge: *');
                return $value;
            }, 15);
        }, 15);
    }

    /**
     * Complete Default Legal Policy Texts
     */
    public static function get_default_privacy_html() {
        return '<h2>Introduction</h2>' .
               '<p>The Black Lantern Clinic ("we", "our", "us") is committed to protecting the privacy and confidentiality of our clients, their families, and all individuals who interact with our services. This Privacy Policy explains how we collect, use, store, and disclose personal information in accordance with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).</p>' .
               '<h2>What Information We Collect</h2>' .
               '<h3>Personal Information</h3>' .
               '<p>We may collect the following personal information:</p>' .
               '<ul>' .
               '<li>Full name, date of birth, and contact details</li>' .
               '<li>Medicare and health insurance details</li>' .
               '<li>Referral information from GPs and other health professionals</li>' .
               '<li>Health and medical history relevant to your care</li>' .
               '<li>Emergency contact details</li>' .
               '<li>Communication records including emails and form submissions</li>' .
               '</ul>' .
               '<h3>Sensitive Information</h3>' .
               '<p>As a mental health clinic, we collect sensitive health information. This includes clinical notes, assessment results, diagnosis information, and treatment records. We collect this information with your consent and only where it is necessary for the provision of care, or where collection is required or authorised by law.</p>' .
               '<h2>How We Use Your Information</h2>' .
               '<p>We use personal information to:</p>' .
               '<ul>' .
               '<li>Provide and manage your mental health care</li>' .
               '<li>Coordinate care with other treating health professionals</li>' .
               '<li>Process Medicare and insurance claims</li>' .
               '<li>Send appointment reminders and administrative communications</li>' .
               '<li>Comply with our legal and regulatory obligations</li>' .
               '<li>Improve the quality of our services</li>' .
               '</ul>' .
               '<h2>Disclosure of Information</h2>' .
               '<p>We will not disclose your personal information to third parties without your consent, except where required or authorised by law. We may share information with:</p>' .
               '<ul>' .
               '<li>Other treating health professionals with your consent, or where permitted under the Privacy Act 1988 (Cth)</li>' .
               '<li>Child protection and child safety authorities, where we are required to report under Queensland child protection law</li>' .
               '<li>Medicare Australia and health insurers for billing purposes</li>' .
               '<li>Regulatory bodies where required by law</li>' .
               '<li>Emergency services where there is serious risk to life</li>' .
               '</ul>' .
               '<h2>Storage and Security</h2>' .
               '<p>All personal and health information is stored securely using industry-standard encryption and access controls. Clinical records are maintained for a minimum of seven years from the date of last contact, or until a child reaches the age of 25, whichever is later.</p>' .
               '<h2>Your Rights</h2>' .
               '<p>You have the right to:</p>' .
               '<ul>' .
               '<li>Access your personal information held by us</li>' .
               '<li>Request correction of inaccurate information</li>' .
               '<li>Lodge a complaint about how your information has been handled</li>' .
               '<li>Withdraw consent at any time, subject to legal requirements</li>' .
               '</ul>' .
               '<h3>Young People and Their Families</h3>' .
               '<p>Where a client is under 18, access to their information by a parent or carer is handled in line with our Parent & Carer Involvement and Youth Confidentiality Policy. This means we take account of a young person\'s maturity and their right to confidentiality, alongside any safety considerations, when deciding what information can be shared and with whom.</p>' .
               '<h2>Contact Us</h2>' .
               '<p>If you have questions or concerns about your privacy, please contact us at <a href="mailto:admin@theblacklanternclinic.com">admin@theblacklanternclinic.com</a> or phone <a href="tel:+61418542638">0418 542 638</a>.</p>';
    }

    public static function get_default_terms_html() {
        return '<h2>Agreement to Terms</h2>' .
               '<p>By accessing or using the services of The Black Lantern Clinic ("the Clinic"), you agree to be bound by these Terms and Conditions. Please read them carefully before engaging with our services.</p>' .
               '<h2>Services</h2>' .
               '<h3>Nature of Services</h3>' .
               '<p>The Black Lantern Clinic provides mental health assessment, therapy, and support services for young people aged 12 to 25, delivered by qualified clinical professionals. Our services are provided as private healthcare services and are not a substitute for emergency or acute psychiatric care.</p>' .
               '<h3>Clinical Decisions</h3>' .
               '<p>All clinical decisions are made by qualified health professionals in accordance with professional standards and ethical guidelines. Clients and families are encouraged to actively participate in their care planning but acknowledge that clinical recommendations are based on professional judgement.</p>' .
               '<h2>Fees and Payment</h2>' .
               '<h3>Consultation Fees</h3>' .
               '<p>Our consultation fees are provided at the time of booking and may be subject to change. Current fees are available on request. Medicare rebates may apply to eligible services with an appropriate referral.</p>' .
               '<h3>Payment</h3>' .
               '<p>Payment is required at the time of your appointment unless a prior arrangement has been made. We accept credit card, debit card, and bank transfer. Medicare rebates, where applicable, are processed automatically where card details are held on file.</p>' .
               '<h3>Overdue Accounts</h3>' .
               '<p>We understand that circumstances can make payment difficult, and we will always try to work with you. If an account remains unpaid, we will send a written reminder after 14 days. If it is still outstanding after 28 days, our Practice Director will contact you to discuss the balance and, where needed, arrange a payment plan.</p>' .
               '<p>The Black Lantern Clinic is not an emergency or crisis service. If you need urgent or emergency support, we will always direct you to the appropriate services, regardless of your account status. For non-urgent appointments, we may pause further bookings until the account is resolved or a payment arrangement is in place. In the rare event that an account remains unresolved despite these steps, it may be referred to an external collection service, but only with the approval of both our Practice Director and Clinical Director, and after we have made reasonable efforts to reach a workable arrangement with you.</p>' .
               '<h2>Confidentiality</h2>' .
               '<p>All information shared within the therapeutic relationship is held in strict confidence in accordance with our Privacy Policy and the applicable professional codes of conduct. Limits to confidentiality exist where there is a risk of serious harm to the client or others, or where disclosure is required by law.</p>' .
               '<h2>Client Responsibilities</h2>' .
               '<p>Clients and their representatives are expected to:</p>' .
               '<ul>' .
               '<li>Provide accurate and complete information relevant to their care</li>' .
               '<li>Attend appointments at the agreed time or provide adequate notice of cancellation</li>' .
               '<li>Treat all clinic staff with courtesy and respect</li>' .
               '<li>Comply with the agreed treatment plan and communicate openly with their clinician</li>' .
               '<li>Advise the Clinic of any changes in contact details or health circumstances</li>' .
               '</ul>' .
               '<h2>Limitation of Liability</h2>' .
               '<p>To the extent permitted by law, The Black Lantern Clinic is not liable for any loss or damage arising from reliance on information provided through our website, or from disruptions to service outside our reasonable control. Nothing in these Terms excludes, restricts or modifies any consumer guarantee, right or remedy you have under the Australian Consumer Law or any other law that cannot lawfully be excluded.</p>' .
               '<h2>Amendments</h2>' .
               '<p>We reserve the right to update these Terms and Conditions from time to time. Continued use of our services following notification of changes constitutes acceptance of the amended terms.</p>' .
               '<h2>Governing Law</h2>' .
               '<p>These Terms and Conditions are governed by and construed in accordance with the laws of Queensland, Australia. Any disputes arising under these terms are subject to the exclusive jurisdiction of the courts of Queensland.</p>';
    }

    public static function get_default_cancellation_html() {
        return '<h2>Our Approach to Cancellations</h2>' .
               '<p>We understand that life can be unpredictable, and that sometimes plans need to change. We ask that clients and families contact us as early as possible when an appointment cannot go ahead, so that we can offer that time to another person waiting for care.</p>' .
               '<h2>Notice Requirement</h2>' .
               '<p>We require a minimum of <strong>24 hours\' notice</strong> to cancel or reschedule any appointment. This allows us to offer the appointment time to another client on our waiting list.</p>' .
               '<h2>Cancellation Fee</h2>' .
               '<p>A cancellation fee applies in the following circumstances:</p>' .
               '<ul>' .
               '<li>Cancellation with <strong>less than 24 hours\' notice</strong></li>' .
               '<li><strong>Non-attendance</strong> (no-show) without prior contact</li>' .
               '</ul>' .
               '<p>The cancellation fee is disclosed to you at the time of booking and is listed in our fee schedule, which is provided to you in writing and signed or electronically acknowledged by you prior to your first appointment.</p>' .
               '<h2>Medicare & the Cancellation Fee</h2>' .
               '<p>The cancellation fee is entirely separate from any Medicare claim. Medicare benefits are <strong>never</strong> claimed for non-attendance or late cancellation — the cancellation fee applies solely when less than 24 hours\' notice is given or when a no-show occurs, and is not billed as a Medicare service.</p>' .
               '<h2>Exceptions</h2>' .
               '<p>We understand that genuine emergencies and sudden illness do occur. In these circumstances, please contact us as soon as possible. Cancellation fees may be waived at our discretion where exceptional circumstances are communicated promptly.</p>' .
               '<h2>Repeated Cancellations</h2>' .
               '<p>Where a client repeatedly cancels or does not attend scheduled appointments, the Clinic may review their place on the waitlist or active caseload. Before any decision to discharge, we follow our internal follow-up process. Which includes checking on the young person\'s safety and wellbeing, and we will always seek to discuss the situation with the client or their family first.</p>' .
               '<h2>How to Cancel or Reschedule</h2>' .
               '<p>To cancel or reschedule an appointment, please contact us by:</p>' .
               '<ul>' .
               '<li>Phone: <a href="tel:+61418542638">0418 542 638</a></li>' .
               '<li>Email: <a href="mailto:admin@theblacklanternclinic.com">admin@theblacklanternclinic.com</a></li>' .
               '</ul>' .
               '<p>Cancellations by email are only confirmed once you receive a written acknowledgement from our team.</p>' .
               '<h2>Clinician Cancellations</h2>' .
               '<p>In the rare event that your clinician is unable to attend a scheduled appointment, we will notify you as soon as possible and offer an alternative time at no additional cost. No cancellation fee will apply in these circumstances.</p>' .
               '<h2>Questions</h2>' .
               '<p>If you have any questions about this policy, please speak with our reception team on <a href="tel:+61418542638">0418 542 638</a> or email us at <a href="mailto:admin@theblacklanternclinic.com">admin@theblacklanternclinic.com</a>.</p>';
    }

    /**
     * Pre-fill All Default Options & Data
     */
    public static function prefill_default_data() {
        $defaults = array(
            'bec_phone' => '0418 542 638',
            'bec_email' => 'admin@theblacklanternclinic.com',
            'bec_hours' => 'Tues – Fri: 9am – 6pm',
            'bec_sat_hours' => 'Sat: 10am - 4:30pm',
            'bec_address' => '195 Fingal Street, Tarragindi 4121',
            'bec_location_text' => 'Youth Mental Health · Brisbane, Queensland',
            'bec_instagram_url' => 'https://www.instagram.com/theblacklanternclinic?stkn=OW0xZXd4MmVicGdx&utm_source=qr',
            'bec_booking_btn_text' => 'Book an appointment',
            'bec_booking_url' => '/contact',
            'bec_crisis_text' => 'The Black Lantern Clinic is not a crisis clinic, if you are experiencing a mental health crisis or emergency please contact 000 or lifeline 13 11 14 or 24/7 MH Call 1300 642 255',
            
            // Header
            'bec_header_phone' => '0418 542 638',
            'bec_header_email' => 'admin@theblacklanternclinic.com',
            'bec_header_location' => 'Youth Mental Health · Brisbane, Queensland',
            'bec_header_booking_text' => 'Book an appointment',
            'bec_header_booking_url' => '/contact',
            'bec_header_instagram' => 'https://www.instagram.com/theblacklanternclinic?stkn=OW0xZXd4MmVicGdx&utm_source=qr',

            // Footer
            'bec_footer_bg' => 'https://theblacklanternclinic.com/footer-bg.webp',
            'bec_footer_brand_desc' => 'Specialist psychiatric and mental health care for young people aged 12 to 25.',
            'bec_footer_hours' => 'Tues – Fri: 9am – 6pm',
            'bec_footer_sat_hours' => 'Sat: 10am - 4:30pm',
            'bec_footer_crisis_title' => 'Crisis Support',
            'bec_footer_crisis_text' => 'The Black Lantern Clinic is not a crisis clinic, if you are experiencing a mental health crisis or emergency please contact 000 or lifeline 13 11 14 or 24/7 MH Call 1300 642 255',
            'bec_footer_copyright' => 'The Black Lantern Clinic',
            'bec_footer_credit' => '195 Fingal Street, Tarragindi 4121',

            // Homepage
            'bec_home_hero_title' => 'Private Youth Mental Health Clinic in Brisbane',
            'bec_home_hero_subtitle' => 'Psychiatric assessment, treatment and therapeutic support for young people aged 12–25 from our clinic in Tarragindi, Brisbane.',
            'bec_home_hero_bg' => 'https://theblacklanternclinic.com/hero-bg.webp',
            'bec_home_hero_emblem' => 'https://theblacklanternclinic.com/hero-sec-bg.webp',
            'bec_home_hero_btn_text' => 'Get in Touch',
            'bec_home_hero_btn_url' => '/contact',
            
            // Homepage About Preview Section
            'bec_home_about_eyebrow' => 'About the clinic',
            'bec_home_about_title' => '"Light for the path ahead"',
            'bec_home_about_body' => 'The Black Lantern Clinic provides specialist mental health care for young people aged 12–25 in Brisbane, with families and carers involved where this supports their care. Our name reflects the way we think about mental health care, a lantern doesn’t remove the darkness, it offers light when the way forward feels unclear. We aim to offer that same sense of clarity, helping young people understand what they’re experiencing, find a way forward, and feel less alone along the way.',
            'bec_home_about_link_text' => 'Learn about us',
            'bec_home_about_link_url' => '/about',
            'bec_home_about_img' => 'https://theblacklanternclinic.com/about.webp',

            'bec_home_services_title' => 'Specialist care for young people',
            'bec_home_team_title' => 'Meet our team',
            'bec_cta_title' => 'Ready to take the first step?',
            'bec_cta_body' => 'We know reaching out can feel like a big step. Our team is here to answer your questions and help you work out if we\'re the right fit — no pressure, no obligation.',
            'bec_cta_btn_text' => 'Get in Touch',

            // About Page All Section Options
            'bec_about_hero_title' => 'Who we are',
            'bec_about_hero_bg' => 'https://api.theblacklanternclinic.com/wp-content/uploads/2026/09/IMG_5497.jpeg',
            'bec_about_story_eyebrow' => 'Our story',
            'bec_about_story_title' => '"Helping you find your way through."',
            'bec_about_story_p1' => 'The Black Lantern Clinic is a private specialist youth mental health clinic in Brisbane, Queensland. We see young people aged 12 to 25, and where it helps, their families and carers too. Our clinic’s philosophy is in our name, like a lantern, we aim to provide a guiding light to illuminate the darkness and show you the path forward.',
            'bec_about_story_img' => 'https://api.theblacklanternclinic.com/wp-content/uploads/2026/09/IMG_5493.jpeg',
            'bec_about_values_eyebrow' => 'What we stand for',
            'bec_about_values_title' => 'Our values',
            
            // About 6 Values Cards
            'bec_about_val1_title' => 'Evidence-based',
            'bec_about_val1_desc' => 'Everything we do is grounded in the best available clinical research. We don\'t guess — we rely on what the evidence actually shows.',
            'bec_about_val2_title' => 'Person-centred',
            'bec_about_val2_desc' => 'Your goals and your voice sit at the centre of everything. We\'re here for you — not a diagnosis, not a checklist.',
            'bec_about_val3_title' => 'Trauma-informed',
            'bec_about_val3_desc' => 'We know many young people have been through hard things. Our clinic is designed to feel safe, predictable, and free of pressure.',
            'bec_about_val4_title' => 'Developmentally appropriate',
            'bec_about_val4_desc' => 'We calibrate our approach to where you actually are — not just how old you are. Development is not one-size-fits-all.',
            'bec_about_val5_title' => 'Collaborative',
            'bec_about_val5_desc' => 'With your consent, we work alongside your GP, school, family, and other supports to make sure care is connected, not fragmented.',
            'bec_about_val6_title' => 'Continuity of care',
            'bec_about_val6_desc' => 'You\'ll see the same clinicians throughout your care. We think that matters — and the evidence agrees. No revolving door.',

            'bec_about_app1_num' => '01 - Our approach',
            'bec_about_app1_title' => 'Person-centred care, from the very first contact',
            'bec_about_app1_body' => 'From the first enquiry, you\'ll be met with clarity and warmth. We take time to understand each young person\'s situation before recommending any pathway. No assumptions, no rushing — just honest conversation about what might actually help.',
            'bec_about_app1_img' => 'https://api.theblacklanternclinic.com/wp-content/uploads/2026/09/Image-24-9-2026-at-7.40-pm.png',
            'bec_about_app2_num' => '02 - How we work',
            'bec_about_app2_title' => 'We don\'t work in isolation',
            'bec_about_app2_body' => 'Mental health doesn\'t happen in a vacuum. With your consent, we work alongside your GP, school, family, and other services to make sure care is coordinated — and that nothing falls through the cracks.',
            'bec_about_app2_img' => 'https://api.theblacklanternclinic.com/wp-content/uploads/2026/09/IMG_5496.jpeg',
            'bec_about_cta_title' => 'Want to know if we\'re the right fit?',
            'bec_about_cta_body' => 'You\'re welcome to call or email before making a referral or booking. We\'re happy to answer questions about our services, fees, or how to get started — no commitment required.',

            // Services Page All Section Options
            'bec_services_hero_title' => 'Youth Mental Health Services in Brisbane',
            'bec_services_hero_bg' => 'https://theblacklanternclinic.com/services_hero.webp',
            'bec_services_intro_eyebrow' => 'Our services',
            'bec_services_intro_title' => 'Youth Psychiatry & Mental Health Care in Brisbane',
            'bec_services_intro_body' => 'The Black Lantern Clinic is a private specialist mental health clinic in Tarragindi, Brisbane, providing psychiatric and therapeutic care for young people aged 12–25.',
            
            // Service 1: Psychiatry
            'bec_services_s1_num' => '01',
            'bec_services_s1_title' => 'Psychiatry',
            'bec_services_s1_tagline' => 'Specialist psychiatry for adolescents and young adults',
            'bec_services_s1_desc' => 'Our psychiatry service is led by Dr Joel Adams-Bedford, a consultant psychiatrist with experience working with children, adolescents and young adults. He provides comprehensive psychiatric assessment, formulation and treatment planning for young people presenting with a range of mental health and neurodevelopmental concerns. Care is collaborative and individualised, with families and carers involved where appropriate.',
            'bec_services_s1_bullets' => "Mood and depressive disorders\nAnxiety disorders\nADHD and neurodevelopmental conditions\nAutism spectrum presentations\nTrauma-related concerns\nEmotional regulation and personality-related difficulties\nMedication assessment and management\nDiagnostic assessment and treatment planning",
            'bec_services_s1_photo' => 'https://theblacklanternclinic.com/services_psychiatry_brain.webp',

            // Service 2: Therapy
            'bec_services_s2_num' => '02',
            'bec_services_s2_title' => 'Youth Therapy & Psychotherapy',
            'bec_services_s2_tagline' => 'Evidence-informed therapy for adolescents and young adults',
            'bec_services_s2_desc' => 'Our therapy service supports young people aged 12–25 with anxiety, low mood, trauma-related concerns, emotional regulation difficulties, stress and life transitions. We offer individual therapy tailored to each person’s goals, developmental stage and needs, including EMDR where clinically appropriate. Families and carers can be involved where helpful.',
            'bec_services_s2_bullets' => "Anxiety and excessive worry\nLow mood and depression\nTrauma and PTSD\nEMDR\nEmotional regulation difficulties\nStress and adjustment\nLife transitions and identity concerns",
            'bec_services_s2_photo' => 'https://theblacklanternclinic.com/therapy.webp',

            'bec_services_cta_title' => 'Not sure which service is right?',
            'bec_services_cta_body' => 'Give us a call or send an email. We\'re happy to talk through your situation and help you work out the most appropriate pathway, before you make a booking.',

            // Team Page All Section Options
            'bec_team_hero_title' => 'Meet Our Brisbane Mental Health Team',
            'bec_team_hero_bg' => 'https://theblacklanternclinic.com/team_hero.webp',
            'bec_team_intro_title' => 'A small, dedicated team',
            'bec_team_intro_body' => 'We’re a small, dedicated mental health team based in Tarragindi, Brisbane. That means you’ll work with clinicians who know you, the same people across your care, not a rotation of unfamiliar faces. Our team is committed to thoughtful, individualised care for young people and their families.',
            
            // Team Member 1: Dr. Joel Adams-Bedford
            'bec_team_m1_name' => 'Dr. Joel Adams-Bedford',
            'bec_team_m1_role' => 'Clinical Director & Consultant Child and Adolescent Psychiatrist',
            'bec_team_m1_creds' => 'FRANZCP | Subspecialty Certificate in Child and Adolescent Psychiatry',
            'bec_team_m1_photo' => 'https://theblacklanternclinic.com/team_joel.webp',
            'bec_team_m1_bio' => "Dr Joel Adams-Bedford is a consultant child and adolescent psychiatrist and co-founder of The Black Lantern Clinic in Tarragindi, Brisbane. He holds Fellowship of the Royal Australian and New Zealand College of Psychiatrists (FRANZCP), with subspecialty training in child and adolescent psychiatry, and has more than a decade of clinical experience across public and private mental health settings.\n\nJoel works with adolescents and young adults experiencing a range of mental health and neurodevelopmental concerns. His clinical interests include ADHD, autism and other neurodevelopmental presentations, mood disorders, anxiety and complex mental health presentations. He provides psychiatric assessment, formulation, treatment planning and medication management, with care tailored to each young person’s individual needs.\n\nHis approach is collaborative and person-centred, with young people actively involved in decisions about their care and families or carers included where helpful.",

            // Team Member 2: Rebecca Willis
            'bec_team_m2_name' => 'Rebecca Willis',
            'bec_team_m2_role' => 'Practice Director | Social Worker & Psychotherapist',
            'bec_team_m2_creds' => 'BSW | AASW Member | Graduate Diploma of Psychology (in progress)',
            'bec_team_m2_photo' => 'https://theblacklanternclinic.com/team_rebecca.webp',
            'bec_team_m2_bio' => "Rebecca Willis is a social worker, psychotherapist and co-founder of The Black Lantern Clinic in Tarragindi, Brisbane. She has extensive experience working with children, adolescents and young adults across public mental health, education and youth justice settings.\n\nRebecca provides therapeutic support to young people aged 12–25 experiencing anxiety, low mood, trauma-related concerns, emotional regulation difficulties, stress and life transitions. Her approach is collaborative, practical and tailored to each young person’s individual needs, with families and carers involved where helpful.\n\nRebecca holds a Bachelor of Social Work and is a member of the Australian Association of Social Workers. She has undertaken further professional development in evidence-informed therapeutic approaches and is completing postgraduate study in psychology.\n\nAlongside her clinical work, Rebecca is the Practice Director of The Black Lantern Clinic and oversees the clinic’s day-to-day operations, helping ensure young people and families experience coordinated, accessible and supportive care.",

            'bec_team_support_eyebrow' => 'Behind the scenes',
            'bec_team_support_title' => 'Our admin team',
            'bec_team_support_body' => 'Behind our clinicians is a small, warm admin team. They\'re your first point of contact for questions about referrals, fees, bookings, and anything else. If you\'re not sure where to start, just ask, they\'ll point you in the right direction.',
            'bec_team_cta_title' => 'We\'d love to hear from you',
            'bec_team_cta_body' => 'Our team is here to answer your questions and help you find the right pathway. Don\'t hesitate to get in touch, there\'s no wrong question.',

            // Contact Page
            'bec_contact_hero_title' => 'Contact Our Mental Health Clinic in Tarragindi, Brisbane',
            'bec_contact_hero_bg' => 'https://theblacklanternclinic.com/contact_hero.webp',
            'bec_contact_card_title' => 'You have questions. We have time.',
            'bec_contact_card_subtitle' => 'Whether you’re a young person, parent, carer or GP looking for psychiatry or therapeutic support, we’re happy to help. Our clinic is based in Tarragindi, Brisbane, and supports young people aged 12–25. You don’t need to have everything figured out before you get in touch.',

            // SEO
            'bec_seo_home_title' => 'Psychiatrist Brisbane | Youth Mental Health | The Black Lantern Clinic',
            'bec_seo_home_desc' => 'Private youth mental health clinic in Tarragindi, Brisbane, providing psychiatric assessment, treatment and therapeutic support for young people aged 12–25.',
            'bec_seo_og_image' => 'https://theblacklanternclinic.com/og-image.webp',

            // Privacy Policy Tab Defaults (100% Complete Text)
            'bec_privacy_hero_title' => 'Privacy Policy',
            'bec_privacy_hero_bg' => 'https://theblacklanternclinic.com/page-hero-bg.webp',
            'bec_privacy_updated' => 'Last updated: July 2026',
            'bec_privacy_body' => self::get_default_privacy_html(),

            // Terms & Conditions Tab Defaults (100% Complete Text)
            'bec_terms_hero_title' => 'Terms & Conditions',
            'bec_terms_hero_bg' => 'https://theblacklanternclinic.com/page-hero-bg.webp',
            'bec_terms_updated' => 'Last updated: July 2026',
            'bec_terms_body' => self::get_default_terms_html(),

            // Cancellation Policy Tab Defaults (100% Complete Text)
            'bec_cancellation_hero_title' => 'Cancellation Policy',
            'bec_cancellation_hero_bg' => 'https://theblacklanternclinic.com/page-hero-bg.webp',
            'bec_cancellation_updated' => 'Last updated: July 2026',
            'bec_cancellation_body' => self::get_default_cancellation_html(),
        );

        foreach ($defaults as $key => $val) {
            update_option($key, $val);
        }

        // Auto-create sample Services if empty
        if (post_type_exists('bec_service')) {
            $count_services = wp_count_posts('bec_service');
            if (empty($count_services->publish)) {
                wp_insert_post(array(
                    'post_title' => 'Psychiatry',
                    'post_content' => 'Comprehensive psychiatric assessment, diagnosis, and medication management for young people.',
                    'post_type' => 'bec_service',
                    'post_status' => 'publish',
                    'menu_order' => 1,
                ));
                wp_insert_post(array(
                    'post_title' => 'Therapy',
                    'post_content' => 'Evidence-based individual psychotherapy including EMDR, CBT, and ACT tailored for adolescents and young adults.',
                    'post_type' => 'bec_service',
                    'post_status' => 'publish',
                    'menu_order' => 2,
                ));
            }
        }

        // Auto-create sample Team Members if empty
        if (post_type_exists('bec_team')) {
            $count_team = wp_count_posts('bec_team');
            if (empty($count_team->publish)) {
                wp_insert_post(array(
                    'post_title' => 'Dr. Joel Adams-Bedford',
                    'post_excerpt' => 'Clinical Director & Child and Adolescent Psychiatrist',
                    'post_content' => 'Dr Joel Adams-Bedford is a child and adolescent psychiatrist and a co-founder of The Black Lantern Clinic...',
                    'post_type' => 'bec_team',
                    'post_status' => 'publish',
                    'menu_order' => 1,
                ));
                wp_insert_post(array(
                    'post_title' => 'Rebecca Willis',
                    'post_excerpt' => 'Practice Director & Psychotherapist',
                    'post_content' => 'Rebecca is a co-founder of The Black Lantern Clinic and brings over five years of experience working in mental health...',
                    'post_type' => 'bec_team',
                    'post_status' => 'publish',
                    'menu_order' => 2,
                ));
            }
        }
    }

    /**
     * Handle Manual Pre-fill Action Request from Admin
     */
    public function handle_prefill_action() {
        if (isset($_GET['bec_action']) && $_GET['bec_action'] === 'prefill_data' && current_user_can('manage_options')) {
            check_admin_referer('bec_prefill_nonce');
            self::prefill_default_data();
            self::purge_all_caches();
            wp_redirect(admin_url('admin.php?page=bec-site-settings&prefilled=1'));
            exit;
        }
    }

    /**
     * Purge all LiteSpeed, CDN edge, REST, and object caches & bump version
     */
    public static function purge_all_caches() {
        update_option('bec_content_version', time());

        // LiteSpeed Cache Plugin Hooks
        if (has_action('litespeed_purge_all')) {
            do_action('litespeed_purge_all');
        }
        if (has_action('litespeed_purge_url')) {
            do_action('litespeed_purge_url', rest_url('bec/v1/site-data'));
        }

        // WP REST Cache plugin hook
        if (has_action('wp_rest_cache_empty')) {
            do_action('wp_rest_cache_empty');
        }

        // WordPress native object cache
        if (function_exists('wp_cache_flush')) {
            wp_cache_flush();
        }
    }

    /**
     * Trigger cache invalidation when any BEC setting option updates
     */
    public function on_option_update($option, $old_value = null, $value = null) {
        if (strpos($option, 'bec_') === 0 && $option !== 'bec_content_version') {
            self::purge_all_caches();
        }
    }

    /**
     * Trigger cache invalidation when a custom service or team post is modified
     */
    public function on_post_update($post_id, $post = null, $update = null) {
        if ($post && in_array($post->post_type, array('bec_service', 'bec_team'))) {
            self::purge_all_caches();
        }
    }

    /**
     * Handle manual cache purge request from admin UI button
     */
    public function handle_purge_action() {
        if (isset($_GET['bec_action']) && $_GET['bec_action'] === 'purge_cache' && current_user_can('manage_options')) {
            check_admin_referer('bec_purge_nonce');
            self::purge_all_caches();
            wp_redirect(admin_url('admin.php?page=bec-site-settings&purged=1'));
            exit;
        }
    }

    /**
     * Enqueue WordPress Media Library Scripts for Upload & Delete Buttons
     */
    public function enqueue_admin_scripts($hook) {
        if ($hook !== 'toplevel_page_bec-site-settings') {
            return;
        }
        wp_enqueue_media();
        wp_enqueue_script('jquery');
    }

    /**
     * Register Custom Post Types for Services and Team
     */
    public function register_custom_post_types() {
        // Services CPT
        register_post_type('bec_service', array(
            'labels' => array(
                'name' => __('Services List', 'bec'),
                'singular_name' => __('Service Item', 'bec'),
                'add_new_item' => __('Add New Service', 'bec'),
                'edit_item' => __('Edit Service', 'bec'),
            ),
            'public' => true,
            'has_archive' => false,
            'show_in_rest' => true,
            'supports' => array('title', 'editor', 'thumbnail', 'page-attributes'),
            'menu_icon' => 'dashicons-welcome-learn-more',
        ));

        // Team CPT
        register_post_type('bec_team', array(
            'labels' => array(
                'name' => __('Team Members', 'bec'),
                'singular_name' => __('Team Member', 'bec'),
                'add_new_item' => __('Add New Team Member', 'bec'),
                'edit_item' => __('Edit Team Member', 'bec'),
            ),
            'public' => true,
            'has_archive' => false,
            'show_in_rest' => true,
            'supports' => array('title', 'excerpt', 'editor', 'thumbnail', 'page-attributes'),
            'menu_icon' => 'dashicons-groups',
        ));
    }

    /**
     * Add WordPress Admin Options Menu
     */
    public function add_admin_menu() {
        add_menu_page(
            'BEC Site Content',
            'BEC Site Manager',
            'manage_options',
            'bec-site-settings',
            array($this, 'render_admin_page'),
            'dashicons-admin-generic',
            30
        );
    }

    /**
     * Register All Option Fields
     */
    public function register_settings() {
        $settings = array(
            // Header Tab
            'bec_header_phone', 'bec_header_email', 'bec_header_location', 'bec_address',
            'bec_header_booking_text', 'bec_header_booking_url', 'bec_header_instagram',
            
            // Footer Tab
            'bec_footer_bg', 'bec_footer_brand_desc', 'bec_footer_hours', 'bec_footer_sat_hours',
            'bec_footer_crisis_title', 'bec_footer_crisis_text', 'bec_footer_copyright', 'bec_footer_credit',
            
            // Homepage Tab
            'bec_home_hero_title', 'bec_home_hero_subtitle', 'bec_home_hero_bg', 'bec_home_hero_emblem',
            'bec_home_hero_btn_text', 'bec_home_hero_btn_url',
            'bec_home_about_eyebrow', 'bec_home_about_title', 'bec_home_about_body',
            'bec_home_about_link_text', 'bec_home_about_link_url', 'bec_home_about_img',
            'bec_home_services_title', 'bec_home_team_title',
            'bec_cta_title', 'bec_cta_body', 'bec_cta_btn_text',
            
            // About Page Tab (All Sections + 6 Values Cards)
            'bec_about_hero_title', 'bec_about_hero_bg',
            'bec_about_story_eyebrow', 'bec_about_story_title', 'bec_about_story_p1', 'bec_about_story_img',
            'bec_about_values_eyebrow', 'bec_about_values_title',
            'bec_about_val1_title', 'bec_about_val1_desc',
            'bec_about_val2_title', 'bec_about_val2_desc',
            'bec_about_val3_title', 'bec_about_val3_desc',
            'bec_about_val4_title', 'bec_about_val4_desc',
            'bec_about_val5_title', 'bec_about_val5_desc',
            'bec_about_val6_title', 'bec_about_val6_desc',
            'bec_about_app1_num', 'bec_about_app1_title', 'bec_about_app1_body', 'bec_about_app1_img',
            'bec_about_app2_num', 'bec_about_app2_title', 'bec_about_app2_body', 'bec_about_app2_img',
            'bec_about_cta_title', 'bec_about_cta_body',
            
            // Services Page Tab (All Sections + Service 1 & 2 Details)
            'bec_services_hero_title', 'bec_services_hero_bg',
            'bec_services_intro_eyebrow', 'bec_services_intro_title', 'bec_services_intro_body',
            'bec_services_s1_num', 'bec_services_s1_title', 'bec_services_s1_tagline', 'bec_services_s1_desc', 'bec_services_s1_bullets', 'bec_services_s1_photo',
            'bec_services_s2_num', 'bec_services_s2_title', 'bec_services_s2_tagline', 'bec_services_s2_desc', 'bec_services_s2_bullets', 'bec_services_s2_photo',
            'bec_services_cta_title', 'bec_services_cta_body',
            
            // Team Page Tab (All Sections + Team Member 1 & 2 Details)
            'bec_team_hero_title', 'bec_team_hero_bg',
            'bec_team_intro_title', 'bec_team_intro_body',
            'bec_team_m1_name', 'bec_team_m1_role', 'bec_team_m1_creds', 'bec_team_m1_photo', 'bec_team_m1_bio',
            'bec_team_m2_name', 'bec_team_m2_role', 'bec_team_m2_creds', 'bec_team_m2_photo', 'bec_team_m2_bio',
            'bec_team_support_eyebrow', 'bec_team_support_title', 'bec_team_support_body',
            'bec_team_cta_title', 'bec_team_cta_body',
            
            // Contact Page Tab
            'bec_contact_hero_title', 'bec_contact_hero_bg', 'bec_contact_card_title',
            'bec_contact_card_subtitle',
            
            // SEO Tab
            'bec_seo_home_title', 'bec_seo_home_desc', 'bec_seo_og_image',

            // Privacy Policy Tab
            'bec_privacy_hero_title', 'bec_privacy_hero_bg', 'bec_privacy_updated', 'bec_privacy_body',

            // Terms & Conditions Tab
            'bec_terms_hero_title', 'bec_terms_hero_bg', 'bec_terms_updated', 'bec_terms_body',

            // Cancellation Policy Tab
            'bec_cancellation_hero_title', 'bec_cancellation_hero_bg', 'bec_cancellation_updated', 'bec_cancellation_body'
        );

        foreach ($settings as $setting) {
            $args = array();
            if (in_array($setting, array('bec_privacy_body', 'bec_terms_body', 'bec_cancellation_body'), true)) {
                $args['sanitize_callback'] = 'wp_kses_post';
            }
            register_setting('bec_settings_group', $setting, $args);
        }
    }

    /**
     * Helper to Render Native WP Media Uploader Field
     */
    private function render_media_uploader_field($option_name, $default_value, $label) {
        $val = bec_get_option($option_name, $default_value);
        ?>
        <div class="bec-media-field-wrapper" style="margin-bottom: 15px;">
            <input type="text" name="<?php echo esc_attr($option_name); ?>" value="<?php echo esc_attr($val); ?>" class="regular-text bec-img-input" style="width: 60%; margin-bottom: 8px;" />
            <br />
            <div class="bec-img-preview-box" style="margin: 8px 0; min-height: 50px;">
                <?php if (!empty($val)) : ?>
                    <img src="<?php echo esc_url($val); ?>" class="bec-img-preview" style="max-height: 100px; max-width: 250px; border: 1px solid #ccc; padding: 4px; border-radius: 4px; background: #fff;" />
                <?php else : ?>
                    <img src="" class="bec-img-preview" style="display:none; max-height: 100px; max-width: 250px; border: 1px solid #ccc; padding: 4px; border-radius: 4px; background: #fff;" />
                <?php endif; ?>
            </div>
            <button type="button" class="button button-secondary bec-upload-btn">📁 Select / Upload Image</button>
            <button type="button" class="button button-link-delete bec-remove-btn" style="<?php echo empty($val) ? 'display:none;' : ''; ?>">❌ Remove Image</button>
        </div>
        <?php
    }

    /**
     * Render Tabbed Admin Page with Single-Form Field Preservation & Visual Text Editors
     */
    public function render_admin_page() {
        ?>
        <div class="wrap">
            <h1>The Black Lantern Clinic - Site Manager</h1>
            <p>Select a tab below to manage text, numbers, section headlines, legal policies with <strong>WYSIWYG Visual Text Editors</strong>, and <strong>Upload / Remove Images</strong> via WordPress Media Library.</p>

            <?php if (isset($_GET['prefilled'])) : ?>
                <div class="notice notice-success is-dismissible">
                    <p><strong>Success!</strong> All default website data, about/services/team sections, 6 values cards, service/team member details, full legal policies, phone numbers, headlines, and image URLs have been pre-filled.</p>
                </div>
            <?php endif; ?>

            <?php if (isset($_GET['purged'])) : ?>
                <div class="notice notice-success is-dismissible">
                    <p><strong>Caches Purged!</strong> LiteSpeed, REST, and edge caches have been wiped, version bumped to <code>v<?php echo esc_html(get_option('bec_content_version', time())); ?></code>, and live website tabs notified.</p>
                </div>
            <?php endif; ?>

            <?php if (isset($_GET['settings-updated']) && $_GET['settings-updated'] == 'true') : ?>
                <div class="notice notice-success is-dismissible">
                    <p><strong>Changes Saved!</strong> Edge caches were auto-purged. Your live website has been updated in real-time.</p>
                </div>
            <?php endif; ?>

            <!-- Realtime Bridge Status Bar -->
            <div style="margin-bottom: 20px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; background: #ffffff; padding: 14px 18px; border: 1px solid #c3c4c7; border-left: 4px solid #00a32a; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 14px; color: #1d2327;">⚡ Realtime Bridge:</span>
                    <span style="display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; background: #e7f7ed; color: #0a5223; border: 1px solid #7ad196; border-radius: 20px; font-size: 12px; font-weight: 600;">
                        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#28a745; box-shadow: 0 0 6px #28a745;"></span> Active (v<?php echo esc_html(get_option('bec_content_version', time())); ?>)
                    </span>
                </div>
                <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-left: auto;">
                    <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=bec-site-settings&bec_action=purge_cache'), 'bec_purge_nonce'); ?>" class="button button-secondary" onclick="return confirm('Purge LiteSpeed and CDN edge cache immediately?');">
                        🔄 Force Purge Server Cache
                    </a>
                    <a href="https://theblacklanternclinic.com?preview=1" target="_blank" rel="noopener" class="button button-primary">
                        👁️ View Live Website (Sync Mode)
                    </a>
                    <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=bec-site-settings&bec_action=prefill_data'), 'bec_prefill_nonce'); ?>" class="button button-link-delete" onclick="return confirm('Reset and pre-fill all default website text, values cards, and legal policies?');">
                        ⚠️ Pre-fill All Defaults
                    </a>
                </div>
            </div>

            <!-- Tab Navigation Bar -->
            <h2 class="nav-tab-wrapper bec-tabs-nav">
                <a href="#tab-header" class="nav-tab nav-tab-active">Header</a>
                <a href="#tab-footer" class="nav-tab">Footer</a>
                <a href="#tab-homepage" class="nav-tab">Homepage</a>
                <a href="#tab-about" class="nav-tab">About Page</a>
                <a href="#tab-services" class="nav-tab">Services Page</a>
                <a href="#tab-team" class="nav-tab">Team Page</a>
                <a href="#tab-contact" class="nav-tab">Contact Page</a>
                <a href="#tab-privacy" class="nav-tab">Privacy Policy</a>
                <a href="#tab-terms" class="nav-tab">Terms & Conditions</a>
                <a href="#tab-cancellation" class="nav-tab">Cancellation Policy</a>
                <a href="#tab-seo" class="nav-tab">SEO & Meta</a>
            </h2>

            <!-- Single Form for All Tabs (Prevents field wiping on save) -->
            <form method="post" action="options.php">
                <?php settings_fields('bec_settings_group'); ?>

                <!-- Tab 1: Header -->
                <div id="tab-header" class="bec-tab-panel" style="display: block;">
                    <h2>Header & Navigation Settings</h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Phone Number</th>
                            <td><input type="text" name="bec_header_phone" value="<?php echo esc_attr(bec_get_option('bec_header_phone', '0418 542 638')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Admin Email</th>
                            <td><input type="email" name="bec_header_email" value="<?php echo esc_attr(bec_get_option('bec_header_email', 'admin@theblacklanternclinic.com')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Location / Address</th>
                            <td><input type="text" name="bec_header_location" value="<?php echo esc_attr(bec_get_option('bec_header_location', '195 Fingal Street, Tarragindi - Brisbane, Queensland')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Physical Clinic Address</th>
                            <td><input type="text" name="bec_address" value="<?php echo esc_attr(bec_get_option('bec_address', '195 Fingal Street, Tarragindi - Brisbane, Queensland')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Booking Button Text</th>
                            <td><input type="text" name="bec_header_booking_text" value="<?php echo esc_attr(bec_get_option('bec_header_booking_text', 'Book an appointment')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Booking Button URL</th>
                            <td><input type="text" name="bec_header_booking_url" value="<?php echo esc_attr(bec_get_option('bec_header_booking_url', '/contact')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Instagram Profile URL</th>
                            <td><input type="text" name="bec_header_instagram" value="<?php echo esc_attr(bec_get_option('bec_header_instagram', 'https://instagram.com')); ?>" class="regular-text" /></td>
                        </tr>
                    </table>
                </div>

                <!-- Tab 2: Footer -->
                <div id="tab-footer" class="bec-tab-panel" style="display: none;">
                    <h2>Footer Settings</h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Footer Background Image</th>
                            <td><?php $this->render_media_uploader_field('bec_footer_bg', 'https://theblacklanternclinic.com/footer-bg.webp', 'Footer Background'); ?></td>
                        </tr>
                        <tr>
                            <th scope="row">Brand Description</th>
                            <td><textarea name="bec_footer_brand_desc" rows="3" class="large-text"><?php echo esc_textarea(bec_get_option('bec_footer_brand_desc', 'Specialist psychiatric and mental health care for young people aged 12 to 25.')); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row">Weekday Hours</th>
                            <td><input type="text" name="bec_footer_hours" value="<?php echo esc_attr(bec_get_option('bec_footer_hours', 'Mon – Fri: 9am – 5pm')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Saturday Hours</th>
                            <td><input type="text" name="bec_footer_sat_hours" value="<?php echo esc_attr(bec_get_option('bec_footer_sat_hours', 'Sat: By appointment only')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Crisis Support Notice Title</th>
                            <td><input type="text" name="bec_footer_crisis_title" value="<?php echo esc_attr(bec_get_option('bec_footer_crisis_title', 'Crisis Support')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Crisis Support Full Text</th>
                            <td><textarea name="bec_footer_crisis_text" rows="4" class="large-text"><?php echo esc_textarea(bec_get_option('bec_footer_crisis_text', 'The Black Lantern Clinic is not a crisis clinic, if you are experiencing a mental health crisis or emergency please contact 000 or lifeline 13 11 14 or 24/7 MH Call 1300 642 255')); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row">Copyright Text</th>
                            <td><input type="text" name="bec_footer_copyright" value="<?php echo esc_attr(bec_get_option('bec_footer_copyright', 'The Black Lantern Clinic')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Location Credit Line</th>
                            <td><input type="text" name="bec_footer_credit" value="<?php echo esc_attr(bec_get_option('bec_footer_credit', '195 Fingal Street, Tarragindi - Brisbane, Queensland')); ?>" class="regular-text" /></td>
                        </tr>
                    </table>
                </div>

                <!-- Tab 3: Homepage -->
                <div id="tab-homepage" class="bec-tab-panel" style="display: none;">
                    <h2>Homepage Hero & Section Settings</h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Hero Headline</th>
                            <td><input type="text" name="bec_home_hero_title" value="<?php echo esc_attr(bec_get_option('bec_home_hero_title', 'Light for the Path ahead')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Hero Subtitle Paragraph</th>
                            <td><textarea name="bec_home_hero_subtitle" rows="3" class="large-text"><?php echo esc_textarea(bec_get_option('bec_home_hero_subtitle', 'The Black Lantern Clinic is a private specialist youth mental health clinic in Brisbane, Queensland. We see young people aged 12 to 25 — and where it helps, their families and carers too.')); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row">Hero Background Image</th>
                            <td><?php $this->render_media_uploader_field('bec_home_hero_bg', 'https://theblacklanternclinic.com/hero-bg.webp', 'Hero Background'); ?></td>
                        </tr>
                        <tr>
                            <th scope="row">Hero Emblem Logo Image</th>
                            <td><?php $this->render_media_uploader_field('bec_home_hero_emblem', 'https://theblacklanternclinic.com/hero-sec-bg.webp', 'Hero Emblem'); ?></td>
                        </tr>
                        <tr>
                            <th scope="row">Hero Button Text</th>
                            <td><input type="text" name="bec_home_hero_btn_text" value="<?php echo esc_attr(bec_get_option('bec_home_hero_btn_text', 'Get in Touch')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Hero Button Link</th>
                            <td><input type="text" name="bec_home_hero_btn_url" value="<?php echo esc_attr(bec_get_option('bec_home_hero_btn_url', '/contact')); ?>" class="regular-text" /></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Homepage About Section Preview</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">About Eyebrow</th>
                            <td><input type="text" name="bec_home_about_eyebrow" value="<?php echo esc_attr(bec_get_option('bec_home_about_eyebrow', 'About the clinic')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">About Headline Quote</th>
                            <td><input type="text" name="bec_home_about_title" value="<?php echo esc_attr(bec_get_option('bec_home_about_title', '"A steady light, when the path feels uncertain."')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">About Section Body</th>
                            <td><textarea name="bec_home_about_body" rows="4" class="large-text"><?php echo esc_textarea(bec_get_option('bec_home_about_body', 'The Black Lantern Clinic is a private specialist youth mental health clinic in Brisbane, Queensland. We see young people aged 12 to 25, and where it helps, their families and carers too. Our clinic’s philosophy is in our name, like a lantern, we aim to provide a guiding light to illuminate the darkness and show you the path forward.')); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row">About Button Link Text</th>
                            <td><input type="text" name="bec_home_about_link_text" value="<?php echo esc_attr(bec_get_option('bec_home_about_link_text', 'Learn about us')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">About Button Link URL</th>
                            <td><input type="text" name="bec_home_about_link_url" value="<?php echo esc_attr(bec_get_option('bec_home_about_link_url', '/about')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">About Section Image</th>
                            <td><?php $this->render_media_uploader_field('bec_home_about_img', 'https://theblacklanternclinic.com/about.webp', 'About Section Image'); ?></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Other Homepage Sections</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Services Section Headline</th>
                            <td><input type="text" name="bec_home_services_title" value="<?php echo esc_attr(bec_get_option('bec_home_services_title', 'Specialist care for young people')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Team Section Headline</th>
                            <td><input type="text" name="bec_home_team_title" value="<?php echo esc_attr(bec_get_option('bec_home_team_title', 'Meet our team')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Global CTA Headline</th>
                            <td><input type="text" name="bec_cta_title" value="<?php echo esc_attr(bec_get_option('bec_cta_title', 'Ready to take the first step?')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Global CTA Body Text</th>
                            <td><textarea name="bec_cta_body" rows="3" class="large-text"><?php echo esc_textarea(bec_get_option('bec_cta_body', 'We know reaching out can feel like a big step. Our team is here to answer your questions and help you work out if we\'re the right fit — no pressure, no obligation.')); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row">Global CTA Button Text</th>
                            <td><input type="text" name="bec_cta_btn_text" value="<?php echo esc_attr(bec_get_option('bec_cta_btn_text', 'Get in Touch')); ?>" class="regular-text" /></td>
                        </tr>
                    </table>
                </div>

                <!-- Tab 4: About -->
                <div id="tab-about" class="bec-tab-panel" style="display: none;">
                    <h2>About Page Settings</h2>
                    
                    <h3 style="border-bottom:1px solid #ccc; padding-bottom:8px;">Hero Section</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">About Page Hero Title</th>
                            <td><input type="text" name="bec_about_hero_title" value="<?php echo esc_attr(bec_get_option('bec_about_hero_title', 'Who we are')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">About Hero Background Image</th>
                            <td><?php $this->render_media_uploader_field('bec_about_hero_bg', 'https://theblacklanternclinic.com/page-hero-bg.webp', 'About Hero Background'); ?></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Clinic Story Section</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Story Eyebrow</th>
                            <td><input type="text" name="bec_about_story_eyebrow" value="<?php echo esc_attr(bec_get_option('bec_about_story_eyebrow', 'Our story')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Clinic Story Heading</th>
                            <td><input type="text" name="bec_about_story_title" value="<?php echo esc_attr(bec_get_option('bec_about_story_title', '"A steady light, when the path feels uncertain."')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Clinic Story Paragraph</th>
                            <td><textarea name="bec_about_story_p1" rows="4" class="large-text"><?php echo esc_textarea(bec_get_option('bec_about_story_p1', 'The Black Lantern Clinic is a private specialist youth mental health clinic in Brisbane, Queensland. We see young people aged 12 to 25, and where it helps, their families and carers too. Our clinic’s philosophy is in our name, like a lantern, we aim to provide a guiding light to illuminate the darkness and show you the path forward.')); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row">Clinic Story Image</th>
                            <td><?php $this->render_media_uploader_field('bec_about_story_img', 'https://theblacklanternclinic.com/about_story.webp', 'Clinic Story Image'); ?></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Values Section Headers & 6 Value Cards</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Values Eyebrow</th>
                            <td><input type="text" name="bec_about_values_eyebrow" value="<?php echo esc_attr(bec_get_option('bec_about_values_eyebrow', 'What we stand for')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Values Section Title</th>
                            <td><input type="text" name="bec_about_values_title" value="<?php echo esc_attr(bec_get_option('bec_about_values_title', 'Our values')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Value 1 Title & Description</th>
                            <td>
                                <input type="text" name="bec_about_val1_title" value="<?php echo esc_attr(bec_get_option('bec_about_val1_title', 'Evidence-based')); ?>" class="regular-text" style="margin-bottom:6px;" placeholder="Value Title" /><br />
                                <textarea name="bec_about_val1_desc" rows="2" class="large-text" placeholder="Value Description"><?php echo esc_textarea(bec_get_option('bec_about_val1_desc', 'Everything we do is grounded in the best available clinical research. We don\'t guess — we rely on what the evidence actually shows.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Value 2 Title & Description</th>
                            <td>
                                <input type="text" name="bec_about_val2_title" value="<?php echo esc_attr(bec_get_option('bec_about_val2_title', 'Person-centred')); ?>" class="regular-text" style="margin-bottom:6px;" placeholder="Value Title" /><br />
                                <textarea name="bec_about_val2_desc" rows="2" class="large-text" placeholder="Value Description"><?php echo esc_textarea(bec_get_option('bec_about_val2_desc', 'Your goals and your voice sit at the centre of everything. We\'re here for you — not a diagnosis, not a checklist.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Value 3 Title & Description</th>
                            <td>
                                <input type="text" name="bec_about_val3_title" value="<?php echo esc_attr(bec_get_option('bec_about_val3_title', 'Trauma-informed')); ?>" class="regular-text" style="margin-bottom:6px;" placeholder="Value Title" /><br />
                                <textarea name="bec_about_val3_desc" rows="2" class="large-text" placeholder="Value Description"><?php echo esc_textarea(bec_get_option('bec_about_val3_desc', 'We know many young people have been through hard things. Our clinic is designed to feel safe, predictable, and free of pressure.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Value 4 Title & Description</th>
                            <td>
                                <input type="text" name="bec_about_val4_title" value="<?php echo esc_attr(bec_get_option('bec_about_val4_title', 'Developmentally appropriate')); ?>" class="regular-text" style="margin-bottom:6px;" placeholder="Value Title" /><br />
                                <textarea name="bec_about_val4_desc" rows="2" class="large-text" placeholder="Value Description"><?php echo esc_textarea(bec_get_option('bec_about_val4_desc', 'We calibrate our approach to where you actually are — not just how old you are. Development is not one-size-fits-all.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Value 5 Title & Description</th>
                            <td>
                                <input type="text" name="bec_about_val5_title" value="<?php echo esc_attr(bec_get_option('bec_about_val5_title', 'Collaborative')); ?>" class="regular-text" style="margin-bottom:6px;" placeholder="Value Title" /><br />
                                <textarea name="bec_about_val5_desc" rows="2" class="large-text" placeholder="Value Description"><?php echo esc_textarea(bec_get_option('bec_about_val5_desc', 'With your consent, we work alongside your GP, school, family, and other supports to make sure care is connected, not fragmented.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Value 6 Title & Description</th>
                            <td>
                                <input type="text" name="bec_about_val6_title" value="<?php echo esc_attr(bec_get_option('bec_about_val6_title', 'Continuity of care')); ?>" class="regular-text" style="margin-bottom:6px;" placeholder="Value Title" /><br />
                                <textarea name="bec_about_val6_desc" rows="2" class="large-text" placeholder="Value Description"><?php echo esc_textarea(bec_get_option('bec_about_val6_desc', 'You\'ll see the same clinicians throughout your care. We think that matters — and the evidence agrees. No revolving door.')); ?></textarea>
                            </td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Approach Item 1</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Item 1 Tag/Number</th>
                            <td><input type="text" name="bec_about_app1_num" value="<?php echo esc_attr(bec_get_option('bec_about_app1_num', '01 — Our approach')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Item 1 Title</th>
                            <td><input type="text" name="bec_about_app1_title" value="<?php echo esc_attr(bec_get_option('bec_about_app1_title', 'Person-centred care, from the very first contact')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Item 1 Body</th>
                            <td><textarea name="bec_about_app1_body" rows="3" class="large-text"><?php echo esc_textarea(bec_get_option('bec_about_app1_body', 'From the first enquiry, you\'ll be met with clarity and warmth. We take time to understand each young person\'s situation before recommending any pathway. No assumptions, no rushing — just honest conversation about what might actually help.')); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row">Item 1 Image</th>
                            <td><?php $this->render_media_uploader_field('bec_about_app1_img', 'https://theblacklanternclinic.com/about_approach_play.webp', 'Item 1 Image'); ?></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Approach Item 2</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Item 2 Tag/Number</th>
                            <td><input type="text" name="bec_about_app2_num" value="<?php echo esc_attr(bec_get_option('bec_about_app2_num', '02 — How we work')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Item 2 Title</th>
                            <td><input type="text" name="bec_about_app2_title" value="<?php echo esc_attr(bec_get_option('bec_about_app2_title', 'We don\'t work in isolation')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Item 2 Body</th>
                            <td><textarea name="bec_about_app2_body" rows="3" class="large-text"><?php echo esc_textarea(bec_get_option('bec_about_app2_body', 'Mental health doesn\'t happen in a vacuum. With your consent, we work alongside your GP, school, family, and other services to make sure care is coordinated — and that nothing falls through the cracks.')); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row">Item 2 Image</th>
                            <td><?php $this->render_media_uploader_field('bec_about_app2_img', 'https://theblacklanternclinic.com/about_approach_meeting.webp', 'Item 2 Image'); ?></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">About Page CTA Banner</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">CTA Headline</th>
                            <td><input type="text" name="bec_about_cta_title" value="<?php echo esc_attr(bec_get_option('bec_about_cta_title', 'Want to know if we\'re the right fit?')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">CTA Body</th>
                            <td><textarea name="bec_about_cta_body" rows="3" class="large-text"><?php echo esc_textarea(bec_get_option('bec_about_cta_body', 'You\'re welcome to call or email before making a referral or booking. We\'re happy to answer questions about our services, fees, or how to get started — no commitment required.')); ?></textarea></td>
                        </tr>
                    </table>
                </div>

                <!-- Tab 5: Services -->
                <div id="tab-services" class="bec-tab-panel" style="display: none;">
                    <h2>Services Page Settings</h2>
                    
                    <h3 style="border-bottom:1px solid #ccc; padding-bottom:8px;">Hero Section</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Services Hero Title</th>
                            <td><input type="text" name="bec_services_hero_title" value="<?php echo esc_attr(bec_get_option('bec_services_hero_title', 'What we offer')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Services Hero Background Image</th>
                            <td><?php $this->render_media_uploader_field('bec_services_hero_bg', 'https://theblacklanternclinic.com/page-hero-bg.webp', 'Services Hero Background'); ?></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Intro Section</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Intro Eyebrow</th>
                            <td><input type="text" name="bec_services_intro_eyebrow" value="<?php echo esc_attr(bec_get_option('bec_services_intro_eyebrow', 'Our services')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Intro Headline</th>
                            <td><input type="text" name="bec_services_intro_title" value="<?php echo esc_attr(bec_get_option('bec_services_intro_title', 'Comprehensive mental health care for young people aged 12–25')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Intro Body Paragraph</th>
                            <td><textarea name="bec_services_intro_body" rows="3" class="large-text"><?php echo esc_textarea(bec_get_option('bec_services_intro_body', 'The Black Lantern Clinic offers psychiatric services to young people aged 12 to 25, based in Brisbane, Queensland. All care is evidence-based, person-centred, and tailored to each individual.')); ?></textarea></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Service 01 — Psychiatry Details</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Service 01 Number/Tag</th>
                            <td><input type="text" name="bec_services_s1_num" value="<?php echo esc_attr(bec_get_option('bec_services_s1_num', '01')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Service 01 Title</th>
                            <td><input type="text" name="bec_services_s1_title" value="<?php echo esc_attr(bec_get_option('bec_services_s1_title', 'Psychiatry')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Service 01 Tagline</th>
                            <td><input type="text" name="bec_services_s1_tagline" value="<?php echo esc_attr(bec_get_option('bec_services_s1_tagline', 'Led by a child and adolescent psychiatrist')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Service 01 Description</th>
                            <td><textarea name="bec_services_s1_desc" rows="4" class="large-text"><?php echo esc_textarea(bec_get_option('bec_services_s1_desc', 'Our clinic is led by Dr Joel Adams-Bedford, a child and adolescent psychiatrist who has a wide range of interests. He aims to provide detailed assessment, formulation and treatment for children, adolescents and young adults. He sees young people presenting with many kinds of concerns at The Black Lantern Clinic including:')); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row">Service 01 Bullet Points (1 per line)</th>
                            <td><textarea name="bec_services_s1_bullets" rows="5" class="large-text"><?php echo esc_textarea(bec_get_option('bec_services_s1_bullets', "Mood Disorders\nNeurodevelopmental Disorders\nAnxiety Disorders\nTrauma and Personality Concerns\nDeliberate Self-Harm")); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row">Service 01 Image</th>
                            <td><?php $this->render_media_uploader_field('bec_services_s1_photo', 'https://theblacklanternclinic.com/services_psychiatry_brain.webp', 'Psychiatry Service Image'); ?></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Service 02 — Therapy Details</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Service 02 Number/Tag</th>
                            <td><input type="text" name="bec_services_s2_num" value="<?php echo esc_attr(bec_get_option('bec_services_s2_num', '02')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Service 02 Title</th>
                            <td><input type="text" name="bec_services_s2_title" value="<?php echo esc_attr(bec_get_option('bec_services_s2_title', 'Therapy')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Service 02 Tagline</th>
                            <td><input type="text" name="bec_services_s2_tagline" value="<?php echo esc_attr(bec_get_option('bec_services_s2_tagline', 'Evidence-based therapy matched to where you are.')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Service 02 Description</th>
                            <td><textarea name="bec_services_s2_desc" rows="4" class="large-text"><?php echo esc_textarea(bec_get_option('bec_services_s2_desc', 'Therapy is available for a wide range of presentations. Our clinicians use approaches matched to each person\'s individual needs and developmental stage — not a one-size-fits-all model. We work with young people experiencing:')); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row">Service 02 Bullet Points (1 per line)</th>
                            <td><textarea name="bec_services_s2_bullets" rows="5" class="large-text"><?php echo esc_textarea(bec_get_option('bec_services_s2_bullets', "Anxiety and worry\nDepression and low mood\nTrauma and PTSD\nEmotional regulation difficulties\nLife transitions and adjustment")); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row">Service 02 Image</th>
                            <td><?php $this->render_media_uploader_field('bec_services_s2_photo', 'https://theblacklanternclinic.com/therapy.webp', 'Therapy Service Image'); ?></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Services Page CTA Banner</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">CTA Headline</th>
                            <td><input type="text" name="bec_services_cta_title" value="<?php echo esc_attr(bec_get_option('bec_services_cta_title', 'Not sure which service is right?')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">CTA Body Text</th>
                            <td><textarea name="bec_services_cta_body" rows="3" class="large-text"><?php echo esc_textarea(bec_get_option('bec_services_cta_body', 'Give us a call or send an email. We\'re happy to talk through your situation and help you work out the most appropriate pathway — before you make a booking.')); ?></textarea></td>
                        </tr>
                    </table>
                </div>

                <!-- Tab 6: Team -->
                <div id="tab-team" class="bec-tab-panel" style="display: none;">
                    <h2>Team Page Settings</h2>

                    <h3 style="border-bottom:1px solid #ccc; padding-bottom:8px;">Hero Section</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Team Hero Title</th>
                            <td><input type="text" name="bec_team_hero_title" value="<?php echo esc_attr(bec_get_option('bec_team_hero_title', 'The people behind the clinic')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Team Hero Background Image</th>
                            <td><?php $this->render_media_uploader_field('bec_team_hero_bg', 'https://theblacklanternclinic.com/page-hero-bg.webp', 'Team Hero Background'); ?></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Intro Section</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Intro Headline</th>
                            <td><input type="text" name="bec_team_intro_title" value="<?php echo esc_attr(bec_get_option('bec_team_intro_title', 'A small, dedicated team')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Intro Body Paragraph</th>
                            <td><textarea name="bec_team_intro_body" rows="3" class="large-text"><?php echo esc_textarea(bec_get_option('bec_team_intro_body', 'We\'re a small clinic by design. That means you\'ll work with clinicians who know you — the same people across your care, not a rotation of unfamiliar faces. Everyone here is committed to the same thing: getting it right for each young person we see.')); ?></textarea></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Team Member 01 — Dr. Joel Adams-Bedford Details</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Member 01 Full Name</th>
                            <td><input type="text" name="bec_team_m1_name" value="<?php echo esc_attr(bec_get_option('bec_team_m1_name', 'Dr. Joel Adams-Bedford')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Member 01 Role / Title</th>
                            <td><input type="text" name="bec_team_m1_role" value="<?php echo esc_attr(bec_get_option('bec_team_m1_role', 'Clinical Director & Child and Adolescent Psychiatrist')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Member 01 Qualifications / Creds</th>
                            <td><input type="text" name="bec_team_m1_creds" value="<?php echo esc_attr(bec_get_option('bec_team_m1_creds', 'FRANZCP | Sub-specialty certificate in child and adolescent psychiatry')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Member 01 Full Bio (Paragraphs separated by blank lines)</th>
                            <td><textarea name="bec_team_m1_bio" rows="8" class="large-text"><?php echo esc_textarea(bec_get_option('bec_team_m1_bio', "Dr Joel Adams-Bedford is a child and adolescent psychiatrist and a co-founder of The Black Lantern Clinic. He holds a Fellowship of the Royal Australian and New Zealand College of Psychiatrists (FRANZCP) with subspecialty training in child and adolescent psychiatry and brings over a decade of clinical experience across some of Australia's most demanding mental health environments.\n\nThat breadth of experience shapes the way he works. Dr Joel has a particular interest in young people who have fallen through the cracks — young people who have been hard to reach, hard to read, or who have never quite had a satisfying explanation for why things feel so difficult.\n\nHis clinical interests include neurodevelopmental and mood disorders in adolescents. He is committed to young people having a genuine voice in their own care, as a core part of good clinical practice.\n\nAt The Black Lantern Clinic, Dr Joel offers comprehensive psychiatric assessments, structured interventions and ongoing psychiatric management.")); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row">Member 01 Profile Photo</th>
                            <td><?php $this->render_media_uploader_field('bec_team_m1_photo', 'https://theblacklanternclinic.com/team_joel.webp', 'Dr Joel Photo'); ?></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Team Member 02 — Rebecca Willis Details</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Member 02 Full Name</th>
                            <td><input type="text" name="bec_team_m2_name" value="<?php echo esc_attr(bec_get_option('bec_team_m2_name', 'Rebecca Willis')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Member 02 Role / Title</th>
                            <td><input type="text" name="bec_team_m2_role" value="<?php echo esc_attr(bec_get_option('bec_team_m2_role', 'Practice Director & Psychotherapist')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Member 02 Qualifications / Creds</th>
                            <td><input type="text" name="bec_team_m2_creds" value="<?php echo esc_attr(bec_get_option('bec_team_m2_creds', 'BSW | Currently completing Graduate Diploma of Psychology')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Member 02 Full Bio (Paragraphs separated by blank lines)</th>
                            <td><textarea name="bec_team_m2_bio" rows="8" class="large-text"><?php echo esc_textarea(bec_get_option('bec_team_m2_bio', "Rebecca is a co-founder of The Black Lantern Clinic and brings over five years of experience working in mental health across Queensland Health, the Department of Education, and Youth Justice.\n\nAlongside her Bachelor of Social Work, Rebecca has undertaken extensive professional development in evidence-based therapies, including EMDR, and is currently completing her Graduate Diploma of Psychology.\n\nIn her role as Practice Director, Rebecca oversees the day-to-day operations of the clinic, ensuring that every client's experience is seamless, warm, and well supported.\n\nRebecca is committed to equity of access and is always available to assist with questions about fees, billing, referrals, or navigating services.")); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row">Member 02 Profile Photo</th>
                            <td><?php $this->render_media_uploader_field('bec_team_m2_photo', 'https://theblacklanternclinic.com/team_rebecca.webp', 'Rebecca Willis Photo'); ?></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Admin & Support Section</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Support Section Eyebrow</th>
                            <td><input type="text" name="bec_team_support_eyebrow" value="<?php echo esc_attr(bec_get_option('bec_team_support_eyebrow', 'Behind the scenes')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Support Section Headline</th>
                            <td><input type="text" name="bec_team_support_title" value="<?php echo esc_attr(bec_get_option('bec_team_support_title', 'Our admin team')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Support Section Body</th>
                            <td><textarea name="bec_team_support_body" rows="3" class="large-text"><?php echo esc_textarea(bec_get_option('bec_team_support_body', 'Behind our clinicians is a small, warm admin team. They\'re your first point of contact for questions about referrals, fees, bookings, and anything else. If you\'re not sure where to start, just ask — they\'ll point you in the right direction.')); ?></textarea></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Team Page CTA Banner</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row">CTA Headline</th>
                            <td><input type="text" name="bec_team_cta_title" value="<?php echo esc_attr(bec_get_option('bec_team_cta_title', 'We\'d love to hear from you')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">CTA Body Text</th>
                            <td><textarea name="bec_team_cta_body" rows="3" class="large-text"><?php echo esc_textarea(bec_get_option('bec_team_cta_body', 'Our team is here to answer your questions and help you find the right pathway. Don\'t hesitate to get in touch — there\'s no wrong question.')); ?></textarea></td>
                        </tr>
                    </table>
                </div>

                <!-- Tab 7: Contact -->
                <div id="tab-contact" class="bec-tab-panel" style="display: none;">
                    <h2>Contact Page Settings</h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Contact Hero Title</th>
                            <td><input type="text" name="bec_contact_hero_title" value="<?php echo esc_attr(bec_get_option('bec_contact_hero_title', 'Contact Us')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Contact Hero Background Image</th>
                            <td><?php $this->render_media_uploader_field('bec_contact_hero_bg', 'https://theblacklanternclinic.com/hero-bg.webp', 'Contact Hero Background'); ?></td>
                        </tr>
                        <tr>
                            <th scope="row">Contact Card Headline</th>
                            <td><input type="text" name="bec_contact_card_title" value="<?php echo esc_attr(bec_get_option('bec_contact_card_title', 'You have questions. We have time.')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Contact Card Subtitle</th>
                            <td><textarea name="bec_contact_card_subtitle" rows="3" class="large-text"><?php echo esc_textarea(bec_get_option('bec_contact_card_subtitle', 'Whether you\'re a young person, a parent, a carer, or a GP — we\'re happy to talk. You don\'t need to have everything figured out before you call.')); ?></textarea></td>
                        </tr>
                    </table>

                    <h3 style="margin-top:30px; border-bottom:1px solid #ccc; padding-bottom:8px;">Recent Contact Form Submissions</h3>
                    <?php
                    $submissions = get_option('bec_contact_submissions', array());
                    if (!empty($submissions) && is_array($submissions)) :
                    ?>
                        <table class="widefat fixed striped" style="margin-top:15px;">
                            <thead>
                                <tr>
                                    <th style="width: 150px;">Date & Time</th>
                                    <th style="width: 160px;">Name</th>
                                    <th style="width: 200px;">Email / Phone</th>
                                    <th>Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($submissions as $sub) : ?>
                                    <tr>
                                        <td><?php echo esc_html($sub['date']); ?></td>
                                        <td><strong><?php echo esc_html(($sub['first_name'] ?? '') . ' ' . ($sub['last_name'] ?? '')); ?></strong></td>
                                        <td>
                                            <a href="mailto:<?php echo esc_attr($sub['email'] ?? ''); ?>"><?php echo esc_html($sub['email'] ?? ''); ?></a><br />
                                            <small><?php echo esc_html($sub['phone'] ?? ''); ?></small>
                                        </td>
                                        <td><?php echo nl2br(esc_html($sub['message'] ?? '')); ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php else : ?>
                        <p><em>No form submissions received yet.</em></p>
                    <?php endif; ?>
                </div>

                <!-- Tab 8: Privacy Policy (Visual Text Editor) -->
                <div id="tab-privacy" class="bec-tab-panel" style="display: none;">
                    <h2>Privacy Policy Settings</h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Hero Title</th>
                            <td><input type="text" name="bec_privacy_hero_title" value="<?php echo esc_attr(bec_get_option('bec_privacy_hero_title', 'Privacy Policy')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Hero Background Image</th>
                            <td><?php $this->render_media_uploader_field('bec_privacy_hero_bg', 'https://theblacklanternclinic.com/page-hero-bg.webp', 'Privacy Hero Background'); ?></td>
                        </tr>
                        <tr>
                            <th scope="row">Last Updated Date</th>
                            <td><input type="text" name="bec_privacy_updated" value="<?php echo esc_attr(bec_get_option('bec_privacy_updated', 'Last updated: July 2026')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Policy Content (Visual Editor)</th>
                            <td>
                                <?php 
                                wp_editor(
                                    bec_get_option('bec_privacy_body', self::get_default_privacy_html()),
                                    'bec_privacy_body_editor',
                                    array(
                                        'textarea_name' => 'bec_privacy_body',
                                        'textarea_rows' => 32,
                                        'editor_height' => 550,
                                        'media_buttons' => true,
                                        'tinymce' => array(
                                            'height' => 500,
                                        ),
                                        'quicktags' => true
                                    )
                                );
                                ?>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Tab 9: Terms & Conditions (Visual Text Editor) -->
                <div id="tab-terms" class="bec-tab-panel" style="display: none;">
                    <h2>Terms & Conditions Settings</h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Hero Title</th>
                            <td><input type="text" name="bec_terms_hero_title" value="<?php echo esc_attr(bec_get_option('bec_terms_hero_title', 'Terms & Conditions')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Hero Background Image</th>
                            <td><?php $this->render_media_uploader_field('bec_terms_hero_bg', 'https://theblacklanternclinic.com/page-hero-bg.webp', 'Terms Hero Background'); ?></td>
                        </tr>
                        <tr>
                            <th scope="row">Last Updated Date</th>
                            <td><input type="text" name="bec_terms_updated" value="<?php echo esc_attr(bec_get_option('bec_terms_updated', 'Last updated: July 2026')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Terms Content (Visual Editor)</th>
                            <td>
                                <?php 
                                wp_editor(
                                    bec_get_option('bec_terms_body', self::get_default_terms_html()),
                                    'bec_terms_body_editor',
                                    array(
                                        'textarea_name' => 'bec_terms_body',
                                        'textarea_rows' => 32,
                                        'editor_height' => 550,
                                        'media_buttons' => true,
                                        'tinymce' => array(
                                            'height' => 500,
                                        ),
                                        'quicktags' => true
                                    )
                                );
                                ?>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Tab 10: Cancellation Policy (Visual Text Editor) -->
                <div id="tab-cancellation" class="bec-tab-panel" style="display: none;">
                    <h2>Cancellation Policy Settings</h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Hero Title</th>
                            <td><input type="text" name="bec_cancellation_hero_title" value="<?php echo esc_attr(bec_get_option('bec_cancellation_hero_title', 'Cancellation Policy')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Hero Background Image</th>
                            <td><?php $this->render_media_uploader_field('bec_cancellation_hero_bg', 'https://theblacklanternclinic.com/page-hero-bg.webp', 'Cancellation Hero Background'); ?></td>
                        </tr>
                        <tr>
                            <th scope="row">Last Updated Date</th>
                            <td><input type="text" name="bec_cancellation_updated" value="<?php echo esc_attr(bec_get_option('bec_cancellation_updated', 'Last updated: July 2026')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Cancellation Policy Content (Visual Editor)</th>
                            <td>
                                <?php 
                                wp_editor(
                                    bec_get_option('bec_cancellation_body', self::get_default_cancellation_html()),
                                    'bec_cancellation_body_editor',
                                    array(
                                        'textarea_name' => 'bec_cancellation_body',
                                        'textarea_rows' => 32,
                                        'editor_height' => 550,
                                        'media_buttons' => true,
                                        'tinymce' => array(
                                            'height' => 500,
                                        ),
                                        'quicktags' => true
                                    )
                                );
                                ?>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Tab 11: SEO -->
                <div id="tab-seo" class="bec-tab-panel" style="display: none;">
                    <h2>SEO & Meta Tags</h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row">Homepage Meta Title</th>
                            <td><input type="text" name="bec_seo_home_title" value="<?php echo esc_attr(bec_get_option('bec_seo_home_title', 'The Black Lantern Clinic | Specialist Youth Psychiatry & Therapy Brisbane')); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th scope="row">Homepage Meta Description</th>
                            <td><textarea name="bec_seo_home_desc" rows="2" class="large-text"><?php echo esc_textarea(bec_get_option('bec_seo_home_desc', 'Specialist youth mental health clinic in Brisbane for ages 12–25. Grounded, person-centred psychiatric assessment & evidence-based therapy.')); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row">Social Share OG Image</th>
                            <td><?php $this->render_media_uploader_field('bec_seo_og_image', 'https://theblacklanternclinic.com/og-image.webp', 'Social Share OG Image'); ?></td>
                        </tr>
                    </table>
                </div>

                <?php submit_button('Save All Settings'); ?>
            </form>
        </div>

        <!-- Inline JavaScript for Client-Side Tab Switching & Media Library Selection/Removal -->
        <script type="text/javascript">
            jQuery(document).ready(function($){
                // Client-side Tab Switching (Preserves all inputs in single form)
                $('.bec-tabs-nav a').click(function(e) {
                    e.preventDefault();
                    $('.bec-tabs-nav a').removeClass('nav-tab-active');
                    $(this).addClass('nav-tab-active');

                    var targetId = $(this).attr('href');
                    $('.bec-tab-panel').hide();
                    $(targetId).show();

                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    }
                });

                // Auto open hash tab if present in URL
                if (window.location.hash) {
                    var hashTab = $('.bec-tabs-nav a[href="' + window.location.hash + '"]');
                    if (hashTab.length) {
                        hashTab.trigger('click');
                    }
                }

                // Media Library Uploader
                $('.bec-upload-btn').click(function(e) {
                    e.preventDefault();
                    var wrapper = $(this).closest('.bec-media-field-wrapper');
                    var inputField = wrapper.find('.bec-img-input');
                    var previewImg = wrapper.find('.bec-img-preview');
                    var removeBtn = wrapper.find('.bec-remove-btn');

                    var frame = wp.media({
                        title: 'Select or Upload Image',
                        button: { text: 'Use Selected Image' },
                        multiple: false
                    });

                    frame.on('select', function() {
                        var attachment = frame.state().get('selection').first().toJSON();
                        inputField.val(attachment.url);
                        previewImg.attr('src', attachment.url).show();
                        removeBtn.show();
                    });

                    frame.open();
                });

                // Image Remover Button
                $('.bec-remove-btn').click(function(e) {
                    e.preventDefault();
                    var wrapper = $(this).closest('.bec-media-field-wrapper');
                    wrapper.find('.bec-img-input').val('');
                    wrapper.find('.bec-img-preview').attr('src', '').hide();
                    $(this).hide();
                });

                // Cross-Tab Realtime Bridge: Broadcast to open website tabs on save or purge
                <?php if (isset($_GET['settings-updated']) || isset($_GET['purged'])) : ?>
                try {
                    if (window.BroadcastChannel) {
                        var bc = new BroadcastChannel('bec_site_sync');
                        bc.postMessage({ type: 'content_updated', timestamp: Date.now() });
                    }
                    localStorage.setItem('bec_admin_synced', Date.now().toString());
                } catch (err) {}
                <?php endif; ?>
            });
        </script>
        <?php
    }

    /**
     * Register REST API Routes
     */
    public function register_rest_routes() {
        register_rest_route('bec/v1', '/site-data', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_site_data'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('bec/v1', '/purge-cache', array(
            'methods' => array('GET', 'POST'),
            'callback' => array($this, 'rest_purge_cache'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('bec/v1', '/contact-submit', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_contact_submission'),
            'permission_callback' => '__return_true',
        ));
    }

    /**
     * REST API Callback for Immediate Cache Purge
     */
    public function rest_purge_cache($request) {
        self::purge_all_caches();
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'All caches purged and version bumped.',
            'version' => (int) get_option('bec_content_version', time()),
            'server_time' => current_time('mysql'),
        ), 200);
    }

    /**
     * REST API Callback for Contact Form Submission
     */
    public function handle_contact_submission($request) {
        $params = $request->get_json_params();
        if (empty($params)) {
            $params = $request->get_body_params();
        }

        $first_name = isset($params['first_name']) ? sanitize_text_field($params['first_name']) : (isset($params['firstname']) ? sanitize_text_field($params['firstname']) : '');
        $last_name = isset($params['last_name']) ? sanitize_text_field($params['last_name']) : (isset($params['lastname']) ? sanitize_text_field($params['lastname']) : '');
        if (empty($first_name) && isset($params['names']['first_name'])) {
            $first_name = sanitize_text_field($params['names']['first_name']);
        }
        if (empty($last_name) && isset($params['names']['last_name'])) {
            $last_name = sanitize_text_field($params['names']['last_name']);
        }
        $email = isset($params['email']) ? sanitize_email($params['email']) : '';
        $phone = isset($params['phone']) ? sanitize_text_field($params['phone']) : (isset($params['mobile']) ? sanitize_text_field($params['mobile']) : '');
        $message = isset($params['message']) ? sanitize_textarea_field($params['message']) : '';

        if (empty($first_name) || empty($email)) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Please provide a valid first name and email address.'
            ), 400);
        }

        $admin_email = bec_get_option('bec_header_email', get_option('admin_email', 'admin@theblacklanternclinic.com'));
        $site_name = bec_get_option('bec_header_tagline', 'The Black Lantern Clinic');
        $clean_first = trim($first_name);
        $clean_last = trim($last_name);
        $clean_name = trim($clean_first . ' ' . $clean_last);
        $clean_email = sanitize_email($email);
        $subject = 'New Contact Form Submission from ' . ($clean_name ?: 'Website Visitor');
        $body = "Name: $clean_name\nEmail: $clean_email\nPhone: $phone\n\nMessage:\n$message\n\nSubmitted at: " . current_time('mysql');
        
        // Proper DMARC / SPF compliant mail headers
        $headers = array(
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . wp_strip_all_tags($site_name) . ' <' . sanitize_email($admin_email) . '>',
            'Reply-To: ' . wp_strip_all_tags($clean_name ?: 'Website Visitor') . ' <' . $clean_email . '>'
        );

        @wp_mail($admin_email, $subject, $body, $headers);

        $submissions = get_option('bec_contact_submissions', array());
        if (!is_array($submissions)) {
            $submissions = array();
        }
        array_unshift($submissions, array(
            'date' => current_time('mysql'),
            'first_name' => $first_name,
            'last_name' => $last_name,
            'email' => $email,
            'phone' => $phone,
            'message' => $message,
        ));
        $submissions = array_slice($submissions, 0, 100);
        update_option('bec_contact_submissions', $submissions);

        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Thank you! Your message has been received. Our team will get back to you shortly.'
        ), 200);
    }

    /**
     * REST API Callback Payload Structuring
     */
    public function get_site_data() {
        // Enforce anti-cache headers directly on the REST API output
        if (!headers_sent()) {
            header_remove('Cache-Control');
            header_remove('Expires');
            header_remove('Pragma');
            header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0, s-maxage=0, post-check=0, pre-check=0');
            header('Pragma: no-cache');
            header('Expires: 0');
            header('X-LiteSpeed-Cache-Control: no-cache, no-store');
            header('X-LiteSpeed-Purge: *');
        }

        // Fetch CPT Services
        $services_query = new WP_Query(array(
            'post_type' => 'bec_service',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ));
        $services = array();
        if ($services_query->have_posts()) {
            while ($services_query->have_posts()) {
                $services_query->the_post();
                $services[] = array(
                    'id' => get_the_ID(),
                    'title' => get_the_title(),
                    'content' => get_the_content(),
                    'image' => get_the_post_thumbnail_url(get_the_ID(), 'full') ?: '',
                );
            }
            wp_reset_postdata();
        }

        // Fetch CPT Team
        $team_query = new WP_Query(array(
            'post_type' => 'bec_team',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ));
        $m1_photo = bec_get_option('bec_team_m1_photo', 'https://theblacklanternclinic.com/team_joel.webp');
        $m2_photo = bec_get_option('bec_team_m2_photo', 'https://theblacklanternclinic.com/team_rebecca.webp');

        if (empty($team)) {
            $team = array(
                array(
                    'id' => 1,
                    'name' => bec_get_option('bec_team_m1_name', 'Dr. Joel Adams-Bedford'),
                    'role' => bec_get_option('bec_team_m1_role', 'Clinical Director & Consultant Child and Adolescent Psychiatrist'),
                    'photo' => $m1_photo,
                ),
                array(
                    'id' => 2,
                    'name' => bec_get_option('bec_team_m2_name', 'Rebecca Willis'),
                    'role' => bec_get_option('bec_team_m2_role', 'Practice Director | Social Worker & Psychotherapist'),
                    'photo' => $m2_photo,
                ),
            );
        } else {
            foreach ($team as &$tm) {
                if (empty($tm['photo'])) {
                    if (stripos($tm['name'], 'Rebecca') !== false) {
                        $tm['photo'] = $m2_photo;
                    } else {
                        $tm['photo'] = $m1_photo;
                    }
                }
            }
            unset($tm);
        }

        // Service 1 Bullets Array Parsing
        $s1_bullets_raw = bec_get_option('bec_services_s1_bullets', "Mood Disorders\nNeurodevelopmental Disorders\nAnxiety Disorders\nTrauma and Personality Concerns\nDeliberate Self-Harm");
        $s1_bullets = array_values(array_filter(array_map('trim', explode("\n", $s1_bullets_raw))));

        // Service 2 Bullets Array Parsing
        $s2_bullets_raw = bec_get_option('bec_services_s2_bullets', "Anxiety and worry\nDepression and low mood\nTrauma and PTSD\nEmotional regulation difficulties\nLife transitions and adjustment");
        $s2_bullets = array_values(array_filter(array_map('trim', explode("\n", $s2_bullets_raw))));

        // Team Member 1 Bio Paragraphs Parsing
        $m1_bio_raw = bec_get_option('bec_team_m1_bio', "Dr Joel Adams-Bedford is a child and adolescent psychiatrist and a co-founder of The Black Lantern Clinic. He holds a Fellowship of the Royal Australian and New Zealand College of Psychiatrists (FRANZCP) with subspecialty training in child and adolescent psychiatry and brings over a decade of clinical experience across some of Australia's most demanding mental health environments.\n\nThat breadth of experience shapes the way he works. Dr Joel has a particular interest in young people who have fallen through the cracks — young people who have been hard to reach, hard to read, or who have never quite had a satisfying explanation for why things feel so difficult.\n\nHis clinical interests include neurodevelopmental and mood disorders in adolescents. He is committed to young people having a genuine voice in their own care, as a core part of good clinical practice.\n\nAt The Black Lantern Clinic, Dr Joel offers comprehensive psychiatric assessments, structured interventions and ongoing psychiatric management.");
        $m1_bio_paras = array_values(array_filter(array_map('trim', explode("\n\n", str_replace("\r\n", "\n", $m1_bio_raw)))));

        // Team Member 2 Bio Paragraphs Parsing
        $m2_bio_raw = bec_get_option('bec_team_m2_bio', "Rebecca is a co-founder of The Black Lantern Clinic and brings over five years of experience working in mental health across Queensland Health, the Department of Education, and Youth Justice.\n\nAlongside her Bachelor of Social Work, Rebecca has undertaken extensive professional development in evidence-based therapies, including EMDR, and is currently completing her Graduate Diploma of Psychology.\n\nIn her role as Practice Director, Rebecca oversees the day-to-day operations of the clinic, ensuring that every client's experience is seamless, warm, and well supported.\n\nRebecca is committed to equity of access and is always available to assist with questions about fees, billing, referrals, or navigating services.");
        $m2_bio_paras = array_values(array_filter(array_map('trim', explode("\n\n", str_replace("\r\n", "\n", $m2_bio_raw)))));

        // About 6 Values Array Parsing
        $values_list = array(
            array(
                'title' => bec_get_option('bec_about_val1_title', 'Evidence-based'),
                'desc'  => bec_get_option('bec_about_val1_desc', 'Everything we do is grounded in the best available clinical research. We don\'t guess — we rely on what the evidence actually shows.'),
            ),
            array(
                'title' => bec_get_option('bec_about_val2_title', 'Person-centred'),
                'desc'  => bec_get_option('bec_about_val2_desc', 'Your goals and your voice sit at the centre of everything. We\'re here for you — not a diagnosis, not a checklist.'),
            ),
            array(
                'title' => bec_get_option('bec_about_val3_title', 'Trauma-informed'),
                'desc'  => bec_get_option('bec_about_val3_desc', 'We know many young people have been through hard things. Our clinic is designed to feel safe, predictable, and free of pressure.'),
            ),
            array(
                'title' => bec_get_option('bec_about_val4_title', 'Developmentally appropriate'),
                'desc'  => bec_get_option('bec_about_val4_desc', 'We calibrate our approach to where you actually are — not just how old you are. Development is not one-size-fits-all.'),
            ),
            array(
                'title' => bec_get_option('bec_about_val5_title', 'Collaborative'),
                'desc'  => bec_get_option('bec_about_val5_desc', 'With your consent, we work alongside your GP, school, family, and other supports to make sure care is connected, not fragmented.'),
            ),
            array(
                'title' => bec_get_option('bec_about_val6_title', 'Continuity of care'),
                'desc'  => bec_get_option('bec_about_val6_desc', 'You\'ll see the same clinicians throughout your care. We think that matters — and the evidence agrees. No revolving door.'),
            ),
        );

        return rest_ensure_response(array(
            'header' => array(
                'phone' => bec_get_option('bec_header_phone', bec_get_option('bec_phone', '0418 542 638')),
                'email' => bec_get_option('bec_header_email', bec_get_option('bec_email', 'admin@theblacklanternclinic.com')),
                'location' => bec_get_option('bec_header_location', 'Youth Mental Health · Brisbane, Queensland'),
                'booking_text' => bec_get_option('bec_header_booking_text', 'Book an appointment'),
                'booking_url' => bec_get_option('bec_header_booking_url', '/contact'),
                'instagram' => bec_get_option('bec_header_instagram', 'https://www.instagram.com/theblacklanternclinic?stkn=OW0xZXd4MmVicGdx&utm_source=qr'),
            ),
            'general' => array(
                'phone' => bec_get_option('bec_header_phone', bec_get_option('bec_phone', '0418 542 638')),
                'email' => bec_get_option('bec_header_email', bec_get_option('bec_email', 'admin@theblacklanternclinic.com')),
                'hours' => bec_get_option('bec_hours', bec_get_option('bec_footer_hours', 'Tues – Fri: 9am – 6pm')),
                'sat_hours' => bec_get_option('bec_sat_hours', bec_get_option('bec_footer_sat_hours', 'Sat: 10am - 4:30pm')),
                'address' => bec_get_option('bec_address', '195 Fingal Street, Tarragindi 4121'),
                'location_text' => bec_get_option('bec_location_text', bec_get_option('bec_header_location', 'Youth Mental Health · Brisbane, Queensland')),
                'instagram_url' => bec_get_option('bec_instagram_url', bec_get_option('bec_header_instagram', 'https://www.instagram.com/theblacklanternclinic?stkn=OW0xZXd4MmVicGdx&utm_source=qr')),
                'booking_btn_text' => bec_get_option('bec_header_booking_text', 'Book an appointment'),
                'booking_url' => bec_get_option('bec_header_booking_url', '/contact'),
                'crisis_text' => bec_get_option('bec_footer_crisis_text', 'The Black Lantern Clinic is not a crisis clinic, if you are experiencing a mental health crisis or emergency please contact 000 or lifeline 13 11 14 or 24/7 MH Call 1300 642 255'),
            ),
            'footer' => array(
                'bg' => bec_get_option('bec_footer_bg', 'https://theblacklanternclinic.com/footer-bg.webp'),
                'brand_desc' => bec_get_option('bec_footer_brand_desc', 'Specialist psychiatric and mental health care for young people aged 12 to 25.'),
                'hours' => bec_get_option('bec_footer_hours', 'Tues – Fri: 9am – 6pm'),
                'sat_hours' => bec_get_option('bec_footer_sat_hours', 'Sat: 10am - 4:30pm'),
                'crisis_title' => bec_get_option('bec_footer_crisis_title', 'Crisis Support'),
                'crisis_text' => bec_get_option('bec_footer_crisis_text', 'The Black Lantern Clinic is not a crisis clinic, if you are experiencing a mental health crisis or emergency please contact 000 or lifeline 13 11 14 or 24/7 MH Call 1300 642 255'),
                'copyright' => bec_get_option('bec_footer_copyright', 'The Black Lantern Clinic'),
                'credit' => bec_get_option('bec_footer_credit', '195 Fingal Street, Tarragindi 4121'),
            ),
            'heroes' => array(
                'home_title' => bec_get_option('bec_home_hero_title', 'Private Youth Mental Health Clinic in Brisbane'),
                'home_subtitle' => bec_get_option('bec_home_hero_subtitle', 'Psychiatric assessment, treatment and therapeutic support for young people aged 12–25 from our clinic in Tarragindi, Brisbane.'),
                'home_bg' => bec_get_option('bec_home_hero_bg', 'https://theblacklanternclinic.com/hero-bg.webp'),
                'subpage_bg' => bec_get_option('bec_subpage_hero_bg', bec_get_option('bec_about_hero_bg', 'https://theblacklanternclinic.com/page-hero-bg.webp')),
                'footer_bg' => bec_get_option('bec_footer_bg', 'https://theblacklanternclinic.com/footer-bg.webp'),
            ),
            'homepage' => array(
                'hero_title' => bec_get_option('bec_home_hero_title', 'Private Youth Mental Health Clinic in Brisbane'),
                'hero_subtitle' => bec_get_option('bec_home_hero_subtitle', 'Psychiatric assessment, treatment and therapeutic support for young people aged 12–25 from our clinic in Tarragindi, Brisbane.'),
                'hero_bg' => bec_get_option('bec_home_hero_bg', 'https://theblacklanternclinic.com/hero-bg.webp'),
                'hero_emblem' => bec_get_option('bec_home_hero_emblem', 'https://theblacklanternclinic.com/hero-sec-bg.webp'),
                'hero_btn_text' => bec_get_option('bec_home_hero_btn_text', 'Get in Touch'),
                'hero_btn_url' => bec_get_option('bec_home_hero_btn_url', '/contact'),
                'about_eyebrow' => bec_get_option('bec_home_about_eyebrow', 'About the clinic'),
                'about_title' => bec_get_option('bec_home_about_title', '"Light for the path ahead"'),
                'about_body' => bec_get_option('bec_home_about_body', 'The Black Lantern Clinic provides specialist mental health care for young people aged 12–25 in Brisbane, with families and carers involved where this supports their care. Our name reflects the way we think about mental health care, a lantern doesn’t remove the darkness, it offers light when the way forward feels unclear. We aim to offer that same sense of clarity, helping young people understand what they’re experiencing, find a way forward, and feel less alone along the way.'),
                'about_link_text' => bec_get_option('bec_home_about_link_text', 'Learn about us'),
                'about_link_url' => bec_get_option('bec_home_about_link_url', '/about'),
                'about_img' => bec_get_option('bec_home_about_img', 'https://theblacklanternclinic.com/about.webp'),
                'services_title' => bec_get_option('bec_home_services_title', 'Specialist care for young people'),
                'team_title' => bec_get_option('bec_home_team_title', 'Meet our team'),
            ),
            'cta' => array(
                'title' => bec_get_option('bec_cta_title', 'Ready to take the first step?'),
                'body' => bec_get_option('bec_cta_body', 'We know reaching out can feel like a big step. Our team is here to answer your questions and help you work out if we\'re the right fit — no pressure, no obligation.'),
                'btn_text' => bec_get_option('bec_cta_btn_text', 'Get in Touch'),
            ),
            'about' => array(
                'hero_title' => bec_get_option('bec_about_hero_title', 'Who we are'),
                'hero_bg' => bec_get_option('bec_about_hero_bg', 'https://api.theblacklanternclinic.com/wp-content/uploads/2026/09/IMG_5497.jpeg'),
                'story_eyebrow' => bec_get_option('bec_about_story_eyebrow', 'Our story'),
                'story_title' => bec_get_option('bec_about_story_title', '"Helping you find your way through."'),
                'story_p1' => bec_get_option('bec_about_story_p1', 'The Black Lantern Clinic is a private specialist youth mental health clinic in Brisbane, Queensland. We see young people aged 12 to 25, and where it helps, their families and carers too. Our clinic’s philosophy is in our name, like a lantern, we aim to provide a guiding light to illuminate the darkness and show you the path forward.'),
                'story_img' => bec_get_option('bec_about_story_img', 'https://api.theblacklanternclinic.com/wp-content/uploads/2026/09/IMG_5493.jpeg'),
                'values_eyebrow' => bec_get_option('bec_about_values_eyebrow', 'What we stand for'),
                'values_title' => bec_get_option('bec_about_values_title', 'Our values'),
                'values_list' => $values_list,
                'app1_num' => bec_get_option('bec_about_app1_num', '01 - Our approach'),
                'app1_title' => bec_get_option('bec_about_app1_title', 'Person-centred care, from the very first contact'),
                'app1_body' => bec_get_option('bec_about_app1_body', 'From the first enquiry, you\'ll be met with clarity and warmth. We take time to understand each young person\'s situation before recommending any pathway. No assumptions, no rushing — just honest conversation about what might actually help.'),
                'app1_img' => bec_get_option('bec_about_app1_img', 'https://api.theblacklanternclinic.com/wp-content/uploads/2026/09/Image-24-9-2026-at-7.40-pm.png'),
                'app2_num' => bec_get_option('bec_about_app2_num', '02 - How we work'),
                'app2_title' => bec_get_option('bec_about_app2_title', 'We don\'t work in isolation'),
                'app2_body' => bec_get_option('bec_about_app2_body', 'Mental health doesn\'t happen in a vacuum. With your consent, we work alongside your GP, school, family, and other services to make sure care is coordinated — and that nothing falls through the cracks.'),
                'app2_img' => bec_get_option('bec_about_app2_img', 'https://api.theblacklanternclinic.com/wp-content/uploads/2026/09/IMG_5496.jpeg'),
                'cta_title' => bec_get_option('bec_about_cta_title', 'Want to know if we\'re the right fit?'),
                'cta_body' => bec_get_option('bec_about_cta_body', 'You\'re welcome to call or email before making a referral or booking. We\'re happy to answer questions about our services, fees, or how to get started — no commitment required.'),
            ),
            'services_page' => array(
                'hero_title' => bec_get_option('bec_services_hero_title', 'Youth Mental Health Services in Brisbane'),
                'hero_bg' => bec_get_option('bec_services_hero_bg', 'https://theblacklanternclinic.com/services_hero.webp'),
                'intro_eyebrow' => bec_get_option('bec_services_intro_eyebrow', 'Our services'),
                'intro_title' => bec_get_option('bec_services_intro_title', 'Youth Psychiatry & Mental Health Care in Brisbane'),
                'intro_body' => bec_get_option('bec_services_intro_body', 'The Black Lantern Clinic is a private specialist mental health clinic in Tarragindi, Brisbane, providing psychiatric and therapeutic care for young people aged 12–25.'),
                
                // Service 1 Object
                'service1' => array(
                    'num' => bec_get_option('bec_services_s1_num', '01'),
                    'title' => bec_get_option('bec_services_s1_title', 'Psychiatry'),
                    'tagline' => bec_get_option('bec_services_s1_tagline', 'Specialist psychiatry for adolescents and young adults'),
                    'desc' => bec_get_option('bec_services_s1_desc', 'Our clinic is led by Dr Joel Adams-Bedford, a consultant psychiatrist with experience working with children, adolescents and young adults. He provides comprehensive psychiatric assessment, formulation and treatment planning for young people presenting with a range of mental health and neurodevelopmental concerns. Care is collaborative and individualised, with families and carers involved where appropriate.'),
                    'bullets' => $s1_bullets,
                    'photo' => bec_get_option('bec_services_s1_photo', 'https://theblacklanternclinic.com/services_psychiatry_brain.webp'),
                ),

                // Service 2 Object
                'service2' => array(
                    'num' => bec_get_option('bec_services_s2_num', '02'),
                    'title' => bec_get_option('bec_services_s2_title', 'Youth Therapy & Psychotherapy'),
                    'tagline' => bec_get_option('bec_services_s2_tagline', 'Evidence-informed therapy for adolescents and young adults'),
                    'desc' => bec_get_option('bec_services_s2_desc', 'Our therapy service supports young people aged 12–25 with anxiety, low mood, trauma-related concerns, emotional regulation difficulties, stress and life transitions. We offer individual therapy tailored to each person’s goals, developmental stage and needs, including EMDR where clinically appropriate. Families and carers can be involved where helpful.'),
                    'bullets' => $s2_bullets,
                    'photo' => bec_get_option('bec_services_s2_photo', 'https://theblacklanternclinic.com/therapy.webp'),
                ),

                'cta_title' => bec_get_option('bec_services_cta_title', 'Not sure which service is right?'),
                'cta_body' => bec_get_option('bec_services_cta_body', 'Give us a call or send an email. We\'re happy to talk through your situation and help you work out the most appropriate pathway, before you make a booking.'),
            ),
            'team_page' => array(
                'hero_title' => bec_get_option('bec_team_hero_title', 'Meet Our Brisbane Mental Health Team'),
                'hero_bg' => bec_get_option('bec_team_hero_bg', 'https://theblacklanternclinic.com/team_hero.webp'),
                'intro_title' => bec_get_option('bec_team_intro_title', 'A small, dedicated team'),
                'intro_body' => bec_get_option('bec_team_intro_body', 'We’re a small, dedicated mental health team based in Tarragindi, Brisbane. That means you’ll work with clinicians who know you, the same people across your care, not a rotation of unfamiliar faces. Our team is committed to thoughtful, individualised care for young people and their families.'),
                
                // Team Member 1 Object
                'member1' => array(
                    'name' => bec_get_option('bec_team_m1_name', 'Dr. Joel Adams-Bedford'),
                    'role' => bec_get_option('bec_team_m1_role', 'Clinical Director & Consultant Child and Adolescent Psychiatrist'),
                    'creds' => bec_get_option('bec_team_m1_creds', 'FRANZCP | Subspecialty Certificate in Child and Adolescent Psychiatry'),
                    'photo' => bec_get_option('bec_team_m1_photo', 'https://theblacklanternclinic.com/team_joel.webp'),
                    'bio' => $m1_bio_paras,
                    'reversed' => false,
                ),

                // Team Member 2 Object
                'member2' => array(
                    'name' => bec_get_option('bec_team_m2_name', 'Rebecca Willis'),
                    'role' => bec_get_option('bec_team_m2_role', 'Practice Director | Social Worker & Psychotherapist'),
                    'creds' => bec_get_option('bec_team_m2_creds', 'BSW | AASW Member | Graduate Diploma of Psychology (in progress)'),
                    'photo' => bec_get_option('bec_team_m2_photo', 'https://theblacklanternclinic.com/team_rebecca.webp'),
                    'bio' => $m2_bio_paras,
                    'reversed' => true,
                ),

                'support_eyebrow' => bec_get_option('bec_team_support_eyebrow', 'Behind the scenes'),
                'support_title' => bec_get_option('bec_team_support_title', 'Our admin team'),
                'support_body' => bec_get_option('bec_team_support_body', 'Behind our clinicians is a small, warm admin team. They\'re your first point of contact for questions about referrals, fees, bookings, and anything else. If you\'re not sure where to start, just ask, they\'ll point you in the right direction.'),
                'cta_title' => bec_get_option('bec_team_cta_title', 'We\'d love to hear from you'),
                'cta_body' => bec_get_option('bec_team_cta_body', 'Our team is here to answer your questions and help you find the right pathway. Don\'t hesitate to get in touch, there\'s no wrong question.'),
            ),
            'contact_page' => array(
                'hero_title' => bec_get_option('bec_contact_hero_title', 'Contact Our Mental Health Clinic in Tarragindi, Brisbane'),
                'hero_bg' => bec_get_option('bec_contact_hero_bg', 'https://theblacklanternclinic.com/contact_hero.webp'),
                'card_title' => bec_get_option('bec_contact_card_title', 'You have questions. We have time.'),
                'card_subtitle' => bec_get_option('bec_contact_card_subtitle', 'Whether you’re a young person, parent, carer or GP looking for psychiatry or therapeutic support, we’re happy to help. Our clinic is based in Tarragindi, Brisbane, and supports young people aged 12–25. You don’t need to have everything figured out before you get in touch.'),
            ),
            'privacy_page' => array(
                'hero_title' => bec_get_option('bec_privacy_hero_title', 'Privacy Policy'),
                'hero_bg' => bec_get_option('bec_privacy_hero_bg', 'https://theblacklanternclinic.com/page-hero-bg.webp'),
                'updated_date' => bec_get_option('bec_privacy_updated', 'Last updated: July 2026'),
                'content' => bec_get_option('bec_privacy_body', self::get_default_privacy_html()),
            ),
            'terms_page' => array(
                'hero_title' => bec_get_option('bec_terms_hero_title', 'Terms & Conditions'),
                'hero_bg' => bec_get_option('bec_terms_hero_bg', 'https://theblacklanternclinic.com/page-hero-bg.webp'),
                'updated_date' => bec_get_option('bec_terms_updated', 'Last updated: July 2026'),
                'content' => bec_get_option('bec_terms_body', self::get_default_terms_html()),
            ),
            'cancellation_page' => array(
                'hero_title' => bec_get_option('bec_cancellation_hero_title', 'Cancellation Policy'),
                'hero_bg' => bec_get_option('bec_cancellation_hero_bg', 'https://theblacklanternclinic.com/page-hero-bg.webp'),
                'updated_date' => bec_get_option('bec_cancellation_updated', 'Last updated: July 2026'),
                'content' => bec_get_option('bec_cancellation_body', self::get_default_cancellation_html()),
            ),
            'seo' => array(
                'home_title' => bec_get_option('bec_seo_home_title', 'Psychiatrist Brisbane | Youth Mental Health | The Black Lantern Clinic'),
                'home_desc' => bec_get_option('bec_seo_home_desc', 'Private youth mental health clinic in Tarragindi, Brisbane, providing psychiatric assessment, treatment and therapeutic support for young people aged 12–25.'),
                'og_image' => bec_get_option('bec_seo_og_image', 'https://theblacklanternclinic.com/og-image.webp'),
            ),
            '_version' => (int) bec_get_option('bec_content_version', time()),
            '_server_time' => current_time('mysql'),
            'services' => $services,
            'team' => $team,
        ));
    }
}

// Register Activation Hook to Auto-Prefill Data
register_activation_hook(__FILE__, array('BEC_Site_Manager', 'prefill_default_data'));

new BEC_Site_Manager();
