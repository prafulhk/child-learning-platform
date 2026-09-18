# Database Design

**Document:** MongoDB Database Design  
**Version:** 0.1  
**Status:** Draft  
**Last Updated:** 2026-09-18

---

# 1. Purpose

This document defines the initial MongoDB Atlas database design for the Child Learning & Progress Platform.

It translates the conceptual domain model into practical MongoDB collections, document structures, relationships, and indexes.

This document focuses on:

- Collections
- Document structure
- References
- Embedded data
- Ownership
- Authorization
- Indexing
- Historical data integrity
- Scalability considerations

The design should remain simple enough for the MVP while allowing future growth.

---

# 2. Database

**Database Technology:**

MongoDB Atlas

MongoDB will be the primary operational database for the application.

The initial design uses a document-oriented model with a combination of:

- References between major entities
- Embedded data for tightly related records
- Denormalized snapshots where historical integrity requires them

---

# 3. Design Principles

The database design follows these principles:

1. Keep frequently accessed related data practical to retrieve.
2. Avoid unnecessary joins and over-normalization.
3. Keep security relationships explicit.
4. Preserve historical records accurately.
5. Use references for reusable entities.
6. Embed small data that belongs tightly to a parent document.
7. Keep large media files outside MongoDB.
8. Index based on real application query patterns.
9. Support multiple children per parent.
10. Enforce authorization using backend queries and relationships.
11. Avoid storing derived data unless there is a clear performance reason.
12. Prefer simple schemas for V1 and evolve when real usage requires it.

---

# 4. Initial Collections

The initial database may contain the following collections:

```text
users
children
parentChildren
teacherStudents
subjects
topics
skills
learningSessions
lessonPlans
questions
assessments
assessmentAttempts
practiceSessions
examTypes
achievements
achievementRules
journalEntries
```

Additional collections may be introduced later when a real requirement exists.

---

# 5. Collection: users

## Purpose

Stores authenticated application users.

## Example Structure

```text
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  roles: ["PARENT"],
  firstName: String,
  lastName: String,
  profileImageUrl: String,
  status: "ACTIVE",
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

## Notes

- Passwords must never be stored directly.
- `passwordHash` contains only the securely generated password hash.
- `roles` is an array to support future multi-role users.
- Supported initial roles:
  - PARENT
  - TEACHER
  - ADMIN
- `status` may support:
  - ACTIVE
  - INACTIVE
  - SUSPENDED

## Indexes

```text
Unique index:
email
```

Possible additional indexes:

```text
roles
status
```

---

# 6. Collection: children

## Purpose

Stores learner profiles.

## Example Structure

```text
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  grade: String,
  profileImageUrl: String,
  status: "ACTIVE",
  createdAt: Date,
  updatedAt: Date
}
```

## Notes

A child is the central learner entity.

The child does not need an independent login account in V1.

A future child-login model can be introduced without changing the core learning records.

## Indexes

```text
dateOfBirth
grade
status
```

---

# 7. Collection: parentChildren

## Purpose

Represents the relationship between parents and children.

## Example Structure

```text
{
  _id: ObjectId,
  parentUserId: ObjectId,
  childId: ObjectId,
  relationship: "PARENT",
  status: "ACTIVE",
  createdAt: Date,
  updatedAt: Date
}
```

## Why a separate relationship collection?

A separate relationship document provides flexibility for future scenarios such as:

- Multiple authorized parents
- Guardians
- Different relationship types
- Relationship-specific permissions

## Indexes

```text
Unique compound index:
parentUserId + childId

