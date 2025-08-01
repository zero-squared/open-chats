import express from 'express';

import mainController from '../controllers/mainController.js';
import adminController from '../controllers/adminController.js';
import chatViewController from '../controllers/chatViewController.js';
import apiRouter from './apiRoutes.js';
import { isGuest, isAuthenticated, isAdmin } from '../middleware/user.js';
import { updateSessionMiddleware } from '../middleware/session.js';
import { setLocals } from '../middleware/locals.js';

const router = express.Router();

router.use(updateSessionMiddleware);
router.use(setLocals);

router.get('/', mainController.showHome);

router.get('/login', isGuest, mainController.showLogin);
router.get('/register', isGuest, mainController.showRegister);

router.get('/logout', mainController.logoutUser);
router.get('/profile', isAuthenticated, mainController.showProfile);

router.get('/admin', isAdmin, adminController.redirectAdmin);
router.get('/admin/:tab', isAdmin, adminController.showAdmin);

router.get('/chats/', chatViewController.redirectChat);
router.get('/chats/:id', chatViewController.showChat);

router.use('/api', apiRouter);

router.use(mainController.showNotFound);

export default router;