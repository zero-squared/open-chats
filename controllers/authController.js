import bcrypt from 'bcryptjs';

import sequelize from '../models/index.js';

export default {
    registerUser: async (req, res) => {
        const { password, username } = req.body;

        if (!username) {
            res.status(400).send({
                success: false,
                error: 'Username is required'
            });
            return;
        }
        if (!password) {
            res.status(400).send({
                success: false,
                error: 'Password is required'
            });
            return;
        }

        if (username.length < 5) {
            res.status(400).send({
                success: false,
                error: 'Username must be at least 5 characters long'
            });
            return;
        }
        if (username.length > 30) {
            res.status(400).send({
                success: false,
                error: 'Username cannot be longer than 30 characters'
            });
            return;
        }

        if (password.length < 5) {
            res.status(400).send({
                success: false,
                error: 'Password must be at least 5 characters long'
            });
            return;
        }
        if (password.length > 50) {
            res.status(400).send({
                success: false,
                error: 'Password cannot be longer than 50 characters'
            });
            return;
        }

        const passwordHash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        try {
            const user = await sequelize.models.User.create({
                username: username,
                password: passwordHash
            });

            req.session.username = user.username;
            res.send({
                success: true,
            });
        } catch (e) {
            // Handle sequelize error
            if (e.message === 'Validation error') {
                // Capitalize the first letter of error message
                const error = e.errors[0].message.charAt(0).toUpperCase() + e.errors[0].message.slice(1);

                res.status(400).send({
                    success: false,
                    error
                });
            } else {
                console.error(e);

                res.status(500).send({
                    success: false,
                    error: 'Internal server error'
                });
            }
        }
    },
    loginUser: async (req, res) => {
        const { password, username } = req.body;

        if (!username) {
            res.status(400).send({
                success: false,
                error: 'Username is required'
            });
            return;
        }
        if (!password) {
            res.status(400).send({
                success: false,
                error: 'Password is required'
            });
            return;
        }

        try {
            const user = await sequelize.models.User.findOne({ where: { username: username } });

            if (!user) {
                res.status(400).send({
                    success: false,
                    error: 'Incorrect username or password'
                });
                return;
            }

            const correctPassword = await bcrypt.compare(password, user.password);

            if (!correctPassword) {
                res.status(400).send({
                    success: false,
                    error: 'Incorrect username or password'
                });
                return;
            }

            req.session.username = user.username;
            res.send({
                success: true,
            });
        } catch (e) {
            console.error(e);

            res.status(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}