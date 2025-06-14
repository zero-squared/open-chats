import sequelize from '../models/index.js';
import { UniqueConstraintError, ValidationError } from 'sequelize';

import { DEFAULT_AVATAR } from './config.js';

export async function getUserDataObj(user) {
    const role = await user.getRole();

    return {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl || DEFAULT_AVATAR,
        createdAt: user.createdAt,
        role: role.name
    }
}

export function handleUsernameError(req, res, e) {
    if (e instanceof UniqueConstraintError) {
        return res.status(400).send({
            success: false,
            message: req.t('errors.uniqueUsername')
        });
    }

    if (e instanceof ValidationError) {
        return res.status(400).send({
            success: false,
            message: req.t(e.errors[0].message)
        });
    }

    console.error(e);

    return res.status(500).send({
        success: false,
        message: req.t('errors.internalServerError')
    });
}

export async function canEditMessage(userId, messageId) {
    const message = await sequelize.models.Message.findByPk(messageId);
    const user = await sequelize.models.User.findByPk(userId, {
        include: 'Role'
    });

    if (!message || !user || user.Role.name === 'blocked') return false;

    return message.UserId === user.id;
}

/*
Who can delete whose messages:
- user: own
- moderator: everyone's except admins'
- admin: everyone's

if the user or the message does not exist, returns false
*/
export async function canDeleteMessage(userId, messageId) {
    const message = await sequelize.models.Message.findByPk(messageId);
    const user = await sequelize.models.User.findByPk(userId);

    if (!message || !user)
        return false;

    try {
        const sender = await message.getUser();

        const userRole = await user.getRole();
        const senderRole = await sender.getRole();

        if (userRole.name === 'user' && userRole.name === 'blocked') {
            return user.id === sender.id;
        } 
        else if (userRole.name === 'moderator') {
            return senderRole.name !== 'admin';
        }
        else if (userRole.name === 'admin') {
            return true;
        }

        console.error(`Unknown role!: ${userRole.name}`);
        return false;
    }
    catch (e) {
        console.error("Exception should not have been thrown here! Exception: ", e);
        return false;
    }
}