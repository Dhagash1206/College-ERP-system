# College ERP System

A full-featured college management system built with the Django framework. It provides a unified platform for students, teachers, and administrators to manage academic operations — including attendance tracking, marks management, and timetable scheduling.

This project follows Django's **MVT (Model-View-Template)** architecture.

- **Model** — defines the database structure; each class maps to a table (`Student`, `Teacher`, `Attendance`)
- **View** — handles business logic, processes incoming requests, and queries the database
- **Template** — renders the final HTML returned to the browser
- **URL Router** — maps endpoint paths to their corresponding views

**Request flow:**
`Browser` → `urls.py` → `views.py` → `models.py` → `template` → `HTML response`

Django's clean separation of data, logic, and presentation keeps each portal —
Admin, Teacher, and Student — modular, secure, and independently maintainable.

> Built with Python & Django | Role-based access | Admin, Teacher, and Student portals

<br>

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Login Credentials](#login-credentials)
- [API Endpoints](#api-endpoints)

---
<br>
<br>

## Overview

The College ERP System is designed to digitize and simplify day-to-day college operations. It eliminates paperwork by providing a centralized dashboard for each user role:

- **Admins** manage all data through Django's built-in admin panel
- **Teachers** mark attendance, enter marks, and set timetables
- **Students** view their academic records in real time

This project is ideal as a foundation for a production-grade institution management system.

---
<br>
<br>

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Language   | Python 3                          |
| Framework  | Django                            |
| Frontend   | React 19 + Material UI (MUI)    |
| Database   | SQLite (dev) / PostgreSQL (prod)  |
| Styling    | MUI theme (no custom CSS files) |
| APIs       | Django REST Framework + session |

---
<br>
<br>

## Features

### Teacher Portal
- Mark and update student attendance per subject
- Enter and update marks for each student
- View and manage class timetable
- Dashboard overview of assigned subjects and classes

### Student Portal
- View subject-wise attendance percentage
- Check marks for each subject and exam
- Access class timetable
- Clean, read-only dashboard for personal academic data

### Admin Panel
- Full CRUD access on all models via Django Admin
- Manage users (students and teachers), subjects, classes, and timetables
- Bulk data operations supported through the admin interface

---
<br>
<br>

## Project Structure

```
College-ERP-master/
├── CollegeERP/                 # Django project settings
│   ├── settings.py
│   ├── urls.py                 # Root URL routing
│   └── wsgi.py
│
├── info/                       # Main application
│   ├── models.py               # Database models
│   ├── admin.py                # Admin registrations
│   ├── web_urls.py             # Web UI routes (student / teacher / admin)
│   ├── urls.py                 # App URL entry (web + API)
│   ├── api/                    # REST API (DRF + Djoser)
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── views/                  # Web views by role
│   │   ├── auth.py             # Login flows, add user
│   │   ├── student.py
│   │   └── teacher.py
│   ├── templates/spa.html      # Minimal shell for React
│   └── static/app/             # Built React bundle (after npm run build)
│
├── frontend/                   # React + MUI source (Vite)
│   ├── src/
│   └── package.json
│
├── manage.py
├── requirements.txt
└── README.md
```

---


<br>
<br>

## API Endpoints

| Endpoint                  | Method | Description                        | Access  |
|---------------------------|--------|------------------------------------|---------|
| `/`                       | GET    | Role-based home dashboard          | Auth    |
| `/accounts/login/`        | GET    | React login page                   | Public  |
| `/api/web/login/`         | POST   | Session login (JSON)               | Public  |
| `/api/web/me/`            | GET    | Current user profile               | Auth    |
| `/api/details/`           | GET    | Student profile (token auth)       | Student |
| `/api/attendance/`        | GET    | Attendance summary                 | Student |
| `/api/marks/`             | GET    | Marks summary                      | Student |
| `/api/timetable/`         | GET    | Class timetable                    | Student |
| `/api/auth/`              | *      | Djoser token authentication        | Public  |
| `/admin/`                 | GET    | Django admin panel                 | Admin   |

> Web routes for teachers and students are in `info/web_urls.py`. API routes are in `info/api/urls.py`.

---

<br>
<br>

### Prerequisites

Make sure you have the following installed:

- Python 3.8 or higher
- pip (Python package manager)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Dhagash1206/College-ERP-system.git
cd College-ERP-master
```

### 2. Create a Virtual Environment (Recommended)

```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

> If `requirements.txt` is missing, install Django manually:
> ```bash
> pip install django
> ```

### 4. Apply Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create a Superuser (Admin Access)

```bash
python manage.py createsuperuser
```

Follow the prompts to set your admin username and password.

### 6. Build the React Frontend

```bash
cd frontend
npm install
npm run build
cd ..
```

This compiles the UI into `info/static/app/` (served by Django).

### 7. Run the Development Server

```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000` in your browser (login at `/accounts/login/`).
Admin panel is available at `http://127.0.0.1:8000/admin`.

After changing React code, run `npm run build` again inside `frontend/`.

---

<br>
<br>

## Login Credentials

The login page is shared between students and teachers. Role is determined automatically based on the user type.

| Role    | Example Username | Password     |
|---------|------------------|--------------|
| Student | `samarth`        | `project123` |
| Teacher | `trisila`        | `project123` |
| Admin   | *(your choice)*  | *(set via createsuperuser)* |

> **Note:** All demo users share the default password `project123`. Change these before deploying to production.

---

<br>
<br>

# System View

![Student Dashboard](https://i.imgur.com/isL9cjz.png)

<br>
<br>


![Teacher Timetable](https://i.imgur.com/HQlLYmC.png)

<br>
<br>

![Teacher View 5](https://i.imgur.com/j6RyBmU.png)

<br>
<br>

![Teacher View 7](https://i.imgur.com/4Rl7Fpv.png)

<br>
<br>

![Student Marks](https://i.imgur.com/7zWhHZx.png)

<br>
<br>

<img width="1601" height="489" alt="image" src="https://github.com/user-attachments/assets/5341864f-d3af-40de-87e7-8a950c4464fb" />


<br>
<br>


![Student View 5](https://i.imgur.com/NZqU268.png)


<br>
<br>

![Admin Models](https://i.imgur.com/tMKWx6f.png)

<br>
<br>

---
<br>
<br>

# Deployment Notes

For production deployment, consider the following:

- Switch from SQLite to PostgreSQL or MySQL in `settings.py`
- Set `DEBUG = False` and configure `ALLOWED_HOSTS`
- Use `gunicorn` as the WSGI server behind `nginx`
- Store secrets (secret key, DB passwords) in environment variables or a `.env` file using `python-decouple`
- Collect static files: `python manage.py collectstatic`

---
<br>
<br>


## License

This project is open source and available under the [MIT License](LICENSE).

---
