# Team Task Manager

Full-stack assessment project for creating projects, assigning tasks, and tracking team progress with role-based access.

## Tech Stack

- Frontend: React.js, CSS, Lucide React
- Backend: Java 17, Spring Boot, Spring Security
- Database: MongoDB Atlas
- Auth: JWT authentication
- Access Control: Admin and Member roles
- Deployment: Railway with Docker

## Features

- Signup and login
- Admin and Member roles
- Admin can create projects and assign members
- Admin can create tasks for project members
- Members can view and update their assigned tasks
- Dashboard with total, todo, in-progress, completed, and overdue task counts
- REST APIs with validation and MongoDB relationships by IDs

## Local Setup

### Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Environment Variables

For backend local/deployment:

```text
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/team_task_manager
JWT_SECRET=use-a-long-secure-secret-key-for-jwt-signing
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

For separate frontend deployment only:

```text
VITE_API_URL=https://your-backend-url
```

When using the included root Dockerfile on Railway, frontend and backend are served from the same Railway URL, so `VITE_API_URL` is not required.

## Railway Deployment

1. Push this project to GitHub.
2. Create a MongoDB Atlas database and copy the connection string.
3. Create a new Railway project from the GitHub repository.
4. Railway will use the root `Dockerfile`.
5. Add these Railway variables:

```text
MONGODB_URI=<your MongoDB Atlas URI>
JWT_SECRET=<long random secret>
CORS_ALLOWED_ORIGINS=<your Railway app URL>
```

6. Deploy and open the Railway-generated live URL.

## Demo Flow

1. Signup as `ADMIN`.
2. Signup as one or more `MEMBER` users.
3. Login as Admin.
4. Create a project and select member users.
5. Create tasks and assign them to members.
6. Login as Member.
7. Update task status.
8. Show dashboard counts changing.

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/users` Admin only
- `POST /api/projects` Admin only
- `GET /api/projects`
- `GET /api/projects/{projectId}/members`
- `POST /api/tasks` Admin only
- `GET /api/tasks`
- `PATCH /api/tasks/{taskId}/status`
- `GET /api/dashboard`
