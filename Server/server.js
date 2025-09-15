const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cron = require('node-cron'); // NEW: Import node-cron

// NEW: Import models needed for cron job
const Appointment = require('./models/Appointment');
const Availability = require('./models/Availability');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// NEW: Cron job to clear old appointments and availability at EOD
// This cron job runs every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily cron job to clear old data...');
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of today for comparison

  try {
    // Delete appointments where the date is before today
    const deletedAppointments = await Appointment.deleteMany({
      date: { $lt: today.toISOString().split('T')[0] }
    });
    console.log(`Cleared ${deletedAppointments.deletedCount} old appointments.`);

    // Delete availability entries where the date is before today
    const deletedAvailabilities = await Availability.deleteMany({
      date: { $lt: today.toISOString().split('T')[0] }
    });
    console.log(`Cleared ${deletedAvailabilities.deletedCount} old availability entries.`);

  } catch (error) {
    console.error('Error during daily data cleanup cron job:', error);
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});