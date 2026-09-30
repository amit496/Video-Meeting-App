# Video Meeting App
A full-stack real-time video meeting web application built with **React, Vite, Tailwind CSS, Node.js, Express, Socket.IO, WebRTC, Prisma, and PostgreSQL**.

The project includes authentication, meeting functionality, real-time communication, chat, and a scalable backend structure.

## Features
* User registration and login
* Authentication with protected routes
* Real-time video meetings
* WebRTC-based peer-to-peer communication
* Socket.IO real-time signaling
* Real-time chat
* PostgreSQL database
* Prisma ORM
* React frontend
* Tailwind CSS UI
* Node.js + Express backend
* REST API architecture
* Environment-based configuration
* MVC-based backend structure

## Tech Stack

### Frontend
* React 19
* Vite
* Tailwind CSS
* JavaScript
* Fetch API

### Backend
* Node.js
* Express 5
* Socket.IO
* WebRTC
* Zod
* ES Modules

### Database
* PostgreSQL
* Neon PostgreSQL
* Prisma ORM 7

# Project Structure

Video-Meeting-App/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── lib/
│   │   ├── generated/
│   │   ├── app.js
│   │   ├── server.js
│   │   └── socket.js
│   │
│   ├── .env
│   ├── package.json
│   └── prisma.config.ts
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── PROJECT_STATUS_REPORT.md
└── README.md

# Requirements
Before running the project, install the following software:

* Node.js 20+ recommended
* npm
* Git
* PostgreSQL database

You can use either:

* Local PostgreSQL
* Neon PostgreSQL

For this project, Neon PostgreSQL can be used as the hosted database.

Check Node.js and npm:

node -v
npm -v


Check Git:

git --version



# 1. Clone the Repository

Clone the project from GitHub:

git clone https://github.com/amit496/Video-Meeting-App.git

Enter the project directory:

cd Video-Meeting-App

# 2. Backend Setup

Open a terminal inside the project root and go to the backend:

cd backend

Install backend dependencies:

npm install

# 3. Backend Environment Variables

Create a `.env` file inside:

backend/.env

Add the required environment variables.

Example:

DATABASE_URL="your_postgresql_database_url"
PORT=5000

### DATABASE_URL

`DATABASE_URL` must contain your PostgreSQL connection string.

For Neon, copy the connection string provided by your Neon project.

Example format:

DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

Do not commit your real `.env` file to GitHub.

The `.gitignore` file already excludes environment files.

# 4. Database Setup

This project uses PostgreSQL + Prisma ORM.

After configuring `DATABASE_URL`, generate the Prisma Client:

npx prisma generate

Run the database migrations:

npx prisma migrate deploy

For development, if you create new Prisma schema changes and want Prisma to create/apply a migration:

npx prisma migrate dev

You can validate the Prisma schema with:

npx prisma validate

# 5. Prisma Database Structure

The Prisma schema is located at:

backend/prisma/schema.prisma

Prisma migrations are stored in:

backend/prisma/migrations/

The project uses PostgreSQL as the database provider.

# 6. Start the Backend

From the `backend` directory:

npm run dev

The backend API runs on:

http://localhost:5000

The API base URL is:

http://localhost:5000/api

If the project has a health endpoint, you can verify that the backend is running by opening:

http://localhost:5000/health

# 7. Frontend Setup

Open a new terminal.

From the project root:

cd frontend

Install frontend dependencies:

npm install

# 8. Frontend API Configuration

The frontend communicates with the backend API.

The current development API URL is:

http://localhost:5000/api

The authentication service uses this API base URL for registration, login, and authenticated user requests.

If the backend is running on another host or port, update the frontend API configuration accordingly.

# 9. Start the Frontend

From the `frontend` directory:

npm run dev

Vite will provide the local frontend URL, normally:

http://localhost:5173

Open that URL in your browser.

# 10. Running the Complete Project

You need two terminals.

### Terminal 1 — Backend

cd Video-Meeting-App/backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev

Backend:


http://localhost:5000


