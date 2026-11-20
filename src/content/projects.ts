import type { FeaturedProject, MoreProject } from './types'

// Source: PORTFOLIO_PLAN.md section 6.4, checked against each repo's README (Phase 1).
// Figures: only the numbers the plan allows. Media `src` is filled in Phase 2.

const SOLO = 'Solo project.'

export const featuredProjects: readonly FeaturedProject[] = [
  {
    slug: 'resumeai-pro',
    name: 'ResumeAI Pro',
    oneLiner: 'AI career toolkit that scores résumés against job descriptions.',
    year: 2026,
    tags: ['Next.js', 'TypeScript', 'Gemini', 'Supabase'],
    stack: [
      'Next.js 16',
      'TypeScript',
      'Supabase (Postgres)',
      'Drizzle ORM',
      'Clerk',
      'Google Gemini',
      'Vercel AI SDK',
      'react-pdf',
      'pdf2json',
      'Chrome Extension (Manifest V3)',
      'Vitest',
    ],
    problem:
      "Job seekers can't see why a résumé fails a specific job description, or what a recruiter's eye lands on.",
    built: [
      "Résumé PDF parsing and Gemini-based match scoring against a job description, with a deterministic keyword-coverage scorer that's always shown and used alone if Gemini is unavailable.",
      'A recruiter-attention heatmap: pdf2json text positions mapped to F-pattern quadrant weights with keyword-match boosting, drawn as a canvas overlay on react-pdf.',
      'Streamed cover-letter generation (Web Streams API), interview questions, a résumé builder, an application tracker (Kanban) and an admin analytics page.',
      'A Manifest V3 Chrome extension that scrapes LinkedIn job posts for analysis.',
    ],
    team: false,
    role: SOLO,
    figures: [],
    media: [
      {
        view: 'analysis',
        kind: 'capture',
        description: 'Analysis result with score and heatmap overlay',
        src: 'resumeai-analysis.webp',
        alt: 'ResumeAI Pro analysis results for a sample résumé: compatibility 86, ATS 95 and keyword coverage 75, matched and missing keywords, and a recruiter-attention heatmap drawn over the résumé.',
      },
      {
        view: 'cover-letter',
        kind: 'capture',
        description: 'Cover-letter screen',
        src: 'resumeai-cover-letter.webp',
        alt: 'ResumeAI Pro cover-letter generator: the résumé, company and job description on the left, and the generated letter on the right.',
      },
      {
        view: 'tracker',
        kind: 'capture',
        description: 'Application tracker board',
        src: 'resumeai-tracker.webp',
        alt: 'ResumeAI Pro application tracker: a Kanban board with four sample applications spread across the Wishlist, Applied, Online Test and Interview columns.',
      },
    ],
    diagram: {
      type: 'pipeline',
      steps: [
        'Clerk auth',
        'Rate limit',
        'Zod validation',
        'Keyword scorer',
        'Gemini (JSON), keyword-only fallback',
        'PDF heatmap',
        'Save to analyses table',
        'JSON response',
      ],
    },
    links: { code: 'https://github.com/Shrinidhi2424/ResumeAI' },
  },
  {
    slug: 'safexplore',
    name: 'SafeXplore',
    oneLiner: "Women's safety navigation app that scores routes by real crime data.",
    year: 2026,
    tags: ['React Native', 'Spring Boot', 'MongoDB', 'Groq'],
    stack: [
      'React Native (Expo)',
      'TypeScript',
      'Spring Boot',
      'MongoDB (2dsphere)',
      'Firebase Auth',
      'Twilio',
      'Cloudinary',
      'Groq LLM',
      'OpenRouteService',
    ],
    problem:
      'Map apps pick the fastest route, not the safest. People walking alone at night need to know which route is riskier and why.',
    built: [
      'A React Native (Expo) client and a Spring Boot REST API, with MongoDB 2dsphere geospatial queries for crime records and incident reports near a location.',
      'Route safety scoring that samples OpenRouteService route points using crime density plus context-based lighting and crowd factors, with user-tunable sensitivities and an offline scorer on cached data.',
      'Incident reporting with Cloudinary uploads, Groq LLM credibility scoring and time-weighted risk zones, secured with Firebase token auth, per-IP rate limiting and Twilio SOS alerts.',
    ],
    team: true,
    role: 'Team of 4. I built React Native screens and Spring Boot endpoints.',
    // Confirmed by the user in Phase 1: no public repo.
    codeNote: 'Code private (team project)',
    figures: [],
    media: [
      {
        view: 'route',
        kind: 'capture',
        description: 'Route map with safety score (phone size)',
        src: 'safexplore-route.webp',
        alt: 'SafeXplore Safe Route screen: a route on a map of Mangaluru with a 3.3 Moderate safety score and route preference chips.',
      },
      {
        view: 'report',
        kind: 'capture',
        description: 'Incident report screen (phone size)',
        src: 'safexplore-report.webp',
        alt: 'SafeXplore Report Incident screen: incident type, risk level, description and evidence options.',
      },
    ],
    diagram: { type: 'pending' },
    links: {},
  },
  {
    slug: 'pulseboard',
    name: 'PulseBoard',
    oneLiner: 'Real-time collaborative Kanban board that keeps working offline.',
    year: 2026,
    tags: ['Next.js', 'WebSockets', 'IndexedDB', 'Zustand'],
    stack: [
      'Next.js 15 (App Router)',
      'TypeScript',
      'Zustand',
      '@dnd-kit',
      'Tailwind CSS v4',
      'Node.js + ws WebSockets',
      'IndexedDB (idb)',
      'Service Worker',
      'Vitest',
      'React Testing Library',
      'Playwright',
    ],
    problem:
      'Collaborative boards break when the connection drops, and drag-and-drop often stutters.',
    built: [
      'Real-time multi-client sync over raw WebSockets with presence and optimistic UI updates (rollback or server reconciliation).',
      'Offline tolerance: Service Worker app-shell caching, IndexedDB persistence and an exponential-backoff action queue.',
      'GPU-composited drag-and-drop (translate3d, no layout reflow during drag), with full keyboard accessibility.',
      'Unit and component tests (Vitest + RTL) and Playwright end-to-end tests.',
    ],
    team: false,
    role: SOLO,
    figures: [],
    media: [
      {
        view: 'board',
        kind: 'capture',
        description: 'Board with cards mid-drag',
        src: 'pulseboard-board.webp',
        alt: 'PulseBoard Kanban board with a card lifted and tilted mid-drag over the In Progress column.',
      },
      {
        view: 'presence',
        kind: 'capture',
        description: 'Two windows side by side showing presence',
        src: 'pulseboard-presence.webp',
        alt: 'Two PulseBoard windows side by side, both showing "Online, 2 users" and the same synced board.',
      },
    ],
    diagram: { type: 'pending' },
    links: { code: 'https://github.com/Shrinidhi2424/PulseBoard' },
  },
  {
    slug: 'evidencetrace',
    name: 'EvidenceTrace',
    oneLiner: 'Checks scientific claims against papers and shows the evidence behind each verdict.',
    year: 2026,
    status: 'in progress',
    tags: ['Python', 'FastAPI', 'DeBERTa NLI', 'Sentence-Transformers'],
    stack: [
      'Python',
      'FastAPI',
      'Sentence-Transformers',
      'DeBERTa NLI cross-encoder',
      'Semantic Scholar API',
      'arXiv API',
      'Pytest',
      'GitHub Actions',
    ],
    problem:
      'AI tools blend studies into one fluent answer and hide the disagreement between them.',
    built: [
      'Parallel retrieval from Semantic Scholar and arXiv with de-duplication and a 10-minute cache.',
      'A multi-factor paper-quality score: semantic similarity 0.40, citation count 0.25, recency 0.20, source reliability 0.15.',
      'Sentence-level stance classification with a local DeBERTa NLI model, no LLM anywhere, returning stance, probability and the evidence sentence.',
      'A confidence layer combining directional agreement, model confidence and evidence breadth, with conflict detection between high-credibility papers that disagree.',
    ],
    team: false,
    role: SOLO,
    figures: [{ value: '41', label: 'offline pytest tests in CI' }],
    media: [
      {
        // Fallback chosen by the user in Phase 2: code block only. A real run was rate-limited by
        // Semantic Scholar (HTTP 429), so no result is shown. This block is the request and the
        // response *shape* (field names taken from a real run); the values are type placeholders,
        // not output.
        view: 'json',
        kind: 'code-output',
        description: 'Request and response shape of POST /api/analyze',
        code: {
          language: 'json',
          text: `POST /api/analyze
{ "claim": "Sleep deprivation impairs working memory.", "max_papers": 8 }

{
  "claim": "<the claim>",
  "verdict": "supports | contradicts | neutral",
  "confidence_score": <0 to 0.95>,
  "confidence_label": "high | moderate | low | very low",
  "evidence_distribution": { "supports": <share>, "contradicts": <share>, "neutral": <share> },
  "evidence_counts": { "supports": <n>, "contradicts": <n>, "neutral": <n> },
  "conflicts": [ ... ],
  "papers": [
    {
      "title": "...", "year": <year>, "source": "semantic_scholar | arxiv",
      "citation_count": <n>, "quality_score": <0 to 1>,
      "stance": "supports | contradicts | neutral",
      "stance_confidence": <probability>,
      "evidence_sentence": "<sentence from the abstract>"
    }
  ],
  "timings_ms": { "retrieval": <ms>, "scoring": <ms>, "classification": <ms>, "calibration": <ms> }
}`,
        },
      },
    ],
    diagram: {
      type: 'pipeline',
      steps: [
        'fetch_papers',
        'score_papers',
        'classify_stance',
        'calibrate_confidence',
        'analyze_claim (JSON)',
      ],
    },
    links: { code: 'https://github.com/Shrinidhi2424/EvidenceTrace' },
  },
  {
    slug: 'phishguard',
    name: 'PhishGuard',
    oneLiner: 'Explainable phishing-URL detector that shows why a link looks risky.',
    year: 2026,
    tags: ['Python', 'XGBoost', 'SHAP', 'Streamlit'],
    stack: ['Python', 'scikit-learn', 'XGBoost', 'SHAP', 'Streamlit', 'Pytest'],
    problem:
      "Phishing detectors give a yes/no with no reason, so users can't learn or trust them.",
    built: [
      '19 hand-crafted URL features; data from the PhishTank verified feed and the Tranco Top-1M list; stratified 70/15/15 splits.',
      'Logistic Regression, Random Forest and XGBoost compared; XGBoost selected.',
      'Per-prediction SHAP explanations of the top risk-contributing features, in a Streamlit app.',
    ],
    team: false,
    role: SOLO,
    figures: [
      { value: '97.07%', label: 'XGBoost accuracy', context: 'test set, n = 1,500' },
      { value: '0.9916', label: 'ROC AUC', context: 'test set, n = 1,500' },
      { value: '0.80%', label: 'false-positive rate', context: 'test set, n = 1,500' },
      { value: '27', label: 'tests, run in about 10 s' },
    ],
    media: [
      {
        view: 'prediction',
        kind: 'capture',
        description: 'Prediction with SHAP explanation',
        src: 'phishguard-prediction.webp',
        alt: 'PhishGuard Streamlit app flagging an example URL as phishing at 99.6%, with a SHAP bar chart of the top risk-contributing features and a plain-language explanation.',
      },
    ],
    diagram: { type: 'pending' },
    links: { code: 'https://github.com/Shrinidhi2424/PhishGuard' },
  },
  {
    slug: 'stepsolve',
    name: 'StepSolve',
    oneLiner: 'Numerical-methods calculator that shows every derivation step.',
    year: 2026,
    tags: ['Next.js', 'FastAPI', 'SymPy', 'Recharts'],
    stack: ['Next.js', 'React', 'Recharts', 'Python', 'FastAPI', 'NumPy', 'SymPy'],
    problem:
      'Numerical solvers return a number with no working, which is useless for learning.',
    built: [
      '15 syllabus topics across 5 modules (root finding, linear systems, interpolation, and more), each with a textbook-style step-by-step derivation, LaTeX formulas, iteration tables, convergence diagnostics and Recharts plots.',
      'A FastAPI backend with safe AST parsing and restricted expression evaluation (SymPy).',
    ],
    team: false,
    role: SOLO,
    context: 'Course project for Numerical Methods and Applications (VII sem).',
    figures: [],
    media: [
      {
        view: 'secant',
        kind: 'capture',
        description: 'One topic (e.g. Secant method) with steps, iteration table and chart',
        src: 'stepsolve-secant.webp',
        alt: 'StepSolve Secant method page: inputs on the left; on the right the root 1.521376 after 5 iterations, a plot and the start of the iteration table.',
      },
      {
        view: 'secant-steps',
        kind: 'capture',
        description: 'The full result with the step-by-step derivation',
        src: 'stepsolve-secant-steps.webp',
        alt: 'StepSolve full Secant method result: plot, iteration history table and the step-by-step derivation with formulas.',
      },
    ],
    diagram: { type: 'pending' },
    links: { code: 'https://github.com/Shrinidhi2424/StepSolve' },
  },
  {
    slug: 'qrag-lab',
    // Repo slug is ORAG-LAB; the display name is QRAG-Lab.
    name: 'QRAG-Lab',
    oneLiner: 'Research testbed comparing quantum-inspired and exact retrieval in RAG.',
    year: 2026,
    tags: ['Python', 'FAISS', 'Qiskit', 'Docker'],
    stack: ['Python', 'FAISS', 'Qiskit/Aer', 'Ollama', 'Docker Compose', 'SQuAD v1.1'],
    problem:
      'What happens to retrieval quality and hallucination when similarity comes from a shot-limited, probabilistic estimate instead of exact cosine?',
    built: [
      'A containerised RAG pipeline with an exact FAISS cosine arm and a classically simulated SWAP-test arm (a real Qiskit/Aer circuit for validation, plus a vectorised emulator for scale).',
      'Reproducible experiment phases with run manifests (git hash, seeds, package versions) and generated findings.',
    ],
    team: false,
    role: SOLO,
    context: 'Research project for my technical seminar.',
    disclaimer: 'A classical simulation; no quantum speedup is claimed.',
    figures: [],
    media: [
      {
        view: 'architecture',
        kind: 'repo-figure',
        description: 'Architecture figure from the repo (docs/seminar/F1_architecture.png)',
        src: 'qrag-lab-architecture.webp',
        alt: 'QRAG-Lab architecture: a client, an orchestrator, and embedder, classical retriever, quantum-simulation retriever and generator-gateway services in Docker, with Ollama on the host.',
      },
      {
        view: 'pareto',
        kind: 'repo-figure',
        description: 'Hallucination Pareto figure from the repo (docs/seminar/F7_pareto_hallucination.png)',
        src: 'qrag-lab-pareto.webp',
        alt: 'QRAG-Lab chart of hallucination rate against retrieval latency for corpus sizes of 1k, 5k and 21k, comparing exact Flat search with the quantum simulation at several shot counts.',
      },
    ],
    diagram: { type: 'repo-figure', repoPath: 'docs/seminar/F1_architecture.png' },
    links: { code: 'https://github.com/Shrinidhi2424/ORAG-LAB' },
  },
]

