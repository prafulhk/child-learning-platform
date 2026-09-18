# Backend Architecture

**Document:** Backend Application Architecture  
**Version:** 0.1  
**Status:** Draft  
**Last Updated:** 2026-09-18

---

# 1. Purpose

This document defines the backend architecture for the Child Learning & Progress Platform.

The backend will provide the core application services between the Angular frontend and MongoDB Atlas.

It will be responsible for:

- Authentication
- Authorization
- Business rules
- Validation
- Data access
- Learning management
- Lesson planning
- Practice
- Assessments
- Progress calculations
- Rewards
- Journal management
- Media coordination
- Error handling
- Security
- Logging
- API responses

The backend architecture should remain modular, testable, secure, and easy to extend.

---

# 2. Technology Direction

The backend will use:

- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Mongoose or an equivalent MongoDB data-access approach
- REST APIs
- HTTPS in production

The exact package choices will be finalized during implementation.

---

# 3. Architectural Goals

The backend should:

1. Keep business logic outside controllers.
2. Separate HTTP concerns from domain logic.
3. Validate all externally supplied data.
4. Enforce authorization on the server.
5. Keep database access organized.
6. Make business logic testable.
7. Support the API contract defined in the API design.
8. Avoid unnecessary architectural complexity.
9. Support future growth.
10. Work effectively with Codex and human developers.

---

# 4. High-Level Backend Flow

The general request flow is:

```text
HTTP Request
    ↓
Express
    ↓
Middleware
    ↓
Authentication
    ↓
Authorization
    ↓
Request Validation
    ↓
Controller
    ↓
Service
    ↓
Repository / Data Access
    ↓
MongoDB
    ↓
Service
    ↓
Response DTO
    ↓
HTTP Response
```

The exact flow may vary for certain endpoints, but this is the default architecture.

---

# 5. Recommended Backend Structure

Initial structure:

```text
apps/api/
└── src/
    ├── config/
    ├── database/
    ├── middleware/
    ├── modules/
    │   ├── auth/
    │   ├── users/
    │   ├── children/
    │   ├── subjects/
    │   ├── topics/
    │   ├── skills/
    │   ├── learning/
    │   ├── lesson-plans/
    │   ├── practice/
    │   ├── questions/
    │   ├── assessments/
    │   ├── progress/
    │   ├── rewards/
    │   ├── journal/
    │   ├── teacher/
    │   └── admin/
    │
    ├── shared/
    │   ├── errors/
    │   ├── types/
    │   ├── utils/
    │   └── constants/
    │
    ├── app.ts
    └── server.ts
```

This is the initial direction and may evolve as implementation progresses.

---

# 6. Module-Based Architecture

Backend functionality should be organized by business domain.

Examples:

```text
auth
children
learning
lesson-plans
practice
assessments
progress
rewards
journal
```

Avoid organizing the entire application globally as:

```text
controllers/
services/
models/
routes/
```

with unrelated business areas mixed together.

Feature/domain boundaries make the application easier to understand and maintain.

---

# 7. Internal Module Structure

A complex module may use:

```text
learning/
├── learning.controller.ts
├── learning.service.ts
├── learning.repository.ts
├── learning.model.ts
├── learning.routes.ts
├── learning.schema.ts
├── learning.types.ts
└── learning.service.spec.ts
```

Not every module must contain every file.

Use the simplest structure that keeps responsibilities clear.

---

# 8. Controller Layer

Controllers handle HTTP concerns.

Responsibilities:

- Read request information.
- Call appropriate application/service logic.
- Return HTTP responses.
- Map errors appropriately.
- Avoid implementing business rules.

Controllers should remain thin.

Bad approach:

```text
Controller
→ Validate complex business rules
→ Query MongoDB
→ Calculate progress
→ Evaluate rewards
→ Format everything
```

Preferred:

```text
Controller
→ Service
→ Repository
```

---

# 9. Service Layer

Services contain application and business logic.

Examples:

```text
LearningService
LessonPlanService
PracticeService
AssessmentService
ProgressService
AchievementService
```

