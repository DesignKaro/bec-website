import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import staticSiteContent from '../data/siteContent.json'

export interface SiteHeader {
  phone: string
  email: string
  location: string
  booking_text: string
  booking_url: string
  instagram: string
}

export interface SiteGeneral {
  phone: string
  email: string
  hours: string
  sat_hours: string
  address?: string
  location_text: string
  instagram_url: string
  booking_btn_text: string
  booking_url: string
  crisis_text: string
}

export interface SiteFooter {
  bg: string
  brand_desc: string
  hours: string
  sat_hours: string
  crisis_title: string
  crisis_text: string
  copyright: string
  credit: string
}

export interface SiteHeroes {
  home_title: string
  home_subtitle: string
  home_bg: string
  subpage_bg: string
  footer_bg: string
}

export interface SiteHomepage {
  hero_title: string
  hero_subtitle: string
  hero_bg: string
  hero_emblem: string
  hero_btn_text: string
  hero_btn_url: string
  about_eyebrow?: string
  about_title?: string
  about_body?: string
  about_link_text?: string
  about_link_url?: string
  about_img?: string
  services_title: string
  team_title: string
}

export interface SiteCta {
  title: string
  body: string
  btn_text: string
}

export interface ValueCardDetail {
  title: string
  desc: string
}

export interface SiteAbout {
  hero_title: string
  hero_bg: string
  story_eyebrow?: string
  story_title: string
  story_p1: string
  story_img: string
  values_eyebrow?: string
  values_title?: string
  values_list?: ValueCardDetail[]
  app1_num?: string
  app1_title?: string
  app1_body?: string
  app1_img?: string
  app2_num?: string
  app2_title?: string
  app2_body?: string
  app2_img?: string
  cta_title?: string
  cta_body?: string
}

export interface ServiceDetail {
  num: string
  title: string
  tagline: string
  desc: string
  bullets: string[]
  photo: string
}

export interface SiteServicesPage {
  hero_title: string
  hero_bg: string
  intro_eyebrow?: string
  intro_title: string
  intro_body?: string
  service1?: ServiceDetail
  service2?: ServiceDetail
  cta_title?: string
  cta_body?: string
}

export interface TeamMemberDetail {
  name: string
  role: string
  creds: string
  photo: string
  bio: string[]
  reversed?: boolean
}

export interface SiteTeamPage {
  hero_title: string
  hero_bg: string
  intro_title?: string
  intro_body?: string
  member1?: TeamMemberDetail
  member2?: TeamMemberDetail
  support_eyebrow?: string
  support_title?: string
  support_body?: string
  cta_title?: string
  cta_body?: string
}

export interface SiteContactPage {
  hero_title: string
  hero_bg: string
  card_title: string
  card_subtitle: string
}

export interface SiteSeo {
  home_title: string
  home_desc: string
  og_image: string
}

export interface SiteService {
  id?: number | string
  num?: string
  title: string
  image?: string
  content?: string
}

export interface SiteTeamMember {
  id?: number | string
  name: string
  role: string
  photo: string
}

export interface SiteLegalPage {
  hero_title: string
  hero_bg: string
  updated_date: string
  content: string
}

export interface SiteContent {
  header: SiteHeader
  general: SiteGeneral
  footer: SiteFooter
  heroes: SiteHeroes
  homepage: SiteHomepage
  cta: SiteCta
  about: SiteAbout
  services_page: SiteServicesPage
  team_page: SiteTeamPage
  contact_page: SiteContactPage
  privacy_page: SiteLegalPage
  terms_page: SiteLegalPage
  cancellation_page: SiteLegalPage
  seo: SiteSeo
  services: SiteService[]
  team: SiteTeamMember[]
}

export interface SiteContentContextType extends SiteContent {
  isReady: boolean
  isSyncing: boolean
  lastSynced: Date | null
  syncVersion: number | null
  syncError: string | null
  isPreviewMode: boolean
  revalidate: (silent?: boolean) => Promise<void>
}

function normalizeImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''

  // Known WordPress upload PNG / remote URL mappings to local optimized WebP
  if (trimmed.includes('ChatGPT-Image-Aug-7-2026-12_02_35-PM')) return '/hero-bg.webp'
  if (trimmed.includes('ChatGPT-Image-Aug-7-2026-11_51_39-AM-1')) return '/page-hero-bg.webp'
  if (trimmed.includes('ChatGPT-Image-Aug-7-2026-11_51_39-AM-3')) return '/services_hero.webp'
  if (trimmed.includes('ChatGPT-Image-Aug-7-2026-11_51_39-AM-4')) return '/team_hero.webp'
  if (trimmed.includes('ChatGPT-Image-Aug-7-2026-11_58_34-AM')) return '/contact_hero.webp'
  if (trimmed.includes('ChatGPT-Image-Aug-7-2026-11_51_39-AM-2')) return '/policy_hero.webp'
  if (trimmed.includes('ChatGPT-Image-Aug-7-2026-12_18_01-PM')) return '/footer-bg.webp'
  if (trimmed.includes('ChatGPT-Image-Aug-7-2026-12_30_34-PM')) return '/ChatGPT-Image-Aug-7-2026-12_30_34-PM.webp'
  if (trimmed.includes('13296FD4-B837-4486-855B-5CBF95E5B91D')) return '/13296FD4-B837-4486-855B-5CBF95E5B91D.webp'
  if (trimmed.includes('ACCEEEC9-6149-4864-B4F7-F1761C29EE48')) return '/ACCEEEC9-6149-4864-B4F7-F1761C29EE48.webp'

  // September 2026 uploads (downloaded to public)
  if (trimmed.includes('IMG_5497.jpeg')) return '/IMG_5497.jpeg'
  if (trimmed.includes('IMG_5493.jpeg')) return '/IMG_5493.jpeg'
  if (trimmed.includes('Image-24-9-2026-at-7.40-pm.png')) return '/Image-24-9-2026-at-7.40-pm.png'
  if (trimmed.includes('IMG_5496.jpeg')) return '/IMG_5496.jpeg'

  // Convert any absolute URL for the clinic domain or WP domain to relative local path
  if (trimmed.startsWith('https://theblacklanternclinic.com/')) {
    return '/' + trimmed.replace('https://theblacklanternclinic.com/', '')
  }
  if (trimmed.startsWith('http://theblacklanternclinic.com/')) {
    return '/' + trimmed.replace('http://theblacklanternclinic.com/', '')
  }
  if (trimmed.startsWith('https://api.theblacklanternclinic.com/wp-content/uploads/2026/08/team_rebecca.webp')) {
    return '/team_rebecca.webp'
  }

  return trimmed
}

