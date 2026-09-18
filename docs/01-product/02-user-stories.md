# User Stories

**Document:** Product User Stories  
**Version:** 0.1  
**Status:** Draft  
**Last Updated:** 2026-09-18

---

# 1. Story Format

Each user story follows:

> As a [user], I want [capability], so that [benefit].

Priority:

- P0 — Essential
- P1 — Important
- P2 — Future / Enhancement

---

# 2. Authentication

## US-AUTH-001 — Parent Registration

**Priority:** P0

As a parent, I want to create an account so that I can manage my children's learning.

### Acceptance Criteria

- Parent can open the registration page.
- Parent must provide required registration information.
- Invalid input is rejected.
- Duplicate account information is handled appropriately.
- Successful registration creates a parent account.
- User receives appropriate confirmation.
- Passwords must never be stored in plain text.

---

## US-AUTH-002 — Teacher Registration

**Priority:** P0

As a teacher, I want to create a teacher account so that I can manage assigned students.

### Acceptance Criteria

- Teacher can register.
- Required fields are validated.
- Account is created with TEACHER role.
- Teacher cannot access parent-only functionality unless explicitly permitted.

---

## US-AUTH-003 — Login

**Priority:** P0

As a registered user, I want to log in so that I can access the platform.

### Acceptance Criteria

- User can enter valid credentials.
- Invalid credentials are rejected.
- Successful authentication establishes an authenticated session.
- User is redirected to the appropriate dashboard.
- Role determines the initial application experience.

---

## US-AUTH-004 — Logout

**Priority:** P0

As a user, I want to log out so that my account remains protected.

### Acceptance Criteria

- User can log out.
- Authentication state is cleared securely.
- Protected pages cannot be accessed after logout.

---

## US-AUTH-005 — Password Reset

**Priority:** P1

As a user, I want to reset my password so that I can recover my account.

### Acceptance Criteria

- User can request password reset.
- Reset mechanism is time-limited and secure.
- User can create a new password.
- Previous password no longer works after successful reset.

---

# 3. Parent Profile

## US-PAR-001 — View Parent Profile

**Priority:** P1

As a parent, I want to view my profile so that I can verify my account information.

### Acceptance Criteria

- Parent can view profile information.
- Parent can edit permitted profile fields.
- Changes are persisted.

---

# 4. Child Management

## US-CHD-001 — Add Child

**Priority:** P0

As a parent, I want to add a child so that I can track that child's learning.

### Acceptance Criteria

- Parent can open Add Child.
- Child name is required.
- Date of birth is required.
- Grade/class can be provided.
- Optional profile information can be provided.
- Child is linked to the logged-in parent.
- Child appears in the parent's child list.

---

## US-CHD-002 — View Children

**Priority:** P0

As a parent, I want to see all my children so that I can select the child I want to work with.

### Acceptance Criteria

- All children belonging to the parent are displayed.
- No other parent's children are displayed.
- Each child has a clear identifier.
- Parent can select a child.

---

## US-CHD-003 — Switch Child

**Priority:** P0

As a parent, I want to switch between children so that I can manage each child's learning independently.

### Acceptance Criteria

- Parent can change the active child.
- Dashboard updates to the selected child.
- Learning, practice, assessment, progress, and rewards belong to the selected child.

---

## US-CHD-004 — Edit Child

**Priority:** P1

As a parent, I want to edit a child's profile so that their information remains current.

### Acceptance Criteria

- Parent can edit permitted child information.
- Changes are validated.
- Changes are persisted.

---

# 5. Teacher and Student Assignment

## US-TEA-001 — View Assigned Students

**Priority:** P0

As a teacher, I want to view students assigned to me so that I can manage their learning.

### Acceptance Criteria

- Teacher can view assigned students.
- Only authorized students are visible.
- Student information is separated correctly.

---

## US-TEA-002 — Assign Student to Teacher

**Priority:** P0

As an authorized administrator, I want to assign students to teachers so that teachers can manage the appropriate children.

### Acceptance Criteria

- Admin can select a teacher.
- Admin can select a student.
- Assignment is stored.
- Teacher can see the student after assignment.

---

## US-TEA-003 — Remove Student Assignment

**Priority:** P1

As an authorized administrator, I want to remove a student assignment so that teacher access remains accurate.

### Acceptance Criteria

- Admin can remove an assignment.
- Teacher no longer has access to the unassigned student where no other authorization exists.

---

