const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const ExamCollection = require('../models/ExamCollection');
const User = require('../models/User');
const Lab = require('../models/Lab');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const ExamSession = require('../models/ExamSession');
const TopicCache = require('../models/TopicCache');
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
      const labSlugToTitle = {};
      availableLabs.forEach(l => {
          labCategoryMap[l.slug] = (l.category || '').toLowerCase();
          labSlugToTitle[l.slug] = l.title;
      });

      const activityLog = [];
      if (progress.labs) {
          progress.labs.forEach(l => {
              activityLog.push({
                  id: `lab-${l._id || Math.random()}`,
                  type: 'LAB',
                  title: labSlugToTitle[l.labSlug] || l.labSlug,
                  score: l.progressPercentage,
                  date: l.lastAccessed,
                  completed: l.completed
              });
          });
      }
      if (progress.quizzes) {
          progress.quizzes.forEach(q => {
              activityLog.push({
                  id: `quiz-${q._id || Math.random()}`,
                  type: 'QUIZ',
                  title: labSlugToTitle[q.labSlug] || q.labSlug,
                  score: q.accuracy,
                  date: q.date
              });
          });
      }
      if (progress.learnCode) {
          progress.learnCode.forEach(c => {
              activityLog.push({
                  id: `code-${c._id || Math.random()}`,
                  type: 'CODE',
                  title: labSlugToTitle[c.labSlug] || c.labSlug,
                  score: c.successRate,
                  date: c.date,
                  completed: c.completed
              });
          });
      }
      if (progress.exams) {
          progress.exams.forEach(e => {
              activityLog.push({
                  id: `exam-${e._id || Math.random()}`,
                  type: 'EXAM',
                  title: e.examType || 'Certification Exam',
                  score: e.maxScore ? Math.round((e.score / e.maxScore) * 100) : 0,
                  date: e.date,
                  passed: e.passed
              });
          });
      }
      activityLog.sort((a, b) => new Date(b.date) - new Date(a.date));

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
         const latestDiagnostic = progress.diagnostics && progress.diagnostics.length 
            ? progress.diagnostics[progress.diagnostics.length - 1] 
            : null;
         const diagScore = latestDiagnostic ? latestDiagnostic.score : null;
         
         const activeSubDimensions = {
            conceptualUnderstanding: Math.round(diagScore !== null ? (avgQuizAccuracy * 0.6 + diagScore * 0.4) : (cache.subDimensions?.conceptualUnderstanding || avgQuizAccuracy)),
            problemSolving: cache.subDimensions?.problemSolving || Math.round(Math.min(100, (advancedLabCompletionRate * 100) + 20)),
            consistency: cache.subDimensions?.consistency || Math.round(consistencyScore * 100),
            retention: cache.subDimensions?.retention || Math.round(avgQuizAccuracy * 0.85),
            speed: cache.subDimensions?.speed || 75
         };

         return res.json({ 
            ...cache, 
            subDimensions: activeSubDimensions,
            userMeta, 
            activityLog, 
            coveredTopics: progress.coveredTopics || [], 
            diagnostics: progress.diagnostics || [] 
         });
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

      const latestDiagnostic = progress.diagnostics && progress.diagnostics.length 
         ? progress.diagnostics[progress.diagnostics.length - 1] 
         : null;
      const diagScore = latestDiagnostic ? latestDiagnostic.score : null;

      const subDimensions = {
         conceptualUnderstanding: Math.round(diagScore !== null ? (avgQuizAccuracy * 0.6 + diagScore * 0.4) : avgQuizAccuracy),
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
            topicStats,
            activityLog,
            subDimensions,
            diagnostics: progress.diagnostics || [],
            coveredTopics: progress.coveredTopics || []
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

      return res.json({ ...payload, userMeta, topicStats, predictionId, activityLog, coveredTopics: progress.coveredTopics || [], diagnostics: progress.diagnostics || [] });
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

// Helper library of highly structured, rich fallback content for related curriculum topics
const fallbackTopics = {
  "gradient-descent": {
    title: "Gradient Descent",
    introduction: "Gradient Descent is a foundational optimization algorithm used widely in Machine Learning to minimize the error (or loss) of models. It works by iteratively adjusting the model's weights in the direction of steepest descent, as calculated by the negative gradient of the loss function.",
    corePrinciples: [
      { title: "Objective Function (Loss)", description: "A mathematical description of the difference between model predictions and actual data labels. Minimizing this error optimizes performance." },
      { title: "The Gradient Vector", description: "The multi-dimensional slope vector containing all partial derivatives. Subtracting the gradient pushes parameter values downhill." },
      { title: "Learning Rate Adjustments", description: "The hyperparameter controlling the size of steps. Too high causes oscillation and divergence; too low results in slow convergence." }
    ],
    deepDive: "At each iteration, parameters theta are updated via the equation: theta = theta - alpha * grad(J(theta)), where alpha is the learning rate and grad(J(theta)) is the gradient vector. In deep learning, variations like Stochastic Gradient Descent (SGD) compute the gradient on random individual samples to add noise and avoid local minima, while Adam uses momentum and adaptive scaling.",
    applications: [
      { name: "Supervised Learning Networks", description: "Utilized during backpropagation to update layers of deep learning algorithms." },
      { name: "Linear and Logistic Regressions", description: "Optimizes intercept and coefficient values for line fitting." }
    ],
    recommendations: [
      { type: "Video", title: "Gradient Descent, how neural networks learn (3Blue1Brown)", link: "https://www.youtube.com/watch?v=IHZwWFHWa-w", description: "Masterful visual explanation of high-dimensional gradient spaces." },
      { type: "Book", title: "Hands-On Machine Learning (Aurélien Géron)", link: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/", description: "Excellent practical chapters covering linear models and batch vs SGD optimization." }
    ]
  },
  "loss-functions": {
    title: "Loss Functions",
    introduction: "A loss function (or cost function) measures how well a machine learning model's predictions align with target values. Choosing an appropriate loss function is crucial, as it defines the gradient landscape that the optimizer uses to learn.",
    corePrinciples: [
      { title: "Mean Squared Error (MSE)", description: "Calculates the average of squared differences. Highly sensitive to outliers due to the squaring operation." },
      { title: "Binary Cross-Entropy", description: "Measures accuracy for two-class classification. Evaluates predicted probability against the binary target." },
      { title: "Mean Absolute Error (MAE)", description: "Calculates the absolute average difference, providing robustness against outlier interference." }
    ],
    deepDive: "For regression, MSE penalizes large errors heavily, whereas MAE treats all errors linearly. For classification, Cross-Entropy Loss uses logarithmic penalty curves: - (y * log(p) + (1-y) * log(1-p)). This scales infinitely as predictions get further from targets, providing massive gradients that trigger rapid parameter adaptation.",
    applications: [
      { name: "Logistic Classifiers", description: "Relies on cross-entropy loss to separate distinct categorical boundaries." },
      { name: "Generative Adversarial Nets", description: "Uses complex minimax loss terms between generator and discriminator networks." }
    ],
    recommendations: [
      { type: "Article", title: "A Comprehensive Guide to Loss Functions (Towards Data Science)", link: "https://towardsdatascience.com/common-loss-functions-in-machine-learning-46873e11d3bb", description: "Detailed guide comparing regression, classification, and ranking loss formulations." },
      { type: "Course", title: "Deep Learning Specialization: Neural Networks and Deep Learning", link: "https://www.coursera.org/learn/neural-networks-deep-learning", description: "Covers cross-entropy derivation and implementation from scratch." }
    ]
  },
  "overfitting-regularization": {
    title: "Overfitting & Regularization",
    introduction: "Overfitting occurs when a model learns training data noise instead of underlying patterns, leading to poor generalization. Regularization techniques introduce penalties or constraints to prevent models from becoming overly complex.",
    corePrinciples: [
      { title: "L1 Regularization (Lasso)", description: "Adds absolute weight magnitude penalties, driving redundant weight parameters to zero to select clean features." },
      { title: "L2 Regularization (Ridge)", description: "Adds squared weight penalties, shrinking parameters uniformly to minimize high variance." },
      { title: "Dropout Layers", description: "Randomly deactivates neurons during training batches, forcing nodes to learn co-independent features." }
    ],
    deepDive: "L1 regularization modifies the cost J by adding lambda * sum(|w|), creating a diamond-shaped constraint space that yields sparse weights. L2 regularization adds lambda/2 * sum(w^2), forming a spherical constraint space. In deep neural nets, early stopping acts as a natural regularizer by halting optimization before training error reaches absolute zero.",
    applications: [
      { name: "High-Dimensional Classifiers", description: "Using Lasso to filter out thousands of irrelevant predictive noise variables." },
      { name: "Deep Image ConvNets", description: "Relying on Dropout and weight decay to sustain validation performance." }
    ],
    recommendations: [
      { type: "Video", title: "Regularization Part 1: Ridge (L2) Regression (StatQuest)", link: "https://www.youtube.com/watch?v=Q81RR3yKn30", description: "Wonderfully intuitive explanation of Ridge regression mechanics." },
      { type: "Book", title: "Introduction to Statistical Learning (ISLR)", link: "https://www.statlearning.com/", description: "Crucial resource covering validation splits, bias-variance, and shrinkage." }
    ]
  },
  "supervised-learning": {
    title: "Supervised Learning",
    introduction: "Supervised learning is the paradigm of machine learning where models are trained on labeled data. The system learns a mapping function from input features to known target outputs, allowing it to predict labels for novel, unseen samples.",
    corePrinciples: [
      { title: "Labeled Datasets", description: "Data instances containing both features (X) and verified targets (y), acting as a strict ground truth." },
      { title: "Regression vs Classification", description: "Regression maps continuous targets (e.g. prices), whereas classification handles discrete class boundaries." },
      { title: "Generalization Bounds", description: "The capacity of a trained function to accurately predict labels on independent validation distributions." }
    ],
    deepDive: "Given a training set S = {(x1, y1), ..., (xn, yn)}, supervised learning seeks a function h in the hypothesis space H that minimizes empirical risk: R(h) = 1/n * sum(L(h(xi), yi)). Common algorithms include Decision Trees, Support Vector Machines (SVMs), Linear Regressions, and Neural Networks.",
    applications: [
      { name: "Spam Detection Systems", description: "Classifies email texts as spam or inbox-worthy based on historical corpus training." },
      { name: "Medical Diagnosis Engines", description: "Predicts disease onset probabilities using historic patient health markers." }
    ],
    recommendations: [
      { type: "Course", title: "Machine Learning Specialization (DeepLearning.AI)", link: "https://www.coursera.org/specializations/machine-learning-introduction", description: "Unmatched foundational training in all core supervised learning methods." },
      { type: "Article", title: "Supervised Learning on Scikit-Learn", link: "https://scikit-learn.org/stable/supervised_learning.html", description: "Comprehensive documentation and examples for deploying supervised models." }
    ]
  },
  "linear-algebra": {
    title: "Linear Algebra",
    introduction: "Linear Algebra is the foundational branch of mathematics concerning vector spaces and linear mappings. It provides the essential language and operations required to manipulate high-dimensional data in modern computing, graphics, and artificial intelligence.",
    corePrinciples: [
      { title: "Vector Spaces and Basis", description: "Collections of vectors that can be scaled and added, defined by spanning dimensions." },
      { title: "Linear Transformations", description: "Functions mapping vectors to vectors while preserving addition and scalar multiplication." },
      { title: "Matrix Representation", description: "Organizing coefficients into grid systems to represent multi-variable transformations." }
    ],
    deepDive: "In ML, data points are modeled as vectors, and datasets as matrices. The fundamental system Ax = b represents simultaneous linear equations. Properties like matrix rank, dot products, and orthogonal bases dictate the solvability and efficiency of dimensional reduction algorithms.",
    applications: [
      { name: "Computer Graphics", description: "Performs 3D rotations, scaling, and camera translations using homogeneous coordinate matrices." },
      { name: "Principal Component Analysis", description: "Reduces data dimensionality by projecting covariance structures onto principal vectors." }
    ],
    recommendations: [
      { type: "Video", title: "Essence of Linear Algebra (3Blue1Brown)", link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", description: "The most brilliant visual intuition of matrices, linear transformations, and determinants." },
      { type: "Book", title: "Introduction to Linear Algebra (Gilbert Strang)", link: "https://math.mit.edu/~gs/linearalgebra/", description: "The global classic textbook used by MIT and top universities worldwide." }
    ]
  },
  "matrix-inversion": {
    title: "Matrix Inversion",
    introduction: "Matrix inversion is the mathematical operation of finding the multiplicative inverse of a square matrix. It is essential in algebra and systems theory for solving multi-variable linear networks and computing numerical bounds.",
    corePrinciples: [
      { title: "Identity Relation", description: "An inverted matrix A^-1 multiplied by A yields the identity matrix I: A * A^-1 = I." },
      { title: "Determinant Checks", description: "A matrix is invertible if and only if its determinant is non-zero. Otherwise, it is singular." },
      { title: "Computational Complexity", description: "Standard matrix inversion scales at O(N^3), motivating alternative decomposition techniques." }
    ],
    deepDive: "Solving Ax = b as x = A^-1 * b is theoretically simple but computationally expensive and numerically unstable for large matrices. Algorithms like Gaussian Elimination or LU Decomposition are generally preferred. In high dimensions, singular value decomposition (SVD) calculates the pseudo-inverse (Moore-Penrose) for non-square or rank-deficient systems, providing robust numerical optimization.",
    applications: [
      { name: "Least-Squares Regression", description: "Calculates closed-form parameter solutions using the normal equation: (X^T * X)^-1 * X^T * y." },
      { name: "Graphics Transformation", description: "Reverses transformations to calculate mouse-click vectors in 3D canvas viewports." }
    ],
    recommendations: [
      { type: "Video", title: "Inverse matrices, column space and null space (3Blue1Brown)", link: "https://www.youtube.com/watch?v=uQhTuRlWMxo", description: "Splendid spatial visualization of what 'inverting' a space geometrically represents." },
      { type: "Book", title: "Linear Algebra and Its Applications (David C. Lay)", link: "https://www.pearson.com/en-us/subject-catalog/p/linear-algebra-and-its-applications/P200000003507", description: "Clear, practical textbook covering matrix equations and eigenvalue applications." }
    ]
  },
  "eigenvalues-eigenvectors": {
    title: "Eigenvalues & Eigenvectors",
    introduction: "Eigenvectors are special vectors that only change in scale (not direction) when a linear transformation is applied. Eigenvalues are the scalar factors by which these vectors are stretched or squished.",
    corePrinciples: [
      { title: "Characteristic Equation", description: "Solved via det(A - lambda * I) = 0, where lambda represents eigenvalues." },
      { title: "Geometric Invariance", description: "The transformation maps the vector onto its own span, keeping its linear direction constant." },
      { title: "Diagonalization", description: "Decomposing a matrix into its eigenvectors simplifies complex multi-step matrix operations." }
    ],
    deepDive: "For a square matrix A, an eigenvector v and eigenvalue lambda satisfy Av = lambda * v. Eigen-decomposition allows us to understand matrices as transformations along primary axes. This underpins Spectral Analysis, Markov Chains, and Dimensionality Reduction.",
    applications: [
      { name: "Google PageRank", description: "Determines webpage authority by finding the dominant eigenvector of the web link matrix." },
      { name: "Face Recognition (Eigenfaces)", description: "Reduces facial image vector sizes to identify core biometric vectors." }
    ],
    recommendations: [
      { type: "Video", title: "Eigenvalues and eigenvectors (3Blue1Brown)", link: "https://www.youtube.com/watch?v=PFDu9oVAE-g", description: "Masterclass visual introduction showing rotation-free scaling axes." },
      { type: "Course", title: "Linear Algebra on MIT OpenCourseWare", link: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", description: "Professor Strang's famous lecture sequence on eigenvalues." }
    ]
  },
  "tensor-operations": {
    title: "Tensor Operations",
    introduction: "Tensors are multi-dimensional arrays that generalize scalars, vectors, and matrices to higher dimensions. Tensor operations form the mathematical foundation of deep learning architectures, executing high-throughput operations on modern GPUs.",
    corePrinciples: [
      { title: "Rank and Dimension", description: "Tensors scale from rank-0 (scalar), rank-1 (vector), rank-2 (matrix), to rank-N arrays." },
      { title: "Matrix Dot Products", description: "Generalized multiplication (tensor contraction) to transform spatial dimensions." },
      { title: "Reshaping and Slicing", description: "Reorganizing memory layouts of dimensions to feed downstream neural network layers." }
    ],
    deepDive: "In framework engines like PyTorch or TensorFlow, tensor math leverages parallel operations. Broadcasting automatically expands smaller tensors to match larger tensor shapes during element-wise math. Operations like transposition, concatenation, and Einstein Summation (einsum) enable rapid, efficient implementation of multi-head self-attention gates.",
    applications: [
      { name: "Transformer Attention Blocks", description: "Executes batch matrix multiplications over Query, Key, and Value tensors." },
      { name: "Image Color Batching", description: "Represents sets of color images as Rank-4 tensors: [Batch, Channels, Height, Width]." }
    ],
    recommendations: [
      { type: "Article", title: "A Visual Guide to Tensor Operations", link: "https://medium.com/@quantum_data/visual-guide-to-tensor-operations-e7b8f9e612f0", description: "Highly graphic explanations of tensor stretching, slicing, and broadcasting." },
      { type: "Course", title: "PyTorch Basics (DeepLearning.AI)", link: "https://www.deeplearning.ai/", description: "Excellent training on using GPU-accelerated tensor structures." }
    ]
  },
  "big-o-notation": {
    title: "Big-O Notation",
    introduction: "Big-O Notation is a mathematical notation used in computer science to describe the limiting behavior and asymptotic complexity of an algorithm. It characterizes execution time or space requirements as input size scales towards infinity.",
    corePrinciples: [
      { title: "Asymptotic Analysis", description: "Focuses on the dominant growth term of a function as input size (N) becomes extremely large, ignoring minor additions." },
      { title: "Time Complexity Classes", description: "Categorizes speeds from constant O(1), logarithmic O(log N), linear O(N), to quadratic O(N²)." },
      { title: "Space Complexity", description: "Analyzes the peak memory overhead created by dynamic data structures during execution." }
    ],
    deepDive: "Mathematically, f(N) = O(g(N)) if there exist positive constants c and N0 such that |f(N)| <= c * |g(N)| for all N >= N0. This establishes a strict upper bound. We analyze worst-case scenarios to guarantee that algorithms execute within hardware constraints during peak loads.",
    applications: [
      { name: "Database Indexing", description: "B-Trees reduce row search times from linear scans O(N) to rapid logarithmic search O(log N)." },
      { name: "Software Scalability Planning", description: "Estimates cloud computational budgets by simulating user growth complexities." }
    ],
    recommendations: [
      { type: "Video", title: "Introduction to Big O Notation (CS Dojo)", link: "https://www.youtube.com/watch?v=V6mKVRU1evU", description: "Highly accessible, clean introduction suitable for absolute beginners." },
      { type: "Book", title: "Cracking the Coding Interview (Gayle Laakmann McDowell)", link: "https://www.crackingthecodinginterview.com/", description: "Features an excellent, practice-oriented review chapter on Big-O computational math." }
    ]
  },
  "divide-and-conquer": {
    title: "Divide and Conquer",
    introduction: "Divide and Conquer is an algorithmic paradigm that solves a complex problem by recursively breaking it down into two or more sub-problems of the same type, solving them directly, and combining the results.",
    corePrinciples: [
      { title: "Division Step", description: "Splitting the target problem array into smaller sub-segments recursively until a base threshold is achieved." },
      { title: "Conquer Step", description: "Solving baseline small sub-problems directly (often trivial single-element arrays)." },
      { title: "Combine Step", description: "Merging the independent sub-solutions together to resolve the primary system." }
    ],
    deepDive: "Master Theorem evaluates divide-and-conquer recurrences: T(N) = a * T(N/b) + f(N). For instance, Merge Sort splits arrays into two (a=2, b=2) and performs linear merging (O(N)), resulting in an optimal runtime of O(N log N). This paradigm exposes massive potential for multi-threaded parallel execution.",
    applications: [
      { name: "Merge and Quick Sorts", description: "Sorts messy sequences rapidly by partitioning lists and sorting recursively." },
      { name: "Strassen's Matrix Multiplication", description: "Reduces matrix multiplication runtime bounds below O(N^3) using sub-matrix division." }
    ],
    recommendations: [
      { type: "Video", title: "Divide and Conquer Algorithms (Abdul Bari)", link: "https://www.youtube.com/watch?v=27tIPSSUvG0", description: "The legendary Abdul Bari's comprehensive step-by-step breakdown of Master Theorem." },
      { type: "Book", title: "Introduction to Algorithms (CLRS)", link: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/", description: "The definitive reference covering divide-and-conquer proofs in detail." }
    ]
  },
  "quick-sort-vs-merge-sort": {
    title: "Quick Sort vs Merge Sort",
    introduction: "Quick Sort and Merge Sort are two of the most popular and efficient O(N log N) sorting algorithms on the planet, each representing distinct structural approaches, stability constraints, and hardware memory tradeoffs.",
    corePrinciples: [
      { title: "Pivot vs Half-Splitting", description: "Quick Sort segments lists around a pivot; Merge Sort strictly halves arrays down the exact center." },
      { title: "Auxiliary Space Complexity", description: "Merge Sort requires O(N) auxiliary space; Quick Sort is executed in-place requiring only O(log N) stack memory." },
      { title: "Algorithmic Stability", description: "Merge Sort is stable (retains identical element order); Quick Sort is unstable." }
    ],
    deepDive: "Quick Sort relies on efficient CPU cache operations due to in-place swapping, making it faster in practice for random arrays. However, it can degrade to quadratic complexity O(N^2) if pivots partition poorly. Merge Sort guarantees O(N log N) regardless of the array's initial state but incurs substantial allocation overhead, making it highly suitable for external storage or linked lists.",
    applications: [
      { name: "Standard Library Arrays", description: "V8 (JavaScript) and Java employ hybrid Quick Sort/Timsort designs to maximize hardware cache hits." },
      { name: "External Memory Sorting", description: "Utilizes Merge Sort's sequential flow to sort multi-gigabyte datasets too large for RAM." }
    ],
    recommendations: [
      { type: "Video", title: "Quick Sort vs Merge Sort Visualized", link: "https://www.youtube.com/watch?v=es2T6KY19i0", description: "Direct audio-visual comparison showing operations side by side." },
      { type: "Article", title: "GeeksforGeeks: Difference between Merge Sort and Quick Sort", link: "https://www.geeksforgeeks.org/difference-between-merge-sort-and-quick-sort/", description: "Excellent comparison chart analyzing time, space, and stability tradeoffs." }
    ]
  },
  "binary-search": {
    title: "Binary Search",
    introduction: "Binary Search is a highly efficient algorithm for finding an item from a sorted list of items. It works by repeatedly halving the search space that could contain the item, reducing check complexity to logarithmic scale.",
    corePrinciples: [
      { title: "Preconditioned Sorting", description: "Binary Search strictly requires that the target collection be pre-sorted in ascending or descending order." },
      { title: "Half-Interval Reductions", description: "Comparing the search key with the middle element; immediately discarding the irrelevant half." },
      { title: "Logarithmic Scaling", description: "Runtime scales at O(log N). Searching a list of 1 million items requires at most 20 comparison checks." }
    ],
    deepDive: "At each step, we calculate the midpoint: mid = low + Math.floor((high - low) / 2) to prevent potential integer overflow bugs. If key equals mid, we terminate; if key < mid, high becomes mid-1; if key > mid, low becomes mid+1. This logic underpins advanced systems like database indices, network routing tables, and optimization boundary solvers.",
    applications: [
      { name: "SQL Index Seeks", description: "Locates database primary keys instantly using index tree navigation." },
      { name: "Root Finding Algorithms", description: "Uses bisection search concepts to calculate exact roots of complex mathematical functions." }
    ],
    recommendations: [
      { type: "Video", title: "Binary Search Algorithm (CS50)", link: "https://www.youtube.com/watch?v=T98PIp4tUA4", description: "Harvard's CS50 classic visual explanation featuring phone book tearing." },
      { type: "Book", title: "Grokking Algorithms (Aditya Bhargava)", link: "https://www.manning.com/books/grokking-algorithms", description: "Extremely visual and intuitive guide explaining binary search and array indexes." }
    ]
  },
  "quantum-entanglement": {
    title: "Quantum Entanglement",
    introduction: "Quantum Entanglement is a physical phenomenon where pairs or groups of particles generate or interact in ways such that the quantum state of each particle cannot be described independently of the state of the others, regardless of distance.",
    corePrinciples: [
      { title: "Non-Separable States", description: "The combined state vector cannot be factored into product states of individual particles." },
      { title: "Spooky Action at a Distance", description: "Measuring particle A instantly dictates the state of particle B, even if light years apart." },
      { title: "Bell States", description: "The four maximally entangled two-qubit states, forming the baseline of quantum communication." }
    ],
    deepDive: "A Bell State is represented as (|00⟩ + |11⟩)/sqrt(2). If we measure qubit A and observe 0, the state vector collapses to |00⟩, guaranteeing that qubit B will also measure as 0 with 100% certainty. This correlation violates Bell's Inequality, proving that quantum mechanics possesses non-local properties that cannot be explained by classical hidden variables.",
    applications: [
      { name: "Quantum Cryptography", description: "Uses entangled pairs in Ekert91 (E91) protocol to ensure absolute eavesdropper detection." },
      { name: "Quantum Teleportation", description: "Transfers unknown quantum states over arbitrary distances using pre-entangled channels." }
    ],
    recommendations: [
      { type: "Video", title: "Quantum Entanglement Visualized (Veritasium)", link: "https://www.youtube.com/watch?v=ZuvK-ldF40M", description: "Unparalleled conceptual review of Bell's Theorem and particle correlations." },
      { type: "Book", title: "Quantum Computation and Quantum Information (Nielsen & Chuang)", link: "https://www.cambridge.org/highereducation/books/quantum-computation-and-quantum-information/01E1010C9D69302C2C4E9C16A2F2197A", description: "The absolute Bible textbook of quantum computation science." }
    ]
  },
  "quantum-gates": {
    title: "Quantum Gates",
    introduction: "Quantum gates are the basic building blocks of quantum circuits, analogous to classical logic logic gates. They are represented mathematically as unitary matrices that manipulate the state vectors of qubits, preserving probability norms.",
    corePrinciples: [
      { title: "Unitary Matrix Operations", description: "All quantum gates must be reversible and satisfy U^dagger * U = I, ensuring probability conservation." },
      { title: "Single Qubit Gates", description: "Includes Pauli-X (NOT), Pauli-Z (phase flip), and Hadamard (superposition creator)." },
      { title: "Multi-Qubit Operations", description: "Includes CNOT and Toffoli gates, enabling conditional state transformations and entanglement." }
    ],
    deepDive: "Because gates are unitary matrices, applying a gate is equivalent to multiplying a vector. For example, the Pauli-X gate is [[0, 1], [1, 0]], which maps |0⟩ to |1⟩. Since operations are mathematically reversible, quantum computing does not inherently lose heat through landauer limits, opening massive thermodynamic efficiencies.",
    applications: [
      { name: "Algorithmic Circuit Design", description: "Cascades gates together to construct complex algorithms like Shor's or Grover's." },
      { name: "Quantum Error Correction", description: "Uses logic gate sequences to detect and reverse environmental phase decoherence." }
    ],
    recommendations: [
      { type: "Video", title: "Quantum Gates & Circuit Math (Qiskit)", link: "https://www.youtube.com/watch?v=tBnWG_95Fm0", description: "IBM's official, premium training series on compiling quantum gate equations." },
      { type: "Course", title: "IBM Quantum Learning Platform", link: "https://learning.quantum.ibm.com/", description: "Excellent interactive sandbox environments to build circuits using standard gates." }
    ]
  },
  "shors-algorithm": {
    title: "Shor's Algorithm",
    introduction: "Shor's Algorithm is a famous quantum algorithm capable of finding the prime factors of an integer in polynomial time. It represents a massive threat to global security as it can break RSA encryption.",
    corePrinciples: [
      { title: "Integer Factorization", description: "Finding the prime factors of a composite number N. Classical computers require exponential time; Shor's uses polynomial time." },
      { title: "Period Finding", description: "The core mathematical trick, mapping factoring to finding the period of a modular exponentiation function." },
      { title: "Quantum Fourier Transform", description: "The quantum gate sequence used to extract the modular function's period from superposition states." }
    ],
    deepDive: "Shor's algorithm breaks down the factoring problem into a classical reduction step and a quantum period-finding step. Classical algebra shows that if we can find the period 'r' of the function f(x) = a^x mod N, we can calculate the greatest common divisors gcd(a^(r/2) ± 1, N) to find prime factors. Classical computers require O(exp(N^(1/3))) steps using the General Number Field Sieve, while Shor's executes in O((log N)^3) steps on a quantum machine.",
    applications: [
      { name: "Post-Quantum Cryptography", description: "Motivates global migration to lattice-based cryptography resistant to quantum attacks." },
      { name: "Academic Research", description: "Demonstrates the ultimate theoretical supremacy of quantum acceleration." }
    ],
    recommendations: [
      { type: "Video", title: "Shor's Algorithm explained visually (MinutePhysics)", link: "https://www.youtube.com/watch?v=lvTqbM5Dq4Q", description: "Wonderfully clear visual analogy of period finding using clocks." },
      { type: "Article", title: "Shor's Algorithm on Qiskit Textbook", link: "https://learn.qiskit.org/course/ch-algorithms/shors-algorithm", description: "Step-by-step mathematical derivation and Qiskit code to factor small composites." }
    ]
  },
  "proof-of-work": {
    title: "Proof of Work",
    introduction: "Proof of Work (PoW) is a consensus algorithm that secures blockchain networks by requiring participants (miners) to expend computational power to solve difficult cryptographic puzzles before writing new blocks.",
    corePrinciples: [
      { title: "Mathematical Puzzle", description: "Finding a Nonce such that the resulting block hash begins with a specific number of zeros." },
      { title: "Network Difficulty Tuning", description: "Dynamic adjustment of target difficulty thresholds to keep block creation rates constant." },
      { title: "Simple Verification", description: "Solving the puzzle is extremely expensive, but verifying the solution requires only a single hash calculation." }
    ],
    deepDive: "Miners repeatedly compute SHA-256(BlockHeader + Nonce). The resulting 256-bit unsigned integer must be strictly less than the target set by the network difficulty. This computational expense creates a physical anchor: rewriting history requires controlling 51% of the entire network's hashing power, making the blockchain immutable and tamper-resistant.",
    applications: [
      { name: "Decentralized Currencies", description: "Secures networks like Bitcoin and early Ethereum against double-spend attacks." },
      { name: "Sybil Protection", description: "Prevents spam by requiring small computational tokens before executing system operations." }
    ],
    recommendations: [
      { type: "Video", title: "Proof of Work vs Proof of Stake", link: "https://www.youtube.com/watch?v=M3EFi_Sgwd8", description: "Excellent comparison explaining resource consumption and security mechanics." },
      { type: "Book", title: "Mastering Bitcoin (Andreas Antonopoulos)", link: "https://github.com/bitcoinbook/bitcoinbook", description: "The definitive guide explaining mining pools, targets, and consensus math." }
    ]
  },
  "smart-contracts": {
    title: "Smart Contracts",
    introduction: "A Smart Contract is a self-executing digital agreement with the terms directly written into lines of code. They run autonomously on decentralized networks like Ethereum, removing the need for a trusted third-party intermediary.",
    corePrinciples: [
      { title: "Autonomous Execution", description: "Code triggers automatically once pre-defined criteria (e.g. escrow deposits) are satisfied." },
      { title: "Immutability", description: "Contracts are compiled and written permanently to the ledger; they cannot be altered or bypassed." },
      { title: "Turing Completeness", description: "Capable of executing loops, complex logic, and governing states natively on-chain." }
    ],
    deepDive: "Smart contracts compile to bytecode and execute inside virtual machines (like the Ethereum Virtual Machine - EVM). Transactions are state transitions in a globally shared ledger. High security is critical, as logic vulnerabilities (like re-entrancy bugs or integer overflows) cannot be patched once deployed, often resulting in permanent loss of funds.",
    applications: [
      { name: "Decentralized Finance (DeFi)", description: "Constructs autonomous escrow protocols, lending pools, and derivative vaults." },
      { name: "Digital Identifications (NFTs)", description: "Manages fractional assets, property title tokens, and immutable licensing terms." }
    ],
    recommendations: [
      { type: "Course", title: "Solidity, Blockchain, and Smart Contracts (Patrick Collins)", link: "https://www.youtube.com/watch?v=umepbpgt4V8", description: "The gold-standard interactive video boot camp for Smart Contract programming." },
      { type: "Article", title: "Ethereum Developer Documentation on Smart Contracts", link: "https://ethereum.org/en/developers/docs/smart-contracts/", description: "Excellent theoretical and code-level references for beginning developers." }
    ]
  },
  "consensus-algorithms": {
    title: "Consensus Algorithms",
    introduction: "Consensus algorithms are protocols that allow distributed systems of computers to agree on a single data value or network state, ensuring consistency and fault tolerance even in the presence of malicious or failing nodes.",
    corePrinciples: [
      { title: "Byzantine Generals Problem", description: "The fundamental theoretical challenge of reaching coordination across unreliable networks." },
      { title: "Crash Fault Tolerance", description: "Protocols like Raft or Paxos that sustain network state even if nodes suddenly crash." },
      { title: "Byzantine Fault Tolerance", description: "Protocols like PoW, PoS, or PBFT that protect against deliberate, coordinated hacking." }
    ],
    deepDive: "Raft structures consensus around an active leader node that replicates transaction logs to followers, handling node crashes gracefully. Blockchain systems face a harsher environment and rely on economic consensus: PoW uses physical electricity expenses, while Proof of Stake (PoS) uses collateral staking, applying automatic slashing penalties to penalize double-signing or dishonest validators.",
    applications: [
      { name: "Decentralized Ledgers", description: "Uses staking or mining pools to agree on chronological transaction ordering." },
      { name: "Distributed Cloud Databases", description: "Uses Raft or Paxos inside systems like etcd and Kubernetes to maintain state." }
    ],
    recommendations: [
      { type: "Video", title: "The Byzantine Generals Problem Explained", link: "https://www.youtube.com/watch?v=dfsWQyGkElc", description: "Extremely clear conceptual animation explaining distributed Byzantine coordination." },
      { type: "Article", title: "The Raft Consensus Algorithm Interactive Visualizer", link: "https://raft.github.io/", description: "Outstanding interactive visualizer where you can crash nodes and watch leader election." }
    ]
  },
  "backpropagation": {
    title: "Backpropagation",
    introduction: "Backpropagation is the algorithmic core of neural network training. It calculates the gradient of the loss function with respect to every weight in the network, leveraging the mathematical Chain Rule to propagate errors backward.",
    corePrinciples: [
      { title: "The Forward Pass", description: "Propagates input data forward through the layers to generate prediction outputs and measure error." },
      { title: "The Chain Rule", description: "Calculates complex partial derivatives by multiplying gradients sequentially layer by layer." },
      { title: "The Backward Pass", description: "Flows gradients backward from the output layer to update weights and biases." }
    ],
    deepDive: "Mathematically, the error at the output layer is dL/da. To find how the loss changes with respect to a weight w_ij in a hidden layer, we apply the Chain Rule: dL/dw_ij = (dL/da) * (da/dz) * (dz/dw_ij). These gradients are collected across batches and subtracted via gradient descent, iteratively tuning the network to model complex patterns.",
    applications: [
      { name: "Gradient Calculation", description: "The foundational mathematical solver implemented inside PyTorch's autograd engine." },
      { name: "Deep Network Training", description: "Enables optimization of highly complex convolutional and transformer networks." }
    ],
    recommendations: [
      { type: "Video", title: "What is backpropagation really doing? (3Blue1Brown)", link: "https://www.youtube.com/watch?v=Ilg3gGewQ5U", description: "Sensational calculus visualizer showing gradient vectors flowing backwards." },
      { type: "Course", title: "Neural Networks: Zero to Hero (Andrej Karpathy)", link: "https://karpathy.ai/zero-to-hero.html", description: "The greatest coding-first guide, implementing backpropagation and autograd from absolute scratch." }
    ]
  },
  "activation-functions": {
    title: "Activation Functions",
    introduction: "Activation functions are mathematical formulas applied to a neuron's net input, determining whether it should fire and introducing non-linearity to let the network model complex patterns.",
    corePrinciples: [
      { title: "Sigmoid and Tanh", description: "Classic S-shaped curves mapping outputs between [0,1] or [-1,1]. Highly prone to gradient vanishing." },
      { title: "ReLU (Rectified Linear Unit)", description: "Returns max(0, x). Solves vanishing gradients, yielding sparse firing for faster convergence." },
      { title: "Softmax", description: "Normalizes an output vector into a probability distribution that sums to exactly 1." }
    ],
    deepDive: "Without non-linear activations, composing multiple layers would simplify to a single linear transformation: W_out * (W_2 * (W_1 * x)) = W_eff * x. ReLU is highly computationally efficient but can suffer from the 'Dying ReLU' problem if large gradients lock neurons in a permanent zero state. Variations like Leaky ReLU address this by allowing a tiny slope for negative inputs: f(x) = max(0.01x, x).",
    applications: [
      { name: "Multi-Class Classifiers", description: "Uses Softmax in the final output layer to generate distinct class probabilities." },
      { name: "Deep Neural Networks", description: "Uses ReLU or GELU in hidden layers to avoid gradient saturation during training." }
    ],
    recommendations: [
      { type: "Article", title: "Activation Functions in Deep Learning (V7 Labs)", link: "https://www.v7labs.com/blog/neural-networks-activation-functions", description: "Comprehensive comparison guide analyzing formulas, graphs, and performance tradeoffs." },
      { type: "Video", title: "Activation Functions Explained Visually", link: "https://www.youtube.com/watch?v=m0pIlLfpXsk", description: "Short, crisp animation explaining how activations transform data spaces." }
    ]
  },
  "optimization-algorithms": {
    title: "Optimization Algorithms",
    introduction: "Optimization algorithms are mathematical solvers that update neural network parameters (weights and biases) to minimize loss, using advanced adaptive heuristics to accelerate convergence.",
    corePrinciples: [
      { title: "Momentum", description: "Accelerates gradient descent by accumulating velocity in consistent directions, dampening oscillations." },
      { title: "RMSProp", description: "Adapts learning rates individually by dividing parameters by a running average of recent gradient magnitudes." },
      { title: "Adam (Adaptive Moment Estimation)", description: "Combines Momentum and RMSProp, maintaining first and second moment statistics." }
    ],
    deepDive: "Adam calculates exponentially decaying averages of past gradients (m_t) and squared gradients (v_t), updating weights via: theta_t = theta_(t-1) - (alpha * m_hat_t) / (sqrt(v_hat_t) + epsilon). This adaptive scaling accelerates convergence over saddle points and noisy gradients, making it the industry-standard choice for training modern architectures.",
    applications: [
      { name: "Language Model Fine-Tuning", description: "Utilizes AdamW (Adam with decoupled weight decay) to train large-scale transformer weights." },
      { name: "High-Dimensional Optimization", description: "Speeds up training in complex loss landscapes filled with noisy local minima." }
    ],
    recommendations: [
      { type: "Article", title: "An overview of gradient descent optimization algorithms", link: "https://ruder.io/optimizing-gradient-descent/", description: "Sebastian Ruder's legendary post detailing SGD, Adagrad, RMSProp, and Adam equations." },
      { type: "Video", title: "Adam Optimization Algorithm Explained (DeepLearning.AI)", link: "https://www.youtube.com/watch?v=JXQT_vxqwIs", description: "Andrew Ng's clear, equations-first explanation of Adam moment variables." }
    ]
  }
};

// Complete generic generator for any of the 24 topics to guarantee rich content availability
const getTopicData = (slug) => {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (fallbackTopics[normalized]) {
     return fallbackTopics[normalized];
  }
  
  // Format slug to user friendly title
  const words = normalized.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1));
  const title = words.join(' ');
  
  return {
    title,
    introduction: `${title} represents a vital pillar of this computational framework. Exploring this topic reveals essential underlying concepts, architectures, and theoretical foundations that are highly utilized across modern industry and engineering applications.`,
    corePrinciples: [
      { title: "Conceptual Foundations", description: `Fundamental mechanisms governing ${title} dictate how parameters, variables, and systems interact to solve specific problems.` },
      { title: "Optimization & Boundaries", description: `Maximizing accuracy and performance requires setting strict boundaries, evaluating limiting behaviors, and selecting optimal hyperparameters.` },
      { title: "Scalability and Integration", description: `Deploying ${title} in real-world scenarios requires managing time, space, and hardware constraints efficiently.` }
    ],
    deepDive: `A rigorous technical review of ${title} reveals complex internal mechanics. In practical implementations, developers and researchers map input variables into high-dimensional constraint structures to perform transformations. Depending on the scale and performance bounds, optimizations are applied to minimize latency, preserve memory boundaries, or solve structural bottlenecks. Detailed mathematical and algorithmic configurations govern state updates, ensuring consistency and preventing issues like data leakage, overfitting, or divergent bounds.`,
    applications: [
      { name: "Advanced System Engineering", description: `Integrates ${title} to improve performance, enhance security, or scale parallel capabilities.` },
      { name: "Data Processing Pipelines", description: `Applies this conceptual model to optimize features, execute transformations, and map clean outputs.` }
    ],
    recommendations: [
      { type: "Docs", title: `${title} Standard Reference Documentation`, link: "https://en.wikipedia.org/wiki/" + title.replace(/\s+/g, '_'), description: "Comprehensive encyclopedia guide covering the mathematical proofs and historical history of this field." },
      { type: "Course", title: "Advanced Topics in Computer Science & Mathematics", link: "https://ocw.mit.edu/", description: "Top-tier university lectures covering computational implementations and mathematical frameworks." }
    ]
  };
};

// GET /api/progress/topic-info/:topicName
router.get('/topic-info/:topicName', auth, async (req, res) => {
   try {
       const topicSlug = req.params.topicName;
       
       // 1. Try to fetch from DB cache
       let cachedTopic = await TopicCache.findOne({ topicName: topicSlug });
       if (cachedTopic) {
          return res.json(cachedTopic);
       }
       
       // 2. Fetch using OpenAI if configured
       let topicData = null;
       if (openai) {
          try {
             const prompt = `You are a world-class computer science and machine learning expert.
Generate an extremely comprehensive, mathematically rigorous, and highly detailed guide about the topic: "${topicSlug.replace(/-/g, ' ')}".
Make sure the explanations are extremely deep, advanced, and educational. Do not write short summaries.

Return the response ONLY as a JSON object matching this exact schema:
{
  "title": "Clean, human-readable Title of the Topic",
  "introduction": "A highly detailed, 1-2 paragraph thorough overview introducing the topic, its significance, and core challenges.",
  "corePrinciples": [
    { "title": "Name of Principle 1", "description": "Highly comprehensive and detailed explanation of how this principle operates." },
    { "title": "Name of Principle 2", "description": "Highly comprehensive and detailed explanation of how this principle operates." },
    { "title": "Name of Principle 3", "description": "Highly comprehensive and detailed explanation of how this principle operates." }
  ],
  "deepDive": "An extremely comprehensive, mathematically rigorous deep dive. Explain the internal workings, mathematical equations, derivatives, algorithms, and complexity bounds in massive detail (at least 3-4 paragraphs worth of text). Use plain text or LaTeX-like formatting for mathematical equations.",
  "applications": [
    { "name": "Application Area 1", "description": "Thorough detail on how the topic is utilized in this industry area." },
    { "name": "Application Area 2", "description": "Thorough detail on how the topic is utilized in this industry area." }
  ],
  "recommendations": [
    { "type": "Book | Video | Course | Article", "title": "Specific resource title name", "link": "https://...", "description": "Detailed reasoning explaining exactly why the student should read, watch, or take this resource to master the topic." },
    { "type": "Book | Video | Course | Article", "title": "Specific resource title name", "link": "https://...", "description": "Detailed reasoning explaining exactly why the student should read, watch, or take this resource to master the topic." }
  ]
}`;

             const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                   { role: "system", content: "You are an expert educational AI who only outputs valid, structured JSON." },
                   { role: "user", content: prompt }
                ],
                temperature: 0.6,
                response_format: { type: "json_object" }
             });
             
             topicData = JSON.parse(response.choices[0].message.content);
          } catch (openaiErr) {
             console.error("OpenAI failed to compile topic, using high-fidelity local fallback:", openaiErr);
          }
       }
       
       // 3. Fallback if OpenAI failed or was disabled
       if (!topicData) {
          topicData = getTopicData(topicSlug);
       }
       
       // 4. Save to cache
       cachedTopic = new TopicCache({
          topicName: topicSlug,
          title: topicData.title,
          introduction: topicData.introduction,
          corePrinciples: topicData.corePrinciples,
          deepDive: topicData.deepDive,
          applications: topicData.applications,
          recommendations: topicData.recommendations
       });
       await cachedTopic.save();
       
       return res.json(cachedTopic);
   } catch (err) {
       console.error("Error in topic-info fetch:", err);
       res.status(500).json({ error: "Failed to load topic information: " + err.message });
   }
});

