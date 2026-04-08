const mongoose = require('mongoose');

const examCollectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'UPCOMING'],
    default: 'ACTIVE'
  }
}, { timestamps: true });

module.exports = mongoose.model('ExamCollection', examCollectionSchema);
