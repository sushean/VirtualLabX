const mongoose = require('mongoose');
const UserProgress = require('./models/UserProgress');

mongoose.connect('mongodb://localhost:27017/vlab')
  .then(() => UserProgress.updateMany({}, { $set: { 'aiFeedbackCache.lastGenerated': null } }))
  .then(() => { console.log('Cache cleared'); process.exit(0); })
  .catch(err => { console.error(err); process.exit(1); });
