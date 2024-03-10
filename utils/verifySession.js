// utils/verifySession.js
const jwt = require('jsonwebtoken');

const { logger } = require('../utils/logger');
// const sessions = require('../controllers/userAuthController').sessions;


const verifySession = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        logger.info('Authentication token required.');
        return res.status(401).json({ message: 'Authentication token required.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const session = decoded.sessionId;

        if (!session || decoded.expires < Date.now()) {
            logger.info('Session expired. Please signin again.');
            return res.status(401).json({ message: 'Session expired. Please signin again.' });
        }

        req.user = {
            userId: session.userId,
            email: session.email,
        }
        next();

    } catch (error) {
        logger.error('Invalid or expired token', error);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = verifySession;
