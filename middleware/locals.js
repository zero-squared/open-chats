export async function setLocals(req, res, next) {
    res.locals.currentPath = req.path;
    res.locals.user = req.session.user;
    next();
}