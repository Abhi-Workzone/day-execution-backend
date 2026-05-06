const mongoose = require('mongoose');

const DailySummarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  plannedTime: { type: Number, required: true },
  actualTime: { type: Number, required: true },
  completionRate: { type: Number, required: true }, // percentage
  accuracyScore: { type: Number, required: true },  // percentage
  createdAt: { type: Date, default: Date.now }
});

// Ensure one summary per user per date
DailySummarySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailySummary', DailySummarySchema);
