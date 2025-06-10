import sequelize from '../models/index.js';
import { DEFAULT_AVATAR } from './config.js';

export async function getMsgDataObj(messageId) {
    const message = await sequelize.models.Message.findByPk(messageId);
    const user = await sequelize.models.User.findByPk(message.UserId);

    return {
        id: message.id,
        chatId: message.ChatId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        text: message.text,
        sender: {
            id: user.id,
            username: user.username,
            avatarUrl: user.avatarUrl || DEFAULT_AVATAR
        }
    };
}