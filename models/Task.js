const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['flexible', 'time-bound'], default: 'flexible' },
  deadline: { type: Date },
  estimatedTime: { type: Number, default: 0 }, // in minutes
  status: { type: String, enum: ['pending', 'completed', 'carried'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);