### Terminal 2 — Frontend

cd Video-Meeting-App/frontend
npm install
npm run dev

Frontend:

http://localhost:5173

# 11. First-Time Setup

After cloning the project, the recommended order is:

1. Clone repository
        ↓
2. Install Node.js
        ↓
3. Configure PostgreSQL / Neon
        ↓
4. Create backend/.env
        ↓
5. Install backend dependencies
        ↓
6. Generate Prisma Client
        ↓
7. Run database migrations
        ↓
8. Install frontend dependencies
        ↓
9. Start backend
        ↓
10. Start frontend
        ↓
11. Open the frontend in browser

# 12. Authentication

The application provides authentication functionality including:

* User registration
* User login
* Current authenticated user
* Protected backend routes
* Request validation

Authentication-related backend code is organized inside the backend authentication modules.

# 13. Real-Time Communication

The meeting system is designed around:

### WebRTC

Used for real-time peer-to-peer audio/video communication.

### Socket.IO
Used for real-time signaling and application events required for meeting communication.

The browser establishes WebRTC connections while Socket.IO handles the signaling communication between participants.

# 14. Chat
The application also includes real-time communication functionality for meeting participants.

The frontend and backend communicate through the application's real-time Socket.IO layer.

# 15. Production Build

### Frontend
From the frontend directory:

npm run build

The production build is generated in:

frontend/dist/

To preview the production build:

npm run preview

### Backend
The backend should be configured with production environment variables and a production PostgreSQL database before deployment.

# 16. Important Environment Variables
The backend currently requires:

| Variable       | Description                  | Example            |
| -------------- | ---------------------------- | ------------------ |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `PORT`         | Backend server port          | `5000`             |

Keep production credentials private.

Never upload:

.env

or database passwords/API secrets to GitHub.

# 17. Useful Prisma Commands
Generate Prisma Client:

npx prisma generate

Validate Prisma schema:

npx prisma validate

Apply existing migrations:

npx prisma migrate deploy

Create a development migration:

npx prisma migrate dev

Open Prisma Studio:

npx prisma studio

# 18. Troubleshooting

### Backend does not start
Check that dependencies are installed:

cd backend
npm install

Check that `.env` exists:

backend/.env

Check the database connection:

npx prisma validate

Then regenerate Prisma Client:

npx prisma generate

### Database connection error
Check:

DATABASE_URL="your_database_connection_string"


Make sure:

* PostgreSQL database exists
* Database URL is correct
* Username is correct
* Password is correct
* Host is correct
* SSL configuration is correct for your provider

For Neon PostgreSQL, use the connection string provided by Neon.

### Frontend cannot connect to backend
Make sure the backend is running:

npm run dev

Backend should normally be available at:

http://localhost:5000

Check that the frontend API configuration points to:

http://localhost:5000/api

### Prisma Client error
Run:

npx prisma generate

Then restart the backend:

npm run dev

# 19. Security Notes
This project is intended for development, learning, demonstration, and portfolio purposes.

Before production deployment, additional production hardening should be considered, including:

* Secure authentication configuration
* HTTPS
* Production CORS configuration
* Rate limiting
* Secure cookies/tokens
* Input validation
* Logging and monitoring
* Production database configuration
* WebRTC/STUN/TURN configuration
* Environment secret management

# 20. Development
If you want to contribute or continue development:

git clone https://github.com/amit496/Video-Meeting-App.git
cd Video-Meeting-App

Set up the backend and frontend following the instructions above.

Create a new branch:

git checkout -b feature/your-feature-name

After making changes:

git add .
git commit -m "Add your feature"
git push origin feature/your-feature-name

# 21. Project Status
This project is under active development.

Current development areas include:

* Authentication
* Dashboard
* Meeting functionality
* Real-time communication
* Chat
* WebRTC integration
* Backend API development
* Database integration

More features and improvements will be added as development continues.

# License
This project is currently intended as a portfolio and learning project.

A formal open-source license can be added when the project is ready for external contributions and redistribution.
