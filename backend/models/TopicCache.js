const mongoose = require('mongoose');

const TopicCacheSchema = new mongoose.Schema({
  topicName: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  introduction: { type: String, required: true },
  corePrinciples: [{
    title: { type: String },
    description: { type: String }
  }],
  deepDive: { type: String, required: true },
  applications: [{
    name: { type: String },
    description: { type: String }
  }],
  recommendations: [{
    type: { type: String }, // e.g. "Book", "Video", "Course", "Article"
    title: { type: String },
    link: { type: String },
    description: { type: String }
  }],
  lastGenerated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('TopicCache', TopicCacheSchema);
