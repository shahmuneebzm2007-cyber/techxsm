const express = require('express');
const router = express.Router();
const Tracking = require('../models/Tracking');

// Public route to get tracking info
router.get('/:trackingID', async (req, res, next) => {
  try {
    const tracking = await Tracking.findOne({ trackingID: req.params.trackingID });
    
    if (!tracking) {
      return res.status(404).json({ success: false, message: 'Tracking information not found' });
    }
    
    res.json({ success: true, data: tracking });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
