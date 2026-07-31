# Comprehensive Memory & Technical Architecture: The Black Lantern Clinic (`bec-website`)

> **Document Version**: 2.0 (Exhaustive Architectural & Implementation Blueprint)  
> **Last Updated**: July 2026  
> **Project Directory**: `/Users/abhisheksingh/Desktop/Bec Website`  

---

## 1. Executive Summary & Brand Identity

### Practice Overview
- **Brand / Entity Name**: The Black Lantern Clinic
- **Clinical Domain**: Private Specialist Youth Mental Health Clinic & Psychotherapy Practice
- **Demographic Focus**: Young people aged 12 to 25, alongside their families and carers.
- **Location**: Brisbane, Queensland, Australia (Servicing greater Brisbane & QLD region).
- **Contact Channels**:
  - **Phone**: `0418 542 638` (`+61418542638`)
  - **Email**: `admin@theblacklanternclinic.com`
  - **Hours**: Monday – Friday: 09:00 – 17:00 | Saturday: By appointment
  - **Emergency / Crisis Warning**: Explicitly non-crisis service; directs emergencies to 000, Lifeline (`13 11 14`), or 24/7 MH Call (`1300 642 255`).

### Brand Ethos & Visual Philosophy
- **Metaphor**: *"A steady light, when the path feels uncertain."* The lantern symbolizes clarity, guidance, safety, and warmth for young people facing mental health complexity.
- **Founders & Leadership**:
  1. **Dr. Joel Adams-Bedford** (Clinical Director & Co-Founder) — Child & Adolescent Psychiatrist (`FRANZCP` with subspecialty certificate in child & adolescent psychiatry). Specializes in complex, hard-to-reach cases, neurodevelopmental disorders, and adolescent mood disorders.
  2. **Rebecca Willis** (Practice Director & Co-Founder) — Psychotherapist & Practice Director (`BSW`, completing Grad Dip in Psychology). Focuses on trauma-informed care (EMDR), client intake, billing equity, and operational excellence.

---

## 2. Complete Technical Stack & Environment

| Layer / Concern | Technology / Library | Version | Notes / Purpose |
|---|---|---|---|
| **Core Framework** | React | `^19.2.7` | UI library using functional components & hooks |
| **DOM Renderer** | React DOM | `^19.2.7` | React virtual DOM mounting |
| **Type System** | TypeScript | `~6.0.2` | Strict typing with `tsconfig.app.json` |
| **Build Tool / Bundler** | Vite | `^8.1.1` | Ultra-fast HMR dev server & ESBuild/Rollup production bundler |
| **React Vite Plugin** | `@vitejs/plugin-react` | `^6.0.3` | Fast Refresh support for JSX/TSX |
| **Routing Engine** | React Router DOM | `^7.18.1` | Declarative client-side SPA routing |
| **Icon Library** | Lucide React | `^1.23.0` | SVG vector icons (`ArrowUp`, `Microscope`, `Flame`, `Leaf`, `Compass`, `Users`, `Repeat2`) |
| **Code Linting** | Oxlint | `^1.71.0` | High-performance Rust-based linter |
| **Styling Architecture** | Vanilla CSS | CSS3 | CSS Custom Properties (Design Tokens), zero UI framework overhead |
| **Font Integration** | Google Fonts | Web | `Spectral` (serif), `Poppins` (sans-serif), `Cinzel` (display) |
| **Backend Integration** | WordPress / Fluent Forms API | External REST | Form submissions targeting `https://api.theblacklanternclinic.com/wp-admin/admin-ajax.php` |

---

## 3. Exhaustive Project Directory Architecture