// POST /api/progress/topic/cover
router.post('/topic/cover', auth, async (req, res) => {
   try {
       const { topicName, action } = req.body; // action: 'cover' or 'uncover'
       const progress = await getProgressDoc(req.user.id);
       
       if (!progress.coveredTopics) {
          progress.coveredTopics = [];
       }
       
       const normalized = topicName.toLowerCase().trim();
       const index = progress.coveredTopics.indexOf(normalized);
       
       if (action === 'uncover') {
          if (index > -1) {
             progress.coveredTopics.splice(index, 1);
          }
       } else {
          if (index === -1) {
             progress.coveredTopics.push(normalized);
          }
       }
              await progress.save();
        res.json({ success: true, coveredTopics: progress.coveredTopics });
    } catch (err) {
        console.error("Error covering topic:", err);
        res.status(500).json({ error: "Failed to update topic cover status." });
    }
});


// ============================================================================
// --- INTERACTIVE AI DIAGNOSTIC EVALUATION SYSTEM & COPILOT ENDPOINTS ---
// ============================================================================

const fallbackDiagnosticPool = {
  "Machine Learning Principles": [
    { question: "Explain the difference between L1 (Lasso) and L2 (Ridge) regularization. When would you prefer one over the other?" },
    { question: "What is the purpose of a learning rate in gradient descent, and what happens if it is set too high or too low?" },
    { question: "Explain the concept of overfitting and how validation datasets help detect it." }
  ],
  "Data Structures & Algorithms": [
    { question: "Why is the worst-case time complexity of Quick Sort O(N^2), and how does choosing a random pivot help avoid this?" },
    { question: "Explain the difference in space complexity between Merge Sort and Quick Sort. Why does Merge Sort require auxiliary memory?" },
    { question: "What is the advantage of Binary Search over Linear Search, and what precondition must be met before performing a binary search?" }
  ],
  "Blockchain & Security Protocols": [
    { question: "What are the core properties of a cryptographic hash function, and why are they considered one-way?" },
    { question: "Explain the concept of Proof of Work. What computational puzzle do miners solve to add a block to the ledger?" },
    { question: "What is a smart contract, and how does it execute without a central authority?" }
  ],
  "Quantum Gates & Linear Algebra": [
    { question: "What is quantum superposition, and how does it differ from a classical bit's state?" },
    { question: "Explain quantum entanglement. What happens to the state of one entangled qubit when its partner is measured?" },
    { question: "What is a quantum gate, and how does it manipulate a qubit's probability amplitude?" }
  ]
};

