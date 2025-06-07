import sequelize from '../../models/index.js';

import { GET_MESSAGES_LIMIT_DEFAULT, GET_MESSAGES_LIMIT_MAX, GET_MESSAGES_OFFSET_DEFAULT } from '../../utils/config.js'

export default {
    getChats: async (req, res) => {
        const chats = await sequelize.models.Chat.findAll();

        let results = [];

        for (const chat of chats) {
            results.push({
                id: chat.id,
                name: chat.name
            });
        }

        return res.send(results);
    },
    getMessages: async (req, res) => {
        let { limit, offset } = req.query;

        limit = parseInt(limit);
        offset = parseInt(offset);

        // validation
        if (limit <= 0 || limit > GET_MESSAGES_LIMIT_MAX || offset < 0) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        // default values
        if (!limit) {
            limit = GET_MESSAGES_LIMIT_DEFAULT;
        }

        if (!offset) {
            offset = GET_MESSAGES_OFFSET_DEFAULT;
        }

        const chat = await sequelize.models.Chat.findByPk(req.params.id);

        if (!chat) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.chatNotExist')
            });
        }

        const messages = await chat.getMessages({
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        let result = [];

        for (const msg of messages) {
            const user = await sequelize.models.User.findByPk(msg.UserId);

            result.push({
                id: msg.id,
                createdAt: msg.createdAt,
                updatedAt: msg.updatedAt,
                text: msg.text,
                user: {
                    id: user.id,
                    username: user.username,
                    avatarUrl: user.avatarUrl
                }
            });
        }

        return res.send(result);
    }
}