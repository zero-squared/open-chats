import express from 'express';

import mainController from '../controllers/mainController.js';
import apiRouter from './apiRoutes.js';
import { isAuthenticatedUser, isGuest } from '../middleware/user.js';

const router = express.Router();

router.get('/', mainController.showHome);
router.get('/login', isGuest, mainController.showLogin);
router.get('/register', isGuest, mainController.showRegister);
router.get('/logout', mainController.logoutUser);
router.get('/profile', isAuthenticatedUser, mainController.showProfile);

router.use('/api', apiRouter);

router.use(mainController.showNotFound);

export default router;