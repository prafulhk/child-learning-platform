# Angular Architecture

**Document:** Angular Application Architecture  
**Version:** 0.1  
**Status:** Draft  
**Last Updated:** 2026-09-18

---

# 1. Purpose

This document defines the frontend architecture for the Child Learning & Progress Platform.

It describes:

- Angular application structure
- Feature boundaries
- Routing
- Layouts
- State management
- API communication
- Authentication
- Authorization
- Shared UI
- Forms
- Error handling
- Loading states
- Responsive design
- Testing
- Maintainability
- Scalability
- Frontend development conventions

The architecture is designed for a modern standalone Angular application and should support the long-term growth of the product.

---

# 2. Architectural Goals

The Angular application should be:

1. Feature-oriented.
2. Modular without unnecessary complexity.
3. Easy to understand for new developers.
4. Easy for Codex and other development tools to navigate.
5. Strongly typed.
6. Testable.
7. Responsive.
8. Accessible.
9. Performant.
10. Secure by design.
11. Independent from backend implementation details.
12. Scalable as new product features are introduced.

---

# 3. Angular Version Direction

The application will use a current supported Angular version selected during project initialization.

The project should use Angular's modern standalone APIs.

The application should avoid legacy NgModule-first architecture unless a specific dependency requires it.

Preferred Angular concepts include:

- Standalone components
- Standalone directives
- Standalone pipes
- `inject()`
- Signals
- RxJS interoperability
- Functional route guards
- Functional HTTP interceptors
- Lazy-loaded routes

---

# 4. High-Level Frontend Architecture

The application is organized around feature domains.

```text
Angular Application
        |
        +-- Core
        |
        +-- Shared
        |
        +-- Layouts
        |
        +-- Features
        |
        +-- Routing
        |
        +-- Models / Contracts
```

Conceptually:

```text
                 Angular Application
                         |
        +----------------+----------------+
        |                |                |
       Core           Shared          Features
        |                |                |
   Application        Reusable       Business
   Infrastructure     UI            Capabilities
                                        |
                  +---------------------+---------------------+
                  |          |          |          |          |
               Learning    Tests    Progress   Rewards   Children
```

---

# 5. Recommended Source Structure

Initial Angular source structure:

```text
src/app/
│
├── core/
│   ├── auth/
│   ├── guards/
│   ├── interceptors/
│   ├── http/
│   ├── services/
│   ├── error-handling/
│   └── config/
│
├── shared/
│   ├── components/
│   ├── directives/
│   ├── pipes/
│   ├── forms/
│   ├── models/
│   └── utils/
│
├── layouts/
│   ├── parent-layout/
│   ├── teacher-layout/
│   ├── child-layout/
│   └── admin-layout/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── children/
│   ├── subjects/
│   ├── learning/
│   ├── lesson-plans/
│   ├── practice/
│   ├── assessments/
│   ├── progress/
│   ├── rewards/
│   ├── journal/
│   ├── teacher/
│   └── admin/
│
├── models/
│
├── app.routes.ts
└── app.config.ts
```

This is the initial direction and will be refined as implementation progresses.

---

# 6. Feature-Based Architecture

Business functionality should be grouped by feature rather than by technical type.

Prefer:

```text
features/
  learning/
  assessments/
  progress/
```

over a global structure such as:

```text
components/
services/
models/
```

containing unrelated files from every business domain.

The goal is to make each feature understandable as a cohesive unit.

---

# 7. Feature Internal Structure

A complex feature may use a structure such as:

```text
learning/
├── pages/
├── components/
├── services/
├── state/
├── models/
├── routes.ts
└── learning.routes.ts
```

Example:

```text
features/learning/
├── pages/
│   ├── learning-history/
│   ├── learning-detail/
│   └── learning-form/
│
├── components/
│   ├── learning-card/
│   ├── learning-filters/
│   └── learning-summary/
│
├── services/
│   └── learning-api.service.ts
│
├── state/
│   └── learning.store.ts
│
├── models/
│   └── learning.models.ts
│
└── learning.routes.ts
```

Not every feature must have every folder.

Keep the structure proportional to feature complexity.

---

# 8. Core Layer

The `core` layer contains application-wide infrastructure.

Examples:

```text
core/
├── auth/
├── guards/
├── interceptors/
├── http/
├── services/
├── error-handling/
└── config/
```

Core should contain things that are truly application-wide.

Examples:

- Authentication state
- Authorization services
- HTTP configuration
- API error handling
- Global application services
- Environment/configuration access

Core should not contain business-specific UI components.

---

# 9. Shared Layer

The `shared` layer contains reusable, domain-neutral functionality.

Examples:

- Buttons
- Modal
- Toast
- Card
- Skeleton
- Empty state
- Loading indicator
- Pagination
- Form controls
- Shared pipes
- Shared directives
- Generic utility functions

Shared components should not contain product-specific business logic.

For example:

Good:

```text
shared/components/modal
```

Avoid:

```text
shared/components/abacus-progress-card
```

An Abacus-specific component belongs in the relevant feature.

---

# 10. Layout Layer

Layouts provide role-specific application shells.

Initial layouts:

```text
layouts/
├── parent-layout/
├── teacher-layout/
├── child-layout/
└── admin-layout/
```

A layout is responsible for common application structure such as:

- Header
- Navigation
- Sidebar
- Mobile navigation
- User menu
- Content area

Business-specific content belongs inside feature routes.

---

# 11. Parent Application Structure

Conceptually:

```text
Parent Layout
      |
      +-- Dashboard
      +-- Children
      +-- Learning
      +-- Lesson Plans
      +-- Practice
      +-- Tests
      +-- Progress
      +-- Rewards
      +-- Journal
      +-- Profile
```

The active child context should be available throughout child-related parent workflows.

---

# 12. Teacher Application Structure

Conceptually:

```text
Teacher Layout
      |
      +-- Dashboard
      +-- Students
      +-- Learning
      +-- Lesson Plans
      +-- Practice
      +-- Tests
      +-- Progress
      +-- Profile
```

Teacher features must respect backend authorization.

---

# 13. Child Application Structure

Conceptually:

```text
Child Layout
      |
      +-- Home
      +-- Practice
      +-- Tests
      +-- Results
      +-- Achievements
```

The child experience should be intentionally simple.

---

# 14. Admin Application Structure

Conceptually:

```text
Admin Layout
      |
      +-- Dashboard
      +-- Users
      +-- Subjects
      +-- Topics
      +-- Skills
      +-- Questions
      +-- Assessments
      +-- Exam Types
```

Admin functionality should be lazy-loaded because it is a separate application area.

---

# 15. Routing Architecture

The application should use standalone route configuration.

Example conceptual structure:

```text
app.routes.ts
│
├── /login
├── /register
├── /parent/*
├── /teacher/*
├── /child/*
└── /admin/*
```

Feature routes should be lazy-loaded.

Example:

```text
/parent/learning
/parent/tests
/parent/progress
```

Each major area should have its own route configuration.

---

# 16. Route Lazy Loading

Large feature areas should be loaded lazily.

Examples:

```text
Parent Dashboard
Children
Learning
Practice
Assessments
Progress
Rewards
Journal
Teacher
Admin
```

The initial bundle should contain only what is needed to start the application.

---

# 17. Route Guards

The application should use functional route guards.

Conceptual guards:

```text
authGuard
roleGuard
guestGuard
```

Examples:

```text
/parent
  → authenticated + PARENT access

/teacher
  → authenticated + TEACHER access

/admin
  → authenticated + ADMIN access
```

Route guards improve user experience.

They are not the security boundary.

Backend authorization remains authoritative.

---

# 18. Authentication State

Authentication state should be centralized.

The authentication system should provide information such as:

```text
isAuthenticated
currentUser
roles
session state
```

Signals are preferred for local synchronous application state.

RxJS may be used for asynchronous authentication operations.

The final token/session storage mechanism will be defined by the security architecture.

---

# 19. Authorization

Angular should use authorization information to:

- Control navigation
- Hide unavailable actions
- Display appropriate screens
- Improve UX

However:

```text
Frontend authorization
≠
Security
```

The backend must independently verify permissions on every protected operation.

---

# 20. HTTP Architecture

All backend communication should go through Angular's HTTP infrastructure.

Conceptual flow:

```text
Component
    ↓
Feature Service
    ↓
HTTP Client
    ↓
Interceptor(s)
    ↓
REST API
```

Components should not contain repeated raw HTTP calls.

---

# 21. API Services

Each major feature should have an API service.

Examples:

```text
auth-api.service.ts
children-api.service.ts
learning-api.service.ts
lesson-plan-api.service.ts
practice-api.service.ts
assessment-api.service.ts
progress-api.service.ts
reward-api.service.ts
journal-api.service.ts
```

