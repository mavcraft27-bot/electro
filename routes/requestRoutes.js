const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const RepairRequest = require('../models/RepairRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');

const router = express.Router();

// Create repair request (customer)
router.post('/create', protect, authorize('customer'), async (req, res) => {
  try {
    const { applianceType, brand, model, applianceAge, problemDescription, availableDates } = req.body;
    
    const customer = await User.findById(req.user.id);
    
    const repairRequest = await RepairRequest.create({
      customerId: req.user.id,
      applianceType,
      brand,
      model,
      applianceAge,
      problemDescription,
      availableDates,
      region: customer.province,
      latitude: customer.latitude,
      longitude: customer.longitude,
    });

    // Notify technicians in the region
    const technicians = await User.find({
      role: 'technician',
      province: customer.province,
    });

    for (let tech of technicians) {
      await Notification.create({
        userId: tech._id,
        requestId: repairRequest._id,
        type: 'new-request',
        title: 'New Repair Request',
        message: `New ${applianceType} repair request in your region`,
      });
    }

    // Emit socket event
    req.app.io.emit('new-request', {
      requestId: repairRequest._id,
      region: customer.province,
      applianceType,
    });

    res.status(201).json({ success: true, repairRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get open requests for technician
router.get('/available/:province', protect, authorize('technician'), async (req, res) => {
  try {
    const requests = await RepairRequest.find({
      region: req.params.province,
      status: 'open',
    }).populate('customerId', 'firstName lastName');

    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer's requests
router.get('/my-requests/:customerId', protect, authorize('customer'), async (req, res) => {
  try {
    const requests = await RepairRequest.find({ customerId: req.params.customerId })
      .populate('technicianId', 'firstName lastName phone email');

    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get request details
router.get('/:id', protect, async (req, res) => {
  try {
    const request = await RepairRequest.findById(req.params.id)
      .populate('customerId', 'firstName lastName phone email')
      .populate('technicianId', 'firstName lastName phone email');

    res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;