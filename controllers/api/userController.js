import FormData from 'form-data';

import sequelize from '../../models/index.js';
import { uploadFile, deleteFile } from '../../utils/imageKitApi.js';

export default {
    getUsers: async (req, res) => {
        let { limit, offset } = req.query;

        limit = parseInt(limit);
        offset = parseInt(offset);

        if (!limit) {
            limit = 10;
        }
        if (!offset) {
            offset = 0;
        }

        const users = await sequelize.models.User.findAll({
            limit: limit,
            offset: offset
        });

        let results = [];

        for (const user of users) {
            const userRole = await user.getRole();

            results.push({
                id: user.id,
                username: user.username,
                avatarUrl: user.avatarUrl,
                createdAt: user.createdAt,
                role: userRole.name
            });
        }

        return res.send(results);
    },
    updateUser: async (req, res) => {

    },
    updateAvatar: async (req, res) => {
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        try {
            let userId = req.params.id;

            if (userId === '@me') {
                userId = req.session.user.id;
            }

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

            if (req.session.user.id === user.id) {
                req.session.user.avatarUrl = data.url;
            }

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
    }
}