import React, { createContext, useContext, useEffect, useState } from 'react'

export interface SiteGeneral {
  phone: string
  email: string
  hours: string
  sat_hours: string
  location_text: string
  instagram_url: string
  booking_btn_text: string
  booking_url: string
  crisis_text: string
}

export interface SiteHeroes {
  home_title: string
  home_subtitle: string
  home_bg: string
  subpage_bg: string
  footer_bg: string
}

export interface SiteCta {
  title: string
  body: string
  btn_text: string
}

export interface SiteAbout {
  hero_title: string
  story_title: string
  story_img: string
}

export interface SiteFooter {
  brand_desc: string
  credit: string
}

export interface SiteSeo {
  home_title: string
  home_desc: string
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

export interface SiteContent {
  general: SiteGeneral
  heroes: SiteHeroes
  cta: SiteCta
  about: SiteAbout
  footer: SiteFooter
  seo: SiteSeo
  services: SiteService[]
  team: SiteTeamMember[]
}

const DEFAULT_CONTENT: SiteContent = {
  general: {
    phone: '0418 542 638',
    email: 'admin@theblacklanternclinic.com',
    hours: 'Mon – Fri: 9am – 5pm',
    sat_hours: 'Sat: By appointment only',
    location_text: 'Youth Mental Health · Brisbane, Queensland',
    instagram_url: 'https://instagram.com',
    booking_btn_text: 'Book an appointment',
    booking_url: '/contact',
    crisis_text:
      'The Black Lantern Clinic is not a crisis clinic, if you are experiencing a mental health crisis or emergency please contact 000 or lifeline 13 11 14 or 24/7 MH Call 1300 642 255',
  },
  heroes: {
    home_title: 'Light for the Path ahead',
    home_subtitle:
      'The Black Lantern Clinic is a private specialist youth mental health clinic in Brisbane, Queensland. We see young people aged 12 to 25 — and where it helps, their families and carers too.',
    home_bg: '/hero-bg.webp',
    subpage_bg: '/page-hero-bg.webp',
    footer_bg: '/footer-bg.webp',
  },
  cta: {
    title: 'Ready to take the first step?',
    body: "We know reaching out can feel like a big step. Our team is here to answer your questions and help you work out if we're the right fit — no pressure, no obligation.",
    btn_text: 'Get in Touch',
  },
  about: {
    hero_title: 'Who we are',
    story_title: '"A steady light, when the path feels uncertain."',
    story_img: '/about_story.webp',
  },
  footer: {
    brand_desc: 'Specialist psychiatric and mental health care for young people aged 12 to 25.',
    credit: 'Youth Mental Health · Brisbane, Queensland',
  },
  seo: {
    home_title: 'The Black Lantern Clinic | Specialist Youth Psychiatry & Therapy Brisbane',
    home_desc: 'Specialist youth mental health clinic in Brisbane for ages 12–25. Grounded, person-centred psychiatric assessment & evidence-based therapy.',
  },
  services: [
    {
      num: '01',
      title: 'Psychiatry',
      image: '/services_psychiatry_brain.webp',
    },
    {
      num: '02',
      title: 'Therapy',
      image: '/therapy.webp',
    },
  ],
  team: [
    {
      name: 'Dr. Joel Adams-Bedford',
      role: 'Clinical Director & Child and Adolescent Psychiatrist',
      photo: '/team_joel.webp',
    },
    {
      name: 'Rebecca Willis',
      role: 'Practice Director & Psychotherapist',
      photo: '/team_rebecca.webp',
    },
  ],
}

const SiteContentContext = createContext<SiteContent>(DEFAULT_CONTENT)

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)

  useEffect(() => {
    const wpApiUrl = (import.meta.env.VITE_WP_API_URL as string) || 'https://api.theblacklanternclinic.com'
    if (!wpApiUrl) return

    fetch(`${wpApiUrl.replace(/\/$/, '')}/wp-json/bec/v1/site-data?_t=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (data && data.general) {
          setContent({
            general: { ...DEFAULT_CONTENT.general, ...data.general },
            heroes: { ...DEFAULT_CONTENT.heroes, ...data.heroes },
            cta: { ...DEFAULT_CONTENT.cta, ...(data.cta || {}) },
            about: { ...DEFAULT_CONTENT.about, ...(data.about || {}) },
            footer: { ...DEFAULT_CONTENT.footer, ...(data.footer || {}) },
            seo: { ...DEFAULT_CONTENT.seo, ...(data.seo || {}) },
            services: data.services && data.services.length > 0 ? data.services : DEFAULT_CONTENT.services,
            team: data.team && data.team.length > 0 ? data.team : DEFAULT_CONTENT.team,
          })
        }
      })
      .catch((err) => {
        console.warn('WordPress API fetch warning (using default site content):', err.message)
      })
  }, [])

  return (
    <SiteContentContext.Provider value={content}>
      {children}
    </SiteContentContext.Provider>
  )
}

export const useSiteContent = () => useContext(SiteContentContext)
