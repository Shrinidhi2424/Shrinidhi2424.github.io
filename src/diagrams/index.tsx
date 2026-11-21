import type { ReactElement } from 'react'
import { Flow, type FlowSpec } from './Flow'

// One diagram per featured project, each checked against its repository (Phase 4):
// ResumeAI and EvidenceTrace follow the plan's pipelines (6.4) and their route code; PulseBoard, PhishGuard
// and StepSolve follow their README and source layout; SafeXplore's code is private, so its diagram uses only
// the résumé facts and stays simple. QRAG-Lab uses its own repo figure instead (src/content, diagram type).

const resumeai: FlowSpec = {
  title: 'ResumeAI Pro: the analyse request',
  description:
    'A request passes Clerk auth and a rate limit, is validated with Zod, scored by the keyword scorer, analysed by Gemini as JSON with a keyword-only fallback, gets a page-one heatmap, and is saved to the analyses table before the JSON response.',
  rows: [
    [{ id: 'a', label: 'Auth and rate limit', tech: 'Clerk' }],
    [{ id: 'b', label: 'Request validation', tech: 'Zod' }],
    [{ id: 'c', label: 'Keyword coverage score', tech: 'skills dictionary' }],
    [
      { id: 'd', label: 'AI analysis (JSON)', tech: 'Gemini' },
      { id: 'e', label: 'Keyword-only fallback', dashed: true },
    ],
    [{ id: 'f', label: 'Recruiter heatmap, page 1', tech: 'pdf2json' }],
    [{ id: 'g', label: 'Save to analyses', tech: 'Drizzle, Postgres' }],
  ],
  edges: [
    ['a', 'b'],
    ['b', 'c'],
    ['c', 'd'],
    ['c', 'e'],
    ['d', 'f'],
    ['e', 'f'],
    ['f', 'g'],
  ],
}

const safexplore: FlowSpec = {
  title: 'SafeXplore: client, API and services',
  description:
    'A React Native client calls a Spring Boot REST API secured with Firebase tokens; the API uses MongoDB geospatial queries, OpenRouteService routes, Groq for report credibility, Cloudinary for uploads and Twilio for SOS alerts.',
  rows: [
    [{ id: 'a', label: 'Mobile app', tech: 'React Native, Expo' }],
    [{ id: 'b', label: 'REST API, token auth', tech: 'Spring Boot, Firebase' }],
    [
      { id: 'c', label: 'Crime data', tech: 'MongoDB 2dsphere' },
      { id: 'd', label: 'Routes', tech: 'OpenRouteService' },
      { id: 'e', label: 'Credibility', tech: 'Groq' },
      { id: 'f', label: 'Uploads', tech: 'Cloudinary' },
      { id: 'g', label: 'SOS alerts', tech: 'Twilio' },
    ],
  ],
}

const pulseboard: FlowSpec = {
  title: 'PulseBoard: optimistic sync with an offline queue',
  description:
    'The Kanban UI updates the Zustand board store at once; the store snapshots to IndexedDB, and the sync hook sends actions over WebSockets to the Node server, or queues them with backoff while offline.',
  rows: [
    [{ id: 'a', label: 'Kanban board', tech: 'React, @dnd-kit' }],
    [{ id: 'b', label: 'Board store, optimistic', tech: 'Zustand' }],
    [
      { id: 'c', label: 'Local snapshot', tech: 'IndexedDB, idb' },
      { id: 'd', label: 'Sync hook', tech: 'useBoardSync' },
    ],
    [
      { id: 'e', label: 'Offline queue, backoff', tech: 'sync-queue', dashed: true },
      { id: 'f', label: 'Server, in-memory board', tech: 'Node, ws' },
    ],
  ],
  edges: [
    ['a', 'b'],
    ['b', 'c'],
    ['b', 'd'],
    ['d', 'e'],
    ['d', 'f'],
  ],
}

const evidencetrace: FlowSpec = {
  title: 'EvidenceTrace: the claim pipeline',
  description:
    'A claim goes through fetch_papers, score_papers, classify_stance and calibrate_confidence, and analyze_claim returns the result as JSON.',
  rows: [
    [{ id: 'a', label: 'fetch_papers', tech: 'Semantic Scholar, arXiv' }],
    [{ id: 'b', label: 'score_papers', tech: 'Sentence-Transformers' }],
    [{ id: 'c', label: 'classify_stance', tech: 'DeBERTa NLI' }],
    [{ id: 'd', label: 'calibrate_confidence' }],
    [{ id: 'e', label: 'analyze_claim (JSON)', tech: 'FastAPI' }],
  ],
}

const phishguard: FlowSpec = {
  title: 'PhishGuard: from URL to explained verdict',
  description:
    'A URL becomes 19 hand-crafted features, the XGBoost classifier scores it, SHAP TreeExplainer attributes the score to features, and the Streamlit app shows the verdict with its top reasons.',
  rows: [
    [{ id: 'a', label: 'URL in', tech: 'Streamlit' }],
    [{ id: 'b', label: '19 URL features', tech: 'features.py' }],
    [{ id: 'c', label: 'Classifier', tech: 'XGBoost' }],
    [{ id: 'd', label: 'Per-prediction reasons', tech: 'SHAP TreeExplainer' }],
    [{ id: 'e', label: 'Verdict and top features', tech: 'Streamlit' }],
  ],
}

const stepsolve: FlowSpec = {
  title: 'StepSolve: one solve request',
  description:
    'The Next.js form posts to the FastAPI solve endpoint, the expression is parsed safely with an AST check and SymPy, the topic solver runs with NumPy, and the steps, table and plot data come back for Recharts.',
  rows: [
    [{ id: 'a', label: 'Topic form, schema-driven', tech: 'Next.js' }],
    [{ id: 'b', label: 'POST /api/solve/{topic_id}', tech: 'FastAPI' }],
    [{ id: 'c', label: 'Safe expression parsing', tech: 'AST, SymPy' }],
    [{ id: 'd', label: 'Topic solver', tech: 'NumPy' }],
    [{ id: 'e', label: 'Steps, table and plot', tech: 'Recharts' }],
  ],
}

export const diagrams: Record<string, () => ReactElement> = {
  'resumeai-pro': () => <Flow spec={resumeai} />,
  safexplore: () => <Flow spec={safexplore} />,
  pulseboard: () => <Flow spec={pulseboard} />,
  evidencetrace: () => <Flow spec={evidencetrace} />,
  phishguard: () => <Flow spec={phishguard} />,
  stepsolve: () => <Flow spec={stepsolve} />,
}
