const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const joi = require('joi');

exports.registerUser = async (req, res, next) => {
    try{
        const { name, email, password } = req.body;

        const schema = joi.object({
            name: joi.string().min(3).max(50).required(),
            email: joi.string().email().required(),
            password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/).required()
        });

        const { error } = schema.validate({ name, email, password });

        if(error){
            return res.status(400).json({ message: error.details[0].message });
        }

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
        next(err)
    }
}

exports.loginUser = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({message: 'Login successful', token });
    }catch(err){
        next(err)
    }
}

exports.getUserById = async (req, res) => {
    try {
        const userId = req.user.userId

        const user = await User.findById(userId).select('-password');

        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({message: "Fetched user details successfully!", user});
    }catch(err){
        next(err)
    }
}

exports.ageGreaterThan25 = async (req, res) => {
    try{
        const users = await User.find({age : {$gt: 25}})

        res.status(200).json({message: "Fetched users with age greater than 25 successfully!", users})
    }catch(err){
        res.send(err)
    }
}