```
bec-website/
├── public/                               # Public static assets served directly
│   ├── about.webp                        # Practice reception & clinic environment image
│   ├── about_approach_meeting.webp       # Care meeting / collaborative room image
│   ├── about_approach_play.webp          # Welcoming clinic room environment image
│   ├── about_story.webp                  # Dedicated therapy room photo
│   ├── black-lan.webp                    # Dark lantern emblem logo (for light backgrounds)
│   ├── white-lan.webp                    # White lantern emblem logo (for dark transparent nav)
│   ├── hero-bg.mp4                       # High-definition video background for Hero
│   ├── hero-bg.webm                      # WebM compressed background video for Hero
│   ├── hero-sec-bg.png                   # Emblem overlay image for Hero banner
│   ├── og-image.png                      # Social media share preview card image (1200x630)
│   ├── policy_hero.webp                  # Page hero banner background image for inner pages
│   ├── services_psychiatry_brain.webp    # Psychiatry illustration graphic
│   ├── team_joel.webp                    # Professional portrait: Dr. Joel Adams-Bedford
│   ├── team_rebecca.webp                 # Professional portrait: Rebecca Willis
│   └── therapy.webp                      # Therapy session illustration photo
├── src/
│   ├── assets/                           # Internal graphic assets
│   ├── components/                       # Core UI & structural components (8 components)
│   │   ├── ContactCtaBanner.tsx          # Reusable dark CTA banner driving bookings/enquiries
│   │   ├── Footer.tsx                    # Site-wide footer with nav, address, crisis info & copyright
│   │   ├── Navbar.tsx                    # Adaptive header with logo, drawer menu, and dock auto-hide
│   │   ├── PageHero.tsx                  # Standard inner page top hero banner
│   │   ├── RevealImg.tsx                 # Scroll-triggered image reveal container component
│   │   ├── SEO.tsx                       # Dynamic SEO head, meta tags, and JSON-LD schema builder
│   │   ├── ScrollToTop.tsx               # Route listener auto-resetting window scroll position
│   │   └── SmokyBackground.tsx           # Procedural HTML5 canvas smoke & ember particle animation
│   ├── hooks/                            # Custom React Hooks
│   │   └── useScrollAnimations.ts        # IntersectionObserver hook toggling `.in-view` state
│   ├── pages/                            # Route View Components (8 Pages)
│   │   ├── About.tsx                     # Practice story, ethos, values, and approach
│   │   ├── CancellationPolicy.tsx        # Cancellation & appointment rescheduling rules (July 2026)
│   │   ├── Contact.tsx                   # Interactive intake form, hours, contact info & map details
│   │   ├── Home.tsx                      # Landing page with video hero, Brisbane clock, previews & CTA
│   │   ├── Privacy.tsx                   # Privacy Policy aligned with Privacy Act 1988 (Cth) (July 2026)
│   │   ├── Services.tsx                  # Psychiatry & Therapy offerings breakdown
│   │   ├── Team.tsx                      # Clinician biographies, qualifications & credentials
│   │   └── Terms.tsx                     # Terms of Service with QLD jurisdiction & ACL guarantees (July 2026)
│   ├── App.css                           # Structural layout CSS, section padding, forms & page styles
│   ├── App.tsx                           # Main application wrapper with Router layout
│   ├── index.css                         # CSS custom properties (tokens), typography reset & keyframes
│   └── main.tsx                          # React entry point mounting App into `#root`
├── .gitignore                            # Version control exclusion rules
├── .oxlintrc.json                        # Oxlint linter rules
├── dist/                                 # Compiled production build directory
├── index.html                            # Root HTML template with preconnect Google Fonts
├── memory.md                             # Comprehensive project documentation (This file)
├── package.json                          # Manifest, scripts & dependency declaration
├── tsconfig.app.json                     # App TypeScript compiler options
├── tsconfig.json                         # Project root TypeScript config
├── tsconfig.node.json                    # Node scripts TypeScript config
└── vite.config.ts                        # Vite build & server config
```

---

## 4. In-Depth Page Architecture & Feature Breakdown

### Page 1: Home Page (`src/pages/Home.tsx` | Route: `/`)
- **Visual Features**:
  - **Background Video Hero**: Plays `/hero-bg.mp4` / `/hero-bg.webm` at `1.4x` playback rate with an ambient dark gradient overlay (`.hero__video-overlay`).
  - **Live Brisbane Clock**: Displays live local time in Brisbane (`Australia/Brisbane` timezone, 24-hour format) updated every second.
  - **Interactive Hero Emblem / Scroll Down Button**: Animated SVG equalizer bar icon smooth-scrolling to the content section on click.
  - **About Snippet**: Displays the core quote *"A steady light, when the path feels uncertain."* alongside an image reveal (`/about.webp`).
  - **Services Preview Grid**: 3-column layout featuring Psychiatry (`/services_psychiatry_brain.webp`) and Therapy (`/therapy.webp`).
  - **Team Preview**: Interactive cards highlighting Dr. Joel Adams-Bedford and Rebecca Willis.
- **SEO Title**: `The Black Lantern Clinic | Specialist Youth Psychiatry & Therapy Brisbane`

---

### Page 2: About Page (`src/pages/About.tsx` | Route: `/about`)
- **Core Sections**:
  1. **Page Hero Banner**: Title "Who we are" with backdrop image `/policy_hero.webp`.
  2. **Clinic Story**: Narrative explaining the clinic's name and founding vision with `/about_story.webp`.
  3. **Our 6 Core Values Grid** (with Lucide icons):
     - `Evidence-based` (`<Microscope>`): Grounded in clinical research.
     - `Person-centred` (`<Flame>`): Client voice at the center.
     - `Trauma-informed` (`<Leaf>`): Safe, predictable, pressure-free environment.
     - `Developmentally appropriate` (`<Compass>`): Calibrated to developmental stage.
     - `Collaborative` (`<Users>`): Connected care with GPs, schools, and families.
     - `Continuity of care` (`<Repeat2>`): Consistent clinicians throughout care.
  4. **Therapeutic Approach Rows**:
     - `01 — Our approach`: Person-centred care from first contact (`/about_approach_play.webp`).
     - `02 — How we work`: Collaborative care preventing fragmentation (`/about_approach_meeting.webp`).
- **SEO Title**: `Who We Are | The Black Lantern Clinic Brisbane`

---

### Page 3: Team Page (`src/pages/Team.tsx` | Route: `/team`)
- **Content Details**:
  - **Introduction**: Emphasizes a small, dedicated team providing consistent care without a "revolving door".
  - **Clinician Profiles**:
    1. **Dr. Joel Adams-Bedford** (Clinical Director & Child and Adolescent Psychiatrist):
       - Credentials: `FRANZCP | Sub-specialty certificate in child and adolescent psychiatry`.
       - Experience: 10+ years across QLD Children's Hospital adolescent inpatient unit, acute response team, youth detention settings in NSW/ACT. Focus on complex, hard-to-reach cases and neurodevelopmental/mood disorders.
    2. **Rebecca Willis** (Practice Director & Psychotherapist):
       - Credentials: `BSW | Currently completing Graduate Diploma of Psychology`.
       - Experience: 5+ years across Queensland Health, Dept of Education, Youth Justice. Trained in EMDR therapy. Manages operations, fee equity, and intake coordination.
  - **Admin & Support Team Note**: Highlights the warm administration staff supporting billing, appointments, and referrals.
- **SEO Title**: `Meet Our Team | The Black Lantern Clinic Brisbane`

---

### Page 4: Services Page (`src/pages/Services.tsx` | Route: `/services`)
- **Service Offerings**:
  1. **Psychiatry Services** (Led by Dr. Joel Adams-Bedford):
     - Comprehensive psychiatric assessment, formulation, diagnosis, and ongoing medical management.
     - Focus Areas: Mood Disorders, Neurodevelopmental Disorders (ADHD, ASD), Anxiety Disorders, Trauma and Personality Concerns, Deliberate Self-Harm.
  2. **Therapy & Psychotherapy Services**:
     - Evidence-based psychological treatments matched to individual developmental needs.
     - Focus Areas: Anxiety and worry, Depression and low mood, Trauma and PTSD (including EMDR), Emotional regulation difficulties, Life transitions and adjustment.
- **SEO Title**: `Youth Psychiatry & Therapy Services | The Black Lantern Clinic`

---

### Page 5: Contact Page (`src/pages/Contact.tsx` | Route: `/contact`)
- **Layout Architecture**:
  - **Left Section**: Dark ambient background video (`/hero-bg.webm`) with overlay, operating hours, support channels, direct email link (`admin@theblacklanternclinic.com`), phone link (`0418 542 638`), and prominent Crisis Support notice.
  - **Right Section**: Floating white card housing the interactive contact form.
- **Form Data & Validation Logic**:
  - State Fields: `firstName`, `lastName`, `email`, `phone`, `message`, `acceptedTerms`.
  - Phone Validation: Validates for minimum 6 digits before allowing submission.
  - Form Action: POST payload to `https://api.theblacklanternclinic.com/wp-admin/admin-ajax.php` with `action: fluentform_submit` and `form_id: 3`.
