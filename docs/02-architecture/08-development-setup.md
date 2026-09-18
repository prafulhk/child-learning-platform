# Development Setup

**Document:** Development Environment and Repository Setup  
**Version:** 0.1  
**Status:** Draft  
**Last Updated:** 2026-09-18

---

# 1. Purpose

This document defines the development environment, monorepo structure, tooling, package management, testing setup, environment configuration, CI/CD foundation, and Codex workflow for the Child Learning & Progress Platform.

The goal is to establish a clean and reproducible development environment before feature implementation begins.

---

# 2. Development Principles

The development environment should be:

- Reproducible
- Type-safe
- Easy to onboard
- Easy for Codex to understand
- Consistent across frontend and backend
- Testable
- CI-ready
- Production-oriented
- Simple enough for the MVP

---

# 3. Target Technology Stack

## Frontend

- Angular
- TypeScript
- Standalone Angular architecture
- Signals
- RxJS
- Responsive UI

## Backend

- Node.js
- Express
- TypeScript

## Database

- MongoDB Atlas

## Repository

- GitHub
- Monorepo

## Package Manager

- pnpm workspaces

## Unit / Integration Testing

- Vitest

## Browser End-to-End Testing

- Playwright

## CI/CD

- GitHub Actions

## Development IDE

- Visual Studio Code

## AI Development Assistant

- Codex

---

# 4. Runtime Version Strategy

The project should use versions that are actively supported and compatible with the selected Angular release.

Initial target:

```text
Angular: 22
Node.js: 24 LTS
TypeScript: version supported by Angular 22
RxJS: version supported by Angular 22
```

The exact installed versions must be verified during project initialization.

The project should not depend on an unsupported Node.js or Angular version.

---

# 5. Version Pinning

The repository should make the required toolchain versions explicit.

The project should document:

- Node.js version
- Package manager version
- Angular version
- TypeScript version
- Important runtime dependencies

Where appropriate, package-manager configuration should pin the expected package-manager version.

A developer cloning the repository should be able to determine the expected development environment from the repository itself.

---

# 6. Node.js Version Management

Local development should use a version manager or another reproducible mechanism.

Preferred approach:

```text
Node version manager
        ↓
Configured project Node version
        ↓
Same runtime for local development
```

The repository should contain a project-level Node version declaration where practical.

Developers should not rely on an arbitrary globally installed Node.js version.

---

# 7. Monorepo Strategy

The project will use a monorepo.

