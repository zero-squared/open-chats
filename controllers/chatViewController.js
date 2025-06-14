import sequelize from "../models/index.js";

export default {
    showChat: async (req, res, next) => {
        const chatId = Number(req.params.id);

        if (!chatId || !Number.isInteger(chatId)) {
            return next();
        }

        const chat = await sequelize.models.Chat.findByPk(chatId);
        if (!chat) {
            return next();
        }

        req.session.lastChatId = chat.id;

        return res.render('chats', { chat: {
            id: chat.id,
            name: chat.name
        }});
    },
    redirectChat: async (req, res) => {
        if (req.session.lastChatId) {
            const chat = await sequelize.models.Chat.findByPk(req.session.lastChatId);
            if (chat) {
                return res.redirect(`/chats/${req.session.lastChatId}`);
            }
            delete req.session.lastChatId;
        }
        const chat = await sequelize.models.Chat.findOne({
            order: [['id', 'ASC']] // TODO: add a way to order chats and use it here
        });

        if (!chat) {
            return res.render('error', { title: req.t('noChats.title'), message: req.t('noChats.message'), image: '/img/astolfoNoChats.gif' });
        }

        return res.redirect(`/chats/${chat.id}`);
    }
}