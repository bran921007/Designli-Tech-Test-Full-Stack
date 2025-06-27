#  Designli Full-Stack Booking App

Thanks for reviewing my solution for Designli’s Full Stack Developer Challenge. This repository contains a booking app built with NestJS, Next.js, PostgreSQL, Prisma, Auth0, and Google Calendar integration.


##  Key Features

-  **Secure login** with Auth0 (Google sign-in & JWT).
-  **Conflict-free bookings** checked against:
  - Existing bookings in the database.
  - User’s Google Calendar events.
-  **Modern UI** with Next.js and Tailwind CSS.
-  **Automatic API docs** via Swagger.

---

## 🛠️ Tech Stack

| Area       | Technologies                                    |
|------------|-------------------------------------------------|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS       |
| **Backend**  | NestJS, TypeScript, Prisma, Passport.js        |
| **Database** | PostgreSQL                                     |
| **Auth**     | Auth0, JWT, Google OAuth                       |

---

##  Quick Start Guide

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)
- [Auth0](https://auth0.com/) account (with Google connection)
- Google Cloud Project (OAuth setup & Calendar API enabled)

### Backend setup

1. **Install dependencies**:
    ```bash
    cd backend
    npm install
    ```

2. **Configure environment**: Create `.env`:

    ```dotenv
    DATABASE_URL="postgresql://user:pass@localhost:5432/bookingdb"

    JWT_SECRET="your-jwt-secret"

    AUTH0_DOMAIN="your-auth0-domain"
    AUTH0_CLIENT_ID="auth0-client-id"
    AUTH0_CLIENT_SECRET="auth0-client-secret"

    GOOGLE_CLIENT_ID="google-client-id"
    GOOGLE_CLIENT_SECRET="google-client-secret"
    FRONTEND_URL="http://localhost:3001"
    ```

3. **Run database migrations & start server**:
    ```bash
    npx prisma migrate dev
    npm run start:dev
    ```

Backend runs on `http://localhost:3000`.

### Frontend setup

1. **Install dependencies**:
    ```bash
    cd frontend
    npm install
    ```

2. **Start frontend server**:
    ```bash
    npm run dev
    ```

Frontend runs on `http://localhost:3001`.

---

## 📖 API Docs

Interactive docs via Swagger at:
[http://localhost:3000/docs](http://localhost:3000/docs)
