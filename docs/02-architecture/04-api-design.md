# API Design

**Document:** REST API Design  
**Version:** 0.1  
**Status:** Draft  
**Last Updated:** 2026-09-18

---

# 1. Purpose

This document defines the initial REST API contract for the Child Learning & Progress Platform.

It describes:

- API conventions
- Authentication
- Authorization
- Endpoints
- Request structures
- Response structures
- Validation
- Error handling
- Pagination
- Filtering
- Child-data isolation
- Versioning
- Future API evolution

The API will act as the primary communication layer between the Angular frontend and the Node.js/Express backend.

---

# 2. API Technology

The backend API will use:

- Node.js
- Express
- TypeScript
- REST
- JSON
- HTTPS in production

The API will be stateless from the application's business-operation perspective.

---

# 3. Base URL

The API will use a versioned base path.

Example:

```text
/api/v1
```

Example endpoint:

```text
GET /api/v1/children
```

Versioning allows future API changes without immediately breaking existing clients.

---

# 4. API Conventions

The API should follow consistent conventions.

## HTTP Methods

```text
GET     Retrieve data
POST    Create data / perform supported action
PUT     Replace a resource where appropriate
PATCH   Partially update a resource
DELETE  Delete or deactivate where appropriate
```

The application should prefer `PATCH` for partial updates.

---

# 5. Common HTTP Status Codes

The API will use standard HTTP status codes.

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
```

The exact usage will be consistent across modules.

---

# 6. Authentication

Authentication will be required for protected API endpoints.

Conceptual flow:

```text
Login
 ↓
Credentials validated
 ↓
Authenticated session/token established
 ↓
Client calls protected API
 ↓
Backend authenticates request
 ↓
Backend authorizes access
```

The exact token/cookie implementation will be finalized in the security architecture.

---

# 7. Authorization

Authorization is performed by the backend.

The backend must verify:

1. User is authenticated.
2. User has the required role.
3. User is authorized to access the requested resource.
4. Child-specific relationships are valid where applicable.

Examples:

Parent:

```text
Parent
 ↓
parentChildren
 ↓
Child
```

Teacher:

```text
Teacher
 ↓
teacherStudents
 ↓
