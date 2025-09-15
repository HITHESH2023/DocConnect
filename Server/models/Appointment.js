const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  time: String, // "HH:MM"
  status: { type: String, default: "booked" }, // e.g., "booked", "completed", "cancelled"
  consultationFee: { type: Number, default: 5000 }, // Example: Fee in cents (e.g., $50.00)
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "offline"], default: "offline" }, // New: "pending", "paid", "failed", "offline"
  stripePaymentIntentId: { type: String, unique: true, sparse: true }, // New: Stores Stripe Payment Intent ID
});

module.exports = mongoose.model("Appointment", appointmentSchema);
