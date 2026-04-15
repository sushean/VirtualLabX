const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');

// @route   GET api/verify/:hash
// @desc    Verify a certificate is authentic
// @access  Public
router.get('/:hash', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.hash })
      .populate('userId', ['firstName', 'lastName']);
    
    if (!certificate) {
      return res.json({ valid: false });
    }

    res.json({
      valid: true,
      data: {
        certificateId: certificate.certificateId,
        studentName: `${certificate.userId.firstName} ${certificate.userId.lastName}`,
        examName: certificate.examName,
        issueDate: certificate.date,
        score: certificate.score,
        maxScore: certificate.maxScore
      }
    });

  } catch (err) {
    console.error('Error verifying certificate:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
