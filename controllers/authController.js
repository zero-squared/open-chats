import sequelize from '../models/index.js';

export default {
    registerUser: async (req, res) => {
        const { password, username } = req.body;

        if (!username) {
            res.status(400).send({
                success: false,
                error: 'Username is required'
            });
            return;
        }
        if (!password) {
            res.status(400).send({
                success: false,
                error: 'Password is required'
            });
            return;
        }

        if (username.length < 5) {
            res.status(400).send({
                success: false,
                error: 'Username must be at least 5 characters long'
            });
            return;
        }
        if (username.length > 30) {
            res.status(400).send({
                success: false,
                error: 'Username cannot be longer than 30 characters'
            });
            return;
        }

        if (password.length < 5) {
            res.status(400).send({
                success: false,
                error: 'Password must be at least 5 characters long'
            });
            return;
        }
        if (password.length > 50) {
            res.status(400).send({
                success: false,
                error: 'Password cannot be longer than 50 characters'
            });
            return;
        }

        try {
            const user = await sequelize.models.User.create({
                username: username,
                password: password
            });
            req.session.username = user.username;
        } catch (e) {
            if (e.message === 'Validation error') {
                const error = e.errors[0].message.charAt(0).toUpperCase() + e.errors[0].message.slice(1);

                res.status(400).send({
                    success: false,
                    error
                });
            } else {
                console.error(e);

                res.status(500).send({
                    success: false,
                    error: 'Internal server error'
                });
            }

            return;
        }

        res.send({
            success: true,
        });
    },
    loginUser: async (req, res) => {
        req.session.username = req.body.username;
        res.redirect('/channels');
    }
}