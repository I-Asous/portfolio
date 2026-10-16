// Single source of truth for the site's written content, shared by every
// layout so a redesign only has to change presentation.

export type Role = {
  dateRange: string
  role: string
  location?: string
  description?: string[]
  bullets?: string[]
}

export const roles: Role[] = [
  {
    dateRange: 'Aug 2026',
    role: 'Software Engineer Intern @ NYC Department of Transportion',
    location: 'Remote',
    description: [
      'Scoping and delivering a minimum viable product against a formal project scope and change-order process, translating stakeholder requirements into defined deliverables and timelines.',
      'Collecting and analyzing data to inform application requirements and track project progress.',
      'Communicating progress through written status reports and oral presentations to leadership, practicing stakeholder management and technical communication.'
    ],
  },
  {
    dateRange: 'Jun 2026',
    role: 'Software Engineer REU @ HATlab, Clemson University',
    location: 'Remote',
    description: [
      'Debugged and maintained an authentication-tracking browser extension (WXT, Vue 3, TypeScript, Dexie.js) supporting NSF-funded research (Award #2521037, $650K) into usability gaps and authentication-fatigue-driven password reuse, capturing real-world authentication metrics across enterprise and AI-crowdsourcing platforms.',
      'Built a real-time broadcast notification system from scratch (Vue 3, Pinia, Supabase Realtime) enabling admins to push instant announcements to authenticated dashboard users, enforcing role-based access control via Postgres Row-Level Security.',
      'Embedded Claude Code into an agentic full-stack development workflow spanning implementation, test authoring, cross-repository debugging (Supabase permissions, OAuth redirects, CI issues), and PR review: iterating on prompts and AI-generated output to accelerate feature delivery while maintaining 90%+ test coverage.'
    ],
  },
  {
    dateRange: 'May 2026',
    role: 'Undergraduate Researcher @ Visualization and Virtuality Lab, CUNY Hunter',
    location: 'New York, NY',
    description: [
      'Conducting applied research within the Visualization and Virtual Reality Lab, contributing to ongoing experiments in visualization and virtual environment systems with a focus in Natural Language Processing.',
    ],
  },
  {
    dateRange: 'May 2026',
    role: 'Data Science Fellow @ CUNY Tech Prep',
    location: 'New York, NY',
    description: [
      'Selected as 1 of 200 Fellows for the competitive CUNY Tech Prep Data Science track, a year-long program placing top students from across the CUNY system into technical roles.',
      'Advancing proficiency in Python, machine learning, SQL, and end-to-end data analysis through intensive project-based curriculum.',
    ],
  },
  {
    dateRange: 'Aug 2025',
    role: 'Teaching Assistant @ CUNY Hunter Computer Science Department',
    location: 'New York, NY',
    description: [
      'Supported 600+ students across Computer Architecture I & II, Computer Theory, and Object-Oriented Programming/Data Structures & Algorithms through weekly review sessions and hosted office hours.',
      'Co-designed quizzes, midterms, and finals for courses enrolling 150–300+ students; reduced grading turnaround by implementing automated evaluation tools in collaboration with faculty.',
    ],
  },
]

export type Project = {
  slug: string
  dateRange: string
  name: string
  tagline: string
  tech: string[]
  description?: string[]
  link?: { href: string; label: string }
}

export const projects: Project[] = [
  {
    slug: 'sisyphus',
    dateRange: '',
    name: 'Project Sisyphus - HATLab, Clemson University',
    tagline:
      'Analytics for an NSF-funded study on how people actually authenticate.',
    tech: [
      'Vue 3',
      'TypeScript',
      'Supabase',
      'Postgres RLS',
      'TanStack Query',
      'Cloudflare Workers',
    ],
    description: [
      'Built a read-only analytics dashboard over auth-event telemetry collected by Chronos, a companion browser extension — participant coverage, event trends, and automated data-quality checks for an NSF-funded human-factors study (Award #2521037) into secure-authentication usability.',
      'Replaced magic-link sign-in with Google OAuth and moved access control into Postgres Row-Level Security itself (domain + allowlist gate), closing a gap where aggregation views were reading past RLS under definer privileges.',
      'Shipped a live notification and admin-announcement system on Supabase Realtime, and iterated 13 SQL migrations building out filterable, indexed rollup views so every page stays thin on the client.',
    ],
    link: {
      href: 'https://www.nsf.gov/awardsearch/show-award/?AWD_ID=2521037',
      label: 'NSF Award #2521037',
    },
  },
]

export type Certificate = {
  date: string
  name: string
  issuer: string
  link?: { href: string; label: string }
}

export const certificates: Certificate[] = [
  {
    date: 'Jul 2026',
    name: 'Social and Behavioral Responsible Conduct of Research',
    issuer: 'CITI Program',
    link: {
      href: 'https://www.citiprogram.org/verify/?w2dbf57a6-1c5e-425e-9a0a-aef42fe86247-78102814',
      label: 'Verify credential',
    },
  },
  {
    date: 'Jul 2026',
    name: 'Human Subjects Protections: Group 1 Investigators Conducting Social and Behavioral Science Research (SBR)',
    issuer: 'CITI Program · Clemson University',
    link: {
      href: 'https://www.citiprogram.org/verify/?w246c4753-1418-48bf-b506-c55db2c65e82-78084148',
      label: 'Verify credential',
    },
  },
  {
    date: 'In progress',
    name: 'AI201: Applications of AI Engineering',
    issuer: 'CodePath',
  },
  {
    date: 'In progress',
    name: 'Getting Started with DevOps on AWS',
    issuer: 'AWS',
  },
  {
    date: 'In progress',
    name: 'AWS Cloud Practitioner Essentials',
    issuer: 'AWS',
  },
  {
    date: 'In progress',
    name: 'AWS Cloud Quest: Cloud Practitioner',
    issuer: 'AWS',
  },
]

