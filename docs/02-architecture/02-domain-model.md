# Domain Model

**Document:** Domain Model  
**Version:** 0.1  
**Status:** Draft  
**Last Updated:** 2026-09-18

---

# 1. Purpose

This document defines the core business concepts of the Child Learning & Progress Platform and the relationships between them.

The domain model describes what exists in the product and how those concepts relate to each other.

It does not define database collections, indexes, API endpoints, or Angular implementation details.

Those will be defined in later architecture documents.

---

# 2. Domain Overview

The platform is centered around a child's learning journey.

The primary domain flow is:

User
→ Child
→ Subject
→ Topic
→ Skill
→ Learning
→ Practice
→ Assessment
→ Progress
→ Achievement

A separate planning flow supports:

Child
→ Lesson Plan
→ Learning Session

A journal flow supports:

Child
→ Journal Entry
→ Attachment

---

# 3. Core Domain Areas

The initial domain is divided into the following areas:

1. Identity and Access
2. Child Management
3. Learning Taxonomy
4. Learning Tracking
5. Lesson Planning
6. Practice
7. Question Bank
8. Assessment
9. Progress
10. Rewards
11. Journal and Media
12. Administration

---

# 4. Identity and Access Domain

## 4.1 User

Represents a person who has an account in the platform.

A User may be:

- Parent
- Teacher
- Admin

Core concepts may include:

- User identity
- Account credentials
- Role
- Account status
- Profile information
- Creation date
- Last updated date

A user may have one or more supported roles depending on future authorization requirements.

---

## 4.2 Role

Represents the access role assigned to a user.

Initial roles:

- PARENT
- TEACHER
- ADMIN

Roles determine which application capabilities a user may access.

Role-based access must be enforced by the backend.

---

## 4.3 Parent-Child Relationship

Represents ownership/management of a child by a parent.

Relationship:

Parent
→ Child

A parent can manage multiple children.

A child may potentially have more than one authorized parent in a future version, therefore the domain should not assume that a child can only ever have one parent.

---

## 4.4 Teacher-Student Relationship

Represents an authorized teaching relationship.

Relationship:

Teacher
→ Child/Student

A teacher can have multiple assigned students.

A student may potentially be assigned to multiple teachers.

The relationship determines teacher access to the student's information.

---

# 5. Child Domain

## 5.1 Child

Represents the learner whose learning journey is being tracked.

Core concepts may include:

- Name
- Date of birth
- Grade/class
- Profile information
- Active/inactive status
- Creation date
- Updated date

A child is the central entity for learning activity.

A child may have:

- Multiple subjects
- Multiple learning sessions
- Multiple lesson plans
- Multiple practice sessions
- Multiple assessment attempts
- Multiple achievements
- Multiple journal entries

---

# 6. Learning Taxonomy Domain

The learning taxonomy organizes educational information into a controlled hierarchy.

The intended hierarchy is:

Subject
→ Topic
→ Skill

---

## 6.1 Subject

Represents a broad learning area.

Examples:

- Mathematics
- English
- Science
- Abacus
- Reading
- Logical Reasoning

Subjects are centrally managed.

Users should select from active predefined subjects rather than creating arbitrary subject names in normal learning workflows.

---

## 6.2 Topic

Represents a learning area within a subject.

Examples:

Mathematics
→ Addition

Abacus
→ Addition

English
→ Reading

A topic belongs to one subject.

---

## 6.3 Skill

Represents a more specific capability within a topic.

Examples:

Mathematics
→ Addition
→ Single Digit Addition

Abacus
→ Addition
→ 5-Bead Combination

A skill belongs to one topic.

Skills allow progress to be tracked more precisely than subject or topic alone.

---

# 7. Learning Tracking Domain

## 7.1 Learning Session

Represents an actual learning activity that took place.

This is one of the most important domain entities.

A learning session belongs to:

Child
→ Subject
→ Topic
→ optionally Skill

It may contain:

- Learning date
- Duration
- What was taught
- Performance observation
- Accuracy
- Notes
- Related lesson plan
- Attachments

The learning session represents what actually happened.

---

## 7.2 Learning Performance

Represents an observation about how the child performed during a learning session.

Initial supported values may include:

- Excellent
- Good
- Needs Practice

Performance observations are not equivalent to quantitative measurements.

