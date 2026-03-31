# College ERP System

A full-featured college management system built with the Django framework. It provides a unified platform for students, teachers, and administrators to manage academic operations — including attendance tracking, marks management, and timetable scheduling.

> Built with Python & Django | Role-based access | Admin, Teacher, and Student portals

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Login Credentials](#login-credentials)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [License](#license)

---

## Overview

The College ERP System is designed to digitize and simplify day-to-day college operations. It eliminates paperwork by providing a centralized dashboard for each user role:

- **Admins** manage all data through Django's built-in admin panel
- **Teachers** mark attendance, enter marks, and set timetables
- **Students** view their academic records in real time

This project is ideal as a foundation for a production-grade institution management system.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Language   | Python 3                          |
| Framework  | Django                            |
| Frontend   | HTML5, CSS3, SCSS, JavaScript     |
| Database   | SQLite (dev) / PostgreSQL (prod)  |
| Styling    | Bootstrap + custom SCSS           |
| APIs       | Django REST-style views           |

---

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

## Project Structure

```
College-ERP-system/
│
├── CollegeERP/               # Django project settings and configuration
│   ├── settings.py           # Project settings (DB, installed apps, etc.)
│   ├── urls.py               # Root URL configuration
│   └── wsgi.py               # WSGI entry point for deployment
│
├── apis/                     # API views and URL routes
│   ├── views.py              # Core view logic for all roles
│   └── urls.py               # API endpoint routing
│
├── info/                     # Main app — models, forms, and logic
│   ├── models.py             # Database models (Student, Teacher, Marks, etc.)
│   ├── forms.py              # Django forms for data input
│   ├── admin.py              # Admin panel registrations
│   └── templates/            # HTML templates for all pages
│
├── manage.py                 # Django management CLI
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Python 3.8 or higher
- pip (Python package manager)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Dhagash1206/College-ERP-system.git
cd College-ERP-system
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

### 6. Run the Development Server

```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000` in your browser.
Admin panel is available at `http://127.0.0.1:8000/admin`.

---

## Login Credentials

The login page is shared between students and teachers. Role is determined automatically based on the user type.

| Role    | Example Username | Password     |
|---------|------------------|--------------|
| Student | `samarth`        | `project123` |
| Teacher | `trisila`        | `project123` |
| Admin   | *(your choice)*  | *(set via createsuperuser)* |

> **Note:** All demo users share the default password `project123`. Change these before deploying to production.

---

## API Endpoints

The `apis/` module exposes the following routes:

| Endpoint                  | Method | Description                        | Access  |
|---------------------------|--------|------------------------------------|---------|
| `/`                       | GET    | Login page                         | Public  |
| `/teacher/`               | GET    | Teacher dashboard                  | Teacher |
| `/teacher/attendance/`    | POST   | Mark student attendance            | Teacher |
| `/teacher/marks/`         | POST   | Enter student marks                | Teacher |
| `/teacher/timetable/`     | GET    | View/manage timetable              | Teacher |
| `/student/`               | GET    | Student dashboard                  | Student |
| `/student/attendance/`    | GET    | View attendance records            | Student |
| `/student/marks/`         | GET    | View marks                         | Student |
| `/student/timetable/`     | GET    | View timetable                     | Student |
| `/admin/`                 | GET    | Django admin panel                 | Admin   |

> Actual routes may vary. Refer to `apis/urls.py` and `CollegeERP/urls.py` for the full routing table.

---

## Screenshots

### Teacher Dashboard

![Teacher Dashboard](https://i.imgur.com/pMAoEbG.png)
![Teacher Attendance](https://i.imgur.com/ZiQ3RRA.png)
![Teacher Marks Entry](https://i.imgur.com/i025CJW.png)
![Teacher Timetable](https://i.imgur.com/HQlLYmC.png)
![Teacher View 5](https://i.imgur.com/j6RyBmU.png)
![Teacher View 6](https://i.imgur.com/xIKEMvQ.png)
![Teacher View 7](https://i.imgur.com/4Rl7Fpv.png)

### Student Dashboard

![Student Dashboard](https://i.imgur.com/isL9cjz.png)
![Student Attendance](https://i.imgur.com/5pzl7m3.png)
![Student Marks](https://i.imgur.com/7zWhHZx.png)
![Student Timetable](https://i.imgur.com/fu7gxk8.png)
![Student View 5](https://i.imgur.com/NZqU268.png)

### Admin Panel

![Admin Panel](https://i.imgur.com/sDvDc9N.png)
![Admin Models](https://i.imgur.com/tMKWx6f.png)
![Admin Detail](https://i.imgur.com/PvCsNeB.png)

---

## Deployment Notes

For production deployment, consider the following:

- Switch from SQLite to PostgreSQL or MySQL in `settings.py`
- Set `DEBUG = False` and configure `ALLOWED_HOSTS`
- Use `gunicorn` as the WSGI server behind `nginx`
- Store secrets (secret key, DB passwords) in environment variables or a `.env` file using `python-decouple`
- Collect static files: `python manage.py collectstatic`

---


## License

This project is open source and available under the [MIT License](LICENSE).

---