Child
```

Client-side route guards must not be treated as a security boundary.

---

# 8. API Response Convention

A consistent JSON response structure is recommended.

## Success Example

```json
{
  "data": {
    "id": "..."
  },
  "meta": {}
}
```

## Collection Example

```json
{
  "data": [
    {
      "id": "..."
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100
  }
}
```

The exact fields used in `meta` will depend on the endpoint.

---

# 9. Error Response Convention

Errors should use a consistent structure.

Example:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "details": [
      {
        "field": "durationMinutes",
        "message": "Duration must be greater than zero."
      }
    ],
    "requestId": "..."
  }
}
```

The API should not expose sensitive internal implementation details.

---

# 10. Validation

Validation must occur on the backend for all incoming requests.

Validation should cover:

- Required fields
- Data types
- String lengths
- Numeric ranges
- Enum values
- Object identifiers
- Date formats
- Relationship validity
- Business rules

Frontend validation improves user experience but does not replace backend validation.

---

# 11. Pagination

Large collections should support pagination.

Example query:

```text
GET /api/v1/learning-sessions?page=1&pageSize=20
```

Recommended defaults should be defined centrally.

Example:

```text
page = 1
pageSize = 20
```

The server should enforce a maximum page size.

---

# 12. Sorting

Where appropriate, list endpoints may support sorting.

Example:

```text
GET /api/v1/learning-sessions?sortBy=learningDate&sortOrder=desc
```

Allowed sort fields must be explicitly defined by the endpoint.

User-supplied arbitrary database field names should not be accepted blindly.

---

# 13. Filtering

Filtering should be supported where it provides meaningful user functionality.

Example:

```text
GET /api/v1/learning-sessions
    ?childId=...
    &subjectId=...
    &topicId=...
    &fromDate=2026-09-01
    &toDate=2026-09-18
```

The backend must still verify that the authenticated user is authorized to access the requested child.

---

# 14. Authentication Endpoints

## POST /api/v1/auth/register

Creates a new user account.

Supported registration roles:

- PARENT
- TEACHER

Admin creation should normally be controlled separately.

### Request

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "..."
}
```

### Response

```text
201 Created
```

Returns appropriate account information without exposing password data.

---

## POST /api/v1/auth/login

Authenticates a user.

### Request

```json
{
  "email": "john@example.com",
  "password": "..."
}
```

### Response

Returns authenticated session information according to the final authentication design.

---

## POST /api/v1/auth/logout

Logs out the authenticated user.

### Response

```text
204 No Content
```

---

## POST /api/v1/auth/forgot-password

Initiates password recovery.

---

## POST /api/v1/auth/reset-password

Completes password reset using a valid reset mechanism.

---

## GET /api/v1/auth/me

Returns the authenticated user's profile and role information.

---

# 15. User Endpoints

## GET /api/v1/users/me

Returns the current user's profile.

---

## PATCH /api/v1/users/me

Updates permitted profile fields.

### Request Example

```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```

---

# 16. Child Endpoints

## GET /api/v1/children

Returns children authorized for the current user.

For a parent, this returns the parent's children.

For a teacher, this returns assigned students where supported.

---

## POST /api/v1/children

Creates a child profile.

### Request Example

```json
{
  "firstName": "Aarav",
  "lastName": "Doe",
  "dateOfBirth": "2021-08-10",
  "grade": "LKG"
}
```

### Backend Behavior

1. Authenticate parent.
2. Verify parent permission.
3. Validate child data.
4. Create child.
5. Create parent-child relationship.
6. Return created child.

---

## GET /api/v1/children/:childId

Returns an authorized child's profile.

---

## PATCH /api/v1/children/:childId

Updates permitted child information.

---

# 17. Subject Endpoints

## GET /api/v1/subjects

Returns active subjects available to the authenticated user.

---

## GET /api/v1/subjects/:subjectId

Returns subject information where appropriate.

---

## POST /api/v1/admin/subjects

Creates a subject.

Admin only.

---

## PATCH /api/v1/admin/subjects/:subjectId

Updates a subject.

Admin only.

---

## DELETE /api/v1/admin/subjects/:subjectId

Deactivates a subject according to lifecycle rules.

Admin only.

---

# 18. Topic Endpoints

## GET /api/v1/subjects/:subjectId/topics

Returns active topics belonging to a subject.

---

## GET /api/v1/topics/:topicId

Returns topic details.

---

## POST /api/v1/admin/topics

Creates a topic.

Admin only.

---

## PATCH /api/v1/admin/topics/:topicId

Updates a topic.

Admin only.

---

## DELETE /api/v1/admin/topics/:topicId

Deactivates a topic according to lifecycle rules.

Admin only.

---

# 19. Skill Endpoints

## GET /api/v1/topics/:topicId/skills

Returns active skills under a topic.

---

## GET /api/v1/skills/:skillId

Returns skill details.

---

## POST /api/v1/admin/skills

Creates a skill.

Admin only.

---

## PATCH /api/v1/admin/skills/:skillId

Updates a skill.

Admin only.

---

## DELETE /api/v1/admin/skills/:skillId

Deactivates a skill.

Admin only.

---

# 20. Learning Session Endpoints

## POST /api/v1/learning-sessions

Creates a learning session.

### Request Example

```json
{
  "childId": "...",
  "subjectId": "...",
  "topicId": "...",
  "skillId": "...",
  "learningDate": "2026-09-18",
  "durationMinutes": 30,
  "whatWasTaught": "Introduced 5-bead combinations.",
  "performance": "GOOD",
  "accuracy": {
    "correct": 8,
    "total": 10
  },
  "notes": "Concept understood but speed needs practice.",
  "lessonPlanId": "..."
}
```

### Backend Behavior

1. Authenticate user.
2. Verify child authorization.
3. Validate subject/topic/skill relationships.
4. Validate learning data.
5. Calculate or normalize accuracy.
6. Create learning session.
7. Evaluate applicable achievement rules.
8. Return the created record.

---

## GET /api/v1/learning-sessions

Returns authorized learning sessions.

Supported filters may include:

```text
childId
subjectId
topicId
skillId
fromDate
toDate
```

Supports pagination and sorting.

---

## GET /api/v1/learning-sessions/:sessionId

Returns one learning session.

Backend must verify authorization.

---

## PATCH /api/v1/learning-sessions/:sessionId

Updates permitted learning-session information.

---

## DELETE /api/v1/learning-sessions/:sessionId

Deletes or archives a learning session according to final data-retention rules.

This behavior will be finalized before production.

---

# 21. Lesson Plan Endpoints

## POST /api/v1/lesson-plans

Creates a lesson plan.

### Request Example

```json
{
  "childId": "...",
  "plannedDate": "2026-09-19",
  "subjectId": "...",
  "topicId": "...",
  "skillId": "...",
  "plannedActivity": "Practice 5-bead combinations.",
  "plannedDurationMinutes": 30,
  "notes": "Focus on speed."
}
```

---

## GET /api/v1/lesson-plans

Returns authorized plans.

Supported filters may include:

```text
childId
status
fromDate
toDate
```

---

## GET /api/v1/lesson-plans/:planId

Returns one lesson plan.

---

## PATCH /api/v1/lesson-plans/:planId

Updates a lesson plan.

---

## POST /api/v1/lesson-plans/:planId/complete

Marks a lesson plan as completed.

The endpoint may optionally accept a learning-session reference.

---

# 22. Practice Endpoints

## GET /api/v1/practice

Returns available practice configurations or practice sets.

---

## POST /api/v1/practice/sessions

Starts a new practice session.

### Request Example

```json
{
  "childId": "...",
  "subjectId": "...",
  "topicId": "...",
  "skillId": "...",
  "difficulty": "EASY",
  "questionCount": 10
}
```

### Backend Behavior

1. Authenticate user.
2. Verify child access.
3. Validate requested practice criteria.
4. Select appropriate questions.
5. Create practice session.
6. Return the session and questions required by the client.

---

## GET /api/v1/practice/sessions/:sessionId

Returns an active or completed practice session according to authorization and workflow rules.

---

## POST /api/v1/practice/sessions/:sessionId/answers

Records or updates answers according to the practice-session design.

---

## POST /api/v1/practice/sessions/:sessionId/submit

Completes the practice session.

### Backend Behavior

1. Verify authorization.
2. Validate attempt state.
3. Evaluate answers.
4. Calculate result.
5. Store result.
6. Evaluate applicable achievements.
7. Return result.

---

## GET /api/v1/practice/sessions

Returns practice history.

Supported filters:

```text
childId
subjectId
topicId
fromDate
toDate
```

---

# 23. Question Bank Endpoints

Question-bank management is primarily an admin function.

## GET /api/v1/admin/questions

Returns questions with supported filtering and pagination.

Possible filters:

```text
subjectId
topicId
skillId
difficulty
questionType
examTypeId
status
age
grade
```

---

## POST /api/v1/admin/questions

Creates a question.

---

## GET /api/v1/admin/questions/:questionId

Returns question details.

---

## PATCH /api/v1/admin/questions/:questionId

Updates a question.

---

## DELETE /api/v1/admin/questions/:questionId

Deactivates a question according to lifecycle rules.

---

# 24. Exam Type Endpoints

## GET /api/v1/exam-types

Returns active exam contexts available to authorized users.

---

## GET /api/v1/admin/exam-types

Returns admin exam configuration.

---

## POST /api/v1/admin/exam-types

Creates an exam context.

---

## PATCH /api/v1/admin/exam-types/:examTypeId

Updates an exam context.

---

## DELETE /api/v1/admin/exam-types/:examTypeId

Deactivates an exam context.

---

# 25. Assessment Endpoints

## GET /api/v1/assessments

Returns assessments available to the current user.

Possible filters:

```text
subjectId
topicId
examTypeId
difficulty
age
grade
```

---

## GET /api/v1/assessments/:assessmentId

Returns assessment details.

---

## POST /api/v1/admin/assessments

Creates an assessment.

Admin only.

---

## PATCH /api/v1/admin/assessments/:assessmentId

Updates an assessment.

Admin only.

---

## POST /api/v1/admin/assessments/:assessmentId/publish

Publishes an assessment.

---

## POST /api/v1/admin/assessments/:assessmentId/archive

Archives an assessment.

---

# 26. Assessment Attempt Endpoints

## POST /api/v1/assessments/:assessmentId/attempts

Starts an assessment attempt.

### Request Example

```json
{
  "childId": "..."
}
```

### Backend Behavior

1. Authenticate user.
2. Verify child authorization.
3. Verify assessment availability.
4. Create attempt.
5. Select or freeze the configured questions.
6. Create necessary snapshots.
7. Return attempt information.

---

## GET /api/v1/assessment-attempts/:attemptId

Returns an assessment attempt according to authorization rules.

---

## POST /api/v1/assessment-attempts/:attemptId/answers

Records answers according to the assessment workflow.

---

## POST /api/v1/assessment-attempts/:attemptId/submit

Submits the assessment attempt.

### Backend Behavior

1. Verify authorization.
2. Validate attempt state.
3. Validate submission.
4. Evaluate answers.
5. Calculate score.
6. Calculate accuracy.
7. Store result.
8. Evaluate achievements.
9. Return result.

---

## GET /api/v1/assessment-attempts

Returns assessment history.

Supported filters may include:

```text
childId
assessmentId
subjectId
examTypeId
fromDate
toDate
```

---

# 27. Assessment Result Endpoint

## GET /api/v1/assessment-attempts/:attemptId/result

Returns the calculated assessment result.

The endpoint may be merged with the attempt detail endpoint if the final client model does not require a separate resource.

The implementation should avoid exposing answer keys unnecessarily in child-facing experiences.

---

# 28. Progress Endpoints

## GET /api/v1/children/:childId/progress

Returns overall progress for an authorized child.

Possible query parameters:

```text
fromDate
toDate
```

Possible response information:

```text
Learning Time
Learning Sessions
Practice Activity
Assessment Activity
Average Accuracy
Achievements
```

---

## GET /api/v1/children/:childId/progress/subjects

Returns subject-level progress.

---

## GET /api/v1/children/:childId/progress/subjects/:subjectId

Returns progress for a particular subject.

---

## GET /api/v1/children/:childId/progress/topics/:topicId

Returns topic-level progress.

---

## GET /api/v1/children/:childId/progress/trends

Returns supported historical trend data.

Possible metrics:

```text
Learning Time
Practice Activity
Accuracy
Assessment Scores
```

---

# 29. Achievement Endpoints

## GET /api/v1/children/:childId/achievements

Returns achievements for an authorized child.

---

## GET /api/v1/achievements/:achievementId

Returns achievement details.

---

## GET /api/v1/admin/achievement-rules

Returns configured achievement rules.

Admin only.

---

## POST /api/v1/admin/achievement-rules

Creates an achievement rule.

---

## PATCH /api/v1/admin/achievement-rules/:ruleId

Updates an achievement rule.

---

# 30. Journal Endpoints

## GET /api/v1/children/:childId/journal

Returns journal entries for an authorized child.

Supports pagination.

---

## POST /api/v1/children/:childId/journal

Creates a journal entry.

---

## GET /api/v1/journal/:entryId

Returns one journal entry.

---

## PATCH /api/v1/journal/:entryId

Updates a journal entry.

---

## DELETE /api/v1/journal/:entryId

Deletes or archives the journal entry according to final retention rules.

---

# 31. Media Endpoints

Media handling will depend on the final object-storage architecture.

A possible model is:

## POST /api/v1/media/upload

Uploads or initializes a media upload.

Possible flow:

```text
Angular
  ↓
Backend
  ↓
Validate authorization
  ↓
Validate metadata
  ↓
Upload/Object Storage
  ↓
Store media reference
```

A future optimized implementation may use pre-signed upload URLs.

The exact approach will be defined in the infrastructure/security design.

---

# 32. Teacher Endpoints

## GET /api/v1/teacher/students

Returns students assigned to the authenticated teacher.

---

## GET /api/v1/teacher/students/:childId

Returns an authorized student profile.

---

## GET /api/v1/teacher/students/:childId/progress

Returns authorized student progress.

---

## POST /api/v1/teacher/learning-sessions

Creates a learning session for an assigned student.

This endpoint may ultimately reuse the standard learning-session endpoint if authorization can be handled cleanly without duplicating business logic.

---

# 33. Teacher Assignment Endpoints

Admin manages teacher-student assignments.

## GET /api/v1/admin/teacher-assignments

Returns teacher-student assignments.

---

## POST /api/v1/admin/teacher-assignments

Creates an assignment.

### Request

```json
{
  "teacherUserId": "...",
  "childId": "..."
}
```

---

## DELETE /api/v1/admin/teacher-assignments/:assignmentId

Removes an assignment.

---

# 34. Admin User Endpoints

## GET /api/v1/admin/users

Returns users with filtering and pagination.

---

## GET /api/v1/admin/users/:userId

Returns authorized administrative user details.

---

## PATCH /api/v1/admin/users/:userId/status

Updates account status according to permitted rules.

---

# 35. Dashboard APIs

The dashboard should avoid requiring many independent frontend requests where a consolidated endpoint provides a meaningful performance benefit.

Possible endpoint:

## GET /api/v1/children/:childId/dashboard

Returns an aggregated child dashboard.

Possible sections:

```text
Today's Learning
Upcoming Lesson Plans
Recent Learning
Recent Practice
Recent Tests
Progress Summary
Achievements
```

This endpoint should not become a replacement for domain APIs.

It is a read-oriented aggregation endpoint for dashboard use.

---

# 36. Quick Log API Strategy

The most frequent parent workflow is quick learning logging.

The preferred initial design is to reuse the normal learning-session endpoint:

```text
POST /api/v1/learning-sessions
```

The Angular quick-log UI should collect only the minimum necessary information.

The backend remains responsible for validation and persistence.

A separate quick-log endpoint should only be introduced if real performance or workflow requirements justify it.

---

# 37. API Authorization Matrix

Initial conceptual permissions:

| API Area              | Parent               | Teacher                           | Child   | Admin |
| --------------------- | -------------------- | --------------------------------- | ------- | ----- |
| Own profile           | Yes                  | Yes                               | Limited | Yes   |
| Own children          | Yes                  | No                                | No      | Yes   |
| Assigned students     | No                   | Yes                               | No      | Yes   |
| Learning              | Own children         | Assigned students                 | Limited | Yes   |
| Lesson Plans          | Own children         | Assigned students                 | Limited | Yes   |
| Practice              | Own/authorized child | Assigned students                 | Own     | Yes   |
| Assessments           | Own/authorized child | Assigned students                 | Own     | Yes   |
| Progress              | Own children         | Assigned students                 | Own     | Yes   |
| Rewards               | Own children         | Assigned students                 | Own     | Yes   |
| Journal               | Own children         | Assigned students where permitted | Limited | Yes   |
| Question Bank         | No                   | Limited                           | No      | Yes   |
| Subject Management    | No                   | No                                | No      | Yes   |
| Assessment Management | No                   | No                                | No      | Yes   |

Exact permissions will be finalized during security architecture.

---

# 38. API Resource Ownership

All child-related APIs must validate resource ownership.

For example:

```text
GET /api/v1/children/123/progress
```

The backend must verify:

```text
Current User
       |
       +-- authorized parent-child relationship?
       |
       OR
       |
       +-- authorized teacher-student relationship?
       |
       OR
       |
       +-- authorized admin permission?
```

Only then may the request proceed.

---

# 39. Input Validation Rules

Examples:

## Duration

```text
durationMinutes > 0
```

Maximum reasonable limits should be defined.

## Accuracy

```text
0 <= correct <= total
```

and:

```text
total > 0
```

## Dates

Dates must use a consistent API format.

## IDs

Identifiers must be validated before database operations.

## Enumerations

Values such as:

```text
EXCELLENT
GOOD
NEEDS_PRACTICE
```

must be validated against supported values.

---

# 40. Business Validation

Examples:

A topic must belong to the selected subject.

A skill must belong to the selected topic.

A teacher must be assigned to a child before creating teacher-scoped learning activity.

A parent must be linked to a child before accessing child-specific data.

An assessment must be available before an attempt can be started.

An attempt cannot be submitted twice unless the assessment explicitly supports that behavior.

A completed assessment attempt must preserve the context required to represent what was actually tested.

---

# 41. Idempotency

Certain endpoints may eventually require idempotency protection.

Potential candidates:

- Payment operations in future
- Assessment submission
- Important state transitions

The implementation should not introduce idempotency complexity everywhere unless a real use case requires it.

---

# 42. Concurrency

The backend must account for concurrent requests where state transitions matter.

Examples:

- Two submissions for the same assessment attempt
- Two updates to the same lesson plan
- Simultaneous teacher and parent updates

Appropriate optimistic or server-side state validation should be used where necessary.

---

# 43. API Logging

The backend should log useful request information in production, without logging sensitive information such as:

- Passwords
- Authentication secrets
- Tokens
- Sensitive child data unnecessarily

A request identifier should be used where practical to correlate API errors and logs.

---

# 44. API Rate Limiting

Rate limiting should be applied to appropriate endpoints.

Higher-risk endpoints include:

- Login
- Registration
- Password reset
- Media upload
- Potentially AI generation in the future

Rate limits should be based on actual infrastructure and abuse requirements.

---

# 45. API Versioning Strategy

The initial API version is:

```text
/v1
```

Breaking changes should be handled through a new API version rather than silently changing existing contracts.

Non-breaking additions may be made within the same version according to compatibility rules.

---

# 46. DTO Strategy

API requests and responses should use explicit DTOs.

For example:

```text
CreateLearningSessionRequest
LearningSessionResponse
CreateLessonPlanRequest
AssessmentAttemptResponse
ProgressResponse
```

Database documents should not automatically be exposed directly as API responses.

This provides a clean boundary between:

```text
Database Model
     ↓
Domain Logic
     ↓
DTO
     ↓
API Response
```

---

# 47. API and Database Separation

The API layer should not expose MongoDB implementation details unnecessarily.

For example, clients should not depend on internal MongoDB-specific fields beyond stable identifiers and contract-defined values.

This allows the persistence implementation to evolve without unnecessarily breaking frontend clients.

---

# 48. API Error Codes

Initial error codes may include:

```text
VALIDATION_ERROR
AUTHENTICATION_REQUIRED
INVALID_CREDENTIALS
FORBIDDEN
RESOURCE_NOT_FOUND
RESOURCE_CONFLICT
INVALID_STATE
RATE_LIMITED
INTERNAL_ERROR
```

Feature-specific error codes may be added when useful.

---

# 49. API Documentation

The API should eventually be documented using an API specification such as OpenAPI.

The API documentation should describe:

- Endpoints
- Authentication
- Request schemas
- Response schemas
- Error responses
- Query parameters
- Authorization requirements

OpenAPI generation or maintenance can be integrated into CI later.

---

# 50. API Testing

Important API tests should cover:

## Authentication

- Register
- Login
- Logout
- Password reset

## Authorization

- Parent accessing own child
- Parent accessing another parent's child
- Teacher accessing assigned student
- Teacher accessing unassigned student
- Admin access

## Learning

- Create learning session
- Validation
- History
- Filtering

## Lesson Plans

- Create
- Update
- Complete

## Practice

- Start
- Answer
- Submit
- Result

## Assessments

- Start
- Answer
- Submit
- Result
- History

## Progress

- Overall
- Subject
- Topic
- Trends

## Rewards

- Achievement evaluation
- Achievement retrieval

---

# 51. API Performance Principles

The API should:

- Avoid unnecessary database calls.
- Use appropriate indexes.
- Paginate large collections.
- Avoid returning unnecessary fields.
- Use aggregation where it provides clear value.
- Avoid large unbounded responses.
- Keep dashboard aggregation efficient.
- Measure performance before adding complex infrastructure.

---

# 52. API Security Principles

The API must:

1. Authenticate protected requests.
2. Authorize every protected resource.
3. Validate all input.
4. Sanitize or safely process user-generated content where appropriate.
5. Protect sensitive configuration.
6. Avoid leaking internal errors.
7. Apply appropriate rate limits.
8. Restrict file uploads.
9. Protect child-related data.
10. Use HTTPS in production.

---

# 53. Future AI APIs

AI will be added behind the backend.

Potential future endpoints:

```text
POST /api/v1/ai/lesson-suggestions
POST /api/v1/ai/practice-generation
POST /api/v1/ai/mock-test-generation
GET  /api/v1/ai/learning-insights/:childId
POST /api/v1/ai/progress-summary
```

The Angular client should not directly expose external AI-provider credentials.

AI APIs will be introduced only after the core learning and assessment system is stable.

---

# 54. Future Notification APIs

Potential future APIs:

```text
GET /api/v1/notifications
PATCH /api/v1/notifications/:id/read
```

Notification creation may eventually happen asynchronously through background processing.

---

# 55. Future Subscription APIs

Subscription/payment APIs are outside V1.

Possible future areas:

```text
/api/v1/subscriptions
/api/v1/plans
/api/v1/payments
```

These will require separate security and business-design work.

---

# 56. API Design Principles

The API should remain:

- Consistent
- Secure
- Predictable
- Versioned
- Testable
- Documented
- Resource-oriented
- Friendly to the Angular client
- Independent of MongoDB implementation details

---

# 57. Initial Core API Surface

The most important V1 endpoints are:

```text
Authentication
/api/v1/auth/*

Children
/api/v1/children

Subjects
/api/v1/subjects

Topics
/api/v1/topics

Learning
/api/v1/learning-sessions

Lesson Plans
/api/v1/lesson-plans

Practice
/api/v1/practice/*

Questions
/api/v1/admin/questions

Assessments
/api/v1/assessments
/api/v1/assessment-attempts

Progress
/api/v1/children/:childId/progress

Achievements
/api/v1/children/:childId/achievements

Journal
/api/v1/children/:childId/journal
```

---

# 58. Initial End-to-End API Flow

The most important parent workflow is:

```text
POST /auth/login
        ↓
GET /children
        ↓
GET /subjects
        ↓
GET /subjects/:subjectId/topics
        ↓
POST /learning-sessions
        ↓
GET /learning-sessions
        ↓
POST /lesson-plans
        ↓
POST /practice/sessions
        ↓
POST /practice/sessions/:id/submit
        ↓
POST /assessments/:id/attempts
        ↓
POST /assessment-attempts/:id/submit
        ↓
GET /children/:childId/progress
        ↓
GET /children/:childId/achievements
```

---

# 59. Contract Ownership

The API contract should be treated as a shared agreement between frontend and backend.

Changes should be reviewed before implementation when they affect:

- Request structure
- Response structure
- Authentication
- Authorization
- Resource meaning
- Status codes
- Error contracts

Breaking API changes should be documented explicitly.

---

# 60. Document Status

**Version:** 0.1  
**Status:** Draft

This API design will be refined during backend implementation, Angular architecture, security architecture, and integration testing.
