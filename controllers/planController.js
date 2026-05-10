const DailyPlan = require('../models/DailyPlan');
const Routine = require('../models/Routine');
const Task = require('../models/Task');

exports.getTodayPlan = async (req, res) => {
  try {
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    let plan = await DailyPlan.findOne({ 
      date: queryDate, 
      $or: [{ userId: req.user._id }, { userId: { $exists: false } }]
    });
    
    const dayOfWeek = queryDate.getDay();
    const routines = await Routine.find({ 
      daysOfWeek: dayOfWeek, 
      $or: [{ userId: req.user._id }, { userId: { $exists: false } }]
    });
    const pendingTasks = await Task.find({ 
      status: 'pending', 
      $or: [{ userId: req.user._id }, { userId: { $exists: false } }]
    });
    
    const suggestions = {
      routines,
      tasks: pendingTasks
    };

    if (!plan) {
      return res.json({
        exists: false,
        suggestions
      });
    }

    res.json({ exists: true, plan, suggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.savePlan = async (req, res) => {
  try {
    const { date, tasks, plannedTotalTime } = req.body;
    const planDate = new Date(date);
    planDate.setHours(0, 0, 0, 0);

    let plan = await DailyPlan.findOneAndUpdate(
      { date: planDate, userId: req.user._id },
      { tasks, plannedTotalTime },
      { new: true, upsert: true }
    );

    res.json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTaskExecution = async (req, res) => {
  try {
    const { planId, taskId } = req.params;
    const { actualTime, status, reason } = req.body;

    const plan = await DailyPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    const taskIndex = plan.tasks.findIndex(t => t._id.toString() === taskId);
    if (taskIndex === -1) return res.status(404).json({ message: 'Task not found in plan' });

    plan.tasks[taskIndex].actualTime = actualTime;
    plan.tasks[taskIndex].status = status;
    plan.tasks[taskIndex].reason = reason;

    // Sync global Task status with execution status
    if (plan.tasks[taskIndex].type === 'todo' && plan.tasks[taskIndex].taskId) {
      const globalStatus = status === 'done' ? 'completed' : 'pending';
      await Task.findByIdAndUpdate(plan.tasks[taskIndex].taskId, { status: globalStatus });
    }

    // Update actualTotalTime
    plan.actualTotalTime = plan.tasks.reduce((acc, t) => acc + (t.actualTime || 0), 0);

    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
