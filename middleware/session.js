import sequelize from '../models/index.js';

export async function updateSessionMiddleware(req, res, next) {
    if (!req.session.user) {
        return next();
    }
    
    try {
        const user = await sequelize.models.User.findByPk(req.session.user.id);
    
        if (!user) {
            req.session.destroy();
            return res.redirect('/');
        }
    
        await updateSession(req, user);
    } catch (e) {
        console.error(e);
    }
    return next();
}