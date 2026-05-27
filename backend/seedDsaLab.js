const mongoose = require('mongoose');
const Lab = require('./models/Lab');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vlab';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for DSA seeding...');
    
    const dsaLab = {
      title: 'Data Structures & Algorithms',
      slug: 'dsa',
      category: 'Computer Science',
      difficulty: 'Beginner to Advanced',
      simulationType: 'dsa',
      description: 'Master the fundamental building blocks of computer science. Visualize arrays, linked lists, stacks, queues, trees, graphs, sorting/searching, dynamic programming, and greedy choices through highly interactive simulations and a multi-language playground.',
      status: 'ACTIVE',
      tabs: {
        objective: [
          'Master fundamental structures including Arrays, Lists, Stacks, Queues, and Hash Tables.',
          'Trace complex structures such as BSTs, AVL Trees, Heaps, Tries, and dynamic Graphs.',
          'Visualize time complexities, comparing O(1), O(N), O(N log N), and O(N²) execution sweeps.',
          'Execute C++, Java, Python, and JavaScript implementations in real time.',
          'Practice solving standardized technical problems with active dry-run state traces.'
        ]
      }
    };

    const existing = await Lab.findOne({ slug: dsaLab.slug });
    if (existing) {
      console.log('DSA Lab already exists in database. Updating configurations...');
      await Lab.updateOne({ slug: dsaLab.slug }, dsaLab);
    } else {
      console.log('Registering new DSA Lab in database...');
      await Lab.create(dsaLab);
    }

    console.log('DSA Lab seeded successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to seed DSA Lab:', err);
    process.exit(1);
  });
