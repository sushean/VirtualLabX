const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const ExamCollection = require('../models/ExamCollection');
const User = require('../models/User');
const Lab = require('../models/Lab');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const ExamSession = require('../models/ExamSession');
const { OpenAI } = require('openai');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

      const availableExamsList = await ExamCollection.find({}, 'title');
      const examTitles = availableExamsList.map(e => e.title);

      const availableLabs = await Lab.find({});
      const labTitles = availableLabs.map(l => l.title);
      const labCategoryMap = {};
      availableLabs.forEach(l => {
          labCategoryMap[l.slug] = (l.category || '').toLowerCase();
      });

      const userMeta = {
         name: `${user.firstName} ${user.lastName}`,
         overallProgress: {
             avgQuizAccuracy: Math.round(avgQuizAccuracy),
             labCompletions,
             totalLabsAttempted,
             totalPlatformLabs: labTitles.length
         }
      };

      // --- DATA SUFFICIENCY GATEKEEPER ---
      const isAdminOrMod = user.role === 'ADMIN' || user.role === 'MODERATOR';
      if (labCompletions < 5 && !isAdminOrMod) {
         return res.json({
            status: "INSUFFICIENT_DATA",
            reliability: "BLOCKED",
            labsRemaining: 5 - labCompletions,
            message: "Complete at least 5 labs to unlock AI Mentor analysis. More learning evidence is required before reliable predictions can be generated.",
            userMeta
         });
      }
      // ------------------------------------

      if (cache.lastGenerated && (Date.now() - new Date(cache.lastGenerated).getTime() < 86400000)) {
         return res.json({ ...cache, userMeta });
      }

      // Fetch Statistical Analytics Engine Data
      const topicStats = await prisma.topicPerformance.findMany({ where: { userId: req.user.id } });
      const structuredEvidence = topicStats.map(t => ({
          topic: t.topic,
          masteryScore: t.weightedScore,
          confidence: t.confidenceScore,
          attempts: t.totalAttempts,
          trend: JSON.parse(t.trendEvolution || "[]").slice(-5)
      }));

      // --- FEATURE ENGINEERING & STATISTICAL ANALYTICS ---
      const consistencyScore = qAccs.length > 1 
         ? 1 - (Math.max(...qAccs) - Math.min(...qAccs)) / 100 
         : 0.5;
         
      const advancedLabCompletionRate = labCompletions / (labTitles.length || 1);
      
      let overallReliability = "LOW";
      if (labCompletions > 20 && consistencyScore > 0.7) overallReliability = "HIGH";
      else if (labCompletions >= 5) overallReliability = "MEDIUM";

      // --- EXPLAINABILITY SIGNALS (XAI) ---
      const positiveSignals = [];
      const negativeSignals = [];
      const topContributors = [];
      
      if (consistencyScore >= 0.8) {
         positiveSignals.push({ factor: "High Consistency", impact: "+18%", evidence: "Stable learning pattern over recent activity" });
         topContributors.push({ feature: "Consistency", impact: "+18%" });
      } else {
         negativeSignals.push({ factor: "Inconsistent Performance", impact: "-10%", evidence: "Scores show high variance across attempts" });
         topContributors.push({ feature: "Consistency", impact: "-10%" });
      }
      
      if (advancedLabCompletionRate > 0.5) {
         positiveSignals.push({ factor: "Strong Practical Exposure", impact: "+15%", evidence: `Completed ${labCompletions} platform labs` });
         topContributors.push({ feature: "Practical Labs", impact: "+15%" });
      } else if (advancedLabCompletionRate < 0.2) {
         negativeSignals.push({ factor: "Low Practical Exposure", impact: "-15%", evidence: `Completed only ${labCompletions} platform labs` });
         topContributors.push({ feature: "Practical Labs", impact: "-15%" });
      }

      if (avgQuizAccuracy >= 80) {
         positiveSignals.push({ factor: "High Conceptual Accuracy", impact: "+20%", evidence: `Average quiz accuracy is ${Math.round(avgQuizAccuracy)}%` });
         topContributors.push({ feature: "Quiz Accuracy", impact: "+20%" });
      } else {
         negativeSignals.push({ factor: "Weak Conceptual Retention", impact: "-12%", evidence: `Average quiz accuracy is ${Math.round(avgQuizAccuracy)}%` });
         topContributors.push({ feature: "Quiz Accuracy", impact: "-12%" });
      }

      const evidenceCoverage = Math.min(100, Math.round(labCompletions * 5 + topicStats.length * 10));

      const subDimensions = {
         conceptualUnderstanding: Math.round(avgQuizAccuracy),
         problemSolving: Math.round(Math.min(100, (advancedLabCompletionRate * 100) + 20)),
         consistency: Math.round(consistencyScore * 100),
         retention: Math.round(avgQuizAccuracy * 0.85),
         speed: 75 
      };

      const computedReadiness = examTitles.map(title => {
         const examTitleLower = title.toLowerCase();
         
         // 1. Topic Matching Heuristics
         let targetCategories = [];
         if (examTitleLower.includes('web') || examTitleLower.includes('react')) targetCategories = ['web', 'react', 'frontend', 'backend'];
         else if (examTitleLower.includes('python')) targetCategories = ['python'];
         else if (examTitleLower.includes('data') || examTitleLower.includes('algo')) targetCategories = ['algorithm', 'data structure', 'dsa'];
         
         const isMatch = (slug) => {
             const cat = labCategoryMap[slug] || '';
             if (targetCategories.length === 0) return true;
             return targetCategories.some(tc => cat.includes(tc));
         };

         // 2. Filter User's Progress
         let relevantQuizzes = progress.quizzes.filter(q => isMatch(q.labSlug));
         let relevantLabs = progress.labs.filter(l => isMatch(l.labSlug));
         
         // Fallback if no specific data exists yet
         if (relevantQuizzes.length === 0) relevantQuizzes = progress.quizzes;
         if (relevantLabs.length === 0) relevantLabs = progress.labs;

         // 3. Exam-Specific Math
         const examQAccs = relevantQuizzes.map(q => q.accuracy);
         const examAvgQuizAccuracy = examQAccs.length ? (examQAccs.reduce((a,b)=>a+b,0) / examQAccs.length) : (avgQuizAccuracy || 0);
         
         const examLabCompletions = relevantLabs.filter(l => l.completed).length;
         const totalLabsInCategory = availableLabs.filter(l => {
             const cat = (l.category || '').toLowerCase();
             if (targetCategories.length === 0) return true;
             return targetCategories.some(tc => cat.includes(tc));
         }).length || 1;
         
         const examLabCompletionRate = examLabCompletions / totalLabsInCategory;
         
         let prob = (examAvgQuizAccuracy * 0.4) + (examLabCompletionRate * 100 * 0.6);
         let conf = 1 - (1 / (1 + examLabCompletions * 0.3)); // Confidence scales with relevant labs
         
         // Apply global consistency penalty
         prob = prob * (0.8 + (consistencyScore * 0.2));
         if (conf < 0.6) prob *= 0.8;
         
         // Topic-Specific Explainability Signals
         const examPosSignals = [...positiveSignals];
         const examNegSignals = [...negativeSignals];
         
         if (examAvgQuizAccuracy > 85) examPosSignals.push({ factor: "Topic Mastery", impact: "+12%", evidence: `Scored ${Math.round(examAvgQuizAccuracy)}% on relevant topic quizzes` });
         else if (examAvgQuizAccuracy < 50 && examAvgQuizAccuracy > 0) examNegSignals.push({ factor: "Topic Weakness", impact: "-15%", evidence: `Scored ${Math.round(examAvgQuizAccuracy)}% on relevant topic quizzes` });

         if (examLabCompletionRate > 0.5) examPosSignals.push({ factor: "Deep Topic Experience", impact: "+10%", evidence: `Completed ${examLabCompletions} related labs` });
         else if (examLabCompletionRate < 0.2 && examLabCompletions > 0) examNegSignals.push({ factor: "Shallow Topic Experience", impact: "-10%", evidence: `Completed only ${examLabCompletions} related labs` });
         
         return {
            examName: title,
            prediction: Math.min(100, Math.max(5, Math.round(prob))),
            confidence: Number(conf.toFixed(2)),
            reliability: overallReliability,
            evidenceCoverage,
            positiveSignals,
            negativeSignals,
            topContributors
         };
      });

      // Update UserMLFeatures
      try {
         await prisma.userMLFeatures.upsert({
            where: { userId: req.user.id },
            update: {
               weightedAccuracy: avgQuizAccuracy,
               advancedLabCompletionRate,
               consistencyScore,
               lastComputedAt: new Date()
            },
            create: {
               userId: req.user.id,
               weightedAccuracy: avgQuizAccuracy,
               advancedLabCompletionRate,
               consistencyScore
            }
         });
      } catch (e) {
         console.warn("Failed to upsert UserMLFeatures", e);
      }

      if (!openai) {
         return res.json({ 
            summary: "AI Offline. Computed basic readiness stats.", 
            examReadiness: computedReadiness, 
            userMeta, 
            topicStats 
         });
      }

      // Explainability Layer Prompt (Neutered LLM)
      const prompt = `You are the Explainability Layer of an XAI pipeline.
Your job is ONLY to explain the pre-computed mathematical predictions and generate improvement simulations.
DO NOT invent or alter the probabilities. DO NOT generate new scores.

PRE-COMPUTED EXAM READINESS & SIGNALS:
${JSON.stringify(computedReadiness, null, 2)}

Required JSON Output Schema:
{
  "summary": "String (Enterprise-grade summary of overall readiness)",
  "examReadiness": [
    {
      "examName": "Title exactly as provided",
      "prediction": Number,
      "confidence": Number,
      "reliability": "String",
      "evidenceCoverage": Number,
      "positiveSignals": [{"factor": "String", "impact": "String", "evidence": "String"}],
      "negativeSignals": [{"factor": "String", "impact": "String", "evidence": "String"}],
      "topContributors": [{"feature": "String", "impact": "String"}],
      "improvementSuggestions": [{"action": "Actionable roadmap step", "estimatedImpact": "+X%"}]
    }
  ]
}`;

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
         examReadiness: parsedData.examReadiness || computedReadiness,
         subDimensions,
         lastGenerated: new Date()
      };

      progress.aiFeedbackCache = payload;
      await progress.save();
      
      const { v4: uuidv4 } = require('uuid');
      const predictionId = uuidv4();
      
      try {
          await prisma.predictionTrace.create({
             data: {
                userId: req.user.id,
                predictionId,
                overallReadiness: parsedData.examReadiness[0]?.prediction || 0,
                overallConfidence: parsedData.examReadiness[0]?.confidence || 0,
                reliability: parsedData.examReadiness[0]?.reliability || overallReliability,
                formulaVersion: "v2.1",
                positiveSignals: JSON.stringify(positiveSignals),
                negativeSignals: JSON.stringify(negativeSignals),
                topContributors: JSON.stringify(topContributors),
                improvementSuggestions: JSON.stringify(parsedData.examReadiness[0]?.improvementSuggestions || [])
             }
          });
      } catch (e) {
          console.warn("Failed to audit PredictionTrace:", e);
      }

      return res.json({ ...payload, userMeta, topicStats, predictionId });
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
