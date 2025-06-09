import FormData from 'form-data';

import sequelize from '../../models/index.js';
import { uploadFile, deleteFile } from '../../utils/imageKitApi.js';
import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, DEFAULT_AVATAR } from '../../utils/config.js';


export default {
    getUsers: async (req, res) => {
        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if (!limit) {
            limit = 10;
        }
        if (!offset) {
            offset = 0;
        }

        try {
            const users = await sequelize.models.User.findAll({
                limit: limit,
                offset: offset
            });

            let result = [];

            for (const user of users) {
                const userRole = await user.getRole();

                result.push({
                    id: user.id,
                    username: user.username,
                    avatarUrl: user.avatarUrl || DEFAULT_AVATAR,
                    createdAt: user.createdAt,
                    role: userRole.name
                });
            }

            return res.send({
                success: true,
                users: result
            });
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                success: false,
                message: req.t('errors.internalServerError')
            });
        }
    },
    updateUser: async (req, res) => {
        if (!req.body) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        let userId = req.params.id;

        if (userId === '@me') {
            userId = req.session.user.id;
        }

        const { username } = req.body;

        if (!username) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.usernameRequired')
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

        try {
            const user = await sequelize.models.User.findByPk(userId);

            user.username = username;
            await user.save();

            return res.send({
                success: true,
                username: username
            });
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                success: false,
                message: req.t('errors.internalServerError')
            });
        }
    },
    updateAvatar: async (req, res) => {
        let userId = req.params.id;

        if (userId === '@me') {
            userId = req.session.user.id;
        }

        try {
            const user = await sequelize.models.User.findByPk(userId);

            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: req.t('errors.notFound')
                });
            }

            if (user.avatarUrl) {
                await deleteFile(user.avatarFileId);
            }

            const avatarFileName = `${user.username}_avatar`;

            const formData = new FormData();
            formData.append('file', req.file.buffer, avatarFileName);
            formData.append('fileName', avatarFileName);
            formData.append('folder', '/avatars/');
            formData.append('publicKey', process.env.IK_PUBLIC_KEY);

            const { data } = await uploadFile(formData);

            user.avatarUrl = data.url;
            user.avatarFileId = data.fileId;

            await user.save();

            return res.send({
                success: true,
                avatarUrl: data.url
            });
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                success: false,
                message: req.t('errors.internalServerError')
            });
        }
    },
    deleteAvatar: async (req, res) => {
        let userId = req.params.id;

        if (userId === '@me') {
            userId = req.session.user.id;
        }

        try {
            const user = await sequelize.models.User.findByPk(userId);

            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: req.t('errors.notFound')
                });
            }

            if (user.avatarUrl) {
                await deleteFile(user.avatarFileId);

                user.avatarUrl = null;
                user.avatarFileId = null;
                await user.save();
            }

            return res.send({
                success: true,
                avatarUrl: DEFAULT_AVATAR
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