Service responsibilities may include:

- Business validation
- Domain rules
- Orchestration
- Calculations
- Coordination between repositories
- State transitions

Services should not depend on Express request/response objects.

---

# 10. Repository / Data Access Layer

Repositories isolate database access.

Example:

```text
LearningRepository
ChildRepository
AssessmentRepository
QuestionRepository
```

Responsibilities:

- Query MongoDB
- Create records
- Update records
- Find records
- Delete/deactivate records
- Encapsulate database-specific implementation where useful

Repositories should not contain HTTP logic.

---

# 11. Data Models

MongoDB/Mongoose models represent persistence structures.

Examples:

```text
User
Child
LearningSession
LessonPlan
Question
Assessment
AssessmentAttempt
PracticeSession
Achievement
JournalEntry
```

Database schemas should enforce appropriate structural rules, but core business decisions should not be placed entirely inside database schema definitions.

---

# 12. DTO Layer

The API should use explicit DTOs.

Examples:

```text
CreateChildRequest
UpdateChildRequest
ChildResponse

CreateLearningSessionRequest
LearningSessionResponse

CreateLessonPlanRequest
LessonPlanResponse

AssessmentAttemptResponse
ProgressResponse
```

DTOs define the API contract.

Database models should not automatically become API responses.

---

# 13. Request Validation

Every externally supplied request must be validated.

Validation should cover:

- Required fields
- Data types
- String limits
- Numeric ranges
- Dates
- IDs
- Enums
- Nested structures
- Business constraints where appropriate

Validation should occur before business operations.

---

# 14. Validation Layers

Validation can exist at multiple levels.

## API Schema Validation

Checks request shape.

Example:

```text
durationMinutes
→ must be a number
```

## Service Validation

Checks business rules.

Example:

```text
topic must belong to subject
```

## Database Validation

Provides persistence-level safeguards.

These layers complement one another.

---

# 15. Authentication Architecture

Authentication identifies the current user.

Conceptual flow:

```text
Login Request
    ↓
Validate Credentials
    ↓
Verify Password
    ↓
Create Authenticated Session
    ↓
Return Authentication Result
```

Protected requests then go through authentication middleware.

The final authentication storage strategy will be documented in the security architecture.

---

# 16. Authorization Architecture

Authorization verifies what an authenticated user can do.

Conceptual flow:

```text
Authenticated User
       ↓
Role Check
       ↓
Resource Ownership Check
       ↓
Permission Granted / Rejected
```

Examples:

Parent:

```text
User
 ↓
Parent-Child Relationship
 ↓
Child
```

Teacher:

```text
User
 ↓
Teacher-Student Assignment
 ↓
Child
```

The backend must verify these relationships.

---

# 17. Authorization Middleware

Generic role-based checks may use middleware.

Example concept:

```text
requireAuth()
requireRole("ADMIN")
```

However, role checks alone are insufficient for child-related resources.

Example:

```text
GET /children/:childId
```

requires both:

```text
Authenticated
+
Authorized for this child
```

Resource-level authorization may therefore be implemented inside services or dedicated authorization policies.

---

# 18. Child Access Policy

Every child-related request should be evaluated against the current user's relationship with the child.

Conceptual logic:

```text
Is authenticated?
      ↓
Which role?
      ↓
Parent?
  → verify parentChildren

Teacher?
  → verify teacherStudents

Admin?
  → verify admin permission

Otherwise
  → reject
```

This policy is one of the most important security boundaries in the application.

---

# 19. Learning Module

The Learning module manages actual completed learning activity.

Conceptual structure:

```text
learning/
├── learning.controller.ts
├── learning.service.ts
├── learning.repository.ts
├── learning.model.ts
├── learning.routes.ts
├── learning.schema.ts
└── learning.types.ts
```

Primary responsibilities:

- Create learning session
- Retrieve learning history
- Update permitted learning data
- Filter learning records
- Validate subject/topic/skill relationships

---

# 20. Lesson Plan Module

The Lesson Plan module manages planned learning.

Responsibilities:

- Create plan
- List plans
- View plan
- Update plan
- Complete plan
- Relate planned learning to actual learning

Business rule:

```text
Lesson Plan
≠
Learning Session
```

A completed learning session may reference the originating lesson plan.

---

# 21. Practice Module

The Practice module manages informal practice sessions.

Responsibilities:

- Start practice
- Select questions
- Track answers
- Submit practice
- Calculate practice result
- Retrieve practice history

Practice should remain conceptually separate from formal assessment.

---

# 22. Question Module

The Question module manages reusable question-bank content.

Responsibilities:

- Create question
- Edit question
- Activate/deactivate question
- Search/filter questions
- Retrieve questions for practice/assessment

The question-selection logic should remain separate from the HTTP layer.

---

# 23. Assessment Module

The Assessment module manages structured tests.

Responsibilities:

- Create assessment
- Publish assessment
- Retrieve available assessments
- Start assessment attempt
- Record answers
- Submit assessment
- Evaluate result
- Retrieve history

The assessment module must protect the integrity of historical attempts.

---

# 24. Assessment Attempt Integrity

When an assessment starts, the system should freeze the important information required to represent the attempt.

Examples:

- Assessment configuration
- Questions presented
- Question wording
- Options
- Scoring context

This prevents later changes to an assessment or question from rewriting historical results.

---

# 25. Practice Attempt Integrity

Practice sessions should similarly preserve enough question information to explain what the learner actually answered.

Question snapshots may be embedded in practice records.

This is especially useful when questions are later edited.

---

# 26. Progress Module

The Progress module provides calculated information.

Responsibilities may include:

- Learning-time calculations
- Practice metrics
- Assessment metrics
- Subject progress
- Topic progress
- Trends

Initial progress may be calculated from:

```text
learningSessions
practiceSessions
assessmentAttempts
```

A dedicated progress store may be introduced later if needed for performance.

---

# 27. Reward Module

The Rewards module manages achievement rules and earned achievements.

Responsibilities:

- Evaluate achievement rules
- Create earned achievements
- Retrieve achievements
- Calculate learning streaks
- Manage administrative reward configuration

Achievement evaluation should be centralized rather than duplicated inside multiple modules.

---

# 28. Journal Module

The Journal module manages learning memories and observations.

Responsibilities:

- Create journal entry
- Update journal entry
- Retrieve journal entries
- Attach media references
- Remove or archive entries according to retention rules

---

# 29. Subject, Topic, and Skill Modules

These modules manage the learning taxonomy.

Relationship:

```text
Subject
  ↓
Topic
  ↓
Skill
```

Validation must ensure:

```text
Topic belongs to Subject

Skill belongs to Topic
```

Normal users select these from controlled configuration.

---

# 30. Auth Module

The Auth module manages authentication-related operations.

Responsibilities:

- Registration
- Login
- Logout
- Password reset
- Current-user information
- Authentication/session handling

Password hashing must be performed using an appropriate secure password hashing strategy.

---

# 31. User Module

The User module manages user account information.

Responsibilities:

- Current-user profile
- Profile updates
- Account status
- User information required by authorized administrative workflows

User credentials and account-management concerns remain protected.

---

# 32. Children Module

The Children module manages learner profiles.

Responsibilities:

- Create child
- Retrieve child
- Update child
- List authorized children
- Handle parent-child relationships through appropriate application logic

The module must integrate with authorization policies.

---

# 33. Teacher Module

The Teacher module manages teacher-specific workflows.

Responsibilities may include:

- Assigned students
- Teacher-specific views
- Teacher learning activities
- Teacher lesson plans
- Teacher progress access

Teacher authorization must be relationship-based.

---

# 34. Admin Module

The Admin module provides administrative workflows.

Responsibilities may include:

- User administration
- Subject management
- Topic management
- Skill management
- Question management
- Assessment management
- Exam-type management
- Achievement-rule management

Administrative endpoints must require appropriate authorization.

---

# 35. Shared Error Handling

The backend should use centralized error handling.

A typical flow:

```text
Service throws known application error
        ↓
Express error middleware
        ↓
Map to HTTP response
        ↓
Return consistent error DTO
```

Examples:

```text
ValidationError
AuthenticationError
AuthorizationError
NotFoundError
ConflictError
InvalidStateError
```

Unknown errors should be handled safely without exposing internal implementation details.

---

# 36. Error Classes

The application may define shared error types such as:

```text
AppError
ValidationError
UnauthorizedError
ForbiddenError
NotFoundError
ConflictError
InvalidStateError
```

Errors should contain:

- Code
- Message
- HTTP status where appropriate
- Safe details

Sensitive internal information must not be returned to clients.

---

# 37. Middleware

Initial middleware categories may include:

```text
Authentication
Authorization
Request ID / Correlation
Validation
Rate Limiting
Logging
Error Handling
```

Middleware should remain focused on cross-cutting concerns.

Business-specific rules should remain in feature services/policies.

---

# 38. Request Correlation

A request identifier should be available where useful.

Conceptual flow:

```text
Incoming Request
      ↓
Generate/Accept Request ID
      ↓
Logs
      ↓
Errors
      ↓
Response
```

This helps connect frontend errors with backend logs.

---

# 39. Logging

Backend logging should be structured.

Important events may include:

- Application startup
- Database connection
- Authentication events where appropriate
- Authorization failures
- Important business errors
- Unexpected exceptions
- Background processing events

Do not log sensitive data unnecessarily.

Never log:

- Passwords
- Authentication secrets
- Tokens
- Sensitive personal information unnecessarily

---

# 40. Configuration Management

Configuration should be separated from business logic.

Examples:

```text
PORT
DATABASE_URL
AUTH configuration
STORAGE configuration
AI configuration
LOGGING configuration
```

Environment variables or an appropriate configuration mechanism should be used.

Secrets must never be committed to Git.

---

# 41. Environment Strategy

The backend should support separate environments:

```text
Local
Test / Preview
Production
```

Each environment should have:

- Separate configuration
- Appropriate credentials
- Appropriate database access
- Appropriate logging behavior

Production credentials must not be reused casually in local development.

---

# 42. Database Connection

MongoDB connection management should be centralized.

Conceptually:

```text
Application Startup
      ↓
Load Configuration
      ↓
Connect MongoDB
      ↓
Verify Connection
      ↓
Start Application
```

The application should fail clearly if required infrastructure cannot be initialized.

---

# 43. Database Access Rules

Modules should not create arbitrary database connections.

All database access should use the centralized database configuration.

Repositories/models should use the established connection lifecycle.

---

# 44. Transactions

MongoDB transactions should be used only where atomic multi-document operations are actually required.

Potential examples:

- Complex teacher-student assignment changes
- Assessment completion with multiple critical writes
- Reward operations that require coordinated persistence

Do not introduce transactions for every API request.

---

# 45. Business Transactions

For multi-step business operations, prefer service-level orchestration.

Example:

```text
Complete Assessment
      ↓
Validate Attempt
      ↓
Evaluate Answers
      ↓
Calculate Result
      ↓
Persist Result
      ↓
Evaluate Achievements
```

If atomicity is required, the service should coordinate the transaction.

---

# 46. API Response Mapping

The backend should convert internal/domain/database structures into API response DTOs.

Conceptually:

```text
MongoDB Document
      ↓
Repository
      ↓
Service
      ↓
Mapper
      ↓
Response DTO
      ↓
Controller
```

The exact number of layers should remain proportional to application complexity.

---

# 47. Security Boundary

The backend is the authoritative security boundary.

The backend must not trust:

- Client-side role information
- Client-side child selection
- Client-side permission checks
- Client-calculated final assessment scores
- Client-calculated authoritative progress
- Client-provided ownership claims

Server-side validation and authorization are required.

---

# 48. Assessment Scoring

Final assessment scoring should be calculated or verified by the backend.

The client may display intermediate state, but the server remains authoritative for final result calculations.

This prevents clients from modifying their own official assessment result.

---

# 49. Progress Calculation

Authoritative progress calculations should be performed by the backend.

