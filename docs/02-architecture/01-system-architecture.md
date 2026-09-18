# System Architecture

**Document:** System Architecture  
**Version:** 0.1  
**Status:** Draft  
**Last Updated:** 2026-09-18

---

# 1. Purpose

This document defines the high-level technical architecture of the Child Learning & Progress Platform.

It describes:

- Major system components
- Responsibilities of each component
- Communication between components
- Authentication and authorization boundaries
- Data flow
- Deployment direction
- Scalability considerations

Detailed database design, API contracts, Angular architecture, and backend module architecture will be defined in separate documents.

---

# 2. Architecture Goals

The architecture should:

1. Support parents, teachers, children, and administrators.
2. Support multiple children per parent.
3. Support multiple subjects, topics, and skills.
4. Support learning tracking, practice, assessments, progress, and rewards.
5. Be mobile-first and responsive.
6. Keep frontend and backend responsibilities clearly separated.
7. Protect child and user data.
8. Support horizontal growth as the number of users increases.
9. Allow future AI capabilities without requiring a major architectural rewrite.
10. Support automated testing and CI/CD from an early stage.
11. Keep the codebase maintainable as new features are added.

---

# 3. High-Level Architecture

The initial architecture follows a web application model:

User
↓
Web Browser
↓
Angular Application
↓
REST API
↓
Node.js + Express
↓
Application Services
↓
MongoDB Atlas

Additional infrastructure may support:

- Authentication
- Media storage
- Logging
- Monitoring
- CI/CD
- AI services in future releases

---

# 4. High-Level System Diagram

```text
                           USERS
                             |
          +------------------+------------------+
          |                  |                  |
        Parent            Teacher             Child
          |                  |                  |
          +------------------+------------------+
                             |
                       Web Browser
                             |
                             v
                    Angular Web Application
                             |
                             | HTTPS / REST
                             v
                    Node.js + Express API
                             |
            +----------------+----------------+
            |                |                |
            v                v                v
        Auth Module      Learning Module   Assessment
            |                |                |
            +----------------+----------------+
                             |
                             v
                       MongoDB Atlas
                             |
                 +-----------+-----------+
                 |                       |
                 v                       v
          Application Data        Analytics Data
```

Future supporting services may connect to the backend:

```text
                    Node.js + Express
                           |
        +------------------+------------------+
        |                  |                  |
        v                  v                  v
   File Storage        AI Services       Notifications
```

These supporting services are not required for the initial MVP unless needed.

---

# 5. Major System Components

## 5.1 Angular Web Application

The Angular application is responsible for the user interface and client-side application behavior.

Responsibilities include:

- Rendering screens
- Navigation
- Forms
- Client-side validation
- Managing UI state
- Calling backend APIs
- Displaying loading states
- Displaying success and error states
- Responsive behavior
- Authentication state handling
- Role-aware navigation
- Presenting learning and assessment information

The frontend must not be treated as the security boundary.

Authorization must ultimately be enforced by the backend.

---

# 6. Backend API

The backend will use Node.js with Express and TypeScript.

Responsibilities include:

- Authentication
- Authorization
- Business rules
- Input validation
- Data processing
- Learning-session management
- Lesson-plan management
- Practice management
- Assessment management
- Progress calculations
- Reward evaluation
- File-upload coordination
- API error handling
- Security controls

The backend is the primary business-logic boundary.

---

# 7. REST API

The Angular application will communicate with the backend through REST APIs.

Example conceptual API areas:

```text
/api/auth
/api/users
/api/children
/api/subjects
/api/topics
/api/skills
/api/learning-sessions
/api/lesson-plans
/api/practice
/api/questions
/api/assessments
/api/attempts
/api/progress
/api/achievements
/api/journal
```

The exact API contract will be defined later in:

```text
docs/02-architecture/
04-api-design.md
```

The API should use consistent:

- HTTP methods
- Status codes
- Request structures
- Response structures
- Validation rules
- Error responses
- Pagination conventions

---

# 8. Database

MongoDB Atlas will be the primary application database.

The database will store structured product information such as:

- Users
- Children
- Relationships
- Subjects
- Topics
- Skills
- Learning sessions
- Lesson plans
- Practice sessions
- Questions
- Assessments
- Assessment attempts
- Answers
- Progress-related information
- Achievements
- Journal entries
- Media references

The detailed data model will be defined separately.

---

# 9. Data Ownership and Relationships

The system must clearly represent ownership and authorization relationships.

Example:

```text
Parent
  |
  +---- Child
  |       |
  |       +---- Learning Sessions
  |       +---- Lesson Plans
  |       +---- Practice
  |       +---- Assessments
  |       +---- Progress
  |       +---- Rewards
  |       +---- Journal
  |
  +---- Other Children
```

Teacher access will be based on explicit teacher-student assignment.

```text
Teacher
  |
  +---- Assigned Student
  |
  +---- Assigned Student
```

The backend must verify these relationships when processing protected requests.

---

# 10. Authentication

The system will support authenticated users.

Initial application roles:

```text
PARENT
TEACHER
ADMIN
```

The child experience may initially operate through a parent or teacher context rather than requiring an independent child account.

Authentication design will include:

- Account registration
- Login
- Logout
- Password reset
- Session/token handling
- Secure password storage
- Role identification

Detailed authentication decisions will be documented separately.

---

# 11. Authorization

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to access?

The backend must enforce authorization.

Examples:

### Parent

A parent can access only children associated with that parent.

### Teacher

A teacher can access only students assigned to that teacher.

### Admin

An administrator can access administrative functionality according to their permissions.

### Child

A child should only access permitted child-specific functionality and data.

Client-side route guards improve the user experience but must not be the only authorization mechanism.

---

# 12. Core Business Domains

The application will be organized around major business domains rather than around individual screens.

Initial domains include:

```text
Authentication
Users
Children
Learning
Lesson Planning
Subjects
Topics
Skills
Practice
Questions
Assessments
Progress
Rewards
Journal
Administration
```

These domains will later guide backend modules and Angular feature boundaries.

---

# 13. Learning Domain

The learning domain manages what is actually taught.

Conceptually:

```text
Child
  ↓
Subject
  ↓
Topic
  ↓
Skill
  ↓
Learning Session
```

A learning session may contain:

- Child
- Subject
- Topic
- Skill
- Date
- Duration
- What was taught
- Performance
- Accuracy
- Notes
- Attachments

The actual data structure will be defined later.

---

# 14. Lesson Planning Domain

Lesson planning represents intended future learning.

Conceptually:

```text
Child
  ↓
Lesson Plan
  ↓
Subject / Topic / Skill
  ↓
Planned Activity
```

Planned learning and completed learning must remain distinguishable.

A completed learning session may optionally reference the plan from which it originated.

---

# 15. Practice Domain

The practice domain manages informal learning practice.

Conceptually:

```text
Practice Set
   ↓
Questions
   ↓
Practice Session
   ↓
Answers
   ↓
Practice Result
```

Practice is distinct from formal assessment.

---

# 16. Assessment Domain

The assessment domain manages mock tests and other structured evaluations.

Conceptually:

```text
Exam Context
      ↓
Assessment
      ↓
Question Set
      ↓
Assessment Attempt
      ↓
Answers
      ↓
Result
```

The architecture should support different assessment contexts without creating a separate engine for each examination.

---

# 17. Progress Domain

Progress information should be derived from actual learning activity, practice activity, and assessment results.

Conceptually:

```text
Learning
     \
      \
Practice ---> Progress
      /
     /
Assessment
```

Possible progress dimensions:

- Learning time
- Learning frequency
- Practice activity
- Accuracy
- Assessment scores
- Topic performance
- Subject performance
- Learning streaks

The system should distinguish between:

- Raw recorded data
- Calculated metrics
- Derived insights

This separation will help maintain trustworthy analytics.

---

# 18. Rewards Domain

Rewards and achievements will use learning activity and configured rules.

Conceptually:

```text
Learning Activity
Practice
Assessment
     |
     v
Achievement Rules
     |
     v
Achievement Earned
```

The reward engine should avoid embedding reward logic directly inside individual UI screens.

---

# 19. Journal and Media

The journal domain stores learning memories and observations.

Conceptually:

```text
Journal Entry
     |
     +---- Notes
     |
     +---- Media References
```