Responsibilities:

- API calls
- Request construction
- Response mapping
- Error propagation

Business decisions should remain outside low-level HTTP methods where practical.

---

# 22. HTTP Interceptors

Functional HTTP interceptors may handle cross-cutting concerns such as:

- Authentication/session handling
- Request correlation information where required
- Global error handling
- Loading indicators where appropriate

Avoid putting feature-specific business logic into global interceptors.

---

# 23. State Management Strategy

State management will use a layered approach.

## Local component state

Use Angular Signals for state that belongs to a single component or small component tree.

Examples:

```text
isLoading
selectedTab
filter state
modal visibility
form UI state
```

---

## Feature state

For complex features with multiple components sharing state, use a feature-level store pattern.

The initial preference is:

- Signals-based state where practical.
- RxJS where streams and asynchronous workflows are central.
- NgRx only where there is a clear need for structured global state, complex event flows, or cross-feature coordination.

The application should avoid introducing global state simply because a state-management library is available.

---

# 24. NgRx Usage Guidelines

NgRx may be used when a feature has:

- Complex shared state
- Multiple consumers
- Important state transitions
- Significant cross-feature dependencies
- Event-driven workflows
- A clear need for centralized state debugging

Potential candidates in future may include:

- Authentication
- Complex assessment sessions
- Large administrative workflows

Simple CRUD screens should not automatically use NgRx.

---

# 25. Signals Guidelines

Signals are preferred for synchronous reactive UI state.

Examples:

```text
selectedChild
isLoading
filters
viewMode
dashboardSummary
```

Computed signals may derive values from existing state.

Effects should be used carefully for side effects rather than replacing normal application services.

---

# 26. RxJS Guidelines

RxJS remains appropriate for:

- HTTP requests
- Async workflows
- Event streams
- Cancellation
- Debouncing
- Combining asynchronous sources
- WebSocket/real-time features in future
- Stream-based business workflows

Use RxJS where stream behavior provides real value.

Avoid converting every value into an observable unnecessarily.

---

# 27. Signal and RxJS Interoperability

Angular's RxJS interoperability should be used where useful.

Examples may include:

- `toSignal`
- `toObservable`

The application should define a clear boundary between:

```text
Observable-based async operations
```

and:

```text
Signal-based UI state
```

Avoid repeatedly converting between the two without a reason.

---

# 28. Forms Architecture

Use Angular reactive forms for structured user input.

Important forms include:

- Login
- Registration
- Add Child
- Learning Log
- Lesson Plan
- Question
- Assessment
- Journal Entry

Forms should include:

- Strong typing
- Client-side validation
- Clear error messages
- Loading state
- Disabled submit state where appropriate
- Server validation handling

---

# 29. Validation

Frontend validation should improve user experience.

Examples:

```text
Required
Min/Max length
Numeric range
Date constraints
Email format
Duration
Accuracy
```

Backend validation remains authoritative.

Frontend validation must never be treated as a security mechanism.

---

# 30. API Models and DTOs

The Angular application should use explicit frontend models for API contracts.

Examples:

```text
User
Child
Subject
Topic
Skill
LearningSession
LessonPlan
PracticeSession
Assessment
AssessmentAttempt
Achievement
JournalEntry
```

Request and response models should be explicit.

Examples:

```text
CreateLearningSessionRequest
LearningSessionResponse
CreateLessonPlanRequest
AssessmentResultResponse
```

Database-specific models should not leak directly into UI components.

---

# 31. Shared Type Strategy

The repository is a TypeScript monorepo.

Where practical, stable API contract types may be shared between frontend and backend through:

```text
packages/shared/
```

Potential shared content:

- DTO types
- Enums
- API contracts
- Common validation types

Do not share backend implementation details with Angular.

---

# 32. Active Child Context

The parent experience requires an active child context.

Conceptually:

```text
Parent
   ↓
Selected Child
   ↓
Feature
```

Features affected include:

- Learning
- Lesson Plans
- Practice
- Tests
- Progress
- Rewards
- Journal

The active child should be clearly visible in the UI.

---

# 33. Active Child Rules

When changing the selected child:

1. Verify that the child is authorized.
2. Update active child state.
3. Clear or refresh child-specific feature state where necessary.
4. Prevent stale child data from appearing.
5. Refresh child-specific API data as required.

The application must avoid showing data for the previous child after switching.

