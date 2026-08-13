# CAPSTONE - REVIER

A full-stack recruitment and hiring platform for managing job postings, applicants, interviews, onboarding, and administrative reporting. The project is split into three main parts:

- Client app for applicants
- Admin dashboard for HR and recruitment staff
- Backend API and database layer

## Overview

This system allows companies to:

- publish and manage job openings
- review applicant profiles and applications
- track interview, hiring, rejection, and blacklist statuses
- send OTP and email-based verification workflows
- manage orientations and attendance records
- generate reports and dashboard insights

It is built as a monorepo with a React frontend for the applicant and admin experience, and an Express/Sequelize backend that connects to MySQL.

## Features

### Applicant portal

- user registration and login
- profile updates and application management
- job browsing and application submission
- email and OTP verification flow
- password reset and change password
- notifications and real-time messaging support

### Admin dashboard

- manage admins, companies, and jobs
- review applicant records and details
- schedule interviews and handle interview outcomes
- track hired, rejected, and blacklisted applicants
- manage orientation events and attendance
- view reports and dashboard analytics
- export reports to document formats

### Backend capabilities

- REST API for core recruitment workflows
- JWT authentication and cookie-based session handling
- MySQL database with Sequelize ORM
- Cloudinary upload support for files and images
- socket.io real-time events
- rate limiting and email notifications

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Admin UI: React dashboard components and charting utilities
- Backend: Node.js, Express.js
- Database: MySQL with Sequelize
- Real-time: Socket.IO
- Authentication: JWT, cookies
- File handling: Multer, Cloudinary
- Email: Resend / Nodemailer integration

## Project Structure

```bash
.
├── admin/               # Admin dashboard frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.*
├── client/              # Applicant-facing frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.*
├── server/              # Backend API and database configuration
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── cron/
│   ├── server.js
│   └── package.json
├── package.json         # Root scripts for running all apps together
├── package-lock.json
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- npm
- MySQL database running locally or in a hosted environment

## Installation

From the project root, install dependencies for each app:

```bash
npm install
npm install --prefix server
npm install --prefix admin
npm install --prefix client
```

## Environment Variables

Create a `.env` file inside the `server` folder with the following variables:

```env
PORT=8000
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=your_resend_api_key
RESEND_EMAIL=your_verified_sender_email
SEED_DATA=false
NODE_ENV=development
```

Create `.env` files in `client` and `admin` if you want to override the default backend URL:

```env
VITE_BACKEND_URL=http://localhost:8000
```

## Running the Project

### Start all apps together

```bash
npm run dev
```

This runs the backend, admin app, and client app concurrently.

### Run individual services

```bash
npm run server --prefix server
npm run dev --prefix admin
npm run dev --prefix client
```

## Default App URLs

- Client app: http://localhost:5173
- Admin app: http://localhost:5174
- API server: http://localhost:8000

## Notes

- The backend automatically syncs database models on startup with Sequelize.
- If `SEED_DATA=true`, the server can seed initial data during startup.
- The project uses real-time Socket.IO communication for live message and notification events.

## License

This project is currently provided as a capstone project for development and evaluation purposes.
