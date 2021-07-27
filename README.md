# Strongly Meta Framework

Strongly brings powerful tools and frameworks together with minimal glue to enable rapid cross platform application development.

## Philosophy

### Data Driven

The Strongly pattern is to use the Prisma schema to generate and automate application infratructure, eg. REST endpoints, Admin UI, GraphQL schema etc.
The idea is to allow developers to focus on what makes their product unique rather than spend time on tedius and repetative tasks which add little business value.

### Monorepo

The `apps` folder contains example `web` and `mobile` apps the following features:

- React Native

  - With Hermes (Android and iOS)
  - With MMKV (JSI Based Secure Local Storage)
  - React Native App Auth
    - With Token Refresh

- NextJS
  - With API Routes (Serverless)
  - Signgle Sign on with NextAuth
  - Role based acces control
    - GraphQL field authorization
    - REST Resource authorization
  - Apollo Server over Next API Routes
  - Auto generated TypeGraphql
  - Auto generated RESTful APIs for Prisma Models
  - Auto generated Admin UI

### More lego, less spegatti

Strongly enables developing features as independent packages without the overhead of managing multiple repositories and seperate workflows.

This is as simple as:

1. Run `st watch`
2. Then run `st create package <package-name>`
3. Add your brand new package as a dependency in your app's `package.json`
4. Start developing inside `packages/<package-name>/src`.

Your package will be built and updates made available to apps on save, in real time.

## Building blocks

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
