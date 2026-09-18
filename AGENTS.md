# AGENTS.md

## 1. Project Overview

This repository contains the Child Learning & Progress Platform.

The product is a mobile-first responsive web application for parents, teachers, and children to record, practice, assess, and understand a child's learning journey.

The initial real-world use case is home learning and Abacus tracking, but the platform must remain subject-agnostic.

---

## 2. Product Documentation

Before implementing a significant feature, read the relevant product and architecture documentation.

Product documentation:

```text
docs/01-product/
├── 01-prd.md
├── 02-user-stories.md
├── 03-use-cases.md
├── 04-screen-map.md
└── 05-user-flows.md
```

Architecture documentation:

```text
docs/02-architecture/
├── 01-system-architecture.md
├── 02-domain-model.md
├── 03-database-design.md
├── 04-api-design.md
├── 05-angular-architecture.md
├── 06-backend-architecture.md
└── 07-security-architecture.md
```

When working on a feature, use the smallest relevant set of documents needed to understand the requirement.

---

## 3. Product Principles

The product should:

- Be mobile-first.
- Support desktop and tablet.
- Minimize unnecessary user input.
- Keep the active child clearly visible.
- Support multiple children per parent.
- Support parent and teacher workflows.
- Keep learning data structured.
- Keep the platform subject-agnostic.
- Preserve historical learning and assessment information.
- Protect child-related data.
- Prefer simple solutions over unnecessary complexity.

---

## 4. Architecture Principles

The architecture is based on:

```text
Angular
    ↓
REST API
    ↓
Node.js + Express + TypeScript
    ↓
MongoDB Atlas
```

The initial backend architecture is a modular monolith.

Do not introduce microservices unless there is a documented product or operational reason.

Use clear boundaries between:

- Presentation
- Application/business logic
- Data access
- Infrastructure

---

## 5. Repository Structure

The repository is a monorepo.

Target structure:

```text
child-learning-platform/
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   └── shared/
│
├── docs/
│   ├── 01-product/
│   ├── 02-architecture/
│   └── 03-decisions/
│
├── AGENTS.md
├── README.md
└── .gitignore
```

Do not create this structure until the development setup phase explicitly requires it.

---

## 6. Angular Rules

The frontend uses modern Angular.

Prefer:

- Standalone components
- Standalone routes
- Functional guards
- Functional interceptors
- Signals
- RxJS
- Lazy-loaded feature routes
- Strict TypeScript
- OnPush change detection where appropriate

Avoid legacy NgModule-first architecture unless a dependency genuinely requires it.

---

## 7. Angular Feature Architecture

Use feature-based organization.

Example:

```text
features/
├── auth/
├── dashboard/
├── children/
├── learning/
├── lesson-plans/
├── practice/
├── assessments/
├── progress/
├── rewards/
├── journal/
├── teacher/
└── admin/
```

Do not organize the entire application around only:

```text
components/
services/
models/
```

with unrelated business logic mixed together.

---

## 8. Angular Core Layer

The `core` layer contains application-wide infrastructure.

Examples:

```text
auth/
guards/
interceptors/
http/
services/
error-handling/
config/
```

Do not place feature-specific business components in `core`.

---

## 9. Angular Shared Layer

The `shared` layer contains reusable, domain-neutral UI and utilities.

Examples:

```text
Button
Card
Modal
Toast
Skeleton
Empty State
Pagination
Form Controls
```

Do not place business-specific components in `shared`.

For example, an Abacus-specific progress component belongs in the relevant feature, not `shared`.

---

## 10. Angular State Management

Use the simplest state solution that satisfies the feature.

Preferred order:

1. Local component state
2. Angular Signals
3. Feature-level state/store
4. NgRx when justified by real complexity

Do not introduce NgRx automatically for every feature.

Use RxJS for asynchronous streams and stream-oriented workflows.

---

## 11. Angular HTTP

Components should not contain repeated raw HTTP calls.

Preferred flow:

```text
Component
    ↓
Feature Service / State
    ↓
API Service
    ↓
HttpClient
    ↓
REST API
```

Feature API services should encapsulate backend communication.

---

## 12. Angular Forms

Use Angular reactive forms for structured forms.

Forms must provide:

- Strong typing
- Client-side validation
- Clear validation messages
- Loading/submitting state
- Server-error handling

Important forms include:

- Login
- Registration
- Add Child
- Learning Log
- Lesson Plan
- Question
- Assessment
- Journal Entry

---

## 13. Backend Rules

Backend technology:

```text
Node.js
Express
TypeScript
MongoDB Atlas
```

