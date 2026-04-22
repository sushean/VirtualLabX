const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const ExamCollection = require('../models/ExamCollection');
const User = require('../models/User');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const ExamSession = require('../models/ExamSession');
const { OpenAI } = require('openai');

// @route   GET /api/progress/user/:id
// @desc    Get detailed progress and exam history for a specific user
// @access  Private (ADMIN, MODERATOR)
router.get('/user/:id', auth, authorizeRoles('ADMIN', 'MODERATOR'), async (req, res) => {
   try {
       const user = await User.findById(req.params.id).select('-password');
       if (!user) return res.status(404).json({ msg: 'User not found' });
       const progress = await UserProgress.findOne({ userId: req.params.id });
       const exams = await ExamSession.find({ user: req.params.id }).sort({ startTime: -1 });
       res.json({ user, progress, exams });
   } catch (error) {
       console.error("Error fetching user progress:", error.message);
       res.status(500).json({ msg: 'Server error' });
   }
});

// Configure OpenAI. We don't error out immediately if missing because we have fallback logic.
let openai = null;
try {
   if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '') {
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY.trim() });
   }
} catch(e) {
   console.warn("OpenAI Initialization failed. Falling back to rule-based.");
}

// Helper to get or create UserProgress document
const getProgressDoc = async (userId) => {
   let progress = await UserProgress.findOne({ userId });
   if (!progress) {
      progress = new UserProgress({ userId });
      await progress.save();
   }
   return progress;
};

