# Security Architecture

**Document:** Security Architecture  
**Version:** 0.1  
**Status:** Draft  
**Last Updated:** 2026-09-18

---

# 1. Purpose

This document defines the security architecture for the Child Learning & Progress Platform.

The platform handles:

- Parent accounts
- Teacher accounts
- Child profiles
- Learning history
- Assessment results
- Photos and videos
- User-generated notes
- Educational activity data

The architecture must protect these resources from unauthorized access, accidental exposure, and misuse.

This document defines:

- Authentication
- Authorization
- Child-data isolation
- API security
- Password security
- Session/token security
- File security
- Database security
- Frontend security
- Backend security
- Secrets management
- Logging
- Rate limiting
- Privacy principles
- Security testing
- Production security requirements

Detailed implementation choices may be refined during development.

---

# 2. Security Goals

The system should provide:

1. Confidentiality of user and child-related data.
2. Integrity of learning and assessment records.
3. Appropriate availability of the application.
4. Strong authentication.
5. Server-side authorization.
6. Isolation between users and children.
7. Safe handling of uploaded media.
8. Secure handling of credentials and secrets.
9. Protection against common web/API attacks.
10. Auditable and observable security events where appropriate.
11. Secure defaults.
12. Minimal collection and exposure of sensitive information.

---

# 3. Security Principles

The platform follows these principles:

## Principle 1 — Never Trust the Client

Any information coming from the browser must be treated as untrusted input.

This includes:

- User IDs
- Child IDs
- Roles
- Permissions
- Scores
- Progress values
- Assessment results
- File metadata

The backend must validate and authorize all protected operations.

---

## Principle 2 — Least Privilege

Users and services should have only the permissions required for their responsibilities.

---

## Principle 3 — Defense in Depth

Security should exist at multiple layers:

```text
Browser
  ↓
Angular
  ↓
API
  ↓
Authorization
  ↓
Business Logic
  ↓
Database
  ↓
Storage
```

No single security mechanism should be relied upon exclusively.

---

## Principle 4 — Secure by Default

New functionality should default to the safer behavior.

Examples:

- Protected endpoints require authentication.
- New administrative functionality requires explicit permission.
- Unknown roles are rejected.
- Invalid input is rejected.
- New files are not automatically considered trusted.

---

## Principle 5 — Minimize Data

Collect and retain only information that provides a clear product benefit.

---

# 4. Authentication Architecture

Authentication identifies the user making a request.

Initial supported application roles:

```text
PARENT
TEACHER
ADMIN
```

The child experience may initially operate under an authorized parent/teacher workflow rather than requiring an independent child login.

---

# 5. Registration Security

Registration must:

- Validate all required fields.
- Validate email format.
- Enforce password requirements.
- Prevent duplicate accounts.
- Hash passwords securely.
- Avoid exposing account-existence information unnecessarily.
- Rate-limit abusive registration attempts.

The system should not store plain-text passwords.

---

# 6. Password Security

Passwords must be stored only as secure password hashes.

The system should use a modern password-hashing mechanism appropriate for the backend environment.

The application should never:

- Store plaintext passwords.
- Log passwords.
- Return password hashes to clients.
- Include passwords in API responses.

---

# 7. Login Security

Login should:

- Validate input.
- Verify password securely.
- Establish authenticated state only after successful verification.
- Return only necessary account information.
- Avoid revealing sensitive authentication details.

Repeated failed authentication attempts should be subject to appropriate rate limiting or abuse protection.

---

# 8. Authentication Session Strategy

The exact session strategy will be finalized during implementation.

The application may use a secure token/session design that supports:

- Authenticated requests
- Session expiration
- Logout
- Session renewal where required
- Revocation where required

The chosen implementation must consider:

- XSS exposure
- CSRF protection
- Token theft
- Session lifetime
- Refresh behavior
- Secure storage

The final strategy must be documented before production launch.

---

# 9. Token/Session Storage

Authentication credentials or session artifacts must not be stored casually in browser storage.

The final implementation should prefer a secure design appropriate to the authentication strategy.

If cookies are used, appropriate protections should be considered, including:

- Secure
- HttpOnly
- SameSite

If another approach is selected, its security trade-offs must be documented.

---

# 10. Session Expiration

Authenticated sessions should have defined lifetimes.

The design should support appropriate expiration policies for:

- Access sessions
- Refresh sessions where applicable
- Password reset tokens
- Other temporary authentication artifacts

Long-lived authentication should not be used without a clear reason.

---

# 11. Logout

Logout must invalidate or clear the appropriate authenticated state.