- **SEO Title**: `Contact Us | The Black Lantern Clinic Brisbane`

---

### Page 6: Privacy Policy Page (`src/pages/Privacy.tsx` | Route: `/privacy`)
- **Key Provisions** *(Last Updated: July 2026)*:
  - Aligned with the **Privacy Act 1988 (Cth)** and Australian Privacy Principles (APPs).
  - Outlines collection of sensitive health information (clinical notes, diagnosis, assessment results).
  - Explicit provisions for information disclosure:
    - Other treating health professionals with consent or where permitted under Privacy Act 1988 (Cth).
    - **Child protection and child safety authorities**, where required under **Queensland child protection law**.
    - Medicare Australia, health insurers, regulatory bodies, and emergency services.
  - Health record retention rules: Minimum 7 years from last contact, or until a child reaches age 25.
- **SEO Title**: `Privacy Policy | The Black Lantern Clinic`

---

### Page 7: Terms & Conditions Page (`src/pages/Terms.tsx` | Route: `/terms`)
- **Key Legal Terms** *(Last Updated: July 2026)*:
  - **Governing Law**: Governed by the laws of **Queensland, Australia**, subject to the exclusive jurisdiction of the courts of Queensland.
  - **Limitation of Liability**: Contains mandatory **Australian Consumer Law (ACL)** guarantee statement: *"Nothing in these Terms excludes, restricts or modifies any consumer guarantee, right or remedy you have under the Australian Consumer Law or any other law that cannot lawfully be excluded."*
  - Client responsibilities, cancellation terms, and email contact guidelines (`admin@theblacklanternclinic.com`).
