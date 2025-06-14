import sequelize from '../models/index.js';
import { DEFAULT_AVATAR } from './config.js';
import { canDeleteMessage } from './users.js';

// TODO Use existing function for sender
export async function getMsgDataObj(messageId, userId) {
    const message = await sequelize.models.Message.findByPk(messageId);
    const sender = await sequelize.models.User.findByPk(message.UserId, {
        include: 'Role'
    });

    let canDelete = false;
    let label;

    if (userId) {
        const user = await sequelize.models.User.findByPk(userId);
        if (user) {
            canDelete = await canDeleteMessage(userId, messageId);
        }

        label = await sequelize.models.Label.findOne({
            where: {
                targetUserId: sender.id,
                authorUserId: userId
            },
        });
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
            username: sender.username,
            role: sender.Role.name,
            label: label?.text || '',
            avatarUrl: sender.avatarUrl || DEFAULT_AVATAR
        }
    };
}