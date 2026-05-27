const mongoose = require('mongoose');
const Lab = require('./models/Lab');

mongoose.connect('mongodb://localhost:27017/vlab').then(async () => {
  const labData = {
    title: 'Sorting Algorithms',
    slug: 'sorting-algorithms',
    category: 'Data Structures & Algorithms',
    difficulty: 'Beginner to Advanced',
    simulationType: 'custom',
    description: 'Understand how sorting algorithms work internally, visualize comparisons and swaps in real time, compare algorithm performance, and learn time and space complexity.',
    status: 'ACTIVE',
    tabs: {}
  };

  const existing = await Lab.findOne({ slug: labData.slug });
  if (existing) {
     console.log('Lab already exists, updating...');
     await Lab.updateOne({ slug: labData.slug }, labData);
  } else {
     console.log('Creating new Sorting Algorithms lab...');
     await Lab.create(labData);
  }

  console.log('Seeding complete.');
  process.exit(0);
});
