const User = require('../models/User');

exports.getUserById = async (req, res) => {
    try{
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password -otp -otpExpiry');

        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

// Example: GET /get-user-by-email?email=anurag@gmail.com
exports.getUserByEmail = async (req, res) => {
    try{
        const { email } = req.query;

        const user = await User.findOne({ email }).select('-password -otp -otpExpiry');

        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getAllUsers = async (req, res) => {
    try{
        if(req.user.role !== 'admin'){
            return res.status(403).json({ message: 'Forbidden' });
        }

        const users = await User.find().select('-password -otp -otpExpiry');

        res.status(200).json({ users });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateUser = async (req, res) => {
    try{
        const userId = req.user.id;

        const { name, phoneNumber, address } = req.body;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.address = address || user.address;

        await user.save();

        res.status(200).json({ message: 'User updated successfully' });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.deleteUser = async (req, res) => {
    try{
        const userId = req.user.id;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User deleted successfully' });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}