const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  startTime: String,
  patientDuration: Number,
  totalSlots: Number
});

module.exports = mongoose.model("Availability", availabilitySchema);
