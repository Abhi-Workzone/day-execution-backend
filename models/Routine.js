const mongoose = require('mongoose');

const RoutineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  daysOfWeek: { type: [Number], required: true }, // 0-6, Sunday-Saturday
  startTime: { type: String, required: true }, // HH:mm
  duration: { type: Number, default: 0 } // minutes
});

module.exports = mongoose.model('Routine', RoutineSchema);
