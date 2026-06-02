const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get customer profile
router.get('/:id', protect, authorize('customer', 'technician'), async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update customer profile
router.put('/update/:id', protect, authorize('customer'), async (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, province, postalCode } = req.body;
    
    const customer = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phone, address, city, province, postalCode },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;