The application must prevent the browser from continuing to use an invalidated session according to the chosen authentication strategy.

---

# 12. Password Reset Security

Password reset must use a secure, time-limited mechanism.

Reset tokens should:

- Be unpredictable.
- Expire.
- Be single-use where appropriate.
- Never be logged.
- Never be returned in normal API responses.
- Become invalid after successful reset.

---

# 13. Authorization Architecture

Authorization determines what an authenticated user is allowed to access.

The platform uses multiple authorization dimensions:

```text
User
  +
Role
  +
Relationship
  +
Resource
  =
Authorization Decision
```

---

# 14. Role-Based Authorization

Initial roles:

```text
PARENT
TEACHER
ADMIN
```

Role-based checks may control access to broad areas.

Examples:

```text
Parent → Parent application
Teacher → Teacher application
Admin → Administration
```

However, role checks alone are not enough for child data.

---

# 15. Resource-Level Authorization

Child-specific resources require relationship checks.

Parent:

```text
Parent User
    ↓
Parent-Child Relationship
    ↓
Child
```

Teacher:

```text
Teacher User
    ↓
Teacher-Student Assignment
    ↓
Child
```

The backend must verify the relationship before returning or modifying child-related information.

---

# 16. Child Data Isolation

Every child-related API operation must verify authorization.

Examples include:

- Child profile
- Learning sessions
- Lesson plans
- Practice
- Assessments
- Progress
- Achievements
- Journal
- Media

A user must not gain access simply by knowing a child ID.

---

# 17. Parent Access Rules

A parent may access:

- Their own account
- Their authorized children
- Learning records for their authorized children
- Lesson plans for their authorized children
- Practice and assessment activity for their authorized children
- Progress for their authorized children
- Rewards for their authorized children
- Journal entries for their authorized children

The exact permission matrix is defined in the API and backend architecture documents.

---

# 18. Teacher Access Rules

A teacher may access:

- Their own account
- Students assigned to them
- Learning records within their permissions
- Lesson plans within their permissions
- Practice activity within their permissions
- Assessment results within their permissions
- Progress information within their permissions

Teacher access must be checked server-side.

---

# 19. Admin Access Rules

Administrative capabilities must require explicit administrative authorization.

Admin functionality includes areas such as:

- Users
- Subjects
- Topics
- Skills
- Questions
- Assessments
- Exam contexts
- Achievement rules

Administrative operations should not be available to normal parent or teacher accounts.

---

# 20. Authorization Failure

When a user is authenticated but not authorized:

```text
HTTP 403 Forbidden
```

The system should avoid exposing unnecessary information about the protected resource.

---

# 21. Authentication Failure

When authentication is required but unavailable or invalid:

```text
HTTP 401 Unauthorized
```

Authentication and authorization failures should remain distinguishable.

---

# 22. API Input Validation

All API inputs are untrusted.

Validation must cover:

- Route parameters
- Query parameters
- Request bodies
- Headers where relevant
- Uploaded files

The backend must validate the expected data structure before business processing.

---

# 23. Input Constraints

Examples:

## Strings

Apply sensible:

- Maximum length
- Minimum length where required
- Allowed formats

## Numbers

Apply:

- Minimum
- Maximum
- Integer/decimal requirements

## Dates

Validate acceptable date formats and business constraints.

## IDs

Validate identifier format before database operations.

---

# 24. Business Validation

Business rules must also be enforced.

Examples:

```text
Topic belongs to Subject

Skill belongs to Topic

Teacher is assigned to Student

Parent is authorized for Child

Assessment is available before attempt starts

Assessment Attempt cannot be submitted twice

Lesson Plan belongs to Child
```

Business validation belongs on the server.

---

# 25. Assessment Security

Assessment data requires additional protection.

The client must not be trusted to determine:

- Final score
- Final accuracy
- Correct answers
- Marks awarded
- Completion state

The backend should remain authoritative for final assessment results.

---

# 26. Assessment Question Protection

The application should avoid exposing answer keys unnecessarily.

During an active test:

- Do not send answer keys to the child-facing client.
- Return only information required to answer the question.
- Evaluate final answers server-side where practical.

Historical results may expose more detail to authorized parents/teachers according to the product requirements.

---

# 27. Assessment Attempt Integrity

When an assessment begins, important information should be preserved so the attempt remains historically accurate.

The system may snapshot:

- Assessment configuration
- Question information
- Options
- Scoring context

This prevents later edits from changing the meaning of a completed attempt.

---

# 28. Progress Security

The backend is authoritative for important progress calculations.

The client must not be able to submit:

```text
"myAccuracy": 99
"myScore": 100
"myProgress": 95
```

and have the server blindly accept those values as authoritative results.

Trusted metrics should be derived from validated source data.

---

# 29. Reward Security

The client must not be able to award achievements to itself.

Achievement evaluation must occur through trusted backend logic.

Example:

```text
Learning Session
      ↓
Backend
      ↓
Achievement Rule
      ↓
Achievement Awarded
```

---

# 30. File Upload Security

Uploaded media must be treated as untrusted.

The system should validate:

- File type
- File size
- File count
- Authorization
- Associated child/resource

The backend should not rely only on file extensions supplied by users.

---

# 31. Media Storage Security

Actual media should be stored in controlled object storage.

MongoDB should store metadata/reference information where practical.

Storage access should be controlled.

Sensitive files should not be publicly accessible by default.

Access should be granted only to authorized users.

---

# 32. Media Access

When a user requests a media attachment:

```text
User Request
    ↓
Authentication
    ↓
Authorization
    ↓
Media Access Decision
    ↓
Return/Generate Authorized Access
```

The user should not be able to access another child's media by changing a file identifier.

---

# 33. XSS Protection

The application must protect against cross-site scripting.

Important areas include:

- User-generated notes
- Journal entries
- Question content
- Teacher feedback
- Other rich text

User-generated content should be rendered safely.

The application should avoid injecting untrusted HTML directly into the DOM.

---

# 34. CSRF Protection

If authentication uses cookies, the application must implement an appropriate CSRF protection strategy.

The final mechanism will be selected together with the authentication/session design.

---

# 35. CORS

CORS must be explicitly configured.

Production should allow only trusted application origins.

Development origins should be separately configurable.

Avoid broad wildcard access in production without a deliberate reason.

---

# 36. Security Headers

The production backend should use appropriate HTTP security headers.

The exact header configuration will be finalized during deployment.

The application should consider protections related to:

- Content Security Policy
- Clickjacking
- MIME sniffing
- Referrer handling
- Transport security

---

# 37. Rate Limiting

Rate limiting should be applied to appropriate endpoints.

Higher-risk areas include:

- Login
- Registration
- Password reset
- Media upload
- AI-generation endpoints in future

Limits should be selected based on expected usage and infrastructure.

---

# 38. Brute-Force Protection

Authentication endpoints should include appropriate defenses against repeated credential guessing.

Possible mechanisms include:

- Rate limiting
- Progressive delays
- Temporary lockouts where justified
- Monitoring suspicious patterns

The implementation should avoid creating an easy denial-of-service mechanism against legitimate users.

---

# 39. Secrets Management

Secrets must never be stored in source control.

Examples:

- Database credentials
- Authentication secrets
- Storage credentials
- Email credentials
- AI provider credentials

Secrets should be supplied through appropriate environment/secret-management systems.

---

# 40. Environment Separation

Production, test, and local environments must use separate configuration.

Example:

```text
Local
Test/Preview
Production
```

Production credentials must not be casually used by local development.

---

# 41. MongoDB Security

MongoDB Atlas should use appropriate security controls.

The production configuration should include:

- Strong credentials
- Least-privilege database users
- Encrypted connections
- Appropriate network access controls
- Backups
- Monitoring

The application should never expose MongoDB credentials to the browser.

---

# 42. Database Permissions

The application database user should have only the permissions required by the application.

Administrative database access should remain separate from normal application credentials.

---

# 43. Database Query Security

User input must not be allowed to create arbitrary database operations.

Examples of risky behavior to avoid:

- Arbitrary MongoDB operators from user input
- Unvalidated sort fields
- Unvalidated database field names
- Raw query fragments from request data

The backend should whitelist supported query fields and operations.

---

# 44. Sensitive Data in URLs

Avoid placing sensitive information in URLs.

Do not put:

- Passwords
- Authentication secrets
- Reset secrets
- Sensitive child information

into URLs unnecessarily.

---

# 45. Browser Storage

The application should minimize sensitive data stored in browser storage.

Avoid persisting unnecessary child-related information locally.

Local persistence should be limited to data that provides clear UX value and has been reviewed for security.

---

# 46. Logging Security

Logs must not contain sensitive information unnecessarily.

Never log:

- Passwords
- Authentication secrets
- Access tokens
- Reset tokens

Avoid unnecessarily logging:

- Child personal information
- User-generated private notes
- Full assessment content

---

# 47. Security Event Logging

Appropriate security events may include:

- Failed authentication attempts
- Successful logins where appropriate
- Authorization failures
- Administrative changes
- Important account changes
- Suspicious file-upload attempts

