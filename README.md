# Mini LMS Portal

This project is a mini Learning Management System (LMS) built using the MERN stack.  
It includes authentication, role-based access, student result management, and dashboards for both teachers and students.

## Features

### Authentication
- Login and registration using email and password
- Google OAuth login
- JWT-based authentication
- Role-based access for Teacher and Student

### Teacher Features
- View all students
- Add results for students
- Update existing student results
- View all results

### Student Features
- View personal profile
- View own results by subject
- View grades and scores

### Frontend
- Built with React and Vite
- Tailwind CSS for styling
- Context API for state management
- Clean and responsive UI

### Backend
- Built with Node.js and Express
- MongoDB database using Mongoose
- Protected API routes with JWT


## Project Structure
project/
├──  Frontend (React)
├──  Backend (Node.js, Express)

**API routes overview**

1. Auth Routes (/api/auth)

POST /api/auth/register
Register a new user (teacher or student)

POST /api/auth/login
Login using email + password

POST /api/auth/google
Google OAuth (Sign-in with Google)

GET /api/auth/me
Get logged-in user details (Requires token)


2. Students Routes (/api/students)


GET /api/students
Get list of all students (Teacher only)
Optional Query:
search= → name/email search


3. Results Routes (/api/results)


POST /api/results
Add student result (Teacher only)

PUT /api/results/:id
Update result by ID (Teacher only)

GET /api/results
Get all results
Query Options:
studentId=
subject=
GET /api/results/my

Get logged-in student's own results (Student only)
GET /api/results/:id
Get specific result (Teacher or owner only)

DELETE /api/results/:id
Delete result by ID (Teacher only)


4. Profile Routes (/api/profile)


GET /api/profile
Get logged-in user profile + student results

PUT /api/profile
Update name / avatar


__Backend Setup__

1. Navigate to the backend folder:
```bash
cd backend
```
2. Install dependencies:
```
npm install
```
3. Create a .env file using .env.example:
```
PORT=5000
MONGO_URI=mongodb+srv://razamrauf:razamrauf1@cluster0.4joh19s.mongodb.net/?appName=Cluster0
JWT_SECRET=jdahasjd328dnuwi
GOOGLE_CLIENT_ID=589132323824-maappee06g33eqsicoia7t7evser1ocu.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
FRONTEND_URL=http://localhost:5173
```
4. Start the backend server:
```
npm run start
```
Server runs on http://localhost:5000



__Frontend Setup__

1. Navigate to the frontend folder:
```
cd frontend
```
2. Install dependencies:
```
npm install
```
3. Create a .env file using .env.example:
```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=589132323824-maappee06g33eqsicoia7t7evser1ocu.apps.googleusercontent.com

```
4. Start the frontend server:
```
npm run dev
```

Frontend runs on http://localhost:5173
your code ends here



__Dummy credentials :__

Teacher :

Email: teacher@test.com
Password: teacher@test

Student :

Email: student@test.com
Password: student@test

## Project Screen Shots
![1 login](https://github.com/user-attachments/assets/d29eb8d1-e39e-43fb-954a-5e945f39e9be)

![2 signup](https://github.com/user-attachments/assets/cad2f3b7-147e-4a28-b147-573bc50c7649)

![3 logout](https://github.com/user-attachments/assets/cca1570c-f4bf-429b-a84a-6c483e1fd608)

![4 student dashboard](https://github.com/user-attachments/assets/df6e05a1-ea96-4998-a84d-313d512958f2)

![5 teacher dashboard 1](https://github.com/user-attachments/assets/6ba26c45-af90-4269-a62e-ee6f8f979665)

![6 teacher dashboard 2](https://github.com/user-attachments/assets/73a469a5-1940-4dd3-8f10-ff3668a1124b)

![7 teacher results](https://github.com/user-attachments/assets/580889d1-1fe7-447b-a1a0-fb38a7c3ff45)
