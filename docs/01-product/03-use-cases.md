# Use Cases

**Document:** Product Use Cases  
**Version:** 0.1  
**Status:** Draft  
**Last Updated:** 2026-09-18

---

# 1. Purpose

This document describes the main user interactions and system workflows for the Child Learning & Progress Platform.

Use cases describe how users interact with the system to accomplish specific goals.

---

# 2. Actors

## 2.1 Parent

A parent manages one or more children and their learning activities.

## 2.2 Teacher

A teacher manages assigned students and records learning and assessment activity.

## 2.3 Child

A child participates in practice and assessments.

## 2.4 Admin

An administrator manages platform configuration and users.

## 2.5 System

The platform itself performs validation, calculations, authorization, progress updates, achievement evaluation, and other automated operations.

---

# 3. Authentication Use Cases

## UC-AUTH-001 — Register Parent

**Primary Actor:** Parent

### Goal

Create a parent account.

### Preconditions

- User is not authenticated.
- Registration service is available.

### Main Flow

1. Parent opens registration.
2. Parent enters required information.
3. System validates the information.
4. System checks whether the account already exists.
5. System securely creates the account.
6. System assigns the PARENT role.
7. System confirms successful registration.

### Alternative Flows

- Invalid information → system displays validation errors.
- Existing account → system informs the user.
- Server failure → system displays an appropriate error.

### Postconditions

A valid parent account exists.

---

## UC-AUTH-002 — Register Teacher

**Primary Actor:** Teacher

### Goal

Create a teacher account.

### Main Flow

1. Teacher opens registration.
2. Teacher enters required information.
3. System validates the information.
4. System creates the account.
5. System assigns the TEACHER role.
6. System confirms registration.

### Postconditions

A valid teacher account exists.

---

## UC-AUTH-003 — Login

**Primary Actor:** Parent / Teacher / Admin

### Goal

Access the platform securely.

### Main Flow

1. User opens login.
2. User enters credentials.
3. System validates credentials.
4. System establishes authenticated access.
5. System determines the user's role.
6. System directs the user to the appropriate application area.

### Alternative Flows

- Invalid credentials → login fails.
- Account unavailable → access is denied.
- Authentication service failure → appropriate error is shown.

---

## UC-AUTH-004 — Logout

**Primary Actor:** Parent / Teacher / Admin

### Goal

End the authenticated session.

### Main Flow

1. User selects Logout.
2. System clears the authenticated session.
3. System redirects user to the appropriate public screen.

### Postconditions

Protected resources are no longer accessible through the user's session.

---

# 4. Child Management Use Cases

## UC-CHILD-001 — Add Child

**Primary Actor:** Parent

### Goal

Create a child profile.

### Main Flow

1. Parent opens Children.
2. Parent selects Add Child.
3. Parent enters child information.
4. Parent submits the form.
5. System validates the information.
6. System creates the child.
7. System establishes the parent-child relationship.
8. System displays the newly added child.

### Postconditions

The child belongs to the authenticated parent.

---

## UC-CHILD-002 — View Children

**Primary Actor:** Parent

### Goal

See all children managed by the parent.

### Main Flow

1. Parent opens Children.
2. System retrieves authorized children.
3. System displays the children.
4. Parent selects a child when required.

### Security Requirement

Only children authorized for the parent may be returned.

---

## UC-CHILD-003 — Switch Active Child

**Primary Actor:** Parent

### Goal

Work with a different child without logging out.

### Main Flow

1. Parent opens the child selector.
2. System displays authorized children.
3. Parent selects another child.
4. System changes the active child context.
5. Dashboard and child-related screens update to the selected child.

---

## UC-CHILD-004 — Edit Child

**Primary Actor:** Parent

### Goal

Update child profile information.

### Main Flow

1. Parent opens a child profile.
2. Parent selects Edit.
3. Parent changes permitted information.
4. System validates changes.
5. System saves updates.
6. System displays updated information.

---

# 5. Teacher and Student Use Cases

## UC-TEACHER-001 — View Assigned Students

**Primary Actor:** Teacher

### Goal

View students assigned to the teacher.

### Main Flow

1. Teacher opens Students.
2. System identifies the teacher.
3. System retrieves authorized assignments.
4. System displays assigned students.

