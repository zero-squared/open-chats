import sequelize from "../models/index.js";
import chatApiController from "./api/chatApiController.js";

export default{
    showChat: async (req, res, next) => {
        let ok = true;

        const chatId = parseInt(req.params.id);
        if (!chatId || !Number.isInteger(chatId)) 
            return next(); // TODO: maybe another error

        const chat = await sequelize.models.Chat.findByPk(chatId);
        if (!chat)
            return next();
        
        return res.render('chats', { user: req.session.user, chatId: chatId, chatName: chat.name });
    },
    showChatNoChatSelected: async (req, res) => {
        return res.render('chats', { user: req.session.user, chatId: null });
    }
}