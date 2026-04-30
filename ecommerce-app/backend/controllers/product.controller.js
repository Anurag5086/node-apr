const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try{
        const products = await Product.find({ isActive: true }).populate('category', 'title');
        res.status(200).json(products);
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getAllProductsByCategory = async (req, res) => {
    try{
        const { categoryId } = req.params;

        const products = await Product.find({ category: categoryId, isActive: true}).populate('category', 'title');
        res.status(200).json(products);
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getProductById = async (req, res) => {
    try{
        const { id } = req.params;
        
        const product = await Product.findById(id).populate('category', 'title');
        if(!product || !product.isActive){
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.createProduct = async (req, res) => {
    try{
        const { title, description, mrpPrice, sellingPrice, images, category, stockQuantity, rating, noOfRating, brand } = req.body;

        const newProduct = new Product({
            title,
            description,
            mrpPrice,
            sellingPrice,
            images,
            category,
            stockQuantity,
            rating,
            noOfRating,
            brand
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully' });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateProduct = async (req, res) => {
    try{
        const { id } = req.params;
        const { title, description, mrpPrice, sellingPrice, images, category, stockQuantity, rating, noOfRating, brand } = req.body;

        const product = await Product.findById(id);
        if(!product || !product.isActive){
            return res.status(404).json({ message: 'Product not found' });
        }

        product.title = title || product.title;
        product.description = description || product.description;
        product.mrpPrice = mrpPrice || product.mrpPrice;
        product.sellingPrice = sellingPrice || product.sellingPrice;
        product.images = images || product.images;
        product.category = category || product.category;
        product.stockQuantity = stockQuantity || product.stockQuantity;
        product.rating = rating || product.rating;
        product.noOfRating = noOfRating || product.noOfRating;
        product.brand = brand || product.brand;

        await product.save();
        res.status(200).json({ message: 'Product updated successfully' });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.deleteProduct = async (req, res) => {
    try{
        const { id } = req.params;

        const product = await Product.findById(id);
        if(!product || !product.isActive){
            return res.status(404).json({ message: 'Product not found' });
        }

        product.isActive = false;
        await product.save();
        res.status(200).json({ message: 'Product deleted successfully' });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}