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
- React 
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


### Login
Enter a valid Israeli ID (passes Luhn algorithm).
<img width="2819" height="1250" alt="image" src="https://github.com/user-attachments/assets/dd88344b-c9ef-4bef-9be7-81853b329790" />


The system comes with one default user:
- **Admin:** `100000009`

All other users (teachers and students) must be added through the system by the admin or teachers.

### Admin
- Add new classes to the system
- Add teachers and assign them to classes
- <img width="2790" height="1248" alt="image" src="https://github.com/user-attachments/assets/c9bb8248-92dd-4e4c-b0d4-c0cd5628e7f3" />


### Teacher
<img width="2806" height="1164" alt="image" src="https://github.com/user-attachments/assets/973afed4-04df-4ad4-98f5-fc726e224b1a" />

- **Tracking Map** — View all students' locations in real time:
  -  Blue = Teacher
  -  Green = Close student (within 3 km)
  -  Red = Far student (more than 3 km)
  -  <img width="2807" height="1247" alt="image" src="https://github.com/user-attachments/assets/3071c35a-ab1b-4495-97be-9b17cb4faa7a" />

- **Add Student** — Add a new student to the class
  <img width="2802" height="1247" alt="image" src="https://github.com/user-attachments/assets/3ac85984-98fe-4244-a9cc-b7d9f3133171" />

- **All Users** — List of all teachers and students
- <img width="2822" height="590" alt="image" src="https://github.com/user-attachments/assets/ddd0fb20-53d4-4f02-99df-f44be2ad53c6" />

- **My Students** — List of students in my class
<img width="2822" height="590" alt="image" src="https://github.com/user-attachments/assets/a31bc95c-6e1f-4222-a942-1ef81e5d03b7" />


### Student
- View own location on the map
- View teacher's location on the map
- Real-time distance status from teacher
- <img width="2809" height="1218" alt="image" src="https://github.com/user-attachments/assets/10a1206d-c2ee-4590-9492-4958fb8a7a2f" />



---

## Security

- **JWT Authentication** — Every request is authenticated with a Token
- **Token** is stored in sessionStorage and sent in the Authorization Header
- **CORS** — Server only accepts requests from `localhost:3000`
- **EF Core** — Automatically protects against SQL Injection
- **Server-side authorization** — Permissions are verified against the DB on every request
- **Luhn Algorithm** — ID validation on both client and server

---

```
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
```
---

## Notes

- The system includes an automatic location simulator running in the background every minute
- Locations are randomized within 200 meters from the previous location
- JWT Token expires after 4 hours


