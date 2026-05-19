# 📋 Task Management Web Application

A simple and responsive **Internship & Task Management Web App** built using **React, Node.js, Express, and MongoDB**.
This application supports **role-based access (Admin & Student)** with a clean and minimal UI.

---

## 🚀 Features

### 🔐 Authentication

* Login system
* Default demo accounts:

  * **Admin:** [admin@test.com](mailto:admin@test.com) / 1234
  * **Student:** [user@test.com](mailto:user@test.com) / 1234
* Student-only registration

---

### 👤 User Roles

#### 👑 Admin

* View all students
* Create tasks
* Assign tasks to:

  * Single student
  * Multiple students
  * All students
* View all tasks
* Delete tasks

#### 🎓 Student

* Register account
* Login
* View assigned tasks only
* Cannot create or delete tasks

---

### 📌 Task Management

* Create tasks with:

  * Title
  * Description
  * Deadline
* Assign tasks to multiple users
* Track task status (pending/completed)

---

### 🎨 UI/UX

* Clean and minimal design
* Responsive for mobile and desktop
* Simple navigation
* Role-based dashboards

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* CSS (Flexbox/Grid)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

---

## 📂 Project Structure

```
Task-1/
│── client/       # React frontend
│── server/       # Node.js backend
│── .gitignore
│── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/YOUR_USERNAME/task-management-app.git
cd task-management-app
```

---

### 2️⃣ Setup Backend

```
cd server
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Setup Frontend

```
cd client
npm install
npm start
```

---

## 🌐 API Endpoints

### Auth

* `POST /api/auth/register` → Register (Student only)
* `POST /api/auth/login` → Login

### Tasks

* `GET /api/tasks` → Get tasks (role-based)
* `POST /api/tasks` → Create task (Admin only)
* `DELETE /api/tasks/:id` → Delete task (Admin only)

---

## 🔄 Application Workflow

1. User logs in
2. Role is identified (Admin / Student)
3. Redirect:

   * Admin → Admin Dashboard
   * Student → User Dashboard
4. Features shown based on role

---

## ⚠️ Notes

* This project uses **basic authentication (no JWT)** for simplicity
* Backend APIs are not protected (suitable for demo/internship use)
* Can be upgraded to JWT for production-level security

---

## 📸 Demo Credentials

```
Admin:
Email: admin@test.com
Password: 1234

Student:
Email: user@test.com
Password: 1234
```

---

## 🚀 Future Improvements

* Add JWT authentication
* Add task status update by students
* Improve UI with component libraries
* Add notifications / real-time updates

---

## 🙌 Author

Developed as part of an internship task to demonstrate:

* Full-stack development
* API integration
* Role-based access control
* Clean UI/UX design

---

⭐ If you like this project, feel free to star the repository!
