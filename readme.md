# Passport Authentication System

A simple, modular authentication system built with **Express.js**, **TypeScript**, **Passport.js**, **MongoDB (Mongoose)**, **Redis/RedisStore**, and **Bun**. This project demonstrates industry-standard practices for implementing authentication with local and social logins (Google & Facebook) while maintaining clean architecture and code reusability.

## Features

- **TypeScript + Express.js** backend
- **Bun** as the runtime and package manager
- **MongoDB with Mongoose** for database operations
- **Redis/RedisStore** for session and token management
- **Modular folder structure** for scalability
- **Passport.js** integration for:
  - Local authentication
  - Google OAuth2
  - Facebook OAuth

- **JWT Authentication** with Refresh Tokens
- **Session-based Logout with Redis**
- **Change Password & Logout** functionality
- **Zod-based validation** for request bodies
- **Global Error Handling**
  - Custom `AppError`
  - Zod error handler
  - Mongoose error handler

- **Route Not Found** handler
- **Reusable Utilities**
  - `catchAsync` for wrapping async controllers
  - `sendResponse` for standardized responses

- **Environment Variable Validation** using Zod
- **Scalable Project Structure** for easy future extension

---

## Project Structure

```
public/                # Serve the static HTML files
src/
 ├─ app/
 │   ├─ config/        # Configurations
 │   ├─ errors/        # Custom and global error handlers
 │   ├─ interface/     # TypeScript interfaces
 │   ├─ middlewares/   # Auth, validation & error-handling middleware
 │   └─ modules/       # Controller, Service, Route, Utils, Validation etc
 ├─ routes/            # Centralized route management
 ├─ utils/             # Utility functions
 ├─ app.ts             # Express app configuration
 └─ server.ts          # Server entry point
```

---

## API Endpoints

### **Auth Routes**

| Method | Endpoint                      | Description                              |
| ------ | ----------------------------- | ---------------------------------------- |
| POST   | `/api/auth/register`          | Register a new user                      |
| POST   | `/api/auth/login`             | Login user and issue JWT                 |
| POST   | `/api/auth/change-password`   | Change user password (Auth required)     |
| POST   | `/api/auth/refresh-token`     | Get new access token using refresh token |
| POST   | `/api/auth/logout`            | Logout user and invalidate session       |
| GET    | `/api/auth/google`            | Initiate Google OAuth                    |
| GET    | `/api/auth/callback/google`   | Google OAuth callback                    |
| GET    | `/api/auth/facebook`          | Initiate Facebook OAuth                  |
| GET    | `/api/auth/callback/facebook` | Facebook OAuth callback                  |

### **Postman Collection**

You can explore and test the APIs using this [Postman Collection](https://www.postman.com/maintenance-astronaut-37077463/workspace/sm-noushan/collection/34818425-d1fc8daf-0560-4f12-b3ae-1b8df64271da?action=share&source=copy-link&creator=34818425).

---

## Installation & Setup (Bun)

1. **Clone the repository**

```bash
git clone https://github.com/sm-noushan/authentication-with-passportjs
cd authentication-with-passportjs
```

2. **Install dependencies**

```bash
bun install
```

3. **Configure environment variables**

Create a `.env` file based on `.env.example`:

```env
PORT=5000
DB_URL=your_mongodb_connection_string
etc.

# Check .env.example for required environment variables
```

4. **Run the project**

```bash
bun run start:dev   # Development
bun run build       # Production build
bun start:prod      # Run production
```

Make sure **MongoDB** and **Redis** are running locally or provide cloud connection URLs (e.g., MongoDB Atlas, Redis Cloud).

---

## Development Practices

- **Mongoose** is used to interact with MongoDB.
- **Redis/RedisStore** is used to store sessions.
- **Error handling** is centralized using a **global error handler**.
- **Zod** ensures strict request validation.
- **Passport strategies** are isolated for easy management.
- **Async functions** are wrapped using `catchAsync` to avoid repetitive try-catch blocks.
- **sendResponse** provides consistent API responses.
- **Environment variables** are validated at startup to prevent misconfiguration.

---

## License

This project is licensed under the **MIT License**. You are free to use and modify it for personal or commercial projects.
