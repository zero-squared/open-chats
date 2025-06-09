import sequelize from '../../models/index.js';

import { DEFAULT_AVATAR, GET_MESSAGES_LIMIT_DEFAULT, GET_MESSAGES_LIMIT_MAX, GET_MESSAGES_OFFSET_DEFAULT } from '../../utils/config.js'

export default {
    getChats: async (req, res) => {
        try {
            const chats = await sequelize.models.Chat.findAll({
                order: [['id', 'ASC']] // TODO: add a way to order chats and use it here (or sort on frontend?)
            });
    
            let result = [];
    
            for (const chat of chats) {
                result.push({
                    id: chat.id,
                    name: chat.name
                });
            }
    
            // TODO Return success
            return res.send(result);
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                success: false,
                message: req.t('errors.internalServerError')
            });
        }
    },
    getMessages: async (req, res) => {
        let { limit, offset } = req.query;

        limit = parseInt(limit);
        offset = parseInt(offset);
        const chatId = parseInt(req.params.id);

        // default values
        if (!limit) {
            limit = GET_MESSAGES_LIMIT_DEFAULT;
        }

        if (!offset) {
            offset = GET_MESSAGES_OFFSET_DEFAULT;
        }

        // data type and limit validation
        if (
            !Number.isInteger(limit) || !Number.isInteger(offset) || !Number.isInteger(chatId)
            || limit <= 0 || limit > GET_MESSAGES_LIMIT_MAX || offset < 0
        ) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        try {
            const chat = await sequelize.models.Chat.findByPk(chatId);
    
            if (!chat) {
                return res.status(400).send({
                    success: false,
                    message: req.t('errors.chatNotExist')
                });
            }
    
            const messages = await chat.getMessages({
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']] // newest first
            });
    
            let result = [];
    
            for (const msg of messages) {
                const user = await sequelize.models.User.findByPk(msg.UserId);
    
                result.push({
                    id: msg.id,
                    createdAt: msg.createdAt,
                    updatedAt: msg.updatedAt,
                    text: msg.text,
                    sender: {
                        id: user.id,
                        username: user.username,
                        avatarUrl: user.avatarUrl || DEFAULT_AVATAR
                    }
                });
            }

            // TODO Return success
            return res.send(result);
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                success: false,
                message: req.t('errors.internalServerError')
            });
        }
    }
}