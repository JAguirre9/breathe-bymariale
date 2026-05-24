Breathe Application
A modern full-stack web application built using the TanStack Start framework, featuring internationalization (i18n) capabilities and database persistence powered by Neon Serverless PostgreSQL.

Features
Full-Stack Architecture: Server-side operations and client-side rendering handled natively through TanStack Start and Vinxi.

Serverless Database: Data persistence using SQL operations executed directly against a Neon PostgreSQL database instance.

Internationalization: Multi-language user interface support built directly into the client-side rendering pipeline via translation hooks.

Secure Authentication Flow: Robust backend validation handling user registration and secure credential checking.

Tech Stack
Framework: TanStack Start (React)

Bundler/Dev Server: Vinxi / Vite

Database Provider: Neon Serverless PostgreSQL

Query Builder: Postgres.js (Raw SQL execution)

Database Schema Manager: Prisma (Schema definitions only)

Styling: Tailwind CSS / Shadcn UI

Directory Layout
Plaintext


├── .env                         # Environment variables configuration
├── prisma/
│   └── schema.prisma            # Database models definitions
└── src/
    ├── components/              # Reusable UI layout elements
    ├── lib/
    │   ├── db.server.ts         # Database driver initialization
    │   ├── db.functions.ts      # Server-side functions (Server Functions)
    │   └── i18n.ts              # Internationalization configuration
    ├── routes/
    │   ├── login.tsx            # Login page component
    │   ├── signup.tsx           # Signup page component
    │   └── __root.tsx           # Application root layout
    └── server.ts                # Application entry point / interceptor
Prerequisites
Before setting up the project locally, ensure you have the following installed:

Node.js (Version 18 or higher recommended)

npm or your preferred package manager

A registered account and database project inside the Neon Console

Environment Variables Configuration
Create a .env file in the root directory of your project. Add your database connection string obtained from your Neon dashboard:

Code snippet

DATABASE_URL="postgresql://user:password@your-neon-host.postgres.neon.tech/neondb?sslmode=require"
Installation and Setup
Clone the repository to your local machine.

Install the required project dependencies:

Bash

npm install
Ensure your local code structure matches the schema definitions. If changes are made to the database state, push the changes using Prisma commands:

Bash

npx prisma db push
Launch the local development server:

Bash

npm run dev
The application will normally be accessible at http://localhost:8080.

Core Implementations Detail
Server Functions Execution
Database interactions bypass traditional API routing structures. Operations such as signUpUserFn and logInUserFn utilize TanStack createServerFn constructs. This executes code exclusively on the server layer, securing queries against frontend inspection.

SQL Quoting and Schema Compliance
Database queries explicitly wrap target relations and fields in double quotes (e.g., "Usuario", "email"). This guarantees that case-sensitive identifiers generated via Prisma models correspond correctly with Postgres specifications during raw SQL text queries.
