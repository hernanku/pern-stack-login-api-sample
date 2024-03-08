const express = require('express');

const userAuthController = require('../controllers/userAuthController');

const router = express.Router();


// routes
router.post('/user/signup', userAuthController.signupUser);
router.post('/user/delete', userAuthController.deleteUser);

module.exports = router;
