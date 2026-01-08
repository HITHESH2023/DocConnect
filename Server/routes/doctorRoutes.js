const express = require("express");
const User = require("../models/User");
const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");
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

// GET /api/doctors/available/:date
// This route will find doctors who have availability on a specific date
router.get("/available/:date", async (req, res) => {
  try {
    const { date } = req.params; // Date in YYYY-MM-DD format
    const targetDate = formatDate(date); // Ensure consistent formatting

    // Find all doctors
    const doctors = await User.find({ role: "doctor" }).select("-password"); // Exclude password

    const availableDoctors = [];

    for (const doctor of doctors) {
      // Check if the doctor has availability set for the given date
      const availability = await Availability.findOne({
        doctorId: doctor._id,
        date: targetDate,
      });

      if (availability) {
        // Count how many appointments are already booked for this doctor on this date
        const bookedCount = await Appointment.countDocuments({
          doctorId: doctor._id,
          date: targetDate,
        });

        const remainingSlots = availability.totalSlots - bookedCount;

        availableDoctors.push({
          _id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          profileImage: doctor.profileImage,
          specialty: doctor.specialty,
          bio: doctor.bio,
          availability: {
            startTime: availability.startTime,
            patientDuration: availability.patientDuration,
            totalSlots: availability.totalSlots,
            bookedSlots: bookedCount,
            remainingSlots: remainingSlots,
            isAvailable: remainingSlots > 0, // Indicate if there are any slots left
          },
        });
      }
    }

    res.json(availableDoctors);
  } catch (err) {
    console.error("Error fetching available doctors:", err);
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/doctors/search
// ?state=&city=&pincode=
router.get("/search", async (req, res) => {
  try {
    const { state, city, pincode, date } = req.query;

    const query = { role: "doctor" };

    if (state) query.state = new RegExp(`^${state}$`, "i");
    if (city) query.city = new RegExp(`^${city}$`, "i");
    if (pincode) query.pincode = pincode;

    const doctors = await User.find(query).select("-password");

    const results = [];

    for (const doctor of doctors) {
      let availabilityData = {
        isAvailable: false,
        remainingSlots: 0
      };

      if (date) {
        const availability = await Availability.findOne({
          doctorId: doctor._id,
          date
        });

        if (availability) {
          const bookedCount = await Appointment.countDocuments({
            doctorId: doctor._id,
            date
          });

          const remainingSlots =
            availability.totalSlots - bookedCount;

          availabilityData = {
            isAvailable: remainingSlots > 0,
            remainingSlots
          };
        }
      }

      results.push({
        ...doctor.toObject(),
        availability: availabilityData
      });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// Optional: Get a single doctor's profile by ID (useful for detailed view)
router.get("/profile/:doctorId", async (req, res) => {
  try {
    const doctor = await User.findById(req.params.doctorId).select("-password");
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ msg: "Doctor not found" });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


module.exports = router;
