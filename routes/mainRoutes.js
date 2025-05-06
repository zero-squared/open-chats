import express from 'express';

import mainController from '../controllers/mainController.js';
import apiRouter from './apiRoutes.js';

const router = express.Router();

router.get('/', mainController.showHome);
router.get('/login', mainController.showLogin);
router.get('/register', mainController.showRegister);

router.use('/api', apiRouter);

export default router;