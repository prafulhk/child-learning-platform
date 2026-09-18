# Child Learning & Progress Platform

**Document:** Product Requirements Document (PRD)  
**Version:** 0.1  
**Status:** Draft  
**Last Updated:** 2026-09-18  
**Product Name:** TBD

---

# 1. Product Overview

## 1.1 Vision

Build a mobile-first learning platform that helps parents and teachers record, organize, assess, and understand a child's learning journey across multiple subjects.

The platform should make it easy to answer:

- What did I teach today?
- How much time did the child spend learning?
- What did the child practice?
- How well did the child perform?
- Which topics are strong?
- Which topics need more practice?
- What should be taught next?
- How is the child progressing over time?

The product will initially be used by the founder to track his child's Abacus and general learning journey, while being designed from the beginning as a multi-user product for parents and teachers.

---

# 2. Problem Statement

Parents who teach or support their children at home often keep learning information in multiple places such as notebooks, memory, photos, videos, messaging applications, or spreadsheets.

This makes it difficult to maintain a continuous learning history and understand the child's progress.

Teachers may also need a structured way to record lessons, assign practice, conduct assessments, and review individual student progress.

The platform will centralize this information into one system.

---

# 3. Target Users

## 3.1 Parent

A parent can:

- Create an account.
- Manage multiple children.
- Track each child's learning separately.
- Record daily learning sessions.
- Record learning duration.
- Record what was taught.
- Record observations and performance.
- Plan future lessons.
- Create or assign practice.
- Conduct mock tests.
- Review test results.
- Track progress.
- View achievements and rewards.
- Maintain a learning journal with optional photos/videos.

---

## 3.2 Teacher

A teacher can:

- Create an account.
- Manage their profile.
- View assigned students.
- Record lessons.
- Plan lessons.
- Assign practice.
- Conduct or assign assessments.
- Record observations.
- Review student progress.

Teachers should only have access to students assigned to them.

---

## 3.3 Child

The initial child experience should be simple.

A child may:

- Complete practice.
- Take assessments.
- View results.
- View achievements and rewards.

A richer child-focused experience can be introduced in a future release.

---

## 3.4 Admin

An administrator manages platform-level configuration and users.

Admin capabilities may include:

- User management.
- Subject management.
- Topic management.
- Skill management.
- Assessment configuration.
- Question bank management.
- Exam framework management.

---

# 4. Product Goals

## Goal 1 — Simple Daily Tracking

A parent or teacher should be able to record a completed learning session quickly.

## Goal 2 — Meaningful Progress Tracking

The system should convert learning and assessment data into useful progress information.

## Goal 3 — Assessment

The platform should support practice sessions, mock tests, and configurable assessments.

## Goal 4 — Structured Learning

Learning should be organized using:

Subject → Topic → Skill

while still allowing free-text notes for teaching observations.

## Goal 5 — Multiple Children

A parent should be able to manage multiple children within one account.

## Goal 6 — Teacher Collaboration

Teachers should be able to work with assigned children while maintaining role-based access.

## Goal 7 — Scalable Product Foundation

The architecture should support future subjects, assessments, users, analytics, and AI capabilities without requiring major redesign.

---

# 5. Product Principles

1. The product should be mobile-first.
2. Common actions should require minimal interaction.
3. Data should be structured wherever useful.
4. Users should not need to enter unnecessary information.
5. Parent and teacher experiences should be role-specific.
6. Learning history should be preserved.
7. Progress should be based on recorded data.
8. The platform should be subject-agnostic.
9. Abacus is the initial use case, not the core domain model.
10. Security and privacy should be considered from the beginning.

---

# 6. Product Scope

## 6.1 In Scope for V1

- Authentication
- Parent account
- Teacher account
- Role-based access
- Multiple children
- Subject management
- Topic management
- Daily learning logs
- Learning history
- Lesson planning
- Practice sessions
- Mock tests
- Assessment results
- Progress dashboard
- Basic rewards and achievements
- Photo/video journal
- Responsive mobile and desktop UI
- Production deployment
- CI/CD

---

## 6.2 Out of Scope for V1

The following are not initial priorities:

- Full online school functionality
- Live classes
- Large educational video library
- Social network functionality
- Messaging platform
- Full school ERP
- Advanced AI teaching assistant
- Complex child social features

These may be considered in future releases.

---

# 7. Core Product Loop

The primary learning workflow is:

PLAN
↓
TEACH
↓
LOG
↓
PRACTICE
↓
TEST
↓
ANALYZE
↓
PLAN NEXT

Example:

Tomorrow's lesson plan
↓
Teach Abacus Addition
↓
Record 30 minutes
↓
Practice 10 questions
↓
Score 8/10
↓
Identify weak area
↓
Plan additional practice

---

# 8. Functional Requirements

## 8.1 Authentication

The system shall support:

- User registration.
- User login.
- Logout.
- Password reset.
- Secure authentication.
- Role-based authorization.

Initial roles:

- PARENT
- TEACHER
- ADMIN

---

# 9. Child Management

Parents shall be able to:

- Add a child.
- Edit child information.
- View child profile.
- Switch between children.
- View child-specific learning information.

A parent may manage multiple children.

Every learning, practice, assessment, and progress record must belong to a specific child.

---

# 10. Subject Management

The platform shall use controlled subjects instead of allowing unrestricted user-entered subject names.

Initial subjects may include:

## Academic

- Mathematics
- English
- Science
- General Knowledge
- Social Studies

## Skills

- Abacus
- Mental Math
- Logical Reasoning
- Coding
- Reading
- Writing
- Spelling

The subject list should be stored as configurable platform data so administrators can add additional subjects in the future.

---

# 11. Topic and Skill Structure

The learning structure should follow:

Subject
↓
Topic
↓
Skill

Example:

Abacus
↓
Addition
↓
5-Bead Combination

Another example:

Mathematics
↓
Addition
↓
Single Digit Addition

This structure will support progress analytics and future personalization.

---

# 12. Daily Learning Log

Parents and teachers shall be able to record a learning session.

Required or optional fields may include:

- Child
- Subject
- Topic
- Date
- Duration
- What was taught
- Performance
- Accuracy
- Notes
- Attachments

Example:

Subject: Abacus  
Topic: Addition  
Duration: 30 minutes  
What was taught: Introduced 5-bead combinations.  
Performance: Good  
Accuracy: 8/10  
Notes: Concept understood but speed requires practice.

---

# 13. Learning Performance

The system may initially provide simple performance options:

- Excellent
- Good
- Needs Practice

The system should avoid implying that these labels are objectively measured unless supported by recorded data.

Quantitative indicators such as accuracy, duration, speed, and assessment scores should be stored separately.

---

# 14. Lesson Planning

Users shall be able to create future lesson plans.

Example:

Child: Child A  
Date: Tomorrow  
Subject: Abacus  
Topic: 5-Bead Combination  
Planned duration: 30 minutes  
Plan: Practice 20 questions.  
Notes: Focus on speed.

Planned lessons and completed lessons must remain distinct records.

---

# 15. Learning History

Users shall be able to review previous learning sessions.

The history should support filtering by:

- Child
- Subject
- Topic
- Date range

Each record should display relevant information such as:

- Date
- Subject
- Topic
- Duration
- Performance
- Accuracy
- Notes

---

# 16. Practice

Practice sessions shall allow children to answer questions without necessarily being part of a formal test.

Practice data may include:

- Question
- Answer
- Correct/Incorrect
- Time taken
- Attempt number
- Topic
- Difficulty

Practice results should contribute to progress analytics.

---

# 17. Mock Tests

The system shall support configurable mock tests.

A test may define:

- Subject
- Topic
- Age
- Grade
- Difficulty
- Exam type
- Duration
- Number of questions
- Scoring method

Initial assessment types may include:

- Practice Test
- Mock Test
- Weekly Test
- Olympiad Preparation
- International Exam Preparation

The assessment engine should be generic rather than hard-coded to a single examination.

---

# 18. Assessment Architecture

The conceptual structure is:

Exam Type
↓
Assessment
↓
Question Set
↓
Questions
↓
Attempt
↓
Answers
↓
Result

This allows multiple exam frameworks to use the same assessment engine.

---

# 19. Question Bank

The question bank should support structured metadata such as:

- Subject
- Topic
- Skill
- Age
- Grade
- Difficulty
- Exam type
- Question type
- Question text
- Options
- Correct answer
- Explanation

Initially, questions may be managed by administrators.

AI-generated questions may be introduced in a future phase with appropriate validation and review.

---

# 20. Progress Tracking

The platform shall provide progress information at multiple levels.

## Child level

Possible indicators:

- Total learning time
- Weekly learning time
- Practice frequency
- Average accuracy
- Assessment performance
- Learning streak
- Achievements

## Subject level

Example:

Mathematics

