import sequelize from '../models/index.js';

export function isAuthenticatedUser(req, res, next) {
    if (req.session.user) {
        return next();
    }
    if (req.path.startsWith('/api')) {
        return res.status(400).send({
            success: false,
            message: 'Bad Request'
        });
    }
    return res.redirect('/');
}

export function isGuest(req, res, next) {
    if (!req.session.user) {
        return next();
    }
    if (req.path.startsWith('/api')) {
        return res.status(400).send({
            success: false,
            message: 'Bad Request'
        });
    }
    return res.redirect('/');
}

// :id param - user id
export async function canUpdateUser(req, res, next) {
    if (!req.session.user) {
        return res.status(401).send({
            success: false,
            message: 'Unauthorized'
        });
    }

    const userId = req.params.id;

    if (userId === '@me') {
        return next();
    }

    try {
        const user = await sequelize.models.User.findByPk(userId);

        if (!user || user.id !== req.session.user.id) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized'
            });
        }

        return next();
    } catch (e) {
        console.error(e);

        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
}