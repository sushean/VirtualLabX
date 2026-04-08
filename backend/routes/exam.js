const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../middleware/auth');
const ExamSession = require('../models/ExamSession');
const Certificate = require('../models/Certificate');
const User = require('../models/User');

const SAMPLE_QUESTIONS = [
  { id: 'q1', text: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Text Markup Language', 'Hyper Tabular Markup Language', 'None of these'], correctAnswer: 'Hyper Text Markup Language' },
  { id: 'q2', text: 'Which language is used for styling web pages?', options: ['HTML', 'JQuery', 'CSS', 'XML'], correctAnswer: 'CSS' },
  { id: 'q3', text: 'What is the main purpose of React?', options: ['Database Management', 'Building User Interfaces', 'Server-side processing', 'Styling'], correctAnswer: 'Building User Interfaces' },
  { id: 'q4', text: 'Who originally created Node.js?', options: ['Brendan Eich', 'Ryan Dahl', 'Tim Berners-Lee', 'Linus Torvalds'], correctAnswer: 'Ryan Dahl' },
  { id: 'q5', text: 'What type of database is MongoDB?', options: ['Relational', 'Document-based NoSQL', 'Graph Database', 'Key-Value Memory Store'], correctAnswer: 'Document-based NoSQL' },
  { id: 'q6', text: 'What does CSS stand for?', options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'], correctAnswer: 'Cascading Style Sheets' },
  { id: 'q7', text: 'In the MERN stack, what does the E stand for?', options: ['Electron', 'Ember', 'Express', 'Entity'], correctAnswer: 'Express' },
  { id: 'q8', text: 'Which part of the MERN stack is typically used for the frontend?', options: ['MongoDB', 'Express', 'React', 'Node'], correctAnswer: 'React' },
  { id: 'q9', text: 'What is a JSON Web Token (JWT) primarily used for?', options: ['Styling pages', 'Authentication and Information Exchange', 'Database querying', 'Routing'], correctAnswer: 'Authentication and Information Exchange' },
  { id: 'q10', text: 'Which React hook is used for managing state in functional components?', options: ['useEffect', 'useReducer', 'useMemo', 'useState'], correctAnswer: 'useState' }
];

// @route   POST api/exam/start
// @desc    Start an exam session
// @access  Private
router.post('/start', auth, async (req, res) => {
  try {
    const { title = "Sample Full-Stack Exam" } = req.body;
    
    // Create new exam session
    const newSession = new ExamSession({
      userId: req.user.id,
      title,
      questions: SAMPLE_QUESTIONS,
      startTime: new Date(),
    });

    const session = await newSession.save();
    
    res.json({
      sessionId: session._id,
      title: session.title,
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

    const { currentIndex, questions } = session;
    if (currentIndex >= questions.length) {
      return res.status(400).json({ msg: 'All questions answered' });
    }

    const currentQuestion = questions[currentIndex];
    // Return question without correct answer
    res.json({
      id: currentQuestion.id,
      text: currentQuestion.text,
      options: currentQuestion.options,
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
    session.answers.forEach(answer => {
      const q = session.questions.find(sq => sq.id === answer.questionId);
      if (q && q.correctAnswer === answer.selectedOption) {
        score += 10; // 10 points per question
      }
    });

    const maxScore = session.questions.length * 10;

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

// @route   GET api/exam/all
// @desc    Get all exams for admin dashboard
// @access  Private (should ideally be Admin only)
router.get('/all', auth, async (req, res) => {
  try {
    const sessions = await ExamSession.find().populate('userId', ['name', 'email']).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
