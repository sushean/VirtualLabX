const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/vlab').then(async () => {
  const Lab = mongoose.model('Lab', new mongoose.Schema({ slug: String }, {strict: false}));
  await Lab.deleteMany({ slug: { $in: ['dl-basics', 'blockchain-simulator', 'quantum-computing'] } });
  console.log('Old duplicate labs deleted.');
  process.exit(0);
});
