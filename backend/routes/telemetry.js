const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const eventQueue = [];

// Flush queue every 10 seconds (Simulating BullMQ/Redis async processing locally)
setInterval(async () => {
  if (eventQueue.length === 0) return;
  const batch = eventQueue.splice(0, eventQueue.length);
  
  try {
     for (const event of batch) {
        if (event.type === 'QUESTION_ANSWERED') {
           let tp = await prisma.topicPerformance.findFirst({
              where: { userId: event.userId, topic: event.topic }
           });
           
           if (!tp) {
              tp = await prisma.topicPerformance.create({
                 data: {
                    userId: event.userId,
                    topic: event.topic,
                    weightedScore: 0,
                    confidenceScore: 0.1,
                    lastAssessedAt: new Date(),
                    trendEvolution: "[]"
                 }
              });
           }
           
           const newTotal = tp.totalAttempts + 1;
           const newCorrect = tp.correctAttempts + (event.correct ? 1 : 0);
           
           // Calculate EMA weighted score based on difficulty
           const difficultyWeight = event.difficulty || 1;
           const attemptScore = event.correct ? (10 * difficultyWeight) : 0; // Max 50 points per question
           
           const alpha = 0.2; // Exponential Moving Average smoothing factor
           const newWeightedScore = (attemptScore * alpha) + (tp.weightedScore * (1 - alpha));
           
           // Bayesian Confidence Estimate (simplistic asymptotic approach)
           const newConfidence = 1 - (1 / (1 + newTotal * 0.1));
           
           const trendArray = JSON.parse(tp.trendEvolution || "[]");
           trendArray.push({
              score: newWeightedScore,
              date: new Date().toISOString()
           });
           if (trendArray.length > 50) trendArray.shift();
           
           await prisma.topicPerformance.update({
              where: { id: tp.id },
              data: {
                 totalAttempts: newTotal,
                 correctAttempts: newCorrect,
                 weightedScore: newWeightedScore,
                 confidenceScore: newConfidence,
                 lastAssessedAt: new Date(),
                 trendEvolution: JSON.stringify(trendArray)
              }
           });
        }
        
        // Track generic behavioral events
        await prisma.behavioralMetric.create({
           data: {
              sessionId: event.sessionId || null,
              metricType: event.type,
              value: event.value || 0,
              context: JSON.stringify(event.context || {})
           }
        });
     }
  } catch(e) {
     console.error("Queue process error:", e);
  }
}, 10000);

// POST /api/telemetry/track
router.post('/track', (req, res) => {
  const { events } = req.body;
  if (!events || !Array.isArray(events)) {
    return res.status(400).json({ error: 'events array required' });
  }
  
  events.forEach(ev => {
     if (ev.type && ev.userId) {
         eventQueue.push({ ...ev, receivedAt: new Date() });
     }
  });
  
  res.status(200).json({ status: 'queued', count: events.length });
});

module.exports = router;