The Angular client may calculate presentation-only values when appropriate, but authoritative metrics should come from trusted server-side logic.

---

# 50. Reward Evaluation

Achievement conditions should be evaluated by trusted backend logic.

Example:

```text
Learning Session Saved
      ↓
Achievement Service
      ↓
Evaluate Rules
      ↓
Award Achievement
```

The client must not be able to award itself achievements.

---

# 51. File Upload Architecture

Media handling should be controlled by the backend.

Conceptual flow:

```text
Angular
   ↓
Upload Request
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Object Storage
   ↓
Store Metadata/Reference
```

Potential future optimization:

```text
Backend
   ↓
Generate Pre-Signed URL
   ↓
Angular
   ↓
Direct Upload
   ↓
Object Storage
```

The final approach will depend on the chosen storage provider.

---

# 52. Input Security

The backend should treat all external input as untrusted.

This includes:

- Form fields
- Query parameters
- Route parameters
- Uploaded files
- User-generated notes
- Journal content
- Assessment responses

Appropriate validation and safe handling are required.

---

# 53. Database Query Security

Database queries should be built from validated inputs.

The application should avoid unsafe construction of database operators or arbitrary query fragments from user input.

Allowed filtering and sorting fields should be explicitly controlled.

---

# 54. Pagination

Repository/query methods should support pagination for large datasets.

Examples:

```text
Learning History
Question Bank
Assessment History
Journal
Users
Students
```

The service layer should enforce sensible limits.

Clients should not be allowed to request unbounded result sets.

---

# 55. Filtering

Feature services should validate supported filters before passing them to repositories.

Example:

```text
childId
subjectId
topicId
fromDate
toDate
```

Only supported filter fields should be accepted.

---

# 56. Sorting

Sort fields should be whitelisted.

Example:

```text
learningDate
createdAt
plannedDate
submittedAt
```

The API must not blindly accept arbitrary database field names.

---

# 57. Business State Management

Important state transitions should be defined explicitly.

Examples:

Lesson Plan:

```text
PLANNED
→ COMPLETED

PLANNED
→ CANCELLED
```

Assessment:

```text
DRAFT
→ PUBLISHED
→ ARCHIVED
```

Assessment Attempt:

```text
IN_PROGRESS
→ COMPLETED
```

Invalid transitions should be rejected by the backend.

---

# 58. Idempotency and Duplicate Operations

Important operations should protect against accidental duplication.

Examples:

- Duplicate assessment submission
- Duplicate achievement creation
- Duplicate teacher-student assignment

The exact strategy may use:

- Unique constraints
- State validation
- Idempotency keys

Only introduce additional complexity where needed.

---

# 59. Concurrency

The backend must account for concurrent updates where state matters.

Examples:

- Parent and teacher updating related records
- Duplicate assessment submission
- Multiple requests updating a lesson plan

Use appropriate state checks and database mechanisms.

---

# 60. API-to-Module Mapping

Conceptually:

```text
/api/v1/auth/*
        ↓
Auth Module

/api/v1/children/*
        ↓
Children Module

/api/v1/learning-sessions/*
        ↓
Learning Module

/api/v1/lesson-plans/*
        ↓
Lesson Plan Module

/api/v1/practice/*
        ↓
Practice Module

/api/v1/assessments/*
        ↓
Assessment Module

/api/v1/children/:childId/progress/*
        ↓
Progress Module

/api/v1/children/:childId/achievements/*
        ↓
Rewards Module
```

---

# 61. Backend to MongoDB Mapping

Conceptually:

```text
Auth Module
    ↓
users

Children Module
    ↓
children
parentChildren

Teacher Module
    ↓
teacherStudents

Learning Module
    ↓
learningSessions

Lesson Plan Module
    ↓
lessonPlans

Question Module
    ↓
questions

Assessment Module
    ↓
assessments
assessmentAttempts

Practice Module
    ↓
practiceSessions

Rewards Module
    ↓
achievements
achievementRules

Journal Module
    ↓
journalEntries
```

---

# 62. Module Boundaries