### Security Requirement

The teacher must not gain access to unrelated students.

---

## UC-TEACHER-002 — Assign Student

**Primary Actor:** Admin

### Goal

Assign a child/student to a teacher.

### Main Flow

1. Admin opens teacher management.
2. Admin selects a teacher.
3. Admin selects a student.
4. Admin creates the assignment.
5. System stores the relationship.
6. Teacher can subsequently access the assigned student.

---

## UC-TEACHER-003 — Remove Student Assignment

**Primary Actor:** Admin

### Goal

Remove an existing teacher-student relationship.

### Main Flow

1. Admin opens the assignment.
2. Admin selects Remove.
3. System validates authorization.
4. System removes the assignment.
5. Teacher's access is updated.

---

# 6. Subject and Topic Use Cases

## UC-SUBJECT-001 — Select Subject

**Primary Actor:** Parent / Teacher

### Goal

Select a valid subject when recording learning or activity.

### Main Flow

1. User opens a learning-related form.
2. System displays active subjects.
3. User selects a subject.
4. System uses the selected subject for subsequent topic selection.

---

## UC-SUBJECT-002 — Manage Subject

**Primary Actor:** Admin

### Goal

Create or maintain platform subjects.

### Main Flow

1. Admin opens Subject Management.
2. Admin selects Add/Edit Subject.
3. Admin enters or updates subject information.
4. System validates the data.
5. System saves the subject.
6. Subject becomes available according to its active status.

---

## UC-TOPIC-001 — Select Topic

**Primary Actor:** Parent / Teacher

### Goal

Select a topic belonging to a subject.

### Main Flow

1. User selects a subject.
2. System retrieves active topics belonging to that subject.
3. System displays those topics.
4. User selects a topic.

---

## UC-TOPIC-002 — Manage Topic

**Primary Actor:** Admin

### Goal

Create or maintain topics.

### Main Flow

1. Admin opens Topic Management.
2. Admin selects a subject.
3. Admin creates or edits a topic.
4. System validates the topic.
5. System saves the topic.

---

## UC-SKILL-001 — Manage Skill

**Primary Actor:** Admin

### Goal

Define a skill under a topic.

### Main Flow

1. Admin selects a subject.
2. Admin selects a topic.
3. Admin creates or edits a skill.
4. System validates the relationship.
5. System saves the skill.

---

# 7. Daily Learning Use Cases

## UC-LEARN-001 — Log Learning Session

**Primary Actor:** Parent / Teacher

### Goal

Record what was taught during a learning session.

### Main Flow

1. User selects a child.
2. User selects a subject.
3. System displays related topics.
4. User selects a topic.
5. User enters the learning date.
6. User enters the duration.
7. User enters what was taught.
8. User optionally records performance.
9. User optionally records accuracy.
10. User optionally adds notes.
11. User optionally attaches media.
12. User submits the learning record.
13. System validates the data.
14. System stores the learning session.
15. System updates relevant learning statistics.
16. System confirms successful save.

### Alternative Flows

- Missing required information → validation message.
- Invalid duration → validation message.
- Invalid accuracy → validation message.
- Unauthorized child → request rejected.
- Media validation failure → attachment rejected while other form behavior remains clear.

### Postconditions

A learning session is stored and associated with the correct child.

---

## UC-LEARN-002 — View Learning History

**Primary Actor:** Parent / Teacher

### Goal

Review previously recorded learning.

### Main Flow

1. User opens Learning History.
2. System retrieves authorized records.
3. System orders records according to the selected sort.
4. System displays learning sessions.
5. User can open an individual session.

---

## UC-LEARN-003 — Filter Learning History

**Primary Actor:** Parent / Teacher

### Goal

Find specific learning records.

### Main Flow

1. User opens Learning History.
2. User selects filters.
3. System validates filter values.
4. System retrieves matching records.
5. System displays filtered results.

Supported filters:

- Child
- Subject
- Topic
- Date range

---

# 8. Lesson Planning Use Cases

## UC-PLAN-001 — Create Lesson Plan

**Primary Actor:** Parent / Teacher

### Goal

Plan a future lesson.

### Main Flow

