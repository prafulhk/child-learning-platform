# User Flows

**Version:** 0.1  
**Status:** Draft  
**Last Updated:** 2026-09-18

---

# 1. Purpose

This document defines the key user journeys in the Child Learning & Progress Platform.

A user flow describes the sequence of actions a user takes to complete an important task.

The flows focus on the most important V1 journeys.

---

# 2. Parent Registration and Login

## Flow: Parent Creates an Account

1. Parent opens the platform.
2. Parent selects Register.
3. Parent selects Parent account if required.
4. Parent enters required account information.
5. System validates the information.
6. Parent submits registration.
7. System creates the account.
8. System assigns the PARENT role.
9. System confirms successful registration.
10. Parent can log in.

---

## Flow: Parent Login

1. Parent opens Login.
2. Parent enters credentials.
3. System validates the credentials.
4. System authenticates the parent.
5. System determines the parent role.
6. System opens the Parent Dashboard.

---

# 3. Parent Adds a Child

## Flow: Add Child

1. Parent opens the Children section.
2. Parent selects Add Child.
3. Parent enters child information.
4. Parent submits the form.
5. System validates the information.
6. System creates the child profile.
7. System creates the parent-child relationship.
8. System displays the new child.
9. Parent can select the child.

---

# 4. Parent Selects a Child

## Flow: Switch Active Child

1. Parent opens the child selector.
2. System displays the parent's authorized children.
3. Parent selects a child.
4. System changes the active child.
5. Child-specific information is refreshed.
6. The parent can now work with the selected child.

The selected child context applies to:

- Learning
- Lesson Plans
- Practice
- Tests
- Progress
- Rewards
- Journal

---

# 5. Parent Logs Today's Learning

## Flow: Quick Learning Log

This is the most important V1 workflow.

1. Parent opens the Parent Dashboard.
2. Parent selects Log Learning.
3. System identifies or asks for the active child.
4. Parent selects a subject.
5. System displays relevant topics.
6. Parent selects a topic.
7. Parent enters what was taught.
8. Parent enters the learning duration.
9. Parent optionally enters performance.
10. Parent optionally enters accuracy.
11. Parent optionally adds notes.
12. Parent optionally adds a photo or video.
13. Parent selects Save.
14. System validates the information.
15. System stores the learning session.
16. System updates relevant learning information.
17. System evaluates applicable achievements.
18. System confirms that the learning session was saved.
19. Parent returns to the dashboard or learning history.

### Primary UX Requirement

The parent should be able to complete this workflow quickly while teaching the child.

The form should avoid unnecessary fields and navigation.

---

# 6. Parent Views Learning History

## Flow: Review Previous Learning

1. Parent opens Learning History.
2. System retrieves learning sessions for the selected child.
3. System displays recent learning sessions.
4. Parent can open a learning record.
5. Parent reviews:
   - Subject
   - Topic
   - Date
   - Duration
   - What was taught
   - Performance
   - Accuracy
   - Notes
   - Attachments

---

# 7. Parent Creates Tomorrow's Lesson Plan

## Flow: Plan Next Lesson

1. Parent opens Lesson Plans.
2. Parent selects Create Plan.
3. Parent selects the child.
4. Parent selects the planned date.
5. Parent selects the subject.
6. System displays related topics.
7. Parent selects the topic.
8. Parent enters the planned activity.
9. Parent optionally enters planned duration.
10. Parent optionally adds notes.
11. Parent saves the plan.
12. System stores the lesson plan.
13. The plan appears in Upcoming Plans.

---

# 8. Parent Completes a Planned Lesson

## Flow: Planned Lesson to Actual Learning

1. Parent opens Upcoming Plans.
2. Parent selects a planned lesson.
3. Parent teaches the planned activity.
4. Parent opens Log Learning.
5. Parent records the actual learning session.
6. Parent optionally links the session to the planned lesson.
7. Parent saves the learning session.
8. Parent marks the plan as completed.
9. System preserves both the planned information and actual learning information.

This allows future comparison between planned and actual learning.

---

# 9. Parent Starts Practice

## Flow: Start Practice Session

1. Parent opens Practice.
2. Parent selects the child.
3. Parent selects a practice activity or configures a practice session.
4. Parent selects the subject.
5. Parent selects the topic or skill.
6. Parent selects difficulty where applicable.
7. Parent selects the number of questions.
8. System creates the practice session.
9. Questions are presented.
10. Child answers the questions.
11. System evaluates answers.
12. System records the responses.
13. Practice is completed.
14. System calculates the result.
15. Result is displayed.

