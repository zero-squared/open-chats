import bcrypt from 'bcryptjs';

import sequelize from '../../models/index.js';
import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from '../../utils/config.js';
import { updateSession } from '../../utils/session.js';
import { handleUsernameError } from '../../utils/users.js';

export default {
    registerUser: async (req, res) => {
        if (!req.body) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        const { username, password, repeatPassword } = req.body;

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

        if (username.length < USERNAME_MIN_LENGTH) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.usernameTooShort')
            });
        }
        if (username.length > USERNAME_MAX_LENGTH) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.usernameTooLong')
            });
        }

        if (password.length < PASSWORD_MIN_LENGTH) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.passwordTooShort')
            });
        }
        if (password.length > PASSWORD_MAX_LENGTH) {
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
                password: passwordHash,
                RoleId: userRole.id
            });

            await updateSession(req, user);

            res.send({
                success: true,
            });
        } catch (e) {
            return handleUsernameError(req, res, e);
        }
    },
    loginUser: async (req, res) => {
        if (!req.body) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

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

            await updateSession(req, user);

            return res.send({
                success: true,
            });
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                success: false,
                message: req.t('errors.internalServerError')
            });
        }
    },
    changePassword: async (req, res) => {
        if (!req.body) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        const { currentPassword, newPassword, repeatNewPassword } = req.body;

        if (!currentPassword) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.currentPasswordRequired')
            });
        }
        if (!newPassword) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.newPasswordRequired')
            });
        }
        if (newPassword !== repeatNewPassword) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.samePasswords')
            });
        }
        if (newPassword.length < PASSWORD_MIN_LENGTH) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.passwordTooShort')
            });
        }
        if (newPassword.length > PASSWORD_MAX_LENGTH) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.passwordTooLong')
            });
        }

        try {
            const user = await sequelize.models.User.findByPk(req.session.user.id);
    
            const correctPassword = await bcrypt.compare(currentPassword, user.password);

            if (!correctPassword) {
                return res.status(400).send({
                    success: false,
                    message: req.t('errors.incorrectPassword')
                });
            }

            const passwordHash = await bcrypt.hash(newPassword, parseInt(process.env.SALT_ROUNDS));
            user.password = passwordHash;
            await user.save();

            return res.send({
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