Initial structure:

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
├── package.json
├── pnpm-workspace.yaml
└── .gitignore
```

The repository should support frontend, backend, and shared packages without requiring separate repositories.

---

# 8. Workspace Management

pnpm workspaces will manage the monorepo.

Workspace configuration should include:

```text
apps/*
packages/*
```

The root workspace should provide common scripts where appropriate.

Application-specific scripts should remain within the corresponding workspace.

---

# 9. Root package.json

The root `package.json` will primarily provide:

- Workspace metadata
- Shared development scripts
- Tooling dependencies where appropriate
- Package-manager version declaration where appropriate

The root should not become a dumping ground for application-specific runtime dependencies.

---

# 10. Frontend Application

Frontend location:

```text
apps/web/
```

The frontend will be a modern Angular application.

Initial characteristics:

- Standalone Angular
- Strict TypeScript
- Lazy-loaded feature areas
- Signals
- RxJS
- Responsive design
- Vitest
- Production build configuration

---

# 11. Backend Application

Backend location:

```text
apps/api/
```

The backend will be a Node.js + Express + TypeScript application.

Initial characteristics:

- Strict TypeScript
- Modular monolith
- REST API
- Validation
- Authentication
- Authorization
- MongoDB access
- Vitest tests

---

# 12. Shared Package

Shared code will live under:

```text
packages/shared/
```

Only stable, genuinely reusable contracts should be shared.

Potential shared content:

- API DTO types
- Enums
- Common contract types
- Small cross-application utility types

Do not share:

- Angular components
- Backend controllers
- Backend services
- Database models
- Infrastructure implementation
- Application-specific UI logic

Shared code must not create unnecessary coupling.

---

# 13. Shared Contract Principle

The ideal contract flow is:

```text
API Design
    ↓
Shared DTO / Contract
    ↓
Angular API Service
    ↓
Node.js Controller/Service
```

The shared package should represent stable external contracts, not internal implementation details.

---

# 14. Angular Project Setup

The Angular application should be created using the Angular CLI.

Initial setup should use:

- Standalone application
- Strict TypeScript
- Routing
- Current Angular build system
- Vitest-based testing
- Modern Angular configuration

The exact CLI options should be confirmed at implementation time rather than copied from an outdated template.

---

# 15. Angular Testing

New Angular application tests will use the Angular CLI's supported default testing setup.

Initial test strategy:

```text
Component Tests
Service Tests
Feature Tests
```

Vitest will be the primary unit-test runner.

Tests should be close to the code they validate where practical.

---

# 16. Backend Testing

Backend tests will use Vitest.

Integration testing should cover:

- HTTP endpoints
- Authentication
- Authorization
- Database interaction
- Important business workflows

An HTTP testing library such as Supertest may be used when it provides value.

---

# 17. End-to-End Testing

Playwright will be used for browser-level end-to-end testing.

Critical workflows will include:

```text
Parent Login
→ Add Child
→ Log Learning
→ View History
```

and:

```text
Start Practice
→ Answer Questions
→ Submit
→ View Result
```

and:

```text
Start Mock Test
→ Answer Questions
→ Submit
→ View Result
```

---

# 18. Linting

The repository should use a consistent linting strategy.

Goals:

- Catch common errors
- Enforce project conventions
- Reduce code-quality problems
- Support CI validation

Angular and backend linting should follow the tooling appropriate to each workspace while maintaining consistent project standards.

---

# 19. Formatting

Use a consistent formatting tool across the repository.

Preferred direction:

```text
Prettier
```

Formatting should be automatic and reproducible.

Developers should not rely on personal editor formatting settings.

---

# 20. TypeScript Strictness

TypeScript strict mode should be enabled.

Avoid:

```text
any
```

unless there is a documented technical reason.

Prefer:

- Explicit types
- Type narrowing
- Strong DTOs
- Typed API responses
- Typed forms where appropriate

---

# 21. Environment Configuration

The project will support:

```text
Local
Preview/Test
Production
```

Environment-specific values must not be hard-coded.

Typical configuration includes:

```text
API URL
MongoDB connection
Authentication configuration
Storage configuration
Monitoring configuration
AI configuration
```

---

# 22. Secrets

Secrets must never be committed to Git.

Examples:

```text
MongoDB credentials
Authentication secrets
API keys
Storage credentials
Email credentials
AI provider keys
Deployment credentials
```

Local secret files should be excluded through `.gitignore`.

Provide safe placeholder configuration using an example file where useful.

---

# 23. Environment File Strategy

Potential local configuration:

```text
.env.local
```

Safe example configuration:

```text
.env.example
```

The example file must contain placeholders only.

Production secrets must come from secure environment/secret management.

---

# 24. Local Database Strategy

The MVP will use MongoDB Atlas.

For local development, the preferred initial approach is to use a dedicated development database/environment.

Development credentials and production credentials must be separate.

Local development must not accidentally point to production.

---

# 25. Database Seed Data

The development environment should support deterministic seed data.

Initial seed categories may include:

- Subjects
- Topics
- Skills
- Exam types
- Achievement rules
- Questions
- Sample assessments

Seed data should be version-controlled.

Seed scripts must not contain production secrets.

---

# 26. Development Scripts

The root workspace should eventually provide convenient commands such as:

```text
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm build
```

Application-specific commands may also be available:

```text
pnpm --filter web ...
pnpm --filter api ...
```

The exact scripts will be established during repository initialization.

---

# 27. Development Workflow

Preferred development flow:

```text
Open Repository
      ↓
Install Dependencies
      ↓
Start Required Services
      ↓
Run Web + API
      ↓
Develop Feature
      ↓
Run Tests
      ↓
Run Lint
      ↓
Build
```

---

# 28. Local Development Architecture

Conceptual local environment:

```text
Browser
   ↓
Angular Web App
   ↓
Node.js API
   ↓
MongoDB Atlas Development Database
```

The API should expose an appropriate health endpoint.

---

# 29. Local Configuration

Local configuration should be easy to understand.

Developers should be able to determine:

- Which port the frontend uses
- Which port the backend uses
- Which API URL is used
- Which database environment is used
- Which optional services are enabled

The README should document initial setup.

---

# 30. Git Workflow

Development should use feature branches.

Example:

```text
main
  ↑
feature/authentication
feature/child-management
feature/learning-log
feature/practice
feature/assessments
```

Feature branches should contain focused changes.

---

# 31. Commit Convention

Use Conventional Commit-style messages.

Examples:

```text
feat: add parent authentication
feat: add child management
feat: add learning log
fix: prevent unauthorized child access
test: add learning service tests
refactor: simplify learning state
docs: update architecture
chore: update tooling
```

---

# 32. Pull Requests

Pull requests should include:

- Description
- Related user story
- Relevant use case
- Summary of changes
- Tests performed
- Important architectural changes
- Screenshots for significant UI changes

Security-sensitive changes should be clearly identified.

---

# 33. CI/CD Foundation

CI/CD will use GitHub Actions.

Initial pipeline direction:

```text
Push / Pull Request
        ↓
Install Dependencies
        ↓
Lint
        ↓
Unit Tests
        ↓
Build
        ↓
Integration Tests
        ↓
E2E where appropriate
```

Deployment will be introduced after the local application is stable.

---

# 34. Pull Request Checks

Required checks should eventually include:

```text
TypeScript / Build
Lint
Unit Tests
Integration Tests
```

E2E tests may run depending on the change and CI strategy.

The main branch should be protected by required checks once the project reaches the appropriate stage.

---

# 35. CI Caching

CI may use dependency caching where it provides meaningful build-time improvements.

Caching must not compromise reproducibility.

The lockfile remains authoritative for dependency resolution.

---

# 36. Dependency Lockfile

The repository must commit the package-manager lockfile.

The lockfile should be updated intentionally when dependencies change.

CI should install using the lockfile in a reproducible manner.

---

# 37. Dependency Updates

Dependencies should not be upgraded casually.

Before a major upgrade:

- Review compatibility
- Review breaking changes
- Run tests
- Run build
- Review security impact
- Document important changes

---

# 38. Security Scanning

The repository should eventually enable appropriate automated security checks.

Potential checks include:

- Dependency vulnerability scanning
- Secret scanning
- Code analysis
- Container scanning where applicable

Security scanning should be integrated into CI where practical.

---

# 39. Code Quality Gates

A feature should not be considered ready for merge when:

- TypeScript fails
- Lint fails
- Required tests fail
- Build fails
- Security-sensitive tests fail

Exceptions should be explicit and documented.

---

# 40. Git Hooks

Local Git hooks may be introduced for developer convenience.

Possible checks:

```text
Pre-commit
→ Formatting / lightweight checks

Pre-push
→ Selected validation
```

Hooks should remain fast.

CI remains the authoritative validation mechanism.

---

# 41. VS Code Configuration

The repository may provide shared VS Code configuration where helpful.

Possible files:

```text
.vscode/
├── settings.json
├── extensions.json
└── tasks.json
```

Only useful project-specific settings should be committed.

Do not force unnecessary editor customization.

---

# 42. Recommended VS Code Extensions

Potential project extensions:

```text
Angular Language Service
ESLint
Prettier
GitLens or equivalent Git tooling
Docker support if Docker is introduced
```

The final extension list should remain minimal.

---

# 43. Codex Role

Codex is an implementation and engineering-assistance tool for the project.

Codex may help with:

- Planning
- Implementation
- Testing
- Refactoring
- Debugging
- Code review
- Documentation updates

Codex should follow the repository's:

```text
AGENTS.md
Product Documentation
Architecture Documentation
```

---

# 44. Codex Task Workflow

Preferred workflow:

```text
Requirement
    ↓
User Story
    ↓
Use Case
    ↓
Architecture
    ↓
Codex Plan
    ↓
Implementation
    ↓
Tests
    ↓
Review
    ↓
Commit
```

For complex tasks, planning should happen before implementation.

---

# 45. Codex Context

Before implementing a significant feature, Codex should review:

```text
AGENTS.md
```

and the relevant documents under:

```text
docs/01-product/
docs/02-architecture/
```

Do not require Codex to read every file for every small change.

Use the minimum relevant context.

---

# 46. Codex Change Scope

Codex should:

- Make focused changes.
- Avoid unrelated refactoring.
- Preserve existing architecture.
- Reuse existing project patterns.
- Add tests.
- Run validation.
- Report changes.
- Report unresolved issues.

---

# 47. Codex Architecture Changes

Codex must not independently introduce major architecture changes.

Examples requiring explicit review:

- New framework
- New database
- New authentication model
- Microservices
- Event bus
- Major state-management library
- New cloud platform
- Major deployment redesign

---

# 48. Codex Security Review

For security-sensitive work, Codex may assist with:

- Threat identification
- Authorization review
- Validation review
- Test generation
- Secret-detection review

Human review is required before production deployment of significant security-sensitive changes.

---

# 49. Codex Git Workflow

Codex should not automatically:

- Push directly to main
- Merge pull requests
- Change branch-protection settings
- Rewrite project history

The human project owner controls repository-level Git operations.

---

# 50. Code Generation Policy

Generated code must follow:

- Existing architecture
- Existing naming conventions
- Existing patterns
- Product requirements
- Security requirements
- Test requirements

Generated code is not automatically considered correct.

It must be reviewed and validated.

---

# 51. Documentation Synchronization

When implementation changes an approved architectural decision:

```text
Code Change
    ↓
Review
    ↓
Architecture / Decision Update
    ↓
Commit
```

Documentation must not intentionally remain inconsistent with the implementation.

---

# 52. Development Workflow by Feature

Each feature should follow:

```text
1. Select user story
2. Review acceptance criteria
3. Review use case
4. Review screen
5. Review API
6. Review database impact
7. Create technical plan
8. Implement backend
9. Implement frontend
10. Add tests
11. Run validation
12. Review
13. Commit
14. Push / Pull Request
```

The exact frontend/backend order may vary when the feature is better developed contract-first.

---

# 53. Contract-First Development

For features involving a new API:

```text
Requirement
   ↓
API Contract
   ↓
Shared Contract Types
   ↓
Backend
   ↓
Frontend
   ↓
Integration Tests
```

The API contract should remain stable and explicit.

---

# 54. Development Order

The initial implementation sequence should be:

```text
Repository Tooling
      ↓
Angular Application
      ↓
Backend Application
      ↓
Shared Contracts
      ↓
Authentication
      ↓
Child Management
      ↓
Subjects / Topics
      ↓
Learning Log
      ↓
Lesson Plans
      ↓
Progress
      ↓
Practice
      ↓
Assessments
      ↓
Rewards
      ↓
Teacher Workflow
      ↓
Production Hardening
```

The exact order may change based on implementation dependencies.

---

# 55. First Vertical Slice

The first true end-to-end feature should be:

```text
Parent Login
      ↓
Add Child
      ↓
Select Child
      ↓
Log Learning
      ↓
Save to MongoDB
      ↓
View Learning History
```

This proves that:

```text
Angular
→ API
→ Business Logic
→ MongoDB
→ Angular
```

works end-to-end.

---

# 56. Development Environment Validation

Before feature development begins, verify:

```text
Node.js
Package Manager
Angular CLI
Git
GitHub Authentication
VS Code
Angular Language Service
```

The exact installed versions should be recorded after verification.

---

# 57. Initial Tooling Validation

The project should successfully execute:

```text
Install dependencies
Start frontend
Start backend
Run frontend tests
Run backend tests
Run lint
Run build
```

No feature development should begin until the basic development loop works.

---

# 58. Reproducibility

A new developer should be able to:

```text
Clone Repository
      ↓
Install Required Runtime
      ↓
Install Dependencies
      ↓
Configure Environment
      ↓
Run Application
      ↓
Run Tests
```

without manually reproducing undocumented setup steps.

---

# 59. README Responsibility

The repository `README.md` should eventually document:

- Product overview
- Architecture summary
- Prerequisites
- Installation
- Environment setup
- Development commands
- Testing commands
- Build commands
- Repository structure
- Contribution workflow

The README should be kept concise and point to detailed documentation where appropriate.

---

# 60. Initial README Commands

Once tooling is configured, the README should document commands similar to:

```text
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm build
```

The final commands must match the actual configured scripts.

---

# 61. Project Health Checks

The development environment should eventually provide:

```text
GET /health
```

for backend health verification.

The frontend should expose an appropriate development indicator or simple check where useful.

---

# 62. Local Port Strategy

Ports should be explicitly documented.

Initial direction may be:

```text
Frontend → 4200
Backend  → 3000
```

The exact values can be changed during setup.

Ports should not conflict with common local services.

---

# 63. Production Configuration Boundary

Development configuration must remain separate from production configuration.

Never copy production secrets into local source-controlled files.

Production deployment will use its own environment and secret configuration.

---

# 64. Future Docker Strategy

Docker is not required to run the MVP locally if native Node/Angular tooling is sufficient.

Docker may be introduced for:

- Reproducible environments
- CI consistency
- Deployment
- Supporting infrastructure

Do not introduce Docker simply because it is available.

---

# 65. Future Infrastructure

The following are intentionally deferred until required:

- Redis
- Message queues
- Microservices
- Kubernetes
- Dedicated analytics infrastructure
- Complex background-job systems

The initial system remains a modular monolith.

---

# 66. Project Setup Milestone

The development setup phase is complete when:

```text
Repository structure exists
Angular app runs
Backend runs
Shared package works where required
Tests run
Lint works
Build works
Environment configuration works
CI validation works
Codex instructions are available
```

---

# 67. Development Setup Status

**Version:** 0.1  
**Status:** Draft

This document defines the initial development environment and project setup strategy.

The exact installed tool versions and commands will be recorded during actual repository initialization.
