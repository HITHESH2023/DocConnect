const express = require("express");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Availability = require("../models/Availability"); // Needed for adding appointments
const adminAuth = require("../middleware/adminAuth"); // New admin authentication middleware
const auth = require("../middleware/authMiddleware"); // General auth for some cases, or combine logic
const bcrypt = require("bcryptjs"); // For hashing passwords
const jwt = require("jsonwebtoken"); // For generating tokens for new users if needed, though not directly used for admin-created users

const router = express.Router();

// Helper function to format date to YYYY-MM-DD
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// GET all users (patients, doctors, admins)
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET all appointments
router.get("/appointments", adminAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctorId", "name email specialty") // Populate doctor info
      .populate("patientId", "name email") // Populate patient info
      .sort({ date: 1, time: 1 }); // Sort by date and time
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST create new appointment (admin can create appointments for any doctor/patient)
router.post("/appointments", adminAuth, async (req, res) => {
  const { doctorId, patientId, date, time } = req.body;
  try {
    const newAppointment = new Appointment({
      doctorId,
      patientId,
      date,
      time,
      status: "booked",
      paymentStatus: "offline", // Assuming admin creates offline appointments by default
    });
    const appointment = await newAppointment.save();
    res.status(201).json({ msg: "Appointment created successfully by admin", appointment });
  } catch (err) {
    console.error("Error creating appointment by admin:", err);
    res.status(500).json({ msg: err.message });
  }
});

// DELETE an appointment
router.delete("/appointments/:id", adminAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }
    res.json({ msg: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin can delete a user
router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    // Also delete their associated availabilities and appointments
    if (user.role === 'doctor') {
      await Availability.deleteMany({ doctorId: user._id });
      await Appointment.deleteMany({ doctorId: user._id });
    } else if (user.role === 'patient') {
      await Appointment.deleteMany({ patientId: user._id });
    }
    res.json({ msg: "User and associated data deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// NEW: Admin registers a new user
router.post("/register-user", adminAuth, async (req, res) => {
  const { name, email, password, role, profileImage, specialty, bio, state, city, pincode } = req.body;
  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: role === "doctor" ? profileImage : undefined,
      specialty: role === "doctor" ? specialty : undefined,
      bio: role === "doctor" ? bio : undefined,
      state: role === "doctor" ? state : undefined,
      city: role === "doctor" ? city : undefined,
      pincode: role === "doctor" ? pincode : undefined
    });

    const user = await newUser.save();
    // Optionally, if you want to immediately log in the admin-created user,
    // you could generate a token for them here, but typically an admin
    // creating an account doesn't directly log into it.
    // For simplicity, we just confirm creation.
    res.status(201).json({ msg: `User ${user.name} (${user.role}) registered successfully!` });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error during user registration by admin." });
  }
});


module.exports = router;