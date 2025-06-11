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