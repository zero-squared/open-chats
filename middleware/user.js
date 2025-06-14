import sequelize from '../models/index.js';
import { canDeleteMessage, canEditMessage } from '../utils/users.js';

function disallow(req, res) {
    if (req.baseUrl === '/api') {
        return res.status(401).send({
            success: false,
            message: req.t('errors.unauthorized')
        });
    }
    return res.redirect('/');
}


export function isGuest(req, res, next) {
    if (!req.session.user) {
        return next();
    }

    return disallow(req, res);
}

export function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }

    return disallow(req, res);
}

export function isNotBlocked(req, res, next) {
    if (req.session.user && req.session.user.role !== 'blocked') {
        return next();
    }

    return disallow(req, res);
}

export function isUser(req, res, next) {
    if (req.session.user && req.session.user.role === 'user') {
        return next();
    }

    return disallow(req, res);
}

export function isModerator(req, res, next) {
    if (req.session.user && req.session.user.role === 'moderator') {
        return next();
    }

    return disallow(req, res);
}

export function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }

    return disallow(req, res);
}

// :id param - user id
export async function canUpdateUser(req, res, next) {
    if (!req.session.user) {
        return res.status(401).send({
            success: false,
            message: req.t('errors.unauthorized')
        });
    }

    const userId = req.params.id;

    if (userId === '@me') {
        return next();
    }

    try {
        const user = await sequelize.models.User.findByPk(userId);

        if ((!user || user.id !== req.session.user.id) && req.session.user.role !== 'admin') {
            return res.status(401).send({
                success: false,
                message: req.t('errors.unauthorized')
            });
        }

        return next();
    } catch (e) {
        console.error(e);

        res.status(500).send({
            success: false,
            message: req.t('errors.internalServerError')
        });
    }
}

export async function canDeleteMessageMw(req, res, next) {
    if (!req.session.user) {
        return res.status(401).send({
            success: false,
            message: req.t('errors.unauthorized')
        });
    }

    const messageId = Number(req.params.id);

    if (!messageId) {
        return res.status(401).send({
            success: false,
            message: req.t('errors.badRequest')
        });
    }

    // TODO: maybe check that the message exists
    // (not necessary, now it just sends "unauthorized")

    if (!(await canDeleteMessage(req.session.user.id, messageId))) {
        return res.status(401).send({
            success: false,
            message: req.t('errors.unauthorized')
        });
    }

    return next();
}

export async function canEditMessageMw(req, res, next) {
    if (!req.session.user) {
        return res.status(401).send({
            success: false,
            message: req.t('errors.unauthorized')
        });
    }

    const messageId = Number(req.params.id);

    if (!messageId) {
        return res.status(401).send({
            success: false,
            message: req.t('errors.badRequest')
        });
    }

    if (!(await canEditMessage(req.session.user.id, messageId))) {
        return res.status(401).send({
            success: false,
            message: req.t('errors.unauthorized')
        });
    }

    return next();
}