---

# 10. Parent or Child Reviews Practice Result

## Flow: Review Practice

1. Practice session is completed.
2. System calculates the result.
3. User sees the score.
4. User sees accuracy.
5. User sees correct and incorrect answers.
6. User sees time information where applicable.
7. Relevant topic or skill performance is available.
8. Practice information becomes available for progress analysis.

---

# 11. Parent Starts a Mock Test

## Flow: Start Mock Test

1. Parent opens Tests.
2. Parent selects an available assessment.
3. System displays:
   - Test name
   - Subject
   - Exam type
   - Difficulty
   - Number of questions
   - Duration
   - Instructions
4. Parent reviews the test information.
5. Parent selects Start Test.
6. System creates an assessment attempt.
7. Timer starts if the test is timed.
8. Questions are presented.
9. Child answers the questions.
10. System records answers.
11. Parent or child submits the test.

---

# 12. System Evaluates a Mock Test

## Flow: Calculate Test Result

1. Test is submitted.
2. System validates the attempt.
3. System evaluates supported question types.
4. System calculates the score.
5. System calculates accuracy.
6. System calculates correct and incorrect counts.
7. System records time information where applicable.
8. System stores the assessment result.
9. System evaluates applicable achievements.
10. Result becomes available to authorized users.

---

# 13. Parent Reviews Test Result

## Flow: Review Assessment Result

1. Parent opens the completed test.
2. System retrieves the result.
3. Parent sees the score.
4. Parent sees accuracy.
5. Parent sees correct and incorrect counts.
6. Parent sees the test date.
7. Parent sees time information where applicable.
8. Parent can review topic-level performance where supported.
9. Parent can return to test history or progress.

---

# 14. Parent Reviews Child Progress

## Flow: View Progress

1. Parent selects a child.
2. Parent opens Progress.
3. System retrieves authorized learning data.
4. System retrieves relevant practice data.
5. System retrieves relevant assessment data.
6. System calculates supported metrics.
7. System displays overall progress.
8. Parent can view subject-level progress.
9. Parent can view topic-level progress.
10. Parent can view learning trends.

Possible information includes:

- Learning time
- Learning sessions
- Practice activity
- Accuracy
- Assessment results
- Streaks
- Achievements

---

# 15. Parent Reviews Subject Progress

## Flow: View Subject Progress

1. Parent opens Progress.
2. Parent selects a subject.
3. System retrieves learning activity for the subject.
4. System retrieves practice activity.
5. System retrieves relevant assessment results.
6. System calculates subject-level metrics.
7. Parent reviews the subject's progress.
8. Parent can drill down into topics.

---

# 16. Parent Reviews Topic Progress

## Flow: View Topic Progress

1. Parent opens a subject.
2. Parent selects a topic.
3. System retrieves relevant learning activity.
4. System retrieves relevant practice activity.
5. System retrieves relevant assessment information.
6. System determines available metrics.
7. Parent reviews the topic performance.
8. Parent can identify areas that may need additional practice.

The system should avoid drawing conclusions when insufficient data exists.

---

# 17. Achievement Flow

## Flow: Earn Achievement

1. A qualifying activity is completed.
2. System evaluates achievement rules.
3. System checks whether the child already has the achievement.
4. If the achievement has been newly earned, the system creates the achievement record.
5. Achievement becomes visible to authorized users.
6. The child can see the achievement in the rewards area.

---

# 18. Learning Journal Flow

## Flow: Create Journal Entry

1. Parent selects a child.
2. Parent opens Journal.
3. Parent selects Create Entry.
4. Parent enters notes or a description.
5. Parent optionally adds photos or videos.
6. Parent saves the entry.
7. System stores the journal entry.
8. Entry becomes available in the child's journal.

---

# 19. Teacher Login and Student Access

## Flow: Teacher Opens Assigned Student

1. Teacher logs in.
2. System identifies the TEACHER role.
3. Teacher Dashboard opens.
4. Teacher opens Students.
5. System retrieves students assigned to the teacher.
6. Teacher selects a student.
7. System displays the authorized student information.
8. Teacher can access permitted learning and assessment workflows.

---

# 20. Teacher Logs Student Learning

## Flow: Teacher Records Learning

