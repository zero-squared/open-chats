import sequelize from "../../models/index.js";
import { getIO } from "../../sockets/index.js";
import { MESSAGE_MAX_LENGTH } from "../../utils/config.js";
import { getMsgDataObj } from "../../utils/messages.js";
import { GET_MESSAGES_LIMIT_DEFAULT, GET_MESSAGES_LIMIT_MAX, GET_MESSAGES_OFFSET_DEFAULT } from '../../utils/config.js'

export default {
    sendMessage: async (req, res) => {
        const chatId = Number(req.params.id);
        let { text } = req.body;

        text = text.trim();

        // data type and limit validation
        if (!Number.isInteger(chatId) || text.length <= 0 || text.length > MESSAGE_MAX_LENGTH) {
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
    
            const message = await sequelize.models.Message.create({
                UserId: req.session.user.id,
                ChatId: chatId,
                text: text
            });

            getIO().to(chatId).emit('new_msg', {msgData: await getMsgDataObj(message.id, req.session?.user?.id)});
    
            return res.send({
                success: true,
            });
        } catch (e) {
            console.error(e)

            return res.status(500).send({
                success: false,
                message: req.t('errors.internalServerError')
            });
        }
    },
    getMessages: async (req, res) => {
        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);
        const chatId = Number(req.params.id);

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
                result.push(await getMsgDataObj(msg.id, req.session?.user?.id));
            }

            return res.send({
                success: true,
                messages: result
            });
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                success: false,
                message: req.t('errors.internalServerError')
            });
        }
    },
    deleteMessage: async (req, res) => {
        const chatId = Number(req.params.chatId);

        const messageId = Number(req.params.id);

        try {
            const message = await sequelize.models.Message.findByPk(messageId);

            if (!message || message.ChatId !== chatId) {
                return res.status(404).send({
                    success: false,
                    message: req.t('errors.notFound')
                });
            } 

            await message.destroy();

            getIO().to(chatId).emit('delete_msg', {msgId: messageId});

            return res.send({
                success: true
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