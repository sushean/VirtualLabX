const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { getQuestionModel } = require('../models/Question');

// @route   GET api/questions
// @desc    Get questions with filters (examType)
// @access  Private (ADMIN, MODERATOR)
router.get('/', auth, authorizeRoles('ADMIN', 'MODERATOR'), async (req, res) => {
  try {
    const { examType, difficulty, questionType, topic } = req.query;
    if (!examType) {
      return res.status(400).json({ msg: 'examType is required' });
    }

    const Question = getQuestionModel(examType);
    let filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (questionType) filter.questionType = questionType;
    if (topic) filter.topic = topic;

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/questions
// @desc    Add a question
// @access  Private (ADMIN, MODERATOR)
router.post('/', auth, authorizeRoles('ADMIN', 'MODERATOR'), async (req, res) => {
  try {
    const { examType, questionType, questionText, options, correctAnswer, difficulty, topic } = req.body;
    
    if (!examType) {
      return res.status(400).json({ msg: 'examType is required' });
    }

    const Question = getQuestionModel(examType);
    
    const newQuestion = new Question({
      questionType,
      questionText,
      options,
      correctAnswer,
      difficulty,
      topic
    });

    const question = await newQuestion.save();
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/questions/:id
// @desc    Update a question
// @access  Private (ADMIN, MODERATOR)
router.put('/:id', auth, authorizeRoles('ADMIN', 'MODERATOR'), async (req, res) => {
  try {
    const { examType } = req.body;
    if (!examType) {
      return res.status(400).json({ msg: 'examType is required to locate the question' });
    }

    const Question = getQuestionModel(examType);
    let question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    // Update fields
    const fieldsToUpdate = ['questionType', 'questionText', 'options', 'correctAnswer', 'difficulty', 'topic'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        question[field] = req.body[field];
      }
    });

    await question.save();
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/questions/:id
// @desc    Delete a question
// @access  Private (ADMIN, MODERATOR)
router.delete('/:id', auth, authorizeRoles('ADMIN', 'MODERATOR'), async (req, res) => {
  try {
    const { examType } = req.query; // Usually delete receives parameters in query or body
    if (!examType) {
      return res.status(400).json({ msg: 'examType is required to locate the question' });
    }

    const Question = getQuestionModel(examType);
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    await question.deleteOne();
    res.json({ msg: 'Question removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Question not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