- **SEO Title**: `Terms and Conditions | The Black Lantern Clinic`

---

### Page 8: Cancellation Policy Page (`src/pages/CancellationPolicy.tsx` | Route: `/cancellation-policy`)
- **Key Policies** *(Last Updated: July 2026)*:
  - Explains the clinic's appointment reservation framework, notice period rules, and fee structures for late cancellations/non-attendance to protect clinician scheduling.
- **SEO Title**: `Cancellation Policy | The Black Lantern Clinic`

---

## 5. Design System, Typography & CSS Architecture

### CSS Custom Properties (`src/index.css`)

```css
:root {
  /* Color Palette */
  --color-bg:            #FAF8F3;  /* Warm Cream */
  --color-bg-alt:        #F0EBE1;  /* Soft Beige */
  --color-dark:          #1C1F2A;  /* Deep Charcoal */
  --color-dark-2:        #141720;  /* Dark Navy Charcoal */
  --color-text:          #2A2624;  /* Deep Warm Espresso */
  --color-text-muted:    #7A7068;  /* Muted Taupe */
  --color-text-alt:      #FAF8F3;  /* Off-White Text */
  --color-accent:        #B8956A;  /* Bronze / Gold Accent */
  --color-accent-dark:   #8C6E48;  /* Dark Bronze */
  --color-sage:          #7A9E8E;  /* Calming Sage Green */
  --color-border:        rgba(184, 149, 106, 0.25);
  --color-border-dark:   rgba(250, 248, 243, 0.12);
  --color-border-light:  rgba(42, 38, 36, 0.12);
  --color-border-medium: rgba(42, 38, 36, 0.25);

  /* Typography */
  --font-serif:    'Spectral', Georgia, serif;
  --font-sans:     'Poppins', system-ui, -apple-system, sans-serif;

  /* Spacing Scale */
  --space-xs:  0.5rem;
  --space-sm:  1rem;
  --space-md:  2rem;
  --space-lg:  3rem;
  --space-xl:  4rem;
  --space-2xl: 5rem;

  /* Responsive Layout & Fluid Containers */
  --max-width:        1320px;
  --padding-x:        clamp(1.5rem, 3vw, 3rem);
  --padding-x-inner:  clamp(1.5rem, 3.5vw, 4rem);
  --hero-padding:     clamp(1.5rem, 3vw, 2.5rem);
  --section-py:       clamp(2.5rem, 5vw, 4rem);
  --nav-height:       60px;

  /* Transitions */
  --transition:       0.35s ease;
  --transition-fast:  0.2s ease;
}
```