Controllers should remain thin.

Preferred flow:

```text
Route
    ↓
Middleware
    ↓
Controller
    ↓
Service
    ↓
Repository / Data Access
    ↓
MongoDB
```

Business logic belongs primarily in services/domain logic, not controllers.

---

## 14. Backend Module Structure

Organize backend code by business domain.

Examples:

```text
auth
users
children
subjects
topics
skills
learning
lesson-plans
practice
questions
assessments
progress
rewards
journal
teacher
admin
```

Avoid a global structure where all controllers, services, and models for unrelated features are mixed together.

---

## 15. Backend Validation

All external input is untrusted.

Validate:

- Request bodies
- Query parameters
- Route parameters
- IDs
- Enum values
- Dates
- Numeric ranges
- Nested objects
- Uploaded files

Frontend validation improves usability but does not replace backend validation.

---

## 16. Backend Authorization

Backend authorization is the authoritative security boundary.

Never trust the frontend to enforce permissions.

Examples:

```text
Parent
→ verify parent-child relationship

Teacher
→ verify teacher-student assignment

Admin
→ verify administrative permission
```

Every protected child-related operation must verify authorization.

---

## 17. Child Data Isolation

Child-related data must always be associated with the appropriate child.

Examples:

```text
learningSessions
lessonPlans
practiceSessions
assessmentAttempts
achievements
journalEntries
```

must identify the relevant child.

A user must not gain access to another child's data simply by changing an ID in the request.

---

## 18. Assessment Integrity

Final assessment results must be authoritative on the backend.

Do not trust the client for:

- Final score
- Final accuracy
- Marks
- Completion state
- Achievement awards

Historical assessment attempts should preserve enough snapshot information to represent what was actually tested.

---

## 19. Security Rules

Never commit secrets.

Do not place these in source control:

```text
.env
production credentials
database passwords
API keys
private keys
authentication secrets
AI provider secrets
```

Never log:

```text
Passwords
Tokens
Authentication secrets
Sensitive personal information unnecessarily
```

Use appropriate environment/secret management.

---

## 20. Database Rules

MongoDB Atlas is the primary database.

Use:

- Explicit schemas
- Appropriate indexes
- Validated queries
- Pagination
- Query limits

Do not allow raw user input to become arbitrary MongoDB operators, field names, or query fragments.

Avoid unbounded queries.

---

## 21. Database Design Principles

Prefer references for reusable entities.

Examples:

```text
User
Child
Subject
Topic
Skill
Question
Assessment
```

Prefer embedded structures for tightly related historical data where appropriate.

Examples:

```text
Assessment questions/answers
Practice questions/answers
Question snapshots
Small attachment metadata
```

Do not create a separate collection simply because a concept appears in the domain model.

---

## 22. Historical Data

Historical records must remain understandable even after configuration changes.

Examples:

- Editing a topic must not invalidate historical learning records.
- Editing a question must not rewrite an old assessment attempt.
- Changing an assessment must not change the meaning of a completed attempt.

Use snapshots or other appropriate mechanisms when required.

---

## 23. API Rules

Use the documented versioned API:

```text
/api/v1
```

Follow the API contracts defined in:

```text
docs/02-architecture/04-api-design.md
```

Use consistent:

- HTTP methods
- Status codes
- Request DTOs
- Response DTOs
- Error structures
- Pagination
- Filtering

Do not invent conflicting API conventions for individual features.

---

## 24. DTO Rules

Do not expose database documents directly as public API contracts.

Use explicit request and response DTOs.

Examples:

```text
CreateLearningSessionRequest
LearningSessionResponse
CreateChildRequest
AssessmentResultResponse
ProgressResponse
```

Keep API contracts separate from persistence implementation details.

---

## 25. Error Handling

Use centralized backend error handling.

Expected categories include:

```text
Validation Error
Authentication Error
Authorization Error
Not Found
Conflict
Invalid State
Internal Error
```

Return safe error responses.

Do not expose:

- Stack traces
- Database details
- Internal file paths
- Secrets
- Internal implementation details

to clients.

---

## 26. Testing Requirements

Features should include appropriate automated tests.

Testing levels:

```text
Unit
Integration
End-to-End
```

At minimum, important business logic and security-sensitive workflows must be tested.

Critical workflows include:

```text
Login
Add Child
Log Learning
View Learning History
Create Lesson Plan
Start Practice
Submit Practice
Start Assessment
Submit Assessment
View Progress
Authorization
```

---

## 27. Test Expectations

When implementing a feature:

1. Add or update relevant tests.
2. Run the relevant test suite.
3. Run lint.
4. Run build when applicable.
5. Fix failures caused by the change.
6. Report remaining issues clearly.

Do not remove tests merely to make a feature pass.

---

## 28. Code Quality

Use strict TypeScript.

Avoid `any` unless there is a documented reason.

Prefer:

- Clear naming
- Small focused functions
- Explicit types
- Simple control flow
- Reusable logic where justified
- Clear separation of responsibilities

Avoid unnecessary abstraction.

---

## 29. Dependency Rules

Before adding a dependency, consider:

- Does Angular/Node already provide the capability?
- Is the package maintained?
- Is it secure?
- Is it compatible with the project?
- Is the dependency necessary?
- Does it add meaningful value?

Do not introduce libraries simply because they are popular.

---

## 30. Performance Rules

Prefer measurable optimization.

Initial practices include:

- Lazy loading
- Efficient rendering
- Pagination
- Database indexing
- Avoiding unnecessary API requests
- Efficient queries
- Appropriate media loading

Do not introduce caching, queues, microservices, or other infrastructure without a justified need.

---

## 31. Mobile-First Rules

The product is mobile-first.

High-frequency workflows must be optimized for phones.

Especially:

```text
Select Child
→ Log Learning
→ Save
```

Avoid unnecessary typing, navigation, and modal interactions.

Desktop can provide richer analysis and administration.

---

## 32. Accessibility

Use:

- Semantic HTML
- Accessible labels
- Keyboard navigation
- Visible focus
- Appropriate form error handling
- Accessible interactive controls
- Meaningful loading and empty states

Accessibility should be considered when creating shared components.

---

## 33. Feature Boundaries

Avoid tight coupling between unrelated features.

For example:

The Learning feature should not directly manipulate Progress database/state internals.

Prefer:

```text
Learning
    ↓
Backend
    ↓
Progress
```

via documented contracts and services.

---

## 34. Child Context

Parent workflows use an active child context.

Features affected include:

```text
Learning
Lesson Plans
Practice
Assessments
Progress
Rewards
Journal
```

The active child must always be validated for authorization.

Switching children must not leave stale data from the previous child visible.

---

## 35. Assessment Session Rules

Assessment sessions require special care for:

- Timer
- Current question
- Answers
- Navigation
- Submission
- Duplicate submission
- Timeout
- State recovery

The backend is authoritative for final assessment state.

---

## 36. Practice Session Rules

Practice sessions may contain:

```text
Questions
Answers
Current Question
Progress
Timer where applicable
Result
```

Keep practice-session state within the practice feature.

---

## 37. Documentation Rules

When an implementation changes architecture or behavior, update the relevant documentation.

Examples:

```text
Product requirement change
→ Update product documentation

Architecture change
→ Update architecture documentation

Important technical decision
→ Add/update ADR
```

Documentation should remain aligned with the actual implementation.

---

## 38. Architecture Decision Records

Significant technical decisions should be documented in:

```text
docs/03-decisions/
```

Use ADRs for decisions that have meaningful long-term impact.

Examples:

- Authentication strategy
- Hosting strategy
- Storage strategy
- State-management decision
- Major dependency choice

Do not create an ADR for trivial implementation details.

---

## 39. Git Rules

Use small, focused commits.

Preferred commit style:

```text
docs: ...
feat: ...
fix: ...
test: ...
refactor: ...
chore: ...
```

Examples:

```text
docs: add initial product documentation
feat: add parent authentication
feat: add child management
feat: add learning log
fix: prevent unauthorized child access
test: add learning service tests
```

Do not mix unrelated changes into one commit.

---

## 40. Branching Rules

Use feature branches for application development.

Example:

```text
main
  ↑
feature/authentication
feature/child-management
feature/learning-log
feature/mock-tests
```

Do not make unrelated changes directly on the main branch.

---

## 41. Pull Request Rules

A pull request should include:

- What changed
- Related user story
- Relevant use case
- Tests performed
- Important architectural changes
- Security considerations where relevant
- Screenshots for meaningful UI changes

Keep pull requests focused.

---

## 42. Codex Planning Rules

For a significant feature, Codex should first understand:

```text
PRD
→ User Story
→ Use Case
→ Screen
→ Architecture
→ API
→ Database
```

For complex work, create a plan before implementation.

Do not immediately generate large amounts of code without understanding the existing architecture.

---

## 43. Codex Implementation Rules

When implementing a feature, Codex should:

1. Inspect the relevant existing code.
2. Read the relevant documentation.
3. Explain or produce an implementation plan when the task is complex.
4. Make focused changes.
5. Avoid unrelated refactoring.
6. Add/update tests.
7. Run validation commands.
8. Report changed files.
9. Report test/build results.
10. Report unresolved issues.

---

## 44. Codex Review Rules

Codex may be used after implementation to review:

- Security
- Authorization
- Type safety
- Error handling
- Test coverage
- Performance
- Code duplication
- Architecture consistency

Implementation and review should be treated as separate activities when practical.

---

## 45. No Unapproved Architecture Changes

Codex must not independently introduce major architectural changes such as:

- New frameworks
- New databases
- Microservices
- Event buses
- Global state libraries
- Major authentication changes
- New deployment platforms

without explicit review.

Small implementation decisions may be made when they clearly follow existing architecture.

---

## 46. No Unrelated Changes

When implementing a requested feature:

- Do not modify unrelated features.
- Do not perform broad refactors unless explicitly requested.
- Do not rename unrelated files.
- Do not upgrade dependencies without a reason.
- Do not change configuration unnecessarily.

Keep the change set focused.

---

## 47. Before Completing a Coding Task

Run the appropriate validation.

Typical sequence:

```text
Type Check / Build
↓
Lint
↓
Unit Tests
↓
Integration Tests where relevant
↓
E2E Tests where relevant
```

If a command is unavailable, report that instead of claiming it passed.

---

## 48. Definition of Done

A feature is not complete merely because the code compiles.

Where applicable, completion means:

- Requirement implemented
- Acceptance criteria satisfied
- Authorization implemented
- Validation implemented
- Tests added/updated
- Lint passes
- Build passes
- Relevant tests pass
- Documentation updated if required
- No unrelated changes
- Known limitations reported

---

## 49. Security-Sensitive Changes

Explicit human review is required before production deployment for changes involving:

- Authentication
- Authorization
- Child-data access
- Assessment integrity
- Media access
- Secrets
- Database permissions
- Security middleware

Codex may assist with implementation and review, but security-sensitive changes must be deliberately reviewed.

---

## 50. Product Scope Discipline

Do not add features merely because they seem interesting.

When implementing V1, prioritize the approved MVP scope.

Future ideas such as:

- AI
- Notifications
- Advanced analytics
- Messaging
- Subscriptions
- Real-time communication

should not be added to V1 unless the product scope is intentionally changed.

---

## 51. Abacus Is Not the Core Domain

Abacus is the initial real-world use case.

Do not create an architecture that assumes the entire platform is Abacus-only.

Prefer generic concepts such as:

```text
Subject
Topic
Skill
Learning
Practice
Assessment
Progress
Achievement
```

rather than hard-coding Abacus-specific business logic into shared/core architecture.

---

## 52. AI Usage

AI capabilities are future functionality.

Do not add AI dependencies, AI APIs, or AI-generated content workflows until explicitly required.

When AI is introduced:

- Keep provider credentials on the backend.
- Validate generated content.
- Maintain appropriate child-safety considerations.
- Do not assume AI output is automatically correct.
- Keep AI behind controlled application services.

---

## 53. Media Rules

Photos and videos must not be stored casually in the application database.

Use object storage for actual media where appropriate.

MongoDB should store metadata/references.

Media access must respect child authorization.

---

## 54. Production Rules

Production configuration must be separate from local development.

Production secrets must never be committed.

Production changes should go through the established CI/CD process once configured.

Do not use production credentials for local testing unless explicitly required and safely controlled.

---

## 55. When Requirements Conflict

If code, existing documentation, and a new request conflict:

1. Identify the conflict.
2. Do not silently rewrite architecture.
3. Explain the conflict.
4. Follow the latest explicitly approved requirement.
5. Update documentation when the change is accepted.

---

## 56. When Information Is Missing

Do not invent important requirements.

If a missing decision materially affects implementation:

- Identify the missing information.
- Propose reasonable options.
- Wait for approval when the decision has meaningful architectural impact.

For small implementation details with an obvious low-risk solution, use the existing project conventions.

---

## 57. General Coding Principle

Prefer:

```text
Simple
Clear
Secure
Testable
Maintainable
```

over:

```text
Over-engineered
Highly abstract
Difficult to operate
Prematurely optimized
```

---

## 58. Final Instruction

The repository documentation and approved architecture are the source of truth for implementation.

Before making significant changes:

```text
Understand
→ Plan
→ Implement
→ Test
→ Review
→ Document
```

The project owner remains responsible for approving product and architectural decisions.
