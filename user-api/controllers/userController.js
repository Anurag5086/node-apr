const User = require('../models/User');

// Create a new user
exports.createUser = async (req, res) => {
    const { name, email, phoneNumber } = req.body;

    try{
       const newUser = new User({
        name,
        email,
        phoneNumber
       });

       await newUser.save();

       res.status(201).json({message: "Successfully created a User!", user: newUser});
    }catch(err){
        res.status(500).json({message: "Error creating user", error: err.message});
    }
}

exports.getUserById = async (req, res) => {
    const id = req.params.id;

    try{
        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json({message: "User fetched successfully", user});
    }catch(err){
        res.status(500).json({message: "Error fetching user", error: err.message});
    }
}

exports.updateUserById = async (req, res) => {
    const id = req.params.id;
    const { name, email, phoneNumber } = req.body;

    try{
        const user = await User.findById(id);
        
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const updatedUser = await User.findByIdAndUpdate(id, { name, email, phoneNumber }, { new: true });

        res.status(200).json({message: "User updated successfully", user: updatedUser});
    }catch(err){
        res.status(500).json({message: "Error updating user", error: err.message});
    }
}

exports.deleteUserById = async (req, res) => {
    const id = req.params.id;

    try{
        const user = await User.findById(id);
        
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({message: "User deleted successfully"});
    }catch(err){
        res.status(500).json({message: "Error deleting user", error: err.message});
    }
}