1. Teacher selects an assigned student.
2. Teacher opens Log Learning.
3. Teacher selects a subject.
4. System displays related topics.
5. Teacher selects a topic.
6. Teacher enters what was taught.
7. Teacher enters duration.
8. Teacher optionally records performance.
9. Teacher optionally records accuracy.
10. Teacher optionally adds notes.
11. Teacher saves the record.
12. System verifies teacher authorization.
13. System stores the learning session.
14. Student progress can use the new record.

---

# 21. Admin Manages Learning Structure

## Flow: Manage Subject, Topic, or Skill

1. Admin opens Learning Management.
2. Admin selects Subjects, Topics, or Skills.
3. Admin chooses Create or Edit.
4. Admin enters the required information.
5. System validates the information.
6. System validates relationships between entities.
7. System saves the configuration.
8. Updated active data becomes available to appropriate user workflows.

---

# 22. Admin Creates a Question

## Flow: Create Question

1. Admin opens Question Bank.
2. Admin selects Create Question.
3. Admin selects a subject.
4. Admin selects a topic.
5. Admin optionally selects a skill.
6. Admin selects age/grade applicability.
7. Admin selects difficulty.
8. Admin selects the question type.
9. Admin enters the question.
10. Admin enters answer information.
11. Admin optionally enters an explanation.
12. Admin saves the question.
13. System validates the question.
14. System stores the question.

---

# 23. Admin Creates an Assessment

## Flow: Create Assessment

1. Admin opens Assessments.
2. Admin selects Create Assessment.
3. Admin enters assessment information.
4. Admin selects subject.
5. Admin selects relevant topics.
6. Admin configures age/grade.
7. Admin configures difficulty.
8. Admin configures duration.
9. Admin configures question count.
10. Admin configures scoring.
11. Admin saves the assessment.
12. System validates the configuration.
13. Assessment becomes available according to its status.

---

# 24. Data Authorization Flow

## Flow: Validate Access to Child Data

1. User requests child-related information.
2. System authenticates the user.
3. System identifies the requested child.
4. System determines the user's role.
5. System checks the user's relationship with the child.
6. If authorized, the system returns the requested information.
7. If unauthorized, the system rejects the request.

Authorization must be enforced by the backend.

---

# 25. Mobile Quick-Log Flow

## Flow: Record a Lesson While Teaching

This is a critical real-world workflow.

1. Parent opens the application on a phone.
2. Parent sees the active child.
3. Parent taps Log Learning.
4. Parent selects the subject.
5. Parent selects the topic.
6. Parent enters what was taught.
7. Parent enters duration.
8. Parent optionally enters accuracy.
9. Parent taps Save.
10. System saves the session.
11. System confirms success.

The workflow should minimize typing and avoid unnecessary navigation.

---

# 26. Complete Learning Journey

The platform's central journey is:

Plan
→ Teach
→ Log
→ Practice
→ Test
→ Result
→ Progress
→ Achievement
→ Plan Next

This is the core learning loop of the product.

---

# 27. First Real-World Founder Flow

The first real user journey for validating the product is:

Parent Login
→ Select Child
→ Log Today's Abacus Lesson
→ Record Teaching Duration
→ Record What Was Taught
→ Save
→ View Learning History
→ Plan Tomorrow's Abacus Lesson
→ Practice
→ Take Mock Test
→ View Test Result
→ Review Progress
→ Award/View Achievement

This workflow should work smoothly before expanding the product significantly.

---

# 28. Future AI Flows

AI capabilities are planned for future releases.

Potential flows include:

Parent
→ Select Child
→ Review Progress
→ Request Lesson Suggestion
→ AI Analyzes Learning Data
→ Suggested Lesson
→ Parent Reviews
→ Parent Accepts or Modifies
→ Lesson Plan Created

Another possible flow:

Parent
→ Select Subject/Topic
→ Request Practice
→ Define Difficulty
→ AI Generates Questions
→ Questions Are Validated
→ Parent Reviews
→ Practice Set Created

AI-generated educational content should be reviewed and validated according to the product's safety and quality requirements before being presented to children.

---

# 29. Flow Design Principles

1. High-frequency actions should require minimal steps.
2. The active child must always be clear.
3. The system must preserve learning history.
4. Planned and actual learning must remain distinguishable.
5. Practice and formal assessment must remain distinct concepts.
6. Progress should use recorded data.
7. Unauthorized users must not access child data.
8. Mobile workflows should prioritize speed and simplicity.
9. Desktop workflows can provide deeper analysis.
10. Future features should extend the core learning loop rather than disrupt it.

---

# 30. Document Status

**Version:** 0.1  
**Status:** Draft

These user flows will be refined during UX design and architecture.
