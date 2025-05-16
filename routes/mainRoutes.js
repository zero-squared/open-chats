import express from 'express';

import mainController from '../controllers/mainController.js';
import apiRouter from './apiRoutes.js';
import upload from '../middleware/multerUpload.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/', mainController.showHome);
router.get('/login', mainController.showLogin);
router.get('/register', mainController.showRegister);
router.get('/logout', mainController.logoutUser);
router.get('/profile', isAuthenticated, mainController.showProfile);
router.post('/upload', upload.single('image'), mainController.updateAvatar);

router.use('/api', apiRouter);

router.use(mainController.showNotFound);

export default router;