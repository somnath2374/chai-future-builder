const mongoose = require('mongoose');

const eduScoreSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  score: { type: Number, required: true, default: 0 },
  completed_lessons: { type: [String], default: [] },
  last_updated: { type: Date, default: Date.now },
});

const EduScore = mongoose.model('EduScore', eduScoreSchema);

module.exports = EduScore; 