1. User selects a child.
2. User selects a future date.
3. User selects a subject.
4. User selects a topic.
5. User enters planned activity.
6. User optionally enters planned duration.
7. User adds optional notes.
8. User saves the plan.
9. System stores the lesson plan.

---

## UC-PLAN-002 — View Upcoming Plans

**Primary Actor:** Parent / Teacher

### Goal

See future planned learning.

### Main Flow

1. User opens Lesson Plans.
2. System retrieves upcoming authorized plans.
3. System orders plans by date.
4. System displays the plans.

---

## UC-PLAN-003 — Relate Completed Lesson to Plan

**Primary Actor:** Parent / Teacher

### Goal

Connect an actual learning session with a previous plan.

### Main Flow

1. User opens an upcoming lesson plan.
2. User completes the planned activity.
3. User records the actual learning session.
4. System allows the actual session to reference the original plan.
5. User marks the plan completed.
6. System preserves both planned and actual information.

---

# 9. Practice Use Cases

## UC-PRACTICE-001 — Start Practice Session

**Primary Actor:** Child / Parent

### Goal

Start a practice session.

### Main Flow

1. User selects Practice.
2. User selects child where applicable.
3. User selects subject/topic or a predefined practice set.
4. System creates a practice session.
5. System presents questions.
6. User answers questions.
7. System evaluates each answer.
8. System records the result.

---

## UC-PRACTICE-002 — Complete Practice Session

**Primary Actor:** Child / Parent

### Goal

Finish a practice activity.

### Main Flow

1. User answers all required questions.
2. User submits the session.
3. System calculates results.
4. System stores the practice attempt.
5. System displays the result.

Possible result information:

- Total questions
- Correct answers
- Incorrect answers
- Accuracy
- Time taken

---

## UC-PRACTICE-003 — Review Practice Result

**Primary Actor:** Child / Parent / Teacher

### Goal

Understand practice performance.

### Main Flow

1. User opens the completed practice session.
2. System loads the result.
3. System displays score and accuracy.
4. System provides supported question-level information.
5. User can review areas that require additional practice.

---

# 10. Question Bank Use Cases

## UC-QUESTION-001 — Create Question

**Primary Actor:** Admin

### Goal

Create reusable question-bank content.

### Main Flow

1. Admin opens Question Bank.
2. Admin selects Create Question.
3. Admin selects subject.
4. Admin selects topic.
5. Admin optionally selects skill.
6. Admin sets age/grade applicability.
7. Admin selects difficulty.
8. Admin enters question content.
9. Admin enters answer information.
10. Admin optionally enters explanation.
11. System validates the question.
12. System saves the question.

---

## UC-QUESTION-002 — Edit Question

**Primary Actor:** Admin

### Goal

Correct or improve existing question content.

### Main Flow

1. Admin searches for a question.
2. Admin opens the question.
3. Admin edits permitted fields.
4. System validates changes.
5. System saves the updated question.

---

## UC-QUESTION-003 — Filter Question Bank

**Primary Actor:** Admin

### Goal

Find appropriate questions.

### Main Flow

1. Admin opens Question Bank.
2. Admin selects supported filters.
3. System retrieves matching questions.
4. System displays results.

Possible filters:

- Subject
- Topic
- Skill
- Difficulty
- Age
- Grade
- Exam type

---

# 11. Assessment Use Cases

## UC-ASSESS-001 — Create Assessment

**Primary Actor:** Admin

### Goal

Create a configurable assessment.

### Main Flow

1. Admin opens Assessment Management.
2. Admin selects Create Assessment.
3. Admin defines assessment metadata.
4. Admin selects subject/topics.
5. Admin defines difficulty.
6. Admin defines age/grade.
7. Admin defines duration.
8. Admin defines question count.
9. Admin defines scoring configuration.
10. Admin saves the assessment.

---

## UC-ASSESS-002 — Start Mock Test

**Primary Actor:** Child / Parent

### Goal

Start a mock examination.

### Main Flow

1. User opens Mock Tests.
2. User selects an available assessment.
3. System displays instructions.
4. User starts the test.
5. System creates an assessment attempt.
6. Timer starts when the assessment is timed.
7. System presents the configured questions.
8. User submits answers.

### Alternative Flows

- User exits before completion → system handles according to the assessment's resume/termination rules.
- Timer expires → system submits according to configured behavior.

