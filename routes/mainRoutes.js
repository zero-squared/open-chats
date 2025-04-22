import express from 'express';
import { getHome } from '../controllers/homeController.js';
import { sendMessage } from '../sockets.js';

const mainRouter = express.Router();

mainRouter.get('/', getHome);

mainRouter.post('/auth', (req, res) => {
    req.session.username = req.body.username;
    res.redirect('/chat');
});

mainRouter.get('/chat', (req, res) => {
    if (!req.session.username) return res.redirect('/');

    res.render('chat', {
        username: req.session.username
    });
});

mainRouter.post('/message', (req, res) => {
    console.log(req.body);
    sendMessage(req.session.username, req.body.message);
    res.sendStatus(200);
});

mainRouter.use((req, res) => {
    return res.status(404).send('Not Found');
});

export default mainRouter;