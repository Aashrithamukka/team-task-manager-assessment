Team Task Manager

Tech Stack:
React.js, Java, Spring Boot, MongoDB Atlas, JWT Authentication, Role-Based Access Control, REST APIs, Railway, GitHub

Features:
- Signup and login
- Admin and Member roles
- Project and team management
- Task creation, assignment, and status tracking
- Dashboard for total, todo, in-progress, completed, and overdue tasks

Deployment:
The project includes a root Dockerfile for Railway. Railway can build the React frontend, copy it into the Spring Boot backend, and run the full-stack app as one service.

Required Railway Environment Variables:
MONGODB_URI=<MongoDB Atlas connection string>
JWT_SECRET=<long secure JWT secret>
CORS_ALLOWED_ORIGINS=<Railway live app URL>

Demo Flow:
1. Signup as Admin.
2. Signup as Member.
3. Login as Admin.
4. Create a project and add the Member.
5. Create a task and assign it to the Member.
6. Login as Member.
7. Update task status.
8. Show dashboard progress changes.