---

# 34. Component Responsibilities

Components should focus on:

- Presentation
- User interaction
- UI state
- Calling appropriate feature services/stores

Components should avoid:

- Direct database logic
- Large business rules
- Repeated API calls
- Authorization decisions
- Complex data transformation that belongs elsewhere

---

# 35. Service Responsibilities

Feature services should contain feature-specific orchestration and API interaction.

Example:

```text
LearningPage
   ↓
LearningService
   ↓
LearningApiService
   ↓
HTTP
```

Separate concerns where complexity justifies it.

Do not create layers merely for the sake of having layers.

---

# 36. Container and Presentational Components

Where a feature becomes complex, components may be separated into:

## Container components

Responsible for:

- Feature state
- API/service interaction
- Coordination

## Presentational components

Responsible for:

- Display
- Input/output events
- Reusable UI

Example:

```text
LearningHistoryPage
    |
    +-- LearningFilters
    +-- LearningList
    +-- LearningCard
```

Use this pattern when it improves clarity.

Do not force every feature into this structure.

---

# 37. UI State

The UI should explicitly handle:

```text
Loading
Loaded
Empty
Error
Success
Submitting
Disabled
```

Examples:

Learning History:

```text
Loading → Data
Loading → Empty
Loading → Error
```

Forms:

```text
Idle → Submitting → Success
Idle → Submitting → Error
```

---

# 38. Error Handling

The Angular application should provide centralized mechanisms for predictable errors.

Examples:

- Authentication failure
- Forbidden access
- Not found
- Validation error
- Network failure
- Server error

Feature-specific messages should remain understandable to users.

Raw backend errors should not automatically be displayed to users.

---

# 39. Global Error Handling

Application-wide unexpected errors should be handled centrally.

Possible responsibilities:

- Logging
- User-friendly fallback
- Error reporting
- Request correlation

The exact error-monitoring provider will be selected later.

---

# 40. Notifications and Toasts

A shared notification mechanism may be provided.

Examples:

```text
Success
Error
Warning
Information
```

The notification system should be reusable across features.

Avoid coupling feature components to a specific UI library where possible.

---

# 41. Loading Strategy

Loading indicators should exist at appropriate levels.

Examples:

- Page loading
- Section loading
- Button submitting
- Table loading
- Practice question loading

Avoid blocking the entire application for a small API operation.

Skeleton loaders should be used where they improve perceived performance.

---

# 42. Empty State Strategy

Every list-based feature should consider empty states.

Examples:

No children
No learning sessions
No lesson plans
No practice history
No test attempts
No achievements
No journal entries

Empty states should clearly explain:

- What is empty
- Why it may be empty
- What action the user can take next

---

# 43. Responsive Architecture

The application is mobile-first.

Primary responsive targets:

```text
Mobile
Tablet
Desktop
```

The layout should adapt without creating separate applications for different device types.

---

# 44. Mobile-First UX

High-frequency actions should be optimized for mobile.

The most important example is:

```text
Parent
→ Select Child
→ Log Learning
→ Save
```

The UI should:

- Minimize typing
- Use touch-friendly controls
- Keep important actions visible
- Avoid unnecessary dialogs
- Use appropriate mobile form controls

---

# 45. Desktop UX

Desktop may provide:

- Wider dashboards
- Detailed tables
- Advanced filtering
- More chart space
- Question-bank management
- Administrative workflows

The same Angular application should support both mobile and desktop.

---

# 46. Accessibility

The frontend should follow practical accessibility standards.

Requirements include:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible labels
- Form error associations
- Adequate contrast
- Appropriate touch targets
- Screen-reader-compatible controls
- Meaningful empty/error states

Accessibility should be built into shared UI components where practical.

---

# 47. Performance Strategy

Initial Angular performance practices should include:

- Lazy-loaded features
- Efficient template rendering
- Signals where appropriate
- Avoiding unnecessary subscriptions
- `OnPush` change detection strategy where appropriate
- Efficient list rendering
- Pagination for large data sets
- Avoiding unnecessary API calls
- Optimized media loading

Performance should be measured before introducing more complex optimization mechanisms.

---

# 48. Change Detection Strategy

The application should prefer efficient change detection.

`OnPush` may be used where appropriate.

Signals naturally support efficient reactive updates.

Components should avoid unnecessary mutation patterns that make state changes difficult to reason about.

---

# 49. Lists and Large Data

Large lists such as:

- Learning history
- Question bank
- Test history
- Journal
- Users
- Students

should use:

- Pagination
- Filtering
- Efficient tracking
- Appropriate API queries
- Virtual scrolling only where actual requirements justify it

Do not load unbounded collections into the browser.

---

# 50. Media Handling

Photos and videos should be handled carefully.

The frontend should:

- Validate obvious file constraints
- Show upload progress where appropriate
- Display previews where useful
- Handle upload errors
- Avoid loading large original media unnecessarily

Actual storage and security remain backend responsibilities.

---

# 51. Security Principles

The Angular application should:

- Avoid storing secrets in source code
- Never contain database credentials
- Never contain AI-provider secrets
- Avoid trusting URL parameters for authorization
- Avoid relying on UI visibility for security
- Safely handle user-generated content
- Avoid exposing sensitive information unnecessarily

Backend authorization remains authoritative.

---

# 52. Child Data Protection

Because the product manages child-related information, frontend workflows should minimize unnecessary exposure.

Examples:

- Only show authorized child data.
- Avoid exposing sensitive information in URLs unnecessarily.
- Avoid logging sensitive child information to the browser console in production.
- Avoid storing unnecessary child data locally.

---

# 53. Route Organization

Conceptual route structure:

```text
/login
/register

/parent
/parent/dashboard
/parent/children
/parent/learning
/parent/plans
/parent/practice
/parent/tests
/parent/progress
/parent/rewards
/parent/journal
/parent/profile

/teacher
/teacher/students
/teacher/learning
/teacher/plans
/teacher/practice
/teacher/tests
/teacher/progress
/teacher/profile

/child
/child/practice
/child/tests
/child/results
/child/achievements

/admin
/admin/users
/admin/subjects
/admin/topics
/admin/skills
/admin/questions
/admin/assessments
/admin/exam-types
```

Exact route names may be refined before implementation.

---

# 54. Feature-to-API Mapping

The Angular architecture should map features to API services.

Example:

```text
Learning Feature
    ↓
Learning API Service
    ↓
/api/v1/learning-sessions
```

```text
Assessment Feature
    ↓
Assessment API Service
    ↓
/api/v1/assessments
/api/v1/assessment-attempts
```

```text
Progress Feature
    ↓
Progress API Service
    ↓
/api/v1/children/:childId/progress
```

This makes the frontend easier to maintain.

---

# 55. Dashboard Architecture

Dashboards are read-heavy.

The dashboard should use dedicated read models/DTOs rather than forcing the frontend to reconstruct a dashboard from many unrelated API calls unless there is a strong reason to do so.

Example:

```text
Dashboard Page
      ↓
Dashboard API Service
      ↓
/api/v1/children/:childId/dashboard
```

The API may return:

```text
Today's Learning
Upcoming Plans
Recent Activity
Progress Summary
Recent Tests
Achievements
```

---

# 56. Feature State Example

A feature may use:

```text
State
├── loading
├── error
├── data
├── filters
└── selected item
```

Signals can represent these values where appropriate.

Example conceptual model:

```text
learningState
├── sessions
├── isLoading
├── error
└── filters
```

The exact implementation will depend on feature complexity.

---

# 57. API Error Mapping

The frontend should map backend errors into user-friendly states.

Example:

```text
VALIDATION_ERROR
    ↓
Show field-specific validation

FORBIDDEN
    ↓
Show access message

RESOURCE_NOT_FOUND
    ↓
Show not-found state

NETWORK_ERROR
    ↓
Show retry option

INTERNAL_ERROR
    ↓
Show generic error message
```

---

# 58. Testing Architecture

Testing will occur at multiple levels.

## Component Tests

Test:

- Rendering
- Inputs
- Outputs
- User interactions
- UI states

## Service Tests

Test:

- API behavior
- State transitions
- Data mapping
- Error handling

## Feature Tests

Test:

- Feature workflows
- Route behavior
- State integration

## End-to-End Tests

Test critical user journeys.

---

# 59. Critical End-to-End Flows

At minimum, automate:

```text
Parent Login
→ Select Child
→ Log Learning
→ Save
→ View History
```

and:

```text
Parent/Child
→ Select Test
→ Start Test
→ Answer Questions
→ Submit
→ View Result
```

and:

```text
Parent
→ Select Child
→ View Progress
```

---

# 60. Test File Organization

Tests should remain close to the code they test where practical.

Example:

```text
learning/
├── pages/
│   └── learning-history/
│       ├── learning-history.component.ts
│       ├── learning-history.component.html
│       └── learning-history.component.spec.ts
│
└── services/
    ├── learning-api.service.ts
    └── learning-api.service.spec.ts
```

---

# 61. Dependency Injection

Use Angular dependency injection consistently.

Prefer:

```text
inject()
```

where appropriate in modern Angular code.

Avoid manually creating service instances.

---

# 62. Standalone Components

All new application components should be standalone unless a dependency or framework requirement justifies otherwise.

Standalone architecture should be the default.

---

# 63. Naming Conventions

Use consistent naming.

Examples:

```text
learning-history.component.ts
learning-api.service.ts
learning.models.ts
learning.routes.ts
learning.store.ts
```

Classes:

```text
LearningHistoryComponent
LearningApiService
```

Methods and properties:

```text
getLearningSessions()
selectedChildId
isLoading
```

Use domain terminology consistently across the project.

---

# 64. File Size and Complexity

Avoid very large Angular files.

When a component becomes difficult to understand:

- Extract reusable UI
- Move business logic into a service/store
- Split complex features
- Simplify state

Do not split files into meaningless micro-abstractions.

---

# 65. Business Logic Placement

A simplified rule:

```text
Template
    ↓
Component
    ↓
Feature State / Service
    ↓
API Service
    ↓
HTTP
```

Business rules should not be duplicated between multiple components.

---

# 66. Reusable UI Strategy

Create shared UI components when there is a repeated design pattern.

Examples:

- Button
- Card
- Modal
- Toast
- Form field
- Select
- Date picker
- Empty state
- Skeleton
- Data table
- Confirm dialog

Avoid creating a shared abstraction after only one usage unless there is a clear architectural reason.

---

# 67. Design System Direction

The application should use a consistent design system.

Shared tokens should cover:

- Typography
- Spacing
- Border radius
- Shadows
- Form controls
- Buttons
- Cards
- Navigation
- Feedback states

The exact visual design system will be finalized during UI/UX work.

---

# 68. Feature Independence

Features should minimize direct dependencies on unrelated features.

For example:

The Learning feature should not directly manipulate Progress internals.

Instead:

```text
Learning
  ↓
Learning API
  ↓
Backend
  ↓
Progress APIs / calculations
```

This reduces coupling.

---

# 69. Shared Domain Concepts

Some concepts are used across multiple features.

Examples:

```text
Child
Subject
Topic
Skill
```

These should have stable shared representations.

However, feature-specific view models should be used where the UI needs a specialized shape.

---

# 70. View Models

The frontend may define view models for presentation.

Example:

```text
LearningSessionViewModel
DashboardViewModel
AssessmentResultViewModel
```

This prevents UI components from depending directly on raw API structures when that would reduce clarity.

---

# 71. Date and Time Handling

Learning and assessment data contains dates and durations.

The frontend should:

- Use a consistent API date format.
- Avoid assuming the browser timezone is the business timezone.
- Format dates for the user appropriately.
- Keep duration values explicit.

The final backend date/time strategy will be defined in the API/security/infrastructure design.

---

# 72. Navigation State

Navigation should not depend on fragile browser history assumptions.

Important child context should be recoverable when possible.

Feature state should not silently leak between routes.

---

# 73. Unsaved Changes

Forms that can lose important user input should consider unsaved-change handling.

Examples:

- Assessment
- Learning form
- Lesson plan
- Question editing

Where appropriate, route guards or UI confirmations should warn before losing important input.

---

# 74. Assessment Session State

Assessment sessions require special care because they may contain:

- Timer
- Current question
- Answers
- Progress
- Submission state

Assessment state should be isolated within the assessment feature.

The design must protect against:

- Accidental navigation
- Duplicate submission
- Stale state
- Timer inconsistencies

The backend remains authoritative for assessment state and final submission.

---

# 75. Practice Session State

Practice sessions may use similar feature-local state:

```text
Current Question
Current Answer
Question Progress
Timer
Session State
Result
```

Keep this state within the practice feature rather than putting it into unrelated global state.

---

# 76. Real-Time Features

Real-time functionality such as Socket.IO may be added in the future.

Potential use cases:

- Teacher updates
- Live classroom activity
- Notifications
- Assessment state updates

Real-time infrastructure should only be introduced when a product requirement exists.

---

# 77. Offline Considerations

