# REVIER (Capstone Project)

A full-stack recruitment and hiring platform for managing job postings, applicants, interviews, onboarding, and administrative reporting. **REVIER** is split into three main parts:

- **Client** — applicant-facing portal
- **Admin** — HR and recruitment dashboard
- **Server** — REST API, MySQL database, and real-time services

## Overview

This system allows companies to:

- publish and manage job openings
- review applicant profiles and applications through a hiring pipeline
- schedule interviews, orientations, and attendance tracking
- manage hired, rejected, and blacklisted applicants
- send OTP and email-based verification workflows
- customize public homepage and contact content
- generate reports and dashboard insights

The project is a monorepo with React frontends (Vite) for the applicant and admin experiences, and an Express/Sequelize backend connected to MySQL.

## Features

### Applicant portal

- user registration, login, and profile management
- job browsing, saved jobs, and application submission
- application status tracking and notifications
- email and OTP verification
- password reset and change password
- public homepage with dynamic hero, how-it-works, and contact sections
- dedicated contact page with form validation
- real-time messaging via Socket.IO

### Admin dashboard

- role-based access for **HR Manager** and **HR Associate**
- manage admins, companies, and jobs (including archive and restore)
- applicant pipeline: new, interview, orientation, hired, rejected, and blacklisted
- schedule, reschedule, and record interview outcomes
- manage orientation events and attendance
- dashboard analytics and recruitment reports
- export reports to Word and PowerPoint
- system content editor for public homepage sections (HR Manager only)
- admin activity logs (HR Manager only)

### Backend capabilities

- REST API for core recruitment workflows
- JWT authentication with HTTP-only cookies
- MySQL database with Sequelize ORM
- Cloudinary upload support for files and images
- Socket.IO for real-time notifications and messaging
- rate limiting and transactional email via Resend
- scheduled OTP cleanup via node-cron

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Client | React 19, Vite 7, Tailwind CSS 4, DaisyUI, React Router, Zod, EmailJS, Leaflet, Socket.IO Client |
| Admin | React 19, Vite 7, Tailwind CSS 4, DaisyUI, Recharts, docx, pptxgenjs, Socket.IO Client |
| Server | Node.js, Express 5, Sequelize, MySQL, JWT, Multer, Cloudinary, Resend, Socket.IO, node-cron |

## Project Structure

```bash
.
├── admin/               # Admin dashboard frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── client/              # Applicant-facing frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/              # Backend API and database layer
│   ├── config/
│   ├── controllers/
│   ├── cron/
│   ├── emailTemplates/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── package.json         # Root scripts for running all apps together
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- npm
- MySQL database (local or hosted)
- Cloudinary account (for file/image uploads)
- Resend account (for transactional email)
- EmailJS account (for public contact form submissions on the client)

## Installation

From the project root, install dependencies for each app:

```bash
npm install
npm install --prefix server
npm install --prefix admin
npm install --prefix client
```

Configure the admin dev server to use port `5174` so it does not conflict with the client. In `admin/vite.config.js`:

```js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
  },
});
```

## Environment Variables

### Server (`server/.env`)

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

### Client and Admin (`client/.env`, `admin/.env`)

```env
VITE_BACKEND_URL=http://localhost:8000
```

### Client only — EmailJS (`client/.env`)

Required for contact form submissions on the homepage and `/contact` page:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
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

### Production build (frontends)

```bash
npm run build --prefix client
npm run build --prefix admin
```

Both frontends include `vercel.json` for SPA routing when deployed to Vercel.

## Default App URLs

| App | URL |
| --- | --- |
| Client | http://localhost:5173 |
| Admin | http://localhost:5174 |
| API | http://localhost:8000 |

## Seed Data

Set `SEED_DATA=true` in `server/.env` before starting the server to populate sample data on startup. Default seeded admin accounts (password for both: `Password@123`):

| Role | Email |
| --- | --- |
| HR Manager | hrmanager@revier.com |
| HR Associate | hrassociate@revier.com |

## API Overview

All routes are prefixed under `/api`:

| Route | Purpose |
| --- | --- |
| `/api/admin` | Admin accounts and authentication |
| `/api/company` | Company management |
| `/api/job` | Job postings |
| `/api/user` | Applicant users and profiles |
| `/api/otp` | OTP verification flows |
| `/api/applicants` | Applicant records |
| `/api/new` | New applicant pipeline |
| `/api/interview` | Interview scheduling and outcomes |
| `/api/orientations` | Orientation events and attendance |
| `/api/hired` | Hired applicants |
| `/api/rejected` | Rejected applicants |
| `/api/blacklist` | Blacklisted applicants |
| `/api/dashboard` | Dashboard metrics |
| `/api/reports` | Report generation |
| `/api/systemContent/home` | Public homepage content |

## Notes

- The backend syncs Sequelize models on startup.
- Socket.IO is used for live notifications and in-app messaging.
- Admin routes enforce role checks: some pages (Admins, System Content) are restricted to HR Manager.
- Set `NODE_ENV=production` in deployment so auth cookies use secure, cross-site settings.

## License

This project is provided as a capstone project for development and evaluation purposes.