const DEFAULT_CONTENT: SiteContent = {
  header: {
    phone: '0418 542 638',
    email: 'admin@theblacklanternclinic.com',
    location: 'Youth Mental Health · Brisbane, Queensland',
    booking_text: 'Book an appointment',
    booking_url: '/contact',
    instagram: 'https://www.instagram.com/theblacklanternclinic?stkn=OW0xZXd4MmVicGdx&utm_source=qr',
  },
  general: {
    phone: '0418 542 638',
    email: 'admin@theblacklanternclinic.com',
    hours: 'Tues – Fri: 9am – 6pm',
    sat_hours: 'Sat: 10am - 4:30pm',
    address: '195 Fingal Street, Tarragindi 4121',
    location_text: 'Youth Mental Health · Brisbane, Queensland',
    instagram_url: 'https://www.instagram.com/theblacklanternclinic?stkn=OW0xZXd4MmVicGdx&utm_source=qr',
    booking_btn_text: 'Book an appointment',
    booking_url: '/contact',
    crisis_text:
      'The Black Lantern Clinic is not a crisis clinic, if you are experiencing a mental health crisis or emergency please contact 000 or lifeline 13 11 14 or 24/7 MH Call 1300 642 255',
  },
  footer: {
    bg: '/footer-bg.webp',
    brand_desc: 'Specialist psychiatric and mental health care for young people aged 12 to 25.',
    hours: 'Tues – Fri: 9am – 6pm',
    sat_hours: 'Sat: 10am - 4:30pm',
    crisis_title: 'Crisis Support',
    crisis_text:
      'The Black Lantern Clinic is not a crisis clinic, if you are experiencing a mental health crisis or emergency please contact 000 or lifeline 13 11 14 or 24/7 MH Call 1300 642 255',
    copyright: 'The Black Lantern Clinic',
    credit: '195 Fingal Street, Tarragindi 4121',
  },
  heroes: {
    home_title: 'Private Youth Mental Health Clinic in Brisbane',
    home_subtitle:
      'Psychiatric assessment, treatment and therapeutic support for young people aged 12–25 from our clinic in Tarragindi, Brisbane.',
    home_bg: '/hero-bg.webp',
    subpage_bg: '/page-hero-bg.webp',
    footer_bg: '/footer-bg.webp',
  },
  homepage: {
    hero_title: 'Private Youth Mental Health Clinic in Brisbane',
    hero_subtitle:
      'Psychiatric assessment, treatment and therapeutic support for young people aged 12–25 from our clinic in Tarragindi, Brisbane.',
    hero_bg: '/hero-bg.webp',
    hero_emblem: '/hero-sec-bg.webp',
    hero_btn_text: 'Get in Touch',
    hero_btn_url: '/contact',
    about_eyebrow: 'About the clinic',
    about_title: '"Light for the path ahead"',
    about_body:
      'The Black Lantern Clinic provides specialist mental health care for young people aged 12–25 in Brisbane, with families and carers involved where this supports their care. Our name reflects the way we think about mental health care, a lantern doesn’t remove the darkness, it offers light when the way forward feels unclear. We aim to offer that same sense of clarity, helping young people understand what they’re experiencing, find a way forward, and feel less alone along the way.',
    about_link_text: 'Learn about us',
    about_link_url: '/about',
    about_img: '/about.webp',
    services_title: 'Specialist care for young people',
    team_title: 'Meet our team',
  },
  cta: {
    title: 'Ready to take the first step?',
    body: "We know reaching out can feel like a big step. Our team is here to answer your questions and help you work out if we're the right fit — no pressure, no obligation.",
    btn_text: 'Get in Touch',
  },
  about: {
    hero_title: 'Who we are',
    hero_bg: '/IMG_5497.jpeg',
    story_eyebrow: 'Our story',
    story_title: '"Helping you find your way through."',
    story_p1:
      'The Black Lantern Clinic is a private specialist youth mental health clinic in Brisbane, Queensland. We see young people aged 12 to 25, and where it helps, their families and carers too. Our clinic’s philosophy is in our name, like a lantern, we aim to provide a guiding light to illuminate the darkness and show you the path forward.',
    story_img: '/IMG_5493.jpeg',
    values_eyebrow: 'What we stand for',
    values_title: 'Our values',
    values_list: [
      {
        title: 'Evidence-based',
        desc: "Everything we do is grounded in the best available clinical research. We don't guess — we rely on what the evidence actually shows.",
      },
      {
        title: 'Person-centred',
        desc: "Your goals and your voice sit at the centre of everything. We're here for you — not a diagnosis, not a checklist.",
      },
      {
        title: 'Trauma-informed',
        desc: 'We know many young people have been through hard things. Our clinic is designed to feel safe, predictable, and free of pressure.',
      },
      {
        title: 'Developmentally appropriate',
        desc: 'We calibrate our approach to where you actually are — not just how old you are. Development is not one-size-fits-all.',
      },
      {
        title: 'Collaborative',
        desc: 'With your consent, we work alongside your GP, school, family, and other supports to make sure care is connected, not fragmented.',
      },
      {
        title: 'Continuity of care',
        desc: "You'll see the same clinicians throughout your care. We think that matters — and the evidence agrees. No revolving door.",
      },
    ],
    app1_num: '01 - Our approach',
    app1_title: 'Person-centred care, from the very first contact',
    app1_body:
      "From the first enquiry, you'll be met with clarity and warmth. We take time to understand each young person's situation before recommending any pathway. No assumptions, no rushing — just honest conversation about what might actually help.",
    app1_img: '/Image-24-9-2026-at-7.40-pm.png',
    app2_num: '02 - How we work',
    app2_title: "We don't work in isolation",
    app2_body:
      "Mental health doesn't happen in a vacuum. With your consent, we work alongside your GP, school, family, and other supports to make sure care is connected, not fragmented.",
    app2_img: '/IMG_5496.jpeg',
    cta_title: "Want to know if we're the right fit?",
    cta_body:
      "You're welcome to call or email before making a referral or booking. We're happy to answer questions about our services, fees, or how to get started — no commitment required.",
  },
  services_page: {
    hero_title: 'Youth Mental Health Services in Brisbane',
    hero_bg: '/services_hero.webp',
    intro_eyebrow: 'Our services',
    intro_title: 'Youth Psychiatry & Mental Health Care in Brisbane',
    intro_body:
      'The Black Lantern Clinic is a private specialist mental health clinic in Tarragindi, Brisbane, providing psychiatric and therapeutic care for young people aged 12–25.',
    service1: {
      num: '01',
      title: 'Psychiatry',
      tagline: 'Specialist psychiatry for adolescents and young adults',
      desc: 'Our psychiatry service is led by Dr Joel Adams-Bedford, a consultant psychiatrist with experience working with children, adolescents and young adults. He provides comprehensive psychiatric assessment, formulation and treatment planning for young people presenting with a range of mental health and neurodevelopmental concerns. Care is collaborative and individualised, with families and carers involved where appropriate.',
      bullets: [
        'Mood and depressive disorders',
        'Anxiety disorders',
        'ADHD and neurodevelopmental conditions',
        'Autism spectrum presentations',
        'Trauma-related concerns',
        'Emotional regulation and personality-related difficulties',
        'Medication assessment and management',
        'Diagnostic assessment and treatment planning',
      ],
      photo: '/services_psychiatry_brain.webp',
    },
    service2: {
      num: '02',
      title: 'Youth Therapy & Psychotherapy',
      tagline: 'Evidence-informed therapy for adolescents and young adults',
      desc: 'Our therapy service supports young people aged 12–25 with anxiety, low mood, trauma-related concerns, emotional regulation difficulties, stress and life transitions. We offer individual therapy tailored to each person’s goals, developmental stage and needs, including EMDR where clinically appropriate. Families and carers can be involved where helpful.',
      bullets: [
        'Anxiety and excessive worry',
        'Low mood and depression',
        'Trauma and PTSD',
        'EMDR',
        'Emotional regulation difficulties',
        'Stress and adjustment',
        'Life transitions and identity concerns',
      ],
      photo: '/therapy.webp',
    },
    cta_title: 'Not sure which service is right?',
    cta_body:
      "Give us a call or send an email. We're happy to talk through your situation and help you work out the most appropriate pathway, before you make a booking.",
  },
  team_page: {
    hero_title: 'Meet Our Brisbane Mental Health Team',
    hero_bg: '/team_hero.webp',
    intro_title: 'A small, dedicated team',
    intro_body:
      'We’re a small, dedicated mental health team based in Tarragindi, Brisbane. That means you’ll work with clinicians who know you, the same people across your care, not a rotation of unfamiliar faces. Our team is committed to thoughtful, individualised care for young people and their families.',
    member1: {
      name: 'Dr. Joel Adams-Bedford',
      role: 'Clinical Director & Consultant Child and Adolescent Psychiatrist',
      creds: 'FRANZCP | Subspecialty Certificate in Child and Adolescent Psychiatry',
      photo: '/team_joel.webp',
      bio: [
        "Dr Joel Adams-Bedford is a consultant child and adolescent psychiatrist and co-founder of The Black Lantern Clinic in Tarragindi, Brisbane. He holds Fellowship of the Royal Australian and New Zealand College of Psychiatrists (FRANZCP), with subspecialty training in child and adolescent psychiatry, and has more than a decade of clinical experience across public and private mental health settings.",
        "Joel works with adolescents and young adults experiencing a range of mental health and neurodevelopmental concerns. His clinical interests include ADHD, autism and other neurodevelopmental presentations, mood disorders, anxiety and complex mental health presentations. He provides psychiatric assessment, formulation, treatment planning and medication management, with care tailored to each young person’s individual needs.",
        "His approach is collaborative and person-centred, with young people actively involved in decisions about their care and families or carers included where helpful.",
      ],
      reversed: false,
    },
    member2: {
      name: 'Rebecca Willis',
      role: 'Practice Director | Social Worker & Psychotherapist',
      creds: 'BSW | AASW Member | Graduate Diploma of Psychology (in progress)',
      photo: '/team_rebecca.webp',
      bio: [
        "Rebecca Willis is a social worker, psychotherapist and co-founder of The Black Lantern Clinic in Tarragindi, Brisbane. She has extensive experience working with children, adolescents and young adults across public mental health, education and youth justice settings.",
        "Rebecca provides therapeutic support to young people aged 12–25 experiencing anxiety, low mood, trauma-related concerns, emotional regulation difficulties, stress and life transitions. Her approach is collaborative, practical and tailored to each young person’s individual needs, with families and carers involved where helpful.",
        "Rebecca holds a Bachelor of Social Work and is a member of the Australian Association of Social Workers. She has undertaken further professional development in evidence-informed therapeutic approaches and is completing postgraduate study in psychology.",
        "Alongside her clinical work, Rebecca is the Practice Director of The Black Lantern Clinic and oversees the clinic’s day-to-day operations, helping ensure young people and families experience coordinated, accessible and supportive care.",
      ],
      reversed: true,
    },
    support_eyebrow: 'Behind the scenes',
    support_title: 'Our admin team',
    support_body:
      "Behind our clinicians is a small, warm admin team. They're your first point of contact for questions about referrals, fees, bookings, and anything else. If you're not sure where to start, just ask, they'll point you in the right direction.",
    cta_title: "We'd love to hear from you",
    cta_body:
      "Our team is here to answer your questions and help you find the right pathway. Don't hesitate to get in touch, there's no wrong question.",
  },
  contact_page: {
    hero_title: 'Contact Our Mental Health Clinic in Tarragindi, Brisbane',
    hero_bg: '/contact_hero.webp',
    card_title: 'You have questions. We have time.',
    card_subtitle:
      "Whether you’re a young person, parent, carer or GP looking for psychiatry or therapeutic support, we’re happy to help. Our clinic is based in Tarragindi, Brisbane, and supports young people aged 12–25. You don’t need to have everything figured out before you get in touch.",
  },
  privacy_page: {
    hero_title: 'Privacy Policy',
    hero_bg: '/privacy_hero.webp',
    updated_date: 'Last updated: July 2026',
    content: '<h2>Introduction</h2><p>The Black Lantern Clinic ("we", "our", "us") is committed to protecting the privacy and confidentiality of our clients, their families, and all individuals who interact with our services.</p>',
  },
  terms_page: {
    hero_title: 'Terms & Conditions',
    hero_bg: '/terms_hero.webp',
    updated_date: 'Last updated: July 2026',
    content: '<h2>Agreement to Terms</h2><p>By accessing or using the services of The Black Lantern Clinic ("the Clinic"), you agree to be bound by these Terms and Conditions.</p>',
  },
  cancellation_page: {
    hero_title: 'Cancellation Policy',
    hero_bg: '/policy_hero.webp',
    updated_date: 'Last updated: July 2026',
    content: '<h2>Our Approach to Cancellations</h2><p>We ask that clients and families contact us as early as possible when an appointment cannot go ahead so we can offer that time to another person waiting for care.</p>',
  },
  seo: {
    home_title: 'Psychiatrist Brisbane | Youth Mental Health | The Black Lantern Clinic',
    home_desc:
      'Private youth mental health clinic in Tarragindi, Brisbane, providing psychiatric assessment, treatment and therapeutic support for young people aged 12–25.',
    og_image: '/og-image.webp',
  },
  services: [
    {
      num: '01',
      title: 'Psychiatry',
      content: 'Comprehensive psychiatric assessment, diagnosis, and medication management for young people.',
      image: '/services_psychiatry_brain.webp',
    },
    {
      num: '02',
      title: 'Therapy',
      content: 'Evidence-based individual psychotherapy including EMDR, CBT, and ACT tailored for adolescents and young adults.',
      image: '/therapy.webp',
    },
  ],
  team: [
    {
      name: 'Dr. Joel Adams-Bedford',
      role: 'Clinical Director & Consultant Child and Adolescent Psychiatrist',
      photo: '/team_joel.webp',
    },
    {
      name: 'Rebecca Willis',
      role: 'Practice Director | Social Worker & Psychotherapist',
      photo: '/team_rebecca.webp',
    },
  ],
}

