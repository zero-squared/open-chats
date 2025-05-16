export function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    if (req.path.startsWith('/api')) {
        return res.status(401).send({
            success: false,
            message: 'Unauthorized'
        });
    }
    return res.redirect('/');
}