// POST /api/progress/diagnostic-start
router.post('/diagnostic-start', auth, async (req, res) => {
   try {
       const progress = await getProgressDoc(req.user.id);
       
       // Calculate weakest dimension based on current scores
       const qAccs = progress.quizzes.map(q => q.accuracy);
       const avgQuizAccuracy = qAccs.length ? (qAccs.reduce((a,b)=>a+b,0) / qAccs.length) : 0;
       const labCompletions = progress.labs.filter(l => l.completed).length;
       const availableLabs = await Lab.find({});
       const labTitles = availableLabs.map(l => l.title);
       const advancedLabCompletionRate = labCompletions / (labTitles.length || 1);
       
       const consistencyScore = qAccs.length > 1 
          ? 1 - (Math.max(...qAccs) - Math.min(...qAccs)) / 100 
          : 0.5;

       const dimensions = [
          { name: "Machine Learning Principles", score: avgQuizAccuracy || 50 },
          { name: "Data Structures & Algorithms", score: Math.round(Math.min(100, (advancedLabCompletionRate * 100) + 20)) },
          { name: "Blockchain & Security Protocols", score: Math.round(consistencyScore * 100) },
          { name: "Quantum Gates & Linear Algebra", score: 75 }
       ];

       // Sort dimensions to find the weakest (lowest score)
       dimensions.sort((a, b) => a.score - b.score);
       const weakestTopic = dimensions[0].name;

       if (openai) {
          try {
             const prompt = `You are an AI Learning Mentor. You need to generate exactly 3 deep, advanced, conceptual quiz questions to evaluate the student's mastery in the topic "${weakestTopic}".
Each question should be highly technical but conceptual, demanding a short typed explanation from the student.

Return the response ONLY as a JSON object matching this exact schema:
{
  "topic": "${weakestTopic}",
  "questions": [
    { "question": "Question text here..." },
    { "question": "Question text here..." },
    { "question": "Question text here..." }
  ]
}`;
             const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                   { role: "system", content: "You are an expert AI interviewer who only outputs valid, structured JSON." },
                   { role: "user", content: prompt }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
             });
             
             const parsed = JSON.parse(response.choices[0].message.content);
             return res.json(parsed);
          } catch (openaiErr) {
             console.warn("OpenAI failed to generate diagnostic questions, falling back:", openaiErr);
          }
       }

       // Local fallback selection
       const questions = fallbackDiagnosticPool[weakestTopic] || fallbackDiagnosticPool["Machine Learning Principles"];
       return res.json({
          topic: weakestTopic,
          questions
       });
   } catch (err) {
       console.error("Error in diagnostic-start:", err);
       res.status(500).json({ error: "Failed to initiate diagnostic evaluation: " + err.message });
   }
});

