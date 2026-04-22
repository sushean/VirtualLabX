const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  category: String,
  difficulty: String,
  simulationType: String,
  simulationConfig: Object,
  status: { type: String, enum: ['ACTIVE', 'UPCOMING', 'LOCKED'], default: 'ACTIVE' },
  statusMessage: { type: String },
  tabs: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Lab', LabSchema);