Logging requirements should balance security value and privacy.

---

# 48. Request Correlation

Each request may have a correlation/request ID.

This helps connect:

```text
Frontend Error
   ↓
API Request
   ↓
Backend Log
   ↓
Database/Service Operation
```

Request IDs should not contain sensitive information.

---

# 49. Error Response Security

API errors should not expose:

- Stack traces
- Database connection details
- Internal file paths
- Secret configuration
- Internal implementation details

Clients should receive safe, structured errors.

Detailed debugging information belongs in protected server logs.

---

# 50. Dependency Security

Dependencies should be reviewed regularly.

Security practices should include:

- Keep dependencies maintained.
- Monitor known vulnerabilities.
- Remove unused dependencies.
- Avoid unnecessary packages.
- Review major dependency upgrades.

Automated dependency scanning should be considered in CI.

---

# 51. CI/CD Security

CI/CD pipelines must protect:

- Secrets
- Deployment credentials
- Database credentials
- API keys

Secrets should come from secure CI/CD secret management rather than source-controlled files.

Pull-request workflows should prevent unauthorized deployment to production.

---

# 52. Git Security

The repository must not contain:

```text
.env
Production credentials
Private keys
API secrets
Database passwords
Authentication secrets
```

Use an appropriate `.gitignore`.

Secret scanning should be considered for the repository and CI.

---

# 53. Environment Files

Local development may use environment configuration files.

Example:

```text
.env.local
```

These should not be committed when they contain secrets.

Provide example configuration separately:

```text
.env.example
```

with placeholder values only.

---

# 54. Admin Security

Administrative functions require extra protection.

Potential controls include:

- Strong authentication
- Role checks
- Restricted routes
- Audit logging
- Additional confirmation for destructive actions

More advanced controls can be introduced as the product grows.

---

# 55. Destructive Operations

Operations such as:

- Deactivating users
- Deactivating subjects
- Removing assignments
- Deleting content
- Archiving assessments

should require appropriate authorization.

Where historical data depends on a resource, prefer deactivation/archiving instead of destructive deletion.

---

# 56. Auditability

Important administrative actions should be traceable.

Potential information:

- Who performed the action
- What resource was affected
- What type of action occurred
- When it occurred

The exact audit-log implementation will be decided later.

---

# 57. Child Privacy

The platform should minimize unnecessary collection and exposure of child-related information.

Examples:

- Collect only information needed for product functionality.
- Avoid displaying unnecessary personal data.
- Restrict child information to authorized users.
- Avoid logging child information unnecessarily.
- Protect uploaded child-related media.

---

# 58. Data Retention

Learning history and assessment data may be valuable over long periods.

However, the product must define:

- Retention requirements
- User deletion behavior
- Media retention
- Account closure behavior
- Backup retention

These policies should be established before broad public launch.

---

# 59. User Account Deletion

The final product must define what happens when a user requests account deletion.

Possible considerations:

- Account removal
- Child-data handling
- Shared teacher records
- Media deletion
- Backups
- Historical records
- Legal/operational retention requirements

The exact policy will be defined before public launch.

---

# 60. Backup Security

Production backups must be protected with appropriate access controls.

Backup access should be limited to authorized personnel and systems.

Recovery procedures should be tested periodically.

---

# 61. Availability and Abuse Protection

Security also includes maintaining service availability.

The application should consider:

- Rate limiting
- Request-size limits
- Upload limits
- Database query limits
- Resource limits
- Monitoring
- Graceful failure

The system should avoid expensive unbounded operations triggered by unauthenticated or untrusted requests.

---

# 62. Request Size Limits

The backend should apply sensible limits to:

- JSON bodies
- Query parameters
- Uploaded files
- Number of uploaded files

Limits should match actual product requirements.

---

# 63. Child-Facing Security

The child interface should have restricted capabilities.

The child should not be able to:

- Modify authoritative scores
- Award achievements
- Access another child's data
- Modify parent information
- Access administrative functions

The exact child authentication model will be finalized later.

---

# 64. Frontend Security Rules

Angular code must:

- Avoid embedding secrets.
- Avoid trusting client-side permissions.
- Avoid exposing sensitive information unnecessarily.
- Safely render user-generated content.
- Handle authentication state carefully.
- Avoid logging sensitive data.

---

# 65. Backend Security Rules

The backend must:

- Authenticate protected requests.
- Authorize every protected resource.
- Validate input.
- Enforce business rules.
- Protect database operations.
- Protect media access.
- Protect secrets.
- Return safe errors.

