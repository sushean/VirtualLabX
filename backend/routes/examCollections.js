const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const ExamCollection = require('../models/ExamCollection');

// @route   GET api/examCollections
// @desc    Get all exam collections (public or for authenticated users)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const collections = await ExamCollection.find().sort({ createdAt: -1 });
    res.json(collections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/examCollections
// @desc    Create a new exam collection
// @access  Private (ADMIN, MODERATOR)
router.post('/', auth, authorizeRoles('ADMIN', 'MODERATOR'), async (req, res) => {
  try {
    const { title, examType, description, status } = req.body;

    let existing = await ExamCollection.findOne({ examType });
    if (existing) {
      return res.status(400).json({ msg: 'ExamCollection with this examType already exists' });
    }

    const newCollection = new ExamCollection({
      title,
      examType,
      description,
      status
    });

    const collection = await newCollection.save();
    res.json(collection);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/examCollections/:id
// @desc    Update an exam collection
// @access  Private (ADMIN, MODERATOR)
router.put('/:id', auth, authorizeRoles('ADMIN', 'MODERATOR'), async (req, res) => {
  try {
    const { title, examType, description, status } = req.body;
    let collection = await ExamCollection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ msg: 'ExamCollection not found' });
    }

    if (title) collection.title = title;
    if (examType) collection.examType = examType;
    if (description) collection.description = description;
    if (status) collection.status = status;

    await collection.save();
    res.json(collection);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/examCollections/:id
// @desc    Delete an exam collection
// @access  Private (ADMIN, MODERATOR)
router.delete('/:id', auth, authorizeRoles('ADMIN', 'MODERATOR'), async (req, res) => {
  try {
    const collection = await ExamCollection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ msg: 'ExamCollection not found' });
    }

    await collection.deleteOne();
    res.json({ msg: 'ExamCollection removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'ExamCollection not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
