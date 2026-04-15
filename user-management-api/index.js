const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB', err));

// Server Start
app.listen(3000, () => {
    console.log('User Management API is running on port 3000');
})