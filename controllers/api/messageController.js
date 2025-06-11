import sequelize from "../../models/index.js";
import { getIO } from "../../sockets/index.js";
import { MESSAGE_MAX_LENGTH } from "../../utils/config.js";
import { getMsgDataObj } from "../../utils/messages.js";

// TODO: handle invalid messages empty (if leading/trailing whitespace is removed), clean leading/trailing whitespace

export default {
    sendMessage: async (req, res) => {
        const chatId = Number(req.params.id);
        const { text } = req.body;

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

            getIO().to(chatId).emit('new_msg', {chatId: chatId, msgData: await getMsgDataObj(message.id)});
    
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
    }
}