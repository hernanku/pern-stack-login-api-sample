// routes/userAuthRoutes.js
const express = require('express');

const userAuthController = require('../controllers/userAuthController');
const verifySession = require('../utils/verifySession');

const router = express.Router();


// routes
router.post('/user/signup', userAuthController.signupUser);
router.post('/user/signin', userAuthController.signinUser);
router.post('/user/signout', verifySession ,userAuthController.signoutUser);
router.delete('/user/delete', userAuthController.deleteUser);

module.exports = router;