For example:

Performance:
Good

Accuracy:
8/10

The two values should remain separate.

---

## 7.3 Learning Accuracy

Represents a measurable result when accuracy is applicable.

Conceptually:

Correct Answers
/
Total Questions

Example:

# 8/10

80%

Accuracy should be represented in a way that allows consistent calculations and future analytics.

---

# 8. Lesson Planning Domain

## 8.1 Lesson Plan

Represents intended future learning.

A lesson plan belongs to a child and may reference:

- Subject
- Topic
- Skill
- Planned date
- Planned activity
- Planned duration
- Notes

A lesson plan represents what the user intends to teach.

It is different from a completed learning session.

---

## 8.2 Planned vs Actual Learning

The domain must distinguish:

Planned Learning
from
Actual Learning

Relationship:

Lesson Plan
→ may result in
Learning Session

A learning session may optionally reference the lesson plan from which it originated.

This allows future analysis of:

- Planned duration vs actual duration
- Planned topic vs actual topic
- Planned activity vs actual activity
- Planned vs completed lessons

---

# 9. Practice Domain

## 9.1 Practice Session

Represents an informal practice activity.

A practice session belongs to a child.

It may reference:

- Subject
- Topic
- Skill
- Practice set
- Questions
- Start time
- End time
- Duration
- Result

Practice is intended for repeated skill development and is distinct from formal assessment.

---

## 9.2 Practice Attempt

Represents the child's participation in a particular practice session.

A practice attempt may contain:

- Questions presented
- Answers submitted
- Correctness
- Time taken
- Attempts
- Score
- Accuracy

Depending on implementation, Practice Session and Practice Attempt may later be represented as separate data structures.

---

# 10. Question Bank Domain

## 10.1 Question

Represents reusable educational content.

A question may contain:

- Subject
- Topic
- Skill
- Age applicability
- Grade applicability
- Difficulty
- Question type
- Question text
- Options
- Correct answer
- Explanation
- Status
- Exam contexts

A question may be reused by multiple practice sessions and assessments.

---

## 10.2 Question Type

Represents how the question is answered.

Initial types may include:

- Multiple Choice
- True/False
- Numeric Answer
- Text Answer

Additional question types can be introduced later.

---

## 10.3 Question Difficulty

Represents the configured difficulty of a question.

Initial levels may include:

- Easy
- Medium
- Hard

The meaning and calibration of difficulty should be documented separately when the question bank becomes mature.

---

## 10.4 Question Set

Represents a reusable collection or selection of questions.

A question set may be associated with:

- Subject
- Topic
- Skill
- Difficulty
- Age/grade
- Exam context

A question set can be used to create practice activities or assessments.

---

# 11. Assessment Domain

## 11.1 Exam Type / Exam Context

Represents a preparation or examination context.

Examples may include:

- Olympiad Preparation
- International Assessment
- School Examination
- Skill Assessment

An exam context is not itself a test attempt.

It provides context for how assessments and questions may be organized.

---

## 11.2 Assessment

Represents a defined test configuration.

An assessment may contain:

- Name
- Description
- Subject
- Topics
- Skills
- Exam context
- Age/grade
- Difficulty
- Duration
- Number of questions
- Scoring configuration
- Status

The assessment defines what test should be conducted.

---

## 11.3 Assessment Attempt

Represents one child's attempt at an assessment.

Relationship:

Child
→ Assessment Attempt
→ Assessment

An attempt may contain:

- Start time
- End time
- Questions presented
- Answers
- Score
- Accuracy
- Completion status
- Time taken

Multiple attempts of the same assessment may exist.

---

## 11.4 Answer

Represents a response to a question during practice or assessment.

An answer may contain:

- Question reference
- Submitted answer
- Correct/incorrect status
- Time taken
- Attempt information

The exact representation may differ between practice and formal assessments if required.

---

## 11.5 Assessment Result

Represents evaluated assessment performance.

Possible information includes:

- Score
- Accuracy
- Correct count
- Incorrect count
- Unanswered count
- Time taken
- Topic performance
- Skill performance

Results should be based on actual attempt data.

---

# 12. Progress Domain

## 12.1 Progress

Represents calculated information about a child's learning activity and performance.

Progress is not necessarily entered manually by users.

It may be derived from:

Learning Sessions

