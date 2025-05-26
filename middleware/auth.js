export function isAuthenticated(req, res, next) {
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