Index:
childId
```

---

# 8. Collection: teacherStudents

## Purpose

Represents teacher-to-student assignments.

## Example Structure

```text
{
  _id: ObjectId,
  teacherUserId: ObjectId,
  childId: ObjectId,
  status: "ACTIVE",
  assignedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes

```text
Unique compound index:
teacherUserId + childId

Index:
childId
```

---

# 9. Collection: subjects

## Purpose

Stores platform-managed subjects.

## Example Structure

```text
{
  _id: ObjectId,
  name: String,
  code: String,
  description: String,
  category: "ACADEMIC",
  sortOrder: Number,
  status: "ACTIVE",
  createdAt: Date,
  updatedAt: Date
}
```

## Example Subjects

```text
Mathematics
English
Science
Abacus
Reading
Logical Reasoning
Mental Math
```

## Indexes

```text
Unique index:
code

Possible index:
status + sortOrder
```

---

# 10. Collection: topics

## Purpose

Stores topics belonging to subjects.

## Example Structure

```text
{
  _id: ObjectId,
  subjectId: ObjectId,
  name: String,
  code: String,
  description: String,
  sortOrder: Number,
  status: "ACTIVE",
  createdAt: Date,
  updatedAt: Date
}
```

## Relationship

```text
Subject
  ↓
Topic
```

## Indexes

```text
Unique compound index:
subjectId + code

Index:
subjectId + status
```

---

# 11. Collection: skills

## Purpose

Stores specific skills belonging to topics.

## Example Structure

```text
{
  _id: ObjectId,
  topicId: ObjectId,
  name: String,
  code: String,
  description: String,
  sortOrder: Number,
  status: "ACTIVE",
  createdAt: Date,
  updatedAt: Date
}
```

## Relationship

```text
Subject
  ↓
Topic
  ↓
Skill
```

## Indexes

```text
Unique compound index:
topicId + code

Index:
topicId + status
```

---

# 12. Collection: learningSessions

## Purpose

Stores actual completed learning activity.

This is one of the most important collections in the application.

## Example Structure

```text
{
  _id: ObjectId,

  childId: ObjectId,

  subjectId: ObjectId,
  topicId: ObjectId,
  skillId: ObjectId,

  learningDate: Date,

  durationMinutes: Number,

  whatWasTaught: String,

  performance: "EXCELLENT",

  accuracy: {
    correct: Number,
    total: Number,
    percentage: Number
  },

  notes: String,

  lessonPlanId: ObjectId,

  attachments: [
    {
      id: ObjectId,
      type: "IMAGE",
      url: String
    }
  ],

  createdByUserId: ObjectId,
  createdByRole: "PARENT",

  createdAt: Date,
  updatedAt: Date
}
```

## Important Rules

`childId` is required.

`subjectId` is required.

`topicId` is required.

`skillId` is optional.

`lessonPlanId` is optional.

`accuracy` is optional because not every learning session will involve questions.

## Indexes

Common queries are expected to include child and date.

Recommended indexes:

```text
childId + learningDate
childId + subjectId + learningDate
childId + topicId + learningDate
createdByUserId + learningDate
```

---

# 13. Collection: lessonPlans

## Purpose

Stores planned future learning.

## Example Structure

```text
{
  _id: ObjectId,

  childId: ObjectId,

  plannedDate: Date,

  subjectId: ObjectId,
  topicId: ObjectId,
  skillId: ObjectId,

  plannedActivity: String,

  plannedDurationMinutes: Number,

  notes: String,

  status: "PLANNED",

  completedLearningSessionId: ObjectId,

  createdByUserId: ObjectId,
  createdByRole: "PARENT",

  createdAt: Date,
  updatedAt: Date
}
```

## Status

Initial statuses may include:

```text
PLANNED
COMPLETED
CANCELLED
```

## Important Rule

A lesson plan represents intended learning.

A learning session represents actual learning.

The two must remain distinct.

## Indexes

```text
childId + plannedDate
childId + status + plannedDate
```

---

# 14. Collection: questions

## Purpose

Stores reusable educational questions.

## Example Structure

```text
{
  _id: ObjectId,

  subjectId: ObjectId,
  topicId: ObjectId,
  skillId: ObjectId,

  questionType: "MCQ",

  questionText: String,

  options: [
    {
      id: String,
      text: String
    }
  ],

  correctAnswer: String,

  explanation: String,

  difficulty: "EASY",

  ageRange: {
    min: Number,
    max: Number
  },

  grades: [String],

  examTypeIds: [ObjectId],

  status: "ACTIVE",

  createdByUserId: ObjectId,

  createdAt: Date,
  updatedAt: Date
}
```

## Question Types

Initial types may include:

```text
MCQ
TRUE_FALSE
NUMERIC
TEXT
```

## Indexes

Potential indexes:

```text
subjectId + topicId
topicId + difficulty
skillId + difficulty
examTypeIds
status
```

Question indexes should be refined after the question-selection strategy is finalized.

---

# 15. Collection: examTypes

## Purpose

Stores assessment contexts and preparation categories.

## Example Structure

```text
{
  _id: ObjectId,
  name: String,
  code: String,
  description: String,
  status: "ACTIVE",
  createdAt: Date,
  updatedAt: Date
}
```

## Examples

```text
Olympiad Preparation
International Assessment
School Examination
Skill Assessment
```

This entity provides context.

It does not represent an individual test.

## Indexes

```text
Unique index:
code
```

---

# 16. Collection: assessments

## Purpose

Stores configurable tests.

## Example Structure

```text
{
  _id: ObjectId,

  name: String,
  description: String,

  subjectId: ObjectId,

  topicIds: [ObjectId],
  skillIds: [ObjectId],

  examTypeId: ObjectId,

  ageRange: {
    min: Number,
    max: Number
  },

  grades: [String],

  difficulty: "MEDIUM",

  durationMinutes: Number,

  questionCount: Number,

  scoring: {
    correctMarks: Number,
    incorrectMarks: Number,
    unansweredMarks: Number
  },

  questionSelection: {
    mode: "RANDOM",
    filters: {
      subjectId: ObjectId,
      topicIds: [ObjectId],
      skillIds: [ObjectId],
      difficulty: String
    }
  },

  status: "DRAFT",

  createdByUserId: ObjectId,

  createdAt: Date,
  updatedAt: Date
}
```

## Status

Possible statuses:

```text
DRAFT
PUBLISHED
ARCHIVED
```

## Important Design Decision

An assessment definition can change over time.

Historical attempts must not be rewritten simply because an assessment definition changes.

Therefore, assessment attempts will preserve the important test configuration used at the time of the attempt.

---

# 17. Collection: assessmentAttempts

## Purpose

Stores one child's attempt at an assessment.

## Example Structure

```text
{
  _id: ObjectId,

  assessmentId: ObjectId,
  childId: ObjectId,

  startedAt: Date,
  submittedAt: Date,

  status: "COMPLETED",

  durationSeconds: Number,

  assessmentSnapshot: {
    name: String,
    subjectId: ObjectId,
    examTypeId: ObjectId,
    durationMinutes: Number,
    questionCount: Number
  },

  questions: [
    {
      questionId: ObjectId,

      questionSnapshot: {
        questionType: String,
        questionText: String,
        options: [
          {
            id: String,
            text: String
          }
        ]
      },

      submittedAnswer: String,

      isCorrect: Boolean,

      marksAwarded: Number,

      timeTakenSeconds: Number
    }
  ],

  result: {
    score: Number,
    accuracyPercentage: Number,
    correctCount: Number,
    incorrectCount: Number,
    unansweredCount: Number
  },

  createdByUserId: ObjectId,

  createdAt: Date,
  updatedAt: Date
}
```

## Important Historical Rule

Question and assessment snapshots are intentionally stored inside the attempt.

This protects historical accuracy if the original question or assessment is edited later.

---

# 18. Collection: practiceSessions

## Purpose

Stores informal practice activity.

## Example Structure

```text
{
  _id: ObjectId,

  childId: ObjectId,

  subjectId: ObjectId,
  topicId: ObjectId,
  skillId: ObjectId,

  startedAt: Date,
  completedAt: Date,

  status: "COMPLETED",

  questions: [
    {
      questionId: ObjectId,

      questionSnapshot: {
        questionType: String,
        questionText: String,
        options: [
          {
            id: String,
            text: String
          }
        ]
      },

      submittedAnswer: String,

      isCorrect: Boolean,

      timeTakenSeconds: Number
    }
  ],

  result: {
    totalQuestions: Number,
    correctCount: Number,
    incorrectCount: Number,
    accuracyPercentage: Number,
    durationSeconds: Number
  },

  createdByUserId: ObjectId,

  createdAt: Date,
  updatedAt: Date
}
```

## Important Design Decision

Practice answers are embedded inside the practice session.

A separate `answers` collection is not required initially.

This keeps practice-result retrieval simple.

---

# 19. Collection: achievements

## Purpose

Stores achievements earned by children.

## Example Structure

```text
{
  _id: ObjectId,

  childId: ObjectId,

  achievementRuleId: ObjectId,

  name: String,
  description: String,

  earnedAt: Date,

  metadata: {
    value: Number,
    threshold: Number
  },

  createdAt: Date
}
```

## Indexes

```text
childId + earnedAt

Unique compound index:
childId + achievementRuleId
```

The uniqueness rule can be relaxed later for repeatable achievements.

---

# 20. Collection: achievementRules

## Purpose

Defines the rules that determine when achievements are earned.

## Example Structure

```text
{
  _id: ObjectId,

  code: String,
  name: String,
  description: String,

  ruleType: "LEARNING_SESSION_COUNT",

  configuration: {
    threshold: Number
  },

  repeatable: Boolean,

  status: "ACTIVE",

  createdAt: Date,
  updatedAt: Date
}
```

## Possible Rule Types

```text
LEARNING_SESSION_COUNT
LEARNING_STREAK
PRACTICE_COUNT
ASSESSMENT_ACCURACY
ASSESSMENT_COUNT
TOTAL_LEARNING_MINUTES
```

The achievement engine will evaluate these rules.

---

# 21. Collection: journalEntries

## Purpose

Stores learning memories, observations, and milestones.

## Example Structure

```text
{
  _id: ObjectId,

  childId: ObjectId,

  title: String,
  description: String,

  entryDate: Date,

  subjectId: ObjectId,
  topicId: ObjectId,

  attachments: [
    {
      id: ObjectId,
      type: "IMAGE",
      storageKey: String,
      url: String
    }
  ],

  createdByUserId: ObjectId,

  createdAt: Date,
  updatedAt: Date
}
```

## Indexes

```text
childId + entryDate
```

---

# 22. Media Storage

Actual photos and videos should not be stored directly inside MongoDB.

Recommended conceptual design:

```text
Angular
   ↓
Backend
   ↓
Object Storage
   ↓
Stored File
   ↓
MongoDB Metadata / Reference
```

MongoDB should store:

- Storage key
- Media type
- File name where appropriate
- File size where appropriate
- URL/reference
- Creation metadata

The exact object-storage provider will be selected later.

---

# 23. Progress Data Strategy

A separate `progress` collection is **not required initially**.

Progress can be calculated from source data such as:

```text
learningSessions
practiceSessions
assessmentAttempts
```

For example:

```text
Learning Time
= SUM(learningSessions.durationMinutes)
```

```text
Practice Accuracy
= SUM(correct answers) / SUM(total answers)
```

```text
Assessment Accuracy
= calculated from assessmentAttempts
```

This approach keeps raw source data authoritative.

---

# 24. Progress Caching Strategy

If progress calculations become expensive at scale, the system may later introduce:

- Precomputed summaries
- Cached aggregates
- Daily metrics
- Subject summaries
- Topic summaries

A dedicated progress collection should therefore be considered an optimization, not a requirement for V1.

---

# 25. Ownership and Authorization

Every child-related operational record must contain a `childId`.

Examples:

```text
learningSessions.childId
lessonPlans.childId
practiceSessions.childId
assessmentAttempts.childId
journalEntries.childId
achievements.childId
```

This makes authorization checks explicit.

The backend should verify access through:

```text
Parent
→ parentChildren
→ child

Teacher
→ teacherStudents
→ child
```

A user must never gain access merely by knowing a child ID.

---

# 26. Data Isolation

The application must protect data at the API and database-query level.

Example:

A parent request for learning sessions should conceptually become:

```text
Find learningSessions
WHERE
  childId = requestedChildId
AND
  requestedChildId is authorized for currentUser
```

The authorization condition must be enforced by the backend.

Frontend filtering is not a security mechanism.

---

# 27. Soft Deactivation

For configuration data such as:

- Subjects
- Topics
- Skills
- Questions
- Assessments
- Achievement rules

prefer `status` or an equivalent lifecycle field over immediately deleting records.

This helps preserve historical relationships.

---

# 28. Historical Data Integrity

Historical learning and assessment records should remain understandable even when configuration changes.

Examples:

If a topic is renamed, old learning records should still remain valid.

If a question is edited, a completed assessment attempt should preserve the question information that was actually presented.

If an assessment changes, previous attempts must still represent the original attempt context.

This is why snapshots are appropriate for historical assessment/practice records.

---

# 29. Common Audit Fields

Operational documents should generally include:

```text
createdAt
updatedAt
```

Where appropriate:

```text
createdByUserId
updatedByUserId
```

User-facing historical activity should retain creator information when useful.

---

# 30. Identifier Strategy

MongoDB will use `ObjectId` identifiers.

References should use ObjectId values rather than storing user-visible names as primary relationships.

Examples:

```text
childId: ObjectId
subjectId: ObjectId
topicId: ObjectId
skillId: ObjectId
userId: ObjectId
```

Names and labels remain editable presentation data.

---

# 31. Reference vs Embedded Data

## Prefer references for reusable entities

Examples:

- User
- Child
- Subject
- Topic
- Skill
- Question
- Assessment
- Exam Type

## Prefer embedded data for tightly related historical data

Examples:

- Assessment answers
- Practice answers
- Assessment question snapshots
- Practice question snapshots
- Small attachment metadata

This balances reuse, query efficiency, and historical consistency.

---

# 32. Initial Indexing Strategy

Indexes should support known access patterns rather than indexing every field.

Important initial indexes include:

```text
users.email

parentChildren.parentUserId + childId
parentChildren.childId

teacherStudents.teacherUserId + childId
teacherStudents.childId

topics.subjectId + status

skills.topicId + status

learningSessions.childId + learningDate
learningSessions.childId + subjectId + learningDate
learningSessions.childId + topicId + learningDate

lessonPlans.childId + plannedDate
lessonPlans.childId + status + plannedDate

questions.subjectId + topicId
questions.topicId + difficulty

assessmentAttempts.childId + submittedAt
assessmentAttempts.childId + assessmentId + submittedAt

practiceSessions.childId + completedAt

achievements.childId + earnedAt

journalEntries.childId + entryDate
```

Indexes will be reviewed using real query patterns and production measurements.

---

# 33. Pagination

Lists that may grow significantly should be paginated.

Examples:

- Learning history
- Practice history
- Assessment history
- Question bank
- Journal entries
- Users
- Students

The API design will define the pagination contract later.

---

# 34. Query Design

Common query patterns should be designed before implementation.

Examples:

```text
Get today's learning for child
Get learning history for child
Get learning by subject
Get learning by topic
Get upcoming lesson plans
Get child practice history
Get child assessment history
Get child progress
Get child's achievements
Get teacher's assigned students
Get available questions
```

Database indexes should support these operations.

---

# 35. Transaction Strategy

MongoDB transactions should be used only where multiple related writes need atomic behavior.

Examples that may require a transaction in future:

- Creating a complex assignment relationship
- Completing an assessment and recording related state changes
- Awarding an achievement alongside another critical operation

Simple single-document writes do not require transactions.

Avoid using transactions by default for every operation.

---

# 36. Data Retention

The system should retain learning and assessment history unless a valid product or legal requirement requires deletion.

Deletion policies will be defined later.

Because this platform deals with child-related information, privacy and data-retention requirements must be considered before public launch.

---

# 37. Database Security

MongoDB Atlas should be configured with appropriate security controls.

Requirements include:

- Secure credentials
- Network restrictions where appropriate
- Least-privilege database users
- Encrypted connections
- Production secrets outside source control
- Backups
- Monitoring

Exact Atlas configuration will be defined during infrastructure setup.

---

# 38. Scalability Direction

The initial database design is intended for a moderate MVP workload.

Future scaling options may include:

- Better indexing
- Aggregation optimization
- Read/write optimization
- Caching
- Precomputed summaries
- Archiving
- Sharding if actual scale eventually requires it

Scaling decisions should be based on measured workload.

---

# 39. Backup and Recovery

Production should use MongoDB Atlas backup capabilities.

The production database must have a defined recovery strategy.

The exact:

- Backup frequency
- Retention period
- Recovery point objective
- Recovery time objective

will be defined before production launch.

---

# 40. Example Core Relationships

```text
USER
 |
 +-- parentChildren --> CHILD
 |
 +-- teacherStudents --> CHILD


CHILD
 |
 +-- learningSessions
 |
 +-- lessonPlans
 |
 +-- practiceSessions
 |
 +-- assessmentAttempts
 |
 +-- journalEntries
 |
 +-- achievements


SUBJECT
 |
 +-- TOPICS
       |
       +-- SKILLS


QUESTION
 |
 +-- referenced by PRACTICE
 |
 +-- referenced by ASSESSMENT


ASSESSMENT
 |
 +-- assessmentAttempts
```

---

# 41. Core Data Flow

The main learning data flow is:

```text
Lesson Plan
      ↓
Learning Session
      ↓
Practice Session
      ↓
Assessment Attempt
      ↓
Result
      ↓
Progress Calculation
      ↓
Achievement Evaluation
```

Not every learning activity must go through every stage.

---

# 42. V1 Database Scope

The first implementation should prioritize these collections:

```text
users
children
parentChildren
teacherStudents
subjects
topics
learningSessions
lessonPlans
questions
assessments
assessmentAttempts
practiceSessions
achievements
journalEntries
```

The following may be added as required:

```text
skills
examTypes
achievementRules
```

The final implementation should be based on actual feature requirements and API contracts.

---

# 43. Future Database Extensions

Possible future capabilities may introduce additional collections or structures for:

- Organizations
- Schools
- Courses
- Curricula
- Assignments
- Notifications
- Parent-teacher communication
- Subscriptions
- Payments
- AI-generated content
- AI recommendations
- Analytics
- Audit logs

These are intentionally outside the initial database scope.

---

# 44. Database Design Principles Summary

The database should remain:

- Child-centered
- Secure
- Query-friendly
- Subject-agnostic
- Assessment-framework-agnostic
- Historically accurate
- Scalable
- Maintainable

The raw learning and assessment records are the source of truth.

Derived analytics should initially be calculated from those records.

---

# 45. Next Architecture Step

The next document will define the API contract.

It will translate database/domain concepts into backend operations such as:

```text
POST /auth/login
GET /children
POST /learning-sessions
GET /learning-sessions
POST /lesson-plans
GET /progress
GET /assessments
POST /assessment-attempts
GET /assessment-attempts/:id
```

The API design will define:

- Endpoints
- HTTP methods
- Request payloads
- Response payloads
- Validation
- Errors
- Authorization
- Pagination
- Filtering

---

# 46. Document Status

**Version:** 0.1  
**Status:** Draft

This document defines the initial MongoDB design and will be refined during API design, implementation, testing, and production validation.
