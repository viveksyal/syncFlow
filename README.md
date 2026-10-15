# SyncFlow — Kanban Board API

A Kanban board REST API built with Node.js, Express, TypeScript, Prisma, and PostgreSQL. SyncFlow supports authentication, board management, list and card operations, and position-based ordering.

**Status:** Backend implemented · Frontend in development

## Tech Stack

- Node.js & Express.js
- TypeScript
- PostgreSQL & Prisma ORM
- Zod for request validation
- JWT & HTTP-only cookies for authentication
- bcrypt for password hashing

## Features

- User registration, login, and logout
- JWT-based authentication
- Protected routes and resource ownership checks
- Board CRUD operations
- List CRUD and reordering
- Card CRUD and reordering
- Moving cards between lists
- Centralized error handling
- Relational database design

## Architecture

```text
Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Services
  ↓
Prisma ORM
  ↓
PostgreSQL
```

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout |
| GET / POST | `/api/boards` | List or create boards |
| GET / PATCH / DELETE | `/api/boards/:boardId` | Retrieve, update, or delete a board |
| POST / GET | `/api/boards/:boardId/lists` | Create or retrieve lists |
| PATCH / DELETE | `/api/lists/:listId` | Update or delete a list |
| PATCH | `/api/lists/reorder` | Reorder lists |
| POST / GET | `/api/lists/:listId/cards` | Create or retrieve cards |
| PATCH / DELETE | `/api/cards/:cardId` | Update or delete a card |
| PATCH | `/api/cards/reorder` | Reorder cards |
| PATCH | `/api/cards/move` | Move cards between lists |

## Getting Started

### Prerequisites

- Node.js and npm
- PostgreSQL database

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/syncflow.git
cd syncflow/backend
npm install
```

Configure the environment variables required by the project in your `.env` file, including the database connection and JWT secret.

Apply database migrations using the command configured for your Prisma version, then start the development server:

```bash
npm run dev
```

Check the health endpoint at `GET /health` on your configured server.

## Project Structure

```text
backend/
├── prisma/
├── src/
│   ├── controllers/
│   ├── lib/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── app.ts
│   └── server.ts
└── package.json
```

Built as a hands-on project to practice backend engineering, REST API design, authentication, and database management.
