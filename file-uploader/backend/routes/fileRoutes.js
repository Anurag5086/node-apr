const express = require('express');
const upload = require('../middlewares/multer.middleware');
const { uploadFile } = require('../controllers/file.controller');
const router = express.Router();

router.post('/upload', upload.single('file'), uploadFile)

module.exports = router;