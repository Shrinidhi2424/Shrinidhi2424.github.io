import type { ExperienceEntry } from './types'

// Source: PORTFOLIO_PLAN.md section 6.5. Do not name the client company.
export const experience: readonly ExperienceEntry[] = [
  {
    role: 'Frontend Developer',
    employment: 'Freelance',
    organisation: 'Agentic AI Development Program',
    start: 'Sept 2025',
    end: 'Nov 2025',
    summary: 'Designed and built the frontend of a sales-force management web app, in Figma and Next.js.',
    details: [
      'Designed the end-to-end UI/UX in Figma for a sales-force management web app, covering both Manager and Sales Representative workflows (dashboards, store management, targets, route check-ins).',
      'Built the frontend in Next.js from the approved designs (manager modules: statistics, reports, store CRUD; rep views: dashboard, targets, check-in history), integrated with an n8n backend and Firebase Authentication.',
      'Structured Cloud Firestore collections for manager and rep account data, and delivered the complete Phase 1 sprint on schedule.',
    ],
  },
]
