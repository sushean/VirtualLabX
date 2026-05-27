const mongoose = require('mongoose');
const UserProgress = require('./models/UserProgress');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/vlab').then(async () => {
  const users = await User.find({});
  if (users.length === 0) {
      console.log("No users found to seed.");
      process.exit(0);
  }
  
  for (const user of users) {
      let progress = await UserProgress.findOne({ userId: user._id });
      if (!progress) {
          progress = new UserProgress({ userId: user._id });
      }
      
      // Clear existing arrays for fresh seed
      progress.labs = [];
      progress.quizzes = [];
      progress.learnCode = [];
      progress.exams = [];
      
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      
      // Labs (Using actual project slugs)
      progress.labs.push(
          { labSlug: 'matrix-multiplication', progressPercentage: 100, completed: true, timeSpent: 1500, lastAccessed: now - 5 * oneDay },
          { labSlug: 'dl-basics', progressPercentage: 80, completed: false, timeSpent: 900, lastAccessed: now - 3 * oneDay },
          { labSlug: 'linear-regression', progressPercentage: 100, completed: true, timeSpent: 1200, lastAccessed: now - 1 * oneDay },
          { labSlug: 'blockchain-simulator', progressPercentage: 100, completed: true, timeSpent: 2200, lastAccessed: now - 8 * oneDay },
          { labSlug: 'quantum-computing', progressPercentage: 100, completed: true, timeSpent: 1800, lastAccessed: now - 2 * oneDay }
      );
      
      // Quizzes
      progress.quizzes.push(
          { labSlug: 'matrix-multiplication', score: 8, total: 10, accuracy: 80, attempts: 2, date: now - 4 * oneDay },
          { labSlug: 'dl-basics', score: 6, total: 10, accuracy: 60, attempts: 1, date: now - 2 * oneDay },
          { labSlug: 'linear-regression', score: 9, total: 10, accuracy: 90, attempts: 1, date: now - 1 * oneDay }
      );
      
      // Code
      progress.learnCode.push(
          { labSlug: 'matrix-multiplication', completed: true, successRate: 100, attempts: 3, date: now - 4 * oneDay },
          { labSlug: 'linear-regression', completed: true, successRate: 100, attempts: 1, date: now - 1 * oneDay }
      );
      
      // Exams (Using actual project exams)
      progress.exams.push(
          { examType: 'Full Stack Web Dev', score: 85, maxScore: 100, passed: true, date: now - 10 * oneDay },
          { examType: 'Data Structures & Algo', score: 92, maxScore: 100, passed: true, date: now - 6 * oneDay }
      );

      // Invalidate cache
      progress.aiFeedbackCache = null;
      
      await progress.save();
      console.log(`Seeded activity for user ${user.email}`);
  }
  
  console.log("Seeding complete!");
  process.exit(0);
});