// POST /api/progress/quiz
router.post('/quiz', auth, async (req, res) => {
   try {
      const { labSlug, score, total, accuracy } = req.body;
      const progress = await getProgressDoc(req.user.id);
      
      const existing = progress.quizzes.find(q => q.labSlug === labSlug);
      if (existing) {
         existing.score = Math.max(existing.score, score);
         existing.accuracy = Math.max(existing.accuracy, accuracy);
         existing.attempts += 1;
         existing.date = Date.now();
      } else {
         progress.quizzes.push({ labSlug, score, total, accuracy, attempts: 1 });
      }
      
      // Invalidate AI Cache since new data arrived
      progress.aiFeedbackCache.lastGenerated = null;
      await progress.save();
      
      res.json(progress.quizzes);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// POST /api/progress/code
router.post('/code', auth, async (req, res) => {
   try {
      const { labSlug, successRate } = req.body;
      const progress = await getProgressDoc(req.user.id);
      
      const existing = progress.learnCode.find(c => c.labSlug === labSlug);
      if (existing) {
         existing.successRate = Math.max(existing.successRate, successRate);
         existing.completed = existing.successRate >= 100 ? true : existing.completed;
         existing.attempts += 1;
         existing.date = Date.now();
      } else {
         progress.learnCode.push({ labSlug, successRate, completed: successRate >= 100, attempts: 1 });
      }
      
      progress.aiFeedbackCache.lastGenerated = null;
      await progress.save();
      
      res.json(progress.learnCode);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// POST /api/progress/lab
router.post('/lab', auth, async (req, res) => {
   try {
      const { labSlug, progressPercentage } = req.body;
      const doc = await getProgressDoc(req.user.id);
      
      const existing = doc.labs.find(l => l.labSlug === labSlug);
      if (existing) {
         existing.progressPercentage = Math.max(existing.progressPercentage, progressPercentage);
         existing.completed = existing.progressPercentage >= 100 ? true : existing.completed;
         existing.lastAccessed = Date.now();
      } else {
         doc.labs.push({ labSlug, progressPercentage, completed: progressPercentage >= 100 });
      }
      
      doc.aiFeedbackCache.lastGenerated = null;
      await doc.save();
      
      res.json(doc.labs);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// GET /api/progress/performance
router.get('/performance', auth, async (req, res) => {
   try {
      const user = await User.findById(req.user.id);
      const progress = await getProgressDoc(req.user.id);
      const cache = progress.aiFeedbackCache || {};
      
      const qAccs = progress.quizzes.map(q => q.accuracy);
      const avgQuizAccuracy = qAccs.length ? (qAccs.reduce((a,b)=>a+b,0) / qAccs.length) : 0;
      const labCompletions = progress.labs.filter(l => l.completed).length;
      const totalLabsAttempted = progress.labs.length;

      const userMeta = {
         name: `${user.firstName} ${user.lastName}`,
         overallProgress: {
             avgQuizAccuracy: Math.round(avgQuizAccuracy),
             labCompletions,
             totalLabsAttempted
         }
      };

      if (cache.lastGenerated && (Date.now() - new Date(cache.lastGenerated).getTime() < 86400000)) {
         return res.json({ ...cache, userMeta });
      }

      // Fetch dynamic exams mapping from DB to explicitly pipe to OpenAI instruction set
      const availableExamsList = await ExamCollection.find({}, 'title');
      const examTitles = availableExamsList.map(e => e.title);

      // Rule-based fallback generator with dynamic array construction
      const generateRuleBasedFeedback = () => {
         const dummyReadiness = examTitles.map(title => ({
            examName: title,
            probability: avgQuizAccuracy > 80 && labCompletions > 0 ? 85 : 40
         }));
         
         return {
            summary: "Data indicates basic system usage, but the AI mentor isn't active or lacks rich data to establish deep insights.",
            strengths: avgQuizAccuracy > 70 ? ["Good baseline theory understanding"] : ["Initializing theory metrics..."],
            weaknesses: totalLabsAttempted < 2 ? ["Need to complete more practical labs!"] : ["Keep practicing to build muscle memory."],
            recommendations: ["Attempt a new lab simulation.", "Complete the quiz sections for your last lab."],
            examReadiness: dummyReadiness.length > 0 ? dummyReadiness : [{ examName: "Platform Certification", probability: 50 }],
            suggestedCertifications: ["Data Fundamentals Certification"]
         };
      };

      if (!openai || qAccs.length + totalLabsAttempted === 0) {
         const fallback = generateRuleBasedFeedback();
         progress.aiFeedbackCache = { ...fallback, lastGenerated: new Date() };
         await progress.save();
         return res.json({ ...fallback, userMeta });
      }

      // Explicit System Instruction overriding global score with targeted probability matrix
      const prompt = `You are an AI academic performance analyzer.
Analyze the following student data and return JSON format EXACTLY matching the schema below.
No other text except JSON. Do not output markdown code blocks, just raw JSON.

Student Data:
- Average Quiz Accuracy: ${avgQuizAccuracy.toFixed(2)}%
- Labs Completed: ${labCompletions} (Total Attempted: ${totalLabsAttempted})
- Raw Quizzes Data: ${JSON.stringify(progress.quizzes.map(q => ({ lab: q.labSlug, acc: q.accuracy })))}
- Raw LearnCode Data: ${JSON.stringify(progress.learnCode.map(c => ({ lab: c.labSlug, suc: c.successRate })))}

Database Available Exams List:
${JSON.stringify(examTitles)}

Required JSON Output Schema:
{
  "summary": "String (2-3 sentences)",
  "strengths": ["String", "String"],
  "weaknesses": ["String", "String"],
  "recommendations": ["String", "String"],
  "examReadiness": [{"examName": "Title from available list", "probability": Number (0 to 100)}],
  "suggestedCertifications": ["String"]
}
Note: Ensure every single exam from the list gets assigned a probability organically.`;

      const response = await openai.chat.completions.create({
         model: "gpt-3.5-turbo",
         messages: [{ role: "system", content: "You are an AI learning mentor providing raw JSON responses." }, { role: "user", content: prompt }],
         temperature: 0.7,
         response_format: { type: "json_object" }
      });

      const parsedData = JSON.parse(response.choices[0].message.content);
      
      // VERIFICATION LOG DIRECT TO TERMINAL
      console.log('============== 🔥 AI MENTOR INVOCATION SUCCESS ==============');
      console.log(JSON.stringify(parsedData, null, 2));
      console.log('===============================================================');
      
      const payload = {
         summary: parsedData.summary,
         strengths: parsedData.strengths || [],
         weaknesses: parsedData.weaknesses || [],
         recommendations: parsedData.recommendations || [],
         examReadiness: parsedData.examReadiness || [],
         suggestedCertifications: parsedData.suggestedCertifications || [],
         lastGenerated: new Date()
      };

      progress.aiFeedbackCache = payload;
      await progress.save();

      return res.json({ ...payload, userMeta });
   } catch (err) {
      console.error(err);
      return res.json({
         summary: "AI Error: The LLM mentor failed to parse or is offline. Please resort to manual training plans below.",
         strengths: ["Unknown (System Exception)"],
         weaknesses: ["Unknown (System Exception)"],
         recommendations: ["Reach out to instructor"],
         examReadiness: [],
         suggestedCertifications: [],
         userMeta: { name: "Student", overallProgress: { avgQuizAccuracy: 0, labCompletions: 0, totalLabsAttempted: 0 } }
      });
   }
});

module.exports = router;
