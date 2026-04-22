# VLab Project Context (Detailed AI Handoff)

This document is a complete context handoff for the VLab codebase so another AI can continue product and engineering design decisions with minimal ambiguity.

## 1. Project Identity

- Project name: VLab (branding used in UI: VirtualLabX)
- Core idea: A web platform combining
  - interactive virtual labs (currently Linear Regression and Matrix Multiplication)
  - certification exams
  - AI-assisted proctoring (face presence, gaze direction, audio speaking, tab-switch checks)
  - certificate issuance + verification (UUID hash + QR + downloadable/viewable PDF)
- Current architecture style: Monorepo-like folder with separate frontend and backend app directories.

## 2. Tech Stack

### Frontend
- Framework: React 18 + Vite
- Router: react-router-dom
- Styling: Tailwind v4 + custom CSS utilities
- UI libs: MUI icons, react-icons
- Animations: GSAP
- Charts: Recharts (installed)
- Utilities: axios, uuid
- Proctoring libs in browser:
  - @vladmandic/face-api (TinyFaceDetector)
  - @mediapipe/face_mesh
  - Web Audio API (custom hook)

### Backend
- Runtime: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt
- PDF generation: Puppeteer (HTML-to-PDF)
- QR generation: qrcode
- Other: cors, dotenv, uuid

## 3. Repository Structure (High-Level)

