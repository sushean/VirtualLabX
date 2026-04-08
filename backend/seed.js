require('dotenv').config();
const mongoose = require('mongoose');
const ExamCollection = require('./models/ExamCollection');

const seedCollections = [
  { title: 'Full Stack Web Dev', examType: 'FULL_STACK', description: 'A heavily comprehensive module evaluating HTML, React, Express layers, MongoDB indexing, and advanced web topologies simultaneously.', status: 'ACTIVE' },
  { title: 'Data Structures & Algo', examType: 'DSA', description: 'Rigorous testing of fundamental and advanced data structures, algorithmic complexities, and core computer science problem solving.', status: 'ACTIVE' },
  { title: 'Python Programming', examType: 'PYTHON', description: 'Evaluate language competencies spanning data science libraries, object-oriented concepts, and performance scaling in Python.', status: 'ACTIVE' },
  { title: 'React Cert', examType: 'REACT', description: 'Testing mastery in React concurrent rendering, hook architectures, and state management.', status: 'ACTIVE' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/VLab');
    console.log('MongoDB connected for seeding...');
    
    for (let c of seedCollections) {
      const exists = await ExamCollection.findOne({ examType: c.examType });
      if (!exists) {
        await ExamCollection.create(c);
        console.log(`Seeded: ${c.title}`);
      } else {
        console.log(`Already exists: ${c.title}`);
      }
    }
    
    console.log('Seeding complete.');
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
