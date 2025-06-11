import { UniqueConstraintError, ValidationError } from 'sequelize';

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