const express = require('express');
const router = express.Router();
const Lab = require('../models/Lab');

// GET /api/labs - list all labs
router.get('/', async (req, res) => {
  try {
    const labs = await Lab.find().sort({ createdAt: -1 });
    res.json(labs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/labs - create a new lab
router.post('/', async (req, res) => {
  try {
    const lab = new Lab(req.body);
    await lab.save();
    res.status(201).json(lab);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/labs/:slug - get a specific lab by slug
router.get('/:slug', async (req, res) => {
  try {
    const lab = await Lab.findOne({ slug: req.params.slug });
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }
    res.json(lab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/labs/:id - update a lab
router.put('/:id', async (req, res) => {
  try {
    const lab = await Lab.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }
    res.json(lab);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/labs/:id - delete a lab
router.delete('/:id', async (req, res) => {
  try {
    const lab = await Lab.findByIdAndDelete(req.params.id);
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }
    res.json({ message: 'Lab successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
