const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user._id
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ 
      status: 'pending', 
      $or: [{ userId: req.user._id }, { userId: { $exists: false } }]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCompletedTasks = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, parseInt(month) + 1, 0, 23, 59, 59);

    const tasks = await Task.find({ 
      status: 'completed',
      $or: [{ userId: req.user._id }, { userId: { $exists: false } }],
      createdAt: { $gte: startDate, $lte: endDate }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
