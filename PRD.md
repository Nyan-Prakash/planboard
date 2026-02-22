# Product Requirements Document (PRD)

## Product
**Name:** Planboard  
**Type:** Web application (Next.js)  
**Primary Users:** K-12 teachers

## 1. Overview
Planboard is an AI-powered activity generation tool that helps teachers turn lesson context into practical classroom activities. Teachers select grade level and subject, provide lesson information and learning objectives, and receive four structured activity plans with implementation guidance, evaluation criteria, reflection prompts, and suggested resources.

The current product includes:
- A 3-step activity generation wizard
- AI generation endpoint with streamed output
- Activity detail pages
- Activity rating UI
- Basic email/password authentication (register + login)

## 2. Problem Statement
Teachers spend significant time designing engaging, standards-aligned classroom activities. Manual planning often creates delays and inconsistencies in quality, especially when adapting to grade level and subject context.

Planboard addresses this by producing ready-to-use activity blueprints from teacher-provided lesson context in seconds.

## 3. Goals and Success Criteria
### Goals
- Reduce teacher planning time for activity design.
- Provide age-appropriate, subject-relevant activities.
- Improve classroom implementation quality via structured activity outputs.
- Capture teacher feedback to improve future recommendations.

### Success Criteria (MVP)
- A user can generate activities end-to-end in under 60 seconds (excluding user typing).
- Each generation returns exactly 4 activities in valid structured format.
- At least 90% of generation requests return without server error.
- Activity detail pages render all required sections for generated activities.

## 4. Non-Goals (Current Scope)
- LMS integration (Google Classroom, Canvas, etc.)
- Multi-language localization
- Collaborative editing across users
- Admin analytics dashboard
- Automated model fine-tuning from rating data

## 5. Target Users and Personas
### Primary Persona: Classroom Teacher
- Teaches K-12 subject classes.
- Needs quick, practical activities tied to lesson goals.
- Values implementable instructions over abstract ideas.

### Secondary Persona: Department Lead / Instructional Coach
- Reviews or recommends activities.
- Values consistency, differentiation, and evaluability.

## 6. User Stories
- As a teacher, I want to choose grade and subject so outputs match my class context.
- As a teacher, I want to enter lesson info and learning objectives so activities align with my planned instruction.
- As a teacher, I want multiple activity options so I can choose what fits my classroom constraints.
- As a teacher, I want detailed activity structure, materials, and assessment criteria so I can run the activity immediately.
- As a teacher, I want to rate generated activities so future recommendations can improve.

## 7. Product Scope
### In Scope (MVP)
- Landing page with CTA into generation flow.
- 3-step wizard:
  - Step 1: grade level + subject
  - Step 2: activity type + lesson info + learning objectives
  - Step 3: generation + activity cards
- Activity detail page with full structured content sections.
- Rating page with 3 star metrics + optional comment.
- User registration and login using credentials provider.
- URL validation for generated resources.

### Out of Scope (MVP)
- Persisted activity library per user in dashboard.
- Persisted rating submissions.
- Server-side authorization enforcement on wizard/dashboard routes.

## 8. Functional Requirements
### FR-1: Authentication
- Users can register with name, email, and password.
- Users can log in with email/password.
- Invalid credentials and duplicate email conditions must return clear errors.

### FR-2: Wizard Step 1 (Context Selection)
- User must select one grade level from:
  - Primary School
  - Middle School
  - High School
- User must select one subject from predefined list plus “other”.
- Continue action remains disabled until both values are set.

### FR-3: Wizard Step 2 (Lesson Input)
- User must select one activity type:
  - Educational
  - Assessment
- User must enter:
  - `lessonInfo` (minimum 10 characters)
  - `learningObjectives` (minimum 10 characters)
- Generate button remains disabled until all fields are valid.

### FR-4: Activity Generation
- On Step 3 load, app submits request to `/api/generate`.
- Backend validates payload shape and constraints.
- AI response is streamed and parsed to JSON.
- System returns exactly 4 activities.
- Each activity includes:
  - title, category, summary
  - overview
  - research/preparation description and steps
  - format and materials
  - structure with phases and durations
  - evaluation criteria (+ optional rubric)
  - reflection questions
  - resources
  - differentiation (higher/lower level)