Modules should interact through clear application-level contracts.

Avoid direct manipulation of another module's database model where possible.

Example:

Learning should not directly modify Reward database documents.

Instead:

```text
Learning Service
      ↓
Achievement Service
```

This keeps domain responsibilities separated.

---

# 63. Cross-Module Operations

Some workflows naturally involve multiple modules.

Example:

```text
Create Learning Session
      ↓
Learning Module
      ↓
Progress availability
      ↓
Reward evaluation
```

The initiating module should coordinate through appropriate services rather than tightly coupling database internals.

---

# 64. Event-Driven Evolution

For the MVP, synchronous service calls are acceptable.

Later, events may be introduced for decoupled operations.

Example:

```text
LearningSessionCreated
        ↓
Achievement Evaluation
        ↓
Notification
        ↓
Analytics
```

A queue/event bus should only be introduced if actual scale or product requirements justify it.

---

# 65. Background Jobs

Potential future background work:

- Media processing
- Notifications
- Reports
- AI generation
- Large analytics calculations
- Scheduled achievement processing

Background jobs should not be introduced for simple synchronous operations.

---

# 66. Caching

Caching may be introduced for stable or expensive-to-compute information.

Potential candidates:

- Subjects
- Topics
- Skills
- Assessment metadata
- Dashboard summaries

The cache must never become the only source of truth for critical data.

---

# 67. Health Checks

The backend should eventually expose health endpoints.

Example:

```text
GET /health
```

Potential checks:

- Application running
- Database connectivity
- Required infrastructure availability

Health responses should not expose sensitive internal configuration.

---

# 68. Graceful Shutdown

The application should handle shutdown cleanly.

Conceptual flow:

```text
Shutdown Signal
      ↓
Stop accepting new requests
      ↓
Finish in-flight work where appropriate
      ↓
Close database connections
      ↓
Stop background processes
      ↓
Exit
```

---

# 69. API Documentation

The backend API should eventually have OpenAPI documentation.

Documentation should include:

- Endpoints
- Request schemas
- Response schemas
- Authentication
- Authorization
- Error responses
- Query parameters
- Examples

API documentation should remain aligned with the API design document.

---

# 70. Testing Strategy

Backend tests should exist at multiple levels.

## Unit Tests

Test:

- Business services
- Validation helpers
- Calculations
- Policies
- Utility functions

## Integration Tests

Test:

- API + database
- Authentication
- Authorization
- Important feature workflows

## End-to-End Tests

Test complete API workflows.

---

# 71. Critical Backend Test Cases

At minimum:

### Authentication

- Registration
- Login
- Invalid credentials
- Password reset

### Authorization

- Parent accesses own child
- Parent blocked from another parent's child
- Teacher accesses assigned student
- Teacher blocked from unassigned student
- Admin access

### Learning

- Create session
- Invalid input
- Invalid child
- Invalid topic/subject relationship
- History
- Filters

### Assessments

- Start attempt
- Submit attempt
- Duplicate submission
- Result calculation
- Historical integrity

### Progress

- Learning metrics
- Practice metrics
- Assessment metrics
- Authorization

### Rewards

- Achievement evaluation
- Duplicate protection

---

# 72. Test Data Strategy

Tests should use controlled test data.

Test data should not depend on production data.

Where practical:

```text
Test Database
    ↓
Seed Data
    ↓
Automated Tests
    ↓
Cleanup / Isolation
```

---

# 73. Development Environment

Local development should support:

```text
Angular
Node.js API
MongoDB Atlas or dedicated development database
```

Environment-specific configuration must prevent accidental connection to production resources.

---

# 74. Code Quality

Backend code should follow consistent standards.

Requirements:

- TypeScript strict typing
- Linting
- Formatting
- Small focused modules
- Clear naming
- Limited duplication
- Automated tests
- No unused code
- No unnecessary abstractions

---

# 75. TypeScript Strategy

Use strict TypeScript settings.

Avoid:

```text
any
```

unless there is a justified and documented reason.

Prefer explicit types for:

- API requests
- API responses
- Service methods
- Repository results
- Domain objects

Use type narrowing and validation instead of unsafe casts.

---

# 76. Async Programming

Backend asynchronous operations should use `async/await` where appropriate.

Promises should be handled explicitly.

Unhandled promise rejections must be avoided.

---

# 77. Dependency Injection Direction

Express and Node.js do not provide Angular-style dependency injection by default.

The application should use a simple dependency-injection or composition approach only where it improves testing and modularity.

Do not introduce a large DI framework unless the project actually requires it.

---

# 78. Configuration Access

Feature modules should not repeatedly read environment variables directly.

Prefer a centralized configuration layer.

Example:

```text
config
  ↓
Database configuration
Auth configuration
Storage configuration
Application configuration
```

---

# 79. Secrets

Secrets must never be committed to source control.

Examples:

```text
MongoDB credentials
Authentication secrets
Storage credentials
AI provider keys
Email provider keys
```

Use environment/secret management appropriate for each deployment environment.

---

# 80. API Security

The backend should consider:

- Authentication
- Authorization
- Input validation
- Rate limiting
- Secure headers
- CORS policy
- Request-size limits
- File-upload limits
- Error sanitization
- Dependency security

Exact production configuration will be defined during security architecture.

---

# 81. CORS

CORS should be explicitly configured.

The backend should allow only appropriate origins.

Development and production origins should be configurable.

Avoid allowing all origins in production unless there is a deliberate and justified reason.

---

# 82. Request Size Limits

The backend should apply sensible body-size limits.

This is especially important for:

- JSON requests
- File uploads
- Rich user-generated content

Limits should reflect actual product requirements.

---

# 83. API Rate Limits

Rate limiting should be applied to appropriate endpoints.

Especially relevant:

- Login
- Registration
- Password reset
- Media upload
- AI generation in future

The exact values should be defined after infrastructure and usage patterns are known.

---

# 84. Dependency Management

Dependencies should be introduced intentionally.

Before adding a package, consider:

- Maintenance
- Security
- License
- Bundle/runtime impact
- Node.js compatibility
- TypeScript support
- Whether native capabilities already solve the problem

Avoid unnecessary backend dependencies.

---

# 85. Codex Development Guidelines

Codex should use this architecture as the backend implementation guideline.

Before implementing a significant backend feature, Codex should inspect:

```text
AGENTS.md
docs/01-product/
docs/02-architecture/
```

especially:

```text
01-system-architecture.md
02-domain-model.md
03-database-design.md
04-api-design.md
05-angular-architecture.md
06-backend-architecture.md
```

---

# 86. Codex Backend Task Strategy

Backend work should be broken into focused tasks.

Example:

```text
Task 1
Create LearningSession model and validation.

Task 2
Create LearningRepository.

Task 3
Create LearningService.

Task 4
Create LearningController and routes.

Task 5
Add authorization.

Task 6
Add integration tests.

Task 7
Run lint, tests, and build.
```

Avoid asking Codex to implement an entire backend subsystem in one uncontrolled change.

---

# 87. Codex Review Strategy

After implementation, Codex may be asked to review:

- Security
- Authorization
- Business rules
- Query efficiency
- Error handling
- Test coverage
- Code duplication
- Type safety

Review should be separated from implementation when possible.

---

# 88. Pull Request Expectations

Backend pull requests should include:

- Related user story
- Relevant use case
- Summary of implementation
- API changes
- Database changes
- Tests performed
- Security considerations
- Known limitations

Database/schema changes should be explicitly called out.

---

# 89. Migration Strategy

MongoDB does not require relational migrations in the same way as a traditional relational database.

However, schema evolution still requires discipline.

Potential approaches include:

- Backward-compatible schema changes
- Data migration scripts
- Versioned migration scripts where necessary
- Seed/configuration scripts

Production data changes must be deliberate and tested.

---

# 90. Seed Data

Development and test environments should have seed data for:

- Subjects
- Topics
- Skills
- Exam types
- Sample questions
- Achievement rules
- Test assessments

Seed data should be deterministic and version-controlled.

