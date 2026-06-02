const mongoose = require('mongoose');

const repairRequestSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  applianceType: {
    type: String,
    required: [true, 'Please specify appliance type'],
    enum: ['refrigerator', 'washer', 'dryer', 'dishwasher', 'oven', 'microwave', 'other'],
  },
  brand: {
    type: String,
    required: [true, 'Please specify the brand'],
  },
  model: String,
  applianceAge: {
    type: String,
    enum: ['0-1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'],
  },
  problemDescription: {
    type: String,
    required: [true, 'Please describe the problem'],
  },
  availableDates: [Date],
  status: {
    type: String,
    enum: ['open', 'claimed', 'completed', 'cancelled'],
    default: 'open',
  },
  region: String,
  latitude: Number,
  longitude: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  claimedAt: Date,
  completedAt: Date,
});

module.exports = mongoose.model('RepairRequest', repairRequestSchema);