### Motion & Animation System
- **`useScrollAnimations` Hook**: Uses native `IntersectionObserver` (`threshold: 0.1`, `rootMargin: '0px 0px -50px 0px'`) to observe `.fade-up`, `.fade-in`, and `.img-reveal` elements. Adds `.in-view` class upon viewport intersection.
- **Stagger Delays**: `.stagger-1` (100ms), `.stagger-2` (200ms), `.stagger-3` (300ms) for grid card stagger effects.

---

## 6. Interactive Canvas Engine (`SmokyBackground.tsx`)

`SmokyBackground.tsx` renders a custom procedural particle simulation on an HTML5 `<canvas>`:
1. **Smoke Texture Pre-rendering**: Generates an offscreen radial gradient canvas (256x256) with multi-stop alpha transitions (`rgba(235,230,220,0.45)` down to `rgba(15,18,25,0)`) for fast blitting.
2. **Physics Simulation**:
   - **Smoke Particles**: Particle lifespan (`300` to `700` frames), radial expansion/growth (`0.12` to `0.32` px/frame), upward buoyancy drift, rotational velocity, and mouse-follow wind offset (`mouseX`, `mouseY`).
   - **Ember Particles**: Optional glowing embers drifting upwards with sinusoidal phase pulsing (`pulseSpeed`, `pulsePhase`) and warm gold/orange hues (`rgba(220,170,110,...)`).
3. **Accessibility**: Checks `window.matchMedia('(prefers-reduced-motion: reduce)')` to automatically lower particle speeds and disable continuous rotation for motion-sensitive users.

---

## 7. SEO Infrastructure & JSON-LD Graph (`SEO.tsx`)

`SEO.tsx` dynamically modifies `document.title`, `<meta>` tags, canonical `<link>` tags, and injects a complete **Schema.org JSON-LD graph** into the document `<head>`:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalClinic",
      "@id": "https://theblacklanternclinic.com/#clinic",
      "name": "The Black Lantern Clinic",
      "url": "https://theblacklanternclinic.com",
      "logo": "https://theblacklanternclinic.com/black-lan.webp",
      "telephone": "0418 542 638",
      "email": "admin@theblacklanternclinic.com",
      "medicalSpecialty": ["Psychiatric", "Psychotherapy", "Pediatric"],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Brisbane",
        "addressRegion": "QLD",
        "addressCountry": "AU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -27.4698,
        "longitude": 153.0251
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "17:00"
        }
      ]
    },
    {
      "@type": "Physician",
      "@id": "https://theblacklanternclinic.com/#joel-adams-bedford",
      "name": "Dr. Joel Adams-Bedford",
      "jobTitle": "Child & Adolescent Psychiatrist",
      "medicalSpecialty": "Psychiatric"
    }
  ]
}
```

---

## 8. Verified Build Statistics & Operational Health

- **Production Build Tool**: Vite v8.1.3 + TypeScript Compiler (`tsc -b`)
- **Compilation Log**:
  - `✓ 1797 modules transformed.`
  - `dist/index.html` (3.26 kB | gzip: 1.05 kB)
  - `dist/assets/index-Z9ptpHC2.css` (53.53 kB | gzip: 10.01 kB)
  - `dist/assets/index-ChJwp7uN.js` (293.91 kB | gzip: 90.88 kB)
  - `✓ built in ~374ms`
- **Linting & Code Quality**: Clean execution via `oxlint` with 0 warnings and 0 syntax errors.