Photos and videos should be stored using an appropriate object-storage service.

MongoDB should store metadata and references rather than large media files whenever practical.

The exact storage provider will be decided later.

---

# 20. Frontend and Backend Responsibility

## Angular Responsibilities

Angular should handle:

- Presentation
- User interaction
- Navigation
- Client-side form state
- UI state
- API consumption
- Client-side validation for usability

## Backend Responsibilities

Backend should handle:

- Authentication
- Authorization
- Business rules
- Validation
- Data persistence
- Security
- Domain operations
- Calculations that must be trusted
- Protected access decisions

The frontend must never be trusted to enforce security rules.

---

# 21. Error Handling

The application should have consistent error handling.

## Frontend

The Angular application should provide:

- User-friendly validation messages
- Loading states
- Empty states
- Retry behavior where appropriate
- Server-error messages
- Offline/network error handling where appropriate

## Backend

The API should provide:

- Consistent HTTP status codes
- Structured error responses
- Validation errors
- Authentication errors
- Authorization errors
- Not-found responses
- Business-rule errors
- Unexpected-error handling

The backend should not expose sensitive internal details to clients.

---

# 22. Validation Strategy

Validation should happen at multiple boundaries.

## Frontend

Purpose:

- Improve user experience
- Catch obvious invalid input quickly

## Backend

Purpose:

- Protect the system
- Enforce business rules
- Prevent invalid or malicious requests

Backend validation is authoritative.

---

# 23. File and Media Handling

Media uploads should follow this general flow:

```text
Angular
   ↓
Backend
   ↓
Validate Upload
   ↓
Object Storage
   ↓
Media Reference
   ↓
MongoDB
```

The backend should validate:

- File type
- File size
- Authorization
- Associated child/resource

Exact implementation will be decided later.

---

# 24. API Security Boundary

Every protected API request should follow the conceptual flow:

```text
Request
  ↓
Authentication
  ↓
Authorization
  ↓
Validation
  ↓
Business Logic
  ↓
Database
  ↓
Response
```

Security checks must occur before protected business operations are performed.

---

# 25. Performance Strategy

The application should initially prioritize simple, measurable performance improvements.

Potential strategies:

### Frontend

- Lazy loading
- Efficient rendering
- Appropriate state management
- Avoid unnecessary API calls
- Responsive media handling

### Backend

- Database indexes
- Pagination
- Filtering
- Efficient queries
- Appropriate aggregation
- Avoid unnecessary database calls

Performance optimization should be based on real measurements rather than premature complexity.

---

# 26. Scalability Direction

The initial implementation should remain relatively simple.

The system should be structured so that components can scale independently when needed.

Potential future direction:

```text
Users
   ↓
Load Balancer
   ↓
Multiple API Instances
   ↓
MongoDB Atlas
```

Additional services can be introduced later when justified by actual requirements.

The initial MVP should not introduce unnecessary microservices.

---

# 27. Caching

Caching may be introduced later for data that is:

- Frequently requested
- Expensive to calculate
- Safe to cache

Potential candidates may include:

- Subject lists
- Topic lists
- Public configuration
- Frequently accessed assessment metadata

Caching decisions should be based on real performance requirements.

---

# 28. Background Processing

Some future activities may be better handled asynchronously.

Potential examples:

- Video processing
- Large report generation
- Notifications
- Achievement processing
- AI generation
- Analytics aggregation

The MVP should keep synchronous workflows simple unless asynchronous processing is actually required.

---

# 29. Future AI Integration

AI is a future capability.

The architecture should allow the backend to integrate with AI services through a controlled application boundary.

Conceptually:

```text
Angular
   ↓
Node.js API
   ↓
AI Service Layer
   ↓
External AI Provider
```

The frontend should not directly expose AI-provider credentials or rely on direct provider communication for protected functionality.

Potential AI capabilities include:

- Lesson suggestions
- Practice generation
- Mock-test generation
- Weak-area analysis
- Progress summaries

AI-generated educational material will require appropriate validation before being presented to children.

---

# 30. Observability

The production system should eventually include:

- Application logging
- API error logging
- Health checks
- Monitoring
- Performance measurement
- Error tracking