# 6. Subject Management

## US-SUB-001 — View Subjects

**Priority:** P0

As a parent or teacher, I want to select from predefined subjects so that learning records remain structured.

### Acceptance Criteria

- User can view active subjects.
- Subjects are presented in a controlled selection.
- User cannot create arbitrary subject names through the standard learning-log flow.

---

## US-SUB-002 — Manage Subjects

**Priority:** P1

As an admin, I want to manage subjects so that the platform can support different learning areas.

### Acceptance Criteria

- Admin can create a subject.
- Admin can edit a subject.
- Admin can activate/deactivate a subject.
- Inactive subjects are not offered for new learning records.

---

# 7. Topic and Skill Management

## US-TOP-001 — Select Topic

**Priority:** P0

As a parent or teacher, I want to select a topic under a subject so that learning can be tracked accurately.

### Acceptance Criteria

- Topics are filtered according to the selected subject.
- Only active topics are shown.
- User can select a topic.

---

## US-TOP-002 — Manage Topics

**Priority:** P1

As an admin, I want to manage topics so that subjects have a structured learning path.

### Acceptance Criteria

- Admin can create topics.
- Admin can edit topics.
- Admin can activate/deactivate topics.
- Topics belong to a subject.

---

## US-TOP-003 — Manage Skills

**Priority:** P1

As an admin, I want to define skills under topics so that progress can be tracked at a finer level.

### Acceptance Criteria

- Skill belongs to a topic.
- Admin can create, update, activate, and deactivate skills.
- Skills can be used by learning and assessment features.

---

# 8. Daily Learning

## US-LEARN-001 — Log Learning Session

**Priority:** P0

As a parent or teacher, I want to log what I taught so that I can maintain a learning history.

### Acceptance Criteria

- User can select a child.
- User can select a subject.
- User can select a topic.
- User can provide the learning date.
- User can enter duration.
- User can enter what was taught.
- User can add optional performance information.
- User can add optional notes.
- User can save the session.
- Saved session appears in learning history.

---

## US-LEARN-002 — Record Learning Duration

**Priority:** P0

As a parent or teacher, I want to record teaching duration so that I can track learning time.

### Acceptance Criteria

- Duration can be entered.
- Duration must be validated.
- Duration is associated with the learning session.
- Duration contributes to learning-time analytics.

---

## US-LEARN-003 — Record Performance

**Priority:** P1

As a parent or teacher, I want to record a simple performance level so that I can capture my observation.

### Acceptance Criteria

- User can select a performance value.
- Performance is stored separately from quantitative metrics.
- Performance can be reviewed later.

---

## US-LEARN-004 — Record Accuracy

**Priority:** P0

As a parent or teacher, I want to record accuracy when applicable so that progress can be measured.

### Acceptance Criteria

- User can enter correct/total values or equivalent supported input.
- Invalid accuracy values are rejected.
- Accuracy is calculated consistently.
- Accuracy can contribute to progress analytics.

---

## US-LEARN-005 — Add Learning Notes

**Priority:** P0

As a parent or teacher, I want to add notes so that I can record observations that numbers cannot capture.

### Acceptance Criteria

- Notes are optional.
- Notes can be saved with the learning session.
- Notes can be viewed later.

---

## US-LEARN-006 — Attach Photo or Video

**Priority:** P1

As a parent or teacher, I want to attach media to a learning record so that I can maintain a visual learning journal.

### Acceptance Criteria

- User can select supported media.
- Invalid file types are rejected.
- File-size limits are enforced.
- Attachment is associated with the correct learning record.
- User can view supported attachments later.

---

# 9. Learning History

## US-HIST-001 — View Learning History

**Priority:** P0

As a parent or teacher, I want to view previous learning sessions so that I can understand what has already been taught.

### Acceptance Criteria

- Learning sessions are displayed chronologically.
- Child is clearly identified.
- Subject and topic are displayed.
- Duration is displayed.
- Performance/accuracy is displayed where available.

---

## US-HIST-002 — Filter Learning History

**Priority:** P1

As a parent or teacher, I want to filter learning history so that I can find specific learning records.

### Acceptance Criteria

- User can filter by child.
- User can filter by subject.
- User can filter by topic.
- User can filter by date range.
- Results update according to selected filters.

---

# 10. Lesson Planning

## US-PLAN-001 — Create Lesson Plan

**Priority:** P0

As a parent or teacher, I want to plan a future lesson so that I know what I intend to teach.