// Helper for local grading keywords
const fallbackKeywords = {
  "L1 (Lasso) and L2 (Ridge)": ["lasso", "ridge", "l1", "l2", "absolute", "squared", "penalty", "zero", "shrink", "variance"],
  "learning rate": ["step", "speed", "diverge", "oscillate", "minimize", "gradient", "learning rate", "overshoot", "converge"],
  "overfitting": ["memorize", "noise", "generalization", "validate", "train", "split", "test", "overfit", "complexity"],
  "worst-case time complexity of Quick Sort": ["pivot", "worst", "quadratic", "n^2", "sorted", "partition", "random", "balance"],
  "space complexity between Merge Sort and Quick Sort": ["auxiliary", "in-place", "space", "memory", "array", "stack", "allocation", "temp"],
  "advantage of Binary Search": ["log", "pre-sorted", "sorted", "half", "mid", "divide", "linear", "constant"],
  "cryptographic hash function": ["one-way", "deterministic", "collision", "avalanche", "fingerprint", "reverse", "fixed"],
  "Proof of Work": ["miner", "puzzle", "hash", "difficulty", "nonce", "energy", "validate", "consensus"],
  "smart contract": ["automatic", "code", "decentralized", "blockchain", "trustless", "execution", "self-executing"],
  "quantum superposition": ["classical", "both", "0 and 1", "qubit", "probability", "collapse", "state", "bloch"],
  "quantum entanglement": ["bell", "instant", "spooky", "correlated", "measure", "collapse", "distance", "non-local"],
  "quantum gate": ["unitary", "matrix", "rotation", "qubit", "amplitude", "state", "operation", "phase"]
};

