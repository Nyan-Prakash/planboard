# Product Requirements Document (PRD)

## Product
- Name: Planboard
- Type: Web application (Next.js App Router)
- Primary users: K-12 teachers
- Current status: MVP implemented with Supabase-backed persistence, folder organization, marketplace, ratings, and profile management

## 1. Product Overview
Planboard helps teachers generate classroom-ready activities from lesson context.

Current implemented experience:
- Authentication with Supabase Auth (email/password)
- Onboarding flow for post-signup profile setup
- 3-step generation wizard (auto-skips step 1 if profile complete)
- Streaming AI generation (4 activities per run, GPT-4o)
- Resource URL validation pass
- Activity persistence to Supabase
- Marketplace browsing with filters, sorting, search, and personalized recommendations
- Save/unsave to personal binder
- Ratings and review text per activity (upsert)
- Library management (own activities + saved activities + custom folders)
- Delete own generated activities
- Folder management (create, rename, recolor, delete, assign/remove activities)
- Profile editing (name, email, grade level, subject)
- Waitlist signup from landing page
- Teacher notes per activity (localStorage-backed)
- Copy activity content to clipboard

## 2. Problem Statement
Teachers need fast, high-quality, context-aware activity plans. Manual planning is time-consuming and inconsistent across grade levels and subjects.

Planboard shortens planning time by producing structured, actionable activity blueprints aligned to teacher input.

## 3. Goals
- Reduce time required to create classroom activities.
- Produce age-appropriate and subject-relevant plans.
- Provide implementation-ready detail (materials, phases, evaluation, reflection).
- Enable discovery and reuse through a shared marketplace and personal binder.
- Capture rating feedback to surface quality signals.
- Support personal organization through folders.

## 4. Non-Goals (Current Scope)
- LMS integrations (Google Classroom, Canvas)
- Collaborative editing/workspaces
- Standards mapping and curriculum import
- Advanced analytics/admin dashboards
- Multi-language localization

## 5. Primary User Flows

### 5.1 Auth
1. User registers on `/register` (Supabase `signUp` with name, email, password).
2. After registration, user is taken to `/onboarding` to select grade level and subject (if profile incomplete).
3. User signs in on `/login` (Supabase `signInWithPassword`).
4. Middleware redirects unauthenticated users from protected routes (`/wizard`, `/library`, `/rate`) to login.
5. Authenticated users are redirected away from `/login` and `/register` to `/wizard/step-1`.

### 5.2 Activity Generation
1. Step 1 (`/wizard/step-1`): choose grade level + subject. Server redirects to step-2 (with URL params) if profile is already complete.
2. Step 2 (`/wizard/step-2`): choose activity type + enter lesson info and learning objectives.
3. Step 3 (`/wizard/step-3`): auto-calls `/api/generate`.
4. Client reads text stream, extracts JSON, maps result to local `Activity[]` with temporary IDs (`"generated-0"`, etc.).
5. Client calls `/api/validate-urls` and removes invalid resource links from rendering.
6. Client calls `/api/activities/persist` to store generation request + activities.
7. If persistence succeeds, temporary generated IDs are replaced with DB UUIDs.
8. If persistence fails, generated activities still remain usable in session state.

### 5.3 Browse, Save, Rate, Manage
1. Marketplace (`/marketplace`) lists public activities with filters/sorting/search and a personalized "Recommended for You" section.
2. Detail (`/marketplace/[id]`) shows full activity content, aggregate ratings, user reviews, and save/rate actions.
3. Logged-in users can toggle save via `/api/activities/[id]/save`.
4. Logged-in users can submit/update rating via `/api/ratings`.
5. Library (`/library`) shows:
   - My Activities (created by user, with delete)
   - Saved (bookmarked marketplace activities)
   - Folders (custom collections with CRUD)
6. User can delete owned activities via `DELETE /api/activities/[id]`.
7. User can organize activities into color-coded folders via `/api/folders`.

## 6. Functional Requirements (Implemented)

### FR-1 Authentication and Access Control
- Email/password register and login via Supabase.
- Middleware session refresh on all routes.
- Protected route enforcement for wizard, library, and rating pages.
- Authenticated users are redirected away from `/login` and `/register` to `/wizard/step-1`.

### FR-2 Onboarding and Profile
- Post-signup `/onboarding` page captures grade level and subject (only accessible if profile incomplete).
- `/profile` page allows users to update name, email, grade level, and subject at any time.

