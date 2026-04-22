const express = require('express');
const upload = require('../middlewares/multer.middleware');
const router = express.Router();

router.post('/upload', upload.single('file'), uploadFile)

router.post('/multiple-upload', upload.array('files'), uploadFile)

module.exports = router;