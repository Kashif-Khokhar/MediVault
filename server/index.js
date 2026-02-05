const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Higher limit for Base64 encrypted files

app.get('/', (req, res) => {
    res.send('MediVault API is running...');
});

// Routes
app.use('/api/auth', require('./routes/userRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/vitals', require('./routes/vitalRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
