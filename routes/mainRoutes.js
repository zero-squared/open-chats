import express from 'express';
import upload from '../upload.js';

import mainController from '../controllers/mainController.js';
import apiRouter from './apiRoutes.js';

const router = express.Router();

router.get('/', mainController.showHome);
router.get('/login', mainController.showLogin);
router.get('/register', mainController.showRegister);
router.get('/logout', mainController.logoutUser);
router.get('/profile', mainController.showProfile);
router.post('/upload', upload.single('image'), mainController.updateAvatar);

router.use('/api', apiRouter);

export default router;