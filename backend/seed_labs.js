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
      {
        title: 'Deep Learning Basics (Dynamic)',
        slug: 'dl-basics',
        description: 'Understand deep learning neural networks effectively.',
        category: 'Machine Learning',
        difficulty: 'Advanced',
        simulationType: 'flow',
        status: 'ACTIVE',
        simulationConfig: { nodes: [{ id:'1', type:'input', data:{label:'Data Input'}, position:{x:0, y:0} }] },
        tabs: {
           introduction: [
              { type: 'paragraph', text: 'Deep learning is an artificial intelligence function that imitates the workings of the human brain in processing data for use in detecting objects, recognizing speech, translating languages, and making decisions.' },
              { type: 'header-cyan', text: '🔍 What is Deep Learning?' },
              { type: 'glass-box', text: 'Deep learning AI is able to learn without human supervision, drawing from data that is both unstructured and unlabeled.' },
              { type: 'alert-red', title: 'Key Rule', text: 'Deep learning models require massive amounts of data.', highlight: 'More layers mathematically stack nonlinear decision boundaries' },
              { type: 'split-image', title: 'The Network Architecture', text: 'Hidden layers abstract features recursively.', list: ['Input Node', 'Hidden Tensor', 'Output Vector'], codeSnippet: 'model = Sequential()\nmodel.add(Dense(64, activation="relu"))' }
           ],
           objective: [
              { type: 'header-purple', text: 'Module Goals' },
              { type: 'paragraph', text: 'By the end of this module you will be able to:' },
              { type: 'split-image', list: ['Understand multi-layer perceptrons', 'Grasp the concept of backpropagation', 'Calculate loss metrics'] }
           ],
           targetAudience: [{ title: 'Advanced Engineers', desc: 'People who understand ML concepts.' }],
           courseAlignment: { alignment: ['Neural Networks 101', 'AI Specialization'], typicallyPartOf: ['4th year computer science'] },
           quiz: [
             { questionType: 'MCQ', questionText: 'What is deep learning primarily based on?', options: ['Artificial Neural Networks', 'Decision Trees', 'Support Vector Machines'], correctAnswer: ['Artificial Neural Networks'] }
           ],
           learnCode: {
             items: [
               { step: 'Import Keras', code: 'import keras\nfrom keras.models import Sequential', explanation: 'Keras -> High-level neural networks API', summary: 'Import basic tools.' }
             ],
             tests: []
           }
        }
      },
      {
        title: 'Blockchain Ledger',
        slug: 'blockchain-simulator',
        description: 'Simulate distributed ledger technology.',
        category: 'Computer Science',
        difficulty: 'Medium',
        simulationType: 'blockchain',
        status: 'UPCOMING',
        statusMessage: 'Estimated Release: Fall 2026',
        simulationConfig: {},
        tabs: {}
      },
      {
        title: 'Advanced Quantum Computing',
        slug: 'quantum-computing',
        description: 'Pro grade quantum algorithm simulator.',
        category: 'Physics',
        difficulty: 'Expert',
        simulationType: 'quantum',
        status: 'LOCKED',
        statusMessage: 'Requires Pro Subscription',
        simulationConfig: {},
        tabs: {}
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
