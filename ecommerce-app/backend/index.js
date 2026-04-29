const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json())

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})

    