### FR-3 Wizard Input Collection
- Step 1 requires grade level and subject. Server-side check skips step 1 with profile values if already set.
- Step 2 requires activity type + both text fields with minimum 10 characters.
- Wizard state persists in browser session storage via Zustand `persist`.
- Changing grade/subject/type/inputs clears previously generated activities and forces re-generation.

### FR-4 AI Generation
- `POST /api/generate` validates request with Zod (`generateSchema`).
- Server streams model output from OpenAI (`gpt-4o`) using AI SDK `streamText()`.
- Prompt instructs exactly 4 activities across different categories with strict JSON structure.
- Categories: debate, documentary, acting, conference, experiment, quiz, group_discussion, creative_project, presentation, simulation, field_study, peer_teaching, role_play, research_project.
- Resources target real URLs: Wikipedia, Khan Academy, YouTube, PBS Learning Media, National Geographic.

### FR-5 URL Validation
- `POST /api/validate-urls` performs HEAD checks with 5-second timeout per URL.
- Invalid URLs are removed from displayed resources while preserving titles.

### FR-6 Persistence
- `POST /api/activities/persist` requires authenticated user.
- Uses service-role client to bypass RLS.
- Stores one `generation_requests` row (status: "completed") and many `activities` rows.
- Activities are stored as public (`is_public: true`) for marketplace discovery.

### FR-7 Marketplace and Library
- Marketplace supports filters: grade, subject, activity type, category, rating (3+, 4+).
- Sort modes: newest, highest_rated, most_rated.
- Full-text search across title, summary, and category.
- Personalized "Recommended for You" horizontal scroll section based on user's grade level and subject.
- Marketplace query capped to latest 50 matching public activities.
- Library supports text search and filters (grade, subject, type, category) with tabs for own, saved, and folders.
- Library sort modes: newest, oldest, A-Z, Z-A.

### FR-8 Save/Unsave
- `POST /api/activities/[id]/save` toggles saved state in `saves` table for the current user.
- Returns `{ saved: boolean }`.

### FR-9 Ratings
- `POST /api/ratings` validates with Zod and upserts by `(user_id, activity_id)`.
- `GET /api/ratings?activityId=...` returns current user's existing rating when logged in.
- Required metrics: suitability, goalAchievement, recommendation (1–5).
- Optional: overallRating (1–5), reviewText (≤2000 chars), comment.
- Marketplace detail shows aggregated rating averages and all user reviews.

### FR-10 Activity Detail Usability
- Detail views render structured sections:
  - overview
  - research & preparation
  - format/materials
  - phased structure (duration, phases with name/duration/instructions)
  - evaluation/rubric (criteria with name/weight/description)
  - reflection questions
  - resources (title, optional URL, type)
  - differentiation (higher level / lower level adaptations)
- Wizard detail page includes local teacher notes saved in `localStorage`.
- Copy-to-clipboard button on activity detail pages.

### FR-11 Deletion
- `DELETE /api/activities/[id]` only allows owner deletion.
- API verifies ownership before delete and returns `403` if user is not owner.

### FR-12 Folder Management
- Users can create color-coded folders (teal, rose, sage, accent) from the Library.
- Folders support rename, recolor, and delete (cascades to folder_activities).
- Activities can be added to or removed from folders via hover actions and folder detail views.
- Full REST API for folder management.

### FR-13 Waitlist
- Landing page includes a waitlist signup form.
- Signups stored in `waitlist_signups` table with source tagging.
- Unique constraint on email prevents duplicate signups.

## 7. Data Model (Current)

Core tables:
- `profiles` — user profile mirrored from `auth.users` (id, email, name, subject, grade_level)
- `generation_requests` — tracks generation sessions (grade_level, subject, activity_type, lesson_info, learning_objectives, status)
- `activities` — persisted generated activities (title, category, summary, content JSONB, is_public, grade_level, subject, activity_type)
- `ratings` — user ratings per activity (suitability, goal_achievement, recommendation, overall_rating, review_text, comment)
- `saves` — bookmarked activities per user
- `folders` — user-created collections (name, color)
- `folder_activities` — activity-to-folder mappings (folder_id, activity_id, user_id)
- `waitlist_signups` — landing page email captures (email, source)

Derived view:
- `activity_stats` — rating count + averaged rating metrics per activity

Key constraints:
- Ratings unique per (user_id, activity_id)
- Saves unique per (user_id, activity_id)
- Folder activities unique per (folder_id, activity_id)
- Waitlist signups unique per email
- Foreign keys with cascade deletes from parent records

