const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
  // New fields for doctors
  profileImage: { type: String, default: "https://placehold.co/100x100/aabbcc/ffffff?text=DR" }, // Default placeholder image
  specialty: { type: String, default: "General Practitioner" }, // Default specialty
  bio: { type: String, default: "Dedicated healthcare professional." } // Optional: A short bio for doctors
});

module.exports = mongoose.model("User", userSchema);