---

# 91. API and Database Contract

The backend connects three important contracts:

```text
API Contract
      ↓
Domain Model
      ↓
Database Model
```

Changes should be checked against all three.

An API requirement should not be implemented in a way that violates the intended domain model.

---

# 92. Backend Data Flow Example

For creating a learning session:

```text
HTTP Request
      ↓
Auth Middleware
      ↓
Child Authorization
      ↓
Request Validation
      ↓
Learning Controller
      ↓
Learning Service
      ↓
Validate Subject/Topic/Skill
      ↓
Learning Repository
      ↓
MongoDB
      ↓
Achievement Evaluation
      ↓
Response Mapping
      ↓
HTTP Response
```

---

# 93. Backend Assessment Flow

For submitting an assessment:

```text
HTTP Request
      ↓
Authentication
      ↓
Authorization
      ↓
Validate Attempt State
      ↓
Assessment Service
      ↓
Evaluate Answers
      ↓
Calculate Result
      ↓
Persist Attempt Result
      ↓
Evaluate Achievements
      ↓
Return Result DTO
```

The backend remains authoritative for the final result.

---

# 94. Backend Progress Flow

For retrieving progress:

```text
HTTP Request
      ↓
Authentication
      ↓
Child Authorization
      ↓
Progress Controller
      ↓
Progress Service
      ↓
Learning Data
Practice Data
Assessment Data
      ↓
Calculate Metrics
      ↓
Progress Response DTO
      ↓
HTTP Response
```

---

# 95. Backend Architecture Principles

The backend should remain:

- Modular
- Secure
- Testable
- Typed
- Feature-oriented
- Domain-aware
- API-contract-driven
- Database-conscious
- Simple enough to operate
- Ready for future growth

---

# 96. Architecture Anti-Patterns

Avoid:

- Fat controllers
- Business logic in routes
- Direct database access from controllers
- Duplicate authorization logic
- Global state with unclear ownership
- Unvalidated user input
- Returning raw MongoDB documents everywhere
- Unbounded queries
- Hard-coded subject logic
- Hard-coded exam logic
- Premature microservices
- Premature event-driven infrastructure

---

# 97. Monolith-First Direction

The initial backend should be a modular monolith.

Conceptually:

```text
One API Application
        |
        +-- Auth
        +-- Children
        +-- Learning
        +-- Assessments
        +-- Progress
        +-- Rewards
        +-- Journal
        +-- Admin
```

The internal modules should have clear boundaries.

Microservices are not required for the MVP.

---

# 98. Future Extraction

If real scale requires it, modules may eventually become independent services.

Potential candidates in a much later architecture could include:

- Assessment processing
- AI processing
- Media processing
- Notifications
- Analytics

Extraction should be driven by actual operational needs rather than speculation.

---

# 99. Backend-to-Frontend Contract

The Angular application should communicate only through documented APIs.

The frontend must not depend on:

- MongoDB documents
- Internal repository structures
- Internal service classes
- Database implementation details

This allows the backend implementation to evolve.

---

# 100. Architecture Summary

The backend architecture is:

```text
Angular Client
      ↓
REST API
      ↓
Express
      ↓
Middleware
      ↓
Controller
      ↓
Service
      ↓
Repository / Data Access
      ↓
MongoDB Atlas
```

with cross-cutting capabilities:

```text
Authentication
Authorization
Validation
Error Handling
Logging
Security
Testing
Configuration
```

The initial backend will use a modular-monolith architecture with clear feature boundaries.

---

# 101. Next Architecture Step

The next architecture document is:

```text
07-security-architecture.md
```

It will define:

- Authentication strategy
- Token/session strategy
- Password security
- Role-based access
- Child data isolation
- API security
- CORS
- Rate limiting
- File-upload security
- Secrets
- MongoDB security
- Privacy considerations
- Audit requirements
- Production security checklist

---

# 102. Document Status

**Version:** 0.1  
**Status:** Draft

This document defines the initial Node.js + Express + TypeScript backend architecture and will be refined during implementation, testing, and production hardening.
