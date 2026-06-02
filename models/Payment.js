const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RepairRequest',
    required: true,
  },
  amount: {
    type: Number,
    default: 40,
    required: true,
  },
  currency: {
    type: String,
    default: 'CAD',
  },
  stripePaymentId: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
});

module.exports = mongoose.model('Payment', paymentSchema);