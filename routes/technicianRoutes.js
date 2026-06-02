const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get all technicians in a region
router.get('/region/:province', async (req, res) => {
  try {
    const technicians = await User.find({
      role: 'technician',
      province: req.params.province,
    });
    res.status(200).json({ success: true, technicians });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get technician profile
router.get('/:id', async (req, res) => {
  try {
    const technician = await User.findById(req.params.id);
    if (!technician || technician.role !== 'technician') {
      return res.status(404).json({ message: 'Technician not found' });
    }
    res.status(200).json({ success: true, technician });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update technician profile
router.put('/update/:id', protect, authorize('technician'), async (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, province, postalCode } = req.body;
    
    const technician = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phone, address, city, province, postalCode },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, technician });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;