// POST /api/progress/diagnostic-evaluate
router.post('/diagnostic-evaluate', auth, async (req, res) => {
   try {
       const { topic, answers } = req.body;
       const progress = await getProgressDoc(req.user.id);

       if (openai) {
          try {
             const prompt = `You are an AI Learning Mentor. You need to evaluate a student's answers to a diagnostic quiz on the topic "${topic}".
Here are the questions and the student's answers:
${answers.map((a, i) => `Q${i+1}: ${a.question}\nStudent Answer: ${a.answer}`).join('\n\n')}

Please grade each answer out of 100, and provide constructive, detailed feedback for each question explaining what they did well, what was missing, and a brief, precise study recommendation.
Also provide an overall summary feedback and calculate the average score.

Return the response ONLY as a JSON object matching this exact schema:
{
  "score": Number (average score between 0 and 100),
  "feedback": "Overall high-fidelity summary feedback here.",
  "questions": [
    {
      "question": "Question text here...",
      "userAnswer": "User's answer here...",
      "aiGrade": Number (0 to 100),
      "aiFeedback": "Detailed constructive evaluation and feedback here."
    }
  ]
}`;
             const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                   { role: "system", content: "You are an expert AI learning grader who only outputs valid, structured JSON." },
                   { role: "user", content: prompt }
                ],
                temperature: 0.5,
                response_format: { type: "json_object" }
             });

             const parsed = JSON.parse(response.choices[0].message.content);
             
             // Save to Mongoose Diagnostics history
             progress.diagnostics.push({
                topic: topic,
                score: parsed.score,
                feedback: parsed.feedback,
                questions: parsed.questions
             });
             
             progress.aiFeedbackCache = null; // Clear cached mentor text
             await progress.save();

             return res.json(parsed);
          } catch (openaiErr) {
             console.warn("OpenAI evaluation failed, falling back to local grading:", openaiErr);
          }
       }

       // Local fall-back grading
       const evaluatedQuestions = answers.map((item) => {
          const ansLower = item.answer.toLowerCase();
          
          // Match keywords
          let matchedKeywords = [];
          Object.keys(fallbackKeywords).forEach(key => {
             if (item.question.toLowerCase().includes(key.toLowerCase())) {
                matchedKeywords = fallbackKeywords[key];
             }
          });
          
          if (matchedKeywords.length === 0) {
             matchedKeywords = ["concept", "understand", "theory", "logic", "explanation"];
          }

          let hits = 0;
          matchedKeywords.forEach(kw => {
             if (ansLower.includes(kw)) hits++;
          });

          let grade = 40; // baseline
          let feedback = "";

          if (ansLower.trim().length < 15) {
             grade = 25;
             feedback = "Your answer is extremely brief. To measure performance accurately, please elaborate on the technical principles and show your logical reasoning.";
          } else if (hits >= 3) {
             grade = Math.floor(Math.random() * 9) + 90; // 90 to 98
             feedback = `Excellent explanation! You have accurately captured key technical concepts: [${matchedKeywords.filter(kw => ansLower.includes(kw)).join(', ')}]. You demonstrate strong conceptual depth on this topic. Keep leveraging these techniques in your code.`;
          } else if (hits === 2) {
             grade = Math.floor(Math.random() * 14) + 75; // 75 to 88
             feedback = `Very solid start. You covered important points like [${matchedKeywords.filter(kw => ansLower.includes(kw)).join(', ')}]. However, you could improve by fully explaining the underlying mechanics (e.g. detailed limiting behaviors or mathematical properties).`;
          } else if (hits === 1) {
             grade = Math.floor(Math.random() * 15) + 55; // 55 to 69
             feedback = `Fair attempt. You mentioned [${matchedKeywords.filter(kw => ansLower.includes(kw)).join(', ')}], but the explanation missed major principles of this topic. I recommend reading the related topic guide in the Curriculum Map for a detailed structural overview.`;
          } else {
             grade = Math.floor(Math.random() * 15) + 40; // 40 to 54
             feedback = "Your answer was somewhat generalized. Try to incorporate formal vocabulary and specific terms (e.g. spatial bounds, complexity thresholds, vector mappings) to elevate your technical precision.";
          }

          return {
             question: item.question,
             userAnswer: item.answer,
             aiGrade: grade,
             aiFeedback: feedback
          };
       });

       const avgScore = Math.round(evaluatedQuestions.reduce((acc, q) => acc + q.aiGrade, 0) / evaluatedQuestions.length);
       const overallFeedback = `Evaluation complete for ${topic}. You achieved an average score of ${avgScore}%. ${
          avgScore >= 85 ? "You show an elite command of these theories. Try taking on advanced labs to test your practical speed!" :
          avgScore >= 70 ? "Good conceptual base. Review your individual question report card to target minor missing details." :
          "Significant gaps remain. I highly encourage clicking the curriculum nodes on your map to study lesson notes and retaking this assessment."
       }`;

       const finalResult = {
          score: avgScore,
          feedback: overallFeedback,
          questions: evaluatedQuestions
       };

       progress.diagnostics.push({
          topic,
          score: avgScore,
          feedback: overallFeedback,
          questions: evaluatedQuestions
       });

       progress.aiFeedbackCache = null; // Clear cache
       await progress.save();

       return res.json(finalResult);
   } catch (err) {
       console.error("Error in diagnostic evaluation:", err);
       res.status(500).json({ error: "Failed to grade diagnostic answers: " + err.message });
   }
});

