import React, { createContext, useContext, useEffect, useState } from 'react'

export interface SiteGeneral {
  phone: string
  email: string
  hours: string
  crisis_text: string
}

export interface SiteHeroes {
  home_title: string
  home_subtitle: string
  home_bg: string
  subpage_bg: string
  footer_bg: string
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
  services: SiteService[]
  team: SiteTeamMember[]
}

const DEFAULT_CONTENT: SiteContent = {
  general: {
    phone: '0418 542 638',
    email: 'admin@theblacklanternclinic.com',
    hours: 'Mon – Fri: 9am – 5pm',
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
    const wpApiUrl = import.meta.env.VITE_WP_API_URL
    if (!wpApiUrl) return

    fetch(`${wpApiUrl}/wp-json/bec/v1/site-data`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch WordPress site data')
        return res.json()
      })
      .then((data) => {
        if (data && data.general) {
          setContent({
            general: { ...DEFAULT_CONTENT.general, ...data.general },
            heroes: { ...DEFAULT_CONTENT.heroes, ...data.heroes },
            services: data.services && data.services.length > 0 ? data.services : DEFAULT_CONTENT.services,
            team: data.team && data.team.length > 0 ? data.team : DEFAULT_CONTENT.team,
          })
        }
      })
      .catch((err) => {
        console.warn('WordPress fetch warning (using default site content):', err.message)
      })
  }, [])

  return (
    <SiteContentContext.Provider value={content}>
      {children}
    </SiteContentContext.Provider>
  )
}

export const useSiteContent = () => useContext(SiteContentContext)
