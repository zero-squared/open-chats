import bcrypt from 'bcryptjs';

import sequelize from '../../models/index.js';

export default {
    registerUser: async (req, res) => {
        const { password, username } = req.body;

        if (!username) {
            res.status(400).send({
                success: false,
                message: 'Username is required'
            });
            return;
        }
        if (!password) {
            res.status(400).send({
                success: false,
                message: 'Password is required'
            });
            return;
        }

        if (username.length < 5) {
            res.status(400).send({
                success: false,
                message: 'Username must be at least 5 characters long'
            });
            return;
        }
        if (username.length > 30) {
            res.status(400).send({
                success: false,
                message: 'Username cannot be longer than 30 characters'
            });
            return;
        }

        if (password.length < 5) {
            res.status(400).send({
                success: false,
                message: 'Password must be at least 5 characters long'
            });
            return;
        }
        if (password.length > 50) {
            res.status(400).send({
                success: false,
                message: 'Password cannot be longer than 50 characters'
            });
            return;
        }

        const passwordHash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        try {
            const user = await sequelize.models.User.create({
                username: username,
                password: passwordHash
            });

            req.session.user = {
                username: user.username,
                avatarUrl: user.avatarUrl
            }
            res.send({
                success: true,
            });
        } catch (e) {
            // Handle sequelize error
            if (e.message === 'Validation error') {
                // Capitalize the first letter of error message
                const message = e.errors[0].message.charAt(0).toUpperCase() + e.errors[0].message.slice(1);

                res.status(400).send({
                    success: false,
                    message
                });
            } else {
                console.error(e);

                res.status(500).send({
                    success: false,
                    message: 'Internal server error'
                });
            }
        }
    },
    loginUser: async (req, res) => {
        const { password, username } = req.body;

        if (!username) {
            res.status(400).send({
                success: false,
                message: 'Username is required'
            });
            return;
        }
        if (!password) {
            res.status(400).send({
                success: false,
                message: 'Password is required'
            });
            return;
        }

        try {
            const user = await sequelize.models.User.findOne({ where: { username: username } });

            if (!user) {
                res.status(400).send({
                    success: false,
                    message: 'Incorrect username or password'
                });
                return;
            }

            const correctPassword = await bcrypt.compare(password, user.password);

            if (!correctPassword) {
                res.status(400).send({
                    success: false,
                    message: 'Incorrect username or password'
                });
                return;
            }

            req.session.user = {
                username: user.username,
                avatarUrl: user.avatarUrl
            }
            res.send({
                success: true,
            });
        } catch (e) {
            console.error(e);

            res.status(500).send({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}