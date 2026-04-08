const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionType: {
    type: String,
    enum: ['MCQ', 'MULTI', 'NUMERICAL'],
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: [{
    type: String
  }],
  correctAnswer: [{
    type: String,
    required: true
  }],
  difficulty: {
    type: String,
    default: 'medium'
  },
  topic: {
    type: String
  }
}, { timestamps: true });

// Create a dedicated connection for the Exam Questions DB
const examConnection = mongoose.createConnection(process.env.EXAM_DB_URI || 'mongodb://localhost:27017/VLab_Exams');

// Factory function to get or compile a model for a specific examType
exports.getQuestionModel = (examType) => {
  const collectionName = examType + '_questions';
  const modelName = 'Question_' + examType;

  // Check if model already exists on this specific connection
  if (examConnection.models[modelName]) {
    return examConnection.models[modelName];
  }

  return examConnection.model(modelName, questionSchema, collectionName);
};
