const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  labs: [{
    labSlug: { type: String, required: true },
    progressPercentage: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    timeSpent: { type: Number, default: 0 }, // stored in seconds
    lastAccessed: { type: Date, default: Date.now }
  }],
  
  quizzes: [{
    labSlug: { type: String, required: true },
    score: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    attempts: { type: Number, default: 1 },
    date: { type: Date, default: Date.now }
  }],

  learnCode: [{
    labSlug: { type: String, required: true },
    completed: { type: Boolean, default: false },
    successRate: { type: Number, default: 0 }, // e.g. code tests passed vs failed
    attempts: { type: Number, default: 1 },
    date: { type: Date, default: Date.now }
  }],

  exams: [{
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamSession' },
    examType: { type: String },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
  }],

  // Cached AI Evaluation to avoid burning tokens
  aiFeedbackCache: {
    summary: { type: String },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    recommendations: [{ type: String }],
    examReadiness: [{ 
       examName: { type: String }, 
       probability: { type: Number } 
    }],
    suggestedCertifications: [{ type: String }],
    lastGenerated: { type: Date }
  }

}, { timestamps: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);
