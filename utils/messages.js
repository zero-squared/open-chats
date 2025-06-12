import sequelize from '../models/index.js';
import { DEFAULT_AVATAR } from './config.js';

// TODO Use existing function for sender
export async function getMsgDataObj(messageId, userId) {
    const message = await sequelize.models.Message.findByPk(messageId);
    const sender = await sequelize.models.User.findByPk(message.UserId);

    let canDelete = false;
    let username = sender.username;

    if (userId) {
        const user = await sequelize.models.User.findByPk(userId);
        if (user) {
            const role = await user.getRole();
            canDelete = user.id === sender.id || role.name === 'admin';
        }

        const label = await sequelize.models.Label.findOne({
            where: {
                targetUserId: sender.id,
                authorUserId: userId
            },
        });

        if (label) {
            username = label.text;
        }
    }

    return {
        id: message.id,
        chatId: message.ChatId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        text: message.text,
        canDelete: canDelete,
        sender: {
            id: sender.id,
            username: username,
            avatarUrl: sender.avatarUrl || DEFAULT_AVATAR
        }
    };
}