import bcrypt from 'bcryptjs';
import { UniqueConstraintError } from 'sequelize';

import sequelize from '../../models/index.js';

export default {
    registerUser: async (req, res) => {
        const { username, password, repeatPassword } = req.body;

        // TODO Create middleware for username and password validation?
        if (!username) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.usernameRequired')
            });
        }
        if (!password) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.passwordRequired')
            });
        }
        if (password !== repeatPassword) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.samePasswords')
            });
        }

        if (username.length < 4) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.usernameTooShort')
            });
        }
        if (username.length > 30) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.usernameTooLong')
            });
        }

        if (password.length < 5) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.passwordTooShort')
            });
        }
        if (password.length > 50) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.passwordTooLong')
            });
        }

        const passwordHash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        try {
            const userRole = await sequelize.models.Role.findOne({ where: { name: 'user' } });

            const user = await sequelize.models.User.create({
                username: username,
                password: passwordHash
            });

            user.setRole(userRole);

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
            if (e instanceof UniqueConstraintError) {
                res.status(400).send({
                    success: false,
                    message: req.t('errors.uniqueUsername')
                });
            } else {
                console.error(e);

                return res.status(500).send({
                    success: false,
                    message: req.t('errors.internalServerError')
                });
            }
        }
    },
    loginUser: async (req, res) => {
        const { username, password } = req.body;

        if (!username) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.usernameRequired')
            });
        }
        if (!password) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.passwordRequired')
            });
        }

        try {
            const user = await sequelize.models.User.findOne({ where: { username: username } });

            if (!user) {
                return res.status(400).send({
                    success: false,
                    message: req.t('errors.incorrectUsernamePassword')
                });
            }

            const correctPassword = await bcrypt.compare(password, user.password);

            if (!correctPassword) {
                return res.status(400).send({
                    success: false,
                    message: req.t('errors.incorrectUsernamePassword')
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
                message: req.t('errors.internalServerError')
            });
        }
    }
}