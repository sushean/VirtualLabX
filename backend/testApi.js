const mongoose = require('mongoose');
const UserProgress = require('./models/UserProgress');

mongoose.connect('mongodb://localhost:27017/vlab').then(async () => {
  const docs = await UserProgress.find({});
  for (const doc of docs) {
     if (doc.aiFeedbackCache) {
        console.log(JSON.stringify(doc.aiFeedbackCache, null, 2));
     }
  }
  process.exit(0);
});
