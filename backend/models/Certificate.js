const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  },
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  examName: {
    type: String,
    required: true
  },
  pdfBuffer: {
    type: Buffer
  }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
