import sequelize from '../../models/index.js';
import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH } from '../../utils/config.js';

export default {
    changeLabel: async (req, res) => {
        if (!req.body) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        let userId = req.params.id;

        if (userId === '@me' || userId === req.session.user.id) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        const { text } = req.body;

        // TODO Change errors

        if (text === '') {
            const user = await sequelize.models.User.findByPk(userId);
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: req.t('errors.notFound')
                });
            }

            let label = await sequelize.models.Label.findOne({
                where: {
                    targetUserId: userId,
                    authorUserId: req.session.user.id
                },
            });

            if (!label) {
                return res.status(404).send({
                    success: false,
                    message: req.t('errors.notFound')
                });
            }

            await label.destroy();
            return res.send({
                success: true,
                text: ''
            });
        }

        if (!text) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        if (text.length < USERNAME_MIN_LENGTH) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }
        if (text.length > USERNAME_MAX_LENGTH) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.badRequest')
            });
        }

        try {
            const user = await sequelize.models.User.findByPk(userId);
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: req.t('errors.notFound')
                });
            }

            let label = await sequelize.models.Label.findOne({
                where: {
                    targetUserId: userId,
                    authorUserId: req.session.user.id
                },
            });

            if (!label) {
                label = await sequelize.models.Label.create({
                    text: text,
                    targetUserId: userId,
                    authorUserId: req.session.user.id
                });
            } else {
                label.text = text;
                await label.save();
            }

            return res.send({
                success: true,
                text: label.text
            });
        } catch (e) {
            console.error(e)

            return res.status(500).send({
                success: false,
                message: req.t('errors.internalServerError')
            });
        }
    }
}