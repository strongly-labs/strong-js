# Strong-js

Strong-JS is a truly fullstack React App development framework whcih brings powerful tools and frameworks (React Native, NextJS, Prisma) together with minimal glue to enable rapid platform application development across platforms.

## Data Driven

The Strong-js pattern is to use the Prisma schema to generate and automate application infratructure, eg. REST endpoints, Admin UI, GraphQL Endpoint, Swagger API Docs and more.
The idea is to allow developers to focus on what makes their product unique rather than spend time on tedius and repetative tasks which add little business value.

## More lego, less spaghetti

Strong-js enables developing features as isolated packages without the overhead of managing multiple repositories and seperate workflows.

This is as simple as:

1. Run `st watch`
2. Then run `st create package <package-name>`
3. Add your brand new package as a dependency in your app's `package.json`
4. Start developing inside `packages/<package-name>/src`.

Your package will be built and updates made available to apps on save, in real time. And can manage releases for your packages using the [changesets](https://github.com/atlassian/changesets)

## Monorepo

Since the apps leverage schema driven automation and feature isolation, it would make life a lot simpler if any changes to the schema or packages could be tested, built and deployed universally with a single `test` or `deploy` command.

Strong-js features a monorepo with web and mobile apps under a single `apps` workspace and feature packages in the `packages`.

With the following features out of the box.

- React Native

  - With Hermes (Android and iOS)
  - With MMKV (JSI Based Secure Local Storage)
  - React Native App Auth
    - With Token Refresh

- NextJS
  - Multizone setup (Compose multiple NextJS projects into one)
  - With API Routes (Serverless)
  - Signgle Sign on with NextAuth
  - Role based acces control
    - GraphQL field authorization
    - REST Resource authorization
  - Apollo Server over Next API Routes
  - Auto generated TypeGraphql
  - Auto generated RESTful APIs for Prisma Models
  - Auto generated Admin UI
  - Auto generated API documentation with swagger-docs

## Testing

Strong-js encourages a strong focus on testing and comes with the following tools out of the box.

- End to End web tests with `Cypress`
- End to End mobile tests with `Detox`
- Containerised Integration Testing with `Test Containers`

## Github workflows

Strong-js projects come with pre-configured workflows for testing and deployment automation that can:

1. Run both web and mobile End to End tests as github actions.
2. Deploy the mobile app to Android and iOS stores using fastlane.
3. Deploy the web app to `vercel`
