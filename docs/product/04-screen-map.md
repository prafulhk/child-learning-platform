# Screen Map

**Version:** 0.1  
**Status:** Draft  
**Last Updated:** 2026-09-18

---

# 1. Purpose

This document defines the main screens of the Child Learning & Progress Platform and the navigation structure between them.

The screen map is a high-level product view.

Detailed routing, Angular components, APIs, and technical implementation will be defined later.

---

# 2. Main User Areas

The application has four primary user areas:

1. Parent
2. Teacher
3. Child
4. Admin

---

# 3. Public Screens

These screens are available before login.

Landing Page
├── Login
├── Register
├── Forgot Password
└── Reset Password

---

# 4. Parent Screens

The Parent area is the primary experience for V1.

Parent Login
└── Parent Dashboard
├── Children
│ ├── Child List
│ ├── Add Child
│ └── Child Profile
│
├── Learning
│ ├── Log Learning
│ ├── Learning History
│ └── Learning Details
│
├── Lesson Plans
│ ├── Upcoming Plans
│ ├── Create Plan
│ └── Plan Details
│
├── Practice
│ ├── Practice Home
│ ├── Practice Session
│ └── Practice Result
│
├── Tests
│ ├── Test List
│ ├── Test Details
│ ├── Test Session
│ ├── Test Result
│ └── Test History
│
├── Progress
│ ├── Progress Overview
│ ├── Subject Progress
│ ├── Topic Progress
│ └── Learning Trends
│
├── Rewards
│ └── Achievements
│
├── Journal
│ ├── Journal Entries
│ ├── Create Entry
│ └── Entry Details
│
└── Profile

---

# 5. Parent's Most Important V1 Flow

The most important parent workflow is:

Parent Dashboard
→ Select Child
→ Log Learning
→ Select Subject
→ Select Topic
→ Enter What Was Taught
→ Enter Duration
→ Save
→ Learning History
→ Progress

This workflow should be extremely easy to use on a mobile phone.

---

# 6. Teacher Screens

The Teacher area allows teachers to manage assigned students.

Teacher Login
└── Teacher Dashboard
├── Students
│ ├── Student List
│ └── Student Profile
│
├── Learning
│ ├── Log Learning
│ └── Learning History
│
├── Lesson Plans
│
├── Practice
│
├── Tests
│ ├── Available Tests
│ └── Test Results
│
├── Progress
│
└── Profile

Teachers can only access students assigned to them.

---

# 7. Child Screens

The child experience should be simple and age-appropriate.

Child Home
├── Practice
├── Tests
├── Results
└── Achievements

The child experience will be expanded in future versions.

---

# 8. Admin Screens

Admin manages platform configuration.

Admin Login
└── Admin Dashboard
├── Users
│
├── Learning
│ ├── Subjects
│ ├── Topics
│ └── Skills
│
├── Question Bank
│
├── Assessments
│
└── Exam Types

---

# 9. Important Navigation Concepts

## Active Child

A parent can manage multiple children.

Parent
├── Child A
├── Child B
└── Child C

When a child is selected, child-related screens should display information only for that child.

This applies to:

- Learning
- Lesson Plans
- Practice
- Tests
- Progress
- Rewards
- Journal

---

# 10. Mobile Navigation

The parent mobile experience should prioritize frequent actions.

Primary navigation may include:

- Home
- Children
- Learn
- Tests
- Progress

Frequently used actions should be easily accessible:

- Log Learning
- Plan Lesson
- Practice
- Start Test

The final navigation design will be refined during UX design.

---

# 11. Desktop Navigation

Desktop can provide more detailed navigation and information.

The desktop experience should make it easier to:

- Review learning history
- Analyze progress
- View charts
- Manage assessments
- Manage questions
- Manage students
- Manage platform configuration

---

# 12. V1 Critical Screens

## Parent

- Login
- Dashboard
- Children
- Add Child
- Child Profile
- Log Learning
- Learning History
- Lesson Plans
- Practice
- Practice Result
- Tests
- Test Session
- Test Result
- Progress
- Achievements

## Teacher

- Login
- Dashboard
- Students
- Student Profile
- Log Learning
- Lesson Plans
- Tests
- Progress

## Admin

- Dashboard
- Users
- Subjects
- Topics
- Skills
- Question Bank
- Assessments
- Exam Types

---

# 13. Future Screens

These screens are planned for future releases:

- AI Lesson Suggestions
- AI Practice Generator
- AI Mock Test Generator
- Personalized Learning Plan
- Notifications
- Parent-Teacher Communication
- Advanced Analytics
- Enhanced Child Dashboard
- Subscription and Billing

---

# 14. Screen-to-Feature Relationship

Every screen should eventually map to:

Screen
→ User Story
→ Use Case
→ Business Logic
→ API
→ Database
→ Angular Implementation

This mapping will be defined during architecture and implementation.

---

# 15. Document Status

**Version:** 0.1  
**Status:** Draft

The screen map can be updated as the product requirements and UX are refined.
