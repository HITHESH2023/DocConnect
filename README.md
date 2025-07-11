# DocConnect - Online Doctor Appointment Booking System

![DocConnect Logo Placeholder](https://via.placeholder.com/150/007bff/ffffff?text=DocConnect)

## Table of Contents

1.  [Introduction](#introduction)
2.  [Features](#features)
3.  [Technologies Used](#technologies-used)
4.  [Project Structure](#project-structure)
5.  [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
    * [Environment Variables](#environment-variables)
    * [Running the Application](#running-the-application)
6.  [User Roles and Functionality](#user-roles-and-functionality)
7.  [API Endpoints (Backend)](#api-endpoints-backend)
8.  [Frontend Routes (Client)](#frontend-routes-client)
9.  [Screenshots](#screenshots)
10. [Future Enhancements](#future-enhancements)
11. [Contributing](#contributing)
12. [License](#license)
13. [Contact](#contact)

## 1. Introduction

DocConnect is a comprehensive online platform designed to streamline the process of booking and managing doctor appointments. It offers a user-friendly interface for patients to find and book appointments with available doctors, while providing doctors with tools to manage their schedules and availabilities. An administrative dashboard offers full control over user and appointment management.

This project is built as a full-stack MERN (MongoDB, Express.js, React, Node.js) application, demonstrating robust user authentication, role-based access control, appointment scheduling, and integrated payment processing via Stripe.

## 2. Features

* **User Authentication:** Secure registration and login for Patients, Doctors, and Admins.
* **Role-Based Access Control:** Different dashboards and functionalities based on user roles.
    * **Patient Dashboard:**
        * View available doctors based on selected dates.
        * Book appointments with doctors (offline payment or online via Stripe).
        * View their booked appointments.
    * **Doctor Dashboard:**
        * Set and manage daily availability (start time, patient duration, total slots).
        * View all their scheduled appointments.
    * **Admin Dashboard:**
        * View all users (patients, doctors, admins).
        * View all appointments across the system.
        * Create new appointments.
        * (Commented out but present in code: Delete users and appointments).
* **Appointment Management:** Book, view, and manage appointments.
* **Doctor Availability:** Doctors can define their availability slots for specific dates.
* **Stripe Integration:** Secure online payment processing for appointments.
* **Responsive UI:** Built with Tailwind CSS for a modern and responsive user interface.
* **Modular API:** Well-structured backend with dedicated routes for authentication, appointments, availability, doctors, and payments.

## 3. Technologies Used

**Frontend (Client):**
* **React.js:** A JavaScript library for building user interfaces.
* **React Router DOM:** For declarative routing in React applications.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **React Datepicker:** A flexible and customizable date picker component.
* **React Calendar:** A calendar component for date selection.
* **Stripe React.js SDK (`@stripe/react-stripe-js`, `@stripe/stripe-js`):** For integrating Stripe Elements into the frontend.
* **Axios:** For making HTTP requests to the backend API.
* **Heroicons:** SVG icons for the UI.
* **Headless UI:** Unstyled, accessible UI components.

**Backend (Server):**
* **Node.js:** JavaScript runtime for server-side logic.
* **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB:** A NoSQL database for storing application data.
* **Mongoose:** MongoDB object data modeling (ODM) for Node.js.
* **jsonwebtoken (JWT):** For secure authentication and authorization.
* **bcryptjs:** For password hashing.
* **dotenv:** To load environment variables from a `.env` file.
* **cors:** Middleware for enabling Cross-Origin Resource Sharing.
* **Stripe Node.js Library:** For interacting with the Stripe API from the backend.

## 4. Project Structure

The project is divided into two main parts: `client` (React frontend) and `server` (Node.js/Express backend).

DocConnect/
├── client/              # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable UI components (Navbar, MessageModal, CheckoutForm, etc.)
│   │   ├── context/     # React Context for global state (AuthContext)
│   │   ├── pages/       # React components for different application views/pages
│   │   ├── utils/       # Utility functions (API service)
│   │   ├── App.js       # Main application component and routing
│   │   └── index.js
│   ├── .env.example     # Example for frontend environment variables
│   └── package.json
├── server/              # Node.js/Express backend API
│   ├── config/          # Database connection setup (db.js)
│   ├── middleware/      # Authentication and authorization middleware (authMiddleware.js, adminAuth.js)
│   ├── models/          # Mongoose schemas for data models (User, Appointment, Availability)
│   ├── routes/          # API routes for different resources (auth, appointments, doctors, payments, admin)
│   ├── .env.example     # Example for backend environment variables
│   ├── server.js        # Main Express server file
│   └── package.json
├── .gitignore
└── README.md


## 5. Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (LTS version recommended)
* npm (comes with Node.js) or Yarn
* MongoDB (running locally or a cloud instance like MongoDB Atlas)
* A Stripe account (for online payment functionality - optional, but recommended for full feature set)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/DocConnect.git](https://github.com/your-username/DocConnect.git)
    cd DocConnect
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd server
    npm install  # or yarn install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../client # Go back to the root, then into the client directory
    npm install  # or yarn install
    ```

### Environment Variables

You need to set up environment variables for both the backend and frontend.

#### Backend (`server/.env`):
Create a file named `.env` in the `server/` directory and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string # e.g., mongodb://localhost:27017/docconnect or your MongoDB Atlas URI
JWT_SECRET=a_very_secret_key_for_jwt # Generate a strong, random string
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY # Get this from your Stripe Dashboard
Frontend (client/.env):
Create a file named .env in the client/ directory and add the following:

Code snippet

REACT_APP_API_URL=http://localhost:5000/api # Or your deployed backend URL
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY # Get this from your Stripe Dashboard
Note: For MONGO_URI, if you're using MongoDB Atlas, make sure to configure network access to allow connections from your IP address.

Running the Application
Start the Backend Server:
Open a new terminal, navigate to the server/ directory:

Bash

cd server
npm start # or node server.js
You should see "MongoDB connected" and "Server running on port 5000" (or your specified port).

Start the Frontend Development Server:
Open another new terminal, navigate to the client/ directory:

Bash

cd client
npm start # or yarn start
This will open the React application in your browser, usually at http://localhost:3000.

6. User Roles and Functionality
Patient: Can register, login, view doctors, book appointments (online/offline), and view their own appointment history.

Doctor: Can register, login, set daily availability (start time, slot duration, total slots), and view their list of scheduled appointments.

Admin: Can register (via backend access initially or manual role assignment in DB), login, view all users (patients, doctors, admins), view all appointments, and create new appointments.

Initial Admin Setup (Manual):
Since there's no direct admin registration UI, you'll need to manually set a user's role to 'admin' in your MongoDB database after they register as a patient or doctor through the frontend.

7. API Endpoints (Backend)
The backend provides a RESTful API. Here are some key endpoint categories:

/api/auth:

POST /register: Register a new user.

POST /login: Authenticate a user and return a JWT.

/api/appointments:

POST /: Book a new appointment (requires authentication).

GET /: Get user's appointments (patient: their appointments, doctor: their appointments).

DELETE /:id (Admin only): Delete an appointment.

/api/availability:

POST /: Set doctor's availability (requires doctor authentication).

GET /:doctorId/:date: Check availability for a specific doctor on a given date.

/api/doctors:

GET /available/:date: Get doctors available on a specific date, along with their remaining slots.

GET /profile/:doctorId (Optional): Get a specific doctor's detailed profile.

/api/payment:

POST /create-payment-intent: Create a Stripe Payment Intent for online payments.

POST /webhook: Stripe webhook endpoint for processing payment success/failure.

/api/admin (Admin Only):

GET /users: Get all registered users.

GET /appointments: Get all appointments.

POST /appointments: Create an appointment (Admin).

DELETE /appointments/:id: Delete an appointment.

DELETE /users/:id: Delete a user and associated data.

8. Frontend Routes (Client)
The React application uses React Router DOM for client-side navigation:

/: Login Page

/register: Registration Page

/patient: Patient Dashboard

/doctor: Doctor Dashboard

/book: Book Appointment Page (requires doctorId and date query parameters for pre-filling)

/admin: Admin Dashboard

9. Screenshots
(You would replace these placeholders with actual screenshots of your application)

Login Page:

Register Page:

Patient Dashboard:

Doctor Dashboard:

Admin Dashboard:

Book Appointment / Payment:

10. Future Enhancements
Doctor Profile Management: Allow doctors to update their profile information (bio, specialty, image) through their dashboard.

Appointment Cancellation/Rescheduling: Implement functionality for users to cancel or reschedule appointments.

Notifications: Add email or in-app notifications for appointment confirmations, reminders, and cancellations.

Search/Filter for Doctors: Enhance patient dashboard with search and filter options for doctors (by specialty, name, etc.).

User Profile Page: Allow users (patients and doctors) to view and update their basic profile information.

Rating and Reviews: Enable patients to rate and review doctors after appointments.

Chat Functionality: Integrate a real-time chat feature between patients and doctors.

Admin UI for Availability/Users: Build a more comprehensive admin UI to manage availabilities and user roles directly.

11. Contributing
Contributions are welcome! If you'd like to contribute, please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature/your-feature-name).

Make your changes.

Commit your changes (git commit -m 'Add new feature').

Push to the branch (git push origin feature/your-feature-name).

Create a Pull Request.

12. License
This project is licensed under the MIT License - see the LICENSE file for details (if you have one, otherwise remove this section or add one).

13. Contact
For any questions or suggestions, feel free to reach out:

Your Name / Organization Name

Your Email Address or GitHub Profile Link

