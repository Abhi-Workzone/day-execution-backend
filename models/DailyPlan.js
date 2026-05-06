const mongoose = require('mongoose');

const DailyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  tasks: [
    {
      taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
      title: { type: String, required: true },
      type: { type: String, enum: ['routine', 'todo'], required: true },
      plannedStart: { type: String }, // HH:mm
      plannedEnd: { type: String },   // HH:mm
      plannedDuration: { type: Number, default: 0 },
      actualTime: { type: Number, default: 0 }, // minutes
      status: { type: String, enum: ['pending', 'done', 'partial', 'missed'], default: 'pending' },
      reason: { type: String }
    }
  ],
  plannedTotalTime: { type: Number, default: 0 },
  actualTotalTime: { type: Number, default: 0 }, // minutes
  createdAt: { type: Date, default: Date.now }
});

// Ensure one plan per user per date
DailyPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyPlan', DailyPlanSchema);