- Practice Sessions
- Assessment Attempts

Possible dimensions:

- Learning time
- Learning frequency
- Practice activity
- Accuracy
- Assessment scores
- Subject performance
- Topic performance
- Skill performance
- Streaks

---

## 12.2 Subject Progress

Represents calculated progress for a child within a subject.

Example:

Child
→ Mathematics
→ Subject Progress

Possible metrics:

- Total learning time
- Number of learning sessions
- Practice activity
- Average accuracy
- Assessment performance

---

## 12.3 Topic Progress

Represents calculated progress for a specific topic.

Example:

Child
→ Mathematics
→ Addition
→ Topic Progress

Possible metrics:

- Learning activity
- Practice activity
- Accuracy
- Assessment performance
- Historical trend

---

## 12.4 Skill Progress

Represents more granular performance for a specific skill.

Example:

Child
→ Abacus
→ Addition
→ 5-Bead Combination
→ Skill Progress

This is intended for future mastery tracking.

---

## 12.5 Progress Trend

Represents how a metric changes over time.

Examples:

- Weekly learning time
- Monthly learning time
- Accuracy over time
- Assessment scores over time
- Practice activity over time

The system should distinguish actual historical measurements from derived interpretations.

---

# 13. Rewards Domain

## 13.1 Achievement

Represents a milestone earned by a child.

Examples:

- First Learning Session
- 7-Day Learning Streak
- 10 Completed Lessons
- 90% Assessment Accuracy
- 50 Completed Learning Sessions

Achievements are awarded based on configured rules.

---

## 13.2 Achievement Rule

Represents the condition required to earn an achievement.

Examples:

Learning session count >= 10

or

Learning streak >= 7 days

or

Assessment accuracy >= configured threshold

Achievement rules should be managed separately from individual UI components.

---

## 13.3 Learning Streak

Represents consecutive qualifying learning days.

Possible information:

- Current streak
- Longest streak
- Last qualifying date

The exact definition of a qualifying learning day must be specified before implementation.

---

## 13.4 Reward

Represents an optional reward associated with learning achievements.

Rewards may eventually support:

- Platform points
- Parent-defined rewards
- Milestone rewards

The initial MVP may implement achievements without a full reward marketplace or points economy.

---

# 14. Journal Domain

## 14.1 Journal Entry

Represents a learning memory, observation, or milestone captured by a parent or teacher.

A journal entry belongs to a child.

It may contain:

- Date
- Title
- Description
- Notes
- Related subject
- Related topic
- Attachments

Journal entries are less structured than learning sessions.

---

## 14.2 Attachment

Represents a reference to media associated with a learning session or journal entry.

Possible media:

- Image
- Video

The attachment domain should contain metadata and a storage reference rather than storing large media files directly in the application database where practical.

---

# 15. Administration Domain

## 15.1 Platform Configuration

Represents centrally managed information used by application workflows.

Examples:

- Subjects
- Topics
- Skills
- Question types
- Difficulty levels
- Exam contexts
- Achievement definitions

Administrators manage configuration according to their permissions.

---

# 16. Core Relationships

The main conceptual relationships are:

User
→ manages/teaches
→ Child

Child
→ has
→ Subjects

Subject
→ contains
→ Topics

Topic
→ contains
→ Skills

Child
→ has
→ Learning Sessions

Child
→ has
→ Lesson Plans

Lesson Plan
→ may produce
→ Learning Session

Child
→ has
→ Practice Sessions

Practice Session
→ uses
→ Questions

Child
→ has
→ Assessment Attempts

Assessment
→ uses
→ Questions

Assessment Attempt
→ contains
→ Answers

Learning + Practice + Assessment
→ contribute to
→ Progress

Learning + Practice + Assessment
→ may trigger
→ Achievements

Child
→ has
→ Journal Entries

Learning Session / Journal Entry
→ may have
→ Attachments

---

# 17. High-Level Domain Relationship