V1 does not require full offline-first functionality.

However, the architecture should avoid assuming perfect connectivity.

The UI should provide reasonable handling for:

- Temporary network failure
- Retry
- Unsaved changes
- Request errors

Offline synchronization can be considered later.

---

# 78. Analytics

Product analytics should be introduced thoughtfully.

Potential events include:

- Learning session created
- Practice completed
- Test started
- Test completed
- Achievement earned

Analytics should avoid unnecessarily collecting sensitive child information.

---

# 79. Logging

Frontend logs should be appropriate for development and production.

Avoid logging:

- Passwords
- Authentication secrets
- Sensitive child information
- Full user-generated content

Production logging should be intentional rather than relying on uncontrolled `console.log` statements.

---

# 80. Environment Configuration

Environment-specific configuration should support:

```text
Local
Test/Preview
Production
```

Examples:

```text
API base URL
Feature flags
Monitoring configuration
Storage configuration
```

Secrets must not be placed in frontend source code because frontend configuration is ultimately visible to clients.

---

# 81. Feature Flags

Feature flags may be introduced for capabilities such as:

- New assessment features
- Experimental UI
- AI capabilities
- Beta features

Feature flags should not become a substitute for proper architecture.

---

# 82. Dependency Management

Dependencies should be added only when they provide clear value.

Before introducing a package, consider:

- Maintenance status
- Security
- Bundle impact
- Angular compatibility
- License
- Community adoption
- Whether Angular already provides the required capability

Avoid adding libraries for simple functionality that can be implemented cleanly using Angular itself.

---

# 83. State Persistence

Not all frontend state should be persisted.

Potentially persistent:

- Non-sensitive UI preferences
- Selected child preference where appropriate

Avoid persisting unnecessary sensitive information.

Authentication persistence must follow the final security architecture.

---

# 84. API Contract Compatibility

Angular API services should be developed against the documented API contract.

If the API contract changes:

1. Update API documentation.
2. Update shared contracts where applicable.
3. Update backend.
4. Update Angular services.
5. Update tests.

Avoid silently adapting to undocumented backend changes.

---

# 85. Codex Development Guidelines

Codex should work within the architecture defined in this document.

For each feature, the preferred workflow is:

```text
User Story
    ↓
Use Case
    ↓
Screen
    ↓
Technical Design
    ↓
Angular Implementation
    ↓
Tests
    ↓
Review
```

Codex should not create new architecture patterns without explicit review.

---

# 86. Codex Task Scope

Codex tasks should be small and focused.

Good:

```text
Implement the learning-history page using
the existing Learning API service.

Do not modify unrelated features.

Add unit tests.
Run lint and tests.
```

Avoid:

```text
Build the entire frontend.
```

---

# 87. Codex Repository Awareness

Codex should first read:

```text
AGENTS.md
docs/01-product/
docs/02-architecture/
```

before implementing major features.

Important documents include:

```text
01-prd.md
02-user-stories.md
03-use-cases.md
04-screen-map.md
05-user-flows.md

01-system-architecture.md
02-domain-model.md
03-database-design.md
04-api-design.md
05-angular-architecture.md
```

---

# 88. Codex Change Rules

When modifying Angular code, Codex should:

- Follow existing architecture.
- Avoid unrelated refactoring.
- Reuse existing shared components.
- Preserve established naming conventions.
- Add or update tests.
- Run lint.
- Run relevant tests.
- Run build for significant changes.
- Report files changed.
- Report remaining issues.

---

# 89. Angular Build Validation

Before considering a significant feature complete:

```text
TypeScript compilation
↓
Lint
↓
Unit tests
↓
Build
↓
E2E tests where appropriate
```

CI should eventually execute these automatically.

---

# 90. Pull Request Expectations

Angular pull requests should contain:

- Feature description
- Related user story
- Summary of implementation
- Tests performed
- Known limitations
- Screenshots for significant UI changes

PRs should remain focused.

---

# 91. Architecture Anti-Patterns to Avoid

Avoid:

- Giant components
- Global state for everything
- API calls directly inside templates
- Business logic duplicated across components
- Feature-specific code inside shared
- Client-only authorization
- Unbounded data loading
- Excessive abstraction
- Excessive RxJS usage
- Excessive NgRx usage
- Hard-coded subject lists
- Hard-coded exam logic

---

# 92. Example Feature Dependency

Example:

