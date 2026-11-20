import type { StackGroup } from './types'

// Source: PORTFOLIO_PLAN.md section 6.3 (from the résumé).
// Grouped tag lists only: no skill bars, percentages or proficiency ratings.
export const stack: readonly StackGroup[] = [
  {
    id: 'languages',
    label: 'Languages',
    items: ['Java', 'TypeScript', 'JavaScript', 'Python', 'SQL', 'C++', 'C'],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    items: [
      'React.js',
      'Next.js',
      'React Native (Expo)',
      'HTML5',
      'CSS',
      'Tailwind CSS',
      'Zustand',
      'shadcn/ui',
    ],
  },
  {
    id: 'backend',
    label: 'Backend & APIs',
    items: [
      'Spring Boot',
      'Spring Security',
      'Node.js',
      'Express.js',
      'FastAPI',
      'REST APIs',
      'Firebase Auth',
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    items: [
      'MongoDB',
      'PostgreSQL',
      'MySQL',
      'Supabase',
      'Cloud Firestore',
      'Pinecone (vector DB)',
    ],
  },
  {
    id: 'ai',
    label: 'AI integration',
    items: ['LLM APIs (Gemini, Groq)', 'RAG', 'Prompt engineering', 'Structured JSON outputs'],
  },
  {
    id: 'tools',
    label: 'Tools',
    items: [
      'Git',
      'GitHub Actions',
      'Docker',
      'Maven',
      'Postman',
      'Vercel',
      'Clerk',
      'Drizzle ORM',
      'Pytest',
      'Vitest',
      'Linux',
    ],
  },
  {
    id: 'core-cs',
    label: 'Core CS',
    items: ['OOP', 'DSA', 'DBMS', 'Operating Systems', 'Computer Networks'],
    quiet: true,
  },
]
