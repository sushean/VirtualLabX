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
  examType: {
    type: String,
    required: true
  },
  questions: [{
    type: String // We will store Question ObjectIds here
  }],
  currentIndex: {
    type: Number,
    default: 0
  },
  answers: [{
    questionId: String,
    selectedOption: mongoose.Schema.Types.Mixed // Can be String or Array for MULTI type questions
  }],
  score: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    default: 0
  },
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
