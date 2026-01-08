const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
  profileImage: {
    type: String,
    default: "https://placehold.co/100x100/aabbcc/ffffff?text=DR"
  },
  specialty: { type: String },
  bio: { type: String },
  state: { type: String, index: true },
  city: { type: String, index: true },
  pincode: { type: String, index: true }
});

module.exports = mongoose.model("User", userSchema);