- Frontend root
  - src/App.jsx: app providers + route map
  - src/context/*: global state (Auth, Exam, Spotify)
  - src/pages/*: page-level flows (landing, labs, exams, admin, profile, verify)
  - src/components/*: sections, widgets, lab UIs, proctoring module
- Backend
  - backend/server.js: API bootstrap
  - backend/routes/*: REST endpoints
  - backend/models/*: Mongoose schemas + dynamic question model factory
  - backend/services/certificateService.js: QR + PDF certificate composition
  - backend/utils/generatePDF.js: detailed certificate HTML template rendered via Puppeteer

## 4. Frontend Route Map

Defined in src/App.jsx:
- / -> LandingPage
- /labs -> AllLabsPage
- /labs/linear-regression -> LinearRegressionLabPage
- /labs/matrix-multiplication -> MatrixMultiplicationLabPage
- /login -> LoginPage
- /profile -> ProfilePage
- /certifications -> CertificationsSelectionPage
- /certifications/lobby -> ExamLobbyPage
- /exam/:sessionId -> ExamPage
- /admin/exams -> AdminDashboard
- /features -> FeaturesPage
- /verify/:hash -> VerifyCertificatePage

Global wrappers:
- AuthProvider
- ExamProvider
- SpotifyProvider
- Shared Navbar + Spotify widget at app shell level

## 5. Main User Journeys

### A) Learning Journey
1. User explores landing and labs pages.
2. User opens a lab module:
   - Linear Regression lab includes intro, prerequisites, objectives, simulation, quiz, learn-code mode, resources, feedback.
   - Matrix Multiplication lab includes similar pedagogy and a step-driven matrix simulation engine.
3. User can practice concepts before taking certification exams.

### B) Certification Journey (Authenticated)
1. User visits /certifications and sees exam collections.
2. User enters /certifications/lobby?topic=<examType>.
3. Lobby enforces setup steps:
   - rules acknowledgement
   - camera + microphone permission checks
4. Exam starts by creating an exam session.
5. During exam, frontend continuously sends proctoring signals/violations/snapshots.
6. On completion or timeout, backend scores answers + computes cheating score.
7. If pass + integrity thresholds met, certificate is created, PDF is generated/stored.
8. User sees result and can later access certificates in profile.

### C) Admin/Moderator Journey
1. Access admin dashboard (role-protected backend endpoints).
2. View exam sessions, violations timeline, snapshots.
3. Manage users (promote USER to MODERATOR).
4. Manage exam collections.
5. CRUD question banks per examType.
6. View and verify issued certificates.

### D) Public Verification Journey
1. Anyone visits /verify/:hash.
2. Frontend calls verification endpoint.
3. If valid: shows certificate metadata and embedded PDF preview.
4. If invalid: shows invalid credential state.

## 6. State Management Contexts

### AuthContext
Responsibilities:
- token persistence in localStorage
- verify token on app mount via /api/auth/me
- login(token) => fetches user profile
- logout => clears token/user/auth state

Notes:
- API base URLs are currently hardcoded to localhost:5000 in multiple files.

### ExamContext
Responsibilities:
- start exam session
- fetch current question
- submit answer
- log violations
- send snapshot image payload
- submit exam
- expose examSession, currentQuestion, examResult to UI

### SpotifyContext
Responsibilities:
- Spotify OAuth PKCE flow
- Web Playback SDK lifecycle
- track search and playback controls
- persist and attempt resume state

Note:
- Spotify integration is cross-cutting but not tied to exam logic.

## 7. Proctoring Architecture (Frontend)

Primary module: ProctoringModule (mounted in exam page while IN_PROGRESS).

Signal sources:
- Face detection: face-api TinyFaceDetector loop
- Gaze detection: MediaPipe Face Mesh + iris-based ratio classification
- Audio speaking detection: Web Audio API RMS-based adaptive thresholding
- Browser behavior: tab-switch visibility events + keyboard/context restrictions

Hooks:
- useGazeTracking
  - direction classification: LEFT / CENTER / RIGHT
  - hysteresis and direction hold reduce jitter
  - stability score from recent history window
- useAudioProctoring
  - startup ambient calibration
  - speech/noise classification with debounce and cooldown
- useProctoringEngine
  - computes smooth attention score from weighted penalties
  - status states: NORMAL / SUSPICIOUS / CHEATING
  - triggers low-attention violation after sustained low score

Violation pipeline:
- Client detects event -> ExamContext.logViolation -> POST /api/exam/monitor
- Optional base64 snapshot -> POST /api/exam/snapshot

## 8. Exam Engine and Scoring Rules (Backend)

Exam start:
- /api/exam/start selects random questions per type from dynamic question collection:
  - 10 MCQ
  - 5 MULTI
  - 5 NUMERICAL

Question retrieval:
- /api/exam/question/:sessionId returns one question at currentIndex (without correct answer).

Answering:
- /api/exam/answer appends answer and increments currentIndex.

Submission:
- /api/exam/submit computes:
  - score: +10 per exactly correct question (normalized string/list comparison)
  - maxScore: questions.length * 10
  - cheating score:
    - tabSwitches * 10
    - faceFlags * 10
    - multipleFaceEvents * 40
    - lookingAwayEvents * 10
- status logic:
  - if cheatingScore >= 70 -> DISQUALIFIED
  - else -> COMPLETED
- certificate issuance condition:
  - status COMPLETED
  - score >= 70% of maxScore
  - cheatingScore < 30

Certificate object includes UUID certificateId and optional PDF buffer.

## 9. Backend API Surface (Current)

### Auth
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me
- PUT /api/auth/me
- GET /api/auth/users (ADMIN, MODERATOR)
- PUT /api/auth/users/:id/promote (ADMIN)

### Exam
- POST /api/exam/start
- GET /api/exam/question/:sessionId
- POST /api/exam/answer
- POST /api/exam/monitor
- POST /api/exam/snapshot
- POST /api/exam/submit
- GET /api/exam/all (ADMIN, MODERATOR)

### Questions (role protected)
- GET /api/questions?examType=...
- POST /api/questions
- PUT /api/questions/:id
- DELETE /api/questions/:id?examType=...

### Exam Collections
- GET /api/examCollections (public)
- POST /api/examCollections (ADMIN, MODERATOR)
- PUT /api/examCollections/:id (ADMIN, MODERATOR)
- DELETE /api/examCollections/:id (ADMIN, MODERATOR)

### Certificates
- GET /api/certificates/my
- GET /api/certificates/all (ADMIN, MODERATOR)
- GET /api/certificate/download/:hash (public)
- GET /api/certificate/view/:hash (public)
- GET /api/verify/:hash (public)

## 10. Data Models

### User
- firstName, lastName, email(unique), password(hashed), role(USER/MODERATOR/ADMIN)

### ExamSession
- userId, title, examType
- questions[] (stringified ids)
- answers[] ({questionId, selectedOption})
- currentIndex
- score, maxScore, status
- cheating counters
- violations[] (type, timestamp, details)
- snapshots[] (base64 image, violationType, timestamp)

### Certificate
- userId
- score, maxScore
- certificateId(unique UUID)
- examName
- date
- pdfBuffer (binary)

### ExamCollection
- title, examType(unique), description, status(ACTIVE/UPCOMING)

### Question (dynamic per examType collection)
- questionType (MCQ/MULTI/NUMERICAL)
- questionText
- options[]
- correctAnswer[]
- difficulty
- topic

Question storage architecture:
- separate Mongo connection for exam questions DB
- model factory picks collection name as examType_questions

## 11. Security and Integrity Controls

Implemented:
- JWT auth middleware
- role-based authorization middleware
- exam ownership checks by session userId
- anti-tab-switch logging
- shortcut/context menu suppression in exam UI
- camera/mic requirement checks before launch
- ML-assisted gaze/face/audio events logged

Current limitations to note:
- many frontend API URLs are hardcoded to localhost
- no explicit rate limiting shown
- no CSRF strategy shown (API mostly token based)
- snapshots stored as base64 in DB can grow large
- CORS currently open defaults

## 12. Certificate Pipeline

1. On qualifying exam submission, backend creates certificate record.
2. certificateService builds verify URL from VITE_APP_URL or localhost:5173.
3. QR code generated from verify URL.
4. Puppeteer renders premium HTML template -> PDF buffer.
5. PDF stored in certificate.pdfBuffer.
6. Public routes allow inline view/download by certificate hash.
7. Verify endpoint returns canonical metadata for authenticity checks.

## 13. Matrix Lab Engine Notes

The matrix simulation is implemented as a state machine hook:
- statuses: IDLE, RUNNING, PAUSED, FINISHED, ERROR
- validates compatibility: colsA must equal rowsB
- computes result step-by-step using i/j/k traversal
- supports play, pause, step, reset
- supports randomize and manual edits
- visualization highlights active row/column/cell while accumulating dot product sum

This module is suitable for extension to:
- determinant/inverse labs
- Gaussian elimination walkthroughs
- matrix transform visualization for graphics/ML

## 14. Product Characteristics and UX Style

- Visual language: dark, neon, glassmorphism, animated gradients
- Experience pattern: pedagogy + simulation + assessment + credentialing
- Distinctive differentiation:
  - integrated proctoring + certification inside same learning app
  - exam metadata and evidence visibility for admins
  - public verifiable credentials

## 15. Operational Assumptions and Environment

Expected local services:
- Frontend dev server: http://localhost:5173
- Backend API server: http://localhost:5000
- MongoDB instance with at least one primary app DB
- Optional second DB/connection for dynamic question collections

Required env values (inferred from code):
- MONGO_URI
- JWT_SECRET
- EXAM_DB_URI (optional fallback exists)
- VITE_APP_URL (used backend-side for verify links)

## 16. Active Risks / Design Debt

- Config debt: hardcoded API endpoints across frontend files.
- Reliability debt: storing webcam snapshots in Mongo as base64 may affect size/performance.
- Test debt: no clear automated test suite for frontend/backend behavior.
- Backend script quality: backend/package.json lacks practical scripts (dev/start/test).
- Potential mismatch: Express 5 + existing middleware patterns should be regression-tested.
- Security hardening pending: CORS restrictions, validation layer, request throttling.

## 17. Suggested Next Design Directions

1. Architecture hardening
- Introduce frontend API client with env-driven base URL.
- Add backend config validation at startup.
- Add request schema validation (zod/joi/express-validator).

2. Proctoring quality improvements
- Add calibrated per-user thresholds and confidence tracking.
- Add proctoring event severity taxonomy and review tooling.
- Move heavy media artifacts to object storage instead of Mongo docs.

3. Exam engine improvements
- Add per-question marks/negative marks/timers.
- Add deterministic exam blueprints per examType.
- Add resume/reconnect semantics for interrupted exams.

4. Certificate platform upgrades
- Add signed verification payload and tamper-proof signature.
- Add issuer metadata and badge standards compatibility.
- Add downloadable JSON verification manifest.

5. Learning experience expansion
- Add more labs reusing matrix-simulation style architecture.
- Track learning progress from lab activity to certification readiness.

## 18. Prompt Template for Another AI

Use this prompt to continue design/planning with another model:

"You are helping me continue development of my VLab (VirtualLabX) project. It is a React + Vite frontend with a Node/Express + Mongo backend. The platform combines interactive labs, proctored certification exams, and verifiable PDF certificates with QR hash verification. Please use the architecture, routes, data models, scoring logic, and risk list from AI_PROJECT_CONTEXT.md as ground truth. First, produce a technical roadmap with quick wins (1-2 weeks), medium term improvements (1-2 months), and long-term architecture changes. Then propose exact implementation tasks file-by-file for the highest impact improvements."

## 19. Quick Reality Check for Any AI Reading This

- This is not only a learning UI app; it already has a full exam + credential pipeline.
- Proctoring is already implemented client-side and linked to backend persistence.
- Admin flows already exist for moderation, question banks, and analytics.
- Certificate verification is public and hash-based with PDF artifacts.
- Main gap is robustness, configurability, and production hardening rather than raw feature count.
