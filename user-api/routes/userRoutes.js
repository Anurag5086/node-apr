const express = require('express');
const { createUser, getUserById, updateUserById, deleteUserById } = require('../controllers/userController');
const router = express.Router();

router.post('/user', createUser)
router.get('/user/:id', getUserById)
router.put('/user/:id', updateUserById)
router.delete('/user/:id', deleteUserById)

module.exports = router;