## 8. Security and Access
- Supabase row-level security policies defined in initial migration.
- Public read access for public activities and ratings aggregate use cases.
- User-scoped write access for own requests, activities, ratings, saves, and folders.
- Service-role client used in `POST /api/activities/persist` for insertion workflow.
- Ownership verified in `DELETE /api/activities/[id]` (returns 403 if not owner).

## 9. Non-Functional Requirements

### Performance
- Generation UX targets initial feedback quickly and full completion around 10–20 seconds.
- Marketplace query capped to 50 activities per request.

### Reliability
- Zod validation errors returned for invalid generate/rating payloads.
- Generation flow has retry path in wizard UI.
- Persistence failure does not block local session usage.
- URL validation failures don't block generation (resources silently filtered).

### Usability
- Linear wizard progression with guard redirects.
- Responsive UI across desktop/mobile.
- Explicit empty states for library, folders, and generation errors.
- Desk-themed UI with paper cards, sticky cards, and stamp badges.

## 10. API Surface (Current)

- `POST /api/generate`
  - Input: gradeLevel, subject, activityType, lessonInfo, learningObjectives
  - Output: streamed text response from GPT-4o
- `POST /api/validate-urls`
  - Input: `{ urls: string[] }`
  - Output: `{ valid: string[] }`
- `POST /api/activities/persist`
  - Auth required
  - Input: generation metadata + activities array
  - Output: `{ generationRequestId, activities }`
- `POST /api/activities/[id]/save`
  - Auth required
  - Output: `{ saved: boolean }`
- `DELETE /api/activities/[id]`
  - Auth + ownership required
  - Output: `{ deleted: true }`
- `POST /api/ratings`
  - Auth required
  - Upserts rating by (user_id, activity_id)
- `GET /api/ratings?activityId=<uuid>`
  - Returns current user rating (or null if not logged in / no rating)
- `GET /api/folders`
  - Auth required
  - Returns user's folders list
- `POST /api/folders`
  - Auth required
  - Input: `{ name, color? }`
  - Output: created folder
- `PATCH /api/folders/[id]`
  - Auth required
  - Input: `{ name?, color? }`
  - Output: updated folder
- `DELETE /api/folders/[id]`
  - Auth required
  - Cascades to folder_activities
- `POST /api/folders/[id]/activities`
  - Auth required
  - Adds activity to folder
- `DELETE /api/folders/[id]/activities`
  - Auth required
  - Removes activity from folder

## 11. Current Product Surfaces
- `/` — landing page with hero, waitlist form, marketplace teaser
- `/login`, `/register`
- `/onboarding` — post-signup profile setup (grade level + subject)
- `/profile` — profile editing (name, email, grade level, subject)
- `/wizard/step-1`, `/wizard/step-2`, `/wizard/step-3`
- `/wizard/step-3/[activityId]` — full activity detail with teacher notes and copy
- `/marketplace` — activity discovery with recommendations, filters, search, sort
- `/marketplace/[id]` — activity detail with ratings, reviews, save button
- `/library` — tabs: My Activities, Saved, Folders
- `/rate/[activityId]`
- `/dashboard` — redirects to `/library`

## 12. Known Gaps and Risks
- `/api/generate` enforces input schema but does not server-validate AI output schema before client parse.
- Stream parsing on the client relies on extracting JSON text from model output via regex.
- URL validation uses HEAD; some valid resources may reject HEAD requests.
- Marketplace currently assumes all persisted activities are public by default (no visibility controls).
- No explicit rate limiting for generation or rating endpoints.
- `activity_stats` view logic not explicitly validated against edge cases (no ratings, partial ratings).

## 13. Success Metrics (Recommended Tracking)
- Wizard completion rate (step 1 to generated results)
- Generation success/failure rate
- Time-to-first-activity and full generation duration
- Persist success rate
- Save rate (per marketplace view)
- Folder creation and activity-assignment rate
- Rating completion rate
- Average overall rating and review volume per activity
- Waitlist signup conversion rate

## 14. Next Iteration Priorities
1. Add server-side schema validation/parsing for AI response before returning results.
2. Add optional visibility controls (`is_public`) during or after generation.
3. Add pagination and richer filters in marketplace/library (beyond 50-activity cap).
4. Add endpoint rate limiting and observability instrumentation.
5. Add analytics event pipeline for funnel and quality metrics.
6. Surface folder contents in a dedicated folder detail view.
7. Allow activity export (PDF or print-friendly format).
