const express = require('express');
const Result = require('../models/Result');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();


router.post('/', authenticate, authorize('teacher'), async (req, res) => {
  try {
    const { studentId, subject, marks } = req.body;

    if (!studentId || !subject || marks === undefined) {
      return res.status(400).json({ message: 'Student ID, subject, and marks are required' });
    }


    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }


    if (marks < 0 || marks > 100) {
      return res.status(400).json({ message: 'Marks must be between 0 and 100' });
    }


    const grade = Result.calculateGrade(marks);


    const existingResult = await Result.findOne({ student: studentId, subject });
    
    if (existingResult) {

      existingResult.marks = marks;
      existingResult.grade = grade;
      existingResult.teacher = req.user._id;
      await existingResult.save();
      
      return res.json({
        message: 'Result updated successfully',
        result: existingResult
      });
    }


    const result = new Result({
      student: studentId,
      subject,
      marks,
      grade,
      teacher: req.user._id
    });

    await result.save();
    await result.populate('student', 'name email');

    res.status(201).json({
      message: 'Result added successfully',
      result
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Result for this subject already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});


router.put('/:id', authenticate, authorize('teacher'), async (req, res) => {
  try {
    const { subject, marks } = req.body;

    if (marks === undefined) {
      return res.status(400).json({ message: 'Marks are required' });
    }

    if (marks < 0 || marks > 100) {
      return res.status(400).json({ message: 'Marks must be between 0 and 100' });
    }

    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    result.marks = marks;
    result.grade = Result.calculateGrade(marks);
    result.teacher = req.user._id;
    if (subject) result.subject = subject;

    await result.save();
    await result.populate('student', 'name email');

    res.json({
      message: 'Result updated successfully',
      result
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/', authenticate, authorize('teacher'), async (req, res) => {
  try {
    const { studentId, subject } = req.query;
    
    let query = {};
    if (studentId) query.student = studentId;
    if (subject) query.subject = { $regex: subject, $options: 'i' };

    const results = await Result.find(query)
      .populate('student', 'name email')
      .populate('teacher', 'name')
      .sort({ createdAt: -1 });

    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/my', authenticate, authorize('student'), async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate('teacher', 'name')
      .sort({ subject: 1 });

    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('student', 'name email')
      .populate('teacher', 'name');

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }


    if (req.user.role === 'student' && result.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/:id', authenticate, authorize('teacher'), async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    await Result.findByIdAndDelete(req.params.id);
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

