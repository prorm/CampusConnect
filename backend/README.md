# CampusConnect Backend (MERN Stack)

This folder contains the backend REST API skeleton for **CampusConnect: An AI-Powered College Club and Event Management System with Student Engagement Analytics**.

## Structure
- `server.js`: Express server setup with CORS and JSON middleware.
- `models/`: Mongoose schemas for User, Club, Event, Registration, Feedback, and Certificate.
- `routes/`: Modular REST endpoints for authentication, clubs, events, analytics, and AI.
- `.env.example`: Template for environment variables (MongoDB URI, Port, JWT Secret).

## Getting Started (When ready to run backend)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Setup environment variables:
   Copy `.env.example` to `.env` and configure your MongoDB connection URI.
3. Start the development server:
   ```bash
   npm run dev
   ```
