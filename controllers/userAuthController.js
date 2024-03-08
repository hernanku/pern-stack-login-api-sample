// controllers/userAuthController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { User } = require('../models');
const { logger } = require('../utils/logger');

const sessions = {};

const cleanupExpiredSessions = () => {
    const now = Date.now();
    Object.keys(sessions).forEach(sessionId => {
        const session = sessions[sessionId];
        if (session.expires < now) {
            delete sessions[sessionId];
        }
    });
};


// Signup user
exports.signupUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: `User with email ${email} already exists.` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword
        });

        res.status(201).json(
        {
            message: `User ${email} created successfully.`,
            userId: user.id,
            email: user.email
        });
        logger.info(`User ${email} created successfully.`)
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: `Error creating user ${email}` });
    }
};


// Signin user
exports.signinUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(401).json({ message: `User ${email} not found.` });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const sessionId = crypto.randomBytes(16).toString('hex');
        const expiresIn = 20 * 60 * 1000;
        const expirationTime = Date.now() + expiresIn;

        sessions[sessionId] = {
            userId: user.id,
            email: user.email,
            expires: expirationTime
        };

        setTimeout(cleanupExpiredSessions, expiresIn)

        const token = jwt.sign({ sessionId: sessionId }, process.env.JWT_SECRET, { expiresIn: '20m' });

        res.json({ message: 'Login successful', token });
        logger.info(`User ${email} logged in successfully.`)
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: `Error logging in user ${email}` });
    }
};


// Signout User
exports.signoutUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: 'No token provided, cannot signout session.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const sessionId = decoded.sessionId;

        if (sessions[sessionId]) {
            delete sessions[sessionId];
            res.json({
                message: `User signed out successfully.`
            })
            logger.info(`Session ${sessionId} invalidated successfully.`)
        } else {
            console.log("Session found or already expired:", sessionId)
            res.status(400).json({ message: `Session ${sessionId} not found, or already expired.` });
        }

    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: `Error signing out user` });
    }
};


// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(400).json({ message: `User with email ${email} not found.` });
        }

        await user.destroy({where: { email}});

        res.status(200).json({ message: `User ${email} deleted successfully.` });
        logger.info(`User ${email} deleted successfully.`)
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: `Error deleting user ${email}` });
    }
};

