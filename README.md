# NGO Admin Dashboard

## Project Overview
This project is a **web application for NGOs in India** to track and report the impact of their work. The app allows NGOs to submit monthly reports individually or via bulk CSV upload, and provides an **admin dashboard** to view aggregated data and track progress.

The app is built using the **MERN stack** (MongoDB, Express, React, Node.js) and includes **JWT-based authentication** for admin access.
---
## Features

### NGO Report Submission
- **Individual report submission**:
  - Fields: NGO ID, Month, People Helped, Events Conducted, Funds Utilized
  - Validates input before sending to backend
- **Bulk CSV upload**:
  - Upload multiple monthly reports at once
  - Backend processes CSV **asynchronously**
  - Provides job ID and progress updates during processing
  - Handles partial failures (invalid rows do not block other rows)

### Admin Dashboard
- **JWT-protected login** (username: `admin`, password: `admin123`)
- **Month-wise filtering** to view data for any month
- Displays aggregated statistics:
  - Total NGOs Reporting
  - Total People Helped
  - Total Events Conducted
  - Total Funds Utilized
- Responsive dashboard cards with clear summary

---

## Tech Stack
- **Frontend**: React, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Other Tools**: Vite, Axios

---

## Setup Instructions

### Backend
1. Navigate to backend folder:
   ```bash
   cd express-ts-backend
Install dependencies:


npm install
Create a .env file with necessary environment variables (if any)

Start the server:

bash
Copy code
npm run dev
Frontend
Navigate to frontend folder:

Install dependencies:
npm install
Start the app:npm run dev

start backend -->go inside express-ts-backend and put npm run dev

bash
Copy code
npm run dev
Open browser at http://localhost:5173 (Vite default port)

API Endpoints
POST /report → Submit a single NGO report
POST /reports/upload → Upload CSV file of reports (processed asynchronously)
GET /job-status/{job_id} → Check status of CSV processing
GET /dashboard?month=YYYY-MM → Get aggregated dashboard data for a selected month

Admin Credentials
Username: admin
Password: admin123



Screenshots of the Project:
<img width="1897" height="901" alt="image" src="https://github.com/user-attachments/assets/7a379e8b-482c-41dc-a2ec-4f33b22ed29b" />
<img width="1900" height="902" alt="image" src="https://github.com/user-attachments/assets/50474aaa-d71a-4975-a386-1958e3e1af3c" />
<img width="1917" height="897" alt="image" src="https://github.com/user-attachments/assets/f6000949-5a05-4da2-bea9-562bc0bf5509" />
<img width="1866" height="862" alt="image" src="https://github.com/user-attachments/assets/8c01f228-0e17-4412-af00-95e816ac6cd9" />

Notion link:https://www.notion.so/NGO-Dashboard-Management-2c9ef56b1f928098a780d03cedb3c0cb
demo video:https://drive.google.com/file/d/1q6QnGij1nNNfWqFpbSvGLT2WM_38vaf0/view?usp=drive_link
https://1drv.ms/v/c/69188d565bf857f2/IQAsrxXNGQUOS75TrO8qe07VAfvuC57ccneHblBGKhr-iTM?e=SYkNTg




