require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const taskRoutes = require('./routes/taskRoutes');
const routineRoutes = require('./routes/routineRoutes');
const planRoutes = require('./routes/planRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: ['https://day-execution-frontend.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(bodyParser.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Day Execution API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
