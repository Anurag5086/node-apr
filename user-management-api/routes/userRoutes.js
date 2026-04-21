const express = require('express');
const { registerUser, loginUser, getUserById } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)

router.get('/get-user-by-id',authMiddleware, getUserById)
router.get('/age-gt-25', ageGreaterThan25)
module.exports = router;