const CACHE_KEY = 'bec_site_content_cache_v5'

function mergeSiteContent(defaults: SiteContent, data: any): SiteContent {
  if (!data || typeof data !== 'object') return defaults

  const mergedServicesPage: SiteServicesPage = {
    ...defaults.services_page,
    ...(data.services_page || {}),
    hero_bg: normalizeImageUrl(data.services_page?.hero_bg) || defaults.services_page.hero_bg,
  }
  if (data.services_page?.service1) {
    mergedServicesPage.service1 = {
      ...defaults.services_page.service1,
      ...data.services_page.service1,
      photo: normalizeImageUrl(data.services_page.service1.photo) || defaults.services_page.service1?.photo || '/services_psychiatry_brain.webp',
    }
  }
  if (data.services_page?.service2) {
    mergedServicesPage.service2 = {
      ...defaults.services_page.service2,
      ...data.services_page.service2,
      photo: normalizeImageUrl(data.services_page.service2.photo) || defaults.services_page.service2?.photo || '/therapy.webp',
    }
  }

  const mergedTeamPage: SiteTeamPage = {
    ...defaults.team_page,
    ...(data.team_page || {}),
    hero_bg: normalizeImageUrl(data.team_page?.hero_bg) || defaults.team_page.hero_bg,
  }
  if (data.team_page?.member1) {
    mergedTeamPage.member1 = {
      ...defaults.team_page.member1,
      ...data.team_page.member1,
      photo: normalizeImageUrl(data.team_page.member1.photo) || defaults.team_page.member1?.photo || '/team_joel.webp',
    }
  }
  if (data.team_page?.member2) {
    mergedTeamPage.member2 = {
      ...defaults.team_page.member2,
      ...data.team_page.member2,
      photo: normalizeImageUrl(data.team_page.member2.photo) || defaults.team_page.member2?.photo || '/team_rebecca.webp',
    }
  }

  // Derive services array cleanly, prioritizing user uploaded images from CPT or services_page
  let services: SiteService[] = defaults.services
  if (data.services && Array.isArray(data.services) && data.services.length > 0) {
    services = data.services.map((s: any) => {
      const normalizedImg = normalizeImageUrl(s.image)
      return {
        ...s,
        image: normalizedImg && normalizedImg.trim() !== ''
          ? normalizedImg
          : (s.title?.toLowerCase().includes('therapy') ? '/therapy.webp' : '/services_psychiatry_brain.webp')
      }
    })
  } else if (mergedServicesPage.service1 || mergedServicesPage.service2) {
    services = []
    if (mergedServicesPage.service1) {
      services.push({
        num: mergedServicesPage.service1.num || '01',
        title: mergedServicesPage.service1.title || 'Psychiatry',
        image: normalizeImageUrl(mergedServicesPage.service1.photo) || '/services_psychiatry_brain.webp'
      })
    }
    if (mergedServicesPage.service2) {
      services.push({
        num: mergedServicesPage.service2.num || '02',
        title: mergedServicesPage.service2.title || 'Therapy',
        image: normalizeImageUrl(mergedServicesPage.service2.photo) || '/therapy.webp'
      })
    }
  }

  // Derive team array cleanly, prioritizing user uploaded images from CPT or team_page
  let team: SiteTeamMember[] = defaults.team
  if (data.team && Array.isArray(data.team) && data.team.length > 0) {
    team = data.team.map((m: any) => {
      const normalizedPhoto = normalizeImageUrl(m.photo)
      return {
        ...m,
        photo: normalizedPhoto && normalizedPhoto.trim() !== ''
          ? normalizedPhoto
          : (m.name?.toLowerCase().includes('rebecca') ? '/team_rebecca.webp' : '/team_joel.webp')
      }
    })
  } else if (mergedTeamPage.member1 || mergedTeamPage.member2) {
    team = []
    if (mergedTeamPage.member1) {
      team.push({
        name: mergedTeamPage.member1.name || 'Dr. Joel Adams-Bedford',
        role: mergedTeamPage.member1.role || 'Clinical Director & Consultant Child and Adolescent Psychiatrist',
        photo: normalizeImageUrl(mergedTeamPage.member1.photo) || '/team_joel.webp'
      })
    }
    if (mergedTeamPage.member2) {
      team.push({
        name: mergedTeamPage.member2.name || 'Rebecca Willis',
        role: mergedTeamPage.member2.role || 'Practice Director | Social Worker & Psychotherapist',
        photo: normalizeImageUrl(mergedTeamPage.member2.photo) || '/team_rebecca.webp'
      })
    }
  }

  return {
    header: { ...defaults.header, ...(data.header || {}) },
    general: {
      ...defaults.general,
      ...(data.general || {}),
      address: data.general?.address || defaults.general.address,
      location_text: data.general?.location_text || defaults.general.location_text,
    },
    footer: {
      ...defaults.footer,
      ...(data.footer || {}),
      credit: data.footer?.credit || defaults.footer.credit,
      bg: normalizeImageUrl(data.footer?.bg) || defaults.footer.bg,
    },
    heroes: {
      ...defaults.heroes,
      ...(data.heroes || {}),
      home_bg: normalizeImageUrl(data.heroes?.home_bg) || defaults.heroes.home_bg,
      subpage_bg: normalizeImageUrl(data.heroes?.subpage_bg) || defaults.heroes.subpage_bg,
      footer_bg: normalizeImageUrl(data.heroes?.footer_bg) || defaults.heroes.footer_bg,
    },
    homepage: {
      ...defaults.homepage,
      ...(data.homepage || {}),
      hero_bg: normalizeImageUrl(data.homepage?.hero_bg) || defaults.homepage.hero_bg,
      hero_emblem: normalizeImageUrl(data.homepage?.hero_emblem) || defaults.homepage.hero_emblem,
      about_img: normalizeImageUrl(data.homepage?.about_img) || defaults.homepage.about_img,
    },
    cta: { ...defaults.cta, ...(data.cta || {}) },
    about: {
      ...defaults.about,
      ...(data.about || {}),
      hero_bg: normalizeImageUrl(data.about?.hero_bg) || defaults.about.hero_bg,
      story_img: normalizeImageUrl(data.about?.story_img) || defaults.about.story_img,
      app1_img: normalizeImageUrl(data.about?.app1_img) || defaults.about.app1_img,
      app2_img: normalizeImageUrl(data.about?.app2_img) || defaults.about.app2_img,
    },
    services_page: mergedServicesPage,
    team_page: mergedTeamPage,
    contact_page: {
      ...defaults.contact_page,
      ...(data.contact_page || {}),
      hero_bg: normalizeImageUrl(data.contact_page?.hero_bg) || defaults.contact_page.hero_bg,
    },
    privacy_page: {
      ...defaults.privacy_page,
      ...(data.privacy_page || {}),
      hero_bg: normalizeImageUrl(data.privacy_page?.hero_bg) || defaults.privacy_page.hero_bg,
    },
    terms_page: {
      ...defaults.terms_page,
      ...(data.terms_page || {}),
      hero_bg: normalizeImageUrl(data.terms_page?.hero_bg) || defaults.terms_page.hero_bg,
    },
    cancellation_page: {
      ...defaults.cancellation_page,
      ...(data.cancellation_page || {}),
      hero_bg: normalizeImageUrl(data.cancellation_page?.hero_bg) || defaults.cancellation_page.hero_bg,
    },
    seo: {
      ...defaults.seo,
      ...(data.seo || {}),
      og_image: normalizeImageUrl(data.seo?.og_image) || defaults.seo.og_image,
    },
    services,
    team,
  }
}

