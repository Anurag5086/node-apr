const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

// Middleware to parse JSON bodies
app.use(express.json());

// Use user routes
app.use('/api', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})