---

## UC-ASSESS-003 — Submit Assessment

**Primary Actor:** Child / Parent

### Goal

Submit an assessment for evaluation.

### Main Flow

1. User submits the assessment.
2. System validates the attempt.
3. System evaluates supported question types.
4. System calculates the result.
5. System stores the attempt.
6. System updates relevant assessment statistics.
7. System displays the result.

---

## UC-ASSESS-004 — View Assessment Result

**Primary Actor:** Parent / Teacher / Child

### Goal

Review assessment performance.

### Main Flow

1. User opens an assessment result.
2. System retrieves the authorized attempt.
3. System displays:
   - Score
   - Accuracy
   - Correct answers
   - Incorrect answers
   - Question count
   - Date
   - Duration/time information where applicable
4. User can review available question-level details.

---

## UC-ASSESS-005 — View Assessment History

**Primary Actor:** Parent / Teacher

### Goal

Compare historical assessment performance.

### Main Flow

1. User opens Assessment History.
2. System retrieves authorized assessment attempts.
3. System orders attempts by date.
4. System displays historical results.
5. User opens individual attempts for more detail.

---

# 12. Exam Framework Use Cases

## UC-EXAM-001 — Create Exam Type

**Primary Actor:** Admin

### Goal

Create a reusable exam or preparation context.

### Main Flow

1. Admin opens Exam Management.
2. Admin creates an exam type.
3. Admin enters the exam name and relevant metadata.
4. System validates the data.
5. System saves the exam type.

Examples may include:

- Olympiad Preparation
- International Assessment
- School Examination
- Skill Assessment

The exact exam frameworks will be configured separately.

---

## UC-EXAM-002 — Associate Questions With Exam Type

**Primary Actor:** Admin

### Goal

Allow assessments to use exam-relevant questions.

### Main Flow

1. Admin opens a question.
2. Admin selects supported exam contexts.
3. System validates the association.
4. System saves the association.

---

# 13. Progress Use Cases

## UC-PROGRESS-001 — View Child Progress

**Primary Actor:** Parent / Teacher

### Goal

Understand a child's overall learning activity.

### Main Flow

1. User selects a child.
2. User opens Progress.
3. System aggregates authorized learning, practice, and assessment data.
4. System calculates supported metrics.
5. System displays the results.

Possible metrics:

- Total learning time
- Number of learning sessions
- Practice activity
- Average accuracy
- Assessment performance
- Learning streak

---

## UC-PROGRESS-002 — View Subject Progress

**Primary Actor:** Parent / Teacher

### Goal

Understand progress within a subject.

### Main Flow

1. User selects a child.
2. User selects a subject.
3. System retrieves relevant learning and assessment information.
4. System calculates supported subject-level metrics.
5. System displays results.

---

## UC-PROGRESS-003 — View Topic Progress

**Primary Actor:** Parent / Teacher

### Goal

Understand performance at topic level.

### Main Flow

1. User selects a subject.
2. User selects a topic.
3. System retrieves relevant activity.
4. System calculates supported topic-level metrics.
5. System displays the information.
6. System identifies topics with sufficient evidence for meaningful analysis.

---

## UC-PROGRESS-004 — View Learning Trends

**Primary Actor:** Parent / Teacher

### Goal

Understand changes over time.

### Main Flow

1. User opens Trends.
2. User selects a time period.
3. System aggregates learning activity.
4. System calculates supported trend data.
5. System displays charts or summaries.

Possible trends:

- Learning time
- Practice activity
- Accuracy
- Assessment scores

---

# 14. Rewards Use Cases

## UC-REWARD-001 — Evaluate Achievement

**Primary Actor:** System

### Goal

Determine whether a child has reached an achievement condition.

### Main Flow

1. A qualifying learning activity or assessment is completed.
2. System evaluates configured achievement rules.
3. System determines whether a new achievement has been earned.
4. System creates the achievement record if conditions are met.
5. System makes the achievement available to the child and authorized parent/teacher views.

---

## UC-REWARD-002 — View Achievements

**Primary Actor:** Child / Parent / Teacher

### Goal

Review earned achievements.

### Main Flow

1. User opens Achievements.
2. System retrieves authorized achievement records.
3. System displays earned achievements.
4. User can view achievement details.

