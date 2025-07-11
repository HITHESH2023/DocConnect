const express = require("express");
const dotenv = require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Appointment = require("../models/Appointment");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// POST /api/payment/create-payment-intent
router.post("/create-payment-intent", auth, async (req, res) => {
  const { appointmentId, amount } = req.body;
  const patientId = req.user.id;

  if (!appointmentId || !amount) {
    return res.status(400).json({ msg: "Appointment ID and amount are required." });
  }

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.patientId.toString() !== patientId) {
      return res.status(404).json({ msg: "Appointment not found or not authorized." });
    }

    const actualAmount = appointment.consultationFee;
    if (amount !== actualAmount) {
        return res.status(400).json({ msg: "Provided amount does not match consultation fee." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: actualAmount,
      currency: "inr", // <--- CHANGED FROM "usd" TO "inr"
      metadata: { integration_check: "accept_a_payment", appointmentId: appointment._id.toString() },
    });

    appointment.paymentStatus = "pending";
    appointment.stripePaymentIntentId = paymentIntent.id;
    await appointment.save();

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating Payment Intent:", err);
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/payment/webhook
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      console.log(`PaymentIntent for ${paymentIntentSucceeded.amount} was successful!`);
      try {
        const appointmentId = paymentIntentSucceeded.metadata.appointmentId;
        await Appointment.findByIdAndUpdate(appointmentId, { paymentStatus: "paid" });
        console.log(`Appointment ${appointmentId} payment status updated to paid.`);
      } catch (dbErr) {
        console.error("Error updating appointment after successful payment:", dbErr);
        return res.status(500).json({ received: true, error: "DB update failed" });
      }
      break;
    case "payment_intent.payment_failed":
      const paymentIntentFailed = event.data.object;
      console.log(`PaymentIntent failed: ${paymentIntentFailed.last_payment_error?.message}`);
      try {
        const appointmentId = paymentIntentFailed.metadata.appointmentId;
        await Appointment.findByIdAndUpdate(appointmentId, { paymentStatus: "failed" });
        console.log(`Appointment ${appointmentId} payment status updated to failed.`);
      } catch (dbErr) {
        console.error("Error updating appointment after failed payment:", dbErr);
        return res.status(500).json({ received: true, error: "DB update failed" });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