### Acceptance Criteria

- User can select child.
- User can select subject.
- User can select topic.
- User can specify planned date.
- User can enter planned activity.
- User can specify optional planned duration.
- User can save the plan.

---

## US-PLAN-002 — View Upcoming Lesson Plans

**Priority:** P0

As a parent or teacher, I want to see upcoming lesson plans so that I know what is planned next.

### Acceptance Criteria

- Upcoming plans are displayed.
- Plans are ordered by date.
- User can open a lesson plan for details.

---

## US-PLAN-003 — Mark Lesson Plan Completed

**Priority:** P1

As a parent or teacher, I want to relate a completed learning session to a planned lesson so that I can compare planned versus actual learning.

### Acceptance Criteria

- A lesson plan can be marked completed.
- The completed record can reference the actual learning session.
- Planned and actual information remain distinguishable.

---

# 11. Practice

## US-PRAC-001 — Start Practice

**Priority:** P0

As a child, I want to start a practice session so that I can improve a specific skill.

### Acceptance Criteria

- Practice set can be selected.
- Questions are displayed one at a time or according to the configured experience.
- Child can submit answers.
- Correct/incorrect state is recorded.

---

## US-PRAC-002 — Record Practice Performance

**Priority:** P0

As the system, I want to record practice results so that progress can be measured.

### Acceptance Criteria

- Each answer is stored.
- Correctness is stored.
- Topic and skill are associated with the question.
- Completion result is calculated.

---

## US-PRAC-003 — View Practice Result

**Priority:** P0

As a child or parent, I want to view practice results so that I can understand performance.

### Acceptance Criteria

- Score is displayed.
- Accuracy is displayed.
- Completed questions are counted correctly.
- Relevant weak areas can be surfaced later.

---

# 12. Question Bank

## US-Q-001 — Create Question

**Priority:** P0

As an admin, I want to create questions so that the platform has reusable assessment content.

### Acceptance Criteria

A question can contain:

- Subject
- Topic
- Skill
- Age/grade applicability
- Difficulty
- Question type
- Question text
- Answer options where applicable
- Correct answer
- Explanation where applicable

---

## US-Q-002 — Edit Question

**Priority:** P1

As an admin, I want to edit questions so that incorrect or outdated content can be corrected.

### Acceptance Criteria

- Admin can edit permitted question fields.
- Changes are validated.
- Updated question data is persisted.

---

## US-Q-003 — Filter Questions

**Priority:** P1

As an admin, I want to filter questions so that I can find suitable questions quickly.

### Acceptance Criteria

Questions can be filtered using supported metadata such as:

- Subject
- Topic
- Skill
- Difficulty
- Age
- Grade
- Exam type

---

# 13. Assessments and Mock Tests

## US-TEST-001 — Create Assessment

**Priority:** P0

As an admin, I want to create an assessment definition so that users can conduct structured tests.

### Acceptance Criteria

An assessment can define:

- Name
- Subject
- Topics
- Age/grade
- Difficulty
- Assessment type
- Duration
- Number of questions
- Scoring configuration

---

## US-TEST-002 — Start Mock Test

**Priority:** P0

As a child or parent, I want to start a mock test so that the child can practice for an assessment.

### Acceptance Criteria

- User can select an available mock test.
- Test instructions are shown.
- Timer is started when applicable.
- Configured questions are presented.
- Answers can be submitted.

---

## US-TEST-003 — Submit Mock Test

**Priority:** P0

As a child or parent, I want to submit a completed mock test so that the system can calculate my result.

### Acceptance Criteria

- Attempt is saved.
- Submitted answers are stored.
- Score is calculated.
- Accuracy is calculated.
- Time information is recorded where applicable.
- Result is available after evaluation.

---

## US-TEST-004 — View Test Result

**Priority:** P0

As a parent, teacher, or child, I want to view test results so that I can understand performance.

### Acceptance Criteria

- Score is displayed.
- Accuracy is displayed.
- Question count is displayed.
- Correct and incorrect counts are displayed.
- Test date is displayed.
- Relevant topic information can be reviewed.

---

## US-TEST-005 — View Test History

**Priority:** P1

As a parent, I want to view previous test attempts so that I can track performance over time.

### Acceptance Criteria

- Previous attempts are displayed.
- Attempts can be ordered by date.
- Score and accuracy are visible.
- User can open an attempt for details.

---

# 14. Exam Framework