---

## UC-REWARD-003 — Calculate Learning Streak

**Primary Actor:** System

### Goal

Calculate consecutive qualifying learning days.

### Main Flow

1. A learning activity is recorded.
2. System evaluates qualifying activity for consecutive dates.
3. System calculates the current streak.
4. System updates the child's streak information.
5. Eligible achievements may be awarded.

---

# 15. Journal Use Cases

## UC-JOURNAL-001 — Create Journal Entry

**Primary Actor:** Parent

### Goal

Capture an important learning moment.

### Main Flow

1. Parent selects a child.
2. Parent opens the Journal.
3. Parent creates an entry.
4. Parent enters notes or a description.
5. Parent optionally attaches media.
6. Parent saves the entry.
7. System associates the entry with the selected child.

---

## UC-JOURNAL-002 — View Journal

**Primary Actor:** Parent

### Goal

Review a child's learning memories.

### Main Flow

1. Parent opens Journal.
2. System retrieves entries for the selected child.
3. Entries are displayed chronologically.
4. Parent can open individual entries.

---

# 16. Dashboard Use Cases

## UC-DASH-001 — View Parent Dashboard

**Primary Actor:** Parent

### Goal

Quickly understand current learning activity.

### Main Flow

1. Parent logs in.
2. System identifies the active child or prompts for child selection.
3. System retrieves relevant current data.
4. Dashboard displays:
   - Today's learning
   - Upcoming plans
   - Recent activity
   - Progress
   - Practice/test information
   - Achievements

---

## UC-DASH-002 — Quick Log Learning

**Primary Actor:** Parent

### Goal

Record learning with minimal interaction while teaching.

### Main Flow

1. Parent opens Quick Log.
2. Parent selects child.
3. Parent selects subject.
4. Parent selects topic.
5. Parent enters minimum required information.
6. Parent saves the session.
7. System stores the session.
8. System confirms completion.

### UX Requirement

The workflow should be optimized for phone usage and should minimize unnecessary fields and navigation.

---

# 17. Teacher Dashboard Use Cases

## UC-TEADASH-001 — View Teacher Dashboard

**Primary Actor:** Teacher

### Goal

Quickly understand teaching activity.

### Main Flow

1. Teacher logs in.
2. System identifies assigned students.
3. System retrieves relevant activity.
4. Dashboard displays:
   - Assigned students
   - Recent learning
   - Upcoming plans
   - Practice/assessment activity
   - Progress information

---

# 18. Admin Use Cases

## UC-ADMIN-001 — Manage Users

**Primary Actor:** Admin

### Goal

Manage platform accounts.

### Main Flow

1. Admin opens User Management.
2. System displays authorized user information.
3. Admin searches or filters users.
4. Admin opens a user.
5. Admin performs an allowed administrative action.
6. System validates authorization.
7. System persists the change.

---

## UC-ADMIN-002 — Manage Learning Taxonomy

**Primary Actor:** Admin

### Goal

Maintain subjects, topics, and skills.

### Main Flow

1. Admin opens Learning Taxonomy.
2. Admin selects Subject, Topic, or Skill.
3. Admin creates or edits an item.
4. System validates relationships.
5. System saves the item.
6. Updated active data becomes available to appropriate application workflows.

---

# 19. Security Use Cases

## UC-SEC-001 — Prevent Unauthorized Child Access

**Primary Actor:** System

### Goal

Prevent users from accessing children they are not authorized to manage.

### Main Flow

1. User requests child-related data.
2. System authenticates the user.
3. System determines the user's permissions.
4. System verifies the parent-child or teacher-student relationship.
5. If authorized, system returns data.
6. Otherwise, system rejects the request.

### Important Requirement

Authorization must be enforced on the backend.

---

## UC-SEC-002 — Prevent Unauthorized Learning Access

**Primary Actor:** System

### Goal

Prevent unauthorized access to learning records.

### Main Flow

1. User requests a learning record.
2. System authenticates the user.
3. System determines the relevant child.
4. System verifies authorization.
5. System returns the record only when authorized.

---

# 20. Media Upload Use Case

## UC-MEDIA-001 — Upload Learning Media

**Primary Actor:** Parent / Teacher

### Goal

Attach an image or video to a learning record or journal entry.

