const User = require('../models/User');
const bcrypt = require('bcryptjs');
const joi = require('joi');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const SALTS = 10

exports.registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        const schema = joi.object({
            name: joi.string().trim().min(3).max(50).required(),
            email: joi.string().trim().lowercase().email().required(),
            password: joi.string().min(6).required(),
        })

        const {error} = schema.validate({ name, email, password });
        if(error){
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        const hashedPassword = await bcrypt.hash(password, SALTS);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiry
        })

        await newUser.save();

        nodemailer.createTestAccount((err, account) => {
            if (err) {
                console.error('Failed to create a testing account. ' + err.message);
                return res.status(500).json({ message: 'Server error' });
            }

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587, // TLS
                secure: false, // false for 587
                auth: {
                    user: 'anurag23816@gmail.com',
                    pass: 'odvhmpklcgyojjkb'
                }
            });

            const mailOptions = {
                from: '"E-commerce App" <anurag23816@gmail.com>',
                to: email,
                subject: 'OTP for Email Verification',
                text: `Your OTP for email verification is: ${otp}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email: ' + error.message);
                    return res.status(500).json({ message: 'Server error' });
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
        });

        res.status(201).json({ message: 'User registered successfully' });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.verifyOtp = async (req, res) => {
    try{
        const {email, otp} = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'User not found' });
        }
        
        if(user.otp !== otp || user.otpExpiry < new Date()){
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = jwt.sign({
            userId: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
        );

        res.status(200).json({ message: 'Email verified successfully', token });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.resendOtp = async (req, res) => {
    try{
        const { email } = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

                nodemailer.createTestAccount((err, account) => {
            if (err) {
                console.error('Failed to create a testing account. ' + err.message);
                return res.status(500).json({ message: 'Server error' });
            }

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587, // TLS
                secure: false, // false for 587
                auth: {
                    user: 'anurag23816@gmail.com',
                    pass: 'odvhmpklcgyojjkb'
                }
            });

            const mailOptions = {
                from: '"E-commerce App" <anurag23816@gmail.com>',
                to: email,
                subject: 'OTP for Email Verification',
                text: `Your OTP for email verification is: ${otp}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email: ' + error.message);
                    return res.status(500).json({ message: 'Server error' });
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
        });

        res.status(200).json({ message: 'OTP resent successfully' });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if(user.isVerified){
            const token = jwt.sign({
                userId: user._id,
                isAdmin: user.isAdmin,
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.status(200).json({ message: 'Login successful', token });
        }

        res.status(200).json({ message: 'Login successful, but email not verified' , token: null , isVerified: user.isVerified});
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}