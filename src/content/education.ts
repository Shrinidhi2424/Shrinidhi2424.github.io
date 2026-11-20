import type { Education } from './types'

// Source: PORTFOLIO_PLAN.md section 6.6. Certifications render as a list, never joined with "·".
export const education: Education = {
  degree: {
    degree: 'B.E.',
    field: 'Computer Science and Engineering',
    institution: 'Sahyadri College of Engineering and Management',
    city: 'Mangaluru',
    start: 'Jun 2023',
    end: 'Present',
    grade: 'Current CGPA 9.52',
  },
  certifications: [
    { name: 'Python Foundation Certification', issuer: 'Infosys' },
    { name: 'Introduction to System Architecture', issuer: 'Infosys' },
    { name: 'Programming using Java', issuer: 'Infosys' },
  ],
}
