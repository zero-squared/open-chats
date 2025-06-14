import sequelize from '../../models/index.js';

export default {
    getChats: async (req, res) => {
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
            const chats = await sequelize.models.Chat.findAll({
                limit: limit,
                offset: offset,
                order: [['id', 'ASC']] // TODO: add a way to order chats and use it here (or sort on frontend?)
            });

            let result = [];

            for (const chat of chats) {
                result.push({
                    id: chat.id,
                    name: chat.name,
                    createdAt: chat.createdAt
                });
            }

            return res.send({
                success: true,
                chats: result
            });
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                success: false,
                message: req.t('errors.internalServerError')
            });
        }
    },
    createChat: async (req, res) => {
        if (!req.body) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        const { name } = req.body;

        // TODO Validate using sequelize
        if (!name) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        try {
            const chat = await sequelize.models.Chat.create({
                name: name
            });

            // TODO Create unified way to convert db to data obj
            return res.send({
                success: true,
                chat: {
                    id: chat.id,
                    name: chat.name,
                    createdAt: chat.createdAt
                }
            });
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                success: false,
                message: req.t('errors.internalServerError')
            });
        }
    },
    updateChat: async (req, res) => {
        if (!req.body) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        let chatId = Number(req.params.id);

        if (!chatId) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        const { name } = req.body;

        if (!name) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        try {
            const chat = await sequelize.models.Chat.findByPk(chatId);

            if (!chat) {
                return res.status(404).send({
                    success: false,
                    message: req.t('errors.notFound')
                });
            }

            chat.name = name;
            await chat.save();

            return res.send({
                success: true,
                name: name
            });
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                success: false,
                message: req.t('errors.internalServerError')
            });
        }
    },
    deleteChat: async (req, res) => {
        let chatId = Number(req.params.id);

        if (!chatId) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        try {
            const chat = await sequelize.models.Chat.findByPk(chatId);

            if (!chat) {
                return res.status(404).send({
                    success: false,
                    message: req.t('errors.notFound')
                });
            }

            await chat.destroy();

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