```text
Learning Page
      ↓
Learning Feature Service
      ↓
Learning API Service
      ↓
HTTP Client
      ↓
Backend API
```

Progress:

```text
Progress Page
      ↓
Progress Service
      ↓
Progress API
      ↓
Backend
```

The frontend should not calculate authoritative business metrics that belong on the backend.

---

# 93. Example Learning Feature

Conceptual structure:

```text
features/learning/
├── pages/
│   ├── quick-log/
│   ├── learning-history/
│   └── learning-detail/
│
├── components/
│   ├── learning-form/
│   ├── learning-card/
│   └── learning-filters/
│
├── services/
│   ├── learning-api.service.ts
│   └── learning-facade.service.ts
│
├── state/
│   └── learning.store.ts
│
├── models/
│   └── learning.models.ts
│
└── learning.routes.ts
```

The actual number of files will depend on complexity.

---

# 94. Example Assessment Feature

Conceptual structure:

```text
features/assessments/
├── pages/
│   ├── assessment-list/
│   ├── assessment-details/
│   ├── assessment-session/
│   ├── assessment-result/
│   └── assessment-history/
│
├── components/
│   ├── question-view/
│   ├── question-navigation/
│   ├── assessment-timer/
│   └── result-summary/
│
├── services/
│   ├── assessment-api.service.ts
│   └── assessment-session.service.ts
│
├── state/
│   └── assessment.store.ts
│
├── models/
│   └── assessment.models.ts
│
└── assessment.routes.ts
```

Assessment session state deserves special attention because of timer and submission behavior.

---

# 95. Example Dashboard Feature

The dashboard is primarily an aggregation and presentation feature.

Conceptual structure:

```text
features/dashboard/
├── pages/
│   └── dashboard/
├── components/
│   ├── today-learning/
│   ├── upcoming-plans/
│   ├── progress-summary/
│   ├── recent-tests/
│   └── achievements-summary/
├── services/
│   └── dashboard-api.service.ts
├── models/
│   └── dashboard.models.ts
└── dashboard.routes.ts
```

---

# 96. Shared UI Components

Initial shared UI candidates may include:

```text
Button
Card
Modal
Dialog
Toast
Alert
Spinner
Skeleton
Empty State
Pagination
Table
Select
Input
Date Picker
Confirm Dialog
Progress Indicator
Badge
Tabs
Dropdown
```

The final component list will emerge from actual product screens.

---

# 97. UI Library Strategy

A UI/component library may be used if it improves consistency and productivity.

Before selecting one, evaluate:

- Angular compatibility
- Accessibility
- Customization
- Bundle size
- Long-term maintenance
- Design fit

The project should not become dependent on a UI library for architecture decisions.

---

# 98. Styling Strategy

The application should use a consistent styling approach.

The exact styling technology will be selected during project setup.

Requirements:

- Responsive design
- Reusable design tokens
- Consistent spacing
- Consistent typography
- Accessible states
- Theme support if required

---

# 99. Frontend Data Flow

The preferred data flow is:

```text
User Interaction
      ↓
Component
      ↓
Feature State / Service
      ↓
API Service
      ↓
HTTP
      ↓
Backend
      ↓
Response
      ↓
Feature State
      ↓
Signal / Observable
      ↓
UI
```

This keeps responsibilities clear.

---

# 100. Architecture Summary

The Angular application will use:

```text
Standalone Angular
        +
Feature-Based Architecture
        +
Lazy-Loaded Routes
        +
Signals
        +
RxJS
        +
Selective NgRx
        +
Shared UI Components
        +
Feature API Services
        +
Role-Based Navigation
        +
Responsive Design
        +
Automated Testing
```

The guiding principle is:

> Keep the architecture simple enough for rapid development, but structured enough to support a growing production product.

---

# 101. Next Architecture Documents

The remaining architecture documents are expected to include:

```text
02-architecture/
├── 01-system-architecture.md
├── 02-domain-model.md
├── 03-database-design.md
├── 04-api-design.md
├── 05-angular-architecture.md
├── 06-backend-architecture.md
└── 07-security-architecture.md
```

The next document is:

```text
06-backend-architecture.md
```

It will define the Node.js + Express + TypeScript application structure, modules, controllers, services, repositories, validation, middleware, error handling, and how the backend maps to the MongoDB and API designs.

---

# 102. Document Status

**Version:** 0.1  
**Status:** Draft

This document defines the initial Angular architecture and will be refined during implementation and production validation.