```text
                         USER
                          |
             +------------+------------+
             |                         |
          Parent                    Teacher
             |                         |
             |                         |
             +------------+------------+
                          |
                         CHILD
                          |
             +------------+------------+
             |            |            |
             v            v            v
          SUBJECT       LESSON       JOURNAL
             |           PLAN          |
             v             |            |
           TOPIC           v            v
             |         LEARNING      ATTACHMENT
             v          SESSION
           SKILL            |
                            |
                    +-------+-------+
                    |               |
                    v               v
                 PRACTICE       ASSESSMENT
                    |               |
                    v               v
                 QUESTIONS      ATTEMPT
                    |               |
                    +-------+-------+
                            |
                            v
                         ANSWERS
                            |
                            v
                         RESULTS
                            |
                            v
                        PROGRESS
                            |
                            v
                       ACHIEVEMENT
```

---

# 18. Important Domain Rules

## Rule 1 — Child is the central learner entity

Learning-related records must always be associated with a specific child.

---

## Rule 2 — Subjects are controlled

Normal users should select from system-managed subjects.

---

## Rule 3 — Topic belongs to Subject

A topic cannot exist independently of a subject.

---

## Rule 4 — Skill belongs to Topic

A skill cannot exist independently of a topic.

---

## Rule 5 — Planned and Actual Learning are different

A lesson plan represents intention.

A learning session represents actual activity.

---

## Rule 6 — Practice and Assessment are different

Practice supports repeated learning.

Assessment measures performance against a defined test.

---

## Rule 7 — Questions are reusable

Questions should not belong permanently to only one practice session or assessment.

---

## Rule 8 — Assessment Attempts are historical records

An attempt should preserve what happened during that specific test.

Later changes to an assessment definition must not incorrectly rewrite historical attempt results.

---

## Rule 9 — Progress is based on evidence

Progress metrics should be derived from recorded learning, practice, and assessment information.

The system should avoid creating conclusions when there is insufficient data.

---

## Rule 10 — Authorization follows relationships

Access to child data is based on relationships such as:

Parent → Child

or

Teacher → Assigned Student

The backend must verify authorization.

---

# 19. Domain Ownership

Conceptually:

## Parent owns/manages

- Child relationships
- Learning records created by the parent
- Lesson plans created by the parent
- Journal entries created by the parent

## Teacher manages

- Assigned students
- Learning records created by the teacher
- Lesson plans created by the teacher
- Assigned practice/assessment activity according to permissions

## Child participates in

- Practice
- Assessments
- Learning activities
- Achievements

## Admin manages

- Users where authorized
- Subjects
- Topics
- Skills
- Questions
- Assessments
- Exam contexts
- Achievement rules
- Platform configuration

---

# 20. Data Lifecycle Concept

A typical learning record may follow:

```text
Lesson Plan
    ↓
Learning Session
    ↓
Practice
    ↓
Assessment
    ↓
Result
    ↓
Progress
    ↓
Achievement
```

Not every lesson must go through every stage.

For example:

```text
Lesson Plan
    ↓
Learning Session
```

is valid.

Likewise:

```text
Practice
    ↓
Result
```

is valid without a formal assessment.

---

# 21. Initial Domain Entity List

The initial domain entities are:

### Identity

- User
- Role
- Parent-Child Relationship
- Teacher-Student Relationship

### Learning

- Child
- Subject
- Topic
- Skill
- Learning Session
- Learning Performance

### Planning

- Lesson Plan

### Practice

- Practice Session
- Practice Attempt

### Question Bank

- Question
- Question Type
- Question Difficulty
- Question Set

### Assessment

- Exam Context
- Assessment
- Assessment Attempt
- Answer
- Assessment Result

### Progress

- Progress
- Subject Progress
- Topic Progress
- Skill Progress
- Progress Trend

### Rewards

- Achievement
- Achievement Rule
- Learning Streak
- Reward

### Journal

- Journal Entry
- Attachment

---

# 22. Future Domain Extensions

The domain model may later expand to support:

- Learning paths
- Curriculum
- Courses
- Assignments
- Notifications
- Parent-teacher communication
- Subscriptions
- Payments
- AI-generated content
- AI recommendations
- Advanced analytics
- External exam integrations

These should be introduced only when required.

---

# 23. Domain Model Principles

The domain model should remain:

- Subject-agnostic
- Assessment-framework-agnostic
- Role-aware
- Child-centered
- Extensible
- Testable
- Independent of Angular UI implementation
- Independent of MongoDB-specific implementation details

---

# 24. Document Status

**Version:** 0.1  
**Status:** Draft

This domain model is the conceptual foundation for the database design, API design, Angular architecture, backend architecture, and future business rules.
