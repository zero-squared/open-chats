import express from 'express';

import mainController from '../controllers/mainController.js';
import apiRouter from './apiRoutes.js';
import { isAuthenticated, isGuest } from '../middleware/auth.js';

const router = express.Router();

router.get('/', mainController.showHome);
router.get('/login', isGuest, mainController.showLogin);
router.get('/register', isGuest, mainController.showRegister);
router.get('/logout', mainController.logoutUser);
router.get('/profile', isAuthenticated, mainController.showProfile);

router.use('/api', apiRouter);

router.use(mainController.showNotFound);

export default router;