// POST /api/progress/ai-query
router.post('/ai-query', auth, async (req, res) => {
   try {
       const { message } = req.body;
       const progress = await getProgressDoc(req.user.id);
       
       const qAccs = progress.quizzes.map(q => q.accuracy);
       const avgQuizAccuracy = qAccs.length ? (qAccs.reduce((a,b)=>a+b,0) / qAccs.length) : 0;
       const labCompletions = progress.labs.filter(l => l.completed).length;
       
       const latestDiagnostic = progress.diagnostics && progress.diagnostics.length 
          ? progress.diagnostics[progress.diagnostics.length - 1] 
          : null;
          
       const context = `You are an expert AI Learning Mentor helping a student in VirtualLabX.
Student details:
- Labs completed: ${labCompletions}
- Quiz Accuracy: ${Math.round(avgQuizAccuracy)}%
- Latest Diagnostic Evaluation Topic: ${latestDiagnostic ? latestDiagnostic.topic : 'None taken yet'}
- Latest Diagnostic Score: ${latestDiagnostic ? latestDiagnostic.score : 'N/A'}
- Latest Diagnostic AI Feedback: ${latestDiagnostic ? latestDiagnostic.feedback : 'N/A'}

Student query: "${message}"

Please respond with helpful, detailed, action-oriented, encouraging feedback. Outline concrete next steps in bullet points. Use standard clean markdown format. Keep your response within 2-3 short, dense paragraphs.`;

       if (openai) {
          const response = await openai.chat.completions.create({
             model: "gpt-3.5-turbo",
             messages: [{ role: "user", content: context }],
             temperature: 0.7
          });
          return res.json({ response: response.choices[0].message.content });
       } else {
          // Fallback response generator
          const msgLower = message.toLowerCase();
          let responseText = `### AI Mentor Response (Local Pipeline)
          
As your VirtualLabX AI Mentor, I have processed your request using our local advisory engine based on your active telemetry metrics.

`;
          if (msgLower.includes('radar') || msgLower.includes('skill') || msgLower.includes('score') || msgLower.includes('conceptual')) {
             responseText += `Based on your **Skill Radar**, your current conceptual index is **${Math.round(latestDiagnostic ? (avgQuizAccuracy * 0.6 + latestDiagnostic.score * 0.4) : avgQuizAccuracy)}%**. To optimize this rating:
* Engage in a fresh conceptual evaluation using the **Interactive Diagnostic Hub** on this page. High scores on these checks will directly scale your radar.
* Review completed virtual lab quizzes to maximize your baseline conceptual accuracy.
* Complete additional practical lab simulations to boost your **Problem Solving** rating.`;
          } else if (msgLower.includes('diagnostic') || msgLower.includes('quiz') || msgLower.includes('eval') || msgLower.includes('test')) {
             responseText += `Executing **AI Diagnostic Evaluations** is the fastest path to targeted learning:
* Click the **"Initialize AI Diagnostic Evaluation"** button in the Diagnostic Hub.
* Make sure you write clear, analytical explanations—our grading engine assesses your logical connections and descriptive depth rather than simple multiple choices.
* Check your past scorecard logs below the hub for custom constructive study recommendations.`;
          } else if (msgLower.includes('sort') || msgLower.includes('algorithm') || msgLower.includes('dsa') || msgLower.includes('merge') || msgLower.includes('quick')) {
             responseText += `For mastering **Data Structures & Algorithms**:
* Navigate to the **Sorting Algorithms** curriculum map node and read the lesson notes.
* Compare time/space complexities: remember that Merge Sort guarantees $O(N \\log N)$ runtime at the cost of auxiliary spatial allocation, whereas Quick Sort partitions in-place.
* Launch the sorting simulator, run both engines side-by-side in dual-mode, and solve the quiz problems.`;
          } else if (msgLower.includes('regression') || msgLower.includes('gradient') || msgLower.includes('machine') || msgLower.includes('ml')) {
             responseText += `For mastering **Machine Learning**:
* Study the **Linear Regression** curriculum nodes to learn about Loss Functions and Gradient Descent equations.
* Focus on hyperparameters: pay close attention to how too high a learning rate causes divergence, while L1 regularization introduces feature sparsity by driving parameters to absolute zero.
* Complete the interactive code validation sections in the Machine Learning labs.`;
          } else {
             responseText += `You have currently finished **${labCompletions} labs**. Here is my primary study recommendation:
1. **Target Weak Areas**: Use the curriculum map satellites to read specific study notes on topics where you scored under 80%.
2. **Take Conceptual Diagnostics**: Execute diagnostics on this page to let the AI pinpoint your specific blindspots.
3. **Practice Regularly**: Maintain consistency by performing at least 1-2 lab simulations weekly to reinforce your retention metrics.

Is there a specific algorithm, mathematical principle, or error message I can help explain for you?`;
          }
          return res.json({ response: responseText });
       }
   } catch (err) {
       console.error("Error in AI query:", err);
       res.status(500).json({ error: "Failed to query AI Mentor: " + err.message });
   }
});

module.exports = router;
