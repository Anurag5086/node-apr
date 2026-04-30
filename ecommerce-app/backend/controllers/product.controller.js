const Product = require('../models/product.model');

exports.getAllProducts = async (req, res) => {
    try{
        const products = await Product.find({ isActive: true }).populate('category', 'title');
        res.status(200).json(products);
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

