import sequelize from '../models/index.js';
import { DEFAULT_AVATAR } from './config.js';

// TODO Use existing function for sender
export async function getMsgDataObj(messageId, userId) {
    const message = await sequelize.models.Message.findByPk(messageId);
    const sender = await sequelize.models.User.findByPk(message.UserId);
   
    let canDelete = false;
    if (userId) {
        const user = await sequelize.models.User.findByPk(userId);
        if (user) {
            canDelete = user.id === sender.id || await user.getRole() === 'admin'
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
            username: sender.username,
            avatarUrl: sender.avatarUrl || DEFAULT_AVATAR
        }
    };
}