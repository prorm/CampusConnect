# CampusConnect 🎓
> **An AI-Powered College Club and Event Management System with Student Engagement Analytics**

CampusConnect is a centralized full-stack web application designed for engineering colleges to streamline club memberships, event registrations, attendance tracking, feedback collection, and verifiable certificate issuance. It features AI-driven event and club recommendations and rich engagement analytics for college administrators.

---

## 👥 Student Details (Project Team)
- **Sinchana Jeppu** — USN: `1MS24CI124`
- **Pranav R Mane** — USN: `1MS24CI091`
- **Prajwal N** — USN: `1MS24CI090`

*Ramaiah Institute of Technology*

---

## 🚀 Key Features

### 1. Role-Based Access Control (RBAC)
- **Student Persona**: Explore clubs, join societies, register for workshops/hackathons with live seat tracking, receive AI recommendations, submit event feedback, and view/print official certificates.
- **Club Coordinator Persona**: Publish events, set capacity limits, mark student attendance with 1-click toggles, and view AI feedback summaries.
- **Administrator Persona**: Review and approve new club charters, manage college-wide users, broadcast campus announcements, and inspect engagement analytics.

### 2. AI-Powered Modules
- **Personalized Recommendations**: Suggests clubs and upcoming events based on student interests and previous participation history.
- **AI Feedback Summarizer**: Synthesizes student reviews into key strengths, areas for improvement, and overall sentiment rating.
- **Predictive Engagement Insights**: Analyzes historical attendance trends to provide data-driven suggestions for scheduling and capacity.

### 3. Engagement & Data Analytics
- Visual KPI counters (Active Clubs, Student Members, Events Hosted, Total Registrations, College Attendance Rate).
- Interactive charts for participation breakdown by **Department** and **Academic Year**.
- Monthly attendance trend tracking and popular event fill-rate gauges.

---

## 📂 Project Structure

```
CampusConnect/
├── frontend/                     # React JS Single-Page Application
│   ├── src/
│   │   ├── components/           # Navbar, Modal, StatCard, CertificateModal, Toast
│   │   ├── pages/                # StudentDashboard, CoordinatorDashboard, ClubsPage, EventsPage, AnalyticsDashboard, AdminManagement, AuthModal
│   │   ├── data/                 # mockData.js (Realistic starting data & profiles)
│   │   ├── App.jsx               # Central state & tab routing
│   │   ├── App.css               # Clean Vanilla CSS styling
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backend/                      # Node.js & Express REST API Skeleton (MERN)
    ├── models/                   # Mongoose Schemas (User, Club, Event, Registration, Feedback)
    ├── routes/                   # Express routes (auth, clubs, events, analytics, ai)
    ├── server.js                 # API server entry point
    ├── .env.example              # Environment variables template
    └── package.json
```

---

## 🛠️ Getting Started

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173/`.

### Running the Backend (When ready for MongoDB integration)
```bash
cd backend
npm install
npm run dev
```

---

## 📜 License
This project was developed for academic project presentation and demonstration purposes.
