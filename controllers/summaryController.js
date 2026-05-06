const DailySummary = require('../models/DailySummary');
const DailyPlan = require('../models/DailyPlan');

exports.createSummary = async (req, res) => {
  try {
    const { date, notes } = req.body;
    const summaryDate = new Date(date);
    summaryDate.setHours(0, 0, 0, 0);

    const plan = await DailyPlan.findOne({ 
      date: summaryDate, 
      $or: [{ userId: req.user._id }, { userId: { $exists: false } }]
    });
    if (!plan) return res.status(404).json({ message: 'No plan found for this date' });

    const totalTasks = plan.tasks.length;
    const completedTasks = plan.tasks.filter(t => t.status === 'done').length;
    
    const plannedTime = plan.plannedTotalTime;
    const actualTime = plan.actualTotalTime;

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Accuracy score: how close actual time is to planned time (0-100)
    // 100 - (abs(planned - actual) / planned * 100)
    let accuracyScore = 0;
    if (plannedTime > 0) {
      const diff = Math.abs(plannedTime - actualTime);
      accuracyScore = Math.max(0, 100 - (diff / plannedTime * 100));
    }

    const summary = await DailySummary.findOneAndUpdate(
      { date: summaryDate, userId: req.user._id },
      {
        plannedTime: plan.plannedTotalTime,
        actualTime: plan.actualTotalTime,
        completionRate,
        accuracyScore,
        notes
      },
      { new: true, upsert: true }
    );

    res.json(summary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);
    const summary = await DailySummary.findOne({ 
      date, 
      $or: [{ userId: req.user._id }, { userId: { $exists: false } }]
    });
    if (!summary) return res.status(404).json({ message: 'Summary not found' });
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSummaries = async (req, res) => {
  try {
    const summaries = await DailySummary.find({ 
      $or: [{ userId: req.user._id }, { userId: { $exists: false } }]
    }).sort({ date: -1 }).limit(7);
    res.json(summaries);
  } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
