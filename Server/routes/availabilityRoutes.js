const express = require("express");
const Availability = require("../models/Availability");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// POST /api/availability
router.post("/", auth, async (req, res) => {
  try {
    const { date, startTime, patientDuration, totalSlots } = req.body;
    const availability = await Availability.create({
      doctorId: req.user.id,
      date,
      startTime,
      patientDuration,
      totalSlots,
    });
    res.json(availability);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/availability/:doctorId/:date
router.get("/:doctorId/:date", async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    const availability = await Availability.findOne({ doctorId, date });
    if (!availability) return res.json({ available: false });

    res.json({ available: true, availability });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
