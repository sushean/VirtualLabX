require('dotenv').config();
const mongoose = require('mongoose');
const Lab = require('./models/Lab');

const seedLabs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for lab seeding...');

    const defaultLabs = [
      {
        title: 'Linear Regression',
        slug: 'linear-regression',
        description: 'Interactive machine learning simulator for linear regression.',
        category: 'Machine Learning',
        difficulty: 'Beginner',
        simulationType: 'linear-regression',
        status: 'ACTIVE',
        simulationConfig: {},
        tabs: {} // It uses native routing via App.jsx mostly, but good to have fallback
      },
      {
        title: 'Matrix Multiplication',
        slug: 'matrix-multiplication',
        description: 'Interactive educational lab for matrix operations.',
        category: 'Mathematics',
        difficulty: 'Beginner',
        simulationType: 'matrix-multiplication',
        status: 'ACTIVE',
        simulationConfig: {},
        tabs: {}
      },
      }
    ];

    // Wipe previous labs for clean seeding in testing
    await Lab.deleteMany({});

    for (const lab of defaultLabs) {
      const exists = await Lab.findOne({ slug: lab.slug });
      if (!exists) {
        await Lab.create(lab);
        console.log(`Seeded lab: ${lab.title}`);
      } else {
        console.log(`Lab already exists: ${lab.title}`);
      }
    }

    console.log('Lab seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding labs:', error);
    process.exit(1);
  }
};

seedLabs();