### Main Flow

1. User selects an attachment.
2. System checks file type.
3. System checks file size.
4. System uploads the file to the configured storage service.
5. System receives the stored media reference.
6. System associates the reference with the learning record or journal entry.
7. System confirms the upload.

### Alternative Flows

- Unsupported file type → upload rejected.
- File exceeds size limit → upload rejected.
- Storage failure → appropriate error displayed.

---

# 21. Cross-Feature System Behavior

## UC-SYSTEM-001 — Update Progress After Learning Session

**Primary Actor:** System

### Goal

Ensure learning metrics reflect newly recorded activity.

### Main Flow

1. Learning session is successfully saved.
2. System updates relevant aggregates or makes the data available for calculation.
3. Progress queries use the latest valid data.
4. Dashboard and progress views reflect the new activity according to the application's consistency model.

---

## UC-SYSTEM-002 — Update Progress After Assessment

**Primary Actor:** System

### Goal

Reflect completed assessment activity in progress information.

### Main Flow

1. Assessment attempt is successfully submitted.
2. System evaluates the attempt.
3. Result is stored.
4. Relevant progress calculations become available.
5. Achievement rules may be evaluated.

---

## UC-SYSTEM-003 — Evaluate Achievement After Activity

**Primary Actor:** System

### Goal

Determine whether learning activity satisfies achievement rules.

### Main Flow

1. Qualifying activity is completed.
2. System evaluates applicable rules.
3. Eligible achievement is awarded.
4. Achievement becomes visible to authorized users.

---

# 22. Primary End-to-End Parent Journey

## UC-E2E-001 — Record and Track a Learning Session

**Primary Actor:** Parent

### Main Flow

1. Parent logs in.
2. Parent selects a child.
3. Parent opens Quick Log.
4. Parent selects Abacus.
5. Parent selects the appropriate topic.
6. Parent records what was taught.
7. Parent records learning duration.
8. Parent optionally records accuracy.
9. Parent saves the learning session.
10. System stores the record.
11. System updates relevant progress information.
12. System evaluates applicable achievements.
13. Parent returns to the dashboard.
14. Updated learning activity is visible.

---

# 23. Primary End-to-End Assessment Journey

## UC-E2E-002 — Complete a Mock Test

**Primary Actor:** Child / Parent

### Main Flow

1. User selects a child.
2. User opens Mock Tests.
3. User selects an assessment.
4. System displays instructions.
5. User starts the test.
6. System creates an attempt.
7. User answers questions.
8. System records answers.
9. User submits the test.
10. System evaluates answers.
11. System calculates score and accuracy.
12. System stores the result.
13. System evaluates relevant achievements.
14. User views the result.
15. Result becomes available for progress analysis.

---

# 24. Primary End-to-End Teacher Journey

## UC-E2E-003 — Teacher Records Student Learning

**Primary Actor:** Teacher

### Main Flow

1. Teacher logs in.
2. Teacher opens assigned students.
3. Teacher selects a student.
4. Teacher opens Log Learning.
5. Teacher selects subject and topic.
6. Teacher records what was taught.
7. Teacher records duration and optional performance data.
8. Teacher saves the learning session.
9. System verifies teacher authorization.
10. System stores the learning record.
11. Record becomes available in the student's authorized learning history.

---

# 25. Future AI Use Cases

These are future capabilities and are not required for the initial MVP.

## UC-AI-001 — Suggest Next Lesson

The system analyzes historical learning information and suggests possible next learning activities.

## UC-AI-002 — Generate Practice

The system generates practice questions using structured inputs such as:

- Subject
- Topic
- Skill
- Age
- Grade
- Difficulty

Generated content should be validated before being presented as educational material.

## UC-AI-003 — Generate Mock Test

The system creates a test according to configured criteria.

## UC-AI-004 — Identify Possible Weak Areas

The system analyzes available learning and assessment data and identifies areas that may require additional practice.

## UC-AI-005 — Generate Progress Summary

The system creates a human-readable summary of recent learning activity and assessment results.

---

# 26. Key End-to-End Product Workflow

The platform's central workflow is:

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
RESULT
↓
PROGRESS
↓
ACHIEVEMENT
↓
PLAN NEXT

This workflow is the foundation of the product.
