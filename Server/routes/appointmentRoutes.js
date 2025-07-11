const express = require("express");
const Appointment = require("../models/Appointment");
const Availability = require("../models/Availability");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

const getTimeAfter = (startTime, minsToAdd) => {
  const [h, m] = startTime.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m + minsToAdd);
  return date.toTimeString().slice(0, 5); // "HH:MM"
};

router.post("/", auth, async (req, res) => {
  try {
    const { doctorId, date } = req.body;

    const availability = await Availability.findOne({ doctorId, date });
    if (!availability) return res.status(400).json({ msg: "Doctor not available" });

    const bookedCount = await Appointment.countDocuments({ doctorId, date });
    if (bookedCount >= availability.totalSlots) {
      return res.status(400).json({ msg: "All slots booked" });
    }

    const appointmentTime = getTimeAfter(
      availability.startTime,
      bookedCount * availability.patientDuration
    );

    const appointment = await Appointment.create({
      doctorId,
      patientId: req.user.id,
      date,
      time: appointmentTime,
    });

    res.json({ msg: "Appointment booked", appointment });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/appointments (all of a user)
router.get("/", auth, async (req, res) => {
  const query =
    req.user.role === "doctor"
      ? { doctorId: req.user.id }
      : { patientId: req.user.id };

  try {
    const appointments = await Appointment.find(query)
      .populate("doctorId", "name email")
      .populate("patientId", "name email");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
