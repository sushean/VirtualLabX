const mongoose = require('mongoose');

const examSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  questions: [{
    id: String,
    text: String,
    options: [String],
    correctAnswer: String // Never sent to frontend
  }],
  currentIndex: {
    type: Number,
    default: 0
  },
  answers: [{
    questionId: String,
    selectedOption: String
  }],
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'COMPLETED', 'DISQUALIFIED'],
    default: 'IN_PROGRESS'
  },
  cheatingScore: {
    type: Number,
    default: 0
  },
  tabSwitches: {
    type: Number,
    default: 0
  },
  faceFlags: {
    type: Number,
    default: 0
  },
  multipleFaceEvents: {
    type: Number,
    default: 0
  },
  lookingAwayEvents: {
    type: Number,
    default: 0
  },
  violations: [{
    type: { type: String }, // e.g., 'TAB_SWITCH', 'NO_FACE', 'MULTIPLE_FACES', 'LOOKING_AWAY'
    timestamp: { type: Date, default: Date.now },
    details: mongoose.Schema.Types.Mixed
  }],
  snapshots: [{
    timestamp: { type: Date, default: Date.now },
    image: String, // base64 string
    violationType: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('ExamSession', examSessionSchema);
