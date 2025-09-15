# 🚀 DocConnect – Doctor Appointment Booking System 🩺

**DocConnect** is a full-stack web application that modernizes doctor appointment booking in India.  
It replaces outdated phone-based processes with a sleek, real-time, and user-friendly platform for **Patients**, **Doctors**, and **Administrators**.

🔗 **Live Demo**: [Your Deployed Link Here]

---

## ✨ Key Features

### 👩‍⚕️ Patients
- ✅ **Find Available Doctors** – Select any date to see doctors with open slots.
- ✅ **View Doctor Profiles** – Read detailed bios, specialties, and see profile images.
- ✅ **Real-Time Booking** – Automatically get the next available time slot.
- ✅ **Secure Payments** – Online payments via Stripe or offline at the clinic.
- ✅ **Personal Dashboard** – Manage upcoming appointments in a calendar view.

### 🩺 Doctors
- ✅ **Full Schedule Control** – Set daily availability, consultation time, and slots.
- ✅ **Professional Profile** – Showcase specialty and bio during registration.
- ✅ **Appointment Calendar** – View confirmed appointments for effective schedule management.

### ⚙️ Administrators
- ✅ **Admin Dashboard** – Manage the entire platform with security.
- ✅ **User Management** – View & delete any user (Patient, Doctor, Admin).
- ✅ **Appointment Management** – View, create, and delete any appointment.
- ✅ **Create New Users** – Add users with any role directly from the dashboard.

---

## 🚀 Technical Features
- ✅ **Stripe Integration** – Secure online payments with automatic webhook confirmations.
- ✅ **Automated Cleanup** – Cron job clears past appointments daily at midnight.
- ✅ **JWT Authentication** – Secure role-based authentication.
- ✅ **Node-Cron** – For scheduled tasks.

---

## 🛠️ Tech Stack

| Layer           | Technologies                           |
|---------------|----------------------------------------|
| Frontend        | React, React Router, Tailwind CSS, Axios |
| Backend         | Node.js, Express.js                  |
| Database        | MongoDB with Mongoose                |
| Authentication | JWT, Bcrypt.js                    |
| Payments        | Stripe                               |
| Scheduler       | node-cron                           |

---

## ⚡ Getting Started

### Prerequisites
- Node.js v14 or higher  
- npm or yarn  
- MongoDB (local or MongoDB Atlas)  
- Stripe Account (for API keys)

### Installation & Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/docconnect.git
    cd docconnect
    ```

2. Install Backend dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root folder with the following content:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key

    STRIPE_SECRET_KEY=your_stripe_secret_key
    STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
    ```

4. Install Frontend dependencies:
    ```bash
    cd client
    npm install
    ```

5. Create a `.env` file in the frontend (`client`) folder with:
    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    ```

### Run the Application

- Start the Backend Server:
    ```bash
    npm run server
    ```

- Start the Frontend Client:
    ```bash
    npm start
    ```

Frontend → `http://localhost:3000`  
Backend → `http://localhost:5000`

---

## 🔑 Admin Access

To access the admin dashboard:
1. Register a new user through the frontend.
2. In MongoDB, change their `role` field from `"patient"` to `"admin"`.

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are highly welcome!  
👉 Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
