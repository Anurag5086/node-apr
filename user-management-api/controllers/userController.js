const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });

        if(user){
            return res.status(400).json({ message: 'User already exists, please enter a new email or login with this email!' });
        }

        const hashedPassword = await bcrypt.hash(password, 14);

        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save()

        res.status(201).json({ message: 'User registered successfully' });

    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}