const INITIAL_CONTENT: SiteContent = mergeSiteContent(DEFAULT_CONTENT, staticSiteContent)

const getInitialContent = (): SiteContent => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed && typeof parsed === 'object') {
        return mergeSiteContent(INITIAL_CONTENT, parsed)
      }
    }
  } catch (err) {
    console.warn('Failed to read site content cache:', err)
  }
  return INITIAL_CONTENT
}

const hasCachedLiveContent = (): boolean => {
  if (typeof window === 'undefined') return false
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      return !!(parsed && typeof parsed === 'object' && (parsed.header || parsed.general || parsed.homepage))
    }
  } catch {}
  return false
}

const defaultContextValue: SiteContentContextType = {
  ...INITIAL_CONTENT,
  isReady: false,
  isSyncing: false,
  lastSynced: null,
  syncVersion: null,
  syncError: null,
  isPreviewMode: false,
  revalidate: async () => {},
}

const SiteContentContext = createContext<SiteContentContextType>(defaultContextValue)

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState<boolean>(hasCachedLiveContent)
  const [content, setContent] = useState<SiteContent>(getInitialContent)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [lastSynced, setLastSynced] = useState<Date | null>(() => {
    try {
      const ts = localStorage.getItem(`${CACHE_KEY}_time`)
      return ts ? new Date(Number(ts)) : null
    } catch {
      return null
    }
  })
  const [syncVersion, setSyncVersion] = useState<number | null>(() => {
    try {
      const v = localStorage.getItem(`${CACHE_KEY}_version`)
      return v ? Number(v) : null
    } catch {
      return null
    }
  })
  const [syncError, setSyncError] = useState<string | null>(null)

  // Detect preview / live sync mode (?preview=1 or ?live=1 or persisted preference)
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const search = window.location.search
    const hasParam = search.includes('preview=') || search.includes('live=')
    if (hasParam) {
      try {
        localStorage.setItem('bec_preview_mode', 'true')
      } catch {}
      return true
    }
    try {
      return localStorage.getItem('bec_preview_mode') === 'true'
    } catch {
      return false
    }
  })

  // Core Revalidation Engine (bypasses all caches with strict headers & timestamp)
  const revalidate = useCallback(async (silent = false) => {
    const wpApiUrl = (import.meta.env.VITE_WP_API_URL as string) || 'https://api.theblacklanternclinic.com'
    if (!wpApiUrl) return

    if (!silent) setIsSyncing(true)
    setSyncError(null)

    try {
      const res = await fetch(`${wpApiUrl.replace(/\/$/, '')}/wp-json/bec/v1/site-data?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      const data = await res.json()
      if (data && typeof data === 'object') {
        const merged = mergeSiteContent(INITIAL_CONTENT, data)
        setContent(merged)
        setIsReady(true)
        const now = new Date()
        setLastSynced(now)
        if (data._version) {
          setSyncVersion(data._version)
        }
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data))
          localStorage.setItem(`${CACHE_KEY}_time`, String(now.getTime()))
          if (data._version) {
            localStorage.setItem(`${CACHE_KEY}_version`, String(data._version))
          }
        } catch (e) {
          console.warn('Failed to update local site content cache:', e)
        }
      }
    } catch (err: any) {
      console.warn('WordPress API sync notice (using cached or static site content):', err?.message || err)
      setSyncError(err?.message || 'Sync failed')
    } finally {
      setIsSyncing(false)
      setIsReady(true)
    }
  }, [])

  useEffect(() => {
    // Safety fallback: ensure isReady is never blocked longer than 2.5s even on slow connections
    const splashTimeout = setTimeout(() => {
      setIsReady(true)
    }, 2500)

    // 1. Initial background fetch on mount
    revalidate(false)

    // 2. Revalidate when tab regains focus or visibility (SWR pattern)
    let lastActiveCheck = Date.now()
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible' || document.hasFocus()) {
        const now = Date.now()
        // Only revalidate if at least 5s have elapsed since last check
        if (now - lastActiveCheck > 5000) {
          lastActiveCheck = now
          revalidate(true)
        }
      }
    }
    window.addEventListener('focus', handleVisibilityOrFocus)
    document.addEventListener('visibilitychange', handleVisibilityOrFocus)

    // 3. Cross-Tab Realtime Bridge via BroadcastChannel and storage event
    let bc: BroadcastChannel | null = null
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('bec_site_sync')
        bc.onmessage = (event) => {
          if (event.data?.type === 'content_updated') {
            revalidate(false)
          }
        }
      }
    } catch {
      // Fallback to storage event
    }

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'bec_admin_synced') {
        revalidate(false)
      }
    }
    window.addEventListener('storage', handleStorageEvent)

    // 4. Polling interval (10s in preview mode, 45s normal)
    const pollInterval = isPreviewMode ? 10000 : 45000
    const intervalTimer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        revalidate(true)
      }
    }, pollInterval)

    // 5. Keyboard shortcut to toggle live preview bar (Ctrl+Shift+L or Cmd+Shift+L)
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        setIsPreviewMode((prev) => {
          const next = !prev
          try {
            if (next) localStorage.setItem('bec_preview_mode', 'true')
            else localStorage.removeItem('bec_preview_mode')
          } catch {}
          return next
        })
      }
    }
    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('focus', handleVisibilityOrFocus)
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus)
      window.removeEventListener('storage', handleStorageEvent)
      window.removeEventListener('keydown', handleKeydown)
      clearTimeout(splashTimeout)
      clearInterval(intervalTimer)
      if (bc) {
        bc.close()
      }
    }
  }, [revalidate, isPreviewMode])

  const contextValue: SiteContentContextType = {
    ...content,
    isReady,
    isSyncing,
    lastSynced,
    syncVersion,
    syncError,
    isPreviewMode,
    revalidate,
  }

  if (!isReady) {
    return <BrandedClinicSplash />
  }

  return (
    <SiteContentContext.Provider value={contextValue}>
      {children}
      {isPreviewMode && (
        <LivePreviewBar
          isSyncing={isSyncing}
          lastSynced={lastSynced}
          syncVersion={syncVersion}
          syncError={syncError}
          onSync={() => revalidate(false)}
          onClose={() => {
            setIsPreviewMode(false)
            try {
              localStorage.removeItem('bec_preview_mode')
            } catch {}
          }}
        />
      )}
    </SiteContentContext.Provider>
  )
}

const BrandedClinicSplash: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: '#141720',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FAF8F3',
        padding: '2rem',
        fontFamily: "'Spectral', Georgia, serif",
      }}
    >
      <div style={{ position: 'relative', marginBottom: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div
          style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(184, 149, 106, 0.35) 0%, rgba(184, 149, 106, 0) 70%)',
            animation: 'becPulseHalo 2.4s ease-in-out infinite alternate',
          }}
        />
        <img
          src="/white-lan.webp"
          alt="The Black Lantern Clinic"
          style={{
            width: '64px',
            height: 'auto',
            position: 'relative',
            zIndex: 2,
            filter: 'drop-shadow(0 4px 16px rgba(184, 149, 106, 0.45))',
          }}
        />
      </div>

      <h1
        style={{
          fontFamily: "'Cinzel', 'Spectral', serif",
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontWeight: 400,
          margin: '0 0 0.8rem 0',
          color: '#FAF8F3',
          textAlign: 'center',
        }}
      >
        The Black Lantern Clinic
      </h1>

      <p
        style={{
          fontFamily: "'Spectral', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 'clamp(0.92rem, 1.8vw, 1.05rem)',
          color: '#B8956A',
          margin: '0 0 2.5rem 0',
          textAlign: 'center',
          fontWeight: 300,
          opacity: 0.9,
        }}
      >
        A steady light, when the path feels uncertain.
      </p>

      <div
        style={{
          width: '140px',
          height: '2px',
          background: 'rgba(184, 149, 106, 0.2)',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '50%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, #B8956A, transparent)',
            borderRadius: '2px',
            animation: 'becLoadingTrack 1.4s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes becPulseHalo {
          0% { transform: scale(0.85); opacity: 0.4; }
          100% { transform: scale(1.35); opacity: 0.9; }
        }
        @keyframes becLoadingTrack {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  )
}

const LivePreviewBar: React.FC<{
  isSyncing: boolean
  lastSynced: Date | null
  syncVersion: number | null
  syncError: string | null
  onSync: () => void
  onClose: () => void
}> = ({ isSyncing, lastSynced, syncVersion, syncError, onSync, onClose }) => {
  const [minimized, setMinimized] = useState(false)

  const formattedTime = lastSynced
    ? lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Not synced yet'

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 99999,
          background: 'rgba(28, 31, 42, 0.95)',
          color: '#FAF8F3',
          border: '1px solid rgba(184, 149, 106, 0.4)',
          borderRadius: '50px',
          padding: '8px 14px',
          fontSize: '12px',
          fontFamily: 'var(--font-sans, system-ui)',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(8px)',
        }}
        title="Expand Live Sync Monitor"
      >
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isSyncing ? '#e6a143' : '#28a745',
          }}
        />
        <span>Live Bridge {syncVersion ? `v${syncVersion}` : ''}</span>
      </button>
    )
  }

  return (
    <aside
      aria-label="Live Content Bridge Status"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 99999,
        background: 'rgba(20, 23, 32, 0.94)',
        color: '#FAF8F3',
        border: '1px solid rgba(184, 149, 106, 0.35)',
        borderRadius: '12px',
        padding: '10px 16px',
        fontSize: '12px',
        fontFamily: 'var(--font-sans, system-ui)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isSyncing ? '#e6a143' : '#28a745',
            boxShadow: isSyncing ? '0 0 8px #e6a143' : '0 0 8px #28a745',
            transition: 'background 0.3s ease',
          }}
        />
        <div>
          <div style={{ fontWeight: 600, letterSpacing: '0.02em', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span>Live WordPress Bridge</span>
            {syncVersion && (
              <span
                style={{
                  fontSize: '10px',
                  background: 'rgba(184, 149, 106, 0.25)',
                  color: '#d8b688',
                  padding: '1px 5px',
                  borderRadius: '4px',
                }}
              >
                v{syncVersion}
              </span>
            )}
          </div>
          <div style={{ fontSize: '10px', color: '#9e9790' }}>
            {isSyncing ? 'Refreshing from backend...' : syncError ? `Notice: ${syncError}` : `Updated ${formattedTime}`}
          </div>
        </div>
      </div>

      <button
        onClick={onSync}
        disabled={isSyncing}
        style={{
          background: 'rgba(184, 149, 106, 0.25)',
          color: '#FAF8F3',
          border: '1px solid rgba(184, 149, 106, 0.5)',
          borderRadius: '6px',
          padding: '5px 10px',
          fontSize: '11px',
          fontWeight: 500,
          cursor: isSyncing ? 'wait' : 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {isSyncing ? 'Syncing...' : '🔄 Sync Now'}
      </button>

      <button
        onClick={() => setMinimized(true)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#8c857e',
          cursor: 'pointer',
          padding: '2px',
          fontSize: '14px',
          lineHeight: 1,
        }}
        title="Minimize"
      >
        –
      </button>

      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#8c857e',
          cursor: 'pointer',
          padding: '2px',
          fontSize: '14px',
          lineHeight: 1,
        }}
        title="Close Preview Mode"
      >
        ✕
      </button>
    </aside>
  )
}

export const useSiteContent = () => useContext(SiteContentContext)