The exact tools will be selected later.

---

# 31. CI/CD

The repository should use automated CI/CD.

Conceptual workflow:

```text
Developer
   ↓
Git Push
   ↓
Pull Request
   ↓
CI
   ├── Install Dependencies
   ├── Lint
   ├── Unit Tests
   ├── Integration Tests
   └── Build
          ↓
       Merge
          ↓
       Deploy
```

The exact pipeline will be defined after the application structure is established.

---

# 32. Environments

The system should eventually support separate environments.

Initial direction:

```text
Local Development
       ↓
Test / Preview
       ↓
Production
```

Each environment should have separate configuration and secrets.

Production secrets must not be stored in source control.

---

# 33. Configuration Management

Environment-specific configuration should be separated from source code where appropriate.

Examples:

- Database connection
- Authentication configuration
- Storage configuration
- API URLs
- AI provider configuration
- Monitoring configuration

Secrets must be stored using appropriate secret-management mechanisms.

---

# 34. Deployment Direction

The platform will be deployed as a cloud-hosted application.

Conceptual production architecture:

```text
                 Internet
                    |
             Angular Frontend
                    |
                 HTTPS
                    |
              Backend API
                    |
          +---------+---------+
          |                   |
          v                   v
     MongoDB Atlas       Object Storage
```

The exact hosting providers will be selected later.

---

# 35. Repository Architecture Direction

The project will use a monorepo.

Initial conceptual structure:

```text
child-learning-platform/
│
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

The exact workspace tooling will be selected during project setup.

---

# 36. Shared Types

The frontend and backend will use TypeScript.

Where appropriate, shared contracts may be placed in a shared package.

Potential shared information includes:

- API DTO types
- Enums
- Common validation contracts
- Shared domain types

Shared code should be introduced only when it provides clear value and should not create tight coupling between frontend and backend internals.

---

# 37. Testing Strategy

Testing will exist at multiple levels.

## Unit Tests

For:

- Business logic
- Services
- Utilities
- Components where appropriate

## Integration Tests

For:

- API + database behavior
- Authentication
- Authorization
- Important backend workflows

## End-to-End Tests

For critical user journeys such as:

```text
Login
→ Select Child
→ Log Learning
→ View History
```

and:

```text
Start Test
→ Answer Questions
→ Submit
→ View Result
```

---

# 38. Security Principles

The system should follow these general principles:

1. Never trust client-side authorization.
2. Validate all externally supplied input.
3. Protect secrets.
4. Use secure password handling.
5. Protect authenticated endpoints.
6. Enforce ownership and role relationships server-side.
7. Limit access to child data.
8. Apply appropriate file-upload restrictions.
9. Avoid exposing sensitive internal error information.
10. Keep dependencies maintained and monitored.

---

# 39. Architecture Evolution

The architecture is intentionally designed to start simple.

The MVP should favor:

- Clear boundaries
- Maintainability
- Testability
- Security
- Simple deployment

The system can become more sophisticated as real usage demonstrates a need for:

- Caching
- Background jobs
- Queues
- Multiple API instances
- Dedicated services
- Advanced analytics infrastructure
- AI pipelines

Complexity should be introduced based on actual requirements.

---

# 40. Architecture Decision Principles

When making future architecture decisions, consider:

1. Product requirements
2. Security
3. Maintainability
4. Developer productivity
5. Performance
6. Scalability
7. Operational complexity
8. Cost
9. Testing
10. Future extensibility

No technology should be introduced only because it is popular.

---

# 41. Current Technology Direction

The current technology direction is:

## Frontend

Angular + TypeScript

## Backend

Node.js + Express + TypeScript

## Database

MongoDB Atlas

## API

REST

## Repository

GitHub Monorepo

## Development

VS Code + Codex

## Deployment

Cloud-hosted with CI/CD

These decisions may be refined and formally recorded in Architecture Decision Records.

---

# 42. Architecture Documents To Be Created

The architecture phase will produce the following documents:

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

Additional documents may be added when required.

---

# 43. Current Architecture Status

**Version:** 0.1  
**Status:** Draft

This document defines the high-level system architecture.

Detailed architecture documents will refine each technical area before implementation begins.
