const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');

// @route   GET api/certificate/download/:hash
// @desc    Download the PDF certificate by its hash
// @access  Public (so QR codes can be shared and downloaded without auth login)
router.get('/download/:hash', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.hash });
    
    if (!certificate) {
      return res.status(404).json({ msg: 'Certificate not found' });
    }

    if (!certificate.pdfBuffer) {
      console.log('PDF buffer missing for:', certificate.certificateId, 'Generating retroactively...');
      try {
        const User = require('../models/User');
        const { generateCertificatePDF } = require('../services/certificateService');
        const userDoc = await User.findById(certificate.userId);
        
        if (!userDoc) {
          return res.status(404).json({ msg: 'Origin user not found.' });
        }

        const pdfBuffer = await generateCertificatePDF({
          studentName: `${userDoc.firstName} ${userDoc.lastName}`,
          courseName: certificate.examName,
          issueDate: certificate.date,
          hash: certificate.certificateId
        });
        
        certificate.pdfBuffer = pdfBuffer;
        await certificate.save();
      } catch (pdfErr) {
        console.error('Error generating retroactive PDF:', pdfErr);
        return res.status(500).json({ 
           msg: 'Failed to generate PDF layout',
           errMessage: pdfErr.message,
        });
      }
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="VirtualLabX_Certificate_${certificate.certificateId}.pdf"`
    });

    res.send(certificate.pdfBuffer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/certificate/view/:hash
// @desc    View the PDF certificate inline in the browser
// @access  Public
router.get('/view/:hash', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.hash });
    
    if (!certificate) {
      return res.status(404).json({ msg: 'Certificate not found' });
    }

    if (!certificate.pdfBuffer) {
      console.log('PDF buffer missing for:', certificate.certificateId, 'Generating retroactively...');
      try {
        const User = require('../models/User');
        const { generateCertificatePDF } = require('../services/certificateService');
        const userDoc = await User.findById(certificate.userId);
        
        if (!userDoc) {
          return res.status(404).json({ msg: 'Origin user not found.' });
        }

        const pdfBuffer = await generateCertificatePDF({
          studentName: `${userDoc.firstName} ${userDoc.lastName}`,
          courseName: certificate.examName,
          issueDate: certificate.date,
          hash: certificate.certificateId
        });
        
        certificate.pdfBuffer = pdfBuffer;
        await certificate.save();
      } catch (pdfErr) {
        console.error('Error generating retroactive PDF:', pdfErr);
        return res.status(500).json({ 
           msg: 'Failed to generate PDF layout',
           errMessage: pdfErr.message,
        });
      }
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="VirtualLabX_Certificate_${certificate.certificateId}.pdf"`
    });

    res.send(certificate.pdfBuffer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
