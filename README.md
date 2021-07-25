# Strongly Platform

## Meta Framework + Monorepo workflow

The Holy Grail project template

## Features

- TSDX Monorepo
- TypeScript
  - Root tsconfig extened by child workspaces
  - TS-Node
  - TS-Jest
  - TypeSync
- React Native
  - With Hermes (Android and iOS)
  - With MMKV (JSI Based Secure Local Storage)
- NextJS
  - With API Routes (Serverless)
- Prisma 2
  - Apollo Server over Next API Routes
  - Auto generated TypeGraphql
  - Auto generated RESTful APIs for Prisma Models
  - Auto generated Admin UI
- Cross Platform Authentication and Authorization (OAuth 2.0)
  - Web with NextAuth
  - Mobile with React Native App Auth
    - With Token Refresh
  - Role based acces control
    - GraphQL field authorization
    - REST Resource authorization
- Tests
  - TS-Jest
  - e2e web tests with Cypress
  - e2e mobile tests with Detox
  - Containerised integration with Test Containers
- Linting
  - Workspace level linting for different rules per app / package (Eg. Web vs Mobile)
  - Eslint, TypeScript, Prettier
  - Githooks via Husky
- Devops
  - Github Actions
    - Lint all workspaces
    - Unit test all workspaces
    - Cypress web e2e with video recording
    - Detox mobile e2e
