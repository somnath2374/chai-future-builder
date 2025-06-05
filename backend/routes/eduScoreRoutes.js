const express = require('express');
const router = express.Router();
const EduScore = require('../models/EduScore');

// Get EduScore by user_id
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const eduScore = await EduScore.findOne({ user_id: userId });
    if (!eduScore) {
      return res.status(404).json({ message: 'EduScore not found' });
    }
    res.status(200).json(eduScore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update EduScore (e.g., when completing a lesson)
router.post('/', async (req, res) => {
  try {
    const { user_id, score, completed_lessons } = req.body;

    let eduScore = await EduScore.findOne({ user_id });

    if (eduScore) {
      // Update existing EduScore
      eduScore.score = score !== undefined ? score : eduScore.score;
      eduScore.completed_lessons = completed_lessons !== undefined ? completed_lessons : eduScore.completed_lessons;
      eduScore.last_updated = new Date();
    } else {
      // Create new EduScore
      eduScore = new EduScore({
        user_id,
        score,
        completed_lessons,
      });
    }

    const savedEduScore = await eduScore.save();
    res.status(201).json(savedEduScore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Complete a lesson and update EduScore
router.post('/complete-lesson', async (req, res) => {
  try {
    const { userId, lessonId, pointsEarned } = req.body;

    let eduScore = await EduScore.findOne({ user_id: userId });

    if (!eduScore) {
      // Create new EduScore if it doesn't exist
      eduScore = new EduScore({
        user_id: userId,
        score: pointsEarned || 10, // Default points if not provided
        completed_lessons: [lessonId],
      });
    } else {
      // Check if the lesson is already completed
      if (eduScore.completed_lessons.includes(lessonId)) {
        return res.status(200).json({ success: true, scoreEarned: 0, message: 'Lesson already completed' });
      }
      // Update existing EduScore
      eduScore.completed_lessons.push(lessonId);
      eduScore.score += (pointsEarned || 10);
      eduScore.last_updated = new Date();
    }

    const savedEduScore = await eduScore.save();
    res.status(200).json({ success: true, scoreEarned: (pointsEarned || 10), eduScore: savedEduScore });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 