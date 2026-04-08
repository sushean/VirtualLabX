const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../middleware/auth');
const ExamSession = require('../models/ExamSession');
const Certificate = require('../models/Certificate');
const User = require('../models/User');

const { getQuestionModel } = require('../models/Question');

// @route   POST api/exam/start
// @desc    Start an exam session
// @access  Private
router.post('/start', auth, async (req, res) => {
  try {
    const { title = "Sample Full-Stack Exam", examType = "FULL_STACK" } = req.body;
    
    // Dynamically get the model for the specific exam topic collection
    const Question = getQuestionModel(examType);

    // Pick 10 MCQ, 5 MULTI, 5 NUMERICAL randomly
    const mcqs = await Question.aggregate([
      { $match: { questionType: 'MCQ' } },
      { $sample: { size: 10 } }
    ]);
    const multis = await Question.aggregate([
      { $match: { questionType: 'MULTI' } },
      { $sample: { size: 5 } }
    ]);
    const numericals = await Question.aggregate([
      { $match: { questionType: 'NUMERICAL' } },
      { $sample: { size: 5 } }
    ]);

    let examTitle = title;
    const ExamCollection = require('../models/ExamCollection');
    const existingCol = await ExamCollection.findOne({ examType });
    if (existingCol) {
      examTitle = existingCol.title;
    }

    const allQuestions = [...mcqs, ...multis, ...numericals];
    if (allQuestions.length === 0) {
      return res.status(400).json({ msg: 'No questions available for this module yet. Please contact an administrator.' });
    }
    
    // Store only ObjectIds (converted to Strings)
    const questionIds = allQuestions.map(q => q._id.toString());

    // Create new exam session
    const newSession = new ExamSession({
      userId: req.user.id,
      title: examTitle,
      examType,
      questions: questionIds,
      startTime: new Date(),
    });

    const session = await newSession.save();
    
    res.json({
      sessionId: session._id,
      title: session.title,
      examType: session.examType,
      totalQuestions: session.questions.length,
      startTime: session.startTime,
      status: session.status
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/exam/question/:sessionId
// @desc    Get the current question without correct answer
// @access  Private
router.get('/question/:sessionId', auth, async (req, res) => {
  try {
    const session = await ExamSession.findById(req.params.sessionId);
    if (!session || session.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Session not found or unauthorized' });
    }

    if (session.status !== 'IN_PROGRESS') {
      return res.status(400).json({ msg: 'Exam is not in progress' });
    }

    const { currentIndex, questions, examType } = session;
    if (currentIndex >= questions.length) {
      return res.status(400).json({ msg: 'All questions answered' });
    }

    const questionId = questions[currentIndex];
    const Question = getQuestionModel(examType);
    const qDetails = await Question.findById(questionId);

    if (!qDetails) {
      return res.status(404).json({ msg: 'Question no longer exists in DB' });
    }

    // Return question without correct answer
    res.json({
      id: qDetails._id.toString(),
      text: qDetails.questionText,
      options: qDetails.options,
      questionType: qDetails.questionType,
      currentIndex,
      totalQuestions: questions.length
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Session not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/exam/answer
// @desc    Submit an answer
// @access  Private
router.post('/answer', auth, async (req, res) => {
  try {
    const { sessionId, questionId, selectedOption } = req.body;
    
    const session = await ExamSession.findById(sessionId);
    if (!session || session.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Session not found or unauthorized' });
    }

    if (session.status !== 'IN_PROGRESS') {
      return res.status(400).json({ msg: 'Exam is not in progress' });
    }

    // Update answers
    session.answers.push({ questionId, selectedOption });
    session.currentIndex += 1;
    await session.save();

    res.json({ msg: 'Answer saved' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/exam/monitor
// @desc    Send violation/tracking info
// @access  Private
router.post('/monitor', auth, async (req, res) => {
  try {
    const { sessionId, violationType, details } = req.body;
    
    const session = await ExamSession.findById(sessionId);
    if (!session || session.userId.toString() !== req.user.id || session.status !== 'IN_PROGRESS') {
      return res.status(400).json({ msg: 'Invalid session' });
    }

    session.violations.push({ type: violationType, details });

    if (violationType === 'TAB_SWITCH') session.tabSwitches += 1;
    if (violationType === 'NO_FACE') session.faceFlags += 1;
    if (violationType === 'MULTIPLE_FACES') session.multipleFaceEvents += 1;
    if (violationType === 'LOOKING_AWAY') session.lookingAwayEvents += 1;

    await session.save();
    res.json({ msg: 'Logged successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/exam/snapshot
// @desc    Send base64 snapshot on violation
// @access  Private
router.post('/snapshot', auth, async (req, res) => {
  try {
    const { sessionId, image, violationType } = req.body;
    
    // Add size validation here if necessary to avoid PayloadTooLarge error
    const session = await ExamSession.findById(sessionId);
    if (!session || session.userId.toString() !== req.user.id || session.status !== 'IN_PROGRESS') {
      return res.status(400).json({ msg: 'Invalid session' });
    }

    session.snapshots.push({ image, violationType });
    await session.save();

    res.json({ msg: 'Snapshot saved' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/exam/submit
// @desc    Submit the exam and generate results
// @access  Private
router.post('/submit', auth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    const session = await ExamSession.findById(sessionId);
    if (!session || session.userId.toString() !== req.user.id || session.status !== 'IN_PROGRESS') {
      return res.status(400).json({ msg: 'Invalid session' });
    }

    // Calculate score
    let score = 0;
    const Question = getQuestionModel(session.examType);
    const questionsList = await Question.find({ _id: { $in: session.questions } });
    const qMap = {};
    questionsList.forEach(q => qMap[q._id.toString()] = q);

    session.answers.forEach(answer => {
      const q = qMap[answer.questionId];
      if (q) {
        const correct = [...q.correctAnswer].sort().join(',');
        let selected = '';
        if (Array.isArray(answer.selectedOption)) {
           selected = [...answer.selectedOption].sort().join(',');
        } else if (typeof answer.selectedOption === 'string') {
           selected = answer.selectedOption.split(',').map(s => s.trim()).sort().join(',');
        }
        
        if (correct === selected) {
          score += 10; // 10 points per question
        }
      }
    });

    const maxScore = session.questions.length * 10;
    // Save to session properties
    session.score = score;
    session.maxScore = maxScore;

    // Calculate cheating score
    const cs = (session.tabSwitches * 10) + (session.faceFlags * 10) + (session.multipleFaceEvents * 40) + (session.lookingAwayEvents * 10);
    session.cheatingScore = cs;

    // Determine status
    if (cs >= 70) {
      session.status = 'DISQUALIFIED';
    } else {
      session.status = 'COMPLETED';
    }

    await session.save();

    let certificate = null;
    // Generate certificate if pass
    // Passing score criteria: >= 70% of maxScore and cheatingScore < 30 (as per PRD)
    if (session.status === 'COMPLETED' && score >= (maxScore * 0.7) && cs < 30) {
      certificate = new Certificate({
        userId: req.user.id,
        score,
        maxScore,
        certificateId: crypto.randomUUID(),
        examName: session.title
      });
      await certificate.save();
    }

    res.json({
      score,
      maxScore,
      cheatingScore: cs,
      status: session.status,
      certificate: certificate,
      answersLength: session.answers.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const authorizeRoles = require('../middleware/authorizeRoles');

// @route   GET api/exam/all
// @desc    Get all exams for admin dashboard
// @access  Private (Admin only)
router.get('/all', auth, authorizeRoles('ADMIN', 'MODERATOR'), async (req, res) => {
  try {
    const sessions = await ExamSession.find().populate('userId', ['name', 'email']).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
