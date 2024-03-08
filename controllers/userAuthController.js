// controllers/userAuthController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { logger } = require('../utils/logger');


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

