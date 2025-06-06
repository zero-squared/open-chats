import express from 'express';

import mainController from '../controllers/mainController.js';
import adminController from '../controllers/adminController.js';
import apiRouter from './apiRoutes.js';
import { isGuest, isAuthenticated, isAdmin } from '../middleware/user.js';

const router = express.Router();

router.get('/', mainController.showHome);

router.get('/login', isGuest, mainController.showLogin);
router.get('/register', isGuest, mainController.showRegister);

router.get('/logout', mainController.logoutUser);
router.get('/profile', isAuthenticated, mainController.showProfile);

router.get('/admin', isAdmin, adminController.redirectMainAdmin);
router.get('/admin/:tab', isAdmin, adminController.showAdmin);

router.use('/api', apiRouter);

router.use(mainController.showNotFound);

export default router;