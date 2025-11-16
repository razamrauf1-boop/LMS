const express = require('express');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();


router.get('/', authenticate, authorize('teacher'), async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = { role: 'student' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await User.find(query)
      .select('-password -googleId')
      .sort({ name: 1 });

    res.json({ students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