### FR-5: Resource URL Validation
- Generated resource URLs are validated via `/api/validate-urls`.
- Invalid URLs are removed from link rendering (title remains).

### FR-6: Activity Browsing
- Generated activities are shown as cards on Step 3.
- Clicking a card opens detail page for selected activity.
- Detail page renders all structured sections with readable formatting.

### FR-7: Rating Flow
- User can rate activity on:
  - suitability
  - goal achievement
  - recommendation
- Each metric requires 1-5 stars.
- Optional free-text comment allowed.
- Submission shows confirmation state.

### FR-8: Session-State Behavior
- Wizard inputs persist within browser session.
- Generated activities exist in client state for current session flow.
- Accessing detail/rating without available in-memory activity shows fallback message.

## 9. Data Requirements
### Core Entities (Defined in Schema)
- `users`
- `generation_requests`
- `activities`
- `ratings`

### Current Implementation Note
- Database schema includes persistence tables for requests, activities, and ratings.
- Current UI/API implementation primarily uses client-side state for generated activities and rating submission feedback.
- Full persistence for generation outputs and ratings should be part of next milestone.

## 10. Non-Functional Requirements
### Performance
- First generation response should begin streaming within ~10 seconds under normal load.
- Typical end-to-end generation completion target: 10-20 seconds.

### Reliability
- API should return structured validation errors for invalid input.
- Graceful failure UI with retry action on generation errors.

### Security
- Passwords must be hashed (bcrypt).
- Secrets managed in environment variables.
- Avoid exposing API keys in client code.

### Usability
- Wizard navigation should be linear and guard prerequisites.
- Forms must provide clear disabled/validation states.
- Mobile and desktop layouts must remain usable.

## 11. UX Requirements
- Clear step progress indicator for wizard stages.
- Minimal cognitive load per step.
- Card-based generated result browsing.
- Detail page optimized for instructional readability (sections, tables, badges).
- Regenerate action available after successful generation.

## 12. API Requirements
- `POST /api/register`
  - Creates user after validation and duplicate check.
- `POST /api/auth/[...nextauth]`
  - Authenticates via credentials provider.
- `POST /api/generate`
  - Validates generate payload and streams model output.
- `POST /api/validate-urls`
  - Validates resource URLs and returns valid subset.

## 13. Analytics and KPIs
### Product Metrics
- Wizard completion rate (step 1 -> step 3 success).
- Generation success rate.
- Average generation latency.
- Regeneration rate.
- Rating submission rate per generated activity.
- Mean star ratings across 3 dimensions.

### Quality Metrics
- Percentage of outputs matching expected JSON structure.
- Percentage of valid resource URLs after validation.
- User-reported usefulness (from comment sentiment or explicit survey).

## 14. Release Plan
### Phase 1 (Current MVP)
- Core wizard flow
- AI generation and display
- Registration/login
- Client-side rating confirmation

### Phase 2
- Persist generation requests, activities, and ratings to DB
- User-specific dashboard backed by persisted data
- Route protection for authenticated experiences

### Phase 3
- Search/filter saved activities
- Export/share activity plans
- Feedback-driven recommendation improvements

## 15. Risks and Mitigations
- AI output schema drift  
  Mitigation: strict prompt format + server-side schema validation/parsing hardening.
- Hallucinated/invalid resources  
  Mitigation: URL validation endpoint and safe rendering fallback.
- Data loss on refresh/navigation  
  Mitigation: persist generated results and ratings in backend.
- Weak auth gating on app routes  
  Mitigation: enforce middleware/route-level auth checks in next iteration.

## 16. Open Questions
- Should generation and rating actions require mandatory login?
- Should ratings be editable after submission?
- What retention period is needed for generated activities?
- What minimum dashboard capabilities are required for V1 persistence release?

## 17. Acceptance Criteria (MVP)
- User can register and log in successfully.
- User can complete wizard with valid inputs.
- System generates and displays 4 activities with full structure.
- User can open each activity detail and view all content sections.
- User can submit a 3-metric rating with optional comment and receive success confirmation.
- Error and retry paths work when generation fails.
