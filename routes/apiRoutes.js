import express from 'express';
import authController from '../controllers/api/authController.js';
import upload from '../middleware/multerUpload.js'
import { isAuthenticated, isGuest } from '../middleware/auth.js';
import userController from '../controllers/api/userController.js';

const router = express.Router();

router.post(`/users/:id/avatar`, isAuthenticated, upload.single('image'), userController.updateAvatar);
router.post('/auth/login', isGuest, authController.loginUser);
router.post('/auth/register', isGuest, authController.registerUser);

export default router;