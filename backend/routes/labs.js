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

const multer = require('multer');
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const upload = multer({ 
  dest: 'uploads/temp/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// POST /api/labs/upload-simulation - Handles zipped pre-built dist deployments
router.post('/upload-simulation', upload.single('simulationZip'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No zip file provided.' });
  
  const tempPath = req.file.path;
  const uniqueFolderId = crypto.randomUUID();
  const extractPath = path.join(__dirname, '..', 'uploads', uniqueFolderId);

  try {
     const zip = new AdmZip(tempPath);
     zip.extractAllTo(extractPath, true);

     // Ensure index.html uniquely exists to validate it's an executable standalone package
     if (!fs.existsSync(path.join(extractPath, 'index.html'))) {
        fs.rmSync(extractPath, { recursive: true, force: true });
        return res.status(400).json({ message: 'Invalid structure: Root index.html is missing inside zip.' });
     }

     return res.status(200).json({ simulationPath: `/uploads/${uniqueFolderId}/index.html` });
  } catch (err) {
     console.error("ZIP Extractor Fault:", err);
     return res.status(500).json({ message: 'Simulation unpacking halted with internal errors.' });
  } finally {
     // Always attempt trailing garbage collection on the encoded blob buffer
     if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
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