---

# 66. Security Testing Strategy

Security should be included in normal development rather than postponed to the end.

Testing areas include:

## Authentication

- Invalid credentials
- Expired session
- Logout behavior
- Password reset

## Authorization

- Parent accessing own child
- Parent attempting another parent's child
- Teacher accessing assigned student
- Teacher attempting unassigned student
- Non-admin accessing admin API

## Input Security

- Invalid IDs
- Unexpected fields
- Invalid enum values
- Oversized values
- Malformed payloads

## File Security

- Unsupported file types
- Oversized files
- Unauthorized media access

---

# 67. API Security Tests

Important API tests should verify:

```text
No authentication
→ 401

Authenticated but unauthorized
→ 403

Authorized
→ success
```

Tests should also verify that changing a child ID in the request cannot bypass authorization.

---

# 68. Security Regression Testing

Security tests should remain part of the automated test suite.

When a security defect is fixed:

```text
Security Issue
    ↓
Fix
    ↓
Regression Test
    ↓
CI
```

The test should remain permanently where practical.

---

# 69. Production Security Checklist

Before public launch:

```text
Authentication reviewed
Authorization reviewed
Child-data isolation tested
Secrets removed from repository
CORS configured
Rate limiting configured
Security headers configured
Database access restricted
Backups enabled
Media access secured
Error responses sanitized
Logging reviewed
Dependency scanning enabled
CI/CD secrets secured
Production environment separated
Security tests passing
```

---

# 70. Security Review Process

Before significant production changes:

1. Identify security-sensitive behavior.
2. Review authentication and authorization impact.
3. Review data exposure.
4. Review input handling.
5. Review database queries.
6. Review media handling.
7. Add tests.
8. Review logs and error behavior.

---

# 71. Codex Security Guidelines

Codex must follow the security architecture when implementing features.

Before changing security-sensitive code, Codex should inspect:

```text
AGENTS.md
docs/01-product/
docs/02-architecture/
```

Security-sensitive areas include:

- Authentication
- Authorization
- Child access
- Assessment scoring
- Media
- Secrets
- Database queries
- Admin functionality

---

# 72. Codex Security Review

Codex may be used to review code for:

- Authorization bypass
- Insecure data exposure
- Validation gaps
- Unsafe query construction
- Secret leakage
- Missing security tests
- Incorrect role handling

However, security-sensitive changes should receive explicit human review before production deployment.

---

# 73. Security Architecture Evolution

Security requirements may increase as the product grows.

Future capabilities may include:

- Stronger admin authentication
- Additional account protections
- Audit logging
- More granular permissions
- Advanced abuse detection
- More detailed privacy controls
- Organization-level security
- Enterprise security requirements

These should be introduced based on actual product requirements.

---

# 74. Security Trade-offs

The MVP should remain secure without becoming unnecessarily complex.

Prefer:

```text
Simple + Secure + Understandable
```

over:

```text
Complex + Difficult to Operate + Theoretically More Advanced
```

Security architecture should evolve with the product.

---

# 75. Security Responsibilities

## Frontend

Responsible for:

- Safe presentation
- User experience
- Client-side validation
- Authentication-state handling
- Avoiding unnecessary exposure

## Backend

Responsible for:

- Authentication
- Authorization
- Business rules
- Data protection
- Secure API behavior
- Assessment integrity

## Database

Responsible for:

- Protected access
- Appropriate credentials
- Encryption
- Backup
- Reliability

## Infrastructure

Responsible for:

- Network/security configuration
- Secrets
- Deployment security
- Monitoring
- Availability

---

# 76. Security Summary

The security architecture is based on:

```text
Strong Authentication
        +
Server-Side Authorization
        +
Child Data Isolation
        +
Input Validation
        +
Secure Database Access
        +
Protected Media
        +
Secret Management
        +
Rate Limiting
        +
Safe Error Handling
        +
Security Testing
```

The most important rule is:

> The browser is never the authority for protected data or security decisions.

---

# 77. Architecture Documents Completed

The current architecture documentation set is:

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

---

# 78. Next Phase

The architecture-definition phase is now complete enough to move into implementation planning.

The next phase will define:

- Repository structure
- Monorepo tooling
- Angular project setup
- Backend project setup
- Shared package strategy
- Development tooling
- Formatting/linting
- Testing setup
- CI/CD structure
- Codex instructions

Only after these are agreed should application feature development begin.

---

# 79. Document Status

**Version:** 0.1  
**Status:** Draft

This document defines the initial security architecture and will be refined as the application, infrastructure, threat model, and production requirements mature.
