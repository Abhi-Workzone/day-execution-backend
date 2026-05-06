const Routine = require('../models/Routine');

exports.createRoutine = async (req, res) => {
  try {
    const routine = new Routine({
      ...req.body,
      userId: req.user._id
    });
    await routine.save();
    res.status(201).json(routine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getRoutines = async (req, res) => {
  try {
    const routines = await Routine.find({ 
      $or: [{ userId: req.user._id }, { userId: { $exists: false } }]
    });
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRoutine = async (req, res) => {
  try {
    const routine = await Routine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(routine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteRoutine = async (req, res) => {
  try {
    await Routine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Routine deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
