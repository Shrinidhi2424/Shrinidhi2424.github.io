import type { Profile } from './types'

// Source: PORTFOLIO_PLAN.md sections 6.1 and 6.2. The phone number is never stored here.
export const profile: Profile = {
  name: 'Shrinidhi Shetty',
  location: 'Mangaluru, Karnataka, India',
  roleSought: 'Software Developer / Full-Stack Developer',

  // TODO(user): headline is chosen from headlineOptions at Hallmark's Picks checkpoint (Phase 3).
  headline: null,
  headlineOptions: [
    'I build full-stack and AI products.',
    'Full-stack developer who ships AI features.',
    'Software that works, end to end.',
  ],
  heroSentence:
    'Final-year Computer Science student at Sahyadri, building with React, Next.js, Spring Boot and FastAPI.',
  // Confirmed by the user in Phase 1: show it.
  availability: 'Open to software developer roles and internships.',

  about: [
    'Final-year B.E. Computer Science student at Sahyadri College of Engineering and Management, Mangaluru (CGPA 9.52).',
    'I build full-stack web and mobile apps and AI-backed tools, from the database schema to the UI.',
    "I'm interested in AI/ML, blockchain and systems-level programming.",
  ],
  interests: ['AI/ML', 'Blockchain', 'Systems-level programming'],

  email: 'shrinidhi.s.s1234@gmail.com',
  links: {
    github: 'https://github.com/Shrinidhi2424',
    linkedin: 'https://www.linkedin.com/in/shrinidhi-shetty-115154293/',
    source: 'https://github.com/Shrinidhi2424/Shrinidhi2424.github.io',
  },
  resume: {
    // The web copy (no phone number) is at public/resume/ (added by the user, Phase 0/1).
    href: '/resume/Shrinidhi_Shetty_Resume.pdf',
    fileName: 'Shrinidhi_Shetty_Resume.pdf',
  },
}
