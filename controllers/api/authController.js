import bcrypt from 'bcryptjs';
import { BaseError } from 'sequelize';

import sequelize from '../../models/index.js';

export default {
    registerUser: async (req, res) => {
        const { password, username } = req.body;

        // TODO Create middleware for username and password validation?
        if (!username) {
            return res.status(400).send({
                success: false,
                message: 'Username is required'
            });
        }
        if (!password) {
            return res.status(400).send({
                success: false,
                message: 'Password is required'
            });
        }

        if (username.length < 5) {
            return res.status(400).send({
                success: false,
                message: 'Username must be at least 5 characters long'
            });
        }
        if (username.length > 30) {
            return res.status(400).send({
                success: false,
                message: 'Username cannot be longer than 30 characters'
            });
        }

        if (password.length < 5) {
            return res.status(400).send({
                success: false,
                message: 'Password must be at least 5 characters long'
            });
        }
        if (password.length > 50) {
            return res.status(400).send({
                success: false,
                message: 'Password cannot be longer than 50 characters'
            });
        }

        const passwordHash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        try {
            const user = await sequelize.models.User.create({
                username: username,
                password: passwordHash
            });

            // TODO Create sepparate function for creating session object
            req.session.user = {
                id: user.id,
                username: user.username,
                avatarUrl: user.avatarUrl
            }
            res.send({
                success: true,
            });
        } catch (e) {
            // Handle sequelize error
            if (e instanceof BaseError) {
                // Capitalize the first letter of error message
                const message = e.errors[0].message.charAt(0).toUpperCase() + e.errors[0].message.slice(1);

                res.status(400).send({
                    success: false,
                    message
                });
            } else {
                console.error(e);

                return res.status(500).send({
                    success: false,
                    message: 'Internal Server Error'
                });
            }
        }
    },
    loginUser: async (req, res) => {
        const { password, username } = req.body;

        if (!username) {
            return res.status(400).send({
                success: false,
                message: 'Username is required'
            });
        }
        if (!password) {
            return res.status(400).send({
                success: false,
                message: 'Password is required'
            });
        }

        try {
            const user = await sequelize.models.User.findOne({ where: { username: username } });

            if (!user) {
                return res.status(400).send({
                    success: false,
                    message: 'Incorrect username or password'
                });
            }

            const correctPassword = await bcrypt.compare(password, user.password);

            if (!correctPassword) {
                return res.status(400).send({
                    success: false,
                    message: 'Incorrect username or password'
                });
            }

            req.session.user = {
                id: user.id,
                username: user.username,
                avatarUrl: user.avatarUrl
            }
            res.send({
                success: true,
            });
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }
}