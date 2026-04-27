# Student Location Tracking System - Bnot Moshe
A system for organizing data and monitoring students in real time during a trip.

## Table of Contents
- [Description](#description)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Security](#security)
- [Project Structure](#project-structure)

---


## Description
A system that allows teachers to track the location of their students in real time during a trip
The system includes 3 types of users:
- **Administrator** — Manage teachers and classes
- **Teacher** — View real-time tracking map and student lists and add students to the class
- **Student** — View location and distance from the teacher

## Technologies

**Backend:**
- C# ASP.NET Core Web API (.NET 6)
- Entity Framework Core
- SQL Server
- JWT Authentication

**Frontend:**
- React 18
- Bootstrap 5
- Leaflet / react-leaflet
- Axios

## Prerequisites

- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) + SSMS
- [Node.js](https://nodejs.org) v16 or higher
- [Visual Studio 2022](https://visualstudio.microsoft.com)

---
## Installation & Setup
### 1. Database Setup

Open SSMS and create a new database:
```sql
CREATE DATABASE SchoolTripDB;
```
### 2. Backend Configuration

Open `ScoolTripProject/appsettings.json` and update:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=SchoolTripDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "SecretKey": "BnotMoshe2024SuperSecretKeyForJWT!@#$%"
  }
}
```
### 3. Run the Backend

Open `ScoolTripProject` in Visual Studio and press F5.

The server will run on: 
https://localhost:7279
API documentation available at:
https://localhost:7279/swagger

### 4. Run the Frontend

```bash
cd ScoolTripClient
npm install
npm start
```

The client will run on:
http://localhost:3000

---

## Usage

## Usage

### Login
Enter a valid Israeli ID (passes Luhn algorithm).

The system comes with one default user:
- **Admin:** `100000009`

All other users (teachers and students) must be added through the system by the admin or teachers.

### Admin
- Add new classes to the system
- Add teachers and assign them to classes

### Teacher
- **Tracking Map** — View all students' locations in real time:
  -  Blue = Teacher
  -  Green = Close student (within 3 km)
  -  Red = Far student (more than 3 km)
- **Add Student** — Add a new student to the class
- **All Users** — List of all teachers and students
- **My Students** — List of students in my class

### Student
- View own location on the map
- View teacher's location on the map
- Real-time distance status from teacher

---

## Security

- **JWT Authentication** — Every request is authenticated with a Token
- **Token** is stored in sessionStorage and sent in the Authorization Header
- **CORS** — Server only accepts requests from `localhost:3000`
- **EF Core** — Automatically protects against SQL Injection
- **Server-side authorization** — Permissions are verified against the DB on every request
- **Luhn Algorithm** — ID validation on both client and server

---

## Project Structure
ScoolTripProject/          ← Backend C#
├── Controllers/
├── DAL/
├── Models/
├── Services/
└── appsettings.json
ScoolTripClient/           ← Frontend React
├── src/
│   ├── axios/
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── shared/
│   │   ├── student/
│   │   └── teacher/
│   └── routing/
└── public/
└── images/
---

## Notes

- The system includes an automatic location simulator running in the background every minute
- Locations are randomized within 200 meters from the previous location
- JWT Token expires after 4 hours


