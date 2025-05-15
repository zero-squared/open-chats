import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

import sequelize from '../models/index.js';

export default {
    showHome: async (req, res) => {
        res.render('home', { username: req.session.username, avatarUrl: req.session.avatarUrl });
    },
    showLogin: async (req, res) => {
        // TODO Redirect
        res.render('login', { username: req.session.username });
    },
    showRegister: async (req, res) => {
        // TODO Redirect
        res.render('register', { username: req.session.username });
    },
    showProfile: async (req, res) => {
        if (!req.session.username) {
            res.redirect('/');
            return;
        }
        res.render('profile', { username: req.session.username, avatarUrl: req.session.avatarUrl });
    },
    logoutUser: async (req, res) => {
        req.session.destroy();
        res.redirect('/');
    },
    updateAvatar: async (req, res) => {
        if (!req.session.username) {
            res.status(400).send({
                success: false,
            });
            return;
        }

        if (!req.file) {
            res.status(400).send({
                success: false,
            });
        }

        try {
            const formData = new FormData();
            formData.append('file', fs.createReadStream(req.file.path));
            formData.append('fileName', req.file.filename);
            formData.append('publicKey', process.env.IK_PUBLIC_KEY);

            const { data } = await axios.request({
                method: 'POST',
                url: 'https://upload.imagekit.io/api/v1/files/upload',
                headers: {
                    'Content-Type': 'multipart/form-data;',
                    Accept: 'application/json',
                    Authorization: `Basic ${process.env.IK_ACCESS_TOKEN}`
                },
                data: formData
            });
            
            await sequelize.models.User.update({
                avatarUrl: data.url
            }, {
                where: {
                    username: req.session.username
                }
            })
            req.session.avatarUrl = data.url;

            res.redirect('/profile');
        } catch (e) {
            console.error(e);

            res.status(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}