## US-EXAM-001 — Manage Exam Types

**Priority:** P1

As an admin, I want to define exam types so that the same assessment engine can support different preparation goals.

### Acceptance Criteria

- Admin can create an exam type.
- Admin can edit an exam type.
- Exam type can be associated with assessments.
- Assessment types are not hard-coded to a single exam.

---

## US-EXAM-002 — Associate Questions With Exam Types

**Priority:** P1

As an admin, I want to associate questions with exam types so that appropriate questions can be used in preparation.

### Acceptance Criteria

- Question can be associated with one or more supported exam contexts.
- Questions can be filtered by exam type.
- Assessment generation can use exam metadata.

---

# 15. Progress

## US-PROG-001 — View Child Progress

**Priority:** P0

As a parent, I want to view my child's progress so that I understand their learning journey.

### Acceptance Criteria

Progress can include:

- Learning time
- Number of sessions
- Practice activity
- Accuracy
- Assessment results
- Subject-level information

---

## US-PROG-002 — View Subject Progress

**Priority:** P0

As a parent or teacher, I want to view progress by subject so that I can understand performance across learning areas.

### Acceptance Criteria

- Subjects are shown separately.
- Relevant learning and assessment metrics are calculated.
- User can open a subject to see more detail.

---

## US-PROG-003 — View Topic Progress

**Priority:** P1

As a parent or teacher, I want to view progress by topic so that I can identify areas requiring more practice.

### Acceptance Criteria

- Topic-level metrics are calculated from available data.
- Topics can be compared against the child's previous activity.
- Topics with insufficient data are clearly identified.

---

## US-PROG-004 — View Learning Trends

**Priority:** P1

As a parent, I want to see learning trends over time so that I can understand consistency and change.

### Acceptance Criteria

Supported trends may include:

- Learning time by week/month
- Practice activity
- Accuracy
- Assessment scores

---

# 16. Rewards and Achievements

## US-REWARD-001 — Earn Achievement

**Priority:** P1

As a child, I want to earn achievements when I reach learning milestones so that my progress is recognized.

### Acceptance Criteria

- Achievement rules are defined by the system.
- Achievement is awarded when its condition is met.
- Achievement belongs to a specific child.
- Achievement cannot be incorrectly duplicated unless explicitly configured.

---

## US-REWARD-002 — View Achievements

**Priority:** P1

As a child or parent, I want to view earned achievements so that I can see learning milestones.

### Acceptance Criteria

- Earned achievements are displayed.
- Achievement name and date are displayed.
- Unlocked and locked states can be supported.

---

## US-REWARD-003 — Learning Streak

**Priority:** P1

As a child, I want to maintain a learning streak so that consistent learning activity can be recognized.

### Acceptance Criteria

- Consecutive qualifying learning days are calculated.
- Current streak can be displayed.
- Longest streak can be tracked.

---

# 17. Journal

## US-JOURNAL-001 — Create Journal Entry

**Priority:** P1

As a parent, I want to record a learning journal entry so that I can capture important moments beyond structured metrics.

### Acceptance Criteria

- Parent can create an entry for a child.
- Entry supports text.
- Entry can optionally contain media.
- Entry includes creation date.
- Entry is associated with the correct child.

---

## US-JOURNAL-002 — View Learning Journal

**Priority:** P1

As a parent, I want to view my child's learning journal so that I can look back at learning milestones.

### Acceptance Criteria

- Entries are displayed chronologically.
- Text and supported media can be viewed.
- Entries are associated with the correct child.

---

# 18. Parent Dashboard

## US-DASH-001 — View Parent Dashboard

**Priority:** P0

As a parent, I want a dashboard showing important learning information so that I can understand what needs attention.

### Acceptance Criteria

Dashboard should provide access to relevant information such as:

- Today's learning
- Upcoming lesson plans
- Recent activity
- Subject progress
- Practice/test information
- Achievements

---

## US-DASH-002 — Quick Log Learning

**Priority:** P0

As a parent, I want a quick way to log today's learning so that recording a session does not interrupt teaching.

### Acceptance Criteria

- Quick action is easily accessible.
- Child can be selected quickly.
- Subject/topic can be selected quickly.
- Minimum required information can be entered quickly.
- Learning session can be saved without unnecessary navigation.

---

# 19. Teacher Dashboard

## US-TEADASH-001 — View Teacher Dashboard

**Priority:** P0

As a teacher, I want a dashboard showing my students and relevant activities so that I can manage my teaching workload.

