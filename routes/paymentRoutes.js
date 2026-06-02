const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect, authorize } = require('../middleware/auth');
const Payment = require('../models/Payment');
const RepairRequest = require('../models/RepairRequest');
const Notification = require('../models/Notification');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', protect, authorize('technician'), async (req, res) => {
  try {
    const { requestId } = req.body;

    const repairRequest = await RepairRequest.findById(requestId);
    if (!repairRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 4000, // $40 in cents
      currency: 'cad',
      metadata: {
        technicianId: req.user.id,
        requestId: requestId,
      },
    });

    // Create payment record
    const payment = await Payment.create({
      technicianId: req.user.id,
      requestId: requestId,
      stripePaymentId: paymentIntent.id,
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Confirm payment
router.post('/confirm-payment', protect, authorize('technician'), async (req, res) => {
  try {
    const { paymentId, requestId } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: 'completed', completedAt: Date.now() },
      { new: true }
    );

    // Update repair request
    const repairRequest = await RepairRequest.findByIdAndUpdate(
      requestId,
      { status: 'claimed', technicianId: req.user.id, claimedAt: Date.now() },
      { new: true }
    );

    // Notify customer
    await Notification.create({
      userId: repairRequest.customerId,
      requestId: requestId,
      type: 'request-claimed',
      title: 'Request Claimed',
      message: 'A technician has claimed your repair request',
    });

    res.status(200).json({ success: true, payment, repairRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;