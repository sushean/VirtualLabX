require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' })); // Parses incoming json requests (increased limit for base64 images)
app.use(cors()); // Enables cross-origin requests from the React frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Unarchived simulations static proxy


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB successfully connected...'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/exam', require('./routes/exam'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/certificates', require('./routes/certificates'));

app.use('/api/examCollections', require('./routes/examCollections'));
app.use('/api/certificate', require('./routes/certificate'));
app.use('/api/verify', require('./routes/verify'));
app.use('/api/labs', require('./routes/labs'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/upload', require('./routes/upload'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