### Acceptance Criteria

Dashboard provides access to:

- Assigned students
- Recent lessons
- Upcoming plans
- Pending assessments or practice
- Student progress

---

# 20. Admin

## US-ADMIN-001 — Manage Users

**Priority:** P1

As an admin, I want to manage platform users so that the system remains administratively controlled.

### Acceptance Criteria

- Admin can view users.
- Admin can view role information.
- Admin can activate/deactivate supported accounts where permitted.

---

## US-ADMIN-002 — Manage Subjects, Topics, and Skills

**Priority:** P0

As an admin, I want to manage the learning taxonomy so that the platform can evolve without code changes.

### Acceptance Criteria

- Admin can manage subjects.
- Admin can manage topics.
- Admin can manage skills.
- Relationships remain valid.

---

# 21. Authorization and Data Isolation

## US-SEC-001 — Parent Data Isolation

**Priority:** P0

As a parent, I want my children's data to remain private so that other users cannot access it.

### Acceptance Criteria

- Parent can access only authorized children.
- API authorization is enforced server-side.
- Client-side filtering alone is never relied upon for security.

---

## US-SEC-002 — Teacher Data Isolation

**Priority:** P0

As a teacher, I want to access only students assigned to me so that student information remains protected.

### Acceptance Criteria

- Teacher can access assigned students.
- Unauthorized students cannot be accessed through direct API calls.
- Authorization is validated on the backend.

---

# 22. Responsive Experience

## US-UX-001 — Mobile Responsive Experience

**Priority:** P0

As a parent, I want to use the application comfortably on a phone so that I can record learning while teaching.

### Acceptance Criteria

- Main workflows work on mobile screen sizes.
- Controls are touch-friendly.
- Text remains readable.
- Forms are usable without horizontal scrolling.

---

## US-UX-002 — Desktop Responsive Experience

**Priority:** P0

As a parent or teacher, I want to use the application on desktop so that I can review detailed information comfortably.

### Acceptance Criteria

- Main workflows work on desktop.
- Dashboards can use the available screen space effectively.
- Tables, filters, and charts are usable.

---

# 23. Future AI Stories

These are deliberately not V1 core requirements.

## US-AI-001 — Personalized Lesson Suggestion

**Priority:** P2

As a parent, I want the system to suggest what to teach next based on learning history so that planning becomes easier.

---

## US-AI-002 — Generate Practice Questions

**Priority:** P2

As a parent or teacher, I want AI-assisted practice-question generation so that I can create additional practice material.

---

## US-AI-003 — Generate Mock Test

**Priority:** P2

As a parent, I want AI-assisted mock-test generation based on subject, age, difficulty, and exam context so that I can create targeted tests.

---

## US-AI-004 — Identify Weak Areas

**Priority:** P2

As a parent or teacher, I want the platform to identify possible weak areas from recorded performance so that I can focus additional practice.

---

## US-AI-005 — Generate Progress Summary

**Priority:** P2

As a parent, I want an AI-assisted summary of my child's learning activity so that I can quickly understand recent progress.

---

# 24. V1 Story Priority Summary

## P0 — Core MVP

- Authentication
- Multiple children
- Child selection
- Teacher/student assignment
- Subjects
- Topics
- Daily learning logs
- Learning duration
- Accuracy
- Learning history
- Lesson planning
- Practice
- Question bank
- Mock tests
- Assessment results
- Child progress
- Parent dashboard
- Teacher dashboard
- Data isolation
- Mobile responsiveness
- Desktop responsiveness

## P1 — V1 Enhancements

- Password reset
- Parent profile
- Child editing
- Skills
- Media attachments
- History filters
- Planned vs actual lesson tracking
- Test history
- Topic progress
- Trends
- Achievements
- Streaks
- Journal
- Admin management

## P2 — Future

- AI lesson suggestions
- AI-generated practice
- AI-generated mock tests
- AI weak-area analysis
- AI progress summaries
- Advanced child experience

---

# 25. First V1 End-to-End Scenario

The first complete product workflow should support:

Parent Login
↓
Select Child
↓
Select Subject
↓
Select Topic
↓
Log Today's Learning
↓
Record Duration
↓
Record What Was Taught
↓
Save
↓
View Learning History
↓
Create Tomorrow's Lesson Plan
↓
Start Practice
↓
Take Mock Test
↓
View Result
↓
View Progress
↓
View Achievement
