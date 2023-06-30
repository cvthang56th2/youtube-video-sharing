# Youtube Video Sharing App

## Introduction:

<!-- A brief overview of the project, its purpose, and key features. -->

Youtube Video Sharing app is a platform to help users watch and share funny videos to others.

### Key features:

- Authentication
- View list and watch video
- Reaction video
- Share video
- Manage shared video
- Notification

## Prerequisites:

<!-- List required software and tools, along with their appropriate versions. -->

- FE:
  - React Typescript
  - TailwindCSS: help build UI fast
  - Vite: help build fast
  - React Router Dom
  - React Redux
- BE: Firebase: Why?
  - Firestore: for the database
  - Authentication: for authentication flow
  - Hosting: Deploy to Firebase web hosting.

## Installation & Configuration:

<!-- Step-by-step instructions for cloning the repository, installing dependencies, and configuring settings. -->

- Node: 14.18+ (Vite requires Node.js version 14.18+)
- Clone source
- Config environment:
  - clone a .env.sample and rename to .env.local
  - Youtube API, Firebase configs...

## Database Setup:

<!-- Instructions for setting up the database, running migrations, and seeding data if necessary. -->

- Collections: users, videos, notifications.

## Seeding: /seeding?KEY=abcd

## Indexing

**Notification**

| fields       | order     |
| ------------ | --------- |
| notSeenUsers | Arrays    |
| authorId     | Ascending |
| **name**     | Ascending |

## Running the Application:

<!-- How to start the development server, access the application in a web browser, and run the test suite. -->

- Start dev: After step Install and config: to start development: npm run dev
- Testing:
  - Unit test functions
  - Unit test React Components
  - Coverage

## Deployment:

This app is being deployed on firebase hosting using firebase cli.

To deploy to firebase run these steps:

- Setup according to firebase instructions
- Build project
- Deploy to firebase hosting

## Usage:

- How to view list video?
- Reaction video
- Share video
- Manage shared video
  - How to set private/public
- Check notification

## Troubleshooting:

<!-- Common issues that may arise during setup and their potential solutions. -->

Make sure your Node.js version must 14.18+
Firebase configs
Youtube API