export const moreProjects: readonly MoreProject[] = [
  {
    name: 'Yellow Metal',
    oneLiner:
      'Gold-loan application and collateral evaluation portal with a 3-step intake, eligibility engine and dashboard.',
    tags: ['React 19', 'Express 5', 'MongoDB'],
    repo: 'https://github.com/Shrinidhi2424/Yellow-Metal-Assignment',
    // Confirmed by the user in Phase 1: show, labelled "assignment".
    label: 'assignment',
  },
  {
    name: 'HostelOps',
    oneLiner:
      'Hostel complaint and maintenance system with student and admin roles and JWT auth.',
    tags: ['React', 'Express', 'PostgreSQL'],
    repo: 'https://github.com/Shrinidhi2424/HostelOps',
  },
  {
    name: 'ApexPace',
    oneLiner: 'Formula 1 lap-pace forecasting (Bi-LSTM) with a pit-wall dashboard.',
    tags: ['Python', 'PyTorch', 'FastF1'],
    repo: 'https://github.com/SAKET555/F1_DL',
    label: 'team',
    part: 'I extended the pace model: an autoregressive past-lap channel, the 2022–2025 calendar, baselines, leave-one-circuit-out CV and MC-dropout uncertainty.',
  },
  {
    name: 'Movie-RAG',
    oneLiner:
      'Terminal movie-question agent using LangGraph with Pinecone retrieval, BM25, Tavily web search and Gemini.',
    tags: ['LangGraph', 'Pinecone', 'Gemini'],
    repo: 'https://github.com/Shrinidhi2424/Movie-RAG',
  },
  {
    name: 'Blockchain Voting System',
    oneLiner: 'Python blockchain voting with integrity verification and a Flask API.',
    tags: ['Python', 'Flask'],
    repo: 'https://github.com/Shrinidhi2424/Blockchain-Voting-System',
  },
]

export const getProject = (slug: string): FeaturedProject | undefined =>
  featuredProjects.find((p) => p.slug === slug)
