require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json()); // Parses incoming json requests
app.use(cors()); // Enables cross-origin requests from the React frontend

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB successfully connected...'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
