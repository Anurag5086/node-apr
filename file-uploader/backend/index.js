const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const fileRoutes = require('./routes/fileRoutes');

app.use(express.json())

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('API is working!');
})

app.use('/api/files', fileRoutes);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.listen(3000, () => {
    console.log('Server is running on PORT: 3000');
})