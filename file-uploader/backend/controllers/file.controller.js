const File = require('../models/File');
const joi = require('joi');

exports.uploadFile = async (req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { title, description } = req.body;

        const schema = joi.object({
            title: joi.string().min(3).max(100).required(),
            description: joi.string().max(500).optional()
        })

        const { error } = schema.validate({ title, description });
        if(error){
            return res.status(400).json({ error: error.details[0].message });
        }

        const fileData = new File({
            title,
            description,
            attachment: req.file.path
        })

        await fileData.save();

        res.status(201).json({ message: 'File uploaded successfully', file: fileData });

    }catch(err){
        console.error('Error uploading file:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}