- Learning time
- Practice count
- Accuracy
- Topic progress

## Topic level

Example:

Addition — 92%
Subtraction — 71%
Patterns — 88%

Progress calculations must be based on actual recorded activity.

---

# 21. Progress Dashboard

The parent dashboard should prioritize actionable information.

Initial sections:

- Today's Learning
- Planned Lessons
- Recent Learning
- Subject Progress
- Weak Areas
- Upcoming Tests
- Achievements

The dashboard should avoid unnecessary visual complexity.

---

# 22. Rewards and Achievements

The system shall support basic achievements.

Possible examples:

- First learning session
- 7-day learning streak
- 10 completed lessons
- 90% test accuracy
- 30-day learning streak
- 50 completed learning sessions
- Improved test speed

Rewards should primarily reinforce learning activity and milestones.

Future versions may support parent-configured real-world rewards.

---

# 23. Photo and Video Journal

Users may attach photos or videos to learning records or journal entries.

Example:

September 18
Abacus Practice

- Photo
- Short practice video
- Parent notes

Actual media files should be stored using an appropriate object-storage solution rather than directly inside MongoDB.

---

# 24. Teacher Workflow

Teacher workflow:

Teacher Login
↓
Dashboard
↓
Assigned Students
↓
Student Profile
↓
Log Lesson
↓
Assign Practice
↓
Conduct/Assign Test
↓
Provide Feedback
↓
Review Progress

Teachers must only be able to access students they are authorized to manage.

---

# 25. Permissions

Initial permission model:

| Capability                | Parent | Teacher | Admin |
| ------------------------- | ------ | ------- | ----- |
| Manage own account        | Yes    | Yes     | Yes   |
| Manage own children       | Yes    | No      | Yes   |
| View assigned children    | Yes    | Yes     | Yes   |
| Log learning              | Yes    | Yes     | Yes   |
| Plan lessons              | Yes    | Yes     | Yes   |
| Practice                  | Yes    | Yes     | Yes   |
| Assessments               | Yes    | Yes     | Yes   |
| Manage subjects           | No     | No      | Yes   |
| Manage topics             | No     | No      | Yes   |
| Manage questions          | No     | Limited | Yes   |
| Manage exam configuration | No     | No      | Yes   |

The exact authorization rules will be defined during architecture design.

---

# 26. Mobile-First Requirements

The application should be designed primarily for mobile use.

Important actions such as:

- Select child
- Log learning
- Start practice
- Start test
- View today's progress

should be easy to perform with minimal taps.

---

# 27. Desktop Requirements

Desktop should provide enhanced functionality for:

- Detailed progress analysis
- Charts
- History
- Question management
- Test configuration
- Teacher workflows
- Administrative workflows

Design principle:

Mobile = quick actions  
Desktop = deeper analysis

---

# 28. Security and Privacy Requirements

The system should:

- Protect user authentication information.
- Enforce authorization on every protected resource.
- Validate user input.
- Protect application secrets.
- Restrict file uploads.
- Prevent users from accessing other users' children/data.
- Use secure transport in production.
- Minimize unnecessary personal data collection.
- Follow appropriate privacy requirements as the product expands.

Additional security requirements will be defined during architecture and production-hardening phases.

---

# 29. Non-Functional Requirements

## Performance

Common screens should load quickly and avoid unnecessary network requests.

## Scalability

The design should allow growth in:

- users
- children
- subjects
- learning sessions
- questions
- assessments

## Maintainability

The codebase should use clear feature-based architecture and separation of concerns.

## Reliability

Critical user data should be persisted safely and recoverably.

## Accessibility

The UI should follow practical accessibility standards.

## Responsiveness

The application must support mobile, tablet, and desktop screen sizes.

---

# 30. Technology Direction

## Frontend

- Angular
- TypeScript
- Standalone Angular APIs
- Signals where appropriate
- RxJS
- Responsive UI

## Backend

- Node.js
- Express
- TypeScript
- REST APIs

## Database

- MongoDB Atlas

## Repository

- GitHub
- Monorepo

## Deployment

- Cloud-hosted frontend
- Cloud-hosted backend
- MongoDB Atlas
- CI/CD

The exact hosting and infrastructure choices will be finalized during architecture design.

---

# 31. High-Level Architecture

Conceptual architecture:

Browser
↓
Angular Web Application
↓
REST API
↓
Node.js + Express
↓
Application Services
↓
MongoDB Atlas

Supporting infrastructure may include:

- Object storage
- Authentication infrastructure
- CI/CD
- Logging
- Monitoring
- Error tracking

---

# 32. Core Domain Concepts

Initial domain entities may include:

- User
- Child
- ParentChild
- TeacherStudent
- Subject
- Topic
- Skill
- LearningSession
- LessonPlan
- PracticeSession
- Question
- QuestionSet
- Assessment
- AssessmentAttempt
- Answer
- Progress
- Achievement
- Reward
- JournalEntry
- Attachment

These are initial concepts and will be refined during domain modeling.

---

# 33. V1 User Journey

## Parent

Register
↓
Add child
↓
Select child
↓
View dashboard
↓
Log today's learning
↓
Plan tomorrow
↓
Practice
↓
Take mock test
↓
Review result
↓
Review progress
↓
View achievements

## Teacher

Register
↓
View assigned students
↓
Select student
↓
Log lesson
↓
Assign practice
↓
Assess
↓
Review progress

## Child

Open assigned activity
↓
Practice
↓
Take test
↓
View result
↓
View achievements

---

# 34. V1 Success Criteria

V1 should be considered functional when a parent can:

1. Create an account.
2. Add a child.
3. Select a subject.
4. Log a learning session.
5. Record learning duration.
6. Record what was taught.
7. View learning history.
8. Create a future lesson plan.
9. Give practice questions.
10. Conduct a mock test.
11. View the test result.
12. View basic progress.
13. View achievements.
14. Use the application comfortably on mobile and desktop.

The primary personal validation criterion is:

> The product should make it easier to manage and understand the child's real learning journey.

---

# 35. Product Strategy

The platform should not be built as an Abacus-only application.

Abacus is the initial real-world use case.

The core platform should instead represent generic learning concepts:

Learning  
Practice  
Assessment  
Progress  
Rewards  
Subjects  
Topics  
Skills

This allows the platform to support many subjects and learning paths.

---

# 36. Future Roadmap

## V2

- Advanced analytics
- Topic mastery
- More assessment frameworks
- Improved teacher collaboration
- Notifications
- Enhanced child dashboard

## V3

AI-assisted capabilities such as:

- Personalized lesson suggestions
- Practice generation
- Mock-test generation
- Weak-area analysis
- Progress summaries
- Personalized learning plans

AI functionality must use appropriate safeguards and validation, especially for child-facing educational content.

---

# 37. Initial Development Phases

## Phase 1 — Product Definition

- PRD
- Personas
- User stories
- Acceptance criteria
- Scope
- Product roadmap

## Phase 2 — UX Definition

- Screen map
- User flows
- Navigation
- Responsive behavior
- Core interaction design

## Phase 3 — System Architecture

- System architecture
- Domain model
- Data model
- MongoDB schema
- API contracts
- Authentication architecture
- Authorization model

## Phase 4 — Angular Architecture

- Application structure
- Feature boundaries
- Routing
- State management strategy
- Shared UI
- Core services
- API integration strategy

## Phase 5 — Backend Architecture

- Modules
- Controllers
- Services
- Repositories
- Validation
- Error handling
- Authentication
- Authorization

## Phase 6 — Implementation

Build features incrementally.

## Phase 7 — Testing

- Unit tests
- Integration tests
- End-to-end tests

## Phase 8 — Production

- CI/CD
- Deployment
- Monitoring
- Security hardening
- Performance

## Phase 9 — Personal Beta

Use the product for the founder's real learning workflow.

## Phase 10 — Iteration

Use real usage feedback to define V2.

---

# 38. Development Philosophy

The project should be developed incrementally.

Large features should be broken into small, testable tasks.

Development flow:

Requirement
↓
User Story
↓
Acceptance Criteria
↓
Technical Design
↓
Implementation
↓
Tests
↓
Code Review
↓
Merge
↓
Deploy

AI coding agents such as Codex may be used for planning, implementation, testing, refactoring, and code review assistance, while architectural and product decisions remain explicitly reviewed by the project owner.

---

# 39. Open Decisions

The following decisions remain open:

- Product name
- Final hosting platform
- Object storage provider
- Email provider
- Notification mechanism
- Child authentication model
- Exact assessment frameworks
- Question content strategy
- AI provider and AI architecture
- Subscription/business model

These will be resolved through documented architecture and product decisions.

---

# 40. Document Status

**Current Version:** 0.1  
**Status:** Draft

This PRD is a living document and will be updated as product requirements and architecture decisions are refined.
