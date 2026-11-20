// Shared types for all site content. Facts live only in src/content/*.ts
// and come from PORTFOLIO_PLAN.md section 6 (or the user). Never invent values.

export interface Profile {
  name: string
  location: string
  roleSought: string
  /** Chosen at Hallmark's Picks checkpoint (Phase 3). null until then. */
  headline: string | null
  headlineOptions: readonly string[]
  heroSentence: string
  /** null hides the line. */
  availability: string | null
  /** 2–3 short sentences. */
  about: readonly string[]
  interests: readonly string[]
  email: string
  links: {
    github: string
    linkedin: string
    source: string
  }
  resume: {
    href: string
    fileName: string
  }
}

export interface StackGroup {
  id: string
  label: string
  items: readonly string[]
  /** Shown as one quiet line rather than a full group. */
  quiet?: boolean
}

export interface ProjectFigure {
  value: string
  label: string
  /** Where the number comes from, e.g. "test set, n = 1,500". */
  context?: string
}

/**
 * A planned or captured picture for a project's drawer.
 * `src` is filled in Phase 2 once a real capture or repo figure exists.
 */
export interface ProjectMedia {
  view: string
  kind: 'capture' | 'repo-figure' | 'code-output'
  description: string
  src?: string
  alt?: string
  /** For kind "code-output": a code block shown in the drawer instead of a picture. */
  code?: { language: string; text: string }
}

export type ProjectDiagram =
  /** Steps taken from the plan's pipeline description (section 6.4). */
  | { type: 'pipeline'; steps: readonly string[] }
  /** An existing figure from the project's repo. */
  | { type: 'repo-figure'; repoPath: string }
  /** Written in Phase 4 from the repo's code and README. */
  | { type: 'pending' }

export interface ProjectLinks {
  /** Omitted when the code is private. */
  code?: string
  /** Only a real, working URL. Never invent one. */
  demo?: string
}

export interface FeaturedProject {
  slug: string
  name: string
  /** 14 words or fewer, for the index. */
  oneLiner: string
  year: number
  status?: 'in progress'
  /** 3–4 tags for the index. */
  tags: readonly string[]
  /** Full list, for the drawer. */
  stack: readonly string[]
  problem: string
  built: readonly string[]
  team: boolean
  /** Solo / team + his part. Shown in the drawer. */
  role: string
  /** Extra context line, e.g. course or seminar. */
  context?: string
  /** Required honesty line, shown verbatim in the drawer. */
  disclaimer?: string
  /** Shown instead of a Code link when there is no public repo. */
  codeNote?: string
  /** Only numbers listed in the plan. */
  figures: readonly ProjectFigure[]
  media: readonly ProjectMedia[]
  diagram: ProjectDiagram
  links: ProjectLinks
}

export interface MoreProject {
  name: string
  oneLiner: string
  /** Up to 3 tags. */
  tags: readonly string[]
  repo: string
  label?: 'assignment' | 'team'
  /** His part on a team project, shown verbatim. */
  part?: string
}

export interface ExperienceEntry {
  role: string
  employment: string
  organisation: string
  start: string
  end: string
  /** 1–2 lines for the page. */
  summary: string
  /** Full bullets, can sit behind a details disclosure. */
  details: readonly string[]
}

export interface Degree {
  degree: string
  field: string
  institution: string
  city: string
  start: string
  end: string
  grade: string
}

export interface Certification {
  name: string
  issuer: string
}

export interface Education {
  degree: Degree
  certifications: readonly Certification[]
}
