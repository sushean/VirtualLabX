const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const Certificate = require('../models/Certificate');

// @route   GET api/certificates/my
// @desc    Get logged in user's certificates
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(certificates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/certificates/all
// @desc    Get all certificates (admin/moderator)
// @access  Private
router.get('/all', auth, authorizeRoles('ADMIN', 'MODERATOR'), async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate('userId', ['firstName', 'lastName', 'email'])
      .sort({ date: -1 });
    res.json(certificates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
