const express = require('express');
const User = require('../models/User');
const Result = require('../models/Result');
const { authenticate } = require('../middleware/auth');

const router = express.Router();


router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -googleId');
    

    let results = [];
    if (req.user.role === 'student') {
      results = await Result.find({ student: req.user._id })
        .populate('teacher', 'name')
        .sort({ subject: 1 });
    }

    res.json({
      user,
      results: req.user.role === 